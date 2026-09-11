import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  Package, 
  Truck, 
  CreditCard, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ArrowRight,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';
import MovingCargoTruck from '../components/MovingCargoTruck';

const ShipperDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentShipments, setRecentShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShipperData = async () => {
    try {
      const custId = user?.customerId || 1;
      const [statsRes, shipRes] = await Promise.all([
        api.get(`/reports/shipper/${custId}`),
        api.get(`/shipments/customer/${custId}`)
      ]);
      setStats(statsRes.data);
      setRecentShipments(shipRes.data || []);
    } catch (err) {
      console.error('Failed to load shipper dashboard', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchShipperData();
      setLoading(false);
    };
    init();
  }, [user]);

  return (
    <Layout title="Shipper Management Portal">
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-brand-900/60 via-slate-900 to-slate-900 border border-brand-500/20 rounded-3xl p-6 relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">B2B Cargo Logistics</span>
            <h2 className="text-2xl font-extrabold text-white">
              Welcome back, {user?.username}
            </h2>
            <p className="text-xs text-slate-400 max-w-lg">
              Dispatch shipments with Less-Than-Truckload (LTL) consolidation, track verified drivers in real time, and manage corporate credit billing.
            </p>
            <div className="pt-2">
              <NavLink
                to="/shipper/create-shipment"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs transition-all shadow-xl shadow-brand-600/30"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Book New Cargo Shipment</span>
              </NavLink>
            </div>
          </div>

          {/* Animated Moving Cargo Truck */}
          <div className="shrink-0 scale-90 md:scale-100">
            <MovingCargoTruck compact={false} showRoad={true} />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 font-semibold uppercase block">Total Shipments</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold text-white">{stats?.totalShipments || recentShipments.length}</span>
              <Package className="w-5 h-5 text-brand-400" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 font-semibold uppercase block">In Transit</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold text-indigo-400">{stats?.activeShipments || 0}</span>
              <Truck className="w-5 h-5 text-indigo-400" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 font-semibold uppercase block">Delivered</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold text-emerald-400">{stats?.deliveredShipments || 0}</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 font-semibold uppercase block">Total Logistics Spend</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold text-white font-mono">${stats?.totalRevenue || 0}</span>
              <CreditCard className="w-5 h-5 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Recent Shipments Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Recent Cargo Dispatches
            </h3>
            <NavLink
              to="/shipper/shipments"
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              <span>View All Shipments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Tracking Code</th>
                  <th className="py-3 px-4">Pickup Origin</th>
                  <th className="py-3 px-4">Delivery Target</th>
                  <th className="py-3 px-4">Weight</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Delivery OTP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {recentShipments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No active shipments found. Click 'Book New Cargo Shipment' to get started.
                    </td>
                  </tr>
                ) : (
                  recentShipments.slice(0, 5).map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-400">
                        {s.shipmentId}
                      </td>
                      <td className="py-3.5 px-4 max-w-[150px] truncate">{s.pickupAddress}</td>
                      <td className="py-3.5 px-4 max-w-[150px] truncate">{s.deliveryAddress}</td>
                      <td className="py-3.5 px-4 font-semibold text-white">{s.weight} kg</td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono bg-slate-950 border border-slate-800 px-2 py-1 rounded text-emerald-400 font-bold">
                          {s.deliveryOtp}
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
    </Layout>
  );
};

export default ShipperDashboard;
