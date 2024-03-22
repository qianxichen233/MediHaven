use tonic::{transport::Server, Request, Response, Status};

use mediheaven::code_server::{Code, CodeServer};
use mediheaven::{CodeRequest, CodeResponse};

use mediheaven::account_server::{Account, AccountServer};
use mediheaven::{RegisterRequest, SuccessResponse, LoginRequest, LoginResponse};

pub mod mediheaven {
    tonic::include_proto!("mediheaven");
}

#[derive(Debug, Default)]
pub struct CodeService {}

#[derive(Debug, Default)]
pub struct AccountService {}

#[tonic::async_trait]
impl Code for CodeService {
    async fn get_code(&self, request: Request<CodeRequest>) -> Result<Response<CodeResponse>, Status>
    {
        println!("got message: {:?}", request);

        let req = request.into_inner();
        
        let reply = CodeResponse {
            successful: true,
            code: String::from("example")
        };

        Ok(Response::new(reply))
    }
}

#[tonic::async_trait]
impl Account for AccountService {
    async fn register(&self, request: Request<RegisterRequest>) -> Result<Response<SuccessResponse>, Status>
    {
        println!("got message: {:?}", request);

        let req = request.into_inner();
        
        let reply = SuccessResponse {
            successful: true,
        };

        Ok(Response::new(reply))
    }

    async fn login(&self, request: Request<LoginRequest>) -> Result<Response<LoginResponse>, Status>
    {
        println!("got message: {:?}", request);

        let req = request.into_inner();
        
        let reply = LoginResponse {
            successful: true,
            pub_key: String::from("test")
        };

        Ok(Response::new(reply))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>>{
    let addr = "[::1]:50051".parse()?;
    let code_service = CodeService::default();
    let account_service = AccountService::default();

    tokio::spawn(async move {
        Server::builder()
            .add_service(CodeServer::new(code_service))
            .serve(addr)
            .await
            .unwrap();
    });

    // Server::builder().add_service(CodeServer::new(code_service)).serve(addr).await?;
    Server::builder().add_service(AccountServer::new(account_service)).serve(addr).await?;

    Ok(())
}
