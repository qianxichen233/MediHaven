use sec_server::myutils::get_secrets_from_env;
use sharks::{ Sharks, Share };

use std::fs;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut result = vec![];
    get_secrets_from_env(&mut result);
    let shares: Vec<Share> = result
        .iter()
        .map(|s| Share::try_from(s.as_slice()).unwrap())
        .collect();

    // println!("{:?}", result);

    let root_key = fs::read("./root_key.bin").expect("root key not found");

    let sharks = Sharks(3);
    // let dealer = sharks.dealer(&root_key);
    // let shares: Vec<Share> = dealer.take(5).collect();

    // for elem in &shares {
    //     println!("{:?}", hex::encode(Vec::from(elem)));
    // }

    let secret = sharks.recover(shares.as_slice()).unwrap();
    assert_eq!(secret.to_vec(), root_key);

    Ok(())
}
