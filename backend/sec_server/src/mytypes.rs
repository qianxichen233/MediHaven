pub struct codeType {
    pub code: String,
    pub Account_type: String,
    pub Expiration_Date: String,
}

pub struct recordType {
    pub patient_id: i32,
    pub physician_id: i32,
    pub medicines: Vec<String>,
    pub complete_date: String,
    pub encounter_summary: String,
    pub diagnosis: String,
}
