use json::object;
use crate::myutils;
use crate::globals;

use std::collections::HashMap;

use tonic::{ Request, Response, Status };

use crate::mediheaven::{
    AddScheduleRequest,
    GetScheduleRequest,
    ScheduleResponse,
    schedule_server::Schedule,
    SuccessResponse,
};

#[derive(Debug, Default)]
pub struct ScheduleService {}

#[tonic::async_trait]
impl Schedule for ScheduleService {
    async fn add_schedule(
        &self,
        request: Request<AddScheduleRequest>
    ) -> Result<Response<SuccessResponse>, Status> {
        println!("got message: {:?}", request);

        let req = request.into_inner();

        let failed_msg = Response::new(SuccessResponse {
            successful: false,
            msg: None,
        });

        match req.auth {
            Some(auth) => {
                let schedule = req.schedule.clone().unwrap();
                let plaintext = (
                    object! {
                    endpoint: "PUT schedule",
                    patient_ID: schedule.patient_id,
                    physician_ID: schedule.physician_id,
                    schedule_st: schedule.schedule_st,
                    schedule_ed: schedule.schedule_ed,
                    created_at: schedule.created_at,
                    description: schedule.description,
                    issuer_email: auth.issuer_email.clone(),
                    timestamp: auth.timestamp.clone()
                }
                ).dump();

                if
                    !myutils::verify_auth(
                        &auth.issuer_email,
                        "physician",
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
        let schedule = req.schedule.unwrap();
        let patient_id = schedule.patient_id.to_string();
        let physician_id = schedule.physician_id.to_string();

        let mut fields: HashMap<&str, &str> = HashMap::new();
        fields.insert("patient_ID", &patient_id);
        fields.insert("physician_ID", &physician_id);
        fields.insert("schedule_st", &schedule.schedule_st);
        fields.insert("schedule_ed", &schedule.schedule_ed);
        fields.insert("created_at", &schedule.created_at);
        fields.insert("description", &schedule.description);

        if let Err(err) = globals::get_my_db_handler().add_schedule(&fields) {
            eprintln!("Error: {}", err);
            return Ok(failed_msg);
        }

        let reply = Response::new(SuccessResponse {
            successful: true,
            msg: None,
        });

        Ok(reply)
    }

    async fn get_schedule(
        &self,
        request: Request<GetScheduleRequest>
    ) -> Result<Response<ScheduleResponse>, Status> {
        todo!()
    }
}
