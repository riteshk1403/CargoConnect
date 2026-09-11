import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MovingCargoTruck from '../components/MovingCargoTruck';
import api from '../utils/api';
import { KeyRound, Mail, Lock, CheckCircle2, AlertCircle, Eye, EyeOff, ArrowRight, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = Request OTP, 2 = Verify OTP & Set New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Password rules validation
  const hasMinLen = newPassword.length >= 6;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[@#$%^&+=!._\-\*\(\)\[\]\{\}~`|:;"'<>,?/]/.test(newPassword);
  const isPasswordValid = hasMinLen && hasUpper && hasLower && hasNumber && hasSpecial;
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  // Step 1: Request Password Reset OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post('/auth/forgot-password', {
        email: email.trim().toLowerCase()
      });
      setMessage(res.data.message || 'Password reset OTP has been sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request reset OTP. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit OTP & New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      setError('Please enter the 6-digit OTP sent to your email.');
      return;
    }
    if (!isPasswordValid) {
      setError('Please ensure your new password satisfies all security requirements.');
      return;
    }
    if (!isMatch) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post('/auth/reset-password', {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword: newPassword
      });
      setMessage(res.data.message || 'Password reset successfully! Redirecting to sign in...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please check your OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

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
              <KeyRound className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {step === 1 ? 'Reset Password' : 'Set New Password'}
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {step === 1
                ? 'Enter your registered email address and we will dispatch a 6-digit security code.'
                : `Enter the 6-digit OTP sent to ${email} and choose a strong password.`}
            </p>
          </div>

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

          {/* Step 1: Request OTP */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition-all active:scale-[0.99] disabled:opacity-50"
              >
                <Mail className="w-4 h-4" />
                <span>{loading ? 'Sending Code...' : 'Send Password Reset Code'}</span>
              </button>
            </form>
          )}

          {/* Step 2: OTP & New Password */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Dev Mode OTP Banner */}
              {otp && (
                <div className="p-3 bg-gradient-to-r from-brand-950 to-indigo-950/60 border border-brand-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-lg">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-brand-400" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Dev Reset Code</span>
                      <span className="font-mono font-black text-brand-300 text-sm tracking-widest">{otp}</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  6-Digit Reset Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="e.g. 482913"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 font-mono font-bold text-center text-lg tracking-widest text-emerald-400 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New strong password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-xs text-white focus:outline-none focus:border-brand-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>

              {/* Real-Time Password Strength Checklist */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 text-[11px]">
                <span className="font-bold text-slate-400 block mb-1 uppercase text-[10px]">
                  Password Security Requirements:
                </span>
                <div className="grid grid-cols-2 gap-1">
                  <div className={`flex items-center gap-1.5 ${hasMinLen ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                    <span>{hasMinLen ? '✓' : '○'}</span> At least 6 chars
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                    <span>{hasUpper ? '✓' : '○'}</span> 1 Uppercase (A-Z)
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasLower ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                    <span>{hasLower ? '✓' : '○'}</span> 1 Lowercase (a-z)
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                    <span>{hasNumber ? '✓' : '○'}</span> 1 Number (0-9)
                  </div>
                  <div className={`flex items-center gap-1.5 col-span-2 ${hasSpecial ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                    <span>{hasSpecial ? '✓' : '○'}</span> 1 Special Character (@#$%^&* etc.)
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isPasswordValid || !isMatch}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.99] disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{loading ? 'Updating Password...' : 'Reset & Save Password'}</span>
              </button>
            </form>
          )}

          {/* Footer Navigation */}
          <div className="pt-2 border-t border-slate-800/80 text-center space-y-2">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-brand-400 hover:text-brand-300 font-semibold block mx-auto"
              >
                ← Back to Request OTP
              </button>
            )}
            <div>
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Remember your password? Sign In
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
