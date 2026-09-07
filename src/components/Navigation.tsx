import React from 'react';
import { User } from '../types';
import {
  Hospital,
  LayoutDashboard,
  Users,
  Calendar,
  LogOut,
  Shield,
  FileCheck2,
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'patients' | 'appointments' | 'evidence';

interface NavigationProps {
  currentUser: User | null;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentUser,
  activeTab,
  onSelectTab,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#001848] text-white border-b border-blue-900 shadow-md">
      {/* Top Banner / System Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Clinic Info */}
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-all shadow-sm"
              onClick={() => onSelectTab('dashboard')}
            >
              <Hospital className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight cursor-pointer" onClick={() => onSelectTab('dashboard')}>
                  SmartCare Medical Clinic
                </h1>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/30 text-sky-200 border border-blue-400/30 font-semibold uppercase tracking-wider">
                  Live System
                </span>
              </div>
              <p className="text-xs text-blue-200/70">Clinical Appointment Management System</p>
            </div>
          </div>

          {/* User Info & Controls */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-3 pl-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-white flex items-center justify-end gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{currentUser.fullName}</span>
                  </div>
                  <span className="text-[11px] text-blue-300 capitalize">{currentUser.role}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-200 hover:text-white bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-colors cursor-pointer"
                  title="Logout from session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLogout}
                className="px-3.5 py-1.5 bg-[#0052cc] hover:bg-[#003d9b] text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="bg-[#001438] border-t border-blue-950/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex space-x-1 sm:space-x-2 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#0052cc] text-white shadow-sm'
                : 'text-blue-200 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onSelectTab('patients')}
            className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'patients'
                ? 'bg-[#0052cc] text-white shadow-sm'
                : 'text-blue-200 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Register Patient</span>
          </button>

          <button
            onClick={() => onSelectTab('appointments')}
            className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'appointments'
                ? 'bg-[#0052cc] text-white shadow-sm'
                : 'text-blue-200 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>

          <button
            onClick={() => onSelectTab('evidence')}
            className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'evidence'
                ? 'bg-[#0052cc] text-white shadow-sm ring-1 ring-white/30'
                : 'text-amber-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <span>Evidence &amp; Checklist</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono font-bold">
              25 Items
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
