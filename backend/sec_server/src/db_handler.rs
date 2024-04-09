use crate::constants::MAGIC_KEYS;
use crate::myutils;
use crate::mytypes::{ codeType, recordType };
use rand::Rng;

use odbc_api::{
    Connection,
    ConnectionOptions,
    Cursor,
    Environment,
    IntoParameter,
    parameter::{ Blob, BlobRead, BlobParam },
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
use std::collections::HashMap;
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
    MAC_key: KeyType,
    ENC_Key: Vec<(u64, KeyType)>,
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
            MAC_key: GenericArray::default(),
            ENC_Key: Vec::new(),
        })
    }

    pub fn init(&mut self, root_key: &KeyType) -> Result<(), Error> {
        let sql = "SELECT ekey, nonce, key_type, Key_ID FROM mykeys;";

        let cipher = ChaCha20Poly1305::new(&root_key);

        if let Some(mut cursor) = self.connection.execute(&sql, ())? {
            let headline: Vec<String> = cursor.column_names()?.collect::<Result<_, _>>()?;
            println!("{:?}", headline);

            // Use schema in cursor to initialize a text buffer large enough to hold the largest
            // possible strings for each column up to an upper limit of 4KiB.
            let mut buffers = TextRowSet::for_cursor(5000, &mut cursor, Some(4096))?;
            // Bind the buffer to the cursor. It is now being filled with every call to fetch.
            let mut row_set_cursor = cursor.bind_buffer(&mut buffers)?;

            let mut found_key = false;

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
                    let key_type = String::from_utf8(record[2].to_vec())?;
                    if key_type == "int" {
                        println!("int key: {:?}", key_vec);
                        self.MAC_key.copy_from_slice(&key_vec[..]);
                        found_key = true;
                    } else {
                        println!("data key: {:?}", key_vec);
                        let mut key: KeyType = GenericArray::default();
                        key.copy_from_slice(&key_vec[..]);
                        self.ENC_Key.push((
                            String::from_utf8(record[3].to_vec())?.parse::<u64>()?,
                            key,
                        ));
                    }
                }
            }

            if !found_key {
                return Err(anyhow!("integrity key not found!"));
            }
        }

        Ok(())
    }

    fn get_enc_key(&self, id: u64) -> Option<&KeyType> {
        for key in &self.ENC_Key {
            if key.0 == id {
                return Some(&key.1);
            }
        }

        return None;
    }

    fn select_one(
        &self,
        sql: &str,
        params: impl odbc_api::ParameterCollectionRef
    ) -> Result<Option<HashMap<String, Vec<u8>>>, Error> {
        let mut result: HashMap<String, Vec<u8>> = HashMap::new();

        if let Some(mut cursor) = self.connection.execute(&sql, params)? {
            let headline: Vec<String> = cursor.column_names()?.collect::<Result<_, _>>()?;

            let mut buffers = TextRowSet::for_cursor(5000, &mut cursor, Some(4096))?;
            let mut row_set_cursor = cursor.bind_buffer(&mut buffers)?;
            let mut found = false;
            while let Some(batch) = row_set_cursor.fetch()? {
                for row_index in 0..batch.num_rows() {
                    let record: Vec<&[u8]> = (0..batch.num_cols())
                        .map(|col_index| { batch.at(col_index, row_index).unwrap_or(&[]) })
                        .collect();

                    for (index, val) in headline.iter().enumerate() {
                        found = true;
                        result.insert(val.clone(), record[index].to_vec());
                    }
                }
            }

            if !found {
                return Ok(None);
            }
        }
        return Ok(Some(result));
    }

    fn select_many(
        &self,
        sql: &str,
        params: impl odbc_api::ParameterCollectionRef
    ) -> Result<Vec<Vec<Vec<u8>>>, Error> {
        let mut result: Vec<Vec<Vec<u8>>> = Vec::new();

        if let Some(mut cursor) = self.connection.execute(&sql, params)? {
            let mut buffers = TextRowSet::for_cursor(5000, &mut cursor, Some(4096))?;
            let mut row_set_cursor = cursor.bind_buffer(&mut buffers)?;

            while let Some(batch) = row_set_cursor.fetch()? {
                for row_index in 0..batch.num_rows() {
                    let record: Vec<&[u8]> = (0..batch.num_cols())
                        .map(|col_index| { batch.at(col_index, row_index).unwrap_or(&[]) })
                        .collect();

                    result.push(Vec::new());
                    let top = result.len() - 1;
                    for item in record.iter() {
                        result[top].push(item.to_vec());
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

        let cipher = ChaCha20Poly1305::new(&self.MAC_key);
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
        let cipher = ChaCha20Poly1305::new(&self.MAC_key);

        let (nonce_vec, ciphertext) = fields["Magic"].split_at(12);
        let mut nonce: NonceType = GenericArray::default();
        nonce.copy_from_slice(&nonce_vec[..]);

        let plaintext = cipher.decrypt(&nonce, ciphertext.as_ref())?;

        if hash != plaintext {
            return Ok(false);
        }

        return Ok(true);
    }

    fn encrypt_column(
        &self,
        data: &str,
        cipher: &ChaCha20Poly1305,
        nonce: &NonceType
    ) -> impl Blob {
        let ciphertext = cipher.encrypt(&nonce, data.as_bytes().to_vec().as_slice()).unwrap();

        let cursor = std::io::Cursor::new(ciphertext);
        let buf = io::BufReader::new(cursor);
        let blob = BlobRead::with_upper_bound(buf, 10000);

        return blob;
    }

    fn decrypt_column(
        &self,
        data: &Vec<u8>,
        cipher: &ChaCha20Poly1305,
        nonce: &NonceType
    ) -> Result<String, chacha20poly1305::Error> {
        let plaintext = cipher.decrypt(&nonce, data.as_ref())?;

        return Ok(String::from_utf8(plaintext).unwrap());
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

        if let Some(mut cursor) = self.connection.execute(&sql, params)? {
            let mut row = cursor.next_row()?.unwrap();
            let mut buf: Vec<u8> = Vec::new();
            row.get_text(1, &mut buf)?;
            println!("{:?}", String::from_utf8(buf));
        }

        Ok(())
    }

    pub fn get_admin(&self, email: &str) -> Result<Option<HashMap<String, String>>, Error> {
        let sql = "SELECT * FROM Administrator WHERE Email = ?";
        let data = self.select_one(&sql, (&email.into_parameter(),))?;
        if data == None {
            return Ok(None);
        }

        let data = data.unwrap();

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

        return Ok(Some(result));
    }

    pub fn register_physician(&self, fields: &HashMap<&str, &str>) -> Result<(), Error> {
        let sql =
            "INSERT INTO Physician(First_Name, Last_Name, Sex, Department, Title, Date_Of_Birth, Phone_Number, Email, Pub_key, Magic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        let mut magic = self
            .generate_magic(&MAGIC_KEYS["Physician"], &fields)
            .expect("generate magic failed");

        let params = (
            &fields["First_Name"].into_parameter(),
            &fields["Last_Name"].into_parameter(),
            &fields["Sex"].into_parameter(),
            &fields["Department"].into_parameter(),
            &fields["Title"].into_parameter(),
            &fields["Date_Of_Birth"].into_parameter(),
            &fields["Phone_Number"].into_parameter(),
            &fields["Email"].into_parameter(),
            &fields["Pub_key"].into_parameter(),
            &mut magic.as_blob_param(),
        );

        if let Some(mut cursor) = self.connection.execute(&sql, params)? {
            let mut row = cursor.next_row()?.unwrap();
            let mut buf: Vec<u8> = Vec::new();
            row.get_text(1, &mut buf)?;
            println!("{:?}", String::from_utf8(buf));
        }

        Ok(())
    }

    pub fn get_physician(&self, email: &str) -> Result<Option<HashMap<String, String>>, Error> {
        let sql = "SELECT * FROM Physician WHERE Email = ?";
        let data = self.select_one(&sql, (&email.into_parameter(),))?;
        if data == None {
            return Ok(None);
        }

        let data = data.unwrap();

        let mut result = HashMap::new();

        match self.verify_magic(&MAGIC_KEYS["Physician"], &data) {
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

        return Ok(Some(result));
    }

    pub fn add_patient(&self, fields: &HashMap<&str, &str>) -> Result<(), Error> {
        let sql =
            "INSERT INTO Patient(SSN, First_Name, Last_Name, Insurance_ID, Sex, Date_Of_Birth, Phone_Number, Email, nonce, Key_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        let (id, enc_key) = self.ENC_Key[rand::thread_rng().gen_range(0..self.ENC_Key.len())];
        let cipher = ChaCha20Poly1305::new(&enc_key);
        let nonce = ChaCha20Poly1305::generate_nonce(&mut OsRng);

        let mut first_name = self.encrypt_column(fields["First_Name"], &cipher, &nonce);
        let mut last_name = self.encrypt_column(fields["Last_Name"], &cipher, &nonce);
        let mut sex = self.encrypt_column(fields["Sex"], &cipher, &nonce);
        let mut date_of_birth = self.encrypt_column(fields["Date_Of_Birth"], &cipher, &nonce);
        let mut phone_number = self.encrypt_column(fields["Phone_Number"], &cipher, &nonce);
        let mut email = self.encrypt_column(fields["Email"], &cipher, &nonce);

        let cursor_nonce = std::io::Cursor::new(nonce);
        let nonce_buf = io::BufReader::new(cursor_nonce);
        let mut blob_nonce = BlobRead::with_upper_bound(nonce_buf, 1000);

        let params = (
            &fields["SSN"].into_parameter(),
            &mut first_name.as_blob_param(),
            &mut last_name.as_blob_param(),
            &fields["Insurance_ID"].into_parameter(),
            &mut sex.as_blob_param(),
            &mut date_of_birth.as_blob_param(),
            &mut phone_number.as_blob_param(),
            &mut email.as_blob_param(),
            &mut blob_nonce.as_blob_param(),
            &id.to_string().into_parameter(),
        );

        if let Some(mut cursor) = self.connection.execute(&sql, params)? {
            let mut row = cursor.next_row()?.unwrap();
            let mut buf: Vec<u8> = Vec::new();
            row.get_text(10, &mut buf)?;
        }

        Ok(())
    }

    pub fn get_patient(&self, SSN: &str) -> Result<Option<HashMap<String, String>>, Error> {
        let sql = "SELECT * FROM Patient WHERE SSN = ?";
        let data = self.select_one(&sql, (&SSN.into_parameter(),))?;
        if data == None {
            return Ok(None);
        }

        let data = data.unwrap();

        let mut result = HashMap::new();
        let enc_key = self
            .get_enc_key(String::from_utf8(data["Key_ID"].to_vec())?.parse::<u64>()?)
            .unwrap();
        let cipher = ChaCha20Poly1305::new(&enc_key);
        let mut nonce: NonceType = GenericArray::default();
        nonce.copy_from_slice(&data["nonce"][..]);

        for (key, value) in data {
            if key == "Key_ID" || key == "nonce" {
                continue;
            }
            if
                key == "First_Name" ||
                key == "Last_Name" ||
                key == "Sex" ||
                key == "Date_Of_Birth" ||
                key == "Phone_Number" ||
                key == "Email"
            {
                result.insert(key, self.decrypt_column(&value, &cipher, &nonce).unwrap());
            } else {
                result.insert(key, String::from_utf8(value)?);
            }
        }

        return Ok(Some(result));
    }

    pub fn add_record(
        &self,
        fields: &HashMap<&str, &str>,
        medicines: &Vec<String>
    ) -> Result<(), Error> {
        let sql =
            "INSERT INTO Medical_Record(Patient_ID, Physician_ID, Complete_Date, Encounter_Summary, Diagnosis, nonce, Key_ID) VALUES (?, ?, ?, ?, ?, ?, ?)";

        let (id, enc_key) = self.ENC_Key[rand::thread_rng().gen_range(0..self.ENC_Key.len())];
        let cipher = ChaCha20Poly1305::new(&enc_key);
        let nonce = ChaCha20Poly1305::generate_nonce(&mut OsRng);

        let mut complete_date = self.encrypt_column(fields["Complete_Date"], &cipher, &nonce);
        let mut encounter_summary = self.encrypt_column(
            fields["Encounter_Summary"],
            &cipher,
            &nonce
        );
        let mut diagnosis = self.encrypt_column(fields["Diagnosis"], &cipher, &nonce);

        let cursor_nonce = std::io::Cursor::new(nonce);
        let nonce_buf = io::BufReader::new(cursor_nonce);
        let mut blob_nonce = BlobRead::with_upper_bound(nonce_buf, 1000);

        let params = (
            &fields["Patient_ID"].into_parameter(),
            &fields["Physician_ID"].into_parameter(),
            &mut complete_date.as_blob_param(),
            &mut encounter_summary.as_blob_param(),
            &mut diagnosis.as_blob_param(),
            &mut blob_nonce.as_blob_param(),
            &id.to_string().into_parameter(),
        );

        if let Some(mut cursor) = self.connection.execute(&sql, params)? {
            let mut row = cursor.next_row()?.unwrap();
            let mut buf: Vec<u8> = Vec::new();
            row.get_text(1, &mut buf)?;
            println!("{:?}", String::from_utf8(buf));
        }

        // very inefficienct, there should be better way to get insert id
        // cannot figure out right now though
        let id = String::from_utf8(
            self
                .select_one("SELECT MAX(ID) AS LAST_ID FROM Medical_Record", ())
                .unwrap()
                .unwrap()["LAST_ID"]
                .to_vec()
        )?.parse::<u64>()?;

        let mut prepared = self.connection
            .prepare("INSERT INTO Medicine_Treat(Medicine_Name, Record_ID) VALUES (?, ?)")
            .unwrap();

        for medicine in medicines.iter() {
            prepared.execute((
                &medicine.as_str().into_parameter(),
                &id.to_string().into_parameter(),
            ))?;
        }

        Ok(())
    }

    pub fn get_record(&self, id: i32) -> Result<Vec<recordType>, Error> {
        let mut result: Vec<recordType> = vec![];
        let sql =
            "SElECT ID, Patient_ID, Physician_ID, Complete_Date, Encounter_Summary, Diagnosis, nonce, Key_ID FROM Medical_Record WHERE patient_id = ?";

        // should use prepared query here for efficiency, to do later
        // let mut prepared = self.connection
        //     .prepare("SELECT Medicine_Name FROM Medicine_Treat WHERE Record_ID = ?")
        //     .unwrap();
        let sql_medicine = "SELECT Medicine_Name FROM Medicine_Treat WHERE Record_ID = ?";

        let records = self.select_many(sql, (&id.to_string().into_parameter(),)).unwrap();
        for record_raw in records.iter() {
            let id = String::from_utf8(record_raw[0].to_vec())?.parse::<i32>()?;

            let medicines_raw = self
                .select_many(sql_medicine, (&id.to_string().into_parameter(),))
                .unwrap();

            let mut medicines = vec![];
            for medicine in medicines_raw.iter() {
                medicines.push(String::from_utf8(medicine[0].clone())?);
            }

            let enc_key = self
                .get_enc_key(String::from_utf8(record_raw[7].to_vec())?.parse::<u64>()?)
                .unwrap();

            let cipher = ChaCha20Poly1305::new(&enc_key);
            let mut nonce: NonceType = GenericArray::default();
            nonce.copy_from_slice(&record_raw[6][..]);

            let record = recordType {
                patient_id: String::from_utf8(record_raw[1].to_vec())?.parse::<i32>()?,
                physician_id: String::from_utf8(record_raw[2].to_vec())?.parse::<i32>()?,
                medicines: medicines,
                complete_date: self.decrypt_column(&record_raw[3], &cipher, &nonce).unwrap(),
                encounter_summary: self.decrypt_column(&record_raw[4], &cipher, &nonce).unwrap(),
                diagnosis: self.decrypt_column(&record_raw[5], &cipher, &nonce).unwrap(),
            };

            result.push(record);
        }

        return Ok(result);
    }

    pub fn add_code(&self, fields: &HashMap<&str, &str>) -> Result<(), Error> {
        let sql =
            "INSERT INTO register_code(CODE, Account_type, Expiration_Date, Issuer, Magic) VALUES (?, ?, ?, ?, ?)";

        let mut magic = self
            .generate_magic(&MAGIC_KEYS["register_code"], &fields)
            .expect("generate magic failed");

        let params = (
            &fields["CODE"].into_parameter(),
            &fields["Account_type"].into_parameter(),
            &fields["Expiration_Date"].into_parameter(),
            &fields["Issuer"].into_parameter(),
            &mut magic.as_blob_param(),
        );

        if let Some(mut cursor) = self.connection.execute(&sql, params)? {
            let mut row = cursor.next_row()?.unwrap();
            let mut buf: Vec<u8> = Vec::new();
            row.get_text(1, &mut buf)?;
            println!("{:?}", String::from_utf8(buf));
        }

        Ok(())
    }

    pub fn verify_code(&self, code: &str, account_type: &str) -> Result<bool, Error> {
        let sql =
            "SELECT CODE, Account_type, Expiration_Date, Issuer, Magic FROM register_code where CODE = ? LIMIT 1";
        let data = self.select_one(&sql, (&code.into_parameter(),))?;
        if data == None {
            return Ok(false);
        }
        let data = data.unwrap();

        match self.verify_magic(&MAGIC_KEYS["register_code"], &data) {
            Ok(val) => {
                if !val {
                    return Err(anyhow!("integrity check failed!"));
                }
            }
            Err(_) => {
                return Err(anyhow!("integrity check failed!"));
            }
        }

        if String::from_utf8(data["Account_type"].clone())? != account_type {
            return Ok(false);
        }

        return Ok(myutils::verify_date(&String::from_utf8(data["Expiration_Date"].clone())?));
    }

    pub fn delete_code(&self, code: &str) -> Result<bool, Error> {
        let sql = "DELETE FROM register_code WHERE CODE = ?";

        self.connection.execute(&sql, (&code.into_parameter(),))?;

        return Ok(true);
    }

    pub fn get_code(&self, email: &str) -> Result<Vec<codeType>, Error> {
        let mut result: Vec<codeType> = Vec::new();
        let sql = "SELECT CODE, Account_type, Expiration_Date FROM register_code WHERE Issuer = ?";
        let codes = self.select_many(sql, &email.into_parameter())?;

        for code_raw in codes.iter() {
            let code = codeType {
                code: String::from_utf8(code_raw[0].clone())?,
                Account_type: String::from_utf8(code_raw[1].clone())?,
                Expiration_Date: String::from_utf8(code_raw[2].clone())?,
            };
            result.push(code);
        }

        return Ok(result);
    }

    pub fn add_schedule(&self, fields: &HashMap<&str, &str>) -> Result<(), Error> {
        let sql =
            "INSERT INTO schedule(patient_ID, physician_ID, schedule_st, schedule_ed, created_at, description, nonce, Key_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        let (id, enc_key) = self.ENC_Key[rand::thread_rng().gen_range(0..self.ENC_Key.len())];
        let cipher = ChaCha20Poly1305::new(&enc_key);
        let nonce = ChaCha20Poly1305::generate_nonce(&mut OsRng);

        let mut description = self.encrypt_column(fields["description"], &cipher, &nonce);

        let cursor_nonce = std::io::Cursor::new(nonce);
        let nonce_buf = io::BufReader::new(cursor_nonce);
        let mut blob_nonce = BlobRead::with_upper_bound(nonce_buf, 1000);

        let params = (
            &fields["patient_ID"].into_parameter(),
            &fields["physician_ID"].into_parameter(),
            &fields["schedule_st"].into_parameter(),
            &fields["schedule_ed"].into_parameter(),
            &fields["created_at"].into_parameter(),
            &mut description.as_blob_param(),
            &mut blob_nonce.as_blob_param(),
            &id.to_string().into_parameter(),
        );

        if let Some(mut cursor) = self.connection.execute(&sql, params)? {
            let mut row = cursor.next_row()?.unwrap();
            let mut buf: Vec<u8> = Vec::new();
            row.get_text(1, &mut buf)?;
            println!("{:?}", String::from_utf8(buf));
        }

        Ok(())
    }
}
