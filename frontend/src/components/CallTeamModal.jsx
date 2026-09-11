import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, Clock, ShieldCheck, X, PhoneCall } from 'lucide-react';
import api from '../utils/api';

const CallTeamModal = ({ isOpen, onClose }) => {
  const [supportData, setSupportData] = useState({
    supportEmail: 'support@cargoconnect.com',
    contacts: [
      { id: 1, label: 'Primary Operations Hotline', phoneNumber: '+91 98220 11223', isActive: true },
      { id: 2, label: 'Secondary Support Line', phoneNumber: '+91 98220 44556', isActive: true },
      { id: 3, label: 'Emergency Operations & Dispatch', phoneNumber: '+91 98220 77889', isActive: true }
    ]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchSupportContacts = async () => {
        setLoading(true);
        try {
          const res = await api.get('/support/contacts');
          if (res.data) {
            setSupportData(res.data);
          }
        } catch (err) {
          console.warn('Using default support contacts:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchSupportContacts();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanPhone = (phone) => (phone ? phone.replace(/[^0-9+]/g, '') : '');

  // Filter active contacts or fallback to legacy fields
  const activeContacts = supportData.contacts && supportData.contacts.length > 0
    ? supportData.contacts.filter((c) => c.isActive !== false)
    : [
        supportData.primaryPhone && {
          id: 'p1',
          label: 'Primary Support Number',
          phoneNumber: supportData.primaryPhone,
          isActive: true
        },
        supportData.secondaryPhone && {
          id: 'p2',
          label: 'Secondary Support Line',
          phoneNumber: supportData.secondaryPhone,
          isActive: true
        }
      ].filter(Boolean);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="p-3 bg-brand-500/10 text-brand-400 rounded-2xl border border-brand-500/20">
              <PhoneCall className="w-6 h-6 animate-pulse text-brand-400" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white tracking-tight">CargoConnect Support</h3>
              <p className="text-xs text-slate-400">Direct 24/7 Operations & Dispatch Hotline</p>
            </div>
          </div>

          {/* Dynamic Contact Cards Container */}
          <div className="space-y-3 my-4">
            {activeContacts.map((contact, index) => {
              const isPrimary = index === 0;
              return (
                <div
                  key={contact.id || index}
                  className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="min-w-0">
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-0.5 truncate ${
                      isPrimary ? 'text-brand-400' : 'text-indigo-400'
                    }`}>
                      {contact.label || (isPrimary ? 'Primary Support Hotline' : 'Support Line')}
                    </span>
                    <p className="text-base font-black text-white font-mono tracking-wide truncate">
                      {contact.phoneNumber}
                    </p>
                  </div>
                  <a
                    href={`tel:${cleanPhone(contact.phoneNumber)}`}
                    className={`px-4 py-2 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all shrink-0 ${
                      isPrimary
                        ? 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-brand-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              );
            })}

            {/* Support Email */}
            {supportData.supportEmail && (
              <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Official Support Email
                  </span>
                  <p className="text-xs font-semibold text-slate-200 truncate font-mono">
                    {supportData.supportEmail}
                  </p>
                </div>
                <a
                  href={`mailto:${supportData.supportEmail}`}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 active:scale-95 transition-all shrink-0"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
              </div>
            )}
          </div>

          {/* Quick SLA Banner */}
          <div className="bg-slate-950/50 border border-slate-800/60 rounded-2xl p-3 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Live Desk Response Time:
            </span>
            <span className="text-emerald-400 font-bold font-mono">&lt; 60 seconds</span>
          </div>

          <div className="mt-4 p-3 bg-brand-950/30 border border-brand-800/30 rounded-2xl flex gap-2.5 text-[11px] text-slate-300">
            <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
            <p>
              Dedicated coordinators assist with active dispatches, territory broadcasts, fleet allocation, and settlement inquiries.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Close Support Desk
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CallTeamModal;
