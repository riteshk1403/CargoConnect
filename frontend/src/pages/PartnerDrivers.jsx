import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { UserCheck, Plus, CheckCircle2, ShieldCheck, X, RefreshCw, Phone, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PartnerDrivers = () => {
  const { user } = useAuth();
  const partnerId = user?.cargoPartnerId || 1;

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    licenseExpiryDate: '2028-12-31',
    status: 'AVAILABLE',
    verificationStatus: 'VERIFIED'
  });

  const fetchDrivers = async () => {
    try {
      const res = await api.get(`/partners/${partnerId}/drivers`);
      setDrivers(res.data || []);
    } catch (err) {
      console.error('Failed to load drivers', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchDrivers();
      setLoading(false);
    };
    init();
  }, [partnerId]);

  const handleAddDriver = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post(`/partners/${partnerId}/drivers`, {
        ...formData,
        cargoPartnerId: partnerId
      });
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        phone: '',
        licenseNumber: '',
        licenseExpiryDate: '2028-12-31',
        status: 'AVAILABLE',
        verificationStatus: 'VERIFIED'
      });
      fetchDrivers();
      alert('Driver registered to partner company successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register driver.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title="Partner Driver Roster">
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-brand-400" />
              Company Driver Roster
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage your company's full-time drivers, commercial license verification, and duty statuses.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-brand-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Register Driver</span>
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Enrolled Drivers ({drivers.length})
            </h3>
            <button
              onClick={fetchDrivers}
              className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Driver Name</th>
                  <th className="py-3.5 px-4">Driving License</th>
                  <th className="py-3.5 px-4">Direct Phone</th>
                  <th className="py-3.5 px-4">Performance</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">License Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {drivers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No drivers enrolled. Click "+ Register Driver" above.
                    </td>
                  </tr>
                ) : (
                  drivers.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">
                        {d.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-300">
                        {d.licenseNumber}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {d.phone || '+91 98901 11223'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-amber-400 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {d.rating || 5.0} ({d.totalDeliveries || 0} trips)
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                          d.status === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 bg-brand-500/10 text-brand-300 border border-brand-500/20 rounded-xl text-[10px] font-bold inline-flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-brand-400" />
                          {d.verificationStatus || 'VERIFIED'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* REGISTER DRIVER MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative text-slate-100 space-y-4"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-500/10 text-brand-400 rounded-2xl border border-brand-500/20">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Enroll Company Driver</h3>
                  <p className="text-xs text-slate-400">Register verified driver under partner fleet</p>
                </div>
              </div>

              <form onSubmit={handleAddDriver} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Driver Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Shinde"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Commercial Driving License No.
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DL-MH-129841"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98901 11223"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-brand-600/30 flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    {saving ? 'Enrolling...' : 'Enroll Driver'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default PartnerDrivers;
