import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Truck, 
  ShieldCheck, 
  MapPin, 
  Calculator, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Users, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  PhoneCall, 
  FileCheck, 
  ChevronRight,
  Sparkles,
  Navigation,
  Check,
  Award,
  Zap,
  Layers,
  HelpCircle,
  Radio,
  Compass,
  Boxes,
  Shield,
  BadgeCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const navigate = useNavigate();

  // Widget Tabs: 'calculator' or 'tracker'
  const [activeWidgetTab, setActiveWidgetTab] = useState('calculator');

  // Calculator State
  const [origin, setOrigin] = useState('Pune (Pashan / Hinjewadi Hub)');
  const [destination, setDestination] = useState('Mumbai (JNPT Port / Navi Mumbai)');
  const [truckType, setTruckType] = useState('14 FT Truck (3.5 Ton)');
  const [isCalculated, setIsCalculated] = useState(false);

  // Rate Calculation Logic
  const getEstimatedRate = () => {
    let base = 4200;
    if (origin.includes('Chakan') || origin.includes('Talegaon')) base += 350;
    if (destination.includes('Nagpur')) base = 14500;
    else if (destination.includes('Bangalore')) base = 18500;
    else if (destination.includes('Nashik')) base = 6800;

    if (truckType.includes('Tata Ace')) base = Math.round(base * 0.55);
    else if (truckType.includes('17 FT')) base = Math.round(base * 1.35);
    else if (truckType.includes('20 FT')) base = Math.round(base * 1.85);

    const distance = destination.includes('Nagpur') ? 720 : destination.includes('Bangalore') ? 840 : destination.includes('Nashik') ? 210 : 160;
    const commission = Math.round(base * 0.10);
    const total = base;

    return { base, commission, total, distance };
  };

  const rate = getEstimatedRate();

  // Tracking Simulation State
  const [trackingInput, setTrackingInput] = useState('CC-PUN-9042');
  const [trackedShipment, setTrackedShipment] = useState(null);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    setTrackedShipment({
      trackingNumber: trackingInput || 'CC-PUN-9042',
      status: 'IN_TRANSIT',
      origin: 'Pashan Industrial Zone, Pune',
      destination: 'Andheri Commercial Hub, Mumbai',
      carrier: 'Mahalaxmi Freight Carriers',
      driver: 'Rahul Shinde (MH-12-QX-4010)',
      eta: 'Today, 4:30 PM IST',
      progress: 68
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      <Navbar />

      <main className="flex-grow">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION WITH REAL-WORLD LOGISTICS BACKGROUND & TELEMETRY TOOL     */}
        {/* ========================================================================= */}
        <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-36 overflow-hidden border-b border-slate-900">
          
          {/* Real-world high-resolution commercial logistics photography background */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 pointer-events-none transition-all duration-1000"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2000&auto=format&fit=crop')`
            }}
          />

          {/* Deep atmospheric gradient overlays for perfect text contrast and modern aesthetic */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/80 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70 pointer-events-none" />
          <div className="absolute inset-0 bg-brand-950/25 mix-blend-color pointer-events-none" />

          {/* Glowing Ambient Mesh Accents */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Subtle Grid Lines Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Value Proposition & CTAs (7 Cols) */}
              <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
                
                {/* Enterprise Live Gateway Status Pill */}
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 text-xs text-slate-300 shadow-xl shadow-black/40">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="font-bold text-emerald-400">Live Logistics Gateway</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300 font-medium">Maharashtra & Inter-State Freight Network</span>
                </div>

                {/* Primary Hero Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
                  Commercial Freight.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-sky-300 to-emerald-400">
                    Transparent, Fast & Verified.
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Direct connection between verified manufacturers and fleet operators across Maharashtra's busiest industrial corridors. Real-time GPS telematics, transparent reverse bidding, instant driver dispatch, and GST-compliant e-PODs.
                </p>

                {/* Action CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link
                    to="/login?tab=register"
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-brand-600/30 hover:shadow-brand-600/40 transition-all flex items-center justify-center gap-2.5 group active:scale-95"
                  >
                    <span>Book Your First Freight</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <a
                    href="#calculator"
                    className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 backdrop-blur-xl border border-slate-700 text-slate-200 hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Calculator className="w-4 h-4 text-brand-400" />
                    <span>Instant Rate Calculator</span>
                  </a>
                </div>

                {/* Industrial Corridors Ticker */}
                <div className="pt-2">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-2 text-center lg:text-left">
                    High-Frequency Industrial Corridors:
                  </span>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs">
                    <span className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-400" />
                      Pune (Chakan MIDC) ➔ Mumbai (JNPT Port)
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-400" />
                      Pune (Hinjewadi) ➔ Bengaluru
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-400" />
                      Pune (Bhosari) ➔ Nashik MIDC
                    </span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>100% KYC & VAHAN Verified Fleets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Zero Brokerage Marketplace</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-brand-400" />
                    <span>Automated GST & e-Way Bill</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Instant Rate & Tracking Tool (5 Cols) */}
              <div className="lg:col-span-5" id="calculator">
                <div className="bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-700/80 shadow-2xl shadow-black/90 overflow-hidden relative">
                  
                  {/* Subtle top card glow */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-400" />

                  {/* Tool Header Tabs */}
                  <div className="flex border-b border-slate-800 bg-slate-950/80 p-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveWidgetTab('calculator')}
                      className={`flex-1 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        activeWidgetTab === 'calculator'
                          ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <Calculator className="w-4 h-4" />
                      <span>Freight Rate Estimator</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveWidgetTab('tracker')}
                      className={`flex-1 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        activeWidgetTab === 'tracker'
                          ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <Search className="w-4 h-4" />
                      <span>Live Telemetry Tracker</span>
                    </button>
                  </div>

                  {/* TAB 1: INSTANT RATE ESTIMATOR */}
                  {activeWidgetTab === 'calculator' && (
                    <div className="p-6 sm:p-7 space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Pickup Location (Industrial Hub)
                        </label>
                        <select
                          value={origin}
                          onChange={(e) => { setOrigin(e.target.value); setIsCalculated(true); }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-brand-500 transition-colors"
                        >
                          <option>Pune (Pashan / Hinjewadi Hub)</option>
                          <option>Pune (Chakan Auto Cluster)</option>
                          <option>Pune (Bhosari / MIDC Hub)</option>
                          <option>Talegaon Industrial Corridor</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Delivery Destination
                        </label>
                        <select
                          value={destination}
                          onChange={(e) => { setDestination(e.target.value); setIsCalculated(true); }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-brand-500 transition-colors"
                        >
                          <option>Mumbai (JNPT Port / Navi Mumbai)</option>
                          <option>Mumbai (Andheri / Commercial Hub)</option>
                          <option>Thane Industrial Area</option>
                          <option>Nashik Ambad MIDC</option>
                          <option>Nagpur Logistics Park</option>
                          <option>Bangalore Electronic City</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Vehicle Configuration
                        </label>
                        <select
                          value={truckType}
                          onChange={(e) => { setTruckType(e.target.value); setIsCalculated(true); }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-brand-500 transition-colors"
                        >
                          <option>Tata Ace (1.2 Ton - City Dispatch)</option>
                          <option>14 FT Truck (3.5 Ton - Mid Freight)</option>
                          <option>17 FT Heavy Truck (5.0 Ton - Heavy Cargo)</option>
                          <option>20 FT Container (8.0 Ton - High Capacity)</option>
                        </select>
                      </div>

                      {/* Estimated Fare Display Box */}
                      <div className="mt-4 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Corridor Distance:</span>
                          <span className="font-semibold text-white">~{rate.distance} km</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Benchmark Market Fare:</span>
                          <span className="text-base font-black text-brand-400">₹{rate.total.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-900">
                          <span>Platform Commission (10%):</span>
                          <span>₹{rate.commission.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigate('/login?tab=register')}
                        className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-600/25 transition-all"
                      >
                        <span>Dispatch This Truck</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* TAB 2: LIVE CONSIGNMENT TRACKER */}
                  {activeWidgetTab === 'tracker' && (
                    <div className="p-6 sm:p-7 space-y-4">
                      <form onSubmit={handleTrackSubmit} className="space-y-3">
                        <label className="block text-xs font-semibold text-slate-300">
                          Enter Waybill or Consignment Number
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. CC-PUN-9042"
                            value={trackingInput}
                            onChange={(e) => setTrackingInput(e.target.value)}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-3 px-3.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
                          />
                          <button
                            type="submit"
                            className="px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
                          >
                            Track
                          </button>
                        </div>
                      </form>

                      {trackedShipment ? (
                        <div className="mt-3 p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3 animate-in fade-in duration-300">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-emerald-400">
                              {trackedShipment.trackingNumber}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              IN TRANSIT
                            </span>
                          </div>

                          {/* Progress Indicator */}
                          <div className="space-y-1">
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full"
                                style={{ width: `${trackedShipment.progress}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                              <span>Pune Pashan Hub</span>
                              <span>Mumbai JNPT Port</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-900">
                            <div>
                              <span className="text-slate-500 block">Fleet Carrier:</span>
                              <span className="font-medium text-slate-200">{trackedShipment.carrier}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block">Vehicle / Driver:</span>
                              <span className="font-medium text-slate-200">{trackedShipment.driver}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-5 text-center text-xs text-slate-500 rounded-2xl border border-dashed border-slate-800">
                          Type any code or click Track to view simulated live telemetry.
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. LIVE METRICS STRIP (PROVEN SCALE)                                      */}
        {/* ========================================================================= */}
        <section className="bg-slate-900/60 border-b border-slate-900 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-center">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">₹4.8 Cr+</span>
                <span className="block text-xs font-semibold text-slate-400 mt-1">Freight Dispatched</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-center">
                <span className="text-2xl sm:text-3xl font-black text-brand-400 tracking-tight">12,850+</span>
                <span className="block text-xs font-semibold text-slate-400 mt-1">Completed Consignments</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-center">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">99.2%</span>
                <span className="block text-xs font-semibold text-slate-400 mt-1">On-Time Delivery SLA</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-center">
                <span className="text-2xl sm:text-3xl font-black text-indigo-400 tracking-tight">450+</span>
                <span className="block text-xs font-semibold text-slate-400 mt-1">Verified Fleet Partners</span>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. HOW CARGOCONNECT WORKS (3-STEP WORKFLOW)                              */}
        {/* ========================================================================= */}
        <section className="py-20 lg:py-24 border-b border-slate-900 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
                Seamless Marketplace Workflow
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                How CargoConnect Powers Operations
              </h2>
              <p className="text-sm text-slate-400 font-normal leading-relaxed">
                From initial quote request to proof of delivery, our digital pipeline automates every step of freight movement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Step 1 */}
              <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4 hover:border-slate-700 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center font-black text-lg">
                  01
                </div>
                <h3 className="text-lg font-bold text-white">Create Consignment</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Shippers enter pickup address, destination, cargo weight, and vehicle requirements in seconds.
                </p>
                <div className="pt-2 text-xs text-brand-400 font-semibold flex items-center gap-1">
                  <span>Fast GST & Invoice Ready</span>
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4 hover:border-slate-700 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-lg">
                  02
                </div>
                <h3 className="text-lg font-bold text-white">Partner Bidding & Quote</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Regional fleet owners receive real-time audio alerts and submit competitive freight bids immediately.
                </p>
                <div className="pt-2 text-xs text-indigo-400 font-semibold flex items-center gap-1">
                  <span>Audio Alert Ringtone</span>
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4 hover:border-slate-700 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg">
                  03
                </div>
                <h3 className="text-lg font-bold text-white">Dispatch & Digital POD</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Driver navigates via GPS, captures consignee signatures, and uploads photo proof of delivery upon arrival.
                </p>
                <div className="pt-2 text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <span>Instant Razorpay Settlement</span>
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. BOTH SIDES OF THE MARKETPLACE (SHIPPERS VS FLEET OPERATORS)           */}
        {/* ========================================================================= */}
        <section className="py-20 lg:py-24 border-b border-slate-900 bg-slate-950/80" id="services">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                Two-Sided Commercial Ecosystem
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Designed for Shippers & Fleet Owners
              </h2>
              <p className="text-sm text-slate-400 font-normal leading-relaxed">
                Whether you manufacture goods or operate commercial trucks, CargoConnect provides the infrastructure you need.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              
              {/* Card 1: For B2B Shippers */}
              <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/5 rounded-full blur-2xl group-hover:bg-brand-500/10 transition-all" />

                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center border border-brand-500/20">
                  <Building2 className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">For Shippers & Manufacturers</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Reliable capacity on demand with verified regional transporters. Say goodbye to fragmented brokerage and phone negotiation.
                  </p>
                </div>

                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Guaranteed vehicle placement for Pune-Mumbai & national routes</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Competitive reverse bidding brings transparent freight costs</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Automated GST e-invoices & corporate credit billing</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Live GPS vehicle telematics & status push updates</span>
                  </li>
                </ul>

                <Link
                  to="/login?tab=register"
                  className="inline-flex items-center gap-2 text-xs font-bold text-brand-400 hover:text-brand-300 pt-2"
                >
                  <span>Register as a Shipper</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Card 2: For Fleet Owners & Transporters */}
              <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 relative overflow-hidden group" id="fleets">
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all" />

                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <Truck className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">For Cargo Partners & Fleets</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Keep your fleet moving with verified high-volume industrial consignments. Zero deadhead return miles and fast settlement payouts.
                  </p>
                </div>

                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Instant audio chime alerts whenever new loads are published</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Driver & vehicle assignment in 2 clicks via mobile portal</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Transparent 10% platform commission with direct settlement logs</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Digital Proof of Delivery with signature & cargo photo capture</span>
                  </li>
                </ul>

                <Link
                  to="/login?tab=register"
                  className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 pt-2"
                >
                  <span>Register Your Fleet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. 1-CLICK DEMO PORTAL LAUNCHPAD (EVALUATION READY)                      */}
        {/* ========================================================================= */}
        <section className="py-20 lg:py-24 border-b border-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                Interactive Portal Preview
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Experience CargoConnect In Action
              </h2>
              <p className="text-sm text-slate-400 font-normal leading-relaxed">
                Test the pre-seeded demo accounts instantly with one click.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Admin Portal Card */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Master Control</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">admin / admin123</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">Platform Admin Portal</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Manage fleet approvals, driver verification, commission rules (10%), live dispatch control, and financial audits.
                  </p>
                </div>

                <Link
                  to="/login?tab=login"
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Launch Admin Portal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Cargo Partner Portal Card */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Fleet Operations</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">partner1 / partner123</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">Cargo Partner Hub</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Respond to incoming quote requests, assign drivers & trucks, trigger audio alerts, and monitor trip revenue.
                  </p>
                </div>

                <Link
                  to="/login?tab=login"
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Launch Partner Hub</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Shipper Portal Card */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Shipper Portal</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">Free Self Registration</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">Customer Consignments</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Create consignments, review partner quotes, approve standard fares, pay via Razorpay, and download invoices.
                  </p>
                </div>

                <Link
                  to="/login?tab=register"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-brand-600/20 transition-all"
                >
                  <span>Register Shipper Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. READY TO SCALE CALL TO ACTION                                          */}
        {/* ========================================================================= */}
        <section className="py-20 lg:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to Upgrade Your Logistics Operations?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
              Join leading shippers and verified fleet partners operating across Pune, Maharashtra and nationwide industrial freight hubs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link
                to="/login?tab=register"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-brand-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-all"
              >
                <span>Speak with Operations Desk</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
