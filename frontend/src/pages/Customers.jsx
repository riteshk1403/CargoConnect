import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Layout from '../components/Layout';
import { Plus, Search, Edit2, Trash2, History, X, Check, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Customers = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    address: '',
    isCorporate: false,
    creditLimit: 50000
  });

  // History Drawer state
  const [selectedHistoryCustomer, setSelectedHistoryCustomer] = useState(null);
  const [shipmentHistory, setShipmentHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/customers${search ? `?search=${search}` : ''}`);
      setCustomers(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer.id}`, formData);
      } else {
        await api.post('/customers', formData);
      }
      setIsModalOpen(false);
      fetchCustomers();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save customer');
    }
  };

  const handleEdit = (c) => {
    setEditingCustomer(c);
    setFormData({
      name: c.name,
      email: c.email,
      phone: c.phone,
      companyName: c.companyName || '',
      address: c.address || '',
      isCorporate: c.isCorporate,
      creditLimit: c.creditLimit || 50000
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await api.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete customer');
    }
  };

  const handleViewHistory = async (customer) => {
    setSelectedHistoryCustomer(customer);
    setHistoryLoading(true);
    try {
      const response = await api.get(`/customers/${customer.id}/shipments`);
      setShipmentHistory(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const resetForm = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      companyName: '',
      address: '',
      isCorporate: false,
      creditLimit: 50000
    });
  };

  return (
    <Layout title="Customers">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search by name, company, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-brand-500/80 focus:outline-none rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200"
          />
        </div>

        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="w-full sm:w-auto bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-4 rounded-xl text-sm flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Customer
        </button>
      </div>

      {/* Customer Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-500"></div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-900/30">
                <th className="py-3.5 px-6">Customer Details</th>
                <th className="py-3.5 px-6">Contact Info</th>
                <th className="py-3.5 px-6">Account Type</th>
                <th className="py-3.5 px-6">Outstanding Balance</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-sm">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500">No customers found.</td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="text-slate-300 hover:bg-slate-900/20">
                    <td className="py-4 px-6">
                      <p className="font-bold text-white">{c.name}</p>
                      {c.companyName && c.companyName !== 'N/A' && (
                        <p className="text-xs text-slate-500 mt-0.5">{c.companyName}</p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-slate-300">{c.email}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{c.phone}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                        c.isCorporate 
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {c.isCorporate ? 'Corporate' : 'Retail'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {c.isCorporate ? (
                        <div>
                          <p className="font-semibold text-white">₹{Number(c.outstandingBalance || 0).toFixed(2)}</p>
                          <p className="text-xs text-slate-500">Limit: ₹{Number(c.creditLimit || 0).toFixed(0)}</p>
                        </div>
                      ) : (
                        <p className="text-slate-500 font-mono">-</p>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button 
                        onClick={() => handleViewHistory(c)}
                        title="View Shipment History"
                        className="p-1.5 bg-slate-800/80 hover:bg-brand-500/20 hover:text-brand-400 rounded-lg transition-colors"
                      >
                        <History className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(c)}
                        title="Edit Customer"
                        className="p-1.5 bg-slate-800/80 hover:bg-amber-500/20 hover:text-amber-400 rounded-lg transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      {user?.role === 'ROLE_ADMIN' && (
                        <button 
                          onClick={() => handleDelete(c.id)}
                          title="Delete Customer"
                          className="p-1.5 bg-slate-800/80 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Customer Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">
              {editingCustomer ? 'Edit Customer Settings' : 'Register New Customer'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Customer Name</label>
                <input
                  type="text" required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Email</label>
                  <input
                    type="email" required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Phone</label>
                  <input
                    type="text" required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Company Name (Optional)</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Address</label>
                <input
                  type="text" required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 py-2 border-t border-slate-800 mt-4">
                <input
                  type="checkbox"
                  id="isCorporate"
                  checked={formData.isCorporate}
                  onChange={(e) => setFormData({...formData, isCorporate: e.target.checked})}
                  className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="isCorporate" className="text-sm font-semibold text-slate-300">
                  Register as Corporate Account (Enables credit invoice account)
                </label>
              </div>

              {formData.isCorporate && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Credit Limit ($)</label>
                  <input
                    type="number" required
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({...formData, creditLimit: parseFloat(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl text-sm mt-4 transition-all"
              >
                Save Customer details
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Shipment History Drawer */}
      {selectedHistoryCustomer && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Shipment History</h3>
              <p className="text-xs text-slate-500 mt-0.5">{selectedHistoryCustomer.name}</p>
            </div>
            <button 
              onClick={() => setSelectedHistoryCustomer(null)}
              className="text-slate-500 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {historyLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-500"></div>
              </div>
            ) : shipmentHistory.length === 0 ? (
              <p className="text-center text-slate-500 py-12">No shipments booked yet for this customer.</p>
            ) : (
              shipmentHistory.map((s) => (
                <div key={s.id} className="p-4 bg-slate-950 border border-slate-850 rounded-xl relative">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-brand-400 font-bold text-sm">{s.shipmentId}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      s.status === 'DELIVERED' 
                        ? 'bg-sky-500/10 border-sky-500/20 text-sky-400'
                        : s.status === 'CANCELLED'
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    }`}>
                      {s.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-semibold">Good Type</span>
                      <span>{s.goodsType} ({s.weight} kg)</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-semibold">Value</span>
                      <span className="font-bold text-emerald-400">₹{Number(s.price || 0).toFixed(2)}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-500 block uppercase font-semibold">Destination Address</span>
                      <span className="truncate block">{s.deliveryAddress}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Customers;
