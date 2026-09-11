import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import api from '../utils/api';
import { 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Calendar, 
  X, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DocumentVerification = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/documents');
      setDocuments(res.data || []);
    } catch (err) {
      console.error('Failed to fetch documents', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchDocuments();
      setLoading(false);
    };
    init();
  }, []);

  const handleApprove = async (docId) => {
    if (!window.confirm('Approve this compliance document?')) return;
    setActionLoading(true);
    try {
      await api.put(`/documents/${docId}/verify`, { status: 'VERIFIED' });
      fetchDocuments();
    } catch (err) {
      alert(err.response?.data?.message || 'Verification failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenReject = (doc) => {
    setSelectedDoc(doc);
    setRejectionReason('Document image unclear or information mismatched.');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedDoc) return;
    setActionLoading(true);
    try {
      await api.put(`/documents/${selectedDoc.id}/reject`, {
        status: 'REJECTED',
        rejectionReason: rejectionReason.trim()
      });
      setIsRejectModalOpen(false);
      fetchDocuments();
    } catch (err) {
      alert(err.response?.data?.message || 'Rejection failed');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredDocs = documents.filter((d) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'PENDING') return d.status === 'PENDING';
    if (filterType === 'DRIVER') return d.entityType === 'DRIVER';
    if (filterType === 'VEHICLE') return d.entityType === 'VEHICLE';
    return true;
  });

  const pendingCount = documents.filter((d) => d.status === 'PENDING').length;
  const verifiedCount = documents.filter((d) => d.status === 'VERIFIED').length;

  return (
    <Layout title="Document Compliance & Verification">
      <div className="space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Pending Verification</p>
              <h3 className="text-2xl font-bold text-amber-400 mt-1">{pendingCount}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Compliant & Verified</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">{verifiedCount}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Total Documents</p>
              <h3 className="text-2xl font-bold text-white mt-1">{documents.length}</h3>
            </div>
            <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {[
              { label: 'All Documents', value: 'ALL' },
              { label: 'Pending Review', value: 'PENDING' },
              { label: 'Driver Licenses', value: 'DRIVER' },
              { label: 'Vehicle Compliance (RC/Ins/Permit)', value: 'VEHICLE' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilterType(tab.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterType === tab.value
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={fetchDocuments}
            className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Compliance Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Driver & Fleet Compliance Registry
            </h3>
            <span className="text-xs text-slate-400">{filteredDocs.length} Documents</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Entity Type</th>
                  <th className="py-3 px-4">Entity ID</th>
                  <th className="py-3 px-4">Document Type</th>
                  <th className="py-3 px-4">File / Reference</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No documents found matching current filter.
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">
                        {doc.entityType}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-brand-400">
                        #{doc.entityId}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        {doc.documentType?.replace(/_/g, ' ')}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        {doc.fileName || 'compliance_doc.pdf'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{doc.expiryDate || 'Permanent / N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={doc.status} />
                        {doc.rejectionReason && (
                          <span className="block text-[10px] text-rose-400 mt-0.5 truncate max-w-[150px]">
                            {doc.rejectionReason}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {doc.status === 'PENDING' ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleApprove(doc.id)}
                              disabled={actionLoading}
                              className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleOpenReject(doc)}
                              disabled={actionLoading}
                              className="px-2.5 py-1 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">
                            Verified by {doc.verifiedBy || 'Admin'}
                          </span>
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

      {/* Reject Reason Modal */}
      <AnimatePresence>
        {isRejectModalOpen && selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-slate-100"
            >
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-white mb-1">
                Reject Compliance Document
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                {selectedDoc.documentType?.replace(/_/g, ' ')} for {selectedDoc.entityType} #{selectedDoc.entityId}
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Rejection Reason (Visible to Driver/Operator)
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  disabled={actionLoading || !rejectionReason.trim()}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default DocumentVerification;
