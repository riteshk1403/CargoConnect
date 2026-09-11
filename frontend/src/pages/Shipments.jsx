import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import InvoiceModal from '../components/InvoiceModal';
import RequestCallModal from '../components/RequestCallModal';
import ShipmentChatModal from '../components/ShipmentChatModal';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  MapPin, 
  Truck, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  Star, 
  RefreshCw,
  Phone,
  MessageSquare,
  Sparkles,
  Check,
  XCircle,
  Clock,
  Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Shipments = () => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchShipments = async () => {
    try {
      let endpoint = '/shipments';
      if (user?.role === 'ROLE_SHIPPER' || user?.role === 'ROLE_CUSTOMER') {
        if (user.customerId) endpoint = `/shipments/customer/${user.customerId}`;
      } else if (user?.role === 'ROLE_CARGO_PARTNER') {
        if (user.cargoPartnerId) endpoint = `/shipments/partner/${user.cargoPartnerId}`;
      }
      const res = await api.get(endpoint);
      setShipments(res.data || []);
      if (res.data?.length > 0) {
        if (!selectedShipment) {
          setSelectedShipment(res.data[0]);
        } else {
          const updated = res.data.find((s) => s.id === selectedShipment.id);
          if (updated) setSelectedShipment(updated);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchShipments();
      setLoading(false);
    };
    init();
  }, [user]);

  const handleQuoteResponse = async (shipmentId, responseAction) => {
    setActionLoading(true);
    try {
      await api.post(`/shipments/${shipmentId}/quote-response`, {
        response: responseAction,
        notes: responseAction === 'NEGOTIATE' ? 'Shipper requested rate discussion via dashboard.' : ''
      });
      await fetchShipments();
      alert(`Quotation ${responseAction.toLowerCase()} successfully.`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit response.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewInvoice = async (s) => {
    try {
      const res = await api.get(`/invoices/shipment/${s.id}`);
      setSelectedInvoice(res.data);
      setIsInvoiceOpen(true);
    } catch (err) {
      const fare = s.fare || s.price || 0;
      const commRate = s.commissionRate || 10.0;
      const commAmount = s.commissionAmount || (fare * (commRate / 100));
      const partnerAmount = s.partnerAmount || (fare - commAmount);
      const preview = {
        invoiceNumber: `INV-${s.shipmentId}`,
        shipmentId: s.id,
        customerId: s.customerId,
        customerName: user?.username || 'Valued Customer',
        cargoPartnerName: 'Assigned Cargo Partner',
        pickupAddress: s.pickupAddress,
        deliveryAddress: s.deliveryAddress,
        cargoType: s.goodsType || 'Industrial Cargo',
        weight: s.weight,
        fare: fare,
        commissionRate: commRate,
        commissionAmount: commAmount,
        partnerAmount: partnerAmount,
        totalAmount: fare,
        paymentStatus: s.paymentStatus || 'PAID',
        invoiceDate: new Date()
      };
      setSelectedInvoice(preview);
      setIsInvoiceOpen(true);
    }
  };

  const filteredShipments = shipments.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.shipmentId?.toLowerCase().includes(q) ||
      s.pickupAddress?.toLowerCase().includes(q) ||
      s.deliveryAddress?.toLowerCase().includes(q) ||
      s.goodsType?.toLowerCase().includes(q)
    );
  });

  return (
    <Layout title="Consignment Registry & Tracking">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Columns: Table of Shipments */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Search by tracking number, pickup, destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-brand-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>

            <button
              onClick={fetchShipments}
              className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Consignments ({filteredShipments.length})
              </h3>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Origin / Dest</th>
                    <th className="py-3 px-4">Required Vehicle</th>
                    <th className="py-3 px-4">Fare Quote</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredShipments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No consignments found matching query.
                      </td>
                    </tr>
                  ) : (
                    filteredShipments.map((s) => {
                      const isSelected = selectedShipment?.id === s.id;
                      return (
                        <tr
                          key={s.id}
                          onClick={() => setSelectedShipment(s)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-brand-950/30' : 'hover:bg-slate-800/30'
                          }`}
                        >
                          <td className="py-3 px-4 font-mono font-bold text-brand-400">
                            {s.shipmentId}
                          </td>
                          <td className="py-3 px-4 max-w-[140px] truncate">
                            <span className="block truncate text-white">{s.pickupAddress}</span>
                            <span className="block truncate text-slate-500 text-[10px]">to {s.deliveryAddress}</span>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-300">
                            {s.vehicleTypeRequired || '14 FT Truck'} ({s.weight} kg)
                          </td>
                          <td className="py-3 px-4 font-mono font-bold">
                            {s.fare ? (
                              <span className="text-emerald-400">₹{s.fare.toLocaleString()}</span>
                            ) : (
                              <span className="text-amber-400/90 text-[11px] font-medium italic">Awaiting Quote</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={s.status} />
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => { setSelectedShipment(s); setIsChatOpen(true); }}
                              title="Chat with Operations & Partner"
                              className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleViewInvoice(s)}
                              title="View Invoice"
                              className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Native App Card List View */}
            <div className="md:hidden divide-y divide-slate-800">
              {filteredShipments.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No consignments found.
                </div>
              ) : (
                filteredShipments.map((s) => {
                  const isSelected = selectedShipment?.id === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedShipment(s)}
                      className={`p-4 space-y-3 transition-colors ${
                        isSelected ? 'bg-brand-950/40 border-l-4 border-brand-500' : 'hover:bg-slate-800/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-brand-400 text-sm">{s.shipmentId}</span>
                        <StatusBadge status={s.status} />
                      </div>

                      <div className="text-xs space-y-1">
                        <p className="truncate text-white font-medium flex items-center gap-1.5">
                          <span className="text-brand-400 font-bold">📍 Pickup:</span> {s.pickupAddress}
                        </p>
                        <p className="truncate text-slate-400 flex items-center gap-1.5">
                          <span className="text-emerald-400 font-bold">🏁 Drop:</span> {s.deliveryAddress}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                        <span className="text-slate-400 font-medium">
                          {s.vehicleTypeRequired || '14 FT Truck'} • {s.weight} kg
                        </span>
                        <span className="font-mono font-bold">
                          {s.fare ? (
                            <span className="text-emerald-400">₹{s.fare.toLocaleString()}</span>
                          ) : (
                            <span className="text-amber-400 italic text-[11px]">Awaiting Quote</span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1" onClick={(e) => e.stopPropagation()}>
                        <span className="text-[11px] text-slate-500">
                          {s.deliveryOtp ? `OTP: ${s.deliveryOtp}` : ''}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setSelectedShipment(s); setIsChatOpen(true); }}
                            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 rounded-xl text-xs flex items-center gap-1.5 border border-slate-800 active:scale-95 transition-all"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-brand-400" />
                            <span>Chat</span>
                          </button>
                          <button
                            onClick={() => handleViewInvoice(s)}
                            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 rounded-xl text-xs flex items-center gap-1.5 border border-slate-800 active:scale-95 transition-all"
                          >
                            <FileText className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Invoice</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Tracker Drawer */}
        <div className="space-y-4">
          {selectedShipment ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Consignment Inspector</span>
                  <h4 className="text-lg font-bold font-mono text-brand-400">{selectedShipment.shipmentId}</h4>
                </div>
                <StatusBadge status={selectedShipment.status} />
              </div>

              {/* Quotation Action Banner (When Team has quoted fare) */}
              {selectedShipment.fare && (selectedShipment.fareStatus === 'QUOTED' || selectedShipment.fareStatus === 'NEGOTIATE') && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      Fare Quotation Received
                    </span>
                    <span className="text-lg font-mono font-black text-amber-300">
                      ₹{selectedShipment.fare.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    CargoConnect operations team has quoted ₹{selectedShipment.fare.toLocaleString()} for this consignment. Please accept to initiate partner broadcast or request negotiation.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleQuoteResponse(selectedShipment.id, 'ACCEPTED')}
                      disabled={actionLoading}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all shadow-md shadow-emerald-600/20"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Accept Fare
                    </button>
                    <button
                      onClick={() => handleQuoteResponse(selectedShipment.id, 'NEGOTIATE')}
                      disabled={actionLoading}
                      className="flex-1 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
                    >
                      Negotiate
                    </button>
                    <button
                      onClick={() => handleQuoteResponse(selectedShipment.id, 'REJECTED')}
                      disabled={actionLoading}
                      className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs"
                      title="Reject Quote"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Delivery OTP Callout */}
              <div className="p-4 bg-slate-950 border border-brand-500/20 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Delivery Verification OTP</span>
                  <span className="text-xs text-slate-300">Share with driver upon arrival</span>
                </div>
                <span className="text-xl font-mono font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl">
                  {selectedShipment.deliveryOtp}
                </span>
              </div>

              {/* Route */}
              <div className="space-y-3 text-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-start gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-400 block text-[10px] uppercase font-bold">Pickup Origin</strong>
                    <p>{selectedShipment.pickupAddress}</p>
                    <span className="text-[10px] text-slate-500">
                      Slot: {selectedShipment.pickupDate || 'Today'} • {selectedShipment.pickupTime || '10:00 AM'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-400 block text-[10px] uppercase font-bold">Destination</strong>
                    <p>{selectedShipment.deliveryAddress}</p>
                  </div>
                </div>
              </div>

              {/* Cargo & Partner Specifications */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] block font-bold uppercase">Required Vehicle</span>
                  <span className="font-semibold text-white">{selectedShipment.vehicleTypeRequired || '14 FT Truck'}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block font-bold uppercase">Cargo Weight</span>
                  <span className="font-semibold text-white">{selectedShipment.weight} kg</span>
                </div>
                <div className="pt-2">
                  <span className="text-slate-500 text-[10px] block font-bold uppercase">Quoted Fare</span>
                  <span className="font-semibold text-emerald-400">
                    {selectedShipment.fare ? `₹${selectedShipment.fare.toLocaleString()}` : 'Awaiting Quote'}
                  </span>
                </div>
                <div className="pt-2">
                  <span className="text-slate-500 text-[10px] block font-bold uppercase">Fulfilled Partner</span>
                  <span className="font-semibold text-amber-400">
                    {selectedShipment.confirmedPartnerId ? `Partner #${selectedShipment.confirmedPartnerId}` : 'Broadcast Pending'}
                  </span>
                </div>
              </div>

              {/* Interaction Buttons */}
              <div className="space-y-2 pt-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="flex-1 py-2.5 bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 border border-brand-500/30 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Order Chat
                  </button>
                  <button
                    onClick={() => setIsCallModalOpen(true)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Request a Call
                  </button>
                </div>

                <button
                  onClick={() => handleViewInvoice(selectedShipment)}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View Itemized Invoice
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-500 text-xs">
              Select a consignment to view route details, review manual quotations, access in-app chat, or request a callback.
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        invoice={selectedInvoice}
      />

      <RequestCallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        shipmentId={selectedShipment?.id}
      />

      <ShipmentChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        shipmentId={selectedShipment?.id}
        shipmentNumber={selectedShipment?.shipmentId}
      />
    </Layout>
  );
};

export default Shipments;
