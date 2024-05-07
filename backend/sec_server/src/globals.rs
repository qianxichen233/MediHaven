use lazy_static::lazy_static;
use crate::{ db_handler, myutils::get_secrets_from_env };

use std::collections::HashMap;
use std::sync::Mutex;

use chacha20poly1305::{
    aead::generic_array::{ GenericArray, typenum::{ UInt, UTerm } },
    consts::{ B0, B1 },
};
use sharks::{ Sharks, Share };

use std::fs;

type KeyType = GenericArray<u8, UInt<UInt<UInt<UInt<UInt<UInt<UTerm, B1>, B0>, B0>, B0>, B0>, B0>>;

lazy_static! {
    static ref MY_DB_HANDLER: db_handler::DBHandler<'static> = {
        let mut handler = db_handler::DBHandler::new().unwrap();

        // let data = fs::read("./root_key.bin").expect("root key does not exist!");
        // println!("{:?}", data);

        let mut result = vec![];
        get_secrets_from_env(&mut result);
        let shares: Vec<Share> = result
            .iter()
            .map(|s| Share::try_from(s.as_slice()).unwrap())
            .collect();

        let sharks = Sharks(3);
        let data = sharks.recover(shares.as_slice()).unwrap();
        // println!("{:?}", data);

        let mut root_key: KeyType = GenericArray::default();
        root_key.copy_from_slice(&data[..]);

        handler.init(&root_key).expect("root key initialization failed!");
        handler
    };

    // global hashmap serves as the cache of the public key
    static ref PUBKEY_CACHE: Mutex<HashMap<String, String>> = Mutex::new(HashMap::new());
}

pub const TIMESTAMP_EXPIRE: i64 = 525600; // one year for debugging purpose

pub fn get_my_db_handler() -> &'static db_handler::DBHandler<'static> {
    &MY_DB_HANDLER
}

pub fn get_pubkey_cache() -> &'static Mutex<HashMap<String, String>> {
    &PUBKEY_CACHE
}
