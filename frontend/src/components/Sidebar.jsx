import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  UserCheck, 
  Package, 
  CreditCard, 
  AlertCircle, 
  Activity, 
  FileCheck2, 
  MapPin, 
  LogOut, 
  ClipboardList, 
  FileText, 
  PlusCircle, 
  FileCheck,
  Shield,
  Phone,
  PhoneCall,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const isRole = (role) => user?.role === role;
  const isAdminOrEmployee = isRole('ROLE_ADMIN') || isRole('ROLE_EMPLOYEE');
  const isPartner = isRole('ROLE_CARGO_PARTNER');
  const isShipper = isRole('ROLE_SHIPPER') || isRole('ROLE_CUSTOMER');
  const isDriver = isRole('ROLE_DRIVER');

  const adminNav = [
    { name: 'Analytics & KPIs', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Dispatch Marketplace', path: '/admin/dispatch', icon: MapPin },
    { name: 'Support Settings', path: '/admin/support', icon: Phone },
    { name: 'Customer Callbacks', path: '/admin/call-requests', icon: PhoneCall },
    { name: 'Document Compliance', path: '/admin/documents', icon: FileCheck2 },
    { name: 'Fleet Vehicles', path: '/admin/fleet', icon: Truck },
    { name: 'Driver Registry', path: '/admin/drivers', icon: UserCheck },
    { name: 'Customer Accounts', path: '/admin/customers', icon: Users },
    { name: 'All Shipments', path: '/admin/shipments', icon: Package },
    { name: 'Complaints & Support', path: '/admin/complaints', icon: AlertCircle },
    { name: 'Payments & Revenue', path: '/admin/payments', icon: CreditCard },
    { name: 'System Audit Logs', path: '/admin/audit-logs', icon: ClipboardList },
    { name: 'Disruption Simulator', path: '/admin/simulator', icon: Activity },
  ];

  const partnerNav = [
    { name: 'Partner Hub & Jobs', path: '/partner/dashboard', icon: LayoutDashboard },
    { name: 'Company Fleet', path: '/partner/fleet', icon: Truck },
    { name: 'Driver Roster', path: '/partner/drivers', icon: UserCheck },
    { name: 'Invoices & Payouts', path: '/shipper/invoices', icon: FileText },
  ];

  const shipperNav = [
    { name: 'Shipper Portal', path: '/shipper/dashboard', icon: LayoutDashboard },
    { name: 'Book Consignment', path: '/shipper/create-shipment', icon: PlusCircle },
    { name: 'Consignment Registry', path: '/shipper/shipments', icon: Package },
    { name: 'Billing Invoices', path: '/shipper/invoices', icon: FileText },
    { name: 'Support Tickets', path: '/shipper/complaints', icon: AlertCircle },
  ];

  const driverNav = [
    { name: 'Driver Terminal', path: '/driver/dashboard', icon: LayoutDashboard },
    { name: 'Trip Manifest', path: '/driver/trips', icon: Truck },
    { name: 'Compliance Docs', path: '/driver/documents', icon: FileCheck },
  ];

  const currentNav = isAdminOrEmployee ? adminNav : isPartner ? partnerNav : isDriver ? driverNav : shipperNav;

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full bg-slate-950">
      <div className="overflow-y-auto flex-1">
        {/* Brand Logo & Mobile Close Button */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-brand-600 to-indigo-600 rounded-xl text-white shadow-lg shadow-brand-500/20">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white leading-none">CargoConnect</h1>
              <p className="text-[10px] text-brand-400 font-bold tracking-wide uppercase mt-0.5">B2B Logistics</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="px-4 py-4">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            {isAdminOrEmployee ? 'Operations Control' : isPartner ? 'Cargo Partner Portal' : isDriver ? 'Driver Console' : 'Shipper Services'}
          </p>
          <nav className="space-y-1">
            {currentNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* User Profile & Logout Footer */}
      <div className="p-4 border-t border-slate-800/80 shrink-0 bg-slate-950">
        <div className="bg-slate-900/60 rounded-xl p-3 mb-2 flex items-center justify-between border border-slate-800/60">
          <div className="truncate">
            <p className="text-xs font-bold text-white truncate">{user?.username || 'User'}</p>
            <p className="text-[10px] text-brand-400 truncate">{user?.role?.replace('ROLE_', '')}</p>
          </div>
          <div className="p-1.5 bg-brand-500/10 text-brand-400 rounded-lg">
            <Shield className="w-3.5 h-3.5" />
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all border border-rose-500/20"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-950 border-r border-slate-800 shrink-0 h-screen sticky top-0 flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-In Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Slide-out Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative w-4/5 max-w-xs h-full border-r border-slate-800 shadow-2xl z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
