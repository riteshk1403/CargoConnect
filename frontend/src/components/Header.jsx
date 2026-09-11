import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Phone, Check, Menu, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CallTeamModal from './CallTeamModal';
import NotificationSoundControl from './NotificationSoundControl';
import { processIncomingNotifications } from '../utils/notificationSound';
import api from '../utils/api';

const Header = ({ title, onToggleMenu }) => {
  const { user } = useAuth();
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      const list = res.data || [];
      setNotifications(list);
      setUnreadCount(list.filter((n) => !n.readStatus).length);
      processIncomingNotifications(list);
    } catch (err) {
      // Ignore background notification fetch errors
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // 15s poll
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readStatus: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 text-slate-300 sticky top-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={onToggleMenu}
            className="md:hidden p-2 -ml-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* Call CargoConnect Team Button */}
          <button
            onClick={() => setIsCallModalOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-brand-600/20 transition-all active:scale-95"
          >
            <Phone className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">Call Support</span>
            <span className="sm:hidden">Help</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl relative transition-colors"
              aria-label="View Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 text-slate-200"
                >
                  <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Notifications ({unreadCount} new)
                    </span>
                    <button
                      onClick={() => setIsNotifOpen(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Close
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 text-xs">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-500">
                        No notifications to display.
                      </div>
                    ) : (
                      notifications.slice(0, 8).map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 transition-colors ${
                            !n.readStatus ? 'bg-brand-950/30' : 'bg-transparent'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-0.5">
                              <p className="font-semibold text-white">{n.title}</p>
                              <p className="text-slate-400 text-[11px] leading-relaxed">
                                {n.message}
                              </p>
                              <span className="text-[9px] text-slate-500 block pt-1">
                                {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                              </span>
                            </div>
                            {!n.readStatus && (
                              <button
                                onClick={() => markAsRead(n.id)}
                                title="Mark as read"
                                className="text-slate-500 hover:text-emerald-400 p-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notification Sound Control (Ringtone Settings) */}
          <NotificationSoundControl />

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2.5 sm:pl-2 sm:border-l sm:border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-brand-400 font-bold uppercase tracking-wider">
                {user?.role?.replace('ROLE_', '')}
              </p>
              <p className="text-xs text-white font-medium truncate max-w-[120px]">{user?.username}</p>
            </div>
            <div className="h-8 w-8 bg-gradient-to-tr from-brand-600 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-white text-xs shadow-md">
              {user?.username?.substring(0, 1).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Support Desk Modal */}
      <CallTeamModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
      />
    </>
  );
};

export default Header;
