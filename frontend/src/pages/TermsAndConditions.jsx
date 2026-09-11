import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Shield, 
  Truck, 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  CreditCard, 
  Building, 
  Users, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import api from '../utils/api';
import Footer from '../components/Footer';

const TermsAndConditions = () => {
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
      id: 'introduction',
      title: '1. Introduction & Platform Model',
      icon: Truck,
      content: (
        <div className="space-y-3">
          <p>
            Welcome to <strong>{supportData.companyName || 'CargoConnect'}</strong> (&quot;CargoConnect&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). CargoConnect is a specialized B2B logistics and fleet-management technology platform designed to streamline freight consolidation, freight matching, and shipment coordination.
          </p>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 block">
              Operational Structure & Relationship
            </span>
            <p className="text-slate-300">
              The operational hierarchy of the platform operates strictly as follows:
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800 text-center font-mono text-xs text-white">
              <span className="px-2.5 py-1 bg-brand-500/20 text-brand-300 rounded-lg">1. Shipper (Booking)</span>
              <span className="text-slate-500 hidden sm:inline">&rarr;</span>
              <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg">2. CargoConnect (Platform)</span>
              <span className="text-slate-500 hidden sm:inline">&rarr;</span>
              <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 rounded-lg">3. Cargo Partner (Fleet Operator)</span>
              <span className="text-slate-500 hidden sm:inline">&rarr;</span>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg">4. Partner Vehicle + Driver</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed pt-1">
              CargoConnect connects commercial Shippers with independent verified Cargo Partners. CargoConnect does not operate an open individual driver marketplace; all vehicles and drivers are managed, employed, or contracted directly by independent Cargo Partners.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'eligibility',
      title: '2. User Eligibility & Account Roles',
      icon: Users,
      content: (
        <div className="space-y-3">
          <p>
            Use of CargoConnect is restricted to authorized commercial entities, businesses, cargo fleet operators, and registered representatives capable of entering into legally binding commercial contracts.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li><strong>Shippers / Customers:</strong> Businesses or commercial individuals booking freight and cargo transportation services.</li>
            <li><strong>Cargo Partners:</strong> Commercial fleet owners, transport operators, and logistics agencies maintaining registered commercial vehicles and drivers.</li>
            <li><strong>Drivers:</strong> Authorized personnel designated and assigned by registered Cargo Partners to execute pickup, transit, and delivery.</li>
            <li><strong>Administrators & Coordinators:</strong> CargoConnect personnel overseeing manual fare evaluation, territory matching, verification, and support.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'shipper-responsibilities',
      title: '3. Shipper Responsibilities',
      icon: CheckCircle2,
      content: (
        <div className="space-y-3">
          <p>When booking a consignment on CargoConnect, Shippers agree to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li>Provide accurate and complete consignment descriptions, cargo weights, dimensions, and material classifications.</li>
            <li>Specify precise pickup and delivery locations, point-of-contact details, and available loading/unloading windows.</li>
            <li>Disclose any fragile, hazardous, temperature-sensitive, or specialized handling requirements prior to quotation acceptance.</li>
            <li>Ensure cargo is adequately packaged, labeled, palletized, and secured for commercial transit.</li>
            <li>Furnish all necessary commercial invoices, e-way bills, regulatory permits, and transport declarations.</li>
            <li>Ensure authorized personnel are present at the destination to verify goods and provide the secure Delivery OTP.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'partner-responsibilities',
      title: '4. Cargo Partner Responsibilities',
      icon: Building,
      content: (
        <div className="space-y-3">
          <p>Verified Cargo Partners participating in the CargoConnect network agree to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li>Maintain valid commercial vehicle registrations (RC), national/state transit permits, roadworthiness fitness certificates, and comprehensive commercial vehicle insurance.</li>
            <li>Assign only qualified, licensed commercial drivers with verified KYC and background records.</li>
            <li>Select and assign their own verified fleet vehicles and drivers for confirmed consignments.</li>
            <li>Execute accepted consignments promptly according to scheduled pickup and delivery timelines.</li>
            <li>Provide real-time milestone updates through the partner portal (e.g. En Route to Pickup, Loaded, In Transit, Arrived).</li>
            <li>Obtain customer OTP verification and digital proof of delivery at destination.</li>
          </ul>
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              <strong>Independent Operator Clause:</strong> CargoConnect does not employ or direct the Partner&apos;s drivers. The Cargo Partner remains solely responsible for driver conduct, employment terms, vehicle maintenance, and highway safety compliance.
            </span>
          </div>
        </div>
      )
    },
    {
      id: 'shipment-quotations',
      title: '5. Manual Fare Quotation & Review Process',
      icon: Scale,
      content: (
        <div className="space-y-3">
          <p>
            To provide competitive, route-optimized, and fair pricing for commercial freight, CargoConnect utilizes a <strong>Manual Evaluation & Quotation Workflow</strong> rather than automated algorithmic fare generation.
          </p>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 block">
              Consignment Quotation Lifecycle
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center font-mono text-xs">
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Step 1</span>
                <strong className="text-white text-[11px]">Consignment Created</strong>
              </div>
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Step 2</span>
                <strong className="text-white text-[11px]">Operations Review</strong>
              </div>
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Step 3</span>
                <strong className="text-white text-[11px]">Manual Fare Quote</strong>
              </div>
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Step 4</span>
                <strong className="text-white text-[11px]">Shipper Acceptance</strong>
              </div>
            </div>
            <p className="text-slate-400 text-[11px] pt-1 leading-relaxed">
              Once the Shipper accepts the quoted fare, the shipment is broadcast to eligible Cargo Partners operating in the relevant territory corridor.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'cancellation',
      title: '6. Cancellation & Modifications',
      icon: AlertTriangle,
      content: (
        <div className="space-y-3">
          <p>
            Cancellation terms depend on the shipment lifecycle state, elapsed timing, partner assignment, and vehicle arrival status:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li><strong>Prior to Quote Acceptance:</strong> Shippers may cancel or amend consignment details without fee.</li>
            <li><strong>After Partner Confirmation:</strong> Cancellations made after a Cargo Partner has dispatched a dedicated vehicle may be subject to operational coordination fees.</li>
            <li><strong>In Transit:</strong> Consignments currently in transit cannot be cancelled; rerouting requests must be coordinated directly through the CargoConnect operations desk.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'cargo-restrictions',
      title: '7. Cargo Restrictions & Prohibited Goods',
      icon: Shield,
      content: (
        <div className="space-y-3">
          <p>
            Users are strictly prohibited from submitting consignments containing illegal, dangerous, or restricted substances under applicable transportation laws, including but not limited to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li>Explosives, firearms, radioactive materials, and unregulated hazardous chemicals.</li>
            <li>Contraband, narcotics, illicit goods, or stolen merchandise.</li>
            <li>Perishable goods requiring uncertified refrigeration unless specifically agreed upon.</li>
            <li>Livestock or live animals without specialized transit clearances.</li>
          </ul>
          <p className="text-xs text-slate-400">
            CargoConnect and participating Cargo Partners reserve the right to inspect outer packaging and reject any cargo suspected of violating statutory safety regulations.
          </p>
        </div>
      )
    },
    {
      id: 'payment-methods',
      title: '8. Payment Terms & Settlement',
      icon: CreditCard,
      content: (
        <div className="space-y-3">
          <p>
            CargoConnect supports transparent, flexible payment channels for commercial logistics:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li><strong>Online Digital Payments:</strong> Secure payments via UPI, Credit/Debit Cards, Net Banking, and Corporate Wallets powered by Razorpay.</li>
            <li><strong>Cash on Delivery (COD) / Direct Pay:</strong> Direct payment collected at delivery upon OTP verification where authorized.</li>
            <li><strong>Corporate Credit Terms:</strong> Periodic billing and invoiced settlements available for verified enterprise shippers with approved corporate credit limits.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'partner-commission',
      title: '9. Cargo Partner Commission & Eligibility Gate',
      icon: Scale,
      content: (
        <div className="space-y-3">
          <p>
            CargoConnect operates on a sustainable platform fee model deducted as a percentage commission from confirmed partner shipment payouts.
          </p>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
              Platform Settlement & New Order Eligibility Policy
            </span>
            <p className="text-slate-300">
              When a completed or confirmed consignment incurs an outstanding platform commission:
            </p>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1 font-mono text-xs">
              <div className="flex items-center gap-2 text-rose-400">
                <span>&bull; Outstanding Commission</span> &rarr; <span>New Job Offers Temporarily Paused</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <span>&bull; Verified Payment Settled</span> &rarr; <span>Immediate Full Eligibility Restored</span>
              </div>
            </div>
            <p className="text-slate-400 text-[11px] pt-1">
              This mechanism maintains an active, balanced, and accountable marketplace for all participating freight operators without charging upfront recurring subscription fees.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'razorpay-payments',
      title: '10. Payment Gateway Security (Razorpay)',
      icon: ShieldCheck,
      content: (
        <div className="space-y-3">
          <p>
            All online transactions, UPI dynamic QR collections, and settlement payments are processed securely through PCI-DSS Level 1 certified third-party payment gateways (Razorpay).
          </p>
          <p className="text-slate-300">
            CargoConnect does not store, process, or view sensitive payment credentials such as credit card numbers, CVV codes, bank login credentials, or UPI PINs. All payment signatures are cryptographically verified via HMAC-SHA256 protocols.
          </p>
        </div>
      )
    },
    {
      id: 'delivery-pod',
      title: '11. Delivery Verification & Proof of Delivery (POD)',
      icon: CheckCircle2,
      content: (
        <div className="space-y-3">
          <p>
            Consignment completion requires formal, tamper-evident verification at the delivery destination:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li><strong>Delivery OTP:</strong> A unique 4-digit One-Time Password generated automatically upon booking and shared exclusively with the designated receiver.</li>
            <li><strong>Driver Verification:</strong> The assigned driver must enter the valid OTP in the partner app to complete handover.</li>
            <li><strong>Digital Proof of Delivery (POD):</strong> Timestamped digital delivery logs and optional consignment handover photographs serve as conclusive evidence of completed delivery.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'disputes-claims',
      title: '12. Claims, Loss, Damage & Dispute Resolution',
      icon: Scale,
      content: (
        <div className="space-y-3">
          <p>
            Users may register formal complaints and claims directly through the CargoConnect platform or via the operations desk for:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li>In-transit transit delays or unscheduled route diversions.</li>
            <li>Physical damage or shortages observed at the time of delivery before OTP verification.</li>
            <li>Billing discrepancies or vehicle specification mismatches.</li>
          </ul>
          <p className="text-slate-400 text-xs">
            All claims are investigated by the CargoConnect operations team in coordination with the assigned Cargo Partner and relevant commercial insurance policies.
          </p>
        </div>
      )
    },
    {
      id: 'suspension',
      title: '13. Account Suspension & Compliance',
      icon: AlertTriangle,
      content: (
        <div className="space-y-3">
          <p>
            CargoConnect reserves the right to restrict, suspend, or terminate user or partner accounts for:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li>Submission of falsified vehicle documentation, expired permits, or invalid driver licenses.</li>
            <li>Repeated unexcused consignment cancellations or abandonment of accepted jobs.</li>
            <li>Fraudulent payment attempts, chargeback abuse, or commission evasion.</li>
            <li>Verbal abuse, safety violations, or breach of applicable transportation statutes.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'liability',
      title: '14. Limitation of Liability',
      icon: Shield,
      content: (
        <div className="space-y-3">
          <p className="text-slate-300">
            CargoConnect provides technology coordination software and marketplace matching services. While CargoConnect enforces rigorous partner KYC and documentation checks, CargoConnect shall not be held liable for indirect, incidental, or consequential damages resulting from highway congestion, road closures, adverse weather events, third-party carrier negligence, or unmanifested cargo damage beyond statutory limits.
          </p>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400">
            <em>Draft Policy Notice:</em> These terms represent operational commercial guidelines for the CargoConnect B2B logistics ecosystem and are subject to formal legal review prior to jurisdictional statutory filings.
          </div>
        </div>
      )
    },
    {
      id: 'changes',
      title: '15. Modifications to Terms',
      icon: Clock,
      content: (
        <div className="space-y-3">
          <p>
            CargoConnect may update these Terms & Conditions periodically to reflect technological enhancements, operational adjustments, or regulatory updates. Continued use of the platform after published revisions constitutes acceptance of the updated terms.
          </p>
          <p className="text-xs font-mono text-brand-400">
            Current Revision Active Since: {lastUpdatedDate}
          </p>
        </div>
      )
    },
    {
      id: 'contact',
      title: '16. Questions & Contact Information',
      icon: Phone,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">
            For inquiries regarding these Terms & Conditions, corporate contracts, or operational guidelines, please contact the CargoConnect Operations Team:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Operations Headquarters</span>
              <p className="text-white font-medium">{supportData.officeAddress}</p>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Official Communication</span>
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/20">
                Legal & Governance
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                Last Updated: {lastUpdatedDate}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Please read these Terms & Conditions carefully. They govern all consignment bookings, fleet allocations, manual quotations, partner commission settlements, and platform services provided by {supportData.companyName || 'CargoConnect'}.
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
                  <div className="p-2.5 bg-brand-500/10 text-brand-400 rounded-2xl border border-brand-500/20">
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
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-white font-bold block">Transparent Logistics Partnership</span>
              <span className="text-slate-400 text-[11px]">Operating with verified commercial fleets nationwide.</span>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Link
              to="/privacy-policy"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors"
            >
              Privacy Policy
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

export default TermsAndConditions;
