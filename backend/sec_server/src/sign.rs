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

fn build_pem(received: &str) -> String {
    let mut processed = String::new();
    for (i, c) in received.chars().enumerate() {
        if i > 0 && i % 64 == 0 {
            processed.push('\n');
        }
        processed.push(c);
    }

    return (
        String::from("-----BEGIN PUBLIC KEY-----\n") + &processed + "\n-----END PUBLIC KEY-----\n"
    );
}

fn main() {
    let key_received =
        "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwBEj4UWvxtQhO9+/z56qjSJO+K9htAOx2Y136wkEiEq1ord+6hywnF6RCxdddg+y1UMRUH6nL7ZB4ajvrtxPqHsGECGNsKLANKy/lNklMKxjElp98gvOtfBhiafBDJpX0X2XUkMGBQjV6ipiu0uDD8Qh2FOVz/SyVAQ7p1I9mKMk2XDm/7SddkJJWcVI44uO8lJ5SeQC/WDbb9JBZbRfQ2bMRFJ6pKd3VkBb18jLlfDZGnSCFG38VUBYMQmJnUmp7I+QfLgrXP4ZDTfInFDfdbJf4YOkkbe7ESr+xQkZxTovMa77WFIATh4zpo686mUCl0X+Qk1usIHX3agiFT+1lQIDAQAB";
    let raw = build_pem(key_received);

    // println!("{:?}", raw);

    // let public_key_raw = read_file_to_string("./publickey.crt").expect("error");
    // println!("{:?}", public_key_raw);
    // let private_key_raw = read_file_to_string("./keypair.pem").expect("error");

    let public_key = RsaPublicKey::from_public_key_pem(&raw).expect("error");
    // let private_key = RsaPrivateKey::from_pkcs1_pem(&private_key_raw).expect("error");

    // let mut rng = rand::thread_rng();

    // let signing_key = SigningKey::<Sha256>::new(private_key);
    // let verifying_key = signing_key.verifying_key();
    let verifying_key: VerifyingKey<Sha256> = VerifyingKey::new(public_key);
    println!("{:?}", verifying_key);

    // Sign
    let data = b"qc815@nyu.edu";
    let signature_vec = base64
        ::decode(
            "JXSvTMNcQg/SWA6l993x0sT1lR9SbQCuRGh5+ndx8ap76IhnN5dox2AyL/kMhNcziEdHvoMWFt9Go6wz1GwVwVROwjOjQIdizs62moqlxhhYlYSdWAt91Vsfak2lp4pj5sNMIRREqFg0XWtOTANo6G38Jh89xh5RM2ofmjVK4qtm4/nZH2BWAExhwEqf2u4SC8Rwy1t5ZNyT7ci3ESq+LjCpM+eWWdNZoWlnw7CKpnKf9K+BV82JrMZg0L6AGdCMD05GhEW+MR86UasfnwW2/k+0E5qCajGPPRYbswPPKMvmUrFHsfpOj09cIhLsDOOKuqwMqns6AIMVvBQGu5QI7Q=="
        )
        .expect("error decoding");
    let signature = rsa::pkcs1v15::Signature
        ::try_from(signature_vec.as_slice())
        .expect("signature error");
    println!("{:?}", signature.to_vec());

    // let signature = signing_key.sign_with_rng(&mut rng, data);
    // assert_ne!(signature.to_bytes().as_ref(), data.as_slice());

    // // Sign
    // println!("signature: {:?}", signature.to_bytes());
    // println!("signature: {:?}", base64::encode(&signature.to_vec()));

    // Verify
    verifying_key.verify(data, &signature).expect("failed to verify");
}
