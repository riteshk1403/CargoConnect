import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, PhoneCall, CheckCircle2, AlertCircle, Clock, Calendar } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const RequestCallModal = ({ isOpen, onClose, shipmentId }) => {
  const { user } = useAuth();
  const [reason, setReason] = useState('FARE_DISCUSSION');
  const [preferredTime, setPreferredTime] = useState('Immediate / Next 15 mins');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/call-requests', {
        customerId: user?.customerId || 1,
        shipmentId: shipmentId || null,
        reason,
        preferredTime,
        contactPhone,
        notes
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit call request.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative text-slate-100 space-y-4"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-500/10 text-brand-400 rounded-2xl border border-brand-500/20">
            <PhoneCall className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Request a Callback</h3>
            <p className="text-xs text-slate-400">CargoConnect dispatch coordinators will call you back.</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-6 text-center space-y-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Callback Request Queued!</h4>
            <p className="text-xs text-slate-400">
              Our operations lead will connect with you at {contactPhone} ({preferredTime}).
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Reason for Discussion
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="FARE_DISCUSSION">Fare Quotation & Negotiation</option>
                <option value="NEW_SHIPMENT">New Consignment Dispatch Plan</option>
                <option value="SHIPMENT_ISSUE">Shipment Tracking & Transit Assistance</option>
                <option value="PAYMENT">Corporate Billing / Payment Query</option>
                <option value="OTHER">General Support & Escalation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Preferred Callback Time
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="Immediate / Next 15 mins">Immediate (Next 15 minutes)</option>
                <option value="Today Morning (10 AM - 1 PM)">Today Morning (10 AM - 1 PM)</option>
                <option value="Today Afternoon (2 PM - 6 PM)">Today Afternoon (2 PM - 6 PM)</option>
                <option value="Tomorrow Morning (10 AM - 12 PM)">Tomorrow Morning (10 AM - 12 PM)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Direct Contact Phone
              </label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Additional Notes / Questions (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Mention specific cargo requirements or preferred fare..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              />
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
                disabled={loading}
                className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-brand-600/30"
              >
                <PhoneCall className="w-4 h-4" />
                {loading ? 'Submitting...' : 'Request Call'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default RequestCallModal;
