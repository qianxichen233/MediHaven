use anyhow::Error;
use odbc_api::{Cursor, Environment, ConnectionOptions};

fn main() -> Result<(), Error> {
    let env = Environment::new()?;

    let connection_string = "Driver={MariaDB ODBC Driver};Server=localhost;Port=3306;Database=mediheaven;UID=root;PWD=";

    
    let mut conn = env.connect_with_connection_string(connection_string, ConnectionOptions::default())?;

    if let Some(mut cursor) = conn.execute("SELECT @@version", ())? {
        let mut row = cursor.next_row()?.unwrap();
        let mut buf: Vec<u8> = Vec::new();
        row.get_text(1, &mut buf)?;
        println!("{:?}", String::from_utf8(buf));
    }

    Ok(())
}