CREATE TABLE Department(
    Name VARCHAR(20),
    PRIMARY KEY(Name)
);

CREATE TABLE Medicine (
    Name VARCHAR(100),
    Instructions TEXT NOT NULL,
    Description TEXT NOT NULL,
    Expiration_Date DATE Not NULL,
    PRIMRY KEY(Name)
);

CREATE TABLE Insurance (
    ID VARCHAR(100),
    Company VARCHAR(100) NOT NULL,
    Price_Coverage FLOAT NOT NULL,
    Purchase_Date DATE NOT NULL,
    Expiration_Date DATE NOT NULL,
    Property TEXT NOT NULL,
    PRIMARY KEY(ID)
);

CREATE TABLE Administrator (
    ID VARCHAR(100),
    First_Name VARCHAR(100) NOT NULL,
    Last_Name VARCHAR(100) NOT NULL,
    Sex VARCHAR(20) NOT NULL,
    Age INT NOT NULL,
    Date_Of_Birth DATE NOT NULL,
    Phone_Number VARCHAR(100) NULL,
    Email VARCHAR(100) NOT NULL,
    PRIMARY KEY(ID)
);

CREATE TABLE Patient (
    ID VARCHAR(100),
    SSN VARCHAR(20) NOT NULL,
    First_Name VARCHAR(100) NOT NULL,
    Last_Name VARCHAR(100) NOT NULL,
    Insurance_ID VARCHAR(100) NOT NULL,
    Sex VARCHAR(20) NOT NULL,
    Age INT NOT NULL,
    Date_Of_Birth DATE NOT NULL,
    Phone_Number VARCHAR(100) NULL,
    Email VARCHAR(100) NOT NULL,
    PRIMARY KEY(ID),
    FOREIGN KEY(Insurance_ID) REFERENCES Insurance(ID)
);


CREATE TABLE Medicine_Treat (
    ID VARCHAR(100),
    Medicine_Name VARCHAR(100) NOT NULL,
    Production_Date DATE NOT NULL,
    Expiration_Date DATE NOT NULL,
    PRIMARY KEY(ID),
    FOREIGN KEY(Medicine_Name) REFERENCES Medicine(Name)
);

CREATE TABLE Physician (
    ID VARCHAR(100),
    SSN VARCHAR(20) NOT NULL,
    password VARCHAR(200) NOT NULL,
    First_Name VARCHAR(100) NOT NULL,
    Last_Name VARCHAR(100) NOT NULL,
    Sex VARCHAR(20) NOT NULL,
    Department VARCHAR(20) NOT NULL,
    Title VARCHAR(20) NOT NULL,
    Age INT NOT NULL,
    Date_Of_Birth DATE NOT NULL,
    Phone_Number VARCHAR(100) NULL,
    Email VARCHAR(100) NOT NULL,
    PRIMARY KEY(ID),
    FOREIGN KEY(Department) REFERENCES Department(Name)
);

CREATE TABLE Medical_Record (
    ID VARCHAR(100),
    Patient_ID VARCHAR(100) NOT NULL,
    Physician_ID VARCHAR(100) NOT NULL,
    Medicine_ID VARCHAR(100) NOT NULL,
    Insurance_ID VARCHAR(100) NOT NULL,
    Complete_Date DATE NOT NULL,
    Encounter_Summary TEXT NOT NULL,
    Diagnosis TEXT NOT NULL,
    PRIMARY KEY(ID),
    FOREIGN KEY(Patient_ID) REFERENCES Patient(ID),
    FOREIGN KEY(Physician_ID) REFERENCES Physician(ID),
    FOREIGN KEY(Medicine_ID) REFERENCES Medicine_Treat(ID),
    FOREIGN KEY(Insurance_ID) REFERENCES Insurance(ID)
);


