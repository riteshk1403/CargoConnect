import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Layout from '../components/Layout';
import { 
  PlayCircle, 
  Truck, 
  UserCheck, 
  AlertTriangle, 
  Calendar, 
  RefreshCw, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const Simulator = () => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delay form state
  const [selectedShipmentId, setSelectedShipmentId] = useState('');
  const [delayDays, setDelayDays] = useState(2);

  // Log events list to show simulation actions
  const [simulationLogs, setSimulationLogs] = useState([
    { time: new Date().toLocaleTimeString(), message: "Simulator console initialized. Awaiting disruption signals...", type: "info" }
  ]);

  const fetchData = async () => {
    try {
      const vRes = await api.get('/vehicles');
      setVehicles(vRes.data || []);

      const dRes = await api.get('/drivers');
      setDrivers(dRes.data || []);

      const sRes = await api.get('/shipments');
      setShipments(sRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };
    init();
  }, []);

  const addLog = (message, type = "warning") => {
    setSimulationLogs(prev => [
      { time: new Date().toLocaleTimeString(), message, type },
      ...prev
    ]);
  };

  const handleBreakdown = async (vehicleId, vehicleNumber) => {
    try {
      await api.post(`/simulator/breakdown/${vehicleId}`);
      addLog(`CRITICAL: Vehicle ${vehicleNumber} broke down! Status set to UNDER_MAINTENANCE. Cargo shipments forced to DELIVERY_FAILED.`, "error");
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to trigger breakdown');
    }
  };

  const handleDriverUnavailable = async (driverId, driverName) => {
    try {
      await api.post(`/simulator/driver-unavailable/${driverId}`);
      addLog(`ALERT: Driver ${driverName} reported sick/unavailable! Status set to UNAVAILABLE. Active shipments automatically reassigned.`, "warning");
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to trigger driver unavailable');
    }
  };

  const handleTriggerDelay = async (e) => {
    e.preventDefault();
    if (!selectedShipmentId) return;
    try {
      const response = await api.post(`/simulator/delay/${selectedShipmentId}`, { days: delayDays });
      addLog(`INFO: Shipment ${response.data.shipmentId} delayed by ${delayDays} days. New delivery date: ${response.data.deliveryDate}`, "info");
      setSelectedShipmentId('');
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to trigger delay');
    }
  };

  if (loading) {
    return (
      <Layout title="Operations Simulator">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Disruption Simulator">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Disruption Controls (Vehicles & Drivers) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Vehicles List */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <Truck className="h-4.5 w-4.5 text-brand-400" />
              Simulate Vehicle Failures
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicles.map((v) => (
                <div key={v.id} className="p-4 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-mono text-white font-bold block">{v.vehicleNumber}</span>
                    <span className="text-[10px] text-slate-500">{v.type} • Status: {v.status}</span>
                  </div>
                  {v.status !== 'UNDER_MAINTENANCE' && v.status !== 'OUT_OF_SERVICE' ? (
                    <button
                      onClick={() => handleBreakdown(v.id, v.vehicleNumber)}
                      className="bg-rose-950/40 border border-rose-900/50 hover:bg-rose-600 hover:text-white text-rose-400 text-xs font-bold py-1.5 px-3 rounded-lg transition-all"
                    >
                      Trigger Breakdown
                    </button>
                  ) : (
                    <span className="text-[10px] text-rose-500 font-semibold border border-rose-950 px-2 py-0.5 rounded uppercase">Down</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Drivers List */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <UserCheck className="h-4.5 w-4.5 text-indigo-400" />
              Simulate Driver Absences
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {drivers.map((d) => (
                <div key={d.id} className="p-4 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">{d.name}</span>
                    <span className="text-[10px] text-slate-500">License: {d.licenseNumber} • Status: {d.status}</span>
                  </div>
                  {d.status !== 'UNAVAILABLE' ? (
                    <button
                      onClick={() => handleDriverUnavailable(d.id, d.name)}
                      className="bg-amber-950/40 border border-amber-900/50 hover:bg-amber-600 hover:text-white text-amber-400 text-xs font-bold py-1.5 px-3 rounded-lg transition-all"
                    >
                      Report Unavailable
                    </button>
                  ) : (
                    <span className="text-[10px] text-amber-500 font-semibold border border-amber-950 px-2 py-0.5 rounded uppercase">Sick</span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Delay Simulator Form & Disruption Live Logger */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col gap-6">
          
          {/* Delay Form */}
          <div className="border-b border-slate-800 pb-6">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-amber-400" />
              Simulate Transit Delay
            </h4>
            <form onSubmit={handleTriggerDelay} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Select Shipment Cargo</label>
                <select
                  required
                  value={selectedShipmentId}
                  onChange={(e) => setSelectedShipmentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs focus:border-brand-500 focus:outline-none"
                >
                  <option value="">Choose cargo tracking ID...</option>
                  {shipments
                    .filter(s => s.status !== 'DELIVERED' && s.status !== 'CANCELLED' && s.status !== 'RETURN_TO_SENDER')
                    .map((s) => (
                      <option key={s.id} value={s.shipmentId}>
                        {s.shipmentId} ({s.routeCity}) - {s.status.replace(/_/g, ' ')}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Transit Delay (Days)</label>
                <input
                  type="number" required min="1" max="15"
                  value={delayDays}
                  onChange={(e) => setDelayDays(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 rounded-xl text-xs transition-all"
              >
                Inject Delay Signal
              </button>
            </form>
          </div>

          {/* Simulation Event Log */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Live Simulator Events</h4>
                <button
                  onClick={() => setSimulationLogs([{ time: new Date().toLocaleTimeString(), message: "Simulator cleared.", type: "info" }])}
                  className="text-[10px] text-brand-400 hover:underline"
                >
                  Clear Console
                </button>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {simulationLogs.map((log, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-slate-900 rounded-xl flex gap-3 text-xs leading-relaxed">
                    {log.type === 'error' ? (
                      <AlertTriangle className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                    ) : log.type === 'warning' ? (
                      <AlertCircle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="h-4.5 w-4.5 text-brand-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="text-[10px] text-slate-500 block font-semibold">{log.time}</span>
                      <p className={log.type === 'error' ? 'text-rose-300' : log.type === 'warning' ? 'text-amber-300' : 'text-slate-300'}>
                        {log.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </Layout>
  );
};

export default Simulator;
