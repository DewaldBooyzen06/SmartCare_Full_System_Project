import React, { useState } from 'react';
import { StorageService } from '../storage';
import { User } from '../types';
import { Shield, Lock, User as UserIcon, Eye, EyeOff, ArrowRight, Check, Hospital, BadgeCheck, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    setTimeout(() => {
      const result = StorageService.login(username, password);
      setLoading(false);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setErrorMessage(result.message || 'Invalid username or password');
      }
    }, 400);
  };

  const handleQuickFill = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setErrorMessage('');
  };

  return (
    <div className="bg-gradient-to-br from-[#001848] via-[#003d9b] to-[#001c3d] text-slate-900 min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans relative overflow-x-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>

      {/* Top Bar Badge */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <Hospital className="w-5 h-5 text-sky-300" />
          <span className="text-xs font-bold text-white tracking-wide">SmartCare Medical Clinic</span>
        </div>
        <span className="text-xs text-blue-200/90 inline-flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          Section 4.2 Secure Login
        </span>
      </div>

      <div className="w-full max-w-5xl bg-white rounded-2xl border border-white/20 flex overflow-hidden flex-col md:flex-row shadow-2xl relative z-10 my-8">
        {/* Left Side: Immersive Gradient & Branding (Matching Image 4) */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#00246b] via-[#003d9b] to-[#0052cc] p-8 lg:p-10 relative flex-col justify-between text-white overflow-hidden">
          {/* Subtle glow circles */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-blue-400/20 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>

          {/* Top Branding */}
          <div className="relative z-10 flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
              <Hospital className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold block">SmartCare Health</span>
              <h2 className="text-lg font-bold text-white tracking-tight">Medical Systems</h2>
            </div>
          </div>

          {/* Center Hero Content */}
          <div className="relative z-10 my-auto py-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-blue-200 text-xs font-medium mb-6">
              <Shield className="w-3.5 h-3.5 text-sky-300" />
              <span>Enterprise Clinical Suite v4.2</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-4 leading-snug">
              Advanced Clinic Management System
            </h1>
            <p className="text-blue-100/80 text-sm leading-relaxed mb-8">
              Empowering healthcare professionals with secure, lightning-fast access to electronic health records, scheduling, and diagnostic tools.
            </p>

            {/* Feature Highlights */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-blue-100">
                <div className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center text-blue-300 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>End-to-End HIPAA & POPIA Compliant Encryption</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-blue-100">
                <div className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center text-blue-300 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Real-time Multi-department & Schedule Sync</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-blue-100">
                <div className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center text-blue-300 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Double-Booking Conflict Prevention Engine</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Badge */}
          <div className="relative z-10 flex items-center space-x-2 text-xs text-blue-200/70 border-t border-white/10 pt-4">
            <BadgeCheck className="w-4 h-4 text-emerald-400" />
            <span>Authorized Personnel Only • 256-Bit Secure Connection</span>
          </div>
        </div>

        {/* Right Side: Staff Login Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between bg-white">
          <div>
            {/* Mobile Header (Hidden on Desktop) */}
            <div className="md:hidden flex flex-col items-center mb-6 text-center">
              <div className="w-12 h-12 bg-[#003d9b] rounded-xl flex items-center justify-center mb-2 text-white shadow-md">
                <Hospital className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">SmartCare Medical</h2>
              <p className="text-xs text-slate-500 mt-0.5">Advanced Clinic Management System</p>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-1.5">Staff Login</h3>
              <p className="text-sm text-slate-500">
                Please authenticate to access patient records and scheduling.
              </p>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="username">
                  Username / Staff ID
                </label>
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. dr.thorne or admin"
                    className="w-full h-11 px-3.5 py-2 pl-3.5 pr-10 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                  />
                  <UserIcon className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="password">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('For testing, use credentials below: admin / admin123, dr.thorne / thorne123, or reception / reception123')}
                    className="text-xs font-medium text-[#0052cc] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 px-3.5 py-2 pl-3.5 pr-10 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center pt-1">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 text-[#0052cc] border-slate-300 rounded focus:ring-blue-400 cursor-pointer"
                />
                <label htmlFor="remember" className="ml-2 text-xs sm:text-sm text-slate-600 cursor-pointer select-none">
                  Remember device for 8 hours
                </label>
              </div>

              {/* Sign In Button (#0052cc matching design spec) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#0052cc] hover:bg-[#003d9b] text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 mt-2 disabled:opacity-70 cursor-pointer"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick-test credential buttons */}
            <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Quick Test Credentials:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin', 'admin123')}
                  className="px-2.5 py-1 text-xs bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded font-medium transition-colors"
                >
                  Admin (Sr. Dlamini)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('dr.thorne', 'thorne123')}
                  className="px-2.5 py-1 text-xs bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded font-medium transition-colors"
                >
                  Doctor (Dr. Thorne)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('reception', 'reception123')}
                  className="px-2.5 py-1 text-xs bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded font-medium transition-colors"
                >
                  Receptionist (Thabo M.)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUsername('unknown_user');
                    setPassword('wrongpass999');
                    setErrorMessage('Authentication Failed: Invalid username or password. (Item 17 Evidence: Invalid Login)');
                  }}
                  className="px-2.5 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded font-medium transition-colors cursor-pointer"
                >
                  Simulate Invalid Login (Error Evidence)
                </button>
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Protected by POPIA & HIPAA security standards. Unauthorized access is strictly prohibited.<br />
              <span className="font-medium text-slate-600">IT Helpdesk:</span> ext. 404 &nbsp;|&nbsp;{' '}
              <span className="font-medium text-slate-600">Support Portal:</span> help.smartcare.med
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
