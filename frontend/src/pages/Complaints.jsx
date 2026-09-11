import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Layout from '../components/Layout';
import { Plus, Search, X, Check, ShieldAlert, AlertTriangle, PlayCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Complaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Resolution Modal states
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [resolutionAction, setResolutionAction] = useState('FULL_REFUND');
  const [customAmount, setCustomAmount] = useState(0);

  // Form Raise Complaint Data
  const [formData, setFormData] = useState({
    shipmentId: '',
    type: 'LATE_DELIVERY',
    description: ''
  });

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await api.get('/complaints');
      setComplaints(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleRaise = async (e) => {
    e.preventDefault();
    try {
      await api.post('/complaints', formData);
      setIsModalOpen(false);
      fetchComplaints();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to file complaint. Verify if Shipment ID is correct.');
    }
  };

  const handleResolve = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/complaints/${selectedComplaint.id}/resolve`, {
        resolution: resolutionAction,
        customAmount: customAmount
      });
      setSelectedComplaint(null);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply resolution');
    }
  };

  const resetForm = () => {
    setFormData({
      shipmentId: '',
      type: 'LATE_DELIVERY',
      description: ''
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'RESOLVED':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'REJECTED':
        return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      default:
        return 'bg-slate-800 border-slate-700 text-slate-400';
    }
  };

  return (
    <Layout title="Customer Complaints">
      {/* Search/Actions Bar */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Service Disruption Log</h3>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-4 rounded-xl text-sm flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          File Complaint
        </button>
      </div>

      {/* Complaints Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-500"></div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-900/30">
                <th className="py-3.5 px-6">Complaint Type</th>
                <th className="py-3.5 px-6">Shipment ID</th>
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-6">Resolution Action Taken</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-sm">
              {complaints.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">No complaints registered in system logs.</td>
                </tr>
              ) : (
                complaints.map((c) => (
                  <tr key={c.id} className="text-slate-300 hover:bg-slate-900/20">
                    <td className="py-4 px-6 font-semibold text-white">
                      {c.type.replace(/_/g, ' ')}
                      <span className="text-[9px] text-slate-500 block font-sans font-normal mt-0.5">Filed: {new Date(c.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="py-4 px-6 font-mono text-brand-400 font-semibold">
                      CC-{c.shipmentId ? c.shipmentId.substring(0, 8) : 'NA'}
                    </td>
                    <td className="py-4 px-6 max-w-xs truncate text-slate-400 text-xs">
                      {c.description}
                    </td>
                    <td className="py-4 px-6">
                      {c.status !== 'PENDING' ? (
                        <div>
                          <p className="font-semibold text-white">{c.actionTaken || 'Resolved'}</p>
                          {Number(c.refundAmount || 0) > 0 && (
                            <p className="text-xs text-emerald-400">Refunded: ₹{Number(c.refundAmount || 0).toFixed(2)}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Awaiting Review</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyle(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {c.status === 'PENDING' && user?.role === 'ROLE_ADMIN' ? (
                        <button
                          onClick={() => setSelectedComplaint(c)}
                          className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-1 px-3 rounded-lg text-xs transition-colors"
                        >
                          Resolve
                        </button>
                      ) : (
                        <span className="text-slate-600 font-mono text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Raise Complaint Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">File Customer Complaint</h3>

            <form onSubmit={handleRaise} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Shipment Reference ID (Internal ID)</label>
                <input
                  type="text" required
                  value={formData.shipmentId}
                  onChange={(e) => setFormData({...formData, shipmentId: e.target.value})}
                  placeholder="e.g. 646a78b9c... (Copy ID from Shipments list)"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Complaint Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-sm focus:border-brand-500 focus:outline-none"
                >
                  <option value="LATE_DELIVERY">LATE DELIVERY</option>
                  <option value="DAMAGED_GOODS">DAMAGED GOODS</option>
                  <option value="MISSING_ITEMS">MISSING ITEMS</option>
                  <option value="WRONG_DELIVERY">WRONG DELIVERY</option>
                  <option value="DRIVER_MISCONDUCT">DRIVER MISCONDUCT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Detailed Description</label>
                <textarea
                  required rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Provide particulars of the incident..."
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-sm focus:border-brand-500 focus:outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl text-sm mt-4 transition-all"
              >
                Submit Complaint Log
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Complaint Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setSelectedComplaint(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">Resolve Service Complaint</h3>
            
            <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl mb-4 text-xs space-y-2 text-slate-400">
              <p><span className="text-slate-500 font-semibold block uppercase">Complaint description</span> {selectedComplaint.description}</p>
            </div>

            <form onSubmit={handleResolve} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Resolution Action</label>
                <select
                  value={resolutionAction}
                  onChange={(e) => setResolutionAction(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-sm focus:border-brand-500 focus:outline-none"
                >
                  <option value="FULL_REFUND">Approve Full Refund (100%)</option>
                  <option value="PARTIAL_REFUND">Approve Partial Refund</option>
                  <option value="REJECT">Reject Complaint (Unjustified)</option>
                  <option value="SUSPEND_DRIVER">Suspend Assigned Driver</option>
                </select>
              </div>

              {resolutionAction === 'PARTIAL_REFUND' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Refund Credit Amount ($)</label>
                  <input
                    type="number" required min="1"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(parseFloat(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm mt-4 transition-all animate-pulse"
              >
                Apply Disciplinary Action / Resolution
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Complaints;
