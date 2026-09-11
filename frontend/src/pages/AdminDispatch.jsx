import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import CommissionSettingsModal from '../components/CommissionSettingsModal';
import ShipmentChatModal from '../components/ShipmentChatModal';
import api from '../utils/api';
import { 
  Navigation, 
  Truck, 
  MapPin, 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ArrowRight, 
  RefreshCw, 
  Search, 
  Percent, 
  Radio, 
  Sparkles, 
  DollarSign, 
  Building, 
  Timer, 
  Award, 
  ShieldCheck, 
  MessageSquare,
  Sliders,
  Check,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDispatch = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Active Selections
  const [isCommModalOpen, setIsCommModalOpen] = useState(false);
  const [commissionRate, setCommissionRate] = useState(10.0);

  const [activeShipment, setActiveShipment] = useState(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteFareInput, setQuoteFareInput] = useState(5000);
  const [savingQuote, setSavingQuote] = useState(false);

  // Broadcast Modal State
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastRadius, setBroadcastRadius] = useState(50.0);
  const [eligiblePartners, setEligiblePartners] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);

  // Partner Responses Modal State
  const [isResponsesModalOpen, setIsResponsesModalOpen] = useState(false);
  const [partnerResponses, setPartnerResponses] = useState([]);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [confirmingPartnerId, setConfirmingPartnerId] = useState(null);

  // Chat Modal
  const [chatShipment, setChatShipment] = useState(null);

  const fetchShipments = async () => {
    try {
      const res = await api.get('/shipments');
      setShipments(res.data || []);
    } catch (err) {
      console.error('Failed to load shipments', err);
    }
  };

  const fetchCommission = async () => {
    try {
      const res = await api.get('/commission');
      if (res.data?.commissionRate !== undefined) {
        setCommissionRate(res.data.commissionRate);
      }
    } catch (err) {
      console.error('Failed to load commission rate', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchShipments(), fetchCommission()]);
      setLoading(false);
    };
    init();
  }, []);

  // 1. Manual Fare Quotation
  const handleOpenQuote = (s) => {
    setActiveShipment(s);
    setQuoteFareInput(s.fare || 5000);
    setIsQuoteModalOpen(true);
  };

  const handleSaveQuote = async (e) => {
    e.preventDefault();
    if (!activeShipment) return;
    setSavingQuote(true);
    try {
      await api.post(`/shipments/${activeShipment.id}/quote`, { fare: parseFloat(quoteFareInput) });
      setIsQuoteModalOpen(false);
      await fetchShipments();
      alert(`Manual fare ₹${quoteFareInput} quoted successfully. Shipper notified.`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit quotation.');
    } finally {
      setSavingQuote(false);
    }
  };

  // 2. Territory Broadcast
  const handleOpenBroadcast = async (s) => {
    setActiveShipment(s);
    setIsBroadcastModalOpen(true);
    fetchEligiblePartners(s.id, broadcastRadius);
  };

  const fetchEligiblePartners = async (shipmentId, radius) => {
    setLoadingPartners(true);
    try {
      const res = await api.get(`/partner-offers/eligible?shipmentId=${shipmentId}&radiusKm=${radius}`);
      setEligiblePartners(res.data || []);
    } catch (err) {
      console.error('Failed to fetch eligible partners', err);
    } finally {
      setLoadingPartners(false);
    }
  };

  const handleTriggerBroadcast = async () => {
    if (!activeShipment) return;
    setBroadcasting(true);
    try {
      const res = await api.post(`/partner-offers/${activeShipment.id}/broadcast`, {
        pickupLatitude: activeShipment.pickupLatitude || 18.5362,
        pickupLongitude: activeShipment.pickupLongitude || 73.7929,
        radiusKm: parseFloat(broadcastRadius)
      });
      setIsBroadcastModalOpen(false);
      await fetchShipments();
      alert(res.data?.message || 'Shipment broadcasted to territory partners.');
    } catch (err) {
      alert(err.response?.data?.message || 'Broadcast failed.');
    } finally {
      setBroadcasting(false);
    }
  };

  // 3. Partner Responses & First-Acceptance Priority
  const handleOpenResponses = async (s) => {
    setActiveShipment(s);
    setIsResponsesModalOpen(true);
    fetchResponses(s.id);
  };

  const fetchResponses = async (shipmentId) => {
    setLoadingResponses(true);
    try {
      const res = await api.get(`/partner-offers/shipment/${shipmentId}/responses`);
      setPartnerResponses(res.data || []);
    } catch (err) {
      console.error('Failed to fetch responses', err);
    } finally {
      setLoadingResponses(false);
    }
  };

  const handleConfirmPartner = async (partnerId) => {
    if (!activeShipment) return;
    setConfirmingPartnerId(partnerId);
    try {
      await api.post(`/shipments/${activeShipment.id}/confirm-partner`, { partnerId });
      setIsResponsesModalOpen(false);
      await fetchShipments();
      alert(`Cargo Partner confirmed! Immutable commission rate locked at ${commissionRate}%. Partner notified to assign vehicle & driver.`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to confirm partner.');
    } finally {
      setConfirmingPartnerId(null);
    }
  };

  const filteredShipments = shipments.filter((s) => {
    const matchesQuery = !searchQuery || (
      s.shipmentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.pickupAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.deliveryAddress?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (!matchesQuery) return false;
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'AWAITING_QUOTE') return !s.fare || s.fareStatus === 'PENDING' || s.fareStatus === 'NEGOTIATE';
    if (filterStatus === 'BROADCAST_READY') return s.fare > 0 && !s.confirmedPartnerId && s.status !== 'DELIVERED' && s.status !== 'CANCELLED';
    if (filterStatus === 'NOTIFIED') return s.status === 'PARTNER_NOTIFIED';
    if (filterStatus === 'ACCEPTED') return s.status === 'PARTNER_ACCEPTED';
    return s.status === filterStatus;
  });

  const awaitingQuoteCount = shipments.filter((s) => !s.fare || s.fareStatus === 'PENDING' || s.fareStatus === 'NEGOTIATE').length;
  const notifiedCount = shipments.filter((s) => s.status === 'PARTNER_NOTIFIED' || s.status === 'PARTNER_ACCEPTED').length;
  const inTransitCount = shipments.filter((s) => s.status === 'IN_TRANSIT' || s.status === 'OUT_FOR_DELIVERY' || s.status === 'ASSIGNED').length;

  return (
    <Layout title="Dispatch Operations & Partner Marketplace">
      <div className="space-y-6">
        {/* KPI Strip & Commission Control Button */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Needs Manual Fare Quote</p>
              <h3 className="text-2xl font-bold text-amber-400 mt-1">{awaitingQuoteCount}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Active Partner Broadcasts</p>
              <h3 className="text-2xl font-bold text-brand-400 mt-1">{notifiedCount}</h3>
            </div>
            <div className="p-3 bg-brand-500/10 text-brand-400 rounded-2xl border border-brand-500/20">
              <Radio className="w-5 h-5 animate-pulse text-brand-400" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Active Trips In Transit</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">{inTransitCount}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
              <Truck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-indigo-500/30 rounded-3xl p-4 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-[11px] text-indigo-300 font-bold uppercase">Marketplace Commission</p>
              <h3 className="text-2xl font-extrabold text-white mt-1">{commissionRate}% Fee</h3>
            </div>
            <button
              onClick={() => setIsCommModalOpen(true)}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Configure</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'All Orders', value: 'ALL' },
              { label: 'Awaiting Quote', value: 'AWAITING_QUOTE' },
              { label: 'Ready to Broadcast', value: 'BROADCAST_READY' },
              { label: 'Partner Notified', value: 'NOTIFIED' },
              { label: 'Partner Accepted', value: 'ACCEPTED' },
              { label: 'In Transit', value: 'IN_TRANSIT' },
              { label: 'Delivered', value: 'DELIVERED' }
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilterStatus(tab.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterStatus === tab.value
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-brand-500 w-48"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
            </div>

            <button
              onClick={fetchShipments}
              className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Shipments Pipeline Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Logistics Marketplace Dispatch Pipeline ({filteredShipments.length})
            </h3>
            <span className="text-xs text-slate-400 font-mono">Pune & Regional Routes</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Origin / Destination</th>
                  <th className="py-3.5 px-4">Vehicle Required</th>
                  <th className="py-3.5 px-4">Fare Quote</th>
                  <th className="py-3.5 px-4">Partner Status</th>
                  <th className="py-3.5 px-4">Order State</th>
                  <th className="py-3.5 px-4 text-right">Dispatch Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredShipments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No consignments match current filter.
                    </td>
                  </tr>
                ) : (
                  filteredShipments.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-400">
                        {s.shipmentId}
                      </td>
                      <td className="py-3.5 px-4 max-w-[180px] truncate">
                        <span className="block truncate text-white">{s.pickupAddress}</span>
                        <span className="block truncate text-slate-500 text-[10px]">to {s.deliveryAddress}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-white">{s.vehicleTypeRequired || '14 FT Truck'}</span>
                        <span className="text-slate-500 block text-[10px]">{s.weight} kg • {s.goodsType || 'Freight'}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold">
                        {s.fare ? (
                          <div>
                            <span className="text-emerald-400">₹{s.fare.toLocaleString()}</span>
                            <span className={`block text-[9px] font-sans ${s.fareStatus === 'ACCEPTED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                              ({s.fareStatus})
                            </span>
                          </div>
                        ) : (
                          <span className="text-amber-400 text-[11px] italic">Not Set</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {s.confirmedPartnerId ? (
                          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-lg text-[11px] font-semibold flex items-center gap-1 w-fit">
                            <Building className="w-3 h-3" />
                            Partner #{s.confirmedPartnerId}
                          </span>
                        ) : s.status === 'PARTNER_NOTIFIED' || s.status === 'PARTNER_ACCEPTED' ? (
                          <span className="px-2 py-1 bg-brand-500/10 text-brand-300 border border-brand-500/20 rounded-lg text-[11px] font-semibold flex items-center gap-1 w-fit">
                            <Radio className="w-3 h-3 animate-pulse text-brand-400" />
                            Broadcast Active
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        {/* Step 1: Set Fare */}
                        {(!s.fare || s.fareStatus === 'PENDING' || s.fareStatus === 'NEGOTIATE') && (
                          <button
                            onClick={() => handleOpenQuote(s)}
                            className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1 shadow-md shadow-amber-600/20"
                          >
                            <DollarSign className="w-3 h-3" />
                            <span>Set Fare</span>
                          </button>
                        )}

                        {/* Step 2: Territory Broadcast */}
                        {s.fare > 0 && !s.confirmedPartnerId && s.status !== 'DELIVERED' && s.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleOpenBroadcast(s)}
                            className="px-2.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1 shadow-md shadow-brand-600/20"
                          >
                            <Radio className="w-3 h-3" />
                            <span>{s.status === 'PARTNER_NOTIFIED' || s.status === 'PARTNER_ACCEPTED' ? 'Re-Broadcast' : 'Broadcast'}</span>
                          </button>
                        )}

                        {/* Step 3: Review Partner Responses */}
                        {(s.status === 'PARTNER_NOTIFIED' || s.status === 'PARTNER_ACCEPTED') && (
                          <button
                            onClick={() => handleOpenResponses(s)}
                            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1 shadow-md shadow-indigo-600/20"
                          >
                            <Award className="w-3 h-3" />
                            <span>Responses</span>
                          </button>
                        )}

                        {/* Chat Button */}
                        <button
                          onClick={() => setChatShipment(s)}
                          className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800"
                          title="Order Chat"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL 1: Set Manual Fare Quotation */}
      <AnimatePresence>
        {isQuoteModalOpen && activeShipment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative text-slate-100 space-y-4"
            >
              <button
                onClick={() => setIsQuoteModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Manual Fare Quotation</h3>
                  <p className="text-xs text-slate-400">Shipment {activeShipment.shipmentId} ({activeShipment.weight} kg, {activeShipment.vehicleTypeRequired})</p>
                </div>
              </div>

              <form onSubmit={handleSaveQuote} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Quoted Total Fare (INR ₹)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={100}
                      step={50}
                      value={quoteFareInput}
                      onChange={(e) => setQuoteFareInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-8 pr-3 text-lg font-mono font-bold text-white focus:outline-none focus:border-brand-500"
                    />
                    <span className="text-base font-bold text-slate-500 absolute left-3 top-3">₹</span>
                  </div>
                </div>

                {/* Live Settlement Breakdown */}
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Marketplace Settlement Preview</span>
                  <div className="flex justify-between text-slate-300">
                    <span>Shipper Payable Fare:</span>
                    <span className="font-bold text-white">₹{parseFloat(quoteFareInput || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-amber-400">
                    <span>CargoConnect Platform Fee ({commissionRate}%):</span>
                    <span className="font-bold">₹{((parseFloat(quoteFareInput || 0) * commissionRate) / 100).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-1.5">
                    <span>Cargo Partner Net Payout:</span>
                    <span>₹{(parseFloat(quoteFareInput || 0) - (parseFloat(quoteFareInput || 0) * commissionRate) / 100).toFixed(0)}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsQuoteModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingQuote}
                    className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-brand-600 hover:from-amber-500 hover:to-brand-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-amber-600/25 flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    {savingQuote ? 'Submitting...' : 'Send Quote to Shipper'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Territory Partner Broadcast */}
      <AnimatePresence>
        {isBroadcastModalOpen && activeShipment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsBroadcastModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-500/10 text-brand-400 rounded-2xl border border-brand-500/20">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Territory Partner Broadcast</h3>
                  <p className="text-xs text-slate-400">
                    Broadcast {activeShipment.shipmentId} (Fare ₹{activeShipment.fare}, {activeShipment.weight} kg, {activeShipment.vehicleTypeRequired}) to verified partners in radius.
                  </p>
                </div>
              </div>

              {/* Radius Slider & Pickup Info */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                    <MapPin className="w-4 h-4 text-brand-400" />
                    Pickup Origin: {activeShipment.pickupAddress}
                  </span>
                  <span className="font-bold text-brand-400 font-mono text-sm">{broadcastRadius} KM Radius</span>
                </div>

                <div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={broadcastRadius}
                    onChange={(e) => {
                      const r = parseFloat(e.target.value);
                      setBroadcastRadius(r);
                      fetchEligiblePartners(activeShipment.id, r);
                    }}
                    className="w-full accent-brand-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold mt-1">
                    <span>5 KM (Local)</span>
                    <span>50 KM (Territory Hub)</span>
                    <span>100 KM (State Regional)</span>
                  </div>
                </div>
              </div>

              {/* Eligible Partners List */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Eligible Fleet Partners in Radius ({eligiblePartners.filter((p) => p.isEligible).length} Qualified)
                  </h4>
                  {loadingPartners && <span className="text-[10px] text-brand-400 animate-pulse">Scanning territory...</span>}
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {eligiblePartners.length === 0 ? (
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center text-xs text-slate-500">
                      No Cargo Partners found within {broadcastRadius} KM radius. Expand search radius.
                    </div>
                  ) : (
                    eligiblePartners.map((p) => (
                      <div
                        key={p.partnerId}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                          p.isEligible
                            ? 'bg-slate-950 border-brand-500/20'
                            : 'bg-slate-950/40 border-slate-800 opacity-60'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{p.companyName}</span>
                            <span className="text-[10px] text-amber-400">★ {p.rating} ({p.totalTrips} trips)</span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {p.address} • <strong className="text-brand-300 font-mono">{p.distanceKm} km</strong> from pickup
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Fleet Status: {p.availableVehiclesCount} verified vehicles • {p.availableDriversCount} verified drivers
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          {p.isEligible ? (
                            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-[10px] font-bold inline-flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              Ready for Job
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl text-[10px] font-bold">
                              {p.eligibilityReason}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleTriggerBroadcast}
                  disabled={broadcasting || eligiblePartners.filter((p) => p.isEligible).length === 0}
                  className="flex-1 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30"
                >
                  <Radio className="w-4 h-4" />
                  {broadcasting ? 'Broadcasting...' : `Broadcast to ${eligiblePartners.filter((p) => p.isEligible).length} Qualified Partners`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: First Partner Response & Confirmation */}
      <AnimatePresence>
        {isResponsesModalOpen && activeShipment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsResponsesModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                  <Award className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Partner Responses & Priority Ranking</h3>
                  <p className="text-xs text-slate-400">
                    Shipment {activeShipment.shipmentId} • Fare ₹{activeShipment.fare} • Platform Commission {commissionRate}%
                  </p>
                </div>
              </div>

              {/* Partner Responses List */}
              <div className="space-y-2">
                {loadingResponses ? (
                  <div className="p-8 text-center text-xs text-slate-500">Loading partner responses...</div>
                ) : partnerResponses.length === 0 ? (
                  <div className="p-8 text-center bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-500">
                    No partner responses received yet. Partners have 3 minutes to respond on their dashboard.
                  </div>
                ) : (
                  partnerResponses.map((r) => {
                    const isAccepted = r.offerStatus === 'ACCEPTED';
                    const isRankOne = r.acceptancePriority === 1;

                    return (
                      <div
                        key={r.offerId}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                          isRankOne
                            ? 'bg-gradient-to-r from-amber-500/10 to-indigo-950/40 border-amber-500/40 shadow-lg shadow-amber-500/5'
                            : isAccepted
                            ? 'bg-slate-950 border-slate-700'
                            : 'bg-slate-950/40 border-slate-800 opacity-60'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {isAccepted && (
                              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 ${
                                isRankOne ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300'
                              }`}>
                                <Award className="w-3 h-3" />
                                Priority #{r.acceptancePriority}
                              </span>
                            )}
                            <span className="text-sm font-bold text-white">{r.partnerCompanyName}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Distance: <strong className="text-brand-300 font-mono">{r.partnerDistanceKm} km</strong> • Responded at:{' '}
                            <span className="text-slate-300 font-mono">
                              {r.respondedAt ? new Date(r.respondedAt).toLocaleTimeString() : 'Pending'}
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          {isAccepted ? (
                            <button
                              onClick={() => handleConfirmPartner(r.cargoPartnerId)}
                              disabled={confirmingPartnerId === r.cargoPartnerId}
                              className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-all ${
                                isRankOne
                                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{confirmingPartnerId === r.cargoPartnerId ? 'Confirming...' : 'Confirm Partner'}</span>
                            </button>
                          ) : (
                            <span className="text-[11px] font-semibold text-slate-500 uppercase px-2 py-1 bg-slate-900 rounded-lg">
                              {r.offerStatus}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Commission Setting Modal */}
      <CommissionSettingsModal
        isOpen={isCommModalOpen}
        onClose={() => setIsCommModalOpen(false)}
        onUpdated={(newRate) => setCommissionRate(newRate)}
      />

      {/* Chat Modal */}
      <ShipmentChatModal
        isOpen={!!chatShipment}
        onClose={() => setChatShipment(null)}
        shipmentId={chatShipment?.id}
        shipmentNumber={chatShipment?.shipmentId}
      />
    </Layout>
  );
};

export default AdminDispatch;
