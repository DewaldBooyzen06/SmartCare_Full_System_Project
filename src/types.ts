export interface Patient {
  patientNumber: string; // 8 digits CHAR(8)
  firstName: string;
  lastName: string;
  idNumber: string; // 13 digits South African ID
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  contactNumber: string;
  email: string;
  residentialAddress: string;
  medicalAidProvider: string;
  medicalAidNumber: string;
  emergencyContact: string;
  registrationDate: string;
  // Additional fields (at least 5 required)
  bloodType: string;
  allergies: string;
  chronicConditions: string;
  preferredLanguage: string;
  occupation: string;
  nextOfKinName: string;
  nextOfKinContact: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
}

export interface Doctor {
  doctorId: number;
  fullName: string;
  specialisation: string;
  phoneNumber: string;
  email: string;
  roomNumber: string;
  status: 'Available' | 'Consulting' | 'Ward Rounds' | 'Off Duty';
}

export interface Appointment {
  appointmentNumber: number;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:MM
  doctorId: number;
  patientNumber: string;
  appointmentStatus: 'Booked' | 'Completed' | 'Cancelled';
  notes: string;
}

export interface User {
  userId: number;
  username: string;
  passwordHash: string;
  role: 'Receptionist' | 'Doctor' | 'Administrator';
  fullName: string;
}

export interface UnitTestItem {
  id: string;
  component: string;
  input: string;
  expected: string;
  actual?: string;
  status: 'PENDING' | 'PASS' | 'FAIL';
  details?: string;
}

export interface SystemTestItem {
  id: string;
  scenario: string;
  steps: string;
  expected: string;
  actual?: string;
  pass: boolean;
}

export interface DefectItem {
  id: string;
  problem: string;
  likelyCause: string;
  correction: string;
  retest: string;
  status: 'OPEN' | 'RESOLVED' | 'VERIFIED';
}
