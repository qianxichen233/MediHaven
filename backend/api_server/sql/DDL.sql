CREATE TABLE mykeys (
    key_ID INT NOT NULL AUTO_INCREMENT,
    key_type VARCHAR(20),
    ekey BLOB NOT NULL,
    nonce BLOB NOT NULL,
    PRIMARY KEY(key_id)
);

CREATE TABLE Department(
    Name VARCHAR(50),
    PRIMARY KEY(Name)
);

CREATE TABLE Medicine (
    Name VARCHAR(100),
    Instructions TEXT NOT NULL,
    Description TEXT NOT NULL,
    Type VARCHAR(100) NOT NULL,
    PRIMARY KEY(Name)
);

CREATE TABLE Insurance (
    ID INT NOT NULL AUTO_INCREMENT,
    Company VARCHAR(100) NOT NULL,
    Price_Coverage FLOAT NOT NULL,
    Purchase_Date DATE NOT NULL,
    Expiration_Date DATE NOT NULL,
    Property TEXT NOT NULL,
    PRIMARY KEY(ID)
);

ALTER TABLE Insurance AUTO_INCREMENT = 1;

CREATE TABLE Administrator (
    ID INT NOT NULL AUTO_INCREMENT,
    First_Name VARCHAR(100) NOT NULL,
    Last_Name VARCHAR(100) NOT NULL,
    Sex VARCHAR(20) NOT NULL,
    Age INT NOT NULL,
    Date_Of_Birth DATE NOT NULL,
    Phone_Number VARCHAR(100) NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Pub_key VARCHAR(1000) NOT NULL,
    Magic BLOB NOT NULL,
    PRIMARY KEY(ID)
);

CREATE TABLE Patient (
    ID INT NOT NULL AUTO_INCREMENT,
    SSN VARCHAR(20) NOT NULL UNIQUE,
    First_Name BLOB NOT NULL,
    Last_Name BLOB NOT NULL,
    Insurance_ID INT NOT NULL,
    Sex BLOB NOT NULL,
    Date_Of_Birth BLOB NOT NULL,
    Phone_Number BLOB,
    Email BLOB,
    nonce BLOB NOT NULL,
    Key_ID INT NOT NULL,
    PRIMARY KEY(ID),
    FOREIGN KEY(Insurance_ID) REFERENCES Insurance(ID),
    FOREIGN KEY(Key_ID) REFERENCES mykeys(Key_ID)
);

CREATE TABLE Physician (
    ID INT NOT NULL AUTO_INCREMENT,
    First_Name VARCHAR(100) NOT NULL,
    Last_Name VARCHAR(100) NOT NULL,
    Sex VARCHAR(20) NOT NULL,
    Department VARCHAR(20) NOT NULL,
    Title VARCHAR(20) NOT NULL,
    Date_Of_Birth DATE NOT NULL,
    Phone_Number VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Pub_key VARCHAR(1000) NOT NULL,
    Magic BLOB NOT NULL,
    PRIMARY KEY(ID),
    FOREIGN KEY(Department) REFERENCES Department(Name)
);

CREATE TABLE Medical_Record (
    ID INT NOT NULL AUTO_INCREMENT,
    Patient_ID INT NOT NULL,
    Physician_ID INT NOT NULL,
    Complete_Date BLOB NOT NULL,
    Encounter_Summary BLOB NOT NULL,
    Diagnosis BLOB NOT NULL,
    nonce BLOB NOT NULL,
    Key_ID INT NOT NULL,
    PRIMARY KEY(ID),
    FOREIGN KEY(Patient_ID) REFERENCES Patient(ID),
    FOREIGN KEY(Physician_ID) REFERENCES Physician(ID),
    FOREIGN KEY(Key_ID) REFERENCES mykeys(Key_ID)
);

CREATE TABLE Medicine_Treat (
    ID INT NOT NULL AUTO_INCREMENT,
    Medicine_Name VARCHAR(100) NOT NULL,
    Record_ID INT NOT NULL,
    PRIMARY KEY(ID),
    FOREIGN KEY(Medicine_Name) REFERENCES Medicine(Name),
    FOREIGN KEY(Record_ID) REFERENCES Medical_Record(ID)
);

CREATE TABLE register_code (
    CODE VARCHAR(100),
    Account_type  VARCHAR(20) NOT NULL,
    Expiration_Date DATE NOT NULL,
    Issuer VARCHAR(100) NOT NULL,
    Magic BLOB NOT NULL,
    PRIMARY KEY(CODE),
    FOREIGN KEY(issuer) REFERENCES Administrator(Email),
    CHECK (
        Account_type IN ("admin", "physician")
    )
);

CREATE TABLE schedule (
    ID INT NOT NULL AUTO_INCREMENT,
    patient_ID INT NOT NULL,
    physician_ID INT NOT NULL,
    schedule_st DATETIME NOT NULL,
    schedule_ed DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    description BLOB NOT NULL,
    nonce BLOB NOT NULL,
    Key_ID BLOB NOT NULL,
    PRIMARY KEY(ID),
    FOREIGN KEY(patient_ID) REFERENCES Patient(ID),
    FOREIGN KEY(physician_ID) REFERENCES Physician(ID)
);