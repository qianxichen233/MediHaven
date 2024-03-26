use json::object;
use rsa::{ RsaPublicKey, pkcs8::DecodePublicKey, pkcs1::DecodeRsaPrivateKey, RsaPrivateKey };
use rsa::pkcs1v15::{ SigningKey, VerifyingKey };
use rsa::signature::{ Keypair, RandomizedSigner, SignatureEncoding, Verifier };
use rsa::sha2::{ Digest, Sha256 };

use std::fs::File;
use std::io::{ self, Read };

fn read_file_to_string(filename: &str) -> io::Result<String> {
    let mut file = File::open(filename)?;

    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    Ok(contents)
}

fn main() {
    let public_key_raw = read_file_to_string("./publickey.crt").expect("error");
    let private_key_raw = read_file_to_string("./keypair.pem").expect("error");

    let public_key = RsaPublicKey::from_public_key_pem(&public_key_raw).expect("error");
    let private_key = RsaPrivateKey::from_pkcs1_pem(&private_key_raw).expect("error");

    let mut rng = rand::thread_rng();

    let signing_key = SigningKey::<Sha256>::new(private_key);
    let verifying_key = signing_key.verifying_key();

    // Sign
    let endpoint = "POST login";
    let email = "qc815@nyu.edu";
    let timestamp = "2024-03-25 20:10:00";
    let account_type = "admin";

    let data =
        object! {
        endpoint: endpoint,
        email: email,
        // account_type: account_type,
        timestamp: timestamp
        
    };

    let signature = signing_key.sign_with_rng(&mut rng, data.dump().as_bytes());
    println!("signature: {:?}", base64::encode(&signature.to_vec()));

    verifying_key.verify(data.dump().as_bytes(), &signature).expect("failed to verify");
}
