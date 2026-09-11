import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import api from '../utils/api';

const ProofOfDeliveryModal = ({ isOpen, onClose, shipment, onSuccess }) => {
  const [otp, setOtp] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !shipment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 4) {
      setError('Please enter a valid 4-digit OTP provided by the recipient.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post(`/shipments/${shipment.id}/deliver`, {
        otp: otp.trim(),
        notes: notes.trim()
      });
      if (onSuccess) onSuccess(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Delivery verification failed. Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-slate-100"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Proof of Delivery</h3>
              <p className="text-xs text-slate-400">Shipment: {shipment.shipmentId}</p>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 mb-4 text-xs text-slate-300">
            <div className="flex justify-between mb-1">
              <span className="text-slate-400">Recipient Contact:</span>
              <span className="font-semibold text-white">{shipment.contactName || 'Customer'}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-400">Phone:</span>
              <span className="font-semibold text-white">{shipment.contactPhone || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Destination:</span>
              <span className="font-semibold text-white truncate max-w-[200px]">{shipment.deliveryAddress}</span>
            </div>
          </div>

          {error && (
            <div className="p-3 mb-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-xs text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Enter 4-Digit Customer OTP
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={4}
                  required
                  placeholder="e.g. 7492"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-center tracking-widest text-xl font-mono text-emerald-400 placeholder:text-slate-700 focus:outline-none focus:border-emerald-500"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Ask the recipient for the secret verification code displayed on their dashboard.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Delivery Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Package handed over at front reception."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || otp.length !== 4}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                {loading ? 'Verifying OTP...' : 'Confirm Delivery'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProofOfDeliveryModal;
