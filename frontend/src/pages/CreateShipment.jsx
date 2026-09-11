import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  Package, 
  Truck, 
  MapPin, 
  CreditCard, 
  Phone, 
  Calendar, 
  Clock, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Send,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import RequestCallModal from '../components/RequestCallModal';

const VEHICLE_TYPES = [
  { id: 'Tata Ace', name: 'Tata Ace (Mini Truck - 1.0 Ton)' },
  { id: '14 FT Truck', name: '14 FT Open/Closed Truck (2.5 Ton)' },
  { id: '19 FT Container', name: '19 FT Closed Container (5.0 Ton)' },
  { id: 'Pickup Van', name: 'Pickup Van (1.5 Ton)' },
  { id: '20 FT Multi-Axle Trailer', name: '20 FT Heavy Trailer (15.0 Ton)' }
];

const CreateShipment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    customerId: user?.customerId || 1,
    pickupAddress: 'Pashan-Sus Road, Pune, Maharashtra 411021',
    deliveryAddress: 'Andheri East MIDC, Mumbai, Maharashtra 400093',
    pickupLatitude: 18.5362,
    pickupLongitude: 73.7929,
    deliveryLatitude: 19.1136,
    deliveryLongitude: 72.8697,
    goodsType: 'Industrial Electronics & Machinery',
    cargoDescription: 'Standard shock-absorbent logistics boxes with fragile markings',
    weight: 850,
    vehicleTypeRequired: '14 FT Truck',
    pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    pickupTime: '10:00 AM',
    deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    serviceType: 'NORMAL',
    paymentMethod: 'ONLINE',
    contactName: user?.username || 'Operations Lead',
    contactPhone: '+91 98765 43210',
    specialRequirements: 'Forklift loading required at origin. Handle with care.',
    cargoPhotoUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    if (user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_EMPLOYEE') {
      api.get('/customers').then((res) => setCustomers(res.data || [])).catch(() => {});
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        weight: parseFloat(formData.weight),
        customerId: user?.customerId || formData.customerId || 1
      };
      const res = await api.post('/shipments/book', payload);
      alert(`Success! Consignment #${res.data.shipmentId} registered.\nStatus: Fare Awaiting Quotation.\nOur dispatch team is reviewing your requirements to provide a manual quotation.`);
      navigate('/shipper/shipments');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create consignment. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Book New Cargo Consignment">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Support Hotline Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-500/10 text-brand-400 rounded-2xl border border-brand-500/20">
              <Phone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Need Help or Direct Fleet Discussion?
              </h4>
              <p className="text-xs text-slate-400">
                Request a direct phone consultation with CargoConnect operations coordinators.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCallModalOpen(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-brand-300 hover:text-white rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>📞 Request a Call</span>
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-2.5 text-xs text-rose-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Booking Form Card */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-400" />
              Consignment & Route Specifications
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Submit your cargo details. The CargoConnect operations desk will manually evaluate the route and provide a tailored fare quotation.
            </p>
          </div>

          {/* Admin Customer Selector */}
          {(user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_EMPLOYEE') && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Select Customer Account
              </label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.isCorporate ? '(Corporate)' : '(Retail)'} — ID #{c.id}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Route Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Pickup Origin Address (e.g. Pashan, Pune)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Pashan-Sus Road, Pune, Maharashtra"
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-brand-500"
                />
                <MapPin className="w-4 h-4 text-brand-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Delivery Destination Address (e.g. Andheri, Mumbai)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Andheri East MIDC, Mumbai, Maharashtra"
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-brand-500"
                />
                <MapPin className="w-4 h-4 text-indigo-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* Cargo Requirements & Vehicle Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Cargo Weight (kg)
              </label>
              <input
                type="number"
                required
                min={1}
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Required Vehicle Type
              </label>
              <select
                value={formData.vehicleTypeRequired}
                onChange={(e) => setFormData({ ...formData, vehicleTypeRequired: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-500 font-medium"
              >
                {VEHICLE_TYPES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Cargo / Freight Category
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Electronics, Machinery"
                value={formData.goodsType}
                onChange={(e) => setFormData({ ...formData, goodsType: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Pickup Timing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Pickup Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={formData.pickupDate}
                  onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-brand-500"
                />
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Pickup Time Slot
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 10:00 AM or Morning Slot"
                  value={formData.pickupTime}
                  onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-brand-500"
                />
                <Clock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* Cargo Photo Upload & Special Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Cargo Photo (Direct URL / Image Link)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or leave blank"
                  value={formData.cargoPhotoUrl}
                  onChange={(e) => setFormData({ ...formData, cargoPhotoUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-brand-500"
                />
                <ImageIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Special Loading / Handling Instructions
              </label>
              <input
                type="text"
                placeholder="e.g. Forklift required, fragile packaging, waterproof cover"
                value={formData.specialRequirements}
                onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Fare Policy: Manual Team Quotation Notice */}
          <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Pricing Policy: Manual Operations Quotation
              </span>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                CargoConnect operates on a fair verified marketplace model. No automated surging or rigid formulas. Once submitted, our operations team will evaluate route feasibility and post a customized fare quotation for your review.
              </p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 px-4 py-2.5 rounded-xl text-center shrink-0">
              <span className="text-[10px] text-amber-300 font-bold uppercase block">Fare Status</span>
              <span className="text-sm font-extrabold text-amber-400">Awaiting Quotation</span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-brand-600/30 active:scale-[0.99]"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Registering Consignment...' : 'Submit Consignment for Fare Quotation'}
          </button>
        </form>
      </div>

      <RequestCallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
      />
    </Layout>
  );
};

export default CreateShipment;
