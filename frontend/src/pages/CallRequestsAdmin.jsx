import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { PhoneCall, CheckCircle2, Clock, Phone, RefreshCw, X, MessageSquare, AlertCircle } from 'lucide-react';

const CallRequestsAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCallRequests = async () => {
    try {
      const res = await api.get('/call-requests');
      setRequests(res.data || []);
    } catch (err) {
      console.error('Failed to load call requests', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchCallRequests();
      setLoading(false);
    };
    init();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.put(`/call-requests/${id}/status`, { status });
      fetchCallRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Layout title="Customer Callback Requests">
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-brand-400" />
              Customer Callback Queue
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Direct telephone inquiries from Shippers regarding quotes, consignments, and corporate contracts.
            </p>
          </div>

          <button
            onClick={fetchCallRequests}
            className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Phone Number</th>
                  <th className="py-3.5 px-4">Reason for Call</th>
                  <th className="py-3.5 px-4">Preferred Slot</th>
                  <th className="py-3.5 px-4">Notes</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No callback requests in queue.
                    </td>
                  </tr>
                ) : (
                  requests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">
                        {r.customerName || `Customer #${r.customerId}`}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-400">
                        {r.contactPhone}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-200">
                        {r.reason}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {r.preferredTime || 'Immediate'}
                      </td>
                      <td className="py-3.5 px-4 max-w-[200px] truncate text-slate-400" title={r.notes}>
                        {r.notes || '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                          r.status === 'PENDING'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        {r.status === 'PENDING' ? (
                          <button
                            onClick={() => handleUpdateStatus(r.id, 'RESOLVED')}
                            disabled={updatingId === r.id}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1 shadow-md shadow-emerald-600/20"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Resolved</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-mono">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CallRequestsAdmin;
