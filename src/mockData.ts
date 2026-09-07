import { Patient, Doctor, Appointment, User, DefectItem } from './types';

export const INITIAL_USERS: User[] = [
  {
    userId: 1,
    username: 'admin',
    // In demo, hashed simulation or plaintext checked with SHA256 simulation
    passwordHash: 'pbkdf2:sha256:260000$admin123$hashsalt',
    role: 'Administrator',
    fullName: 'Sister Naledi Dlamini (Chief Receptionist)',
  },
  {
    userId: 2,
    username: 'dr.thorne',
    passwordHash: 'pbkdf2:sha256:260000$thorne123$hashsalt',
    role: 'Doctor',
    fullName: 'Dr. Aris Thorne, MD',
  },
  {
    userId: 3,
    username: 'reception',
    passwordHash: 'pbkdf2:sha256:260000$reception123$hashsalt',
    role: 'Receptionist',
    fullName: 'Thabo Mokoena (Admissions Desk)',
  },
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    doctorId: 1,
    fullName: 'Dr. Aris Thorne',
    specialisation: 'Interventional Cardiology',
    phoneNumber: '+27 82 555 0192',
    email: 'a.thorne@smartcare.co.za',
    roomNumber: 'Consultation Rm 3',
    status: 'Consulting',
  },
  {
    doctorId: 2,
    fullName: 'Dr. Sophia Zhang',
    specialisation: 'Internal Medicine',
    phoneNumber: '+27 83 444 8821',
    email: 's.zhang@smartcare.co.za',
    roomNumber: 'Triage Bay B',
    status: 'Available',
  },
  {
    doctorId: 3,
    fullName: 'Dr. David Mwangi',
    specialisation: 'Clinical Endocrinology',
    phoneNumber: '+27 71 333 9942',
    email: 'd.mwangi@smartcare.co.za',
    roomNumber: 'Ward 2 (L2)',
    status: 'Ward Rounds',
  },
  {
    doctorId: 4,
    fullName: 'Dr. Brenda van der Merwe',
    specialisation: 'General Family Practice',
    phoneNumber: '+27 84 222 1109',
    email: 'b.vandermerwe@smartcare.co.za',
    roomNumber: 'Consultation Rm 1',
    status: 'Available',
  },
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    patientNumber: '10048291',
    firstName: 'Eleanor',
    lastName: 'Vance',
    idNumber: '8904125028087',
    dateOfBirth: '1989-04-12',
    gender: 'Female',
    contactNumber: '+27 82 111 4452',
    email: 'e.vance@gmail.com',
    residentialAddress: '42 Sandton Boulevard, Sandton, Johannesburg, 2196',
    medicalAidProvider: 'Discovery Health',
    medicalAidNumber: 'DH-98432091',
    emergencyContact: 'Mark Vance (+27 82 999 1234)',
    registrationDate: '2026-08-15',
    bloodType: 'O+',
    allergies: 'Penicillin, NSAIDs',
    chronicConditions: 'Mild Hypertension',
    preferredLanguage: 'English',
    occupation: 'Financial Analyst',
    nextOfKinName: 'Mark Vance (Spouse)',
    nextOfKinContact: '+27 82 999 1234',
    maritalStatus: 'Married',
  },
  {
    patientNumber: '10048292',
    firstName: 'Marcus',
    lastName: 'Rodriguez',
    idNumber: '9211055112089',
    dateOfBirth: '1992-11-05',
    gender: 'Male',
    contactNumber: '+27 73 555 8891',
    email: 'm.rodriguez@outlook.com',
    residentialAddress: '15 Jan Smuts Avenue, Rosebank, 2193',
    medicalAidProvider: 'Bonitas Medical Fund',
    medicalAidNumber: 'BON-4421908',
    emergencyContact: 'Elena Rodriguez (+27 73 111 0022)',
    registrationDate: '2026-08-20',
    bloodType: 'A+',
    allergies: 'None reported',
    chronicConditions: 'Asthma (Controlled)',
    preferredLanguage: 'English',
    occupation: 'Software Engineer',
    nextOfKinName: 'Elena Rodriguez (Sister)',
    nextOfKinContact: '+27 73 111 0022',
    maritalStatus: 'Single',
  },
  {
    patientNumber: '10048293',
    firstName: 'Kassandra',
    lastName: 'Lee',
    idNumber: '9502180098083',
    dateOfBirth: '1995-02-18',
    gender: 'Female',
    contactNumber: '+27 61 777 3341',
    email: 'kassandra.lee@webmail.co.za',
    residentialAddress: '78 Oxford Road, Illovo, Johannesburg, 2196',
    medicalAidProvider: 'Momentum Health',
    medicalAidNumber: 'MOM-7821903',
    emergencyContact: 'Jonathan Lee (+27 61 222 4433)',
    registrationDate: '2026-08-28',
    bloodType: 'B+',
    allergies: 'Latex, Sulfa Drugs',
    chronicConditions: 'Type 1 Diabetes',
    preferredLanguage: 'English',
    occupation: 'Architect',
    nextOfKinName: 'Jonathan Lee (Father)',
    nextOfKinContact: '+27 61 222 4433',
    maritalStatus: 'Single',
  },
  {
    patientNumber: '10048294',
    firstName: 'Sipho',
    lastName: 'Nkosi',
    idNumber: '8006145229081',
    dateOfBirth: '1980-06-14',
    gender: 'Male',
    contactNumber: '+27 82 444 7712',
    email: 'sipho.nkosi@workplace.co.za',
    residentialAddress: '12 Vilakazi Street, Orlando West, Soweto, 1804',
    medicalAidProvider: 'Fedhealth',
    medicalAidNumber: 'FED-1198421',
    emergencyContact: 'Lindiwe Nkosi (+27 82 333 9901)',
    registrationDate: '2026-09-01',
    bloodType: 'O-',
    allergies: 'Aspirin',
    chronicConditions: 'Hyperlipidemia',
    preferredLanguage: 'isiZulu',
    occupation: 'Logistics Coordinator',
    nextOfKinName: 'Lindiwe Nkosi (Wife)',
    nextOfKinContact: '+27 82 333 9901',
    maritalStatus: 'Married',
  },
];

