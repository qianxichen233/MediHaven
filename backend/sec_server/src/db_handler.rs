// fn create_insert_sql(table: &str, fields: &Vec<&str>) -> String {
//     let sql = String::from("INSERT INTO ");
//     let val = String::from("");
//     sql += table + "(";
//     for (index, field) in fields.iter().enumerate() {
//         sql += field;
//         val += "?";
//         if index != fields.len() - 1 {
//             sql += ", ";
//             val += ", ";
//         }
//     }
//     sql += ") VALUES (" + val + ")";
//     return sql;
// }

// fn create_select_sql(table: &str, fields: &Vec<&str>) -> String {
//     let sql = String::from("SELECT FROM ");
//     let val = String::from("");
//     sql += table + "(";
//     for (index, field) in fields.iter().enumerate() {
//         sql += field;
//         val += "?";
//         if index != fields.len() - 1 {
//             sql += ", ";
//             val += ", ";
//         }
//     }
//     sql += ") VALUES (" + val + ")";
//     return sql;
// }

// struct DB_Table {
//     table: &str,
//     fields: &Vec<&str>,
//     insert_sql: &str,
//     select_sql: &str
// }

// impl DB_Table {
//     pub fn new(table: &str, fields: &Vec<&str>) -> Self {
//         Self {
//             table,
//             fields,
//             insert_sql: create_insert_sql(table, fields)

//         }
//     }
// }

use odbc_api::{ Connection, ConnectionOptions, Cursor, Environment, IntoParameter };
use anyhow::Error;
use std::collections::HashMap;
use lazy_static::lazy_static;

lazy_static! {
    static ref MYENV: Environment = Environment::new().unwrap();
}

pub struct DBHandler<'a> {
    // env: Environment,
    connection: Connection<'a>,
    MAC_Key: Option<Vec<u8>>,
}
pub enum DBVALUE {
    StringVal(String),
    IntVal(i32),
}

impl DBHandler<'_> {
    pub fn new() -> Result<Self, Error> {
        let connection_string =
            "Driver={MariaDB ODBC Driver};Server=localhost;Port=3306;Database=mediheaven;UID=root;PWD=";
        Ok(Self {
            // env: *my_env,
            connection: MYENV.connect_with_connection_string(
                connection_string,
                ConnectionOptions::default()
            )?,
            MAC_Key: None,
        })
    }

    // fn create_param(&self, fields: &HashMap<&str, &DBVALUE>) -> ()

    pub fn init(&self) -> Result<(), Error> {
        // self.env = Some(Environment::new()?);

        // let connection_string =
        //     "Driver={MariaDB ODBC Driver};Server=localhost;Port=3306;Database=mediheaven;UID=root;PWD=";

        // self.connection = Some(
        //     self.env.connect_with_connection_string(
        //         connection_string,
        //         ConnectionOptions::default()
        //     )?
        // );

        /*
        to-do: get MAC Key
        */

        Ok(())
    }

    pub fn register_admin(&self, fields: &HashMap<&str, &str>) -> Result<(), Error> {
        let sql =
            "INSERT INTO Administrator(First_Name, Last_Name, Sex, Age, Date_Of_Birth, Phone_Number, Email, Pub_key, Magic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        let keys = vec![
            "First_Name",
            "Last_Name",
            "Sex",
            "Age",
            "Date_Of_Birth",
            "Phone_Number",
            "Email",
            "Pub_key",
            "Magic"
        ];

        let params = (
            &fields["First_Name"].into_parameter(),
            &fields["Last_Name"].into_parameter(),
            &fields["Sex"].into_parameter(),
            &fields["Age"].into_parameter(),
            &fields["Date_Of_Birth"].into_parameter(),
            &fields["Phone_Number"].into_parameter(),
            &fields["Email"].into_parameter(),
            &fields["Pub_key"].into_parameter(),
            &fields["Magic"].into_parameter(),
        );

        // let get_ordered_values = |keys: &[&str], map: &HashMap<&str, &DBVALUE>| -> Vec<&DBVALUE> {
        //     let mut values = Vec::with_capacity(keys.len());
        //     for key in keys {
        //         if let Some(&value) = map.get(key) {
        //             values.push(value);
        //         }
        //     }
        //     values
        // };

        // let params = get_ordered_values(&keys, fields).into_iter().collect_tuple().unwrap();

        // let params = (&fields["First_Name"].into_parameter(), &fields["First_Name"].into_parameter(), &fields["First_Name"].into_parameter(), &fields["First_Name"].into_parameter(), &fields["First_Name"].into_parameter(), &fields["First_Name"].into_parameter());
        println!("in db handler: {:?}", fields);

        if let Some(mut cursor) = self.connection.execute(&sql, params)? {
            println!("success!");
            let mut row = cursor.next_row()?.unwrap();
            let mut buf: Vec<u8> = Vec::new();
            row.get_text(1, &mut buf)?;
            println!("{:?}", String::from_utf8(buf));
        }

        Ok(())
    }
}
