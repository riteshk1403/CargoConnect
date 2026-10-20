import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Truck, 
  Phone, 
  Menu, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  LogIn, 
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import CallTeamModal from './CallTeamModal';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_EMPLOYEE') return '/admin/dashboard';
    if (user.role === 'ROLE_CARGO_PARTNER') return '/partner/dashboard';
    if (user.role === 'ROLE_DRIVER') return '/driver/dashboard';
    return '/shipper/dashboard';
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 text-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
              <Truck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white">Cargo<span className="text-brand-400">Connect</span></span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">B2B</span>
              </div>
              <span className="block text-[11px] font-semibold text-slate-400 -mt-0.5 tracking-wide">
                Freight & Fleet Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#services" className="hover:text-white hover:text-brand-400 transition-colors">Solutions</a>
            <a href="#calculator" className="hover:text-white hover:text-brand-400 transition-colors">Rate Estimator</a>
            <a href="#tracking" className="hover:text-white hover:text-brand-400 transition-colors">Live Tracking</a>
            <a href="#fleets" className="hover:text-white hover:text-brand-400 transition-colors">For Fleets</a>
            <Link to="/contact" className="hover:text-white hover:text-brand-400 transition-colors">Support</Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* 24/7 Helpline Pill */}
            <button
              onClick={() => setIsCallModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>+91 98220 11223</span>
            </button>

            {!user ? (
              <>
                <Link
                  to="/login?tab=login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-900 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/login?tab=register"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-600/30 hover:shadow-brand-600/40 transition-all flex items-center gap-1.5"
                >
                  <span>Book Freight</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to={getDashboardPath()}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white flex items-center gap-2 shadow-md shadow-brand-600/25 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  title="Sign out"
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-slate-950 border-b border-slate-800 px-5 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="space-y-3 text-sm font-medium">
              <a 
                href="#services" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 hover:text-white"
              >
                Solutions
              </a>
              <a 
                href="#calculator" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 hover:text-white"
              >
                Rate Estimator
              </a>
              <a 
                href="#tracking" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 hover:text-white"
              >
                Live Tracking
              </a>
              <a 
                href="#fleets" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 hover:text-white"
              >
                For Fleet Owners
              </a>
              <Link 
                to="/contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 hover:text-white"
              >
                Contact & Support
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2.5">
              <button
                onClick={() => { setIsCallModalOpen(true); setMobileMenuOpen(false); }}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200 flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Hotline: +91 98220 11223</span>
              </button>

              {!user ? (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login?tab=login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login?tab=register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center rounded-xl text-xs font-bold bg-brand-600 text-white flex items-center justify-center gap-1.5 shadow-md shadow-brand-600/30"
                  >
                    <span>Register</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center rounded-xl text-xs font-bold bg-brand-600 text-white flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Go to Dashboard</span>
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); navigate('/'); }}
                    className="w-full py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 text-center"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 24/7 Helpline Modal */}
      <CallTeamModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
      />
    </>
  );
}
