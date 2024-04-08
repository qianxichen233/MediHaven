use lazy_static::lazy_static;
use std::collections::HashMap;

lazy_static! {
    pub static ref MAGIC_KEYS: HashMap<&'static str, Vec<&'static str>> = {
        let mut map = HashMap::new();
        map.insert("Administrator",
                    vec!["First_Name",
                        "Last_Name",
                        "Sex",
                        "Age",
                        "Date_Of_Birth",
                        "Phone_Number",
                        "Email",
                        "Pub_key"]
        );

        map.insert("Physician",
                    vec!["First_Name",
                        "Last_Name",
                        "Sex",
                        "Department",
                        "Title",
                        "Date_Of_Birth",
                        "Phone_Number",
                        "Email",
                        "Pub_key"]
        );

        map.insert("register_code",
                    vec!["CODE",
                        "Account_type",
                        "Expiration_Date",
                        "Issuer"]
        );
        
        map
    };
}
