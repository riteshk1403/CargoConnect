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
  Check
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
        msg = 'Unable to connect to backend server. If you are running locally, please ensure the backend is active on port 8080.';
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

  // Quick Demo Fill Helper
  const fillDemo = (user, pass) => {
    setIdentifier(user);
    setPassword(pass);
    setError('');
    setSuccessMsg('');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-brand-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-white relative overflow-hidden">
      
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Centered Floating Card */}
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-[460px] bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/60 border border-slate-800 p-6 sm:p-8 relative z-10"
      >
        {/* ================= BRAND HEADER ================= */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-slate-800">
          <div className="p-3 bg-gradient-to-tr from-brand-600 to-indigo-600 rounded-2xl text-white shadow-lg shadow-brand-600/30 mb-3.5 flex items-center justify-center">
            <Truck className="w-8 h-8 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Cargo<span className="text-brand-400">Connect</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            B2B Logistics & Fleet Management
          </p>
        </div>

        {/* ================= TAB SWITCHER (SIGN IN / REGISTER) ================= */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 my-6">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(''); setSuccessMsg(''); setUnverifiedEmail(null); }}
            className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'login'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
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
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* ================= ERROR & SUCCESS FEEDBACK ================= */}
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

        {/* ================= 1. SIGN IN TAB ================= */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address or Username
              </label>
              <input
                type="text"
                required
                placeholder="name@company.com or username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
              />
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
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 active:from-brand-700 active:to-indigo-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-600/25 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Quick Demo Credentials for Fast Testing */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2 text-center">
                Quick Demo Accounts:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo('admin', 'admin123')}
                  className="py-1.5 px-2 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] text-slate-300 font-medium transition-colors text-center"
                >
                  👑 Admin Demo
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('partner1', 'partner123')}
                  className="py-1.5 px-2 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] text-slate-300 font-medium transition-colors text-center"
                >
                  🚛 Partner Demo
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ================= 2. CREATE ACCOUNT TAB ================= */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Account Type
              </label>
              <select
                value={registerData.role}
                onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
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
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
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
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
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
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
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
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 pl-3 pr-10 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-slate-400 hover:text-slate-200"
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
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
              />
            </div>

            {/* Real-Time Password Security Rules */}
            <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1 text-[11px]">
              <span className="font-semibold text-slate-400 block uppercase text-[10px]">Password Rules:</span>
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
              className="w-full py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 active:from-brand-700 active:to-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-600/25 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
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

        {/* ================= FOOTER LINKS & TRUST BADGE ================= */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
            <span>Secure B2B Logistics Gateway</span>
          </div>

          <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
            <Link to="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-white transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
