import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { ClipboardList, Shield, RefreshCw, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/audit-logs');
      setLogs(res.data || []);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchLogs();
      setLoading(false);
    };
    init();
  }, []);

  return (
    <Layout title="System Compliance & Audit Trail">
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl border border-brand-500/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Immutable Event Logging</h3>
              <p className="text-xs text-slate-400">
                Tracking all dispatch decisions, verification events, breakdown incidents, and financial adjustments.
              </p>
            </div>
          </div>

          <button
            onClick={fetchLogs}
            className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Logs</span>
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex justify-between items-center">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Recorded Action History ({logs.length} Entries)
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Entity & Target</th>
                  <th className="py-3 px-4">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No audit log records available.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/30 transition-colors font-mono">
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        {log.username}
                      </td>
                      <td className="py-3 px-4 text-brand-400 font-semibold">
                        {log.userRole}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-bold text-amber-300">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {log.entityType} #{log.entityId}
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-sans text-xs max-w-md">
                        {log.details}
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

export default AuditLogs;
