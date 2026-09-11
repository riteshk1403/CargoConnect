import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Truck, Plus, CheckCircle2, AlertTriangle, ShieldCheck, X, RefreshCw, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PartnerFleet = () => {
  const { user } = useAuth();
  const partnerId = user?.cargoPartnerId || 1;

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    vehicleNumber: '',
    type: '14 FT Truck',
    capacity: 2500,
    status: 'AVAILABLE',
    verificationStatus: 'VERIFIED'
  });

  const fetchVehicles = async () => {
    try {
      const res = await api.get(`/partners/${partnerId}/vehicles`);
      setVehicles(res.data || []);
    } catch (err) {
      console.error('Failed to load vehicles', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchVehicles();
      setLoading(false);
    };
    init();
  }, [partnerId]);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post(`/partners/${partnerId}/vehicles`, {
        ...formData,
        cargoPartnerId: partnerId,
        capacity: parseFloat(formData.capacity)
      });
      setIsAddModalOpen(false);
      setFormData({
        vehicleNumber: '',
        type: '14 FT Truck',
        capacity: 2500,
        status: 'AVAILABLE',
        verificationStatus: 'VERIFIED'
      });
      fetchVehicles();
      alert('Vehicle added to company fleet successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register vehicle.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title="Partner Company Fleet">
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-400" />
              Company Fleet Registry
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage your company-owned commercial vehicles, registration compliance, and tonnage capacity.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-brand-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle to Fleet</span>
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Fleet Vehicles ({vehicles.length})
            </h3>
            <button
              onClick={fetchVehicles}
              className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Vehicle Reg No</th>
                  <th className="py-3.5 px-4">Vehicle Type</th>
                  <th className="py-3.5 px-4">Max Capacity</th>
                  <th className="py-3.5 px-4">Availability</th>
                  <th className="py-3.5 px-4">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {vehicles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No vehicles in fleet. Click "+ Add Vehicle to Fleet" above.
                    </td>
                  </tr>
                ) : (
                  vehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {v.vehicleNumber}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        {v.type}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        {v.capacity} kg
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                          v.status === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 bg-brand-500/10 text-brand-300 border border-brand-500/20 rounded-xl text-[10px] font-bold inline-flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-brand-400" />
                          {v.verificationStatus || 'VERIFIED'}
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

      {/* ADD VEHICLE MODAL */}
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
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Add Vehicle to Fleet</h3>
                  <p className="text-xs text-slate-400">Register new commercial cargo vehicle</p>
                </div>
              </div>

              <form onSubmit={handleAddVehicle} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Vehicle Registration Number (e.g. MH-12-AB-1234)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MH-12-AB-1234"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="Tata Ace">Tata Ace (Mini Truck - 1 Ton)</option>
                    <option value="14 FT Truck">14 FT Open/Closed Truck (2.5 Ton)</option>
                    <option value="19 FT Container">19 FT Container (5 Ton)</option>
                    <option value="Pickup Van">Pickup Van (1.5 Ton)</option>
                    <option value="20 FT Trailer">20 FT Heavy Trailer (15 Ton)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Max Payload Capacity (kg)
                  </label>
                  <input
                    type="number"
                    required
                    min={500}
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
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
                    {saving ? 'Adding...' : 'Register Vehicle'}
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

export default PartnerFleet;
