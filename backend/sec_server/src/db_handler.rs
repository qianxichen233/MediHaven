use crate::constants::MAGIC_KEYS;

use odbc_api::{
    Connection,
    ConnectionOptions,
    Cursor,
    Environment,
    IntoParameter,
    parameter::{ Blob, BlobRead },
    buffers::TextRowSet,
    ResultSetMetadata,
};

use chacha20poly1305::{
    aead::{
        Aead,
        AeadCore,
        KeyInit,
        OsRng,
        generic_array::{ GenericArray, typenum::{ UInt, UTerm } },
    },
    consts::{ B0, B1 },
    ChaCha20Poly1305,
};

use anyhow::{ anyhow, Error };
use std::{ collections::HashMap };
use lazy_static::lazy_static;

use std::io;
use sha256::digest;

type KeyType = GenericArray<u8, UInt<UInt<UInt<UInt<UInt<UInt<UTerm, B1>, B0>, B0>, B0>, B0>, B0>>;
type NonceType = GenericArray<u8, UInt<UInt<UInt<UInt<UTerm, B1>, B1>, B0>, B0>>;

lazy_static! {
    static ref MYENV: Environment = Environment::new().unwrap();
}

pub struct DBHandler<'a> {
    // to-do: make this thread safe
    connection: Connection<'a>,
    MAC_Key: KeyType,
}
pub enum DBVALUE {
    StringVal(String),
    IntVal(i32),
    BlobVal(Vec<u8>),
}

unsafe impl Send for DBHandler<'_> {}

unsafe impl Sync for DBHandler<'_> {}

impl Default for DBHandler<'_> {
    fn default() -> Self {
        Self::new().unwrap()
    }
}

