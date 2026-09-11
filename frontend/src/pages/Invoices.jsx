import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import InvoiceModal from '../components/InvoiceModal';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  FileText, 
  Search, 
  RefreshCw, 
  Printer, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Building, 
  Truck, 
  ShieldCheck,
  Eye,
  Filter
} from 'lucide-react';

const Invoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      // 1. Try fetching from /invoices
      let invList = [];
      try {
        const res = await api.get('/invoices');
        invList = res.data || [];
      } catch (err) {
        // Fallback gracefully
      }

      // 2. Also fetch shipments to ensure all shipments with quotes/fares have invoices
      const shipRes = await api.get('/shipments');
      const shipments = shipRes.data || [];

      // Consolidate shipments into invoice items if invoices table is empty or missing them
      const consolidated = [...invList];
      const existingShipmentIds = new Set(invList.map((i) => i.shipmentId));

      shipments.forEach((s) => {
        if (!existingShipmentIds.has(s.id) && s.fare && s.fare > 0) {
          const fare = s.fare;
          const commRate = s.commissionRate || 10.0;
          const commAmount = s.commissionAmount || (fare * (commRate / 100));
          const partnerAmount = s.partnerAmount || (fare - commAmount);

          consolidated.push({
            id: s.id,
            invoiceNumber: `INV-${s.shipmentId || 'CC-' + s.id}`,
            shipmentId: s.id,
            customerId: s.customerId,
            customerName: user?.username || 'Valued Customer',
            cargoPartnerId: s.confirmedPartnerId,
            cargoPartnerName: s.confirmedPartnerId ? 'Verified Cargo Partner' : 'Fleet Partner',
            pickupAddress: s.pickupAddress,
            deliveryAddress: s.deliveryAddress,
            cargoType: s.goodsType || s.cargoDescription || 'Commercial Freight',
            weight: s.weight,
            serviceType: s.serviceType || 'NORMAL',
            fare: fare,
            commissionRate: commRate,
            commissionAmount: commAmount,
            partnerAmount: partnerAmount,
            totalAmount: fare,
            paymentStatus: s.paymentStatus || (s.status === 'DELIVERED' ? 'PAID' : 'PENDING'),
            invoiceDate: s.createdAt || new Date().toISOString()
          });
        }
      });

      // Role-specific filtering
      let roleFiltered = consolidated;
      if (user?.role === 'ROLE_CARGO_PARTNER' && user?.cargoPartnerId) {
        roleFiltered = consolidated.filter((i) => !i.cargoPartnerId || i.cargoPartnerId === user.cargoPartnerId);
      } else if (user?.role === 'ROLE_SHIPPER' && user?.customerId) {
        roleFiltered = consolidated.filter((i) => !i.customerId || i.customerId === user.customerId);
      }

      setInvoices(roleFiltered);
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [user]);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = !searchQuery || 
      inv.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.pickupAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.deliveryAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.cargoType?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || inv.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalBilled = filteredInvoices.reduce((sum, i) => sum + (i.fare || i.totalAmount || 0), 0);
  const totalPaid = filteredInvoices
    .filter((i) => i.paymentStatus === 'PAID' || i.paymentStatus === 'SUCCESS')
    .reduce((sum, i) => sum + (i.fare || i.totalAmount || 0), 0);
  const totalPending = filteredInvoices
    .filter((i) => i.paymentStatus !== 'PAID' && i.paymentStatus !== 'SUCCESS')
    .reduce((sum, i) => sum + (i.fare || i.totalAmount || 0), 0);

  const handleOpenInvoice = (inv) => {
    setSelectedInvoice(inv);
    setIsInvoiceOpen(true);
  };

  return (
    <Layout title={user?.role === 'ROLE_CARGO_PARTNER' ? 'Fleet Payouts & Invoices' : 'Tax Invoices & Billing Ledger'}>
      <div className="space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Total Invoiced Freight
            </span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-black text-white font-mono">
                ₹{totalBilled.toLocaleString()}
              </span>
              <div className="p-3 bg-brand-500/10 text-brand-400 rounded-2xl border border-brand-500/20">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Across {filteredInvoices.length} consignments</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Settled / Paid
            </span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-black text-emerald-400 font-mono">
                ₹{totalPaid.toLocaleString()}
              </span>
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-emerald-400/80 mt-1">Verified Delivery Settlements</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Pending / In Transit
            </span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-black text-amber-400 font-mono">
                ₹{totalPending.toLocaleString()}
              </span>
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-amber-400/80 mt-1">Due upon verified delivery OTP</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search by invoice #, pickup, destination, cargo type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-brand-500 transition-all placeholder:text-slate-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Status Filter */}
            <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs flex-1 md:flex-none">
              {['ALL', 'PAID', 'PENDING'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex-1 md:flex-none ${
                    statusFilter === st
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <button
              onClick={fetchInvoices}
              className="p-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl text-xs flex items-center gap-1.5 shrink-0 border border-slate-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Invoices Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-400" />
              Tax Invoices & Billing Statements ({filteredInvoices.length})
            </h3>
          </div>

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-500"></div>
              <p className="text-xs text-slate-400">Loading billing ledger...</p>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-3">
              <FileText className="w-10 h-10 mx-auto text-slate-600 stroke-1" />
              <p className="text-sm font-semibold text-slate-400">No invoices found matching query.</p>
              <p className="text-xs text-slate-500">Invoices are automatically generated once a consignment fare is quoted or confirmed.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="py-3.5 px-5">Invoice Number</th>
                      <th className="py-3.5 px-5">Origin / Destination</th>
                      <th className="py-3.5 px-5">Cargo Details</th>
                      <th className="py-3.5 px-5">Fare Amount</th>
                      <th className="py-3.5 px-5">Payment Status</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {filteredInvoices.map((inv) => (
                      <tr
                        key={inv.id}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="py-4 px-5">
                          <span className="font-mono font-bold text-brand-400 text-xs block">
                            {inv.invoiceNumber}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            {inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString() : 'Active'}
                          </span>
                        </td>
                        <td className="py-4 px-5 max-w-[200px] truncate">
                          <span className="block truncate text-white font-medium">{inv.pickupAddress}</span>
                          <span className="block truncate text-slate-500 text-[10px]">to {inv.deliveryAddress}</span>
                        </td>
                        <td className="py-4 px-5">
                          <span className="text-slate-200 block font-medium">{inv.cargoType}</span>
                          <span className="text-slate-500 text-[10px]">{inv.weight} kg • {inv.serviceType}</span>
                        </td>
                        <td className="py-4 px-5 font-mono font-bold text-emerald-400 text-sm">
                          ₹{(inv.fare || inv.totalAmount || 0).toLocaleString()}
                        </td>
                        <td className="py-4 px-5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider ${
                            inv.paymentStatus === 'PAID' || inv.paymentStatus === 'SUCCESS'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {inv.paymentStatus || 'PENDING'}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => handleOpenInvoice(inv)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-600/20 active:scale-95 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Invoice</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Native App Card List View */}
              <div className="md:hidden divide-y divide-slate-800">
                {filteredInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-4 space-y-3 hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-brand-400 text-xs">
                        {inv.invoiceNumber}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                        inv.paymentStatus === 'PAID' || inv.paymentStatus === 'SUCCESS'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {inv.paymentStatus || 'PENDING'}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-slate-300">
                      <p className="truncate text-white font-medium">📍 {inv.pickupAddress}</p>
                      <p className="truncate text-slate-400">🏁 {inv.deliveryAddress}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                      <span className="text-slate-400">{inv.cargoType} • {inv.weight} kg</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">
                        ₹{(inv.fare || inv.totalAmount || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleOpenInvoice(inv)}
                        className="w-full py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-brand-600/20"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View & Print Tax Invoice</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Full B2B Tax Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        invoice={selectedInvoice}
      />
    </Layout>
  );
};

export default Invoices;
