use rsa::{ RsaPublicKey, pkcs8::DecodePublicKey };
use rsa::pkcs1v15::VerifyingKey;
use rsa::signature::Verifier;
use rsa::sha2::Sha256;

pub struct MyCrypto;

impl MyCrypto {
    fn build_pem(key: &str) -> String {
        let mut processed = String::new();
        for (i, c) in key.chars().enumerate() {
            if i > 0 && i % 64 == 0 {
                processed.push('\n');
            }
            processed.push(c);
        }

        String::from("-----BEGIN PUBLIC KEY-----\n") + &processed + "\n-----END PUBLIC KEY-----\n"
    }

    pub fn verify_signature(signature_str: &str, pub_key: &str, msg: &str) -> bool {
        let raw = Self::build_pem(pub_key);
        let signature;

        match base64::decode(signature_str) {
            Ok(signature_vec) => {
                match rsa::pkcs1v15::Signature::try_from(signature_vec.as_slice()) {
                    Ok(sig) => {
                        signature = sig;
                    }
                    Err(_) => {
                        return false;
                    }
                }
            }
            Err(_) => {
                return false;
            }
        }

        match RsaPublicKey::from_public_key_pem(&raw) {
            Ok(public_key) => {
                let verifying_key: VerifyingKey<Sha256> = VerifyingKey::new(public_key);

                match verifying_key.verify(msg.as_bytes(), &signature) {
                    Ok(_) => {
                        return true;
                    }
                    Err(_) => {
                        return false;
                    }
                }
            }
            Err(_) => {
                return false;
            }
        }
    }
}
