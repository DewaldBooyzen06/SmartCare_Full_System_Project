import os
import sqlite3
from datetime import datetime

# Connection parameters for Microsoft SQL Server
DB_SERVER = os.getenv("DB_SERVER", "localhost")
DB_DATABASE = os.getenv("DB_DATABASE", "SmartCareDB")
DB_USERNAME = os.getenv("DB_USERNAME", "sa")
DB_PASSWORD = os.getenv("DB_PASSWORD", "SmartCare2026!")
USE_SQL_SERVER = os.getenv("USE_SQL_SERVER", "False").lower() in ("true", "1", "yes")

def get_connection():
    """Establishes connection to SQL Server, or SQLite fallback."""
    if USE_SQL_SERVER:
        try:
            import pyodbc
            conn_str = (
                f"DRIVER={{ODBC Driver 18 for SQL Server}};"
                f"SERVER={DB_SERVER};"
                f"DATABASE={DB_DATABASE};"
                f"UID={DB_USERNAME};"
                f"PWD={DB_PASSWORD};"
                f"TrustServerCertificate=yes;"
            )
            return pyodbc.connect(conn_str)
        except Exception as e:
            print(f"[SmartCare DB Warning] Could not connect to SQL Server ({e}). Falling back to SQLite.")

    # SQLite fallback
    db_path = os.path.join(os.path.dirname(__file__), "smartcare_local.db")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes tables and seed data if not present."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Users (
        UserID INTEGER PRIMARY KEY AUTOINCREMENT,
        Username TEXT UNIQUE NOT NULL,
        PasswordHash TEXT NOT NULL,
        Role TEXT NOT NULL,
        FullName TEXT NOT NULL
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Patients (
        PatientNumber TEXT PRIMARY KEY,
        FirstName TEXT NOT NULL,
        LastName TEXT NOT NULL,
        IDNumber TEXT UNIQUE NOT NULL,
        DateOfBirth TEXT NOT NULL,
        Gender TEXT NOT NULL,
        ContactNumber TEXT NOT NULL,
        Email TEXT NOT NULL,
        ResidentialAddress TEXT NOT NULL,
        MedicalAidProvider TEXT,
        MedicalAidNumber TEXT,
        EmergencyContact TEXT NOT NULL,
        RegistrationDate TEXT NOT NULL,
        BloodType TEXT,
        Allergies TEXT,
        ChronicConditions TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Doctors (
        DoctorID INTEGER PRIMARY KEY AUTOINCREMENT,
        FullName TEXT NOT NULL,
        Specialisation TEXT NOT NULL,
        PhoneNumber TEXT NOT NULL,
        Email TEXT NOT NULL,
        RoomNumber TEXT NOT NULL,
        Status TEXT NOT NULL DEFAULT 'Available'
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Appointments (
        AppointmentNumber INTEGER PRIMARY KEY AUTOINCREMENT,
        AppointmentDate TEXT NOT NULL,
        AppointmentTime TEXT NOT NULL,
        DoctorID INTEGER NOT NULL,
        PatientNumber TEXT NOT NULL,
        AppointmentStatus TEXT NOT NULL DEFAULT 'Booked',
        Notes TEXT,
        FOREIGN KEY (DoctorID) REFERENCES Doctors (DoctorID),
        FOREIGN KEY (PatientNumber) REFERENCES Patients (PatientNumber),
        UNIQUE (DoctorID, AppointmentDate, AppointmentTime)
    )
    """)

    # Seed Users if empty
    cursor.execute("SELECT COUNT(*) FROM Users")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO Users (Username, PasswordHash, Role, FullName) VALUES
        ('admin', 'pbkdf2:sha256:600000$c4ca4238a0b923820dcc509a6f75849b$a8b29c9e8d47b5930129fec84920485920394857291039485720194857291039', 'Administrator', 'Sister Martha Khumalo'),
        ('reception', 'pbkdf2:sha256:600000$c81e728d9d4c2f636f067f89cc14862c$b7c30d0f9e58c6041230afd95031596031405968302140596831205968302140', 'Receptionist', 'Kagiso Modise'),
        ('dr_thorne', 'pbkdf2:sha256:600000$eccbc87e4b5ce2fe28308fd9f2a7baf3$c8d41e10af69d7152341b0ea6142607142516079413251607942316079413251', 'Doctor', 'Dr. Aris Thorne')
        """)

    # Seed Doctors if empty
    cursor.execute("SELECT COUNT(*) FROM Doctors")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO Doctors (FullName, Specialisation, PhoneNumber, Email, RoomNumber, Status) VALUES
        ('Dr. Aris Thorne', 'Cardiology & Internal Medicine', '+27 11 555 0192', 'a.thorne@smartcare.co.za', 'Consultation Suite 4A', 'Available'),
        ('Dr. Evelyn Vance', 'General & Family Medicine', '+27 11 555 0193', 'e.vance@smartcare.co.za', 'Exam Room 3', 'Consulting'),
        ('Dr. Lerato Sithole', 'Pediatrics & Child Health', '+27 11 555 0194', 'l.sithole@smartcare.co.za', 'Paediatric Wing 1B', 'Available'),
        ('Dr. David Mwangi', 'Clinical Endocrinology', '+27 11 555 0195', 'd.mwangi@smartcare.co.za', 'Suite 2C', 'Ward Rounds')
        """)

    # Seed Patients if empty
    cursor.execute("SELECT COUNT(*) FROM Patients")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO Patients (
            PatientNumber, FirstName, LastName, IDNumber, DateOfBirth, Gender, 
            ContactNumber, Email, ResidentialAddress, MedicalAidProvider, MedicalAidNumber, 
            EmergencyContact, RegistrationDate, BloodType, Allergies, ChronicConditions
        ) VALUES
        ('10048291', 'Thabo', 'Molefe', '8904125028087', '1989-04-12', 'Male', '+27 82 459 2831', 'thabo.molefe@gmail.com', '42 West Street, Sandton, Johannesburg', 'Discovery Health', 'DISC-904812-01', 'Nomsa Molefe (+27 82 459 2830)', '2026-01-15', 'O+', 'Penicillin, Shellfish', 'Hypertension (Stage 1)'),
        ('10048292', 'Sarah', 'Van Der Merwe', '9208230192084', '1992-08-23', 'Female', '+27 71 839 1048', 'sarah.vdm@outlook.com', '15 Protea Avenue, Rosebank, Johannesburg', 'Bonitas Medical Fund', 'BON-394019-A', 'Pieter Van Der Merwe (+27 71 839 1049)', '2026-02-01', 'A+', 'None Known', 'None'),
        ('10048293', 'Sipho', 'Dlamini', '8511055019082', '1985-11-05', 'Male', '+27 83 920 4819', 'sipho.dlamini@business.za', '88 Rivonia Road, Morningside, Sandton', 'Momentum Health', 'MOM-88201-B', 'Zanele Dlamini (+27 83 920 4820)', '2026-02-18', 'B+', 'Aspirin', 'Type 2 Diabetes Mellitus'),
        ('10048294', 'Amina', 'Patel', '9603140198081', '1996-03-14', 'Female', '+27 76 102 9481', 'amina.patel@webmail.co.za', '104 7th Avenue, Parkhurst, Johannesburg', 'Discovery Health', 'DISC-774920-03', 'Farook Patel (+27 76 102 9482)', '2026-03-02', 'AB-', 'Sulfa antibiotics', 'Mild Asthma')
        """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("SmartCare database initialized successfully.")
