import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Layout from '../components/Layout';
import { Search, BadgeDollarSign, FileCheck, RefreshCw, Eye } from 'lucide-react';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/payments');
      setPayments(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'PENDING':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'PROCESSING':
        return 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400';
      case 'REFUNDED':
        return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
      case 'FAILED':
        return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      default:
        return 'bg-slate-800 border-slate-700 text-slate-400';
    }
  };

  return (
    <Layout title="Billing Ledger">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Transaction History</h3>
        <button 
          onClick={fetchPayments}
          className="p-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reload Ledger
        </button>
      </div>

      {/* Ledger Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-500"></div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-900/30">
                <th className="py-3.5 px-6">Transaction / Reference ID</th>
                <th className="py-3.5 px-6">Associated Shipment</th>
                <th className="py-3.5 px-6">Payment Method</th>
                <th className="py-3.5 px-6">Billed Amount</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Invoice Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-sm">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">No payment logs found in system registry.</td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="text-slate-300 hover:bg-slate-900/20">
                    <td className="py-4 px-6 font-mono text-xs">
                      {p.transactionId ? (
                        <span className="font-bold text-white block">{p.transactionId}</span>
                      ) : (
                        <span className="text-slate-500 italic block">Unprocessed</span>
                      )}
                      <span className="text-[9px] text-slate-600 block font-sans uppercase mt-0.5">Reference ID: #{String(p.id)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-mono text-xs text-brand-400 font-bold">CC-{String(p.shipmentId || 'NA')}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-400 text-xs tracking-wide uppercase">
                        {p.paymentMethod.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-400">
                      ₹{Number(p.amount || 0).toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyle(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {new Date(p.invoiceDate).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export default Payments;
