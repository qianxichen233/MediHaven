use chrono::{ DateTime, Local, NaiveDateTime };

pub fn verify_timestamp(timestamp_str: &str, expire: i64) -> bool {
    let timestamp;

    match NaiveDateTime::parse_from_str(timestamp_str, "%Y-%m-%d %H:%M:%S") {
        Ok(time) => {
            timestamp = DateTime::<Local>::from_utc(time, *Local::now().offset());
        }
        Err(_) => {
            return false;
        }
    }

    let current_time = Local::now();

    let duration = current_time.signed_duration_since(timestamp);

    return duration.num_minutes() <= expire;
}
