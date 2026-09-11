import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import ProofOfDeliveryModal from '../components/ProofOfDeliveryModal';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Truck, MapPin, KeyRound, Play, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const DriverTrips = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForDelivery, setSelectedForDelivery] = useState(null);

  const fetchTrips = async () => {
    try {
      const driverId = user?.driverId || 1;
      const res = await api.get(`/shipments/driver/${driverId}`);
      setTrips(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchTrips();
      setLoading(false);
    };
    init();
  }, [user]);

  const handleAdvanceTransit = async (shipmentId) => {
    try {
      await api.post(`/shipments/${shipmentId}/transit`);
      fetchTrips();
    } catch (err) {
      alert(err.response?.data?.message || 'Transit transition failed.');
    }
  };

  return (
    <Layout title="Trip Manifest & History">
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex justify-between items-center">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            All Assigned Manifests ({trips.length})
          </h3>
          <button
            onClick={fetchTrips}
            className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trips.map((t) => (
            <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                <span className="font-mono font-bold text-brand-400 text-sm">{t.shipmentId}</span>
                <StatusBadge status={t.status} />
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <p><strong className="text-slate-500">From:</strong> {t.pickupAddress}</p>
                <p><strong className="text-slate-500">To:</strong> {t.deliveryAddress}</p>
                <p><strong className="text-slate-500">Cargo Weight:</strong> {t.weight} kg ({t.goodsType || 'General'})</p>
                <p><strong className="text-slate-500">Recipient Contact:</strong> {t.contactName} ({t.contactPhone})</p>
              </div>

              {t.status !== 'DELIVERED' && t.status !== 'CANCELLED' && (
                <div className="pt-2 flex gap-2">
                  {t.status !== 'OUT_FOR_DELIVERY' && (
                    <button
                      onClick={() => handleAdvanceTransit(t.id)}
                      className="flex-1 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Advance Transit
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedForDelivery(t)}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    Enter OTP & Complete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <ProofOfDeliveryModal
        isOpen={!!selectedForDelivery}
        onClose={() => setSelectedForDelivery(null)}
        shipment={selectedForDelivery}
        onSuccess={() => fetchTrips()}
      />
    </Layout>
  );
};

export default DriverTrips;
