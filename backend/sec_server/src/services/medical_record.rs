use json::object;
use crate::mycrypto::MyCrypto;
use crate::myutils;
use crate::globals;

use std::collections::HashMap;

use tonic::{ Request, Response, Status };

use crate::mediheaven::{
    GetRecordRequest,
    RecordResponse,
    WriteRecordRequest,
    SuccessResponse,
    SingleRecord,
    medical_record_server::MedicalRecord,
};

#[derive(Debug, Default)]
pub struct MedicalRecordService {}

#[tonic::async_trait]
impl MedicalRecord for MedicalRecordService {
    async fn get_record(
        &self,
        request: Request<GetRecordRequest>
    ) -> Result<Response<RecordResponse>, Status> {
        todo!()
    }

    async fn write_record(
        &self,
        request: Request<WriteRecordRequest>
    ) -> Result<Response<SuccessResponse>, Status> {
        todo!()
    }
}