impl DBHandler<'_> {
    pub fn new() -> Result<Self, Error> {
        let connection_string =
            "Driver={MariaDB ODBC Driver};Server=localhost;Port=3306;Database=mediheaven;UID=root;PWD=";
        Ok(Self {
            // env: *my_env,
            connection: MYENV.connect_with_connection_string(
                connection_string,
                ConnectionOptions::default()
            )?,
            MAC_Key: GenericArray::default(),
        })
    }

    pub fn init(&mut self, root_key: &KeyType) -> Result<(), Error> {
        let sql = "SELECT ekey, nonce FROM mykeys WHERE key_type='int' LIMIT 1;";

        let cipher = ChaCha20Poly1305::new(&root_key);

        if let Some(mut cursor) = self.connection.execute(&sql, ())? {
            let headline: Vec<String> = cursor.column_names()?.collect::<Result<_, _>>()?;
            println!("{:?}", headline);

            // Use schema in cursor to initialize a text buffer large enough to hold the largest
            // possible strings for each column up to an upper limit of 4KiB.
            let mut buffers = TextRowSet::for_cursor(5000, &mut cursor, Some(4096))?;
            // Bind the buffer to the cursor. It is now being filled with every call to fetch.
            let mut row_set_cursor = cursor.bind_buffer(&mut buffers)?;

            // Iterate over batches
            while let Some(batch) = row_set_cursor.fetch()? {
                // Within a batch, iterate over every row
                for row_index in 0..batch.num_rows() {
                    // Within a row iterate over every column
                    let record: Vec<&[u8]> = (0..batch.num_cols())
                        .map(|col_index| { batch.at(col_index, row_index).unwrap_or(&[]) })
                        .collect();

                    let mut nonce: NonceType = GenericArray::default();
                    nonce.copy_from_slice(&record[1][..]);
                    let key_vec = cipher
                        .decrypt(&nonce, record[0].as_ref())
                        .expect("decrypt key error")
                        .to_vec();

                    println!("int key: {:?}", key_vec);
                    self.MAC_Key.copy_from_slice(&key_vec[..]);
                }
            }
        }

        Ok(())
    }

    fn execute_query(
        &self,
        sql: &str,
        params: impl odbc_api::ParameterCollectionRef
    ) -> Result<HashMap<String, Vec<u8>>, Error> {
        let mut result: HashMap<String, Vec<u8>> = HashMap::new();

        if let Some(mut cursor) = self.connection.execute(&sql, params)? {
            let headline: Vec<String> = cursor.column_names()?.collect::<Result<_, _>>()?;

            let mut buffers = TextRowSet::for_cursor(5000, &mut cursor, Some(4096))?;
            let mut row_set_cursor = cursor.bind_buffer(&mut buffers)?;
            while let Some(batch) = row_set_cursor.fetch()? {
                for row_index in 0..batch.num_rows() {
                    let record: Vec<&[u8]> = (0..batch.num_cols())
                        .map(|col_index| { batch.at(col_index, row_index).unwrap_or(&[]) })
                        .collect();

                    for (index, val) in headline.iter().enumerate() {
                        result.insert(val.clone(), record[index].to_vec());
                    }
                }
            }
        }

        return Ok(result);
    }

    fn generate_magic(
        &self,
        keys: &Vec<&str>,
        fields: &HashMap<&str, &str>
    ) -> Result<impl Blob, chacha20poly1305::Error> {
        let mut plaintext = String::new();
        for key in keys {
            plaintext += fields[key];
        }
        let hash = digest(plaintext).into_bytes();

        let cipher = ChaCha20Poly1305::new(&self.MAC_Key);
        let nonce = ChaCha20Poly1305::generate_nonce(&mut OsRng); // 96-bits; unique per message
        let ciphertext = cipher.encrypt(&nonce, hash.as_slice())?;

        let mut magic = nonce.to_vec();
        magic.extend(&ciphertext);

        let cursor = std::io::Cursor::new(magic);
        let buf = io::BufReader::new(cursor);
        let blob = BlobRead::with_upper_bound(buf, 1000);

        return Ok(blob);
    }

    fn verify_magic(
        &self,
        keys: &Vec<&str>,
        fields: &HashMap<String, Vec<u8>>
    ) -> Result<bool, chacha20poly1305::Error> {
        let mut plaintext = String::new();
        for &key in keys {
            match &String::from_utf8(fields[key].clone()) {
                Ok(value) => {
                    plaintext += value;
                }
                Err(_) => {
                    return Ok(false);
                }
            }
        }

        let hash = digest(plaintext).into_bytes();
        let cipher = ChaCha20Poly1305::new(&self.MAC_Key);

        let (nonce_vec, ciphertext) = fields["Magic"].split_at(12);
        let mut nonce: NonceType = GenericArray::default();
        nonce.copy_from_slice(&nonce_vec[..]);

        let plaintext = cipher.decrypt(&nonce, ciphertext.as_ref())?;

        if hash != plaintext {
            return Ok(false);
        }

        return Ok(true);
    }

    pub fn store_key(&self, key: &[u8], nonce: &[u8], key_type: &str) -> Result<(), Error> {
        let sql = "INSERT INTO mykeys(key_type, ekey, nonce) VALUES (?, ?, ?)";

        let cursor_key = std::io::Cursor::new(key);
        let key_buf = io::BufReader::new(cursor_key);
        let mut blob_key = BlobRead::with_upper_bound(key_buf, 1000);

        let cursor_nonce = std::io::Cursor::new(nonce);
        let nonce_buf = io::BufReader::new(cursor_nonce);
        let mut blob_nonce = BlobRead::with_upper_bound(nonce_buf, 1000);

        let params = (
            &key_type.into_parameter(),
            &mut blob_key.as_blob_param(),
            &mut blob_nonce.as_blob_param(),
        );

        if let Some(mut cursor) = self.connection.execute(&sql, params)? {
            let mut row = cursor.next_row()?.unwrap();
            let mut buf: Vec<u8> = Vec::new();
            row.get_text(1, &mut buf)?;
            println!("{:?}", String::from_utf8(buf));
        }

        Ok(())
    }

    pub fn register_admin(&self, fields: &HashMap<&str, &str>) -> Result<(), Error> {
        let sql =
            "INSERT INTO Administrator(First_Name, Last_Name, Sex, Age, Date_Of_Birth, Phone_Number, Email, Pub_key, Magic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        let mut magic = self
            .generate_magic(&MAGIC_KEYS["Administrator"], &fields)
            .expect("generate magic failed");

        let params = (
            &fields["First_Name"].into_parameter(),
            &fields["Last_Name"].into_parameter(),
            &fields["Sex"].into_parameter(),
            &fields["Age"].into_parameter(),
            &fields["Date_Of_Birth"].into_parameter(),
            &fields["Phone_Number"].into_parameter(),
            &fields["Email"].into_parameter(),
            &fields["Pub_key"].into_parameter(),
            &mut magic.as_blob_param(),
        );
        println!("in db handler: {:?}", fields);

        if let Some(mut cursor) = self.connection.execute(&sql, params)? {
            println!("success!");
            let mut row = cursor.next_row()?.unwrap();
            let mut buf: Vec<u8> = Vec::new();
            row.get_text(1, &mut buf)?;
            println!("{:?}", String::from_utf8(buf));
        }

        Ok(())
    }

    pub fn get_admin(&self, email: &str) -> Result<HashMap<String, String>, Error> {
        let sql = "SELECT * FROM Administrator WHERE Email = ?";
        let data = self.execute_query(&sql, (&email.into_parameter(),))?;
        let mut result = HashMap::new();

        match self.verify_magic(&MAGIC_KEYS["Administrator"], &data) {
            Ok(val) => {
                if !val {
                    return Err(anyhow!("integrity check failed!"));
                }
            }
            Err(_) => {
                return Err(anyhow!("integrity check failed!"));
            }
        }

        for (key, value) in data {
            if key == "Magic" {
                continue;
            }
            result.insert(key, String::from_utf8(value)?);
        }

        return Ok(result);
    }
}
