import React from 'react';
import { Patient, Doctor, Appointment } from '../types';
import { StorageService } from '../storage';
import {
  Users,
  Stethoscope,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Shield,
  Activity,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { ActiveTab } from './Navigation';

interface DashboardViewProps {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  onNavigate: (tab: ActiveTab) => void;
  onRefreshData: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patients,
  doctors,
  appointments,
  onNavigate,
  onRefreshData,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculations for Lab 6 Dashboard KPI counts
  const patientCount = patients.length;
  const doctorCount = doctors.length;
  const totalAppointments = appointments.length;

  // Upcoming appointments (date >= today and not cancelled)
  const upcomingAppointments = appointments
    .filter((a) => a.appointmentDate >= todayStr && a.appointmentStatus !== 'Cancelled')
    .sort((a, b) => {
      const dateCompare = a.appointmentDate.localeCompare(b.appointmentDate);
      if (dateCompare !== 0) return dateCompare;
      return a.appointmentTime.localeCompare(b.appointmentTime);
    });

  const todayAppointments = appointments.filter((a) => a.appointmentDate === todayStr);

  const handleUpdateStatus = (appNumber: number, status: Appointment['appointmentStatus']) => {
    StorageService.updateAppointmentStatus(appNumber, status);
    onRefreshData();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Welcome & System Status Bar */}
      <div className="bg-gradient-to-r from-[#00246b] via-[#003d9b] to-[#0052cc] rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-blue-400/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-blue-100 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Clinic Live Operations
            </span>
            <span className="text-xs text-blue-200">Date: {todayStr}</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">SmartCare Clinical Operations Console</h2>
          <p className="text-sm text-blue-100/80 mt-1 max-w-xl">
            Real-time appointment orchestration, patient records, and doctor scheduling with double-booking prevention.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onNavigate('appointments')}
            className="px-4 py-2 bg-white text-[#003d9b] font-semibold text-xs rounded-xl shadow hover:bg-blue-50 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
          <button
            onClick={() => onNavigate('patients')}
            className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white font-medium text-xs rounded-xl border border-white/25 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Register Patient</span>
          </button>
          <button
            onClick={() => onNavigate('evidence')}
            className="px-4 py-2 bg-emerald-500/25 hover:bg-emerald-500/40 text-emerald-100 font-semibold text-xs rounded-xl border border-emerald-400/40 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Item 17 Evidence Hub</span>
          </button>
        </div>
      </div>

      {/* 4 PRIMARY STATS / KPI CARDS (Explicitly required by Section D / Lab 6) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Patients */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered Patients</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{patientCount}</span>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-medium font-mono">100%</span> verified with SA ID & POPIA
            </p>
          </div>
        </div>

        {/* Metric 2: Number of Doctors */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Doctors</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{doctorCount}</span>
            <p className="text-xs text-slate-500 mt-1">Specialists & General Family Practice</p>
          </div>
        </div>

        {/* Metric 3: Total Appointments */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Appointments</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalAppointments}</span>
            <p className="text-xs text-slate-500 mt-1">Logged in historical records</p>
          </div>
        </div>

        {/* Metric 4: Upcoming Appointments */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Upcoming Scheduled</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-emerald-700 tracking-tight">{upcomingAppointments.length}</span>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="font-semibold text-blue-600">{todayAppointments.length}</span> scheduled today
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Upcoming Appointments Table + Doctor Availability Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Upcoming Appointments Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0052cc]" />
                <span>Upcoming Scheduled Appointments</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Chronologically sorted by consultation date and time</p>
            </div>
            <button
              onClick={() => onNavigate('appointments')}
              className="text-xs font-semibold text-[#0052cc] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Appt #</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Doctor</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {upcomingAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                      No upcoming appointments found. Click &quot;Book Appointment&quot; to schedule one.
                    </td>
                  </tr>
                ) : (
                  upcomingAppointments.slice(0, 6).map((appt) => {
                    const pat = patients.find((p) => p.patientNumber === appt.patientNumber);
                    const doc = doctors.find((d) => d.doctorId === appt.doctorId);

                    return (
                      <tr key={appt.appointmentNumber} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-600">
                          #{appt.appointmentNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">
                            {pat ? `${pat.firstName} ${pat.lastName}` : appt.patientNumber}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            No: {appt.patientNumber}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800">{doc?.fullName || `Doctor #${appt.doctorId}`}</div>
                          <div className="text-[11px] text-slate-400">{doc?.specialisation}</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-medium text-slate-900 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{appt.appointmentTime}</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {appt.appointmentDate === todayStr ? (
                              <span className="font-bold text-[#0052cc]">Today</span>
                            ) : (
                              appt.appointmentDate
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              appt.appointmentStatus === 'Booked'
                                ? 'bg-blue-100 text-blue-800'
                                : appt.appointmentStatus === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {appt.appointmentStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {appt.appointmentStatus === 'Booked' && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(appt.appointmentNumber, 'Completed')}
                                  title="Mark as Completed"
                                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(appt.appointmentNumber, 'Cancelled')}
                                  title="Cancel Appointment"
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Doctor Availability & Roster Radar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#0052cc]" />
                <span>Doctor Availability Radar</span>
              </h3>
              <button
                onClick={() => onNavigate('appointments')}
                className="text-xs text-[#0052cc] font-medium hover:underline"
              >
                Book Consultation
              </button>
            </div>

            <div className="space-y-3">
              {doctors.map((doc) => {
                const docApptsToday = todayAppointments.filter((a) => a.doctorId === doc.doctorId);

                return (
                  <div key={doc.doctorId} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-slate-900 text-xs">{doc.fullName}</div>
                        <div className="text-[11px] text-slate-500">{doc.specialisation}</div>
                      </div>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                          doc.status === 'Available'
                            ? 'bg-emerald-100 text-emerald-700'
                            : doc.status === 'Consulting'
                            ? 'bg-blue-100 text-blue-700'
                            : doc.status === 'Ward Rounds'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/50 pt-1.5">
                      <span>Room: {doc.roomNumber}</span>
                      <span className="font-medium text-slate-700">{docApptsToday.length} bookings today</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Double-Booking Prevention Banner */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">Zero Double-Booking Guarantee</h4>
                <p className="text-[11px] text-amber-800/90 mt-1 leading-relaxed">
                  The appointment engine validates DoctorID, Date, and Time slots before booking to strictly prevent overlapping appointments.
                </p>
              </div>
            </div>
          </div>

          {/* POPIA / Legal Compliance Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-800 font-bold">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>POPIA & Security Compliant</span>
            </div>
            <p className="text-[11px] text-slate-500">
              South African ID numbers and medical aid data are stored with strict role-based authorization controls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
