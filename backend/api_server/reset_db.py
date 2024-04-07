import pyodbc
import re

connection_string = "Driver={MariaDB ODBC Driver};Server=localhost;Port=3306;Database=mediheaven;UID=root;PWD="


def execute_sql_file(sql_file, conn):
    # Read SQL file
    with open(sql_file, "r") as file:
        sql_script = file.read()

    try:
        # Create cursor
        cursor = conn.cursor()

        # Execute SQL commands
        for statment in re.split(r";\s*\n", sql_script):
            statment = statment.strip()
            if statment == "":
                continue
            cursor.execute(statment + ";")

        conn.commit()

        print(f"SQL script ({sql_file}) executed successfully")

    except Exception as e:
        print("Error executing SQL script:", e)
        conn.rollback()


conn = pyodbc.connect(
    "Driver={MariaDB ODBC Driver};Server=localhost;Port=3306;Database=mediheaven;UID=root;PWD="
)

execute_sql_file("./sql/clear.sql", conn)
execute_sql_file("./sql/DDL.sql", conn)
execute_sql_file("./sql/inserts.sql", conn)

conn.close()
