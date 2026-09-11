import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import { motion } from 'framer-motion';

const Layout = ({ children, title }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar: Persistent on Desktop, Slide-In Drawer on Mobile */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          title={title}
          onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <motion.main
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto"
        >
          {children}
        </motion.main>

        <Footer showDetailed={false} />
      </div>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNav
        onOpenMenu={() => setIsMobileMenuOpen(true)}
      />
    </div>
  );
};

export default Layout;
