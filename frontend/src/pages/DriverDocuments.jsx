import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FileCheck, Upload, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const DriverDocuments = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('2028-12-31');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');

  const fetchDocs = async () => {
    try {
      const driverId = user?.driverId || 1;
      const res = await api.get(`/documents/entity/DRIVER/${driverId}`);
      setDocuments(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [user]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    setSuccess('');
    try {
      const driverId = user?.driverId || 1;
      await api.post('/documents/upload', {
        entityType: 'DRIVER',
        entityId: driverId,
        documentType: 'DRIVING_LICENSE',
        fileName: `dl_${user?.username || 'driver'}.pdf`,
        fileData: 'ENCRYPTED_DOC_STREAM_DATA',
        expiryDate
      });
      setSuccess('Driving license uploaded! Pending compliance team verification.');
      fetchDocs();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout title="Driver Compliance & Credentials">
      <div className="max-w-3xl space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-500/10 text-brand-400 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Driving License Verification</h3>
              <p className="text-xs text-slate-400">
                A valid, verified Commercial Driving License is required to accept vehicle dispatch orders.
              </p>
            </div>
          </div>

          {success && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Current Documents List */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Submitted Credentials</h4>
            {documents.length === 0 ? (
              <p className="text-xs text-slate-500">No documents on record. Please upload your driving license below.</p>
            ) : (
              documents.map((d) => (
                <div key={d.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-xs block">{d.documentType?.replace(/_/g, ' ')}</span>
                    <span className="text-[11px] text-slate-500">File: {d.fileName} • Expiry: {d.expiryDate || 'N/A'}</span>
                    {d.rejectionReason && (
                      <span className="text-[10px] text-rose-400 block mt-1">Reason: {d.rejectionReason}</span>
                    )}
                  </div>
                  <StatusBadge status={d.status} />
                </div>
              ))
            )}
          </div>

          {/* Upload Form */}
          <form onSubmit={handleUpload} className="pt-4 border-t border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Upload / Replace License</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">License Expiry Date</label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Submit License for Verification'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default DriverDocuments;
