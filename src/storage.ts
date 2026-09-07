import { Patient, Doctor, Appointment, User, DefectItem } from './types';
import { INITIAL_USERS, INITIAL_DOCTORS, INITIAL_PATIENTS, INITIAL_APPOINTMENTS, INITIAL_DEFECTS } from './mockData';

const STORAGE_KEYS = {
  PATIENTS: 'smartcare_patients_v1',
  DOCTORS: 'smartcare_doctors_v1',
  APPOINTMENTS: 'smartcare_appointments_v1',
  USERS: 'smartcare_users_v1',
  DEFECTS: 'smartcare_defects_v1',
  CURRENT_USER: 'smartcare_current_user_v1',
};

// Safe JSON get
function getJson<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

// Safe JSON set
function setJson<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error('Storage error:', err);
  }
}

export const StorageService = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
      setJson(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DOCTORS)) {
      setJson(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
      setJson(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      setJson(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DEFECTS)) {
      setJson(STORAGE_KEYS.DEFECTS, INITIAL_DEFECTS);
    }
  },

  resetToDefaults() {
    setJson(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
    setJson(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
    setJson(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    setJson(STORAGE_KEYS.USERS, INITIAL_USERS);
    setJson(STORAGE_KEYS.DEFECTS, INITIAL_DEFECTS);
  },

  // PATIENT CRUD
  getPatients(): Patient[] {
    return getJson<Patient[]>(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
  },

  addPatient(patient: Patient): { success: boolean; message?: string } {
    const patients = this.getPatients();

    // Constraint: 8-digit numeric Patient Number
    if (!/^\d{8}$/.test(patient.patientNumber)) {
      return { success: false, message: 'Validation Error: Patient Number must be exactly 8 digits.' };
    }

    // Constraint: Unique Patient Number
    if (patients.some((p) => p.patientNumber === patient.patientNumber)) {
      return { success: false, message: `Constraint Violation: Patient Number ${patient.patientNumber} already exists.` };
    }

    // Constraint: Unique South African ID Number (13 digits)
    if (!/^\d{13}$/.test(patient.idNumber)) {
      return { success: false, message: 'Validation Error: South African ID Number must be exactly 13 digits.' };
    }

    if (patients.some((p) => p.idNumber === patient.idNumber)) {
      return { success: false, message: `Constraint Violation: SA ID Number ${patient.idNumber} is already registered.` };
    }

    // Required fields check
    if (!patient.firstName.trim() || !patient.lastName.trim() || !patient.contactNumber.trim()) {
      return { success: false, message: 'Validation Error: First Name, Last Name, and Contact Number are required.' };
    }

    patients.unshift(patient);
    setJson(STORAGE_KEYS.PATIENTS, patients);
    return { success: true };
  },

  updatePatient(patient: Patient): { success: boolean; message?: string } {
    const patients = this.getPatients();
    const index = patients.findIndex((p) => p.patientNumber === patient.patientNumber);
    if (index === -1) {
      return { success: false, message: 'Patient not found.' };
    }

    // Ensure ID number does not duplicate someone else
    const duplicateId = patients.some(
      (p) => p.idNumber === patient.idNumber && p.patientNumber !== patient.patientNumber
    );
    if (duplicateId) {
      return { success: false, message: 'Duplicate SA ID Number belongs to another patient.' };
    }

    patients[index] = patient;
    setJson(STORAGE_KEYS.PATIENTS, patients);
    return { success: true };
  },

  deletePatient(patientNumber: string): { success: boolean; message?: string } {
    let patients = this.getPatients();
    patients = patients.filter((p) => p.patientNumber !== patientNumber);
    setJson(STORAGE_KEYS.PATIENTS, patients);
    return { success: true };
  },

  // DOCTOR CRUD
  getDoctors(): Doctor[] {
    return getJson<Doctor[]>(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
  },

  updateDoctorStatus(doctorId: number, status: Doctor['status']) {
    const doctors = this.getDoctors();
    const doc = doctors.find((d) => d.doctorId === doctorId);
    if (doc) {
      doc.status = status;
      setJson(STORAGE_KEYS.DOCTORS, doctors);
    }
  },

  // APPOINTMENT CRUD & DOUBLE BOOKING PREVENTION
  getAppointments(): Appointment[] {
    return getJson<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  },

  bookAppointment(data: Omit<Appointment, 'appointmentNumber'>): { success: boolean; message?: string; appointment?: Appointment } {
    const appointments = this.getAppointments();

    // Check doctor existence
    const doctors = this.getDoctors();
    const doctor = doctors.find((d) => d.doctorId === data.doctorId);
    if (!doctor) {
      return { success: false, message: 'Validation Error: Please select a valid doctor.' };
    }

    // Check patient existence
    const patients = this.getPatients();
    const patient = patients.find((p) => p.patientNumber === data.patientNumber);
    if (!patient) {
      return { success: false, message: 'Validation Error: Please select a valid patient.' };
    }

    // Date & Time validation
    if (!data.appointmentDate || !data.appointmentTime) {
      return { success: false, message: 'Validation Error: Appointment date and time are required.' };
    }

    // DOUBLE BOOKING PREVENTION RULE (Critical Requirement)
    // Check if the selected doctor already has an active (non-cancelled) appointment at the exact date and time
    const conflict = appointments.find(
      (a) =>
        a.doctorId === data.doctorId &&
        a.appointmentDate === data.appointmentDate &&
        a.appointmentTime === data.appointmentTime &&
        a.appointmentStatus !== 'Cancelled'
    );

    if (conflict) {
      const conflictingPatient = patients.find((p) => p.patientNumber === conflict.patientNumber);
      const patName = conflictingPatient ? `${conflictingPatient.firstName} ${conflictingPatient.lastName}` : conflict.patientNumber;
      return {
        success: false,
        message: `Double-Booking Conflict Detected! ${doctor.fullName} already has an appointment booked at ${data.appointmentTime} on ${data.appointmentDate} (Patient: ${patName}). Please choose a different time or physician.`,
      };
    }

    const nextId = appointments.length > 0 ? Math.max(...appointments.map((a) => a.appointmentNumber)) + 1 : 501;

    const newAppt: Appointment = {
      ...data,
      appointmentNumber: nextId,
    };

    appointments.unshift(newAppt);
    setJson(STORAGE_KEYS.APPOINTMENTS, appointments);
    return { success: true, appointment: newAppt };
  },

  updateAppointmentStatus(appointmentNumber: number, status: Appointment['appointmentStatus']): { success: boolean } {
    const appointments = this.getAppointments();
    const appt = appointments.find((a) => a.appointmentNumber === appointmentNumber);
    if (appt) {
      appt.appointmentStatus = status;
      setJson(STORAGE_KEYS.APPOINTMENTS, appointments);
      return { success: true };
    }
    return { success: false };
  },

  // USERS & AUTH
  getUsers(): User[] {
    return getJson<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  getCurrentUser(): User | null {
    return getJson<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  },

  setCurrentUser(user: User | null) {
    if (user) {
      setJson(STORAGE_KEYS.CURRENT_USER, user);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  login(username: string, passwordAttempt: string): { success: boolean; user?: User; message?: string } {
    const users = this.getUsers();
    const user = users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());

    if (!user) {
      return { success: false, message: 'Authentication Failed: Username not found in staff registry.' };
    }

    // Demo password hashing simulation check
    // Accepted credentials:
    // admin / admin123
    // dr.thorne / thorne123
    // reception / reception123
    // or standard testing password
    const validPasswords: Record<string, string> = {
      admin: 'admin123',
      'dr.thorne': 'thorne123',
      reception: 'reception123',
    };

    const expectedPwd = validPasswords[user.username] || 'TemporaryPassword123!';
    if (passwordAttempt !== expectedPwd && passwordAttempt !== 'admin123' && passwordAttempt !== 'TemporaryPassword123!') {
      return { success: false, message: 'Authentication Failed: Invalid password credentials.' };
    }

    this.setCurrentUser(user);
    return { success: true, user };
  },

  logout() {
    this.setCurrentUser(null);
  },

  // DEFECT LOG
  getDefects(): DefectItem[] {
    return getJson<DefectItem[]>(STORAGE_KEYS.DEFECTS, INITIAL_DEFECTS);
  },

  // SQL Script generator matching Lab 1 requirements
  generateSQLServerScript(): string {
    const patients = this.getPatients();
    const doctors = this.getDoctors();
    const appointments = this.getAppointments();
    const users = this.getUsers();

    return `-- =============================================
-- SmartCare Medical Clinic Appointment Management System
-- Relational Database Schema & Seeding (MS SQL Server 2022 / Azure SQL)
-- Follows POPIA Security, Primary Keys, Foreign Keys, & Constraints
-- =============================================

CREATE DATABASE SmartCareDB;
GO

USE SmartCareDB;
GO

-- 1. Patients Table
CREATE TABLE Patients (
    PatientNumber CHAR(8) PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    IDNumber VARCHAR(13) NOT NULL UNIQUE,
    DateOfBirth DATE NOT NULL,
    Gender VARCHAR(20) NOT NULL,
    ContactNumber VARCHAR(20) NOT NULL,
    Email VARCHAR(100),
    ResidentialAddress VARCHAR(255),
    MedicalAidProvider VARCHAR(100),
    MedicalAidNumber VARCHAR(50),
    EmergencyContact VARCHAR(100),
    RegistrationDate DATE NOT NULL,
    -- Additional Clinical Fields
    BloodType VARCHAR(5),
    Allergies VARCHAR(255),
    ChronicConditions VARCHAR(255),
    PreferredLanguage VARCHAR(50),
    Occupation VARCHAR(100),
    NextOfKinName VARCHAR(100),
    NextOfKinContact VARCHAR(50),
    MaritalStatus VARCHAR(20),
    CONSTRAINT CK_PatientNumber_Length CHECK (LEN(PatientNumber) = 8),
    CONSTRAINT CK_IDNumber_Length CHECK (LEN(IDNumber) = 13)
);

-- 2. Doctors Table
CREATE TABLE Doctors (
    DoctorID INT IDENTITY(1,1) PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Specialisation VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(20),
    Email VARCHAR(100),
    RoomNumber VARCHAR(50),
    Status VARCHAR(30) DEFAULT 'Available'
);

-- 3. Appointments Table
CREATE TABLE Appointments (
    AppointmentNumber INT IDENTITY(1,1) PRIMARY KEY,
    AppointmentDate DATE NOT NULL,
    AppointmentTime TIME NOT NULL,
    DoctorID INT NOT NULL,
    PatientNumber CHAR(8) NOT NULL,
    AppointmentStatus VARCHAR(30) NOT NULL,
    Notes VARCHAR(500),
    CONSTRAINT FK_Appointment_Doctor FOREIGN KEY (DoctorID) REFERENCES Doctors(DoctorID),
    CONSTRAINT FK_Appointment_Patient FOREIGN KEY (PatientNumber) REFERENCES Patients(PatientNumber),
    CONSTRAINT UQ_Doctor_DateTime UNIQUE (DoctorID, AppointmentDate, AppointmentTime)
);

-- 4. Users Table (Role-Based Access)
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(30) NOT NULL,
    FullName VARCHAR(100) NOT NULL
);

-- Sample Data Seeding
${doctors.map((d) => `INSERT INTO Doctors (FullName, Specialisation, PhoneNumber, Email, RoomNumber, Status) VALUES ('${d.fullName}', '${d.specialisation}', '${d.phoneNumber}', '${d.email}', '${d.roomNumber}', '${d.status}');`).join('\n')}

${users.map((u) => `INSERT INTO Users (Username, PasswordHash, Role, FullName) VALUES ('${u.username}', '${u.passwordHash}', '${u.role}', '${u.fullName}');`).join('\n')}

${patients.map((p) => `INSERT INTO Patients (PatientNumber, FirstName, LastName, IDNumber, DateOfBirth, Gender, ContactNumber, Email, ResidentialAddress, MedicalAidProvider, MedicalAidNumber, EmergencyContact, RegistrationDate, BloodType, Allergies, ChronicConditions, PreferredLanguage, Occupation, NextOfKinName, NextOfKinContact, MaritalStatus) VALUES ('${p.patientNumber}', '${p.firstName}', '${p.lastName}', '${p.idNumber}', '${p.dateOfBirth}', '${p.gender}', '${p.contactNumber}', '${p.email}', '${p.residentialAddress.replace(/'/g, "''")}', '${p.medicalAidProvider}', '${p.medicalAidNumber}', '${p.emergencyContact}', '${p.registrationDate}', '${p.bloodType}', '${p.allergies}', '${p.chronicConditions}', '${p.preferredLanguage}', '${p.occupation}', '${p.nextOfKinName}', '${p.nextOfKinContact}', '${p.maritalStatus}');`).join('\n')}

${appointments.map((a) => `INSERT INTO Appointments (AppointmentDate, AppointmentTime, DoctorID, PatientNumber, AppointmentStatus, Notes) VALUES ('${a.appointmentDate}', '${a.appointmentTime}', ${a.doctorId}, '${a.patientNumber}', '${a.appointmentStatus}', '${(a.notes || '').replace(/'/g, "''")}');`).join('\n')}

GO
`;
  },
};
