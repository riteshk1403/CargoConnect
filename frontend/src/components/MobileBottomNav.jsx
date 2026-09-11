import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Truck, 
  UserCheck, 
  Package, 
  PlusCircle, 
  FileText, 
  MapPin, 
  PhoneCall, 
  Menu,
  FileCheck
} from 'lucide-react';

const MobileBottomNav = ({ onOpenMenu }) => {
  const { user } = useAuth();

  const isRole = (role) => user?.role === role;
  const isAdminOrEmployee = isRole('ROLE_ADMIN') || isRole('ROLE_EMPLOYEE');
  const isPartner = isRole('ROLE_CARGO_PARTNER');
  const isShipper = isRole('ROLE_SHIPPER') || isRole('ROLE_CUSTOMER');
  const isDriver = isRole('ROLE_DRIVER');

  const adminTabs = [
    { name: 'KPIs', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Dispatch', path: '/admin/dispatch', icon: MapPin },
    { name: 'Calls', path: '/admin/call-requests', icon: PhoneCall },
    { name: 'Shipments', path: '/admin/shipments', icon: Package },
  ];

  const partnerTabs = [
    { name: 'Job Hub', path: '/partner/dashboard', icon: LayoutDashboard },
    { name: 'Fleet', path: '/partner/fleet', icon: Truck },
    { name: 'Drivers', path: '/partner/drivers', icon: UserCheck },
    { name: 'Payouts', path: '/shipper/invoices', icon: FileText },
  ];

  const shipperTabs = [
    { name: 'Home', path: '/shipper/dashboard', icon: LayoutDashboard },
    { name: 'Book', path: '/shipper/create-shipment', icon: PlusCircle, isHighlight: true },
    { name: 'Shipments', path: '/shipper/shipments', icon: Package },
    { name: 'Invoices', path: '/shipper/invoices', icon: FileText },
  ];

  const driverTabs = [
    { name: 'Terminal', path: '/driver/dashboard', icon: LayoutDashboard },
    { name: 'Trips', path: '/driver/trips', icon: Truck },
    { name: 'Docs', path: '/driver/documents', icon: FileCheck },
  ];

  const currentTabs = isAdminOrEmployee ? adminTabs : isPartner ? partnerTabs : isDriver ? driverTabs : shipperTabs;

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 z-40 px-2 py-1.5 pb-safe shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around">
        {currentTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all relative ${
                  isActive
                    ? 'text-brand-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {tab.isHighlight ? (
                    <div className="p-2 -mt-5 bg-gradient-to-tr from-brand-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-brand-600/40 border-2 border-slate-950">
                      <Icon className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-brand-500/10' : ''}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  )}
                  <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'text-brand-300 font-bold' : 'text-slate-400 font-medium'}`}>
                    {tab.name}
                  </span>
                  {isActive && !tab.isHighlight && (
                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full mt-0.5" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        {/* Full Menu Drawer Trigger */}
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-2xl text-slate-400 hover:text-white transition-colors"
        >
          <div className="p-1">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight font-medium text-slate-400 mt-0.5">
            Menu
          </span>
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNav;
