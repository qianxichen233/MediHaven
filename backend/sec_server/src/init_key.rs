mod db_handler;

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
use db_handler::DBHandler;

use std::fs;

type KeyType = GenericArray<u8, UInt<UInt<UInt<UInt<UInt<UInt<UTerm, B1>, B0>, B0>, B0>, B0>, B0>>;

fn gen_root_key(path: &str) -> Result<(), Box<dyn std::error::Error>> {
    let root_key = ChaCha20Poly1305::generate_key(&mut OsRng);
    fs::write(path, root_key.to_vec())?;

    Ok(())
}

fn get_root_key(path: &str) -> Result<KeyType, Box<dyn std::error::Error>> {
    let data = fs::read(path)?;

    let mut root_key: KeyType = GenericArray::default();
    root_key.copy_from_slice(&data[..]);

    Ok(root_key)
}

fn create_mykey(
    handler: &DBHandler,
    root_key: KeyType,
    key_type: &str
) -> Result<(), chacha20poly1305::Error> {
    let key = ChaCha20Poly1305::generate_key(&mut OsRng);
    let vec_u8: Vec<u8> = key.to_vec();
    println!("{:?}: {:?}", key_type, vec_u8);
    let cipher = ChaCha20Poly1305::new(&root_key);
    let nonce = ChaCha20Poly1305::generate_nonce(&mut OsRng);
    let ciphertext = cipher.encrypt(&nonce, vec_u8.as_slice())?;

    if let Err(err) = handler.store_key(&ciphertext, &nonce.to_vec(), key_type) {
        eprintln!("Error: {}", err);
    }

    Ok(())
}

fn main() -> Result<(), chacha20poly1305::Error> {
    let root_key = get_root_key("root_key.bin").expect("read root key error!");

    let handler = db_handler::DBHandler::new().unwrap();
    // handler.init(&root_key);

    create_mykey(&handler, root_key, "int").expect("creating key failed!");

    for _ in 0..4 {
        create_mykey(&handler, root_key, "data").expect("creating key failed!");
        // let plaintext = cipher.decrypt(&nonce, ciphertext.as_ref())?;
        // println!("{:?}", plaintext.to_vec());
        // assert_eq!(&plaintext, b"plaintext message");
    }

    Ok(())
}