// Helper to get today's and tomorrow's date strings
const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    appointmentNumber: 501,
    appointmentDate: today,
    appointmentTime: '09:00',
    doctorId: 1, // Dr. Aris Thorne
    patientNumber: '10048291', // Eleanor Vance
    appointmentStatus: 'Completed',
    notes: 'Cardiology 6-month review. Blood pressure 118/76. ECG Normal sinus rhythm.',
  },
  {
    appointmentNumber: 502,
    appointmentDate: today,
    appointmentTime: '10:30',
    doctorId: 2, // Dr. Sophia Zhang
    patientNumber: '10048292', // Marcus Rodriguez
    appointmentStatus: 'Booked',
    notes: 'Pulmonary spirometry follow-up. Inhaler dosage evaluation.',
  },
  {
    appointmentNumber: 503,
    appointmentDate: today,
    appointmentTime: '11:15',
    doctorId: 3, // Dr. David Mwangi
    patientNumber: '10048293', // Kassandra Lee
    appointmentStatus: 'Booked',
    notes: 'Endocrine panel assessment. HbA1c glucose monitoring check.',
  },
  {
    appointmentNumber: 504,
    appointmentDate: tomorrow,
    appointmentTime: '14:00',
    doctorId: 4, // Dr. Brenda van der Merwe
    patientNumber: '10048294', // Sipho Nkosi
    appointmentStatus: 'Booked',
    notes: 'Routine annual general physical and lipid panel review.',
  },
  {
    appointmentNumber: 505,
    appointmentDate: '2026-08-10',
    appointmentTime: '11:00',
    doctorId: 1,
    patientNumber: '10048291',
    appointmentStatus: 'Completed',
    notes: 'Initial cardiac consultation and baseline Holter monitor setup.',
  },
];

export const INITIAL_DEFECTS: DefectItem[] = [
  {
    id: 'DEF-01',
    problem: 'Double booking occurred when two receptionists scheduled Dr. Thorne at 10:00 AM on the same date.',
    likelyCause: 'Client state did not check doctor appointment overlap before committing the INSERT record.',
    correction: 'Implemented pre-save conflict check querying existing appointments for matching DoctorID, Date, and Time.',
    retest: 'Attempted duplicate slot booking for Dr. Thorne at 10:00 AM. System rejected with error alert.',
    status: 'VERIFIED',
  },
  {
    id: 'DEF-02',
    problem: 'Patient Number input accepted 6 digits instead of enforcing exact 8-digit constraint.',
    likelyCause: 'Validation regex used \\d+ instead of strict ^\\d{8}$ pattern in frontend and backend check.',
    correction: 'Added strict 8-digit constraint and SA ID 13-digit Luhn check.',
    retest: 'Submitted "1234". Form displayed "Patient Number must be exactly 8 numeric digits". Retest PASSED.',
    status: 'VERIFIED',
  },
  {
    id: 'DEF-03',
    problem: 'Appointment history view showed appointments in unordered sequence.',
    likelyCause: 'Omission of ORDER BY a.AppointmentDate DESC, a.AppointmentTime DESC clause.',
    correction: 'Added chronological sorting filter to Appointment query and UI table.',
    retest: 'Bookings now display with nearest upcoming on top, sorted cleanly by date and time.',
    status: 'VERIFIED',
  },
];
