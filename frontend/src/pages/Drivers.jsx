import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Layout from '../components/Layout';
import { Plus, Search, Edit2, Trash2, X, Star, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Drivers = () => {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    phone: '',
    status: 'AVAILABLE',
    rating: 5.0,
    totalDeliveries: 0
  });

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/drivers');
      setDrivers(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDriver) {
        await api.put(`/drivers/${editingDriver.id}`, formData);
      } else {
        await api.post('/drivers', formData);
      }
      setIsModalOpen(false);
      fetchDrivers();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save driver');
    }
  };

  const handleEdit = (d) => {
    setEditingDriver(d);
    setFormData({
      name: d.name || '',
      licenseNumber: d.licenseNumber || '',
      phone: d.phone || '',
      status: d.status || 'AVAILABLE',
      rating: d.rating != null ? d.rating : 5.0,
      totalDeliveries: d.totalDeliveries ?? 0
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to suspend or delete this driver?')) return;
    try {
      await api.delete(`/drivers/${id}`);
      fetchDrivers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete driver');
    }
  };

  const resetForm = () => {
    setEditingDriver(null);
    setFormData({
      name: '',
      licenseNumber: '',
      phone: '',
      status: 'AVAILABLE',
      rating: 5.0,
      totalDeliveries: 0
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'ASSIGNED':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'UNAVAILABLE':
        return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      default:
        return 'bg-slate-800 border-slate-700 text-slate-400';
    }
  };

  return (
    <Layout title="Drivers">
      {/* Action Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Driver Registry</h3>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-4 rounded-xl text-sm flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Onboard Driver
        </button>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {drivers.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500">No drivers onboarded in the system database.</div>
          ) : (
            drivers.map((d) => (
              <div key={d.id} className="glass-panel rounded-2xl p-6 border border-slate-800 relative flex flex-col justify-between">
                <div>
                  {/* Header info */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-800 border border-slate-750 rounded-xl flex items-center justify-center font-bold text-lg text-brand-400 capitalize">
                        {(d.name || 'D').substring(0, 1)}
                      </div>
                      <div>
                        <p className="font-bold text-white leading-tight">{d.name || 'Driver'}</p>
                        <span className="text-xs text-slate-500">License: {d.licenseNumber || 'N/A'}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(d.status || 'AVAILABLE')}`}>
                      {d.status || 'AVAILABLE'}
                    </span>
                  </div>

                  {/* Rating and details */}
                  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-b border-slate-800/40 py-4 text-center">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-semibold">Deliveries</span>
                      <span className="text-lg font-bold text-white mt-1 block">{d.totalDeliveries ?? 0}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-semibold">Service Rating</span>
                      <span className="text-lg font-bold text-white mt-1 flex items-center justify-center gap-1">
                        {d.rating != null ? Number(d.rating).toFixed(1) : '5.0'}
                        <Star className="h-4 w-4 fill-amber-400 stroke-amber-400" />
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-slate-400">
                    <p className="flex justify-between">
                      <span className="text-slate-500">Phone Contact:</span>
                      <span className="font-medium text-slate-300">{d.phone || 'N/A'}</span>
                    </p>
                    {d.activeShipmentId && (
                      <p className="flex justify-between mt-2">
                        <span className="text-slate-500">Active Cargo:</span>
                        <span className="font-mono text-brand-400 font-bold">CC-Active</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions footer */}
                <div className="border-t border-slate-800/60 mt-6 pt-4 flex justify-end gap-2">
                  <button 
                    onClick={() => handleEdit(d)}
                    className="flex items-center gap-1 bg-slate-800 hover:bg-amber-500/10 hover:text-amber-400 border border-slate-750 px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-400"
                  >
                    <Edit2 className="h-3 w-3" />
                    Configure
                  </button>
                  {user?.role === 'ROLE_ADMIN' && (
                    <button 
                      onClick={() => handleDelete(d.id)}
                      className="flex items-center gap-1 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 border border-slate-750 px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-400"
                    >
                      <Trash2 className="h-3 w-3" />
                      Suspend
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Driver Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">
              {editingDriver ? 'Configure Driver Details' : 'Onboard New Driver'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Driver Full Name</label>
                <input
                  type="text" required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">License Number</label>
                <input
                  type="text" required
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({...formData, licenseNumber: e.target.value.toUpperCase()})}
                  placeholder="E.G. DL-9023451"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Phone Number</label>
                <input
                  type="text" required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+1-555-0100"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              {editingDriver && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Duty Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-sm focus:border-brand-500 focus:outline-none"
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="ASSIGNED">ASSIGNED</option>
                      <option value="UNAVAILABLE">UNAVAILABLE</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Rating</label>
                      <input
                        type="number" step="0.1" max="5" min="0" required
                        value={formData.rating}
                        onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-sm focus:border-brand-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Total Deliveries</label>
                      <input
                        type="number" required
                        value={formData.totalDeliveries}
                        onChange={(e) => setFormData({...formData, totalDeliveries: parseInt(e.target.value)})}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-sm focus:border-brand-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl text-sm mt-4 transition-all"
              >
                Save Driver details
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Drivers;
