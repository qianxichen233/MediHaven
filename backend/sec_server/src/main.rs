use json::object;
use sec_server::db_handler;
use sec_server::mycrypto::MyCrypto;
use sec_server::myutils;

use std::collections::HashMap;
use std::sync::Mutex;

use tonic::{ transport::Server, Request, Response, Status };
use lazy_static::lazy_static;

use chacha20poly1305::{
    aead::generic_array::{ GenericArray, typenum::{ UInt, UTerm } },
    consts::{ B0, B1 },
};
use std::fs;

type KeyType = GenericArray<u8, UInt<UInt<UInt<UInt<UInt<UInt<UTerm, B1>, B0>, B0>, B0>, B0>, B0>>;

use mediheaven::code_server::{ Code, CodeServer };
use mediheaven::{
    CodeRequest,
    CodeResponse,
    CodeDelRequest,
    CodeListRequest,
    CodeListResponse,
    CodeMessage,
};

use mediheaven::account_server::{ Account, AccountServer };
use mediheaven::{ RegisterRequest, SuccessResponse, LoginRequest, LoginResponse };

const TIMESTAMP_EXPIRE: i64 = 525600; // one year for debugging purpose

pub mod mediheaven {
    tonic::include_proto!("mediheaven");
}

lazy_static! {
    static ref MY_DB_HANDLER: db_handler::DBHandler<'static> = {
        let mut handler = db_handler::DBHandler::new().unwrap();

        // currently read from file directly
        // to-do: replace with shamir's secret sharing algorithm to get the root key
        let data = fs::read("./root_key.bin").expect("root key does not exist!");

        let mut root_key: KeyType = GenericArray::default();
        root_key.copy_from_slice(&data[..]);

        handler.init(&root_key).expect("root key initialization failed!");
        handler
    };

    // global hashmap serves as the cache of the public key
    static ref PUBKEY_CACHE: Mutex<HashMap<String, String>> = Mutex::new(HashMap::new());
}

#[derive(Debug, Default)]
pub struct CodeService {}

#[derive(Debug, Default)]
pub struct AccountService {
    // MyDBHhandler: db_handler::DBHandler<'a>,
}

#[tonic::async_trait]
impl Code for CodeService {
    async fn get_code(
        &self,
        request: Request<CodeRequest>
    ) -> Result<Response<CodeResponse>, Status> {
        println!("got message: {:?}", request);

        let req = request.into_inner();

        let failed_msg = Response::new(CodeResponse {
            successful: false,
            code: String::from(""),
            msg: None,
        });

        if !myutils::verify_timestamp(&req.timestamp, TIMESTAMP_EXPIRE) {
            return Ok(failed_msg);
        }

        let signature_plaintext = (
            object! {
            email: req.email.clone(),
            account_type: req.account_type.clone(),
            timestamp: req.timestamp.clone()
        }
        ).dump();
        println!("{:?}", signature_plaintext);

        let cache = PUBKEY_CACHE.lock().unwrap();

        let mut cache_key = String::from(req.account_type.clone());
        cache_key += "_";
        cache_key += &req.email;

        if cache.contains_key(&cache_key) {
            if
                !MyCrypto::verify_signature(
                    &req.signature,
                    &cache[&cache_key],
                    &signature_plaintext
                )
            {
                println!("signature fail");
                return Ok(failed_msg);
            }

            let code = myutils::generate_code();

            let mut fields: HashMap<&str, &str> = HashMap::new();
            fields.insert("CODE", &code);
            fields.insert("Account_type", &req.account_type);
            fields.insert("Expiration_Date", &req.expiration_date);
            fields.insert("Issuer", &req.email);

            if let Err(err) = MY_DB_HANDLER.add_code(&fields) {
                eprintln!("Error: {}", err);
                return Ok(failed_msg);
            }

            let success_msg = Response::new(CodeResponse {
                successful: true,
                code,
                msg: None,
            });

            return Ok(success_msg);
        }

        Ok(failed_msg)
    }

    async fn del_code(
        &self,
        request: Request<CodeDelRequest>
    ) -> Result<Response<SuccessResponse>, Status> {
        todo!()
    }

