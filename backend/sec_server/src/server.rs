mod db_handler;

use std::collections::HashMap;

use tonic::{ transport::Server, Request, Response, Status };
use lazy_static::lazy_static;

use chacha20poly1305::{
    aead::generic_array::{ GenericArray, typenum::{ UInt, UTerm } },
    consts::{ B0, B1 },
};
use std::fs;

type KeyType = GenericArray<u8, UInt<UInt<UInt<UInt<UInt<UInt<UTerm, B1>, B0>, B0>, B0>, B0>, B0>>;

use mediheaven::code_server::{ Code, CodeServer };
use mediheaven::{ CodeRequest, CodeResponse };

use mediheaven::account_server::{ Account, AccountServer };
use mediheaven::{ RegisterRequest, SuccessResponse, LoginRequest, LoginResponse };

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

        let reply = CodeResponse {
            successful: true,
            code: String::from("example"),
        };

        Ok(Response::new(reply))
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

        let failed = SuccessResponse {
            successful: false,
        };

        // to-do: check for real code
        if req.code != "dev" {
            return Ok(Response::new(failed));
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
        }
        let reply = SuccessResponse {
            successful: true,
        };

        Ok(Response::new(reply))
    }

    async fn login(
        &self,
        request: Request<LoginRequest>
    ) -> Result<Response<LoginResponse>, Status> {
        println!("got message: {:?}", request);

        let req = request.into_inner();

        let reply = LoginResponse {
            successful: true,
            pub_key: String::from("test"),
        };

        Ok(Response::new(reply))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::1]:50051".parse()?;
    let code_service = CodeService::default();
    let account_service = AccountService::default();

    // tokio::spawn(async move {
    //     Server::builder()
    //         .add_service(CodeServer::new(code_service))
    //         .serve(addr)
    //         .await
    //         .unwrap();
    // });

    // Server::builder().add_service(CodeServer::new(code_service)).serve(addr).await?;
    Server::builder().add_service(AccountServer::new(account_service)).serve(addr).await?;

    Ok(())
}
