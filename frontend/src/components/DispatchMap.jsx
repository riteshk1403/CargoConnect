import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Truck, CheckCircle2, AlertTriangle, XCircle, Navigation, ShieldCheck, UserCheck } from 'lucide-react';
import StatusBadge from './StatusBadge';

const DispatchMap = ({ shipment, vehicles = [], onSelectVehicle, selectedVehicleId }) => {
  const [activeVehicle, setActiveVehicle] = useState(vehicles[0] || null);

  const pickupLat = shipment?.pickupLatitude || 40.7128;
  const pickupLon = shipment?.pickupLongitude || -74.0060;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Map Header & Controls */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-500/10 text-brand-400 rounded-lg">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Live Dispatch & Nearby Vehicle Locator</h4>
            <p className="text-xs text-slate-400">
              Pickup: {shipment?.pickupAddress || 'Origin'} ({shipment?.weight || 0} kg)
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Suitable & Verified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>Assigned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
            <span>Blocked / Expired</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[420px]">
        {/* Visual Map Area */}
        <div className="lg:col-span-2 relative bg-slate-950 p-6 flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          {/* Map Grid Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>

          {/* Radar Circles around Pickup */}
          <div className="relative w-80 h-80 rounded-full border border-brand-500/20 flex items-center justify-center">
            <div className="w-56 h-56 rounded-full border border-brand-500/15 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border border-brand-500/10 flex items-center justify-center">
                
                {/* Center Pickup Origin Marker */}
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="z-20 p-2.5 bg-brand-600 text-white rounded-full shadow-lg shadow-brand-600/50 flex flex-col items-center cursor-pointer"
                >
                  <MapPin className="w-5 h-5 fill-white stroke-brand-900" />
                  <span className="absolute -bottom-5 whitespace-nowrap text-[10px] font-bold bg-brand-950 px-2 py-0.5 rounded border border-brand-800 text-brand-300">
                    Pickup Origin
                  </span>
                </motion.div>

              </div>
            </div>

            {/* Render Surrounding Vehicle Markers based on relative distance */}
            {vehicles.map((v, idx) => {
              const angles = [35, 125, 215, 305, 70, 160];
              const angle = angles[idx % angles.length];
              const distanceOffset = Math.min(130, Math.max(50, (v.distanceKm || 5) * 12));
              const rad = (angle * Math.PI) / 180;
              const x = Math.cos(rad) * distanceOffset;
              const y = Math.sin(rad) * distanceOffset;

              const isSelected = activeVehicle?.vehicleId === v.vehicleId || selectedVehicleId === v.vehicleId;
              const isEligible = v.isSuitable;

              return (
                <motion.div
                  key={v.vehicleId || idx}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                  whileHover={{ scale: 1.15 }}
                  onClick={() => setActiveVehicle(v)}
                  className={`absolute z-30 p-2 rounded-xl border cursor-pointer transition-all flex items-center gap-1.5 shadow-lg ${
                    isSelected
                      ? 'bg-brand-600 border-white ring-4 ring-brand-500/30 text-white scale-110'
                      : isEligible
                      ? 'bg-slate-900 border-emerald-500/50 text-emerald-400 hover:border-emerald-400'
                      : 'bg-slate-900/90 border-slate-700 text-slate-400 opacity-70'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span className="text-[11px] font-bold font-mono">{v.vehicleNumber}</span>
                  <span className="text-[9px] px-1 rounded bg-slate-950 text-slate-300 font-semibold">
                    {v.distanceKm} km
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Vehicle Details & Selection Drawer */}
        <div className="p-5 flex flex-col justify-between bg-slate-900/95 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Vehicle Diagnostics
              </h5>
              {activeVehicle && (
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {activeVehicle.distanceKm} km away
                </span>
              )}
            </div>

            {activeVehicle ? (
              <motion.div
                key={activeVehicle.vehicleId}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {/* Vehicle Title & Status */}
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-brand-400" />
                      <span className="font-bold text-white text-sm">{activeVehicle.vehicleNumber}</span>
                    </div>
                    <StatusBadge status={activeVehicle.vehicleStatus} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Type</span>
                      <span className="font-semibold">{activeVehicle.vehicleType}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Remaining Cap.</span>
                      <span className="font-semibold text-emerald-400">{activeVehicle.remainingCapacity} kg</span>
                    </div>
                  </div>
                </div>

                {/* Driver Info */}
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 text-xs">
                  <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-brand-400" />
                    Assigned / Verified Driver
                  </span>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white">{activeVehicle.driverName}</span>
                    <span className="text-amber-400 font-bold">★ {activeVehicle.driverRating || 5.0}</span>
                  </div>
                  <p className="text-slate-400">Phone: {activeVehicle.driverPhone || 'N/A'}</p>
                </div>

                {/* Compliance & Suitability Check */}
                <div className={`p-3 rounded-xl border text-xs flex gap-2 ${
                  activeVehicle.isSuitable
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                }`}>
                  {activeVehicle.isSuitable ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block">
                      {activeVehicle.isSuitable ? 'Ready for Dispatch' : 'Assignment Warning'}
                    </span>
                    <p className="text-[11px] opacity-90 mt-0.5">{activeVehicle.suitabilityReason}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">
                Click a vehicle marker on the radar to inspect distance, capacity, and driver verification.
              </div>
            )}
          </div>

          {/* Action Button */}
          {activeVehicle && onSelectVehicle && (
            <button
              onClick={() => onSelectVehicle(activeVehicle)}
              disabled={!activeVehicle.isSuitable}
              className={`w-full py-3 px-4 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                activeVehicle.isSuitable
                  ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {activeVehicle.isSuitable ? `Select ${activeVehicle.vehicleNumber} for Dispatch` : 'Ineligible for Assignment'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DispatchMap;
