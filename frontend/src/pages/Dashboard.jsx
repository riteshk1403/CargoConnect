import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Truck, 
  UserCheck, 
  ClipboardList, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowRight,
  DollarSign,
  Percent,
  Building,
  Phone,
  Mail,
  Save,
  Clock,
  Filter,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import MovingCargoTruck from '../components/MovingCargoTruck';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentShipments, setRecentShipments] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Commission Setting State
  const [commRate, setCommRate] = useState(10.0);
  const [savingComm, setSavingComm] = useState(false);
  const [commSuccess, setCommSuccess] = useState('');

  // Support Contacts State
  const [supportForm, setSupportForm] = useState({
    primaryPhone: '+91 98220 11223',
    secondaryPhone: '+91 98220 44556',
    supportEmail: 'support@cargoconnect.com',
    primaryActive: true,
    secondaryActive: true
  });
  const [savingSupport, setSavingSupport] = useState(false);
  const [supportSuccess, setSupportSuccess] = useState('');
  const [supportError, setSupportError] = useState('');

  // Settlement Filter State
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [partnerFilter, setPartnerFilter] = useState('ALL');

  const fetchData = async () => {
    try {
      const [statsRes, shipmentsRes, commSettingRes, supportRes, settlementsRes] = await Promise.all([
        api.get('/reports/dashboard'),
        api.get('/shipments'),
        api.get('/admin/commissions/settings'),
        api.get('/admin/support/contact'),
        api.get('/admin/commissions/settlements')
      ]);

      setStats(statsRes.data);

      const sorted = (shipmentsRes.data || []).sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setRecentShipments(sorted.slice(0, 5));

      if (commSettingRes.data?.commissionRate != null) {
        setCommRate(commSettingRes.data.commissionRate);
      }

      if (supportRes.data) {
        setSupportForm({
          primaryPhone: supportRes.data.primaryPhone || '+91 98220 11223',
          secondaryPhone: supportRes.data.secondaryPhone || '+91 98220 44556',
          supportEmail: supportRes.data.supportEmail || 'support@cargoconnect.com',
          primaryActive: supportRes.data.primaryActive !== false,
          secondaryActive: supportRes.data.secondaryActive !== false
        });
      }

      setSettlements(settlementsRes.data || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveCommission = async () => {
    setSavingComm(true);
    setCommSuccess('');
    try {
      await api.post('/admin/commissions/settings', { commissionRate: parseFloat(commRate) });
      setCommSuccess('Commission rate updated successfully.');
      setTimeout(() => setCommSuccess(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update commission rate.');
    } finally {
      setSavingComm(false);
    }
  };

  const handleSaveSupportContacts = async () => {
    setSavingSupport(true);
    setSupportSuccess('');
    setSupportError('');

    const p = supportForm.primaryPhone.trim();
    const s = supportForm.secondaryPhone.trim();
    const e = supportForm.supportEmail.trim();

    if (!p || !s) {
      setSupportError('Both primary and secondary support phone numbers are required.');
      setSavingSupport(false);
      return;
    }

    if (!supportForm.primaryActive || !supportForm.secondaryActive) {
      setSupportError('At least two active support phone numbers are required.');
      setSavingSupport(false);
      return;
    }

    if (p.replace(/[^0-9]/g, '') === s.replace(/[^0-9]/g, '')) {
      setSupportError('Primary and secondary phone numbers cannot be identical.');
      setSavingSupport(false);
      return;
    }

    if (!e || !e.includes('@')) {
      setSupportError('Please provide a valid support email address.');
      setSavingSupport(false);
      return;
    }

    try {
      await api.put('/admin/support/contact', supportForm);
      setSupportSuccess('Support contact details updated & published successfully.');
      setTimeout(() => setSupportSuccess(''), 4000);
    } catch (err) {
      setSupportError(err.response?.data?.message || 'Failed to update support contacts.');
    } finally {
      setSavingSupport(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500"></div>
        </div>
      </Layout>
    );
  }

  const cards = [
    { 
      name: 'CargoConnect Commission', 
      value: `₹${(stats?.totalCommissionEarned || stats?.totalRevenue || 0).toLocaleString()}`, 
      icon: Percent, 
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' 
    },
    { 
      name: 'Gross Shipment Value', 
      value: `₹${(stats?.totalGrossShipmentValue || (stats?.totalRevenue || 0) * 10).toLocaleString()}`, 
      icon: TrendingUp, 
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
    },
    { 
      name: 'Partner Net Payout', 
      value: `₹${(stats?.totalPartnerPayout || (stats?.totalRevenue || 0) * 9).toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' 
    },
    { 
      name: 'Total Consignments', 
      value: stats?.totalShipments || 0, 
      icon: ClipboardList, 
      color: 'text-brand-400 bg-brand-500/10 border-brand-500/20' 
    },
    { 
      name: 'Active Cargo Partners', 
      value: stats?.totalCargoPartners || 0, 
      icon: Building, 
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' 
    },
    { 
      name: 'Partner Fleet Vehicles', 
      value: stats?.totalVehicles || 0, 
      icon: Truck, 
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' 
    },
    { 
      name: 'Partner Drivers', 
      value: stats?.totalDrivers || 0, 
      icon: UserCheck, 
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' 
    },
    { 
      name: 'Complaints / Disputes', 
      value: stats?.pendingComplaints || 0, 
      icon: AlertCircle, 
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' 
    },
  ];

  const filteredSettlements = settlements.filter((st) => {
    const matchesStatus = statusFilter === 'ALL' || st.paymentStatus === statusFilter;
    const matchesPartner = partnerFilter === 'ALL' || String(st.cargoPartnerId) === partnerFilter;
    return matchesStatus && matchesPartner;
  });

  const totalSettlementFare = filteredSettlements.reduce((sum, s) => sum + (s.shipmentFare || 0), 0);
  const totalSettlementComm = filteredSettlements.reduce((sum, s) => sum + (s.commissionAmount || 0), 0);
  const totalSettlementPartner = filteredSettlements.reduce((sum, s) => sum + (s.partnerAmount || 0), 0);
  const paidCommTotal = filteredSettlements.filter(s => s.paymentStatus === 'PAID').reduce((sum, s) => sum + (s.commissionAmount || 0), 0);
  const pendingCommTotal = filteredSettlements.filter(s => s.paymentStatus !== 'PAID').reduce((sum, s) => sum + (s.commissionAmount || 0), 0);

  return (
    <Layout title="Operations Control Dashboard">
      <div className="space-y-6">
        {/* Animated Moving Cargo Truck Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
              CargoConnect Marketplace Operations
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Real-Time Fleet & Dispatch Command
            </h2>
            <p className="text-xs text-slate-400 max-w-lg">
              Monitor Less-Than-Truckload (LTL) consolidations, verified cargo partner fleets, automated OTP deliveries, and locked platform commission revenue.
            </p>
          </div>

          <div className="shrink-0 w-full sm:w-auto flex justify-center">
            <MovingCargoTruck compact={false} showRoad={true} />
          </div>
        </div>

        {/* 8-Card Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.name} 
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl transition-all duration-300 hover:border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {card.name}
                  </span>
                  <div className={`p-2.5 rounded-2xl border ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-2xl font-black text-white tracking-tight font-mono">
                    {card.value}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= ADMIN CONFIGURATION PANELS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel 1: CargoConnect Support Contacts Management */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-brand-500/10 text-brand-400 rounded-xl border border-brand-500/20">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">CargoConnect Support Contacts</h3>
                  <p className="text-[11px] text-slate-400">Published to Shippers & Partners (Min. 2 active numbers required)</p>
                </div>
              </div>
              <Link
                to="/admin/support"
                className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800"
              >
                <span>Full Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {supportError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{supportError}</span>
              </div>
            )}

            {supportSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{supportSuccess}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Primary Support Number</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={supportForm.primaryPhone}
                    onChange={(e) => setSupportForm({ ...supportForm, primaryPhone: e.target.value })}
                    placeholder="+91 98220 11223"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-brand-500"
                  />
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-300 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={supportForm.primaryActive}
                      onChange={(e) => setSupportForm({ ...supportForm, primaryActive: e.target.checked })}
                      className="rounded border-slate-700 text-brand-600 focus:ring-brand-500"
                    />
                    <span>Active</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Secondary Support Number</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={supportForm.secondaryPhone}
                    onChange={(e) => setSupportForm({ ...supportForm, secondaryPhone: e.target.value })}
                    placeholder="+91 98220 44556"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-brand-500"
                  />
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-300 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={supportForm.secondaryActive}
                      onChange={(e) => setSupportForm({ ...supportForm, secondaryActive: e.target.checked })}
                      className="rounded border-slate-700 text-brand-600 focus:ring-brand-500"
                    />
                    <span>Active</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Support Email</label>
                <input
                  type="email"
                  value={supportForm.supportEmail}
                  onChange={(e) => setSupportForm({ ...supportForm, supportEmail: e.target.value })}
                  placeholder="support@cargoconnect.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSaveSupportContacts}
                  disabled={savingSupport}
                  className="w-full py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-600/30 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingSupport ? 'Saving Contacts...' : 'Save & Publish Support Contacts'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Panel 2: Global Commission Settings */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Platform Commission Settings</h3>
                  <p className="text-[11px] text-slate-400">CargoConnect B2B Marketplace Revenue Split</p>
                </div>
              </div>
            </div>

            {commSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{commSuccess}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Commission Type</label>
                  <input
                    type="text"
                    disabled
                    value="Percentage (%)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-400 font-semibold cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Global Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={commRate}
                    onChange={(e) => setCommRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1 text-slate-300">
                <span className="text-[10px] uppercase font-bold text-amber-400 block">Immutable Policy Note:</span>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  New rate applies only to newly confirmed shipments. Existing locked settlements remain protected at their original agreed rate to preserve financial integrity.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSaveCommission}
                  disabled={savingComm}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-600/30 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingComm ? 'Updating Policy...' : `Save Commission Rate (${commRate}%)`}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= COMMISSION SETTLEMENT REVENUE LEDGER ================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-5 bg-slate-950/70 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Cargo Partner Commission Settlements Ledger
              </h3>
              <p className="text-xs text-slate-400">Settlements generated upon assignment & delivery</p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-semibold text-xs focus:outline-none"
              >
                <option value="ALL">All Payment Statuses</option>
                <option value="PAID">Paid / Cleared</option>
                <option value="PENDING">Pending Payment</option>
                <option value="PAYMENT_INITIATED">Payment Initiated</option>
              </select>

              <button
                onClick={fetchData}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Revenue Metric Strip for Ledger */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-800 bg-slate-950/40 text-xs border-b border-slate-800">
            <div className="p-3.5 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Freight Value</span>
              <span className="text-base font-bold text-white font-mono">₹{totalSettlementFare.toLocaleString()}</span>
            </div>
            <div className="p-3.5 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Platform Commission</span>
              <span className="text-base font-bold text-amber-400 font-mono">₹{totalSettlementComm.toLocaleString()}</span>
            </div>
            <div className="p-3.5 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Paid Commission</span>
              <span className="text-base font-bold text-emerald-400 font-mono">₹{paidCommTotal.toLocaleString()}</span>
            </div>
            <div className="p-3.5 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Pending Commission</span>
              <span className="text-base font-bold text-rose-400 font-mono">₹{pendingCommTotal.toLocaleString()}</span>
            </div>
          </div>

          {filteredSettlements.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No commission settlement records found matching filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-5">Shipment Code</th>
                    <th className="py-3 px-5">Cargo Partner</th>
                    <th className="py-3 px-5">Total Fare</th>
                    <th className="py-3 px-5">Commission Rate</th>
                    <th className="py-3 px-5">Platform Fee</th>
                    <th className="py-3 px-5">Partner Payout</th>
                    <th className="py-3 px-5">Payment Status</th>
                    <th className="py-3 px-5">Payment ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredSettlements.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-5 font-mono font-bold text-brand-400">
                        {s.shipmentNumber || 'CC-' + s.shipmentId}
                      </td>
                      <td className="py-3.5 px-5 font-medium text-white">
                        {s.cargoPartnerName || 'Partner #' + s.cargoPartnerId}
                      </td>
                      <td className="py-3.5 px-5 font-mono font-bold text-white">
                        ₹{(s.shipmentFare || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-amber-400 font-semibold">
                        {s.commissionRate}%
                      </td>
                      <td className="py-3.5 px-5 font-mono font-bold text-amber-400">
                        ₹{(s.commissionAmount || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-5 font-mono font-bold text-emerald-400">
                        ₹{(s.partnerAmount || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          s.paymentStatus === 'PAID'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {s.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-[11px] text-slate-400">
                        {s.razorpayPaymentId || s.paymentOrderId || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 2-Column Section: Recent Shipments & Partner Fleet Utilization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns: Recent Consignments */}
          <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">
                    Recent Consignments
                  </h3>
                  <p className="text-xs text-slate-400">Latest active logistics movements</p>
                </div>
                <Link
                  to="/admin/shipments"
                  className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
                >
                  View All <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 text-slate-500 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-3">Tracking ID</th>
                      <th className="py-3 px-3">Transit Route</th>
                      <th className="py-3 px-3">Cargo Type</th>
                      <th className="py-3 px-3">Weight</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {recentShipments.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-slate-500">
                          No recent consignments.
                        </td>
                      </tr>
                    ) : (
                      recentShipments.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-3 font-mono font-bold text-brand-400">
                            {s.shipmentId}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="text-white block font-medium truncate max-w-[120px]">
                              {s.pickupAddress}
                            </span>
                            <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">
                              to {s.deliveryAddress}
                            </span>
                          </td>
                          <td className="py-3.5 px-3">{s.goodsType || 'General Freight'}</td>
                          <td className="py-3.5 px-3 font-medium">{s.weight} kg</td>
                          <td className="py-3.5 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20">
                              {s.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Fleet Utilization & Marketplace Stats */}
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex flex-col justify-between items-center text-center shadow-2xl">
            <div className="w-full text-left mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Partner Fleet Utilization
              </h3>
              <p className="text-xs text-slate-400">
                Percentage of commercial partner fleet engaged on active consignments
              </p>
            </div>

            <div className="relative flex items-center justify-center my-4">
              <svg className="w-44 h-44 transform -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r="72"
                  className="stroke-slate-800"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="88"
                  cy="88"
                  r="72"
                  className="stroke-brand-500 transition-all duration-1000 ease-out"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={452.4}
                  strokeDashoffset={452.4 - (452.4 * (stats?.vehicleUtilization || 50)) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white">
                  {Math.round(stats?.vehicleUtilization || 50)}%
                </span>
                <span className="text-xs text-slate-500 mt-0.5 uppercase font-semibold tracking-wider">
                  Utilized
                </span>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-3 border-t border-slate-800 pt-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                <span className="text-slate-500 text-[10px] font-bold block uppercase">Total Fleet</span>
                <span className="text-lg font-bold text-white mt-0.5 block">{stats?.totalVehicles || 4} Vehicles</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                <span className="text-slate-500 text-[10px] font-bold block uppercase">Partner Drivers</span>
                <span className="text-lg font-bold text-brand-400 mt-0.5 block">{stats?.totalDrivers || 4} Enrolled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
