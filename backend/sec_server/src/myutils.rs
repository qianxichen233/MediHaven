use chrono::{ DateTime, Local, NaiveDateTime };
use rand::Rng;

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

pub fn verify_date(date: &str) -> bool {
    return verify_timestamp(&(date.to_owned() + " 23:59:59"), 0);
}

pub fn generate_code() -> String {
    const CHARSET: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let mut rng = rand::thread_rng();
    let code: String = (0..64)
        .map(|_| {
            let idx = rng.gen_range(0..CHARSET.len());
            CHARSET[idx] as char
        })
        .collect();
    code
}
