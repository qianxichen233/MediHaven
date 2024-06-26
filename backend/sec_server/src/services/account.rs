use json::object;
use crate::mediheaven::GetPatientRequest;
use crate::mediheaven::GetPhysicianRequest;
use crate::mediheaven::PatientInfo;
use crate::mediheaven::PatientRequest;
use crate::mediheaven::PatientResponse;
use crate::mediheaven::PhysicianInfo;
use crate::mediheaven::PhysicianResponse;
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
        } else if req.account_type == "receptionist" {
            let mut fields: HashMap<&str, &str> = HashMap::new();
            fields.insert("First_Name", &req.first_name);
            fields.insert("Last_Name", &req.last_name);
            fields.insert("Sex", &req.sex);
            fields.insert("Date_Of_Birth", &req.date_of_birth);
            fields.insert("Phone_Number", &req.phone_number);
            fields.insert("Email", &req.email);
            fields.insert("Pub_key", &req.pub_key);

            if let Err(err) = globals::get_my_db_handler().register_receptionist(&fields) {
                eprintln!("Error: {}", err);
                return Ok(failed);
            }
        }

        if req.code != "dev" {
            globals::get_my_db_handler().delete_code(&req.code).expect("delete code failed!");
        }

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

        let mut cache_key = req.account_type.clone();
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

        println!("{:}", signature_plaintext);

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

        if req.account_type == "admin" {
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
                    if err.to_string() == "integrity check failed!" {
                        let retval = Response::new(LoginResponse {
                            successful: false,
                            pub_key: String::new(),
                            msg: Some(String::from("hacker")),
                        });

                        return Ok(retval);
                    }

                    eprintln!("Error: {}", err);
                    return Ok(failed_msg);
                }
            }
        } else if req.account_type == "physician" {
            match globals::get_my_db_handler().get_physician(&req.email) {
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
                        println!("signature failed!");
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
        } else if req.account_type == "receptionist" {
            match globals::get_my_db_handler().get_receptionist(&req.email) {
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

        return Ok(failed_msg);
    }

    async fn patient(
        &self,
        request: Request<PatientRequest>
    ) -> Result<Response<SuccessResponse>, Status> {
        let failed_msg = Response::new(SuccessResponse {
            successful: false,
            msg: None,
        });

        let req = request.into_inner();
        println!("got message: {:?}", req);
        match req.auth {
            Some(auth) => {
                let plaintext = (
                    object! {
                    endpoint: "POST patient",
                    SSN: req.ssn.clone(),
                    First_Name: req.first_name.clone(),
                    Last_Name: req.last_name.clone(),
                    Sex: req.sex.clone(),
                    Date_Of_Birth: req.date_of_birth.clone(),
                    Phone_Number: req.phone_number.clone(),
                    Email: req.email.clone(),
                    Insurance_ID: req.insurance_id.clone(),
                    issuer_email: auth.issuer_email.clone(),
                    timestamp: auth.timestamp.clone()
                }
                ).dump();

                println!("{:?}", plaintext);

                if
                    !myutils::verify_auth(
                        &auth.issuer_email,
                        &vec!["receptionist"],
                        &plaintext,
                        &auth.signature,
                        &auth.timestamp
                    )
                {
                    println!("signature failed");
                    return Ok(failed_msg);
                }
            }
            None => {
                return Ok(failed_msg);
            }
        }

        let mut fields: HashMap<&str, &str> = HashMap::new();
        fields.insert("SSN", &req.ssn);
        fields.insert("First_Name", &req.first_name);
        fields.insert("Last_Name", &req.last_name);
        fields.insert("Sex", &req.sex);
        fields.insert("Insurance_ID", &req.insurance_id);
        fields.insert("Date_Of_Birth", &req.date_of_birth);
        fields.insert("Phone_Number", &req.phone_number);
        fields.insert("Email", &req.email);

        if let Err(err) = globals::get_my_db_handler().add_patient(&fields) {
            eprintln!("Error: {}", err);
            return Ok(failed_msg);
        }

        let reply = SuccessResponse {
            successful: true,
            msg: None,
        };

        return Ok(Response::new(reply));
    }

    async fn get_patient(
        &self,
        request: Request<GetPatientRequest>
    ) -> Result<Response<PatientResponse>, Status> {
        let failed_msg = Response::new(PatientResponse {
            patient: None,
        });

        let req = request.into_inner();
        println!("got message: {:?}", req);
        match req.auth {
            Some(auth) => {
                let plaintext = (
                    object! {
                    endpoint: "GET patient",
                    SSN: req.ssn.clone(),
                    issuer_email: auth.issuer_email.clone(),
                    timestamp: auth.timestamp.clone()
                }
                ).dump();

                if
                    !myutils::verify_auth(
                        &auth.issuer_email,
                        &vec!["physician", "receptionist"],
                        &plaintext,
                        &auth.signature,
                        &auth.timestamp
                    )
                {
                    println!("signature failed");
                    return Ok(failed_msg);
                }
            }
            None => {
                return Ok(failed_msg);
            }
        }

        match globals::get_my_db_handler().get_patient(&req.ssn) {
            Ok(result) => {
                if result == None {
                    return Ok(failed_msg);
                }
                let result = result.unwrap();
                println!("{:?}", result);

                let reply = PatientInfo {
                    ssn: result["SSN"].clone(),
                    first_name: result["First_Name"].clone(),
                    last_name: result["Last_Name"].clone(),
                    insurance_id: result["Insurance_ID"].clone(),
                    sex: result["Sex"].clone(),
                    date_of_birth: result["Date_Of_Birth"].clone(),
                    phone_number: result["Phone_Number"].clone(),
                    email: result["Email"].clone(),
                    id: result["ID"].parse::<i32>().unwrap(),
                };

                return Ok(
                    Response::new(PatientResponse {
                        patient: Some(reply),
                    })
                );
            }
            Err(err) => {
                eprintln!("Error: {}", err);
                return Ok(failed_msg);
            }
        }
    }

    async fn get_physician(
        &self,
        request: Request<GetPhysicianRequest>
    ) -> Result<Response<PhysicianResponse>, Status> {
        let req = request.into_inner();
        println!("got message: {:?}", req);

        let department;
        let first_name;
        let last_name;

        let mut fields: HashMap<&str, &str> = HashMap::new();
        if req.department.is_some() {
            department = req.department.unwrap();
            fields.insert("department", &department);
        }
        if req.first_name.is_some() {
            first_name = req.first_name.unwrap();
            last_name = req.last_name.unwrap();

            fields.insert("first_name", &first_name);
            fields.insert("last_name", &last_name);
        }

        match globals::get_my_db_handler().get_physicians(&fields) {
            Ok(result) => {
                let reply = PhysicianResponse {
                    physicians: result
                        .iter()
                        .map(|physician| PhysicianInfo {
                            id: physician.ID,
                            first_name: physician.first_name.clone(),
                            last_name: physician.last_name.clone(),
                            sex: physician.sex.clone(),
                            department: physician.department.clone(),
                            title: physician.title.clone(),
                            email: physician.email.clone(),
                        })
                        .collect(),
                };

                return Ok(Response::new(reply));
            }
            Err(err) => {
                println!("{:?}", err);
                return Ok(
                    Response::new(PhysicianResponse {
                        physicians: vec![],
                    })
                );
            }
        }
    }
}
