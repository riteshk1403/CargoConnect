import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Layout from '../components/Layout';
import { Plus, Search, Edit2, Trash2, X, AlertTriangle, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Vehicles = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    type: 'Mini Truck',
    capacity: 1000,
    status: 'AVAILABLE'
  });

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await api.get('/vehicles');
      setVehicles(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVehicle) {
        await api.put(`/vehicles/${editingVehicle.id}`, formData);
      } else {
        await api.post('/vehicles', formData);
      }
      setIsModalOpen(false);
      fetchVehicles();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save vehicle');
    }
  };

  const handleEdit = (v) => {
    setEditingVehicle(v);
    setFormData({
      vehicleNumber: v.vehicleNumber,
      type: v.type,
      capacity: v.capacity,
      status: v.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to retire this vehicle from the active fleet?')) return;
    try {
      await api.delete(`/vehicles/${id}`);
      fetchVehicles();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to retire vehicle');
    }
  };

  const resetForm = () => {
    setEditingVehicle(null);
    setFormData({
      vehicleNumber: '',
      type: 'Mini Truck',
      capacity: 1000,
      status: 'AVAILABLE'
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'ASSIGNED':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'IN_TRANSIT':
        return 'bg-brand-500/10 border-brand-500/20 text-brand-400';
      case 'UNDER_MAINTENANCE':
        return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
      case 'OUT_OF_SERVICE':
        return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      default:
        return 'bg-slate-800 border-slate-700 text-slate-400';
    }
  };

  return (
    <Layout title="Vehicles">
      {/* Action Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Fleet Inventory</h3>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-4 rounded-xl text-sm flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Vehicle
        </button>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {vehicles.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500">No vehicles registered in the fleet database.</div>
          ) : (
            vehicles.map((v) => {
              const usedCap = Number(v.usedCapacity || 0);
              const totalCap = Number(v.capacity || 1);
              const capacityUsedPercent = Math.min(100, (usedCap / totalCap) * 100);
              const remainingWeight = Math.max(0, Number(v.capacity || 0) - usedCap);
              return (
                <div key={v.id} className="glass-panel rounded-2xl p-6 border border-slate-800 relative flex flex-col justify-between">
                  <div>
                    {/* Header info */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-800 border border-slate-750 rounded-xl flex items-center justify-center text-brand-400">
                          <Truck className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-white leading-tight">{v.vehicleNumber || 'N/A'}</p>
                          <span className="text-xs text-slate-500">{v.type || 'Standard Truck'}</span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(v.status || 'AVAILABLE')}`}>
                        {(v.status || 'AVAILABLE').replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Weight Capacity Gauges */}
                    <div className="space-y-2 mt-6">
                      <div className="flex justify-between items-end text-xs">
                        <span className="text-slate-500 font-semibold uppercase tracking-wider">Weight Utilization</span>
                        <span className="font-bold text-slate-300">{usedCap.toFixed(0)} / {Number(v.capacity || 0).toFixed(0)} kg</span>
                      </div>
                      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${capacityUsedPercent}%` }}
                          className={`h-full transition-all duration-500 rounded-full ${
                            capacityUsedPercent > 90 
                              ? 'bg-rose-500' 
                              : capacityUsedPercent > 70 
                              ? 'bg-amber-500' 
                              : 'bg-brand-500'
                          }`}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>{capacityUsedPercent.toFixed(0)}% Used</span>
                        <span className="font-medium">{remainingWeight.toFixed(0)} kg capacity left</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="border-t border-slate-800/60 mt-6 pt-4 flex justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(v)}
                      className="flex items-center gap-1 bg-slate-800 hover:bg-amber-500/10 hover:text-amber-400 border border-slate-750 px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-400"
                    >
                      <Edit2 className="h-3 w-3" />
                      Configure
                    </button>
                    {user?.role === 'ROLE_ADMIN' && (
                      <button 
                        onClick={() => handleDelete(v.id)}
                        className="flex items-center gap-1 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 border border-slate-750 px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-400"
                      >
                        <Trash2 className="h-3 w-3" />
                        Decommission
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Vehicle Form Modal */}
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
              {editingVehicle ? 'Configure Vehicle Parameters' : 'Register Fleet Vehicle'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Vehicle Plate Number</label>
                <input
                  type="text" required
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value.toUpperCase()})}
                  placeholder="E.G. CC-TRK-8902"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Vehicle Classification / Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-sm focus:border-brand-500 focus:outline-none"
                >
                  <option value="Mini Truck">Mini Truck (1 - 2 Tons)</option>
                  <option value="Heavy Truck">Heavy Truck (5 - 8 Tons)</option>
                  <option value="Container">Container (15 - 20 Tons)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Weight Capacity (kg)</label>
                <input
                  type="number" required
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: parseFloat(e.target.value)})}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              {editingVehicle && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Operational Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-sm focus:border-brand-500 focus:outline-none"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="ASSIGNED">ASSIGNED</option>
                    <option value="IN_TRANSIT">IN TRANSIT</option>
                    <option value="UNDER_MAINTENANCE">UNDER MAINTENANCE</option>
                    <option value="OUT_OF_SERVICE">OUT OF SERVICE</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl text-sm mt-4 transition-all"
              >
                Save Vehicle details
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Vehicles;
