use sec_server::services::account::AccountService;
use sec_server::services::code::CodeService;
use sec_server::services::medical_record::MedicalRecordService;
use sec_server::services::schedule::ScheduleService;

use sec_server::mediheaven::code_server::CodeServer;
use sec_server::mediheaven::account_server::AccountServer;
use sec_server::mediheaven::medical_record_server::MedicalRecordServer;
use sec_server::mediheaven::schedule_server::ScheduleServer;

use tonic::transport::Server;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::1]:50051".parse()?;

    let code_service = CodeService::default();
    let account_service = AccountService::default();
    let medical_record_service = MedicalRecordService::default();
    let schedule_service = ScheduleService::default();

    Server::builder()
        .add_service(AccountServer::new(account_service))
        .add_service(CodeServer::new(code_service))
        .add_service(MedicalRecordServer::new(medical_record_service))
        .add_service(ScheduleServer::new(schedule_service))
        .serve(addr).await?;

    Ok(())
}
