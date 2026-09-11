import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Layout from '../components/Layout';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { FileText, TrendingUp, ShieldAlert, Star } from 'lucide-react';

const Reports = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await api.get('/reports/analytics');
        setAnalytics(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Layout title="Analytics & Reports">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500"></div>
        </div>
      </Layout>
    );
  }

  // Format Daily Volume for chart
  const dailyData = Object.entries(analytics?.dailyVolume || {}).map(([date, count]) => ({
    date: date.substring(5), // MM-DD
    Shipments: count
  }));

  // Format Monthly Revenue for chart
  const monthlyData = Object.entries(analytics?.monthlyRevenue || {}).map(([month, rev]) => ({
    month,
    Revenue: rev
  }));

  return (
    <Layout title="Analytics & Reports">
      <div className="space-y-8">
        
        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Shipments Area Chart */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Daily Shipment Log (Past 7 Days)</h4>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorShipments" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0c87eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0c87eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8 }} />
                  <Area type="monotone" dataKey="Shipments" stroke="#0c87eb" strokeWidth={2} fillOpacity={1} fill="url(#colorShipments)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Revenue Bar Chart */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Monthly Revenue Flow ($)</h4>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip cursor={{ fill: 'rgba(30, 41, 59, 0.2)' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8 }} />
                  <Bar dataKey="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Operational Performance Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Driver Rating & Stats */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Driver Service Performance</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-900/30">
                    <th className="py-2.5 px-4">Driver</th>
                    <th className="py-2.5 px-4 text-center">Deliveries</th>
                    <th className="py-2.5 px-4 text-center">Average Rating</th>
                    <th className="py-2.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-xs">
                  {analytics?.driverPerformance?.map((d, idx) => (
                    <tr key={idx} className="text-slate-300 hover:bg-slate-900/20">
                      <td className="py-3 px-4 font-semibold text-white">{d.name || 'Driver'}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-400">{d.totalDeliveries ?? 0}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-400 bg-amber-500/5 px-2 py-0.5 border border-amber-500/10 rounded">
                          {d.rating != null ? Number(d.rating).toFixed(1) : '5.0'}
                          <Star className="h-3 w-3 fill-amber-400 stroke-amber-400" />
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          d.status === 'AVAILABLE' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vehicle Utilization List */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Vehicle Payload & Duty Allocation</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-900/30">
                    <th className="py-2.5 px-4">Vehicle Number</th>
                    <th className="py-2.5 px-4">Classification</th>
                    <th className="py-2.5 px-4 text-center">Payload Used</th>
                    <th className="py-2.5 px-4 text-right">Duty Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-xs">
                  {analytics?.vehicleUtilization?.map((v, idx) => (
                    <tr key={idx} className="text-slate-300 hover:bg-slate-900/20">
                      <td className="py-3 px-4 font-mono font-bold text-white">{v.vehicleNumber}</td>
                      <td className="py-3 px-4 text-slate-400">{v.type}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="h-1.5 w-16 bg-slate-950 rounded-full overflow-hidden shrink-0">
                            <div style={{ width: `${v.capacityUsedPercent}%` }} className="h-full bg-brand-500 rounded-full"></div>
                          </div>
                          <span className="font-bold text-slate-400">{Math.round(v.capacityUsedPercent)}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          v.status === 'AVAILABLE' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : v.status === 'IN_TRANSIT'
                            ? 'bg-brand-500/10 border-brand-500/20 text-brand-400'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}>
                          {v.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Reports;
