use json::object;
use crate::mycrypto::MyCrypto;
use crate::myutils;
use crate::globals;

use std::collections::HashMap;

use tonic::{ Request, Response, Status };

use crate::mediheaven::{
    CodeRequest,
    CodeResponse,
    CodeDelRequest,
    CodeListRequest,
    CodeListResponse,
    CodeMessage,
    code_server::Code,
    SuccessResponse,
};

#[derive(Debug, Default)]
pub struct CodeService {}

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

        if !myutils::verify_timestamp(&req.timestamp, globals::TIMESTAMP_EXPIRE) {
            return Ok(failed_msg);
        }

        let signature_plaintext = (
            object! {
            endpoint: "POST code",
            email: req.email.clone(),
            account_type: req.account_type.clone(),
            timestamp: req.timestamp.clone()
        }
        ).dump();
        println!("{:?}", signature_plaintext);

        let cache = globals::get_pubkey_cache().lock().unwrap();

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

            if let Err(err) = globals::get_my_db_handler().add_code(&fields) {
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
        let req = request.into_inner();
        let failed_msg = Response::new(SuccessResponse {
            successful: false,
            msg: None,
        });

        if !myutils::verify_timestamp(&req.timestamp, globals::TIMESTAMP_EXPIRE) {
            return Ok(failed_msg);
        }

        let signature_plaintext = (
            object! {
            endpoint: "DELETE code",
            email: req.email.clone(),
            code: req.code.clone(),
            timestamp: req.timestamp.clone()
        }
        ).dump();

        let cache = globals::get_pubkey_cache().lock().unwrap();

        let mut cache_key = String::from("admin_");
        cache_key += &req.email;

        if !cache.contains_key(&cache_key) {
            return Ok(failed_msg);
        }

        if !MyCrypto::verify_signature(&req.signature, &cache[&cache_key], &signature_plaintext) {
            println!("signature fail");
            return Ok(failed_msg);
        }

        match globals::get_my_db_handler().delete_code(&req.code) {
            Ok(res) => {
                if !res {
                    return Ok(failed_msg);
                }
                return Ok(Response::new(SuccessResponse { successful: true, msg: None }));
            }
            Err(err) => {
                println!("{:?}", err);
                return Ok(failed_msg);
            }
        }
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

        if !myutils::verify_timestamp(&req.timestamp, globals::TIMESTAMP_EXPIRE) {
            return Ok(failed_msg);
        }

        let signature_plaintext = (
            object! {
            endpoint: "GET code",
            email: req.email.clone(),
            timestamp: req.timestamp.clone()
        }
        ).dump();

        let cache = globals::get_pubkey_cache().lock().unwrap();

        let mut cache_key = String::from("admin_");
        cache_key += &req.email;

        if !cache.contains_key(&cache_key) {
            return Ok(failed_msg);
        }

        if !MyCrypto::verify_signature(&req.signature, &cache[&cache_key], &signature_plaintext) {
            println!("signature fail");
            return Ok(failed_msg);
        }

        match globals::get_my_db_handler().get_code(&req.email) {
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
