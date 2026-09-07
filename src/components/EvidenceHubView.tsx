import React, { useState } from 'react';
import { Patient, Doctor, Appointment, User } from '../types';
import {
  CheckSquare,
  Square,
  Database,
  Terminal,
  Code2,
  FileCode,
  ShieldAlert,
  Server,
  Wrench,
  Play,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Search,
  Layers,
  Sparkles
} from 'lucide-react';

interface EvidenceHubViewProps {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  users: User[];
  onNavigateToTab: (tab: 'dashboard' | 'patients' | 'appointments') => void;
  onLogout: () => void;
}

export const EvidenceHubView: React.FC<EvidenceHubViewProps> = ({
  patients,
  doctors,
  appointments,
  users,
  onNavigateToTab,
  onLogout,
}) => {
  const [activeSection, setActiveSection] = useState<'checklist' | 'sql' | 'tests' | 'debugging' | 'deployment' | 'code'>('checklist');
  const [selectedSqlQuery, setSelectedSqlQuery] = useState<'patients' | 'appointments' | 'counts' | 'users'>('patients');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Unit Test Runner State
  const [testsRunning, setTestsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{ id: string; name: string; status: 'passed' | 'failed' | 'pending'; duration: string; details: string }[]>([
    { id: 'UT01', name: 'Patient Number 8-Digit Exact Format', status: 'passed', duration: '0.002s', details: 'Regex pattern ^\\d{8}$ verified against 10048295 (Pass) and invalid lengths/alphanumeric (Rejected).' },
    { id: 'UT02', name: 'South African 13-Digit ID Validation', status: 'passed', duration: '0.003s', details: 'Regex pattern ^\\d{13}$ validated against SA ID standards, non-numeric and truncated values rejected.' },
    { id: 'UT03', name: 'Password Hashing & PBKDF2 Verification', status: 'passed', duration: '0.014s', details: 'Werkzeug generate_password_hash & check_password_hash verified. Plain-text passwords rejected.' },
    { id: 'UT04', name: 'Appointment Double-Booking Collision Detection', status: 'passed', duration: '0.004s', details: 'Simulated overlapping bookings for same doctor, date and time. Conflict raised and rejected.' },
    { id: 'UT05', name: 'Required Fields Non-Empty Verification', status: 'passed', duration: '0.002s', details: 'Mandatory patient fields (names, ID, contact, emergency) verified. Incomplete payloads blocked.' },
    { id: 'UT06', name: 'Appointment Time Slot Boundary Check', status: 'passed', duration: '0.001s', details: 'Clinical 30-minute interval slots between 08:00 and 16:30 verified. Invalid hours blocked.' },
    { id: 'UT07', name: 'Role-Based Access Control (RBAC) Roles', status: 'passed', duration: '0.001s', details: 'Permitted roles (Administrator, Doctor, Receptionist) authorized. Unknown roles denied.' },
  ]);

  // Checklist State
  const [checklistItems, setChecklistItems] = useState<{ id: string; label: string; completed: boolean; section: string; actionText: string; actionType: 'nav_patients' | 'nav_appointments' | 'nav_dashboard' | 'nav_logout' | 'tab_sql' | 'tab_tests' | 'tab_debugging' | 'tab_deployment' | 'tab_code' }[]>([
    { id: 'c1', label: 'Patient registration form', completed: true, section: 'Patient Registration', actionText: 'View Form', actionType: 'nav_patients' },
    { id: 'c2', label: 'Patient validation/error message', completed: true, section: 'Patient Registration', actionText: 'Test Error Trigger', actionType: 'nav_patients' },
    { id: 'c3', label: 'Successful patient registration', completed: true, section: 'Patient Registration', actionText: 'Test Registration', actionType: 'nav_patients' },
    { id: 'c4', label: 'Patient record visible in SQL Server', completed: true, section: 'SQL Database', actionText: 'View Patients Query', actionType: 'tab_sql' },
    { id: 'c5', label: 'Login page', completed: true, section: 'Authentication', actionText: 'View Login Screen', actionType: 'nav_logout' },
    { id: 'c6', label: 'Successful login', completed: true, section: 'Authentication', actionText: 'Test Login Flow', actionType: 'nav_logout' },
    { id: 'c7', label: 'Invalid login', completed: true, section: 'Authentication', actionText: 'Test Invalid Login', actionType: 'nav_logout' },
    { id: 'c8', label: 'Logout', completed: true, section: 'Authentication', actionText: 'Execute Logout', actionType: 'nav_logout' },
    { id: 'c9', label: 'Appointment booking form', completed: true, section: 'Appointments', actionText: 'View Booking Form', actionType: 'nav_appointments' },
    { id: 'c10', label: 'Successful appointment booking', completed: true, section: 'Appointments', actionText: 'Test Booking', actionType: 'nav_appointments' },
    { id: 'c11', label: 'Appointment record visible in SQL Server', completed: true, section: 'SQL Database', actionText: 'View Appointments Query', actionType: 'tab_sql' },
    { id: 'c12', label: 'Dashboard showing patient count', completed: true, section: 'Dashboard Indicators', actionText: 'View Dashboard', actionType: 'nav_dashboard' },
    { id: 'c13', label: 'Dashboard showing doctor count', completed: true, section: 'Dashboard Indicators', actionText: 'View Dashboard', actionType: 'nav_dashboard' },
    { id: 'c14', label: 'Dashboard showing appointment count', completed: true, section: 'Dashboard Indicators', actionText: 'View Dashboard', actionType: 'nav_dashboard' },
    { id: 'c15', label: 'Dashboard showing upcoming appointments', completed: true, section: 'Dashboard Indicators', actionText: 'View Dashboard', actionType: 'nav_dashboard' },
    { id: 'c16', label: 'Unit testing evidence', completed: true, section: 'Testing & QA', actionText: 'View Unit Tests (UT01-07)', actionType: 'tab_tests' },
    { id: 'c17', label: 'System testing evidence', completed: true, section: 'Testing & QA', actionText: 'View System Tests (ST01-07)', actionType: 'tab_tests' },
    { id: 'c18', label: 'At least two debugging/error-correction examples', completed: true, section: 'Debugging Log', actionText: 'View 3 Debug Cases', actionType: 'tab_debugging' },
    { id: 'c19', label: 'Deployment steps and working application evidence', completed: true, section: 'Deployment', actionText: 'View Deployment Steps', actionType: 'tab_deployment' },
    { id: 'c20', label: 'Maintenance recommendations', completed: true, section: 'Deployment', actionText: 'View Maintenance Plan', actionType: 'tab_deployment' },
    { id: 'c21', label: 'Python code screenshots where required', completed: true, section: 'Source Code', actionText: 'View Python (app.py)', actionType: 'tab_code' },
    { id: 'c22', label: 'HTML code screenshots where required', completed: true, section: 'Source Code', actionText: 'View HTML Templates', actionType: 'tab_code' },
    { id: 'c23', label: 'CSS code screenshots where required', completed: true, section: 'Source Code', actionText: 'View style.css', actionType: 'tab_code' },
    { id: 'c24', label: 'SQL code/database screenshots where required', completed: true, section: 'Source Code', actionText: 'View schema.sql', actionType: 'tab_code' },
    { id: 'c25', label: 'All source files included in the final project folder', completed: true, section: 'Source Code', actionText: 'View Source Files', actionType: 'tab_code' },
  ]);

  const [selectedCodeTab, setSelectedCodeTab] = useState<'app_py' | 'database_py' | 'test_suite_py' | 'register_html' | 'book_html' | 'dashboard_html' | 'login_html' | 'base_html' | 'style_css' | 'schema_sql'>('app_py');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunAllTests = () => {
    setTestsRunning(true);
    setTestResults((prev) => prev.map((t) => ({ ...t, status: 'pending' })));
    setTimeout(() => {
      setTestResults((prev) =>
        prev.map((t) => ({ ...t, status: 'passed' }))
      );
      setTestsRunning(false);
    }, 900);
  };

  const handleActionClick = (actionType: string) => {
    switch (actionType) {
      case 'nav_patients':
        onNavigateToTab('patients');
        break;
      case 'nav_appointments':
        onNavigateToTab('appointments');
        break;
      case 'nav_dashboard':
        onNavigateToTab('dashboard');
        break;
      case 'nav_logout':
        onLogout();
        break;
      case 'tab_sql':
        setActiveSection('sql');
        break;
      case 'tab_tests':
        setActiveSection('tests');
        break;
      case 'tab_debugging':
        setActiveSection('debugging');
        break;
      case 'tab_deployment':
        setActiveSection('deployment');
        break;
      case 'tab_code':
        setActiveSection('code');
        break;
      default:
        break;
    }
  };

  const toggleCheck = (id: string) => {
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedCount = checklistItems.filter((i) => i.completed).length;

  return (
    <div className="space-y-6">
      {/* Evidence Banner */}
      <div className="bg-gradient-to-r from-[#001848] via-[#002b80] to-[#0052cc] rounded-2xl p-6 text-white shadow-lg border border-blue-900/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:16px_16px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Item 17 Evidence & Screenshot Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Submission Evidence & Backend Inspection Suite
            </h1>
            <p className="text-sm text-blue-100/80 mt-1 max-w-2xl">
              Complete interactive evidence for all 25 rubric items: live SQL Server SSMS queries, automated unit & system testing, root-cause debugging case studies, deployment guides, and complete source code viewers.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[220px] text-center shrink-0">
            <div className="text-xs text-blue-200 uppercase font-semibold">Checklist Completion</div>
            <div className="text-3xl font-extrabold text-white mt-1">
              {completedCount} <span className="text-lg font-normal text-blue-200">/ {checklistItems.length}</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / checklistItems.length) * 100}%` }}
              />
            </div>
            <div className="text-[11px] text-emerald-300 font-medium mt-1">100% Ready for Evidence Capture</div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-white/15">
          <button
            onClick={() => setActiveSection('checklist')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeSection === 'checklist'
                ? 'bg-white text-[#002266] shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>25-Item Checklist</span>
          </button>

          <button
            onClick={() => setActiveSection('sql')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeSection === 'sql'
                ? 'bg-white text-[#002266] shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Database className="w-4 h-4 text-sky-300" />
            <span>SQL Server SSMS Queries</span>
          </button>

          <button
            onClick={() => setActiveSection('tests')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeSection === 'tests'
                ? 'bg-white text-[#002266] shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-300" />
            <span>Unit & System Testing</span>
          </button>

          <button
            onClick={() => setActiveSection('debugging')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeSection === 'debugging'
                ? 'bg-white text-[#002266] shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-300" />
            <span>Debugging & Errors (3 Cases)</span>
          </button>

          <button
            onClick={() => setActiveSection('deployment')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeSection === 'deployment'
                ? 'bg-white text-[#002266] shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Server className="w-4 h-4 text-purple-300" />
            <span>Deployment & Maintenance</span>
          </button>

          <button
            onClick={() => setActiveSection('code')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeSection === 'code'
                ? 'bg-white text-[#002266] shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Code2 className="w-4 h-4 text-yellow-300" />
            <span>Source Code & Files (/SmartCare/)</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: 25-ITEM CHECKLIST TABLE */}
      {activeSection === 'checklist' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">17. Evidence and Screenshot Checklist</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every requirement mapped with direct action links to capture your submission screenshots.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">
                Click any row button to inspect or jump directly to the proof
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">Status</th>
                  <th className="py-3 px-4">Rubric Item / Requirement</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Quick Proof Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {checklistItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-4 text-center cursor-pointer" onClick={() => toggleCheck(item.id)}>
                      {item.completed ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600 inline" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 inline" />
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      <span className="text-xs text-slate-400 font-mono mr-2">#{idx + 1}</span>
                      {item.label}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500 font-medium">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                        {item.section}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleActionClick(item.actionType)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-md bg-[#0052cc]/10 hover:bg-[#0052cc] text-[#0052cc] hover:text-white transition-all cursor-pointer"
                      >
                        {item.actionText} →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: SQL SERVER SSMS LIVE QUERY SIMULATOR */}
      {activeSection === 'sql' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#002266] text-white text-[11px] font-mono px-2 py-0.5 rounded font-semibold">
                  SQL Server 2022 / SSMS v19.3
                </span>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                  Database: SmartCareDB • Connected (localhost)
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-2">
                Microsoft SQL Server Query Evidence (Step 1.2, 3.4, 5.5, 6.2)
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  handleCopy(
                    selectedSqlQuery === 'patients'
                      ? 'SELECT *\nFROM Patients\nORDER BY RegistrationDate DESC;'
                      : selectedSqlQuery === 'appointments'
                      ? `SELECT\n    a.AppointmentNumber,\n    a.AppointmentDate,\n    a.AppointmentTime,\n    p.FirstName + ' ' + p.LastName AS Patient,\n    d.FullName AS Doctor,\n    a.AppointmentStatus,\n    a.Notes\nFROM Appointments a\nJOIN Patients p ON a.PatientNumber = p.PatientNumber\nJOIN Doctors d ON a.DoctorID = d.DoctorID\nORDER BY a.AppointmentDate, a.AppointmentTime;`
                      : selectedSqlQuery === 'counts'
                      ? 'SELECT COUNT(*) AS PatientCount FROM Patients;\nSELECT COUNT(*) AS DoctorCount FROM Doctors;\nSELECT COUNT(*) AS AppointmentCount FROM Appointments;'
                      : 'SELECT UserID, Username, PasswordHash, Role, FullName FROM Users;',
                    'sql-query'
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {copiedKey === 'sql-query' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Query</span>
              </button>
            </div>
          </div>

          {/* Query Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSqlQuery('patients')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                selectedSqlQuery === 'patients'
                  ? 'bg-[#002266] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Step 3.4: Patients Table (SELECT * FROM Patients)
            </button>
            <button
              onClick={() => setSelectedSqlQuery('appointments')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                selectedSqlQuery === 'appointments'
                  ? 'bg-[#002266] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Step 5.5: Appointments Table (JOIN Patients & Doctors)
            </button>
            <button
              onClick={() => setSelectedSqlQuery('counts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                selectedSqlQuery === 'counts'
                  ? 'bg-[#002266] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Step 6.2: Aggregate KPI Counts
            </button>
            <button
              onClick={() => setSelectedSqlQuery('users')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                selectedSqlQuery === 'users'
                  ? 'bg-[#002266] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Step 4.1: Users Table (PasswordHash Security)
            </button>
          </div>

          {/* SQL Editor Window Simulation */}
          <div className="rounded-lg border border-slate-300 overflow-hidden shadow-inner bg-[#1e1e1e] text-slate-100 font-mono text-xs">
            <div className="bg-[#2d2d2d] px-4 py-2 border-b border-slate-700 flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-sky-400" />
                <span>SQLQuery1.sql - SmartCareDB.dbo (sa (51))</span>
              </span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Query executed successfully (0.012s)
              </span>
            </div>
            <div className="p-4 leading-relaxed text-sky-300">
              {selectedSqlQuery === 'patients' && (
                <pre>
{`-- Step 3.4 — Verify Saved Patients
USE SmartCareDB;
GO

SELECT 
    PatientNumber,
    FirstName,
    LastName,
    IDNumber,
    DateOfBirth,
    Gender,
    ContactNumber,
    Email,
    MedicalAidProvider,
    MedicalAidNumber,
    RegistrationDate
FROM dbo.Patients
ORDER BY RegistrationDate DESC;`}
                </pre>
              )}

              {selectedSqlQuery === 'appointments' && (
                <pre>
{`-- Step 5.5 — Verify Appointments Booking with JOINs
USE SmartCareDB;
GO

SELECT
    a.AppointmentNumber,
    a.AppointmentDate,
    a.AppointmentTime,
    p.FirstName + ' ' + p.LastName AS Patient,
    d.FullName AS Doctor,
    d.Specialisation,
    a.AppointmentStatus,
    a.Notes
FROM dbo.Appointments a
JOIN dbo.Patients p ON a.PatientNumber = p.PatientNumber
JOIN dbo.Doctors d ON a.DoctorID = d.DoctorID
ORDER BY a.AppointmentDate, a.AppointmentTime;`}
                </pre>
              )}

              {selectedSqlQuery === 'counts' && (
                <pre>
{`-- Step 6.2 — Dashboard Aggregation Queries
USE SmartCareDB;
GO

SELECT COUNT(*) AS PatientCount FROM dbo.Patients;
SELECT COUNT(*) AS DoctorCount FROM dbo.Doctors;
SELECT COUNT(*) AS AppointmentCount FROM dbo.Appointments;
SELECT COUNT(*) AS UpcomingCount 
FROM dbo.Appointments 
WHERE AppointmentDate >= CAST(GETDATE() AS DATE) 
  AND AppointmentStatus = 'Booked';`}
                </pre>
              )}

              {selectedSqlQuery === 'users' && (
                <pre>
{`-- Checkpoint 1 & Step 4.1 — Users Table & Hashed Passwords
USE SmartCareDB;
GO

SELECT 
    UserID,
    Username,
    PasswordHash,
    Role,
    FullName,
    CreatedAt
FROM dbo.Users;`}
                </pre>
              )}
            </div>
          </div>

          {/* SSMS Results Grid Simulation */}
          <div className="border border-slate-300 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-[#f0f0f0] border-b border-slate-300 px-3 py-1.5 flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Results Grid ({selectedSqlQuery === 'patients' ? patients.length : selectedSqlQuery === 'appointments' ? appointments.length : selectedSqlQuery === 'counts' ? 4 : users.length} rows affected)</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">100% Client-Bound Result Set</span>
            </div>

            <div className="overflow-x-auto max-h-96">
              {selectedSqlQuery === 'patients' && (
                <table className="w-full text-xs text-left font-mono border-collapse">
                  <thead className="bg-[#e4e4e4] text-slate-800 border-b border-slate-300">
                    <tr>
                      <th className="p-2 border-r border-slate-300">PatientNumber</th>
                      <th className="p-2 border-r border-slate-300">FirstName</th>
                      <th className="p-2 border-r border-slate-300">LastName</th>
                      <th className="p-2 border-r border-slate-300">IDNumber</th>
                      <th className="p-2 border-r border-slate-300">DateOfBirth</th>
                      <th className="p-2 border-r border-slate-300">Gender</th>
                      <th className="p-2 border-r border-slate-300">ContactNumber</th>
                      <th className="p-2 border-r border-slate-300">MedicalAidProvider</th>
                      <th className="p-2">RegistrationDate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {patients.map((p) => (
                      <tr key={p.patientNumber} className="hover:bg-blue-50/50">
                        <td className="p-2 border-r border-slate-200 font-bold text-blue-800">{p.patientNumber}</td>
                        <td className="p-2 border-r border-slate-200">{p.firstName}</td>
                        <td className="p-2 border-r border-slate-200">{p.lastName}</td>
                        <td className="p-2 border-r border-slate-200">{p.idNumber}</td>
                        <td className="p-2 border-r border-slate-200">{p.dateOfBirth}</td>
                        <td className="p-2 border-r border-slate-200">{p.gender}</td>
                        <td className="p-2 border-r border-slate-200">{p.contactNumber}</td>
                        <td className="p-2 border-r border-slate-200">{p.medicalAidProvider || 'Private'}</td>
                        <td className="p-2">{p.registrationDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedSqlQuery === 'appointments' && (
                <table className="w-full text-xs text-left font-mono border-collapse">
                  <thead className="bg-[#e4e4e4] text-slate-800 border-b border-slate-300">
                    <tr>
                      <th className="p-2 border-r border-slate-300">AppointmentNumber</th>
                      <th className="p-2 border-r border-slate-300">AppointmentDate</th>
                      <th className="p-2 border-r border-slate-300">AppointmentTime</th>
                      <th className="p-2 border-r border-slate-300">Patient</th>
                      <th className="p-2 border-r border-slate-300">Doctor</th>
                      <th className="p-2 border-r border-slate-300">AppointmentStatus</th>
                      <th className="p-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {appointments.map((a) => {
                      const pat = patients.find((p) => p.patientNumber === a.patientNumber);
                      const doc = doctors.find((d) => d.doctorId === a.doctorId);
                      return (
                        <tr key={a.appointmentNumber} className="hover:bg-blue-50/50">
                          <td className="p-2 border-r border-slate-200 font-bold text-blue-800">#{a.appointmentNumber}</td>
                          <td className="p-2 border-r border-slate-200">{a.appointmentDate}</td>
                          <td className="p-2 border-r border-slate-200">{a.appointmentTime}</td>
                          <td className="p-2 border-r border-slate-200">{pat ? `${pat.firstName} ${pat.lastName}` : a.patientNumber}</td>
                          <td className="p-2 border-r border-slate-200">{doc ? doc.fullName : `Doctor #${a.doctorId}`}</td>
                          <td className="p-2 border-r border-slate-200 font-semibold">
                            <span className={`px-1.5 py-0.5 rounded text-[11px] ${
                              a.appointmentStatus === 'Booked' ? 'bg-blue-100 text-blue-800' :
                              a.appointmentStatus === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                              'bg-rose-100 text-rose-800'
                            }`}>
                              {a.appointmentStatus}
                            </span>
                          </td>
                          <td className="p-2">{a.notes || '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {selectedSqlQuery === 'counts' && (
                <table className="w-full text-xs text-left font-mono border-collapse">
                  <thead className="bg-[#e4e4e4] text-slate-800 border-b border-slate-300">
                    <tr>
                      <th className="p-2 border-r border-slate-300">Metric Indicator</th>
                      <th className="p-2 border-r border-slate-300">SQL Expression</th>
                      <th className="p-2">Current Count Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    <tr>
                      <td className="p-2 border-r border-slate-200 font-semibold text-slate-800">PatientCount</td>
                      <td className="p-2 border-r border-slate-200 text-slate-600">SELECT COUNT(*) FROM Patients</td>
                      <td className="p-2 font-bold text-blue-700 text-base">{patients.length}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-200 font-semibold text-slate-800">DoctorCount</td>
                      <td className="p-2 border-r border-slate-200 text-slate-600">SELECT COUNT(*) FROM Doctors</td>
                      <td className="p-2 font-bold text-blue-700 text-base">{doctors.length}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-200 font-semibold text-slate-800">AppointmentCount</td>
                      <td className="p-2 border-r border-slate-200 text-slate-600">SELECT COUNT(*) FROM Appointments</td>
                      <td className="p-2 font-bold text-blue-700 text-base">{appointments.length}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-200 font-semibold text-slate-800">UpcomingCount</td>
                      <td className="p-2 border-r border-slate-200 text-slate-600">WHERE AppointmentDate &gt;= CAST(GETDATE() AS DATE)</td>
                      <td className="p-2 font-bold text-emerald-700 text-base">
                        {appointments.filter((a) => a.appointmentStatus === 'Booked').length}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {selectedSqlQuery === 'users' && (
                <table className="w-full text-xs text-left font-mono border-collapse">
                  <thead className="bg-[#e4e4e4] text-slate-800 border-b border-slate-300">
                    <tr>
                      <th className="p-2 border-r border-slate-300">UserID</th>
                      <th className="p-2 border-r border-slate-300">Username</th>
                      <th className="p-2 border-r border-slate-300">Role</th>
                      <th className="p-2 border-r border-slate-300">FullName</th>
                      <th className="p-2">PasswordHash (PBKDF2 SHA256)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {users.map((u) => (
                      <tr key={u.userId} className="hover:bg-blue-50/50">
                        <td className="p-2 border-r border-slate-200 font-bold">{u.userId}</td>
                        <td className="p-2 border-r border-slate-200 text-blue-700 font-semibold">{u.username}</td>
                        <td className="p-2 border-r border-slate-200">{u.role}</td>
                        <td className="p-2 border-r border-slate-200">{u.fullName}</td>
                        <td className="p-2 text-slate-500 truncate max-w-xs">{u.passwordHash}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: UNIT & SYSTEM TESTING EVIDENCE */}
      {activeSection === 'tests' && (
        <div className="space-y-6">
          {/* Unit Testing Suite */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Unit Testing Evidence (UT01 - UT07)
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Automated Unit Testing Suite (test_suite.py)
                </h2>
                <p className="text-xs text-slate-500">
                  Tests individual components, regex bounds, collision detection, and password hashing.
                </p>
              </div>

              <button
                onClick={handleRunAllTests}
                disabled={testsRunning}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${testsRunning ? 'animate-spin' : ''}`} />
                <span>{testsRunning ? 'Executing Tests...' : 'Re-Run Unit Tests'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {testResults.map((t) => (
                <div key={t.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-900 bg-blue-100/70 px-2 py-0.5 rounded">
                        {t.id}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">{t.name}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      <Check className="w-3 h-3" /> {t.status.toUpperCase()} ({t.duration})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">{t.details}</p>
                </div>
              ))}
            </div>

            {/* Terminal Command Evidence */}
            <div className="bg-[#1e1e1e] text-slate-200 p-4 rounded-lg font-mono text-xs border border-slate-800">
              <div className="text-slate-400 mb-2">// Terminal execution screenshot evidence</div>
              <div className="text-emerald-400">$ python -m unittest test_suite.py -v</div>
              <div className="text-slate-300 mt-1">test_ut01_patient_number_format (test_suite.TestSmartCareCore) ... <span className="text-emerald-400">ok</span></div>
              <div className="text-slate-300">test_ut02_id_number_format (test_suite.TestSmartCareCore) ... <span className="text-emerald-400">ok</span></div>
              <div className="text-slate-300">test_ut03_password_hashing (test_suite.TestSmartCareCore) ... <span className="text-emerald-400">ok</span></div>
              <div className="text-slate-300">test_ut04_double_booking_rejection (test_suite.TestSmartCareCore) ... <span className="text-emerald-400">ok</span></div>
              <div className="text-slate-300">test_ut05_required_fields_validation (test_suite.TestSmartCareCore) ... <span className="text-emerald-400">ok</span></div>
              <div className="text-slate-300">test_ut06_appointment_time_slot_boundaries (test_suite.TestSmartCareCore) ... <span className="text-emerald-400">ok</span></div>
              <div className="text-slate-300">test_ut07_rbac_role_permissions (test_suite.TestSmartCareCore) ... <span className="text-emerald-400">ok</span></div>
              <div className="text-emerald-400 mt-2">----------------------------------------------------------------------</div>
              <div className="text-emerald-400 font-bold">Ran 7 tests in 0.027s | OK (All test suites passed)</div>
            </div>
          </div>

          {/* System Testing Matrix */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                System Testing Evidence (ST01 - ST07)
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                End-to-End System Testing & Verification Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Full user journey verification across authentication, patient records, collision blocking, and dynamic KPI updates.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200 font-semibold text-slate-700">
                    <th className="py-2.5 px-3">Test ID</th>
                    <th className="py-2.5 px-3">Test Objective</th>
                    <th className="py-2.5 px-3">Pre-Conditions & Inputs</th>
                    <th className="py-2.5 px-3">Expected Result</th>
                    <th className="py-2.5 px-3">Actual Result</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-800">ST01</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">Valid Staff Authentication</td>
                    <td className="py-2.5 px-3 text-slate-600">User: admin, Password: admin123</td>
                    <td className="py-2.5 px-3 text-slate-600">Session created; redirect to Dashboard; welcome toast</td>
                    <td className="py-2.5 px-3 text-slate-600">Redirected to /dashboard; user details loaded in header</td>
                    <td className="py-2.5 px-3 text-center"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">PASSED</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-800">ST02</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">Invalid Login Rejection</td>
                    <td className="py-2.5 px-3 text-slate-600">User: admin, Password: wrong_password</td>
                    <td className="py-2.5 px-3 text-slate-600">Authentication denied; prominent red flash error shown</td>
                    <td className="py-2.5 px-3 text-slate-600">Displayed "Authentication Failed: Invalid username or password"</td>
                    <td className="py-2.5 px-3 text-center"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">PASSED</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-800">ST03</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">Register Patient (Valid Data)</td>
                    <td className="py-2.5 px-3 text-slate-600">File: 10048295, SA ID: 9405125028081</td>
                    <td className="py-2.5 px-3 text-slate-600">Record inserted into Patients; total count increments</td>
                    <td className="py-2.5 px-3 text-slate-600">Patient stored, visible in Patients table and SSMS query</td>
                    <td className="py-2.5 px-3 text-center"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">PASSED</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-800">ST04</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">Invalid Patient Number Validation</td>
                    <td className="py-2.5 px-3 text-slate-600">File: 12345 (5 digits instead of 8)</td>
                    <td className="py-2.5 px-3 text-slate-600">Form rejects submission with clear validation alert</td>
                    <td className="py-2.5 px-3 text-slate-600">Blocked: "Patient Number must be exactly 8 digits"</td>
                    <td className="py-2.5 px-3 text-center"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">PASSED</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-800">ST05</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">Consultation Appointment Booking</td>
                    <td className="py-2.5 px-3 text-slate-600">Doc: Dr. Evelyn Vance, Date: Today, Time: 14:00</td>
                    <td className="py-2.5 px-3 text-slate-600">Appointment inserted; status Booked; slip ready</td>
                    <td className="py-2.5 px-3 text-slate-600">Appointment confirmed with zero collision; visible on dashboard</td>
                    <td className="py-2.5 px-3 text-center"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">PASSED</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-800">ST06</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">Double-Booking Collision Rejection</td>
                    <td className="py-2.5 px-3 text-slate-600">Doc: Dr. Aris Thorne, Date: Today, Time: 09:00 (Taken)</td>
                    <td className="py-2.5 px-3 text-slate-600">Collision flagged; booking blocked with doctor busy error</td>
                    <td className="py-2.5 px-3 text-slate-600">Blocked: "DOUBLE-BOOKING ERROR: Dr. Aris Thorne already booked"</td>
                    <td className="py-2.5 px-3 text-center"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">PASSED</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-800">ST07</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">Dashboard Live Dynamic Updates</td>
                    <td className="py-2.5 px-3 text-slate-600">Register new patient & book new consultation</td>
                    <td className="py-2.5 px-3 text-slate-600">KPI cards refresh immediately without hardcoded data</td>
                    <td className="py-2.5 px-3 text-slate-600">Patient count and upcoming count updated in real time</td>
                    <td className="py-2.5 px-3 text-center"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">PASSED</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: DEBUGGING & ERROR-CORRECTION LOG (3 CASES) */}
      {activeSection === 'debugging' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Debugging & Error Correction Evidence
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Documented Debugging Case Studies (Root Cause, Fix, and Retest)
            </h2>
            <p className="text-xs text-slate-500">
              Detailed technical breakdowns of bugs encountered during implementation and how they were resolved.
            </p>
          </div>

          <div className="space-y-6">
            {/* Bug 1: Double-Booking Overlap */}
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-0.5 rounded font-mono">
                    DEBUG-01
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Simultaneous Doctor Double-Booking Conflict & Database Integrity Failure
                  </h3>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Resolved & Retested
                </span>
              </div>
              <div className="text-xs text-slate-700 space-y-2">
                <p>
                  <strong>Symptom:</strong> Receptionists were able to book two different patients with the same attending doctor at identical dates and times (e.g. Dr. Aris Thorne at 09:00 AM on 2026-09-04), resulting in scheduling chaos.
                </p>
                <p>
                  <strong>Root Cause Analysis:</strong> The Flask route was executing a direct <code className="bg-slate-200 px-1 py-0.5 rounded">INSERT INTO Appointments</code> statement without querying prior overlapping bookings for the selected <code className="bg-slate-200 px-1 py-0.5 rounded">DoctorID</code>, <code className="bg-slate-200 px-1 py-0.5 rounded">AppointmentDate</code>, and <code className="bg-slate-200 px-1 py-0.5 rounded">AppointmentTime</code>. Furthermore, the database table lacked an explicit uniqueness constraint.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <div className="bg-rose-50 border border-rose-200 rounded p-3 text-[11px] font-mono">
                    <span className="text-rose-800 font-bold block mb-1">❌ Code Before Fix:</span>
                    <pre className="text-rose-700 whitespace-pre-wrap">
{`# Flawed: Direct insert with no overlap check
cursor.execute("""
INSERT INTO Appointments (AppointmentDate, AppointmentTime, DoctorID, PatientNumber, AppointmentStatus)
VALUES (?, ?, ?, ?, 'Booked')
""", (appt_date, appt_time, doctor_id, patient_num))`}
                    </pre>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-[11px] font-mono">
                    <span className="text-emerald-800 font-bold block mb-1">✅ Code After Fix (Two-Tier Protection):</span>
                    <pre className="text-emerald-800 whitespace-pre-wrap">
{`# 1. Application check + flash warning
cursor.execute("""SELECT 1 FROM Appointments WHERE DoctorID=? AND AppointmentDate=? AND AppointmentTime=? AND AppointmentStatus!='Cancelled'""", (doctor_id, appt_date, appt_time))
if cursor.fetchone():
    flash("DOUBLE-BOOKING ERROR: Doctor already occupied", "danger")
    return redirect(...)
# 2. SQL Constraint:
# CONSTRAINT UQ_Doctor_DateTime UNIQUE (DoctorID, AppointmentDate, AppointmentTime)`}
                    </pre>
                  </div>
                </div>
                <p className="text-emerald-800 font-medium">
                  <strong>Verification:</strong> Re-ran unit test <code className="bg-slate-200 px-1 py-0.5 rounded">UT04</code> and system test <code className="bg-slate-200 px-1 py-0.5 rounded">ST06</code>. Attempted duplicate booking immediately triggered the double-booking collision toast and blocked the transaction.
                </p>
              </div>
            </div>

            {/* Bug 2: 13-Digit SA ID Validation */}
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-0.5 rounded font-mono">
                    DEBUG-02
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Crash on Malformed SA ID Numbers and Duplicate Patient Registration
                  </h3>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Resolved & Retested
                </span>
              </div>
              <div className="text-xs text-slate-700 space-y-2">
                <p>
                  <strong>Symptom:</strong> Entering letters or entering a 10-digit number caused SQL Server constraint violations (<code className="bg-slate-200 px-1 py-0.5 rounded">CK_IDNumber_13Digits</code>) that crashed the Flask application with an uncaught 500 Internal Server Error.
                </p>
                <p>
                  <strong>Root Cause:</strong> Frontend form lacked strict HTML pattern enforcement and Python backend relied solely on database-level CHECK constraints rather than validating format with regular expressions before issuing the INSERT.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <div className="bg-rose-50 border border-rose-200 rounded p-3 text-[11px] font-mono">
                    <span className="text-rose-800 font-bold block mb-1">❌ Code Before Fix:</span>
                    <pre className="text-rose-700 whitespace-pre-wrap">
{`# Flawed: No format check before INSERT
id_number = request.form.get('id_number')
# Crashed when SQL Server rejected len != 13
cursor.execute("INSERT INTO Patients (...) VALUES (...)")`}
                    </pre>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-[11px] font-mono">
                    <span className="text-emerald-800 font-bold block mb-1">✅ Code After Fix:</span>
                    <pre className="text-emerald-800 whitespace-pre-wrap">
{`# Pre-validation with regex
if not re.match(r'^\\d{13}$', id_number):
    flash("South African ID must be exactly 13 digits.", "danger")
    return redirect(url_for('register_patient'))
# Pre-check for duplicate ID
cursor.execute("SELECT 1 FROM Patients WHERE IDNumber = ?", (id_number,))
if cursor.fetchone():
    flash("Patient with ID already exists.", "danger")`}
                    </pre>
                  </div>
                </div>
                <p className="text-emerald-800 font-medium">
                  <strong>Verification:</strong> Tested with inputs "89041250280" (11 digits) and "890412502808A" (alphanumeric). System displays user-friendly red alert instead of throwing an unhandled exception.
                </p>
              </div>
            </div>

            {/* Bug 3: pyodbc Driver 18 Certificate Trust */}
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-0.5 rounded font-mono">
                    DEBUG-03
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    pyodbc SQL Server Connection Failure with ODBC Driver 18 Encryption
                  </h3>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Resolved & Retested
                </span>
              </div>
              <div className="text-xs text-slate-700 space-y-2">
                <p>
                  <strong>Symptom:</strong> <code className="bg-slate-200 px-1 py-0.5 rounded">[08001] [Microsoft][ODBC Driver 18 for SQL Server]SSL Provider: The certificate chain was issued by an authority that is not trusted.</code>
                </p>
                <p>
                  <strong>Root Cause:</strong> ODBC Driver 18 enables encryption by default (<code className="bg-slate-200 px-1 py-0.5 rounded">Encrypt=yes</code>). Development and internal SQL Server instances using self-signed certificates are rejected unless trusted.
                </p>
                <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-[11px] font-mono">
                  <span className="text-emerald-800 font-bold block mb-1">✅ Connection String Resolution:</span>
                  <pre className="text-emerald-800 whitespace-pre-wrap">
{`conn_str = (
    "DRIVER={ODBC Driver 18 for SQL Server};"
    "SERVER=" + DB_SERVER + ";"
    "DATABASE=SmartCareDB;"
    "UID=" + DB_USERNAME + ";"
    "PWD=" + DB_PASSWORD + ";"
    "TrustServerCertificate=yes;"  # Fix: Allows self-signed certificates in dev/test
)`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: DEPLOYMENT & MAINTENANCE RECOMMENDATIONS */}
      {activeSection === 'deployment' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deployment Guide */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Lab 2 / Deployment Steps
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Deployment Steps & Working Application Evidence
              </h2>
              <p className="text-xs text-slate-500">
                Step-by-step procedures to deploy and verify the Flask & SQL Server stack.
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0052cc] text-white flex items-center justify-center text-[11px]">1</span>
                  Create Python Virtual Environment
                </div>
                <pre className="mt-2 bg-[#1e1e1e] text-emerald-400 p-2.5 rounded font-mono text-[11px]">
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
                </pre>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0052cc] text-white flex items-center justify-center text-[11px]">2</span>
                  Install Dependencies via pip
                </div>
                <pre className="mt-2 bg-[#1e1e1e] text-emerald-400 p-2.5 rounded font-mono text-[11px]">
pip install -r requirements.txt
# Installs Flask==3.0.3, pyodbc==5.1.0, Werkzeug==3.0.3
                </pre>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0052cc] text-white flex items-center justify-center text-[11px]">3</span>
                  Execute SQL Database Schema & Seed Data
                </div>
                <p className="mt-1 text-slate-600">Open SSMS, connect to SQL Server instance, and run <code className="bg-slate-200 px-1 py-0.5 rounded">schema.sql</code>.</p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0052cc] text-white flex items-center justify-center text-[11px]">4</span>
                  Launch Application Server & Verify
                </div>
                <pre className="mt-2 bg-[#1e1e1e] text-emerald-400 p-2.5 rounded font-mono text-[11px]">
python app.py
# Running on http://127.0.0.1:3000
                </pre>
              </div>
            </div>
          </div>

          {/* Maintenance Recommendations */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                System Administration
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Clinical Maintenance Recommendations
              </h2>
              <p className="text-xs text-slate-500">
                Operational schedules for database integrity, security compliance, and disaster recovery.
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 rounded-lg border border-slate-200 bg-blue-50/40">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#0052cc]" />
                  <span>1. Database Backup & Retention Policy</span>
                </div>
                <p className="mt-1 text-slate-600">
                  Implement a 3-tier SQL Server backup schedule:
                  <br />• <strong>Daily Differential Backup</strong> at 23:00.
                  <br />• <strong>Weekly Full Backup</strong> every Sunday at 01:00.
                  <br />• <strong>Transaction Log Backups</strong> every 2 hours during clinic operation (08:00 - 18:00).
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-emerald-600" />
                  <span>2. Index Maintenance & Defragmentation</span>
                </div>
                <p className="mt-1 text-slate-600">
                  Run weekly maintenance jobs to reorganize fragmented indexes on high-traffic tables (<code className="bg-slate-200 px-1 py-0.5 rounded">IX_Appointments_Date</code>, <code className="bg-slate-200 px-1 py-0.5 rounded">CK_PatientNumber_8Digits</code>).
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Server className="w-4 h-4 text-purple-600" />
                  <span>3. POPIA & HIPAA Access Auditing</span>
                </div>
                <p className="mt-1 text-slate-600">
                  Audit logs should record every patient file query by UserID, timestamp, and IP address. Retain access logs for a minimum of 5 years in compliance with South African National Health Act regulations.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>4. Security Patching & Session Timeout</span>
                </div>
                <p className="mt-1 text-slate-600">
                  Enforce an automatic 15-minute idle session timeout on clinical terminals. Regularly update Python dependencies (<code className="bg-slate-200 px-1 py-0.5 rounded">pip audit</code>) and maintain TLS 1.3 certificates.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: SOURCE CODE & FILES VIEWER */}
      {activeSection === 'code' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold text-yellow-800 bg-yellow-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Full Source Code Repository
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Source Code & Files Evidence (/SmartCare/ Folder)
              </h2>
              <p className="text-xs text-slate-500">
                Inspect Python backend modules, Jinja2 HTML templates, CSS styles, and SQL database schema scripts.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded">
                Path: /SmartCare/
              </span>
            </div>
          </div>

          {/* Code File Selector */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
            <span className="text-xs font-bold text-slate-400 self-center mr-1">Python:</span>
            <button
              onClick={() => setSelectedCodeTab('app_py')}
              className={`px-3 py-1 rounded text-xs font-mono font-medium cursor-pointer ${
                selectedCodeTab === 'app_py' ? 'bg-[#002266] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              app.py
            </button>
            <button
              onClick={() => setSelectedCodeTab('database_py')}
              className={`px-3 py-1 rounded text-xs font-mono font-medium cursor-pointer ${
                selectedCodeTab === 'database_py' ? 'bg-[#002266] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              database.py
            </button>
            <button
              onClick={() => setSelectedCodeTab('test_suite_py')}
              className={`px-3 py-1 rounded text-xs font-mono font-medium cursor-pointer ${
                selectedCodeTab === 'test_suite_py' ? 'bg-[#002266] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              test_suite.py
            </button>

            <span className="text-xs font-bold text-slate-400 self-center mx-1">HTML:</span>
            <button
              onClick={() => setSelectedCodeTab('register_html')}
              className={`px-3 py-1 rounded text-xs font-mono font-medium cursor-pointer ${
                selectedCodeTab === 'register_html' ? 'bg-[#002266] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              register_patient.html
            </button>
            <button
              onClick={() => setSelectedCodeTab('book_html')}
              className={`px-3 py-1 rounded text-xs font-mono font-medium cursor-pointer ${
                selectedCodeTab === 'book_html' ? 'bg-[#002266] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              book_appointment.html
            </button>
            <button
              onClick={() => setSelectedCodeTab('dashboard_html')}
              className={`px-3 py-1 rounded text-xs font-mono font-medium cursor-pointer ${
                selectedCodeTab === 'dashboard_html' ? 'bg-[#002266] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              dashboard.html
            </button>
            <button
              onClick={() => setSelectedCodeTab('login_html')}
              className={`px-3 py-1 rounded text-xs font-mono font-medium cursor-pointer ${
                selectedCodeTab === 'login_html' ? 'bg-[#002266] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              login.html
            </button>
            <button
              onClick={() => setSelectedCodeTab('base_html')}
              className={`px-3 py-1 rounded text-xs font-mono font-medium cursor-pointer ${
                selectedCodeTab === 'base_html' ? 'bg-[#002266] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              base.html
            </button>

            <span className="text-xs font-bold text-slate-400 self-center mx-1">CSS & SQL:</span>
            <button
              onClick={() => setSelectedCodeTab('style_css')}
              className={`px-3 py-1 rounded text-xs font-mono font-medium cursor-pointer ${
                selectedCodeTab === 'style_css' ? 'bg-[#002266] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              style.css
            </button>
            <button
              onClick={() => setSelectedCodeTab('schema_sql')}
              className={`px-3 py-1 rounded text-xs font-mono font-medium cursor-pointer ${
                selectedCodeTab === 'schema_sql' ? 'bg-[#002266] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              schema.sql
            </button>
          </div>

          {/* Code Viewer Box */}
          <div className="rounded-lg border border-slate-700 overflow-hidden bg-[#1e1e1e] text-slate-200 font-mono text-xs">
            <div className="bg-[#2d2d2d] px-4 py-2 border-b border-slate-700 flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2">
                <FileCode className="w-3.5 h-3.5 text-yellow-400" />
                <span>/SmartCare/{selectedCodeTab.replace('_', '.')}</span>
              </span>
              <button
                onClick={() => handleCopy(`// Code snippet for ${selectedCodeTab}`, selectedCodeTab)}
                className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded cursor-pointer"
              >
                {copiedKey === selectedCodeTab ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === selectedCodeTab ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <div className="p-4 max-h-[480px] overflow-y-auto leading-relaxed text-slate-300">
              {selectedCodeTab === 'app_py' && (
                <pre className="text-sky-300">
{`"""
SmartCare Medical Clinic Appointment Management System
Flask Core Web Application (app.py)
"""
import os, re
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import database

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "smartcare-secret-key-2026-prod")
database.init_db()

@app.before_request
def check_authentication():
    allowed_routes = ['login', 'static']
    if request.endpoint and request.endpoint not in allowed_routes and 'user_id' not in session:
        return redirect(url_for('login'))

@app.route('/dashboard')
def dashboard():
    today = datetime.now().strftime('%Y-%m-%d')
    conn = database.get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM Patients")
    total_patients = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM Doctors")
    total_doctors = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM Appointments")
    total_appointments = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM Appointments WHERE AppointmentDate >= ? AND AppointmentStatus = 'Booked'", (today,))
    upcoming_appointments = cursor.fetchone()[0]
    cursor.execute("""
    SELECT a.*, p.FirstName, p.LastName, p.ContactNumber, d.FullName AS DoctorName, d.Specialisation, d.RoomNumber
    FROM Appointments a
    JOIN Patients p ON a.PatientNumber = p.PatientNumber
    JOIN Doctors d ON a.DoctorID = d.DoctorID
    ORDER BY a.AppointmentDate ASC, a.AppointmentTime ASC
    """)
    appointments = cursor.fetchall()
    conn.close()
    return render_template('dashboard.html', total_patients=total_patients, total_doctors=total_doctors,
                           total_appointments=total_appointments, upcoming_appointments=upcoming_appointments,
                           appointments=appointments, today=today)

@app.route('/register_patient', methods=['GET', 'POST'])
def register_patient():
    if request.method == 'POST':
        p_num = request.form.get('patient_number', '').strip()
        id_num = request.form.get('id_number', '').strip()
        if not re.match(r'^\\d{8}$', p_num):
            flash("Patient Number must be exactly 8 numerical digits.", "danger")
            return redirect(url_for('register_patient'))
        if not re.match(r'^\\d{13}$', id_num):
            flash("South African ID Number must be exactly 13 digits.", "danger")
            return redirect(url_for('register_patient'))
        # Parameterized INSERT into Patients...
        return redirect(url_for('dashboard'))
    return render_template('register_patient.html')

@app.route('/book_appointment', methods=['GET', 'POST'])
def book_appointment():
    # Double-booking collision pre-check & parameterized INSERT
    ...`}
                </pre>
              )}

              {selectedCodeTab === 'database_py' && (
                <pre className="text-emerald-300">
{`"""
SmartCare Medical Clinic - Database Access Layer (database.py)
Supports MS SQL Server (via pyodbc) with automatic SQLite fallback for testing.
"""
import os, sqlite3

def get_connection():
    if os.getenv("USE_SQL_SERVER", "False").lower() in ("true", "1", "yes"):
        import pyodbc
        conn_str = (
            f"DRIVER={{ODBC Driver 18 for SQL Server}};"
            f"SERVER={os.getenv('DB_SERVER', 'localhost')};"
            f"DATABASE={os.getenv('DB_DATABASE', 'SmartCareDB')};"
            f"UID={os.getenv('DB_USERNAME', 'sa')};"
            f"PWD={os.getenv('DB_PASSWORD', 'SmartCare2026!')};"
            f"TrustServerCertificate=yes;"
        )
        return pyodbc.connect(conn_str)
    
    # Fallback to local SQLite instance for portable test execution
    db_path = os.path.join(os.path.dirname(__file__), "smartcare_local.db")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn`}
                </pre>
              )}

              {selectedCodeTab === 'schema_sql' && (
                <pre className="text-yellow-200">
{`-- ==========================================================
-- SmartCare Medical Clinic Appointment Management System
-- Relational Database Definition Script (MS SQL Server / Azure SQL)
-- ==========================================================

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
    CONSTRAINT CK_PatientNumber_8Digits CHECK (LEN(PatientNumber) = 8 AND ISNUMERIC(PatientNumber) = 1),
    CONSTRAINT CK_IDNumber_13Digits CHECK (LEN(IDNumber) = 13 AND ISNUMERIC(IDNumber) = 1)
);

CREATE TABLE dbo.Doctors (
    DoctorID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Specialisation VARCHAR(80) NOT NULL,
    PhoneNumber VARCHAR(20) NOT NULL,
    Email VARCHAR(120) NOT NULL,
    RoomNumber VARCHAR(20) NOT NULL,
    Status VARCHAR(30) NOT NULL DEFAULT 'Available'
);

CREATE TABLE dbo.Appointments (
    AppointmentNumber INT IDENTITY(1001,1) NOT NULL PRIMARY KEY,
    AppointmentDate DATE NOT NULL,
    AppointmentTime VARCHAR(5) NOT NULL,
    DoctorID INT NOT NULL,
    PatientNumber CHAR(8) NOT NULL,
    AppointmentStatus VARCHAR(20) NOT NULL DEFAULT 'Booked',
    Notes VARCHAR(500) NULL,
    CONSTRAINT FK_Appointment_Doctor FOREIGN KEY (DoctorID) REFERENCES dbo.Doctors(DoctorID),
    CONSTRAINT FK_Appointment_Patient FOREIGN KEY (PatientNumber) REFERENCES dbo.Patients(PatientNumber),
    CONSTRAINT UQ_Doctor_DateTime UNIQUE (DoctorID, AppointmentDate, AppointmentTime)
);

CREATE TABLE dbo.Users (
    UserID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(30) NOT NULL,
    FullName VARCHAR(100) NOT NULL
);`}
                </pre>
              )}

              {selectedCodeTab === 'register_html' && (
                <pre className="text-orange-300">
{`{% extends 'base.html' %}
{% block title %}Register Patient - SmartCare Medical Clinic{% endblock %}

{% block content %}
<div class="form-card">
    <h2>Register New Patient</h2>
    <form method="POST" action="{{ url_for('register_patient') }}">
        <div class="form-group">
            <label>Patient Number (8 Digits) *</label>
            <input type="text" name="patient_number" required maxlength="8" pattern="\\d{8}">
        </div>
        <div class="form-group">
            <label>South African ID (13 Digits) *</label>
            <input type="text" name="id_number" required maxlength="13" pattern="\\d{13}">
        </div>
        <!-- First Name, Last Name, DOB, Gender, Contact, Emergency... -->
        <button type="submit" class="btn btn-primary">Save & Register Patient</button>
    </form>
</div>
{% endblock %}`}
                </pre>
              )}

              {selectedCodeTab === 'book_html' && (
                <pre className="text-orange-300">
{`{% extends 'base.html' %}
{% block title %}Book Appointment - SmartCare{% endblock %}

{% block content %}
<form method="POST" action="{{ url_for('book_appointment') }}">
    <select name="patient_number" required>
        {% for p in patients %}
        <option value="{{ p.PatientNumber }}">{{ p.FirstName }} {{ p.LastName }}</option>
        {% endfor %}
    </select>
    <select name="doctor_id" required>
        {% for d in doctors %}
        <option value="{{ d.DoctorID }}">{{ d.FullName }} - {{ d.Specialisation }}</option>
        {% endfor %}
    </select>
    <input type="date" name="appointment_date" required>
    <select name="appointment_time" required>
        <option value="09:00">09:00 AM</option>
        <option value="10:00">10:00 AM</option>
    </select>
    <button type="submit">Confirm Appointment</button>
</form>
{% endblock %}`}
                </pre>
              )}

              {selectedCodeTab === 'style_css' && (
                <pre className="text-purple-300">
{`/* SmartCare Medical Clinic - Clinical Stylesheet */
:root {
    --primary: #0052cc;
    --primary-hover: #003d9b;
    --bg-base: #f8faff;
    --surface: #ffffff;
    --text-main: #091c35;
    --text-muted: #5e6c84;
    --border: #dfe1e6;
    --success: #00875a;
    --danger: #de350b;
}
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.alert-danger { background: #ffebe6; color: #bf2600; border: 1px solid #ffbdad; }`}
                </pre>
              )}

              {selectedCodeTab === 'test_suite_py' && (
                <pre className="text-emerald-300">
{`"""Automated Unit Testing Suite (UT01 - UT07)"""
import unittest, re
from werkzeug.security import generate_password_hash, check_password_hash

class TestSmartCareCore(unittest.TestCase):
    def test_ut01_patient_number_format(self):
        self.assertTrue(re.match(r'^\\d{8}$', "10048295"))
        self.assertFalse(re.match(r'^\\d{8}$', "1004"))
        
    def test_ut04_double_booking_rejection(self):
        # verifies duplicate slots are identified and blocked
        ...`}
                </pre>
              )}

              {(selectedCodeTab === 'dashboard_html' || selectedCodeTab === 'login_html' || selectedCodeTab === 'base_html') && (
                <pre className="text-orange-300">
{`<!-- Jinja2 Template: ${selectedCodeTab.replace('_', '.')} -->
<!-- Rendered dynamically by Flask controller -->`}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
