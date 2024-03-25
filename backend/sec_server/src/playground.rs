use json::object;
use rsa::{ RsaPublicKey, pkcs8::DecodePublicKey, pkcs1::DecodeRsaPrivateKey, RsaPrivateKey };
use rsa::pkcs1v15::{ SigningKey, VerifyingKey };
use rsa::signature::{ Keypair, RandomizedSigner, SignatureEncoding, Verifier };
use rsa::sha2::{ Digest, Sha256 };

use std::fs::File;
use std::io::{ self, Read };

fn read_file_to_string(filename: &str) -> io::Result<String> {
    // Open the file
    let mut file = File::open(filename)?;

    // Read the file contents into a string
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    Ok(contents)
}

fn print_type_of<T>(_: &T) {
    println!("{}", std::any::type_name::<T>())
}

fn main() {
    let public_key_raw = read_file_to_string("./publickey.crt").expect("error");
    let private_key_raw = read_file_to_string("./keypair.pem").expect("error");

    let public_key = RsaPublicKey::from_public_key_pem(&public_key_raw).expect("error");
    let private_key = RsaPrivateKey::from_pkcs1_pem(&private_key_raw).expect("error");

    let mut rng = rand::thread_rng();

    let signing_key = SigningKey::<Sha256>::new(private_key);
    let verifying_key = signing_key.verifying_key();
    // let verifying_key: VerifyingKey<Sha256> = VerifyingKey::new(public_key);
    // println!("{:?}", verifying_key);

    // Sign
    let email = "qc815@nyu.edu";
    let timestamp = "2024-03-23 20:10:00";
    let account_type = "admin";

    let data =
        object! {
        email: email,
        account_type: account_type,
        timestamp: timestamp
        
    };
    // let signature_vec = base64
    //     ::decode(
    //         "JXSvTMNcQg/SWA6l993x0sT1lR9SbQCuRGh5+ndx8ap76IhnN5dox2AyL/kMhNcziEdHvoMWFt9Go6wz1GwVwVROwjOjQIdizs62moqlxhhYlYSdWAt91Vsfak2lp4pj5sNMIRREqFg0XWtOTANo6G38Jh89xh5RM2ofmjVK4qtm4/nZH2BWAExhwEqf2u4SC8Rwy1t5ZNyT7ci3ESq+LjCpM+eWWdNZoWlnw7CKpnKf9K+BV82JrMZg0L6AGdCMD05GhEW+MR86UasfnwW2/k+0E5qCajGPPRYbswPPKMvmUrFHsfpOj09cIhLsDOOKuqwMqns6AIMVvBQGu5QI7Q=="
    //     )
    //     .expect("error decoding");
    // let signature = rsa::pkcs1v15::Signature
    //     ::try_from(signature_vec.as_slice())
    //     .expect("signature error");
    // println!("{:?}", signature.to_vec());

    let signature = signing_key.sign_with_rng(&mut rng, data.dump().as_bytes());
    // assert_ne!(signature.to_bytes().as_ref(), data.as_slice());

    // // Sign
    // println!("signature: {:?}", signature.to_bytes());
    println!("signature: {:?}", base64::encode(&signature.to_vec()));

    // Verify
    verifying_key.verify(data.dump().as_bytes(), &signature).expect("failed to verify");
}
