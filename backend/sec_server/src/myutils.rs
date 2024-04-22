use chrono::{ DateTime, Local, NaiveDateTime };
use rand::Rng;

use crate::globals;
use crate::mycrypto::MyCrypto;

use chacha20poly1305::Nonce;

pub fn verify_timestamp(timestamp_str: &str, expire: i64) -> bool {
    let timestamp;

    match NaiveDateTime::parse_from_str(timestamp_str, "%Y-%m-%d %H:%M:%S") {
        Ok(time) => {
            timestamp = DateTime::<Local>::from_utc(time, *Local::now().offset());
        }
        Err(_) => {
            return false;
        }
    }

    let current_time = Local::now();

    let duration = current_time.signed_duration_since(timestamp);

    return duration.num_minutes() <= expire;
}

pub fn verify_date(date: &str) -> bool {
    return verify_timestamp(&(date.to_owned() + " 23:59:59"), 0);
}

pub fn generate_code() -> String {
    const CHARSET: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let mut rng = rand::thread_rng();
    let code: String = (0..8)
        .map(|_| {
            let idx = rng.gen_range(0..CHARSET.len());
            CHARSET[idx] as char
        })
        .collect();
    code
}

pub fn verify_auth(
    issuer: &str,
    acc_types: &Vec<&str>,
    plaintext: &str,
    signature: &str,
    timestamp: &str
) -> bool {
    if !verify_timestamp(timestamp, globals::TIMESTAMP_EXPIRE) {
        return false;
    }

    let cache = globals::get_pubkey_cache().lock().unwrap();

    for acc_type in acc_types.iter() {
        let mut cache_key = acc_type.to_string();
        cache_key += "_";
        cache_key += &issuer;
        if cache.contains_key(&cache_key) {
            if !MyCrypto::verify_signature(signature, &cache[&cache_key], plaintext) {
                return false;
            }

            return true;
        }
    }

    println!("signer not logged in!");
    return false;
}

pub fn increment_nonce(nonce: &mut Nonce) -> &Nonce {
    for i in 0..nonce.len() {
        nonce[i] += 1;
        if nonce[i] != 0 {
            break;
        }
    }

    return nonce;
}
