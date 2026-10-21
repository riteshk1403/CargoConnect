import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Truck,
  Lock, 
  User, 
  Mail, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldAlert,
  LogIn,
  UserPlus,
  Check,
  ChevronLeft,
  Navigation,
  Activity,
  PhoneCall,
  Clock,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const Login = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'login';
  const [activeTab, setActiveTab] = useState(initialTab); // 'login' or 'register'
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
          setActiveTab('login');
        } catch (err) {
          setError(err.response?.data?.message || 'Verification link expired or invalid.');
          setActiveTab('login');
        } finally {
          setLoading(false);
        }
      };
      verify();
    }
  }, [verifyToken]);

  // Handle expired/invalid session redirect
  const isExpired = searchParams.get('expired') || searchParams.get('session_expired');
  useEffect(() => {
    if (isExpired) {
      setError('Previous session expired or was unauthorized (403 Forbidden). Stale session cleared — please sign in.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [isExpired]);

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
      let msg = err.response?.data?.message || err.message || 'Authentication failed.';
      if (err.response?.status === 502 || (typeof msg === 'string' && msg.includes('502'))) {
        msg = 'Server Starting (502 Bad Gateway): The backend server is currently spinning up or waking from sleep. Please wait a moment and click Sign In again!';
      } else if (err.response?.status === 504 || (typeof msg === 'string' && msg.includes('504'))) {
        msg = 'Gateway Timeout (504): Server took too long to respond. The cloud backend may be booting up. Please retry in a few moments.';
      } else if (err.response?.status === 405 || (typeof msg === 'string' && msg.includes('405'))) {
        msg = 'Error 405: Backend API URL not connected. Please set VITE_API_URL in Vercel Settings -> Environment Variables to your Render backend URL.';
      } else if (typeof msg === 'string' && msg.toLowerCase().includes('network error')) {
        msg = 'Unable to connect to backend server. If running locally, check port 8080. If on Vercel, verify your Render backend URL.';
      }
      setError(msg);
      if (err.isUnverified || (typeof msg === 'string' && msg.toLowerCase().includes('verify'))) {
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
      let msg = err.response?.data?.message || err.message || 'Registration failed.';
      if (err.response?.status === 502 || (typeof msg === 'string' && msg.includes('502'))) {
        msg = 'Server Starting (502 Bad Gateway): The backend server is waking up. Please wait 15 seconds and try again.';
      } else if (err.response?.status === 405 || (typeof msg === 'string' && msg.includes('405'))) {
        msg = 'Error 405: Backend API URL not connected. Please set VITE_API_URL in Vercel Settings -> Environment Variables to your Render backend URL.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Fill Helper
  const fillDemo = (user, pass) => {
    setIdentifier(user);
    setPassword(pass);
    setError('');
    setSuccessMsg('');
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-white flex flex-col lg:flex-row">
      
      {/* ========================================================================= */}
      {/* LEFT SECTION (55% on lg): CINEMATIC REAL-WORLD FREIGHT BACKDROP & BRAND   */}
      {/* ========================================================================= */}
      <div className="relative hidden lg:flex lg:w-7/12 xl:w-3/5 flex-col justify-between p-10 xl:p-16 overflow-hidden">
        {/* Real-world commercial freight high-res photography */}
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2000&auto=format&fit=crop')`
          }}
        />

        {/* Multi-layered cinematic dark slate & brand navy gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />
        <div className="absolute inset-0 bg-brand-950/30 mix-blend-multiply" />

        {/* Faint Grid Texture */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-15"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />

        {/* Top Header in Left Panel */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2.5 bg-gradient-to-tr from-brand-600 to-indigo-600 rounded-xl text-white shadow-lg shadow-brand-600/30 group-hover:scale-105 transition-transform">
              <Truck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-xl font-black text-white tracking-tight flex items-center gap-1">
                Cargo<span className="text-brand-400">Connect</span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                Enterprise Logistics Cloud
              </p>
            </div>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-xs font-semibold text-emerald-400 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live Dispatch System Online</span>
          </div>
        </div>

        {/* Center Content: Headline & Dynamic Telemetry Cards */}
        <div className="relative z-10 my-auto py-12 max-w-2xl space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-bold text-brand-300">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Automated B2B Freight Marketplace</span>
            </div>

            <h2 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Real-World Freight Movement.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-sky-300 to-emerald-400">
                Transparent & Monitored.
              </span>
            </h2>

            <p className="text-sm xl:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
              Powering freight bookings, vehicle auctions, real-time driver tracking, and instant proof-of-delivery across major industrial corridors.
            </p>
          </div>

          {/* Interactive Live Telemetry Widgets on Left Hero */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Widget 1: Live Trip Status */}
            <div className="p-4 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-slate-700/60 shadow-xl space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Consignment #CC-9042</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                  ON SCHEDULE
                </span>
              </div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span className="truncate">Pune (Chakan) ➔ Mumbai (JNPT)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full w-[72%] rounded-full" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Driver: Rahul S. (MH-12-QX-4010)</span>
                <span className="font-semibold text-white">ETA: 4:15 PM</span>
              </div>
            </div>

            {/* Widget 2: Enterprise Compliance */}
            <div className="p-4 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-slate-700/60 shadow-xl space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Enterprise Verified Network</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                100% KYC verified fleet owners, GST compliant invoices, and automated e-Way bill sync.
              </p>
              <div className="flex items-center gap-3 pt-1 text-[11px] font-semibold text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Check className="w-3 h-3" /> VAHAN
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <Check className="w-3 h-3" /> FASTag
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <Check className="w-3 h-3" /> GPS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust & Helpline Strip */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-6">
            <div>
              <div className="font-bold text-white text-sm">₹4.8 Cr+</div>
              <div className="text-[11px]">Freight Dispatched</div>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div>
              <div className="font-bold text-white text-sm">12,850+</div>
              <div className="text-[11px]">Consignments Moved</div>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div>
              <div className="font-bold text-white text-sm">99.2%</div>
              <div className="text-[11px]">On-Time SLA</div>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-2 text-slate-300">
            <PhoneCall className="w-3.5 h-3.5 text-brand-400" />
            <span>24/7 Control Room: <strong>+91 98220 11223</strong></span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT SECTION (45% on lg): HIGH-CONTRAST AUTHENTICATION CONSOLE           */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-5/12 xl:w-2/5 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-slate-950/95 backdrop-blur-2xl relative z-20 border-l border-slate-900">
        
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between pb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to CargoConnect</span>
          </Link>

          {/* Mobile-only logo display */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="p-1.5 bg-brand-600 rounded-lg text-white">
              <Truck className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-white">CargoConnect</span>
          </div>
        </div>

        {/* Authentication Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-4">
          
          {/* Header Title */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {activeTab === 'login' ? 'Sign In to Portal' : 'Create Your Account'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
              {activeTab === 'login' 
                ? 'Access your unified B2B freight management console.' 
                : 'Join our digital freight corridor for shippers & fleet operators.'}
            </p>
          </div>

          {/* Segmented Switcher (Sign In vs Create Account) */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setError(''); setSuccessMsg(''); setUnverifiedEmail(null); }}
              className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'login'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('register'); setError(''); setSuccessMsg(''); setUnverifiedEmail(null); }}
              className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'register'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Dynamic Error & Success Feedback */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-start gap-2.5 font-medium"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 flex items-center gap-2 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {unverifiedEmail !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200 space-y-2.5"
              >
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Account Verification Required</span>
                </div>
                <p className="text-[11px] text-amber-200/80">
                  Please enter the 6-digit OTP sent to your email to verify your account.
                </p>
                <button
                  type="button"
                  onClick={() => navigate(`/verify-email?email=${encodeURIComponent(unverifiedEmail || identifier)}`)}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <span>Enter 6-Digit OTP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ================= 1. SIGN IN FORM ================= */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address or Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="name@company.com or username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
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
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 active:from-brand-700 active:to-indigo-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-600/25 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Demo Credentials for Fast Testing */}
              <div className="pt-4 border-t border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2 text-center">
                  Quick Access Testing Accounts:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemo('admin', 'admin123')}
                    className="py-2 px-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-200 font-medium transition-colors text-center flex items-center justify-center gap-1.5"
                  >
                    <span>👑 Admin Demo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemo('partner1', 'partner123')}
                    className="py-2 px-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-200 font-medium transition-colors text-center flex items-center justify-center gap-1.5"
                  >
                    <span>🚛 Partner Demo</span>
                  </button>
                </div>
                <div className="mt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      setIdentifier('');
                      setPassword('');
                      setError('');
                      setSuccessMsg('Stored tokens and session cleared. Ready to sign in.');
                    }}
                    className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors underline underline-offset-2"
                  >
                    Reset & Clear Stored Session (Fix 403 / 401 errors)
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ================= 2. CREATE ACCOUNT FORM ================= */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Account Type
                </label>
                <select
                  value={registerData.role}
                  onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
                >
                  <option value="ROLE_SHIPPER">Shipper / B2B Cargo Customer</option>
                  <option value="ROLE_CARGO_PARTNER">Cargo Partner (Fleet Operator)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. samcargo"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value.trim() })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="sam@example.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value.trim() })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {registerData.role === 'ROLE_CARGO_PARTNER' ? 'Company Name / Fleet Hub' : 'Full Name'}
                </label>
                <input
                  type="text"
                  placeholder={registerData.role === 'ROLE_CARGO_PARTNER' ? "e.g. Pune Freight Logistics" : "e.g. Vikram Mehta"}
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value, companyName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Choose strong password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-3 pr-10 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 transition-all"
                />
              </div>

              {/* Real-Time Password Security Rules */}
              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1 text-[11px]">
                <span className="font-semibold text-slate-400 block uppercase text-[10px]">Security Criteria:</span>
                <div className="grid grid-cols-2 gap-1">
                  <div className={`flex items-center gap-1 ${hasMinLen ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                    <span>{hasMinLen ? '✓' : '○'}</span> 6+ characters
                  </div>
                  <div className={`flex items-center gap-1 ${hasUpper ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                    <span>{hasUpper ? '✓' : '○'}</span> 1 Uppercase
                  </div>
                  <div className={`flex items-center gap-1 ${hasLower ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                    <span>{hasLower ? '✓' : '○'}</span> 1 Lowercase
                  </div>
                  <div className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                    <span>{hasNumber ? '✓' : '○'}</span> 1 Number
                  </div>
                  <div className={`flex items-center gap-1 col-span-2 ${hasSpecial ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                    <span>{hasSpecial ? '✓' : '○'}</span> 1 Special Char (@#$%^&*)
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isRegPasswordValid || !isRegPasswordMatch}
                className="w-full py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 active:from-brand-700 active:to-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-600/25 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
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
            </form>
          )}

        </div>

        {/* ================= BOTTOM FOOTER LINKS ================= */}
        <div className="pt-6 border-t border-slate-900 space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit SSL Encrypted Enterprise Gateway</span>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-slate-400">
            <Link to="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-white transition-colors">
              Support Desk
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
