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
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [searchParams] = useSearchParams();
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
          setIsRegister(false);
        } catch (err) {
          setError(err.response?.data?.message || 'Verification link expired or invalid.');
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
      const msg = err.message || 'Authentication failed.';
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
      {/* ================= LEFT COLUMN: PREMIUM LOGISTICS VISUAL & BRANDING (55%) ================= */}
      <div className="w-full lg:w-[55%] relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden bg-slate-950 text-white min-h-[380px] lg:min-h-screen">
        {/* Background Logistics Image with High Fidelity */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1920&q=85')"
          }}
        />

        {/* Professional Dark Navy Overlay for Crisp Contrast */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/95 via-slate-950/80 to-slate-900/60 z-10" />

        {/* Subtle Geometric Route & Grid Accents */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none opacity-10"
          style={{
            backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }}
        />

        {/* Top-Left: CargoConnect Logo & Brand Header */}
        <div className="relative z-20">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="p-2.5 bg-brand-600 rounded-xl text-white shadow-lg shadow-brand-600/30 group-hover:bg-brand-500 transition-colors">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white block">
                CargoConnect
              </span>
              <span className="text-[10px] text-brand-400 font-bold uppercase tracking-wider block">
                B2B Logistics & Fleet Management
              </span>
            </div>
          </Link>
        </div>

        {/* Middle: Headline, Description & 3 Core Capabilities */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-20 my-auto py-8 lg:py-12 max-w-xl space-y-6"
        >
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Move Smarter.<br />
              <span className="text-brand-400">Deliver Better.</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-lg">
              Connect with verified Cargo Partners and manage your shipments with confidence.
            </p>
          </div>

          {/* Three subtle, professional capability badges */}
          <div className="pt-2 space-y-3.5">
            <div className="flex items-center gap-3 text-slate-200">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="text-sm font-medium">Verified Cargo Partners</span>
            </div>
            <div className="flex items-center gap-3 text-slate-200">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="text-sm font-medium">Reliable Shipment Management</span>
            </div>
            <div className="flex items-center gap-3 text-slate-200">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="text-sm font-medium">Transparent Operations</span>
            </div>
          </div>
        </motion.div>

        {/* Bottom-Left: Security & Trust Footer */}
        <div className="relative z-20 pt-6 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-400 flex-shrink-0" />
            <span>Commercial Logistics Platform</span>
          </div>
          <span className="hidden sm:inline text-slate-500">Secure Dispatch Gateway</span>
        </div>
      </div>

      {/* ================= RIGHT COLUMN: CLEAN FORM INTERFACE (45%) ================= */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-6 sm:p-10 lg:p-16 bg-white overflow-y-auto">
        <div className="w-full max-w-[420px] mx-auto my-auto py-4">
          {/* Mobile-Only Header Brand Badge */}
          <div className="flex items-center gap-2.5 mb-6 lg:hidden">
            <div className="p-2 bg-brand-600 rounded-lg text-white">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">CargoConnect</span>
          </div>

          {/* Form Header */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isRegister ? 'Create an Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-slate-500 mt-1.5 font-normal">
              {isRegister 
                ? 'Register to book freight or manage fleet operations' 
                : 'Sign in to continue to CargoConnect'}
            </p>
          </div>

          {/* Error & Feedback Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5 font-medium"
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
                className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {unverifiedEmail !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-2.5"
              >
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Account Verification Required</span>
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

          {/* ================= SIGN IN FORM ================= */}
          {!isRegister ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address or Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="name@company.com or username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-3.5 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
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
                    className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10 transition-all"
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
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsRegister(true); setError(''); setSuccessMsg(''); setUnverifiedEmail(null); }}
                    className="font-semibold text-brand-600 hover:text-brand-700 hover:underline transition-colors"
                  >
                    Register
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* ================= CREATE ACCOUNT FORM ================= */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Account Type
                </label>
                <select
                  value={registerData.role}
                  onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10 transition-all"
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
                    placeholder="e.g. shippingsam"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value.trim() })}
                    className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10 transition-all"
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
                    className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {registerData.role === 'ROLE_CARGO_PARTNER' ? 'Company Name / Fleet Hub' : 'Full Name'}
                </label>
                <input
                  type="text"
                  placeholder={registerData.role === 'ROLE_CARGO_PARTNER' ? "e.g. Pune Logistics Ltd" : "e.g. Vikram Mehta"}
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value, companyName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10 transition-all"
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
                    className="w-full bg-white border border-slate-300 rounded-xl py-2 pl-3 pr-10 text-xs text-slate-900 focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10 transition-all"
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
                  className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10 transition-all"
                />
              </div>

              {/* Real-Time Password Security Rules */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                <span className="font-semibold text-slate-600 block uppercase text-[10px]">Password Rules:</span>
                <div className="grid grid-cols-2 gap-1">
                  <div className={`flex items-center gap-1 ${hasMinLen ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <span>{hasMinLen ? '✓' : '○'}</span> 6+ characters
                  </div>
                  <div className={`flex items-center gap-1 ${hasUpper ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <span>{hasUpper ? '✓' : '○'}</span> 1 Uppercase (A-Z)
                  </div>
                  <div className={`flex items-center gap-1 ${hasLower ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <span>{hasLower ? '✓' : '○'}</span> 1 Lowercase (a-z)
                  </div>
                  <div className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <span>{hasNumber ? '✓' : '○'}</span> 1 Number (0-9)
                  </div>
                  <div className={`flex items-center gap-1 col-span-2 ${hasSpecial ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <span>{hasSpecial ? '✓' : '○'}</span> 1 Special Char (@#$%^&* etc.)
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isRegPasswordValid || !isRegPasswordMatch}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
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

              <div className="text-center pt-2">
                <p className="text-xs text-slate-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsRegister(false); setError(''); setSuccessMsg(''); setUnverifiedEmail(null); }}
                    className="font-semibold text-brand-600 hover:text-brand-700 hover:underline transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Legal & Security Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Secure access to your CargoConnect account</span>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
            <Link to="/terms-and-conditions" className="hover:text-slate-800 transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-slate-300">•</span>
            <Link to="/privacy-policy" className="hover:text-slate-800 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-300">•</span>
            <Link to="/contact" className="hover:text-slate-800 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
