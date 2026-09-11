import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Lock, 
  Shield, 
  Truck, 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Database, 
  KeyRound, 
  Server, 
  Eye, 
  ShieldCheck,
  Smartphone,
  HardDrive
} from 'lucide-react';
import api from '../utils/api';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  const [supportData, setSupportData] = useState({
    companyName: 'CargoConnect',
    companyTagline: 'B2B Logistics & Fleet Management',
    officeAddress: 'CargoConnect HQ, Logistics Tech Park, Baner Road, Pune - 411045, Maharashtra, India',
    supportHours: 'Monday – Saturday: 8:00 AM – 9:00 PM IST (24/7 Emergency Dispatch Hotline)',
    supportEmail: 'support@cargoconnect.com',
    primaryPhone: '+91 98220 11223',
    secondaryPhone: '+91 98220 44556'
  });

  const lastUpdatedDate = 'September 6, 2026';

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

  const sections = [
    {
      id: 'collection',
      title: '1. Information We Collect',
      icon: Database,
      content: (
        <div className="space-y-3">
          <p>
            {supportData.companyName || 'CargoConnect'} collects only the information necessary to provide commercial freight matching, dispatch coordination, and billing services:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <strong className="text-white block mb-1">A. Commercial Account Information</strong>
              <p className="text-slate-400">
                Company name, authorized representative name, business email address, contact phone number, and encrypted password credentials (hashed with BCrypt; plaintext passwords are never stored or accessible).
              </p>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <strong className="text-white block mb-1">B. Consignment & Freight Specifications</strong>
              <p className="text-slate-400">
                Origin and destination addresses, geographic coordinates for route evaluation, cargo weight, packaging type, special material handling instructions, and optional consignment reference photos.
              </p>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <strong className="text-white block mb-1">C. Cargo Partner Fleet & Driver Verification Data</strong>
              <p className="text-slate-400">
                Commercial vehicle registration certificates (RC), transit permits, vehicle dimensions/capacity, driver license details, and driver contact information for shipment execution.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'payment-info',
      title: '2. Payment Information Security',
      icon: Lock,
      content: (
        <div className="space-y-3">
          <p>
            All digital payments, UPI collections, and partner commission settlements are processed directly by certified third-party payment gateway providers (Razorpay).
          </p>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-1.5">
            <span className="text-emerald-400 font-bold block">&bull; Zero Cardholder Data Storage</span>
            <p className="text-slate-400">
              CargoConnect does <strong>NOT</strong> collect, view, or store credit/debit card numbers, CVVs, expiration dates, net banking passwords, or UPI security PINs on our servers. All transaction authorizations occur entirely within the PCI-DSS certified gateway environment.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'location-info',
      title: '3. Geographic Location Information',
      icon: MapPin,
      content: (
        <div className="space-y-3">
          <p>
            Geographic coordinates (latitude and longitude) provided during consignment booking are utilized exclusively for:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li>Calculating route distances and evaluating manual fare quotations.</li>
            <li>Broadcasting available shipments to verified Cargo Partners operating within designated radial corridors (e.g. 20 km to 50 km).</li>
            <li>Displaying origin and destination markers on dispatch operational maps.</li>
          </ul>
          <p className="text-xs text-slate-400">
            We do not engage in unauthorized 24/7 background tracking of personal devices outside active assignment milestones.
          </p>
        </div>
      )
    },
    {
      id: 'how-we-use',
      title: '4. How Information Is Used',
      icon: Server,
      content: (
        <div className="space-y-3">
          <p>Collected operational data is used strictly for legitimate commercial logistics purposes:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li>Facilitating consignment evaluation, manual fare quotations, and booking confirmation.</li>
            <li>Broadcasting shipment requests to eligible commercial Cargo Partners.</li>
            <li>Facilitating secure driver assignment and customer OTP delivery verification.</li>
            <li>Generating official commercial invoices, tax receipts, and commission settlement statements.</li>
            <li>Communicating dispatch status updates and resolving support requests.</li>
            <li>Detecting fraud, verifying commercial permits, and maintaining platform security.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'sharing',
      title: '5. Information Sharing & Disclosure',
      icon: Eye,
      content: (
        <div className="space-y-3">
          <p>
            CargoConnect adheres to strict data minimization principles. Information is shared only as necessary to execute requested freight services:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li><strong>With Confirmed Cargo Partners:</strong> Upon shipment confirmation, pickup and delivery addresses, contact phone numbers, and cargo specifications are shared with the assigned partner to enable pickup.</li>
            <li><strong>With Shippers:</strong> The assigned vehicle registration number and driver contact name/phone are shared with the Shipper for loading coordination.</li>
            <li><strong>Payment Processors:</strong> Necessary order metadata (order ID and total amount) is shared with Razorpay for payment verification.</li>
            <li><strong>Legal & Regulatory Authorities:</strong> Data may be disclosed when required by applicable highway transport statutes, tax compliance laws, or lawful court orders.</li>
          </ul>
          <p className="text-xs text-emerald-400 font-semibold">
            We do not sell, rent, or monetize your commercial or personal data to third-party marketing brokers.
          </p>
        </div>
      )
    },
    {
      id: 'security',
      title: '6. Technical Data Security & Access Controls',
      icon: ShieldCheck,
      content: (
        <div className="space-y-3">
          <p>
            We deploy multi-layered defense mechanisms to safeguard commercial data across the platform:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li><strong>Cryptographic Password Hashing:</strong> Passwords are secured using salted BCrypt hashing before persistence in MySQL.</li>
            <li><strong>JSON Web Token (JWT) Authentication:</strong> Secure, time-limited stateless authentication tokens for all API communications.</li>
            <li><strong>Role-Based Access Control (RBAC):</strong> Strict separation of privileges preventing cross-tenant access between Shippers, Partners, Drivers, and Administrators.</li>
            <li><strong>Payment Signature Validation:</strong> Webhook and payment verification enforced with SHA-256 HMAC cryptographic checksums.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'retention',
      title: '7. Data Retention Policy',
      icon: HardDrive,
      content: (
        <div className="space-y-3">
          <p>
            Consignment records, proof of delivery timestamps, and transaction histories are retained for as long as your commercial account remains active, and as necessary to comply with commercial tax audits, dispute resolutions, and statutory transport record-keeping requirements.
          </p>
        </div>
      )
    },
    {
      id: 'user-rights',
      title: '8. User Rights & Account Preferences',
      icon: CheckCircle2,
      content: (
        <div className="space-y-3">
          <p>
            Commercial users have the right to access, review, and request corrections to their registered account details, vehicle records, and driver profiles at any time through their respective portal dashboards or by contacting our operations support desk.
          </p>
        </div>
      )
    },
    {
      id: 'cookies-storage',
      title: '9. Local Storage & Session Data',
      icon: KeyRound,
      content: (
        <div className="space-y-3">
          <p>
            CargoConnect utilizes browser <code>localStorage</code> exclusively for essential application functionality:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li>Storing active JWT session tokens to keep authorized users logged in securely.</li>
            <li>Maintaining user role and active portal preferences.</li>
          </ul>
          <p className="text-xs text-slate-400">
            We do not deploy intrusive third-party cross-site behavioral tracking cookies.
          </p>
        </div>
      )
    },
    {
      id: 'account-deletion',
      title: '10. Account Deactivation & Deletion Requests',
      icon: Shield,
      content: (
        <div className="space-y-3">
          <p>
            Users wishing to close their commercial account or request data purging may submit a formal request to our operations desk via email at <a href={'mailto:' + supportData.supportEmail} className="text-brand-400 hover:underline">{supportData.supportEmail}</a>.
          </p>
          <p className="text-xs text-slate-400">
            Account closure requires that all outstanding consignments are delivered and all platform commission settlements are fully settled.
          </p>
        </div>
      )
    },
    {
      id: 'privacy-contact',
      title: '11. Privacy Questions & Grievance Contact',
      icon: Phone,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">
            If you have questions, privacy inquiries, or data protection concerns regarding this Privacy Policy, please contact our team:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Privacy & Operations Office</span>
              <p className="text-white font-medium">{supportData.officeAddress}</p>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Direct Contact</span>
              <p className="text-brand-400 font-mono">
                <a href={'mailto:' + supportData.supportEmail} className="hover:underline">{supportData.supportEmail}</a>
              </p>
              <p className="text-white font-mono font-bold">
                <a href={'tel:' + cleanPhone(supportData.primaryPhone)} className="hover:underline">{supportData.primaryPhone}</a>
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Navigation */}
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
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 lg:py-14 space-y-8">
        {/* Banner Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-2.5 relative z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Privacy & Data Protection
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                Last Updated: {lastUpdatedDate}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              This Privacy Policy explains how {supportData.companyName || 'CargoConnect'} collects, uses, protects, and handles commercial data across our freight coordination software and logistics marketplace.
            </p>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <section
                key={sec.id}
                id={sec.id}
                className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 shadow-xl space-y-3.5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {sec.title}
                  </h2>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                  {sec.content}
                </div>
              </section>
            );
          })}
        </div>

        {/* Back to Portal Action Bar */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-white font-bold block">Enterprise Data Protection</span>
              <span className="text-slate-400 text-[11px]">Encrypted authentication and secure API transport.</span>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Link
              to="/terms-and-conditions"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              to="/login"
              className="px-5 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-brand-600/30 transition-all"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer showDetailed={true} />
    </div>
  );
};

export default PrivacyPolicy;
