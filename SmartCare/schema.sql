IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SmartCareDB')
BEGIN
    CREATE DATABASE SmartCareDB;
END
GO

USE SmartCareDB;
GO

-- 1. Patients Table
IF OBJECT_ID('dbo.Patients', 'U') IS NOT NULL DROP TABLE dbo.Patients;
GO
CREATE TABLE dbo.Patients (
    PatientNumber CHAR(8) NOT NULL PRIMARY KEY,
    FirstName VARCHAR(60) NOT NULL,
    LastName VARCHAR(60) NOT NULL,
    IDNumber VARCHAR(13) NOT NULL UNIQUE,
    DateOfBirth DATE NOT NULL,
    Gender VARCHAR(20) NOT NULL,
    ContactNumber VARCHAR(20) NOT NULL,
    Email VARCHAR(120) NOT NULL,
    ResidentialAddress VARCHAR(255) NOT NULL,
    MedicalAidProvider VARCHAR(80) NULL,
    MedicalAidNumber VARCHAR(40) NULL,
    EmergencyContact VARCHAR(100) NOT NULL,
    RegistrationDate DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    BloodType VARCHAR(10) NULL,
    Allergies VARCHAR(255) NULL,
    ChronicConditions VARCHAR(255) NULL,
    CONSTRAINT CK_PatientNumber_8Digits CHECK (LEN(PatientNumber) = 8 AND ISNUMERIC(PatientNumber) = 1),
    CONSTRAINT CK_IDNumber_13Digits CHECK (LEN(IDNumber) = 13 AND ISNUMERIC(IDNumber) = 1)
);
GO

-- 2. Doctors Table
IF OBJECT_ID('dbo.Doctors', 'U') IS NOT NULL DROP TABLE dbo.Doctors;
GO
CREATE TABLE dbo.Doctors (
    DoctorID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Specialisation VARCHAR(80) NOT NULL,
    PhoneNumber VARCHAR(20) NOT NULL,
    Email VARCHAR(120) NOT NULL,
    RoomNumber VARCHAR(20) NOT NULL,
    Status VARCHAR(30) NOT NULL DEFAULT 'Available',
    CONSTRAINT CK_Doctor_Status CHECK (Status IN ('Available', 'Consulting', 'Ward Rounds', 'Off Duty'))
);
GO

-- 3. Appointments Table (With Double-Booking Prevention)
IF OBJECT_ID('dbo.Appointments', 'U') IS NOT NULL DROP TABLE dbo.Appointments;
GO
CREATE TABLE dbo.Appointments (
    AppointmentNumber INT IDENTITY(1001,1) NOT NULL PRIMARY KEY,
    AppointmentDate DATE NOT NULL,
    AppointmentTime VARCHAR(5) NOT NULL,
    DoctorID INT NOT NULL,
    PatientNumber CHAR(8) NOT NULL,
    AppointmentStatus VARCHAR(20) NOT NULL DEFAULT 'Booked',
    Notes VARCHAR(500) NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Appointment_Doctor FOREIGN KEY (DoctorID) REFERENCES dbo.Doctors(DoctorID),
    CONSTRAINT FK_Appointment_Patient FOREIGN KEY (PatientNumber) REFERENCES dbo.Patients(PatientNumber),
    CONSTRAINT CK_Appointment_Status CHECK (AppointmentStatus IN ('Booked', 'Completed', 'Cancelled')),
    CONSTRAINT UQ_Doctor_DateTime UNIQUE (DoctorID, AppointmentDate, AppointmentTime)
);
GO

-- 4. Users Table (Authentication & RBAC)
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;
GO
CREATE TABLE dbo.Users (
    UserID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(30) NOT NULL,
    FullName VARCHAR(100) NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT CK_User_Role CHECK (Role IN ('Administrator', 'Doctor', 'Receptionist'))
);
GO

-- Indexes for rapid lookup
CREATE NONCLUSTERED INDEX IX_Appointments_Date ON dbo.Appointments(AppointmentDate);
CREATE NONCLUSTERED INDEX IX_Appointments_Patient ON dbo.Appointments(PatientNumber);
CREATE NONCLUSTERED INDEX IX_Appointments_Doctor ON dbo.Appointments(DoctorID);
GO

