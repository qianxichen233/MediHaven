use json::object;
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
        let failed_msg = Response::new(RecordResponse {
            records: vec![],
            msg: None,
        });

        let req = request.into_inner();
        println!("got request: {:?}", req);

        match req.auth {
            Some(auth) => {
                let plaintext = (
                    object! {
                    endpoint: "GET record",
                    patient_id: req.patient_id,
                    issuer_email: auth.issuer_email.clone(),
                    timestamp: auth.timestamp.clone()
                }
                ).dump();

                if
                    !myutils::verify_auth(
                        &auth.issuer_email,
                        &vec!["physician"],
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

        match globals::get_my_db_handler().get_record(req.patient_id) {
            Ok(result) => {
                // println!("{:?}", result);
                let mut response = vec![];

                for record in result.iter() {
                    let g_record = SingleRecord {
                        patient_id: record.patient_id,
                        physician_id: record.physician_id,
                        medicines: record.medicines.clone(),
                        complete_date: record.complete_date.clone(),
                        encounter_summary: record.encounter_summary.clone(),
                        diagnosis: record.diagnosis.clone(),
                    };
                    response.push(g_record);
                }

                return Ok(
                    Response::new(RecordResponse {
                        records: response,
                        msg: None,
                    })
                );
            }
            Err(err) => {
                eprintln!("Error: {}", err);
                return Ok(failed_msg);
            }
        }
    }

    async fn write_record(
        &self,
        request: Request<WriteRecordRequest>
    ) -> Result<Response<SuccessResponse>, Status> {
        let failed_msg = Response::new(SuccessResponse {
            successful: false,
            msg: None,
        });

        let req = request.into_inner();
        println!("got request: {:?}", req);

        match req.auth {
            Some(auth) => {
                let record = req.record.clone().unwrap();
                let plaintext = (
                    object! {
                    endpoint: "PUT record",
                    SSN: req.ssn.clone(),
                    patient_id: record.patient_id,
                    physician_id: record.physician_id,
                    medicines: record.medicines,
                    complete_date: record.complete_date,
                    encounter_summary: record.encounter_summary,
                    diagnosis: record.diagnosis,
                    issuer_email: auth.issuer_email.clone(),
                    timestamp: auth.timestamp.clone()
                }
                ).dump();

                if
                    !myutils::verify_auth(
                        &auth.issuer_email,
                        &vec!["physician"],
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

        let record = req.record.unwrap();
        let patient_id = record.patient_id.to_string();
        let physician_id = record.physician_id.to_string();
        let mut fields: HashMap<&str, &str> = HashMap::new();
        fields.insert("Patient_ID", &patient_id);
        fields.insert("Physician_ID", &physician_id);
        fields.insert("Complete_Date", &record.complete_date);
        fields.insert("Encounter_Summary", &record.encounter_summary);
        fields.insert("Diagnosis", &record.diagnosis);

        if let Err(err) = globals::get_my_db_handler().add_record(&fields, &record.medicines) {
            eprintln!("Error: {}", err);
            return Ok(failed_msg);
        }

        let reply = Response::new(SuccessResponse {
            successful: true,
            msg: None,
        });

        return Ok(reply);
    }
}
