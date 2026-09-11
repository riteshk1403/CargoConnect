import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import MovingCargoTruck from '../components/MovingCargoTruck';
import api from '../utils/api';
import { ShieldCheck, Mail, ArrowRight, RefreshCw, CheckCircle2, AlertCircle, Lock, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [devOtp, setDevOtp] = useState('');

  // 60-second cooldown timer for resending OTP
  const [cooldown, setCooldown] = useState(60);

  const inputRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Fetch Dev Mode OTP preview if email is present
  useEffect(() => {
    const fetchDevOtp = async () => {
      if (!email || !email.includes('@')) return;
      try {
        const res = await api.get(`/auth/dev-otp?email=${encodeURIComponent(email.trim().toLowerCase())}`);
        if (res.data?.verificationOtp) {
          setDevOtp(res.data.verificationOtp);
        }
      } catch (err) {
        // Silent fallback in prod
      }
    };
    fetchDevOtp();
  }, [email, resending]);

  const handleDigitChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.replace(/[^0-9]/g, '').slice(0, 6);
      if (pasted.length > 0) {
        const nextDigits = [...otpDigits];
        for (let i = 0; i < pasted.length; i++) {
          nextDigits[i] = pasted[i];
        }
        setOtpDigits(nextDigits);
        const focusIdx = Math.min(pasted.length, 5);
        inputRefs.current[focusIdx]?.focus();
      }
      return;
    }

    const digit = value.replace(/[^0-9]/g, '');
    const nextDigits = [...otpDigits];
    nextDigits[index] = digit;
    setOtpDigits(nextDigits);

    // Auto-advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (fullOtp.length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post('/auth/verify-otp', {
        email: email.trim().toLowerCase(),
        otp: fullOtp
      });
      setIsSuccess(true);
      setMessage(res.data.message || 'Email verified successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setError('Please provide your email address to resend OTP.');
      return;
    }
    if (cooldown > 0) return;

    setResending(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post('/auth/resend-otp', {
        email: email.trim().toLowerCase()
      });
      setMessage(res.data.message || 'A fresh 6-digit verification code has been dispatched.');
      setCooldown(60);
      setOtpDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      // Refetch dev OTP
      const devRes = await api.get(`/auth/dev-otp?email=${encodeURIComponent(email.trim().toLowerCase())}`);
      if (devRes.data?.verificationOtp) {
        setDevOtp(devRes.data.verificationOtp);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again later.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Moving Cargo Truck Animation */}
      <div className="w-full max-w-md mx-auto mb-4 px-4">
        <MovingCargoTruck compact={true} showRoad={false} />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-brand-500/10 text-brand-400 rounded-2xl border border-brand-500/20 mb-1">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Verify Your Email</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We sent a 6-digit security verification code to your email address. It will expire in 10 minutes.
            </p>
          </div>

          {/* Dev Mode OTP Banner */}
          {devOtp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-gradient-to-r from-brand-950 to-indigo-950/60 border border-brand-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-lg"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-brand-500/20 text-brand-300 rounded-xl">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Dev Simulation Code</span>
                  <span className="font-mono font-black text-brand-300 text-sm tracking-widest">{devOtp}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const digits = devOtp.split('');
                  setOtpDigits(digits);
                  inputRefs.current[5]?.focus();
                }}
                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold text-xs shadow-md shadow-brand-600/30 transition-all active:scale-95"
              >
                Auto-Fill
              </button>
            </motion.div>
          )}

          {/* Feedback Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-2.5 text-rose-400 text-xs font-semibold"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {message && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-2.5 text-emerald-400 text-xs font-semibold"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </motion.div>
          )}

          {/* Verification Form */}
          <form onSubmit={handleVerify} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            {/* 6-Digit OTP Box Inputs */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                Enter 6-Digit Verification Code
              </label>
              <div className="flex justify-between gap-2 sm:gap-2.5">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={idx === 0 ? 6 : 1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 bg-slate-950 border-2 border-slate-800 focus:border-brand-500 rounded-2xl text-center font-mono font-black text-xl text-white focus:outline-none transition-all shadow-inner"
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isSuccess}
              className="w-full py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Verifying...' : isSuccess ? 'Verified!' : 'Verify Email & Activate'}</span>
            </button>
          </form>

          {/* Resend OTP Section */}
          <div className="pt-2 border-t border-slate-800/80 text-center space-y-3">
            <p className="text-xs text-slate-500 font-medium">
              Didn't receive the code or OTP expired?
            </p>

            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || resending}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-400 hover:text-brand-300 disabled:text-slate-600 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend Verification Code'}
              </span>
            </button>

            <div className="pt-2">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;
