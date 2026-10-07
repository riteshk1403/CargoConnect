import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, 
  User, 
  Mail, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldAlert,
  UserPlus,
  LogIn,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

// Custom CargoConnect Africa Emblem matching the brand identity
const CargoConnectLogo = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-24 h-24 sm:w-28 sm:h-28'
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size] || sizeClasses.md}`}>
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer Circular 'C' Track in Deep Forest Green */}
        <path 
          d="M75 18 C38 18 16 42 16 66 C16 90 38 108 72 108 C88 108 98 102 104 96 L94 86 C89 90 82 94 72 94 C46 94 30 79 30 66 C30 52 46 32 75 32 C85 32 94 36 98 40 L108 30 C100 23 88 18 75 18 Z" 
          fill="#064e3b" 
        />
        {/* Highway / Road Curve Accent in Warm Amber/Orange */}
        <path 
          d="M48 94 C64 94 82 98 96 106 L104 96 C88 86 68 82 48 82 Z" 
          fill="#ea580c" 
        />
        <path 
          d="M62 88 L72 88 L78 94 L68 94 Z" 
          fill="#ffffff" 
          opacity="0.9"
        />

        {/* Detailed Front/Isometric Freight Truck */}
        <g transform="translate(30, 36) scale(0.62)">
          {/* Truck Cab */}
          <rect x="22" y="16" width="38" height="42" rx="6" fill="#ffffff" stroke="#064e3b" strokeWidth="3" />
          {/* Windshield */}
          <path d="M26 22 H56 V35 H26 Z" fill="#e2e8f0" stroke="#064e3b" strokeWidth="2" />
          {/* Grille */}
          <rect x="28" y="40" width="26" height="12" rx="2" fill="#cbd5e1" stroke="#064e3b" strokeWidth="2" />
          <line x1="32" y1="44" x2="50" y2="44" stroke="#064e3b" strokeWidth="1.5" />
          <line x1="32" y1="48" x2="50" y2="48" stroke="#064e3b" strokeWidth="1.5" />
          {/* Headlights */}
          <circle cx="26" cy="46" r="3" fill="#facc15" stroke="#064e3b" strokeWidth="1" />
          <circle cx="56" cy="46" r="3" fill="#facc15" stroke="#064e3b" strokeWidth="1" />
          {/* Bumper */}
          <rect x="20" y="52" width="42" height="6" rx="2" fill="#064e3b" />
          {/* Side Mirrors */}
          <rect x="17" y="24" width="4" height="8" rx="1.5" fill="#064e3b" />
          <rect x="61" y="24" width="4" height="8" rx="1.5" fill="#064e3b" />
          {/* Cargo Container Body behind cab */}
          <path d="M6 8 H22 V54 H6 Z" fill="#ffffff" stroke="#064e3b" strokeWidth="3" />
          <line x1="11" y1="14" x2="11" y2="48" stroke="#064e3b" strokeWidth="1.5" />
          <line x1="17" y1="14" x2="17" y2="48" stroke="#064e3b" strokeWidth="1.5" />
          {/* Tires */}
          <rect x="22" y="56" width="7" height="6" rx="2" fill="#1e293b" />
          <rect x="53" y="56" width="7" height="6" rx="2" fill="#1e293b" />
          <rect x="8" y="54" width="8" height="6" rx="2" fill="#1e293b" />
        </g>
      </svg>
    </div>
  );
};

const Login = () => {
  // Navigation Modes: 'welcome' (default initial card) | 'login' | 'register'
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') || 'welcome';
  const [mode, setMode] = useState(initialMode); // 'welcome', 'login', 'register'
  const verifyToken = searchParams.get('verifyToken');

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'ROLE_SHIPPER',
    name: '',
    phone: '',
    companyName: '',
    address: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle legacy email verification from URL link click
  useEffect(() => {
    if (verifyToken) {
      const verify = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/auth/verify-email?token=${verifyToken}`);
          setSuccessMsg(res.data?.message || 'Email verified successfully! You may now sign in.');
          setMode('login');
        } catch (err) {
          setError(err.response?.data?.message || 'Verification link expired or invalid.');
          setMode('login');
        } finally {
          setLoading(false);
        }
      };
      verify();
    }
  }, [verifyToken]);

  // Password rules validation for registration
  const regPassword = registerData.password || '';
  const hasMinLen = regPassword.length >= 6;
  const hasUpper = /[A-Z]/.test(regPassword);
  const hasLower = /[a-z]/.test(regPassword);
  const hasNumber = /[0-9]/.test(regPassword);
  const hasSpecial = /[@#$%^&+=!._\-*()[\]{}~`|:;"'<>,?/]/.test(regPassword);
  const isRegPasswordValid = hasMinLen && hasUpper && hasLower && hasNumber && hasSpecial;
  const isRegPasswordMatch = regPassword.length > 0 && regPassword === confirmPassword;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setUnverifiedEmail(null);
    setLoading(true);

    try {
      const data = await login(identifier, password);
      // Redirect by user role
      if (data.role === 'ROLE_ADMIN' || data.role === 'ROLE_EMPLOYEE') {
        navigate('/admin/dashboard');
      } else if (data.role === 'ROLE_CARGO_PARTNER') {
        navigate('/partner/dashboard');
      } else if (data.role === 'ROLE_DRIVER') {
        navigate('/driver/dashboard');
      } else {
        navigate('/shipper/dashboard');
      }
    } catch (err) {
      let msg = err.message || 'Authentication failed.';
      if (msg.toLowerCase().includes('network error')) {
        msg = 'Unable to connect to server. If the server was idle, please wait 30 seconds and try again.';
      }
      setError(msg);
      if (err.isUnverified || msg.toLowerCase().includes('verify')) {
        setUnverifiedEmail(identifier.includes('@') ? identifier : '');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!isRegPasswordValid) {
      setError('Please satisfy all password security requirements.');
      return;
    }
    if (!isRegPasswordMatch) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await api.post('/auth/register', registerData);
      setSuccessMsg(res.data?.message || 'Registration successful! Verification code sent to email.');
      // Direct navigation to 6-digit OTP verification screen
      setTimeout(() => {
        navigate(`/verify-email?email=${encodeURIComponent(registerData.email)}`);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-emerald-50/60 via-slate-50 to-amber-50/40 text-slate-900 font-sans selection:bg-emerald-800 selection:text-white relative overflow-hidden">
      
      {/* Ambient background subtle lighting */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* Main Floating Card */}
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-[440px] bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-7 sm:p-8 relative z-10"
      >
        {/* ================= CARD HEADER ================= */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <CargoConnectLogo size="sm" />
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                CargoConnect <span className="text-slate-800 font-semibold">Africa</span>
              </h1>
              <p className="text-xs text-slate-500 font-normal">
                Shared SADC logistics workspace
              </p>
            </div>
          </div>

          {mode !== 'welcome' && (
            <button
              onClick={() => {
                setMode('welcome');
                setError('');
                setSuccessMsg('');
              }}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors text-xs font-medium flex items-center gap-1"
              title="Back to Welcome Card"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
        </div>

        {/* ================= ERROR & SUCCESS FEEDBACK ================= */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5 font-medium"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-medium"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {unverifiedEmail !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-2"
            >
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Verification Required</span>
              </div>
              <p className="text-[11px] text-amber-800">
                Please enter the 6-digit OTP code sent to your email to verify your account.
              </p>
              <button
                type="button"
                onClick={() => navigate(`/verify-email?email=${encodeURIComponent(unverifiedEmail || identifier)}`)}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <span>Enter 6-Digit OTP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= 1. WELCOME MODE (EXACT SCREENSHOT LAYOUT) ================= */}
        {mode === 'welcome' && (
          <div className="flex flex-col items-center text-center py-3">
            {/* Center Illustrated Truck Logo */}
            <div className="my-5">
              <CargoConnectLogo size="lg" />
            </div>

            {/* Prompt Text */}
            <p className="text-sm text-slate-600 max-w-[320px] mb-8 font-normal leading-relaxed">
              Sign in to your workspace, or create a CargoConnect subscription account.
            </p>

            {/* Two Action Buttons: Sign up & Sign in */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                  setSuccessMsg('');
                }}
                className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
              >
                <UserPlus className="w-4 h-4 text-slate-600" />
                <span>Sign up</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setSuccessMsg('');
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#064e3b] hover:bg-[#043d2e] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/20 active:scale-98"
              >
                <LogIn className="w-4 h-4 text-white" />
                <span>Sign in</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= 2. SIGN IN FORM ================= */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="mb-2">
              <h2 className="text-xl font-bold text-slate-900">Welcome Back</h2>
              <p className="text-xs text-slate-500 mt-0.5">Sign in to continue to CargoConnect Africa</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address or Username
              </label>
              <input
                type="text"
                required
                placeholder="name@company.com or username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10 transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 hover:underline transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10 transition-all"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#064e3b] hover:bg-[#043d2e] active:bg-[#022c21] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
                  className="font-semibold text-emerald-800 hover:text-emerald-900 hover:underline transition-colors"
                >
                  Create Account
                </button>
              </p>
            </div>
          </form>
        )}

        {/* ================= 3. CREATE ACCOUNT FORM ================= */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div className="mb-2">
              <h2 className="text-xl font-bold text-slate-900">Create Account</h2>
              <p className="text-xs text-slate-500 mt-0.5">Register for CargoConnect Africa workspace</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Type
              </label>
              <select
                value={registerData.role}
                onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10 transition-all"
              >
                <option value="ROLE_SHIPPER">Shipper / B2B Cargo Customer</option>
                <option value="ROLE_CARGO_PARTNER">Cargo Partner (Fleet Operator)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. samcargo"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value.trim() })}
                  className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="sam@example.com"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value.trim() })}
                  className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {registerData.role === 'ROLE_CARGO_PARTNER' ? 'Company Name / Fleet Hub' : 'Full Name'}
              </label>
              <input
                type="text"
                placeholder={registerData.role === 'ROLE_CARGO_PARTNER' ? "e.g. SADC Logistics Ltd" : "e.g. Vikram Mehta"}
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value, companyName: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Choose strong password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl py-2 pl-3 pr-10 text-xs text-slate-900 focus:outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10 transition-all"
              />
            </div>

            {/* Real-Time Password Security Rules */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-[11px]">
              <span className="font-semibold text-slate-600 block uppercase text-[10px]">Password Rules:</span>
              <div className="grid grid-cols-2 gap-1">
                <div className={`flex items-center gap-1 ${hasMinLen ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
                  <span>{hasMinLen ? '✓' : '○'}</span> 6+ characters
                </div>
                <div className={`flex items-center gap-1 ${hasUpper ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
                  <span>{hasUpper ? '✓' : '○'}</span> 1 Uppercase
                </div>
                <div className={`flex items-center gap-1 ${hasLower ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
                  <span>{hasLower ? '✓' : '○'}</span> 1 Lowercase
                </div>
                <div className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
                  <span>{hasNumber ? '✓' : '○'}</span> 1 Number
                </div>
                <div className={`flex items-center gap-1 col-span-2 ${hasSpecial ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
                  <span>{hasSpecial ? '✓' : '○'}</span> 1 Special Char (@#$%^&*)
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isRegPasswordValid || !isRegPasswordMatch}
              className="w-full py-2.5 bg-[#064e3b] hover:bg-[#043d2e] active:bg-[#022c21] text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Send OTP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <div className="text-center pt-1.5">
              <p className="text-xs text-slate-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                  className="font-semibold text-emerald-800 hover:text-emerald-900 hover:underline transition-colors"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        )}

        {/* ================= FOOTER LINKS ================= */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-3 text-[11px] text-slate-400">
          <Link to="/terms-and-conditions" className="hover:text-slate-700 transition-colors">
            Terms
          </Link>
          <span>•</span>
          <Link to="/privacy-policy" className="hover:text-slate-700 transition-colors">
            Privacy
          </Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-slate-700 transition-colors">
            Contact
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
