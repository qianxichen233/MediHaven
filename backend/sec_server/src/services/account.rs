use json::object;
use crate::mediheaven::PatientRequest;
use crate::mycrypto::MyCrypto;
use crate::myutils;
use crate::globals;

use std::collections::HashMap;

use tonic::{ Request, Response, Status };

use crate::mediheaven::account_server::Account;
use crate::mediheaven::{ RegisterRequest, SuccessResponse, LoginRequest, LoginResponse };

#[derive(Debug, Default)]
pub struct AccountService {}

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
            match globals::get_my_db_handler().verify_code(&req.code, &req.account_type) {
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

        if req.account_type == "admin" {
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

            if let Err(err) = globals::get_my_db_handler().register_admin(&fields) {
                eprintln!("Error: {}", err);
                return Ok(failed);
            }
        } else if req.account_type == "physician" {
            let mut fields: HashMap<&str, &str> = HashMap::new();
            fields.insert("First_Name", &req.first_name);
            fields.insert("Last_Name", &req.last_name);
            fields.insert("Sex", &req.sex);
            fields.insert("Title", &req.title);
            fields.insert("Date_Of_Birth", &req.date_of_birth);
            fields.insert("Phone_Number", &req.phone_number);
            fields.insert("Email", &req.email);
            fields.insert("Pub_key", &req.pub_key);
            fields.insert("Department", &req.department);

            if let Err(err) = globals::get_my_db_handler().register_physician(&fields) {
                eprintln!("Error: {}", err);
                return Ok(failed);
            }
        }

        globals::get_my_db_handler().delete_code(&req.code).expect("delete code failed!");
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

        if !myutils::verify_timestamp(&req.timestamp, globals::TIMESTAMP_EXPIRE) {
            return Ok(failed_msg);
        }

        let mut cache_key = String::from(req.account_type);
        cache_key += "_";
        cache_key += &req.email;

        let mut cache = globals::get_pubkey_cache().lock().unwrap();

        let signature_plaintext = (
            object! {
            endpoint: "POST login",
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

        match globals::get_my_db_handler().get_admin(&req.email) {
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

    async fn patient(
        &self,
        request: Request<PatientRequest>
    ) -> Result<Response<SuccessResponse>, Status> {
        let failed_msg = Response::new(SuccessResponse {
            successful: false,
            msg: None,
        });

        Ok(failed_msg)
    }
}
