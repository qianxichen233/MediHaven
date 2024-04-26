use crate::mediheaven::misc_server::Misc;
use crate::myutils;
use crate::globals;

use std::collections::HashMap;

use tonic::{ Request, Response, Status };

use crate::mediheaven::{ GetMedicinesRequest, SingleMedicine, MedicinesResponse };

#[derive(Debug, Default)]
pub struct MiscService {}

#[tonic::async_trait]
impl Misc for MiscService {
    async fn get_medicines(
        &self,
        request: Request<GetMedicinesRequest>
    ) -> Result<Response<MedicinesResponse>, Status> {
        let req = request.into_inner();

        let failed_msg = Response::new(MedicinesResponse {
            medicines: vec![],
        });

        match globals::get_my_db_handler().get_medicines(&req.r#type) {
            Ok(result) => {
                let reply = MedicinesResponse {
                    medicines: result
                        .iter()
                        .map(|medicine| SingleMedicine {
                            name: medicine.name.clone(),
                            instruction: medicine.instruction.clone(),
                            description: medicine.description.clone(),
                            r#type: medicine.medicine_type.clone(),
                        })
                        .collect(),
                };

                return Ok(Response::new(reply));
            }
            Err(err) => {
                println!("Error: {:?}", err);
                return Ok(failed_msg);
            }
        }
    }
}
