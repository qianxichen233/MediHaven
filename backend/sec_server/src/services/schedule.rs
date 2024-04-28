use json::object;
use crate::mediheaven::FinishScheduleRequest;
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
    SingleSchedule,
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
        println!("got message: {:?}", request);

        let failed_msg = Response::new(ScheduleResponse {
            schedules: vec![],
            msg: None,
        });

        let req = request.into_inner();

        match req.auth {
            Some(auth) => {
                let plaintext = (
                    object! {
                    endpoint: "GET schedule",
                    email: req.email.clone(),
                    timestamp_st: req.timestamp_st.clone(),
                    timestamp_ed: req.timestamp_ed.clone(),
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

        match
            globals
                ::get_my_db_handler()
                .get_schedule(&req.email, &req.timestamp_st, &req.timestamp_ed)
        {
            Ok(result) => {
                let reply = ScheduleResponse {
                    schedules: result
                        .iter()
                        .map(|schedule| SingleSchedule {
                            patient_id: schedule.patient_id,
                            physician_id: schedule.physician_id,
                            schedule_st: schedule.schedule_st.clone(),
                            schedule_ed: schedule.schedule_ed.clone(),
                            created_at: schedule.created_at.clone(),
                            description: schedule.description.clone(),
                            patient_first_name: Some(schedule.patient_first_name.clone()),
                            patient_last_name: Some(schedule.patient_last_name.clone()),
                            patient_ssn: Some(schedule.patient_SSN.clone()),
                            schedule_id: Some(schedule.schedule_id),
                            finished: Some(schedule.finished),
                        })
                        .collect(),
                    msg: None,
                };

                return Ok(Response::new(reply));
            }
            Err(err) => {
                println!("Error: {:?}", err);
                return Ok(failed_msg);
            }
        }
    }

    async fn finish_schedule(
        &self,
        request: Request<FinishScheduleRequest>
    ) -> Result<Response<SuccessResponse>, Status> {
        println!("got message: {:?}", request);

        let req = request.into_inner();

        let failed_msg = Response::new(SuccessResponse {
            successful: false,
            msg: None,
        });

        match req.auth {
            Some(auth) => {
                let plaintext = (
                    object! {
                    endpoint: "POST schedule",
                    schedule_ID: req.schedule_id,
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

                if
                    let Err(err) = globals
                        ::get_my_db_handler()
                        .finish_schedule(&req.schedule_id, &auth.issuer_email)
                {
                    eprintln!("Error: {}", err);
                    return Ok(failed_msg);
                }
            }
            None => {
                return Ok(failed_msg);
            }
        }

        let reply = Response::new(SuccessResponse {
            successful: true,
            msg: None,
        });

        Ok(reply)
    }
}