    async fn list_code(
        &self,
        request: Request<CodeListRequest>
    ) -> Result<Response<CodeListResponse>, Status> {
        let req = request.into_inner();
        let failed_msg = Response::new(CodeListResponse {
            codes: Vec::new(),
            msg: None,
        });

        let signature_plaintext = (
            object! {
            email: req.email.clone(),
            timestamp: req.timestamp.clone()
        }
        ).dump();

        let cache = PUBKEY_CACHE.lock().unwrap();

        let mut cache_key = String::from("admin_");
        cache_key += &req.email;

        if !cache.contains_key(&cache_key) {
            return Ok(failed_msg);
        }

        if !MyCrypto::verify_signature(&req.signature, &cache[&cache_key], &signature_plaintext) {
            println!("signature fail");
            return Ok(failed_msg);
        }

        match MY_DB_HANDLER.get_code(&req.email) {
            Ok(result) => {
                let reply = CodeListResponse {
                    codes: result
                        .iter()
                        .map(|mycode| CodeMessage {
                            code: mycode.code.clone(),
                            account_type: mycode.Account_type.clone(),
                            expiration_date: mycode.Expiration_Date.clone(),
                        })
                        .collect(),
                    msg: None,
                };

                return Ok(Response::new(reply));
            }
            Err(err) => {
                println!("{:?}", err);
                return Ok(failed_msg);
            }
        }
    }
}

#[tonic::async_trait]
impl Account for AccountService {
    async fn register(
        &self,
        request: Request<RegisterRequest>
    ) -> Result<Response<SuccessResponse>, Status> {
        let req = request.into_inner();
        println!("got request: {:?}", req);

        let failed = Response::new(SuccessResponse {
            successful: false,
            msg: None,
        });

        if
            req.code != "dev" // dev environment only
        {
            match MY_DB_HANDLER.verify_code(&req.code, &req.account_type) {
                Ok(res) => {
                    if !res {
                        return Ok(failed);
                    }
                }
                Err(err) => {
                    println!("{:?}", err);
                    return Ok(failed);
                }
            }
        }

        let age = req.age.to_string();

        let mut fields: HashMap<&str, &str> = HashMap::new();
        fields.insert("First_Name", &req.first_name);
        fields.insert("Last_Name", &req.last_name);
        fields.insert("Sex", &req.sex);
        fields.insert("Age", &age);
        fields.insert("Date_Of_Birth", &req.date_of_birth);
        fields.insert("Phone_Number", &req.phone_number);
        fields.insert("Email", &req.email);
        fields.insert("Pub_key", &req.pub_key);

        if let Err(err) = MY_DB_HANDLER.register_admin(&fields) {
            eprintln!("Error: {}", err);
            return Ok(failed);
        }
        MY_DB_HANDLER.delete_code(&req.code).expect("delete code failed!");
        let success = SuccessResponse {
            successful: true,
            msg: None,
        };

        Ok(Response::new(success))
    }

    async fn login(
        &self,
        request: Request<LoginRequest>
    ) -> Result<Response<LoginResponse>, Status> {
        let failed_msg = Response::new(LoginResponse {
            successful: false,
            pub_key: String::new(),
            msg: None,
        });
        println!("got message: {:?}", request);

        let req = request.into_inner();

        if !myutils::verify_timestamp(&req.timestamp, TIMESTAMP_EXPIRE) {
            return Ok(failed_msg);
        }

        let mut cache_key = String::from(req.account_type);
        cache_key += "_";
        cache_key += &req.email;

        let mut cache = PUBKEY_CACHE.lock().unwrap();

        let signature_plaintext = (
            object! {
            email: req.email.clone(),
            timestamp: req.timestamp.clone()
        }
        ).dump();

        if cache.contains_key(&cache_key) {
            if
                !MyCrypto::verify_signature(
                    &req.signature,
                    &cache[&cache_key],
                    &signature_plaintext
                )
            {
                return Ok(failed_msg);
            }

            let reply = LoginResponse {
                successful: true,
                pub_key: cache[&cache_key].clone(),
                msg: None,
            };

            return Ok(Response::new(reply));
        }

        match MY_DB_HANDLER.get_admin(&req.email) {
            Ok(result) => {
                if result == None {
                    return Ok(failed_msg);
                }
                let result = result.unwrap();

                if
                    !MyCrypto::verify_signature(
                        &req.signature,
                        &result["Pub_key"],
                        &signature_plaintext
                    )
                {
                    return Ok(failed_msg);
                }
                cache.insert(cache_key, result["Pub_key"].clone());

                let reply = LoginResponse {
                    successful: true,
                    pub_key: result["Pub_key"].clone(),
                    msg: None,
                };

                return Ok(Response::new(reply));
            }
            Err(err) => {
                eprintln!("Error: {}", err);
                return Ok(failed_msg);
            }
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::1]:50051".parse()?;
    let code_service = CodeService::default();
    let account_service = AccountService::default();

    Server::builder()
        .add_service(AccountServer::new(account_service))
        .add_service(CodeServer::new(code_service))
        .serve(addr).await?;

    Ok(())
}
