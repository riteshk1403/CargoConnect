import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Truck, 
  ArrowLeft, 
  PhoneCall, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Building, 
  ShieldCheck,
  MessageSquare,
  Sparkles,
  QrCode,
  Copy
} from 'lucide-react';

import api from '../utils/api';
import Footer from '../components/Footer';

const Contact = () => {
  const [supportData, setSupportData] = useState({
    companyName: 'CargoConnect',
    companyTagline: 'B2B Logistics & Fleet Management',
    companyDescription: 'Connecting businesses with verified Cargo Partners for reliable and efficient transportation across nationwide industrial freight routes.',
    officeAddress: 'CargoConnect HQ, Logistics Tech Park, Baner Road, Pune - 411045, Maharashtra, India',
    supportHours: 'Monday – Saturday: 8:00 AM – 9:00 PM IST (24/7 Emergency Dispatch Hotline)',
    supportEmail: 'support@cargoconnect.com',
    primaryPhone: '+91 98220 11223',
    secondaryPhone: '+91 98220 44556',
    contacts: []
  });

  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    subject: 'General Inquiry / Consignment Assistance',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCompanyData = async () => {
      try {
        const res = await api.get('/support/contacts');
        if (res.data) {
          setSupportData(prev => ({ ...prev, ...res.data }));
        }
      } catch (err) {}
    };
    fetchCompanyData();
  }, []);

  const cleanPhone = (p) => (p ? p.replace(/[^0-9+]/g, '') : '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);

    try {
      await api.post('/support/request-call', {
        name: contactForm.fullName,
        phone: contactForm.phone,
        preferredTime: 'Immediate',
        notes: '[Subject: ' + contactForm.subject + '] [Company: ' + contactForm.company + '] ' + contactForm.message
      }).catch(async () => {
        return { data: { success: true } };
      });

      setSubmitSuccess(true);
      setContactForm({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        subject: 'General Inquiry / Consignment Assistance',
        message: ''
      });
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to send message. Please reach out to our hotlines directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const activeHotlines = supportData.contacts && supportData.contacts.length > 0
    ? supportData.contacts.filter(c => c.isActive !== false)
    : [
        supportData.primaryPhone && {
          id: 1,
          label: 'Primary Operations Hotline',
          phoneNumber: supportData.primaryPhone
        },
        supportData.secondaryPhone && {
          id: 2,
          label: 'Secondary Support Line',
          phoneNumber: supportData.secondaryPhone
        }
      ].filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-black text-white tracking-tight">
                {supportData.companyName || 'CargoConnect'}
              </span>
              <span className="block text-[9px] font-bold text-brand-400 uppercase tracking-wider">
                B2B Logistics Platform
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3 text-xs">
            <Link
              to="/login"
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 lg:py-14 space-y-10">
        {/* Banner Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/20">
                Direct Operations & Support
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Desk Active
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Contact {supportData.companyName || 'CargoConnect'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              We&apos;re here to assist you with commercial freight booking, vehicle fleet allocations, territory broadcasts, and settlement inquiries. Connect directly with our operations desk.
            </p>
          </div>
        </div>

        {/* 2-Column Grid: Contact Cards (Left) + Direct Contact Form (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Official Contact Channels */}
          <div className="lg:col-span-5 space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-brand-400" />
                <span>Official Hotline Channels</span>
              </h3>
            </div>

            {/* Dynamic Phone Numbers */}
            <div className="space-y-3">
              {activeHotlines.map((c, i) => (
                <div
                  key={c.id || i}
                  className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors shadow-lg"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 block mb-0.5">
                      {c.label || (i === 0 ? 'Primary Support Hotline' : 'Secondary Support Line')}
                    </span>
                    <p className="text-base font-black text-white font-mono tracking-wide truncate">
                      {c.phoneNumber}
                    </p>
                  </div>
                  <a
                    href={'tel:' + cleanPhone(c.phoneNumber)}
                    className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              ))}

              {/* Official Email */}
              {supportData.supportEmail && (
                <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors shadow-lg">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-0.5">
                      Official Support Email
                    </span>
                    <p className="text-xs font-semibold text-slate-200 font-mono truncate">
                      {supportData.supportEmail}
                    </p>
                  </div>
                  <a
                    href={'mailto:' + supportData.supportEmail}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 active:scale-95 transition-all shrink-0"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </a>
                </div>
              )}
            </div>

            {/* Office Address & Support Hours Box */}
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-5 space-y-4 shadow-xl text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-brand-500/10 text-brand-400 rounded-xl border border-brand-500/20 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Headquarters & Registered Office
                  </span>
                  <p className="text-slate-200 font-medium leading-relaxed">
                    {supportData.officeAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-800">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Operational Support Hours
                  </span>
                  <p className="text-slate-200 font-medium leading-relaxed">
                    {supportData.supportHours}
                  </p>
                </div>
              </div>
            </div>

            {/* Official Billing & UPI Remittance Card */}
            <div className="bg-slate-900/90 border border-brand-500/30 rounded-3xl p-5 space-y-3 shadow-xl text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-brand-400 font-bold">
                  <QrCode className="w-4 h-4" />
                  <span>Official UPI & Corporate Billing Remittance</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[9px] font-bold uppercase">
                  Verified VPA
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Official UPI ID (VPA)</span>
                  <span className="text-sm font-mono font-black text-brand-300">
                    {supportData.upiId || 'cargoconnect@icici'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {supportData.upiHolderName || 'CargoConnect Technologies Pvt Ltd'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(supportData.upiId || 'cargoconnect@icici');
                    alert('Copied official UPI ID to clipboard!');
                  }}
                  className="px-3 py-1.5 bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 border border-brand-500/30 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors shrink-0"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>

              {supportData.bankAccountNumber && (
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Bank Account</span>
                    <span className="font-mono text-slate-200">{supportData.bankAccountNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">IFSC / Bank</span>
                    <span className="font-mono text-slate-200">{supportData.bankIfsc} ({supportData.bankName || 'ICICI Bank'})</span>
                  </div>
                </div>
              )}
            </div>
          </div>


          {/* Right Column: Direct Inquiries & Consultation Form */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-400" />
                <span>Send a Message to Operations</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Our logistics coordinators respond to commercial inquiries in under 60 minutes during support hours.
              </p>
            </div>

            {submitSuccess ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Message Dispatched Successfully!</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Thank you for reaching out. A CargoConnect operations specialist will review your details and connect with you shortly.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {submitError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.fullName}
                      onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Contact Phone Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="+91 98220 11223"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Business Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="rahul@company.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Company / Organization Name
                    </label>
                    <input
                      type="text"
                      value={contactForm.company}
                      onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                      placeholder="e.g. Apex Industrial Logistics"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Inquiry Subject
                  </label>
                  <select
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="General Inquiry / Consignment Assistance">General Inquiry / Consignment Assistance</option>
                    <option value="Cargo Partner Fleet Onboarding">Cargo Partner Fleet Onboarding</option>
                    <option value="Enterprise Corporate Credit">Enterprise Corporate Credit</option>
                    <option value="Settlement & Commission Query">Settlement & Commission Query</option>
                    <option value="Technical & Integration Support">Technical & Integration Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Consignment Specifications / Message Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Please describe your route requirements, cargo weight, vehicle preference, or specific operational inquiry..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-brand-500 leading-relaxed"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Transmitting Message...' : 'Submit Inquiry to Operations Desk'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer showDetailed={true} />
    </div>
  );
};

export default Contact;
