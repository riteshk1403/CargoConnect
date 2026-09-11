import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Lock, 
  PhoneCall, 
  ChevronRight
} from 'lucide-react';
import api from '../utils/api';
import CallTeamModal from './CallTeamModal';

const Footer = ({ showDetailed = true }) => {
  const [supportData, setSupportData] = useState({
    companyName: 'CargoConnect',
    companyTagline: 'B2B Logistics & Fleet Management',
    companyDescription: 'Connecting businesses with verified Cargo Partners for reliable and efficient transportation across nationwide industrial freight routes.',
    officeAddress: 'CargoConnect HQ, Logistics Tech Park, Baner Road, Pune - 411045, Maharashtra, India',
    supportHours: 'Monday – Saturday: 8:00 AM – 9:00 PM IST (24/7 Emergency Dispatch Hotline)',
    supportEmail: 'support@cargoconnect.com',
    primaryPhone: '+91 98220 11223',
    secondaryPhone: '+91 98220 44556'
  });
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  useEffect(() => {
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

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs mt-auto">
      {showDetailed && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Column 1: Company Brand & Mission */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-base font-black text-white tracking-tight">
                    {supportData.companyName || 'CargoConnect'}
                  </span>
                  <span className="block text-[10px] font-bold text-brand-400 uppercase tracking-wider">
                    {supportData.companyTagline || 'B2B Logistics & Fleet Management'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {supportData.companyDescription}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Verified Cargo Partners
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  Enterprise SLA
                </span>
              </div>
            </div>

            {/* Column 2: Quick Navigation */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Platform
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/shipper/dashboard" className="hover:text-brand-400 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <span>Shipper Portal</span>
                  </Link>
                </li>
                <li>
                  <Link to="/partner/dashboard" className="hover:text-brand-400 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <span>Cargo Partner Portal</span>
                  </Link>
                </li>
                <li>
                  <Link to="/shipper/create-shipment" className="hover:text-brand-400 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <span>Book Consignment</span>
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-brand-400 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <span>Contact Operations</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal & Governance */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Legal & Governance
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/terms-and-conditions" className="hover:text-brand-400 transition-colors flex items-center gap-1">
                    <FileText className="w-3 h-3 text-slate-600" />
                    <span>Terms & Conditions</span>
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="hover:text-brand-400 transition-colors flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-600" />
                    <span>Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-brand-400 transition-colors flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-600" />
                    <span>Office Headquarters</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Support & Operations Desk */}
            <div className="lg:col-span-4 space-y-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-brand-400" />
                  <span>Operations Hotline</span>
                </h4>
                <button
                  onClick={() => setIsCallModalOpen(true)}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20 hover:bg-brand-500/20 transition-colors"
                >
                  Connect Desk
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {supportData.primaryPhone && (
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-[11px] text-slate-400">Primary Hotline:</span>
                    <a
                      href={'tel:' + cleanPhone(supportData.primaryPhone)}
                      className="font-mono font-bold text-white hover:text-brand-400 transition-colors"
                    >
                      {supportData.primaryPhone}
                    </a>
                  </div>
                )}

                {supportData.secondaryPhone && (
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-[11px] text-slate-400">Secondary Support:</span>
                    <a
                      href={'tel:' + cleanPhone(supportData.secondaryPhone)}
                      className="font-mono font-bold text-white hover:text-brand-400 transition-colors"
                    >
                      {supportData.secondaryPhone}
                    </a>
                  </div>
                )}

                {supportData.supportEmail && (
                  <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-800">
                    <span className="text-[11px] text-slate-400">Email:</span>
                    <a
                      href={'mailto:' + supportData.supportEmail}
                      className="font-mono font-semibold text-brand-400 hover:underline"
                    >
                      {supportData.supportEmail}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-1.5 text-[10px] text-slate-400 pt-1">
                <Clock className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
                <span>{supportData.supportHours}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Legal Copyright */}
      <div className="border-t border-slate-900 bg-slate-950/90 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} {supportData.companyName || 'CargoConnect'} Technologies. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/terms-and-conditions" className="hover:text-slate-300 transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-slate-700">&bull;</span>
            <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-700">&bull;</span>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      <CallTeamModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
      />
    </footer>
  );
};

export default Footer;