-- Seed Data: Users
-- Default passwords: 'admin123', 'reception123', 'doctor123'
INSERT INTO dbo.Users (Username, PasswordHash, Role, FullName)
VALUES 
('admin', 'pbkdf2:sha256:600000$c4ca4238a0b923820dcc509a6f75849b$a8b29c9e8d47b5930129fec84920485920394857291039485720194857291039', 'Administrator', 'Sister Martha Khumalo'),
('reception', 'pbkdf2:sha256:600000$c81e728d9d4c2f636f067f89cc14862c$b7c30d0f9e58c6041230afd95031596031405968302140596831205968302140', 'Receptionist', 'Kagiso Modise'),
('dr_thorne', 'pbkdf2:sha256:600000$eccbc87e4b5ce2fe28308fd9f2a7baf3$c8d41e10af69d7152341b0ea6142607142516079413251607942316079413251', 'Doctor', 'Dr. Aris Thorne');
GO

-- Seed Data: Doctors
INSERT INTO dbo.Doctors (FullName, Specialisation, PhoneNumber, Email, RoomNumber, Status)
VALUES
('Dr. Aris Thorne', 'Cardiology & Internal Medicine', '+27 11 555 0192', 'a.thorne@smartcare.co.za', 'Consultation Suite 4A', 'Available'),
('Dr. Evelyn Vance', 'General & Family Medicine', '+27 11 555 0193', 'e.vance@smartcare.co.za', 'Exam Room 3', 'Consulting'),
('Dr. Lerato Sithole', 'Pediatrics & Child Health', '+27 11 555 0194', 'l.sithole@smartcare.co.za', 'Paediatric Wing 1B', 'Available'),
('Dr. David Mwangi', 'Clinical Endocrinology', '+27 11 555 0195', 'd.mwangi@smartcare.co.za', 'Suite 2C', 'Ward Rounds');
GO

-- Seed Data: Patients
INSERT INTO dbo.Patients (
    PatientNumber, FirstName, LastName, IDNumber, DateOfBirth, Gender, 
    ContactNumber, Email, ResidentialAddress, MedicalAidProvider, MedicalAidNumber, 
    EmergencyContact, RegistrationDate, BloodType, Allergies, ChronicConditions
)
VALUES
('10048291', 'Thabo', 'Molefe', '8904125028087', '1989-04-12', 'Male', '+27 82 459 2831', 'thabo.molefe@gmail.com', '42 West Street, Sandton, Johannesburg', 'Discovery Health', 'DISC-904812-01', 'Nomsa Molefe (+27 82 459 2830)', '2026-01-15', 'O+', 'Penicillin, Shellfish', 'Hypertension (Stage 1)'),
('10048292', 'Sarah', 'Van Der Merwe', '9208230192084', '1992-08-23', 'Female', '+27 71 839 1048', 'sarah.vdm@outlook.com', '15 Protea Avenue, Rosebank, Johannesburg', 'Bonitas Medical Fund', 'BON-394019-A', 'Pieter Van Der Merwe (+27 71 839 1049)', '2026-02-01', 'A+', 'None Known', 'None'),
('10048293', 'Sipho', 'Dlamini', '8511055019082', '1985-11-05', 'Male', '+27 83 920 4819', 'sipho.dlamini@business.za', '88 Rivonia Road, Morningside, Sandton', 'Momentum Health', 'MOM-88201-B', 'Zanele Dlamini (+27 83 920 4820)', '2026-02-18', 'B+', 'Aspirin', 'Type 2 Diabetes Mellitus'),
('10048294', 'Amina', 'Patel', '9603140198081', '1996-03-14', 'Female', '+27 76 102 9481', 'amina.patel@webmail.co.za', '104 7th Avenue, Parkhurst, Johannesburg', 'Discovery Health', 'DISC-774920-03', 'Farook Patel (+27 76 102 9482)', '2026-03-02', 'AB-', 'Sulfa antibiotics', 'Mild Asthma');
GO

-- Seed Data: Appointments
INSERT INTO dbo.Appointments (AppointmentDate, AppointmentTime, DoctorID, PatientNumber, AppointmentStatus, Notes)
VALUES
(CAST(GETDATE() AS DATE), '09:00', 1, '10048291', 'Booked', 'Routine cardiology assessment and ECG evaluation.'),
(CAST(GETDATE() AS DATE), '10:30', 2, '10048292', 'Booked', 'Post-viral check-up and blood count review.'),
(CAST(GETDATE() AS DATE), '14:00', 3, '10048294', 'Booked', 'Asthma maintenance plan review and lung spirometry.'),
(DATEADD(day, 1, CAST(GETDATE() AS DATE)), '11:15', 4, '10048293', 'Booked', 'Endocrinology follow-up and HbA1c laboratory review.');
GO
