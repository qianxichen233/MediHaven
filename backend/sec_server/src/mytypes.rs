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

pub struct scheduleType {
    pub patient_id: i32,
    pub physician_id: i32,
    pub schedule_st: String,
    pub schedule_ed: String,
    pub created_at: String,
    pub description: String,
    pub patient_first_name: String,
    pub patient_last_name: String,
}
