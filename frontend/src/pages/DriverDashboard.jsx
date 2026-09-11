import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import ProofOfDeliveryModal from '../components/ProofOfDeliveryModal';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  KeyRound, 
  ShieldCheck, 
  FileCheck2, 
  ArrowRight,
  AlertTriangle,
  Play,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';
import MovingCargoTruck from '../components/MovingCargoTruck';

const DriverDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activeShipments, setActiveShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForDelivery, setSelectedForDelivery] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDriverData = async () => {
    try {
      const driverId = user?.driverId || 1;
      const [statsRes, shipRes] = await Promise.all([
        api.get(`/reports/driver/${driverId}`),
        api.get(`/shipments/driver/${driverId}`)
      ]);
      setStats(statsRes.data);
      setActiveShipments(shipRes.data || []);
    } catch (err) {
      console.error('Failed to load driver dashboard', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchDriverData();
      setLoading(false);
    };
    init();
  }, [user]);

  const handleAdvanceTransit = async (shipmentId) => {
    setActionLoading(true);
    try {
      await api.post(`/shipments/${shipmentId}/transit`);
      fetchDriverData();
    } catch (err) {
      alert(err.response?.data?.message || 'Transit transition failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const getNextTransitLabel = (st) => {
    if (st === 'ASSIGNED') return 'Mark Cargo Picked Up';
    if (st === 'PICKED_UP') return 'Start Highway Transit';
    if (st === 'IN_TRANSIT') return 'Mark Out For Delivery';
    return null;
  };

  return (
    <Layout title="Driver & Trip Operations Terminal">
      <div className="space-y-6">
        {/* Driver Welcome Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-gradient-to-tr from-brand-600 to-indigo-600 rounded-2xl text-white shadow-xl shadow-brand-500/20 shrink-0">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">
                Driver Verified Manifest
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">{user?.username}</h2>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="text-amber-400 font-bold">★ {stats?.driverPerformance || 5.0} Performance</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">{stats?.deliveredShipments || 0} Successful Deliveries</span>
              </div>
            </div>
          </div>

          {/* Animated Moving Cargo Truck */}
          <div className="scale-90 md:scale-95 shrink-0">
            <MovingCargoTruck compact={true} showRoad={true} />
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-right text-xs">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Active Manifests</span>
              <span className="text-lg font-bold text-indigo-400 font-mono">
                {activeShipments.filter((s) => s.status !== 'DELIVERED' && s.status !== 'CANCELLED').length} Assigned
              </span>
            </div>
          </div>
        </div>

        {/* Assigned Shipments Work Queue */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Current Trip Assignments & Status Controls
          </h3>

          {activeShipments.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-500">
              <Truck className="w-10 h-10 text-slate-700 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-400">No active trips currently assigned</p>
              <p className="text-xs text-slate-600 mt-1">
                Operations dispatch will allocate your next load when a consignment is ready.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeShipments.map((s) => {
                const nextLabel = getNextTransitLabel(s.status);
                const isReadyForDelivery = s.status === 'OUT_FOR_DELIVERY' || s.status === 'IN_TRANSIT';

                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 relative"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Consignment</span>
                        <h4 className="text-base font-bold font-mono text-brand-400">{s.shipmentId}</h4>
                      </div>
                      <StatusBadge status={s.status} />
                    </div>

                    {/* Route Details */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2 text-slate-300">
                        <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-400">Pickup:</strong> {s.pickupAddress}
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-slate-300">
                        <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-400">Deliver to:</strong> {s.deliveryAddress}
                        </div>
                      </div>

                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-500 block">Cargo Weight:</span>
                          <span className="font-bold text-white">{s.weight} kg</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Recipient Contact:</span>
                          <span className="font-bold text-white truncate block">{s.contactName} ({s.contactPhone})</span>
                        </div>
                      </div>
                    </div>

                    {/* Step Controls */}
                    {s.status !== 'DELIVERED' && s.status !== 'CANCELLED' && (
                      <div className="pt-2 flex flex-col sm:flex-row gap-2">
                        {nextLabel && (
                          <button
                            onClick={() => handleAdvanceTransit(s.id)}
                            disabled={actionLoading}
                            className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-brand-600/20"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            {nextLabel}
                          </button>
                        )}

                        {isReadyForDelivery && (
                          <button
                            onClick={() => setSelectedForDelivery(s)}
                            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            Verify Customer OTP & Deliver
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Proof of Delivery OTP Modal */}
      <ProofOfDeliveryModal
        isOpen={!!selectedForDelivery}
        onClose={() => setSelectedForDelivery(null)}
        shipment={selectedForDelivery}
        onSuccess={() => fetchDriverData()}
      />
    </Layout>
  );
};

export default DriverDashboard;
