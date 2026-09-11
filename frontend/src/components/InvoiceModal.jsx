import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, CheckCircle, X, Truck, Building, ShieldCheck, QrCode } from 'lucide-react';
import api from '../utils/api';

const InvoiceModal = ({ isOpen, onClose, invoice, upiId: propUpiId }) => {
  const [upiId, setUpiId] = useState(propUpiId || 'cargoconnect@icici');

  useEffect(() => {
    if (propUpiId) {
      setUpiId(propUpiId);
      return;
    }
    if (isOpen) {
      api.get('/support/contacts')
        .then(res => {
          if (res.data?.upiId) {
            setUpiId(res.data.upiId);
          }
        })
        .catch(() => {});
    }
  }, [isOpen, propUpiId]);
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const fare = invoice.fare || invoice.totalAmount || 0;
  const commRate = invoice.commissionRate || 10.0;
  const commAmount = invoice.commissionAmount || (fare * (commRate / 100));
  const partnerAmount = invoice.partnerAmount || (fare - commAmount);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors print:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-brand-600/20 text-brand-400 rounded-2xl border border-brand-500/30">
                <Truck className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-white">CargoConnect</h2>
                <p className="text-xs text-slate-400">B2B Logistics & Cargo Partner Marketplace</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono uppercase text-brand-400 block font-bold">
                {invoice.invoiceNumber || 'INV-CC-10245'}
              </span>
              <span className="text-xs text-slate-400">
                Date: {invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Parties & Route Details */}
          <div className="grid grid-cols-2 gap-4 my-6 text-xs">
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-1.5">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">Billed To (Shipper)</span>
              <p className="text-sm font-bold text-white">{invoice.customerName || 'Customer Account'}</p>
              <p className="text-slate-400">Customer ID: #{invoice.customerId}</p>
              <p className="text-slate-400 font-mono">GST / Corporate Account</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-1.5">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">Fulfilled By (Cargo Partner)</span>
              <p className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-amber-400" />
                {invoice.cargoPartnerName || 'Verified Cargo Partner'}
              </p>
              <p className="text-slate-400">Cargo Type: {invoice.cargoType || 'General Freight'}</p>
              <p className="text-slate-400">Weight: {invoice.weight} kg</p>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 mb-6 text-xs space-y-1">
            <span className="text-slate-500 uppercase font-semibold text-[10px] block">Transit Route</span>
            <p className="text-slate-300"><strong className="text-slate-400">Pickup Origin:</strong> {invoice.pickupAddress}</p>
            <p className="text-slate-300"><strong className="text-slate-400">Delivery Destination:</strong> {invoice.deliveryAddress}</p>
          </div>

          {/* Itemized Marketplace Breakdown */}
          <div className="border border-slate-800 rounded-2xl overflow-hidden mb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Line Item Description</th>
                  <th className="py-3 px-4 text-center">Structure</th>
                  <th className="py-3 px-4 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="py-3 px-4 font-medium text-white">
                    Agreed Consignment Fare Quotation
                    <span className="block text-[10px] text-slate-500">Gross transportation fare approved by shipper</span>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-400">Agreed Quote</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-white">₹{fare.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-amber-400">
                    CargoConnect Marketplace Platform Commission ({commRate}%)
                    <span className="block text-[10px] text-slate-500">Partner dispatch and platform routing fee</span>
                  </td>
                  <td className="py-3 px-4 text-center text-amber-400/80">{commRate}% Platform Fee</td>
                  <td className="py-3 px-4 text-right font-mono text-amber-400">-₹{commAmount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-emerald-400">
                    Cargo Partner Net Freight Payout
                    <span className="block text-[10px] text-slate-500">Net earnings settled to fleet partner</span>
                  </td>
                  <td className="py-3 px-4 text-center text-emerald-400/80">Net Payout</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">₹{partnerAmount.toLocaleString()}</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-950 font-bold text-sm">
                <tr>
                  <td colSpan={2} className="py-3.5 px-4 text-white">Total Shipper Payment</td>
                  <td className="py-3.5 px-4 text-right text-emerald-400 font-mono text-base">
                    ₹{fare.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Status & Remittance Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>Payment Status: {invoice.paymentStatus || 'PAID'}</span>
              </div>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                OTP Verified
              </span>
            </div>

            <div className="flex items-center gap-2.5 p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
              <QrCode className="w-4 h-4 text-brand-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Official Remittance UPI ID</span>
                <span className="font-mono font-bold text-brand-300 text-xs block truncate">{upiId || 'cargoconnect@icici'}</span>
              </div>
            </div>
          </div>


          {/* Actions */}
          <div className="flex justify-end gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Close Invoice
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InvoiceModal;
