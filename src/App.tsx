import React, { useState, useEffect } from 'react';
import { StorageService } from './storage';
import { User, Patient, Doctor, Appointment } from './types';
import { LoginPage } from './components/LoginPage';
import { Navigation, ActiveTab } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { PatientRegistrationView } from './components/PatientRegistrationView';
import { AppointmentBookingView } from './components/AppointmentBookingView';
import { EvidenceHubView } from './components/EvidenceHubView';

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Initialize storage and state
  const loadData = () => {
    StorageService.init();
    setPatients(StorageService.getPatients());
    setDoctors(StorageService.getDoctors());
    setAppointments(StorageService.getAppointments());
    setUsers(StorageService.getUsers());
  };

  useEffect(() => {
    loadData();
    const storedUser = StorageService.getCurrentUser();
    if (storedUser) {
      setCurrentUser(storedUser);
    } else {
      // Default to first active user for immediate system demonstration
      const defaultUser = StorageService.getUsers()[0] || null;
      setCurrentUser(defaultUser);
    }
    setInitialized(true);
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
    loadData();
  };

  const handleLogout = () => {
    StorageService.logout();
    setCurrentUser(null);
  };

  if (!initialized) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center font-sans">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading SmartCare Medical Systems...</span>
        </div>
      </div>
    );
  }

  // 4.2 Login System: If not authenticated, render Login Page
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Clinical Management Portal (4.4 Dashboard, 4.1 Patient Registration, 4.3 Appointment Booking)
  return (
    <div className="min-h-screen bg-[#f8faff] text-[#091c35] flex flex-col font-sans selection:bg-[#0052cc] selection:text-white">
      {/* Consistent Navigation Header with Logout */}
      <Navigation
        currentUser={currentUser}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Clinical Viewport */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            patients={patients}
            doctors={doctors}
            appointments={appointments}
            onNavigate={setActiveTab}
            onRefreshData={loadData}
          />
        )}

        {activeTab === 'patients' && (
          <PatientRegistrationView
            patients={patients}
            doctors={doctors}
            appointments={appointments}
            onRefreshData={loadData}
          />
        )}

        {activeTab === 'appointments' && (
          <AppointmentBookingView
            patients={patients}
            doctors={doctors}
            appointments={appointments}
            onRefreshData={loadData}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceHubView
            patients={patients}
            doctors={doctors}
            appointments={appointments}
            users={users}
            onNavigateToTab={setActiveTab}
            onLogout={handleLogout}
          />
        )}
      </main>
    </div>
  );
}
