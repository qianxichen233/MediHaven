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
    pub schedule_id: i32,
    pub patient_id: i32,
    pub physician_id: i32,
    pub schedule_st: String,
    pub schedule_ed: String,
    pub created_at: String,
    pub description: String,
    pub patient_first_name: String,
    pub patient_last_name: String,
    pub patient_SSN: String,
    pub finished: i32,
}

pub struct physicianType {
    pub ID: i32,
    pub first_name: String,
    pub last_name: String,
    pub sex: String,
    pub department: String,
    pub title: String,
    pub email: String,
}

pub struct medicineType {
    pub name: String,
    pub instruction: String,
    pub description: String,
    pub medicine_type: String,
}
