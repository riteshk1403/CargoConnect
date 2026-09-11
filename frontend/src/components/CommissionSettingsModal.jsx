import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Percent, CheckCircle2, AlertCircle, Save, Shield } from 'lucide-react';
import api from '../utils/api';

const CommissionSettingsModal = ({ isOpen, onClose, onUpdated }) => {
  const [commissionRate, setCommissionRate] = useState(10.0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError('');
      setMessage('');
      api.get('/commission')
        .then((res) => {
          if (res.data?.commissionRate !== undefined) {
            setCommissionRate(res.data.commissionRate);
          }
        })
        .catch((err) => {
          console.error('Failed to load commission settings', err);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const res = await api.put('/commission', { commissionRate: parseFloat(commissionRate) });
      setMessage(`Commission rate updated to ${res.data.commissionRate}% successfully!`);
      if (onUpdated) onUpdated(res.data.commissionRate);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update commission rate.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative text-slate-100"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-brand-500/10 text-brand-400 rounded-2xl border border-brand-500/20">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Marketplace Commission Settings</h3>
            <p className="text-xs text-slate-400">CargoConnect platform fee deducted from confirmed partner jobs.</p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="p-3 mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Commission Type
              </label>
              <input
                type="text"
                disabled
                value="Percentage (%)"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Global Platform Commission Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  required
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-3 pr-8 text-sm font-bold text-white focus:outline-none focus:border-brand-500"
                />
                <Percent className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
              </div>
            </div>

            {/* Live Calculation Preview */}
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Live Calculation Example</span>
              <div className="flex justify-between text-slate-300">
                <span>Shipment Fare:</span>
                <span className="font-semibold text-white">₹5,000</span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>CargoConnect Commission ({commissionRate}%):</span>
                <span className="font-bold">₹{((5000 * (parseFloat(commissionRate) || 0)) / 100).toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-1">
                <span>Partner Net Earnings:</span>
                <span>₹{(5000 - (5000 * (parseFloat(commissionRate) || 0)) / 100).toFixed(0)}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300 flex items-start gap-2">
            <Shield className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
            <p className="text-[11px] leading-relaxed">
              <strong>Immutable Settlement Rule:</strong> Changing the commission rate only applies to newly confirmed shipments. Existing confirmed orders remain locked at their original confirmed rate.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-brand-600/30"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Commission'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CommissionSettingsModal;
