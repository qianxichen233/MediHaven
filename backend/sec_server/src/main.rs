use sec_server::services::account::AccountService;
use sec_server::services::code::CodeService;

use sec_server::mediheaven::code_server::CodeServer;
use sec_server::mediheaven::account_server::AccountServer;

use tonic::transport::Server;

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
