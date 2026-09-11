import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Send, MessageSquare, ShieldCheck, User, Truck, Clock } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ShipmentChatModal = ({ isOpen, onClose, shipmentId, shipmentNumber }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    if (!shipmentId) return;
    try {
      const res = await api.get(`/chat/shipment/${shipmentId}`);
      setMessages(res.data || []);
    } catch (err) {
      console.error('Failed to load chat messages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && shipmentId) {
      setLoading(true);
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, shipmentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      await api.post(`/chat/shipment/${shipmentId}`, { message: text.trim() });
      setText('');
      fetchMessages();
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[560px] overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-500/10 text-brand-400 rounded-xl border border-brand-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Order Chat • {shipmentNumber || `#${shipmentId}`}
              </h3>
              <p className="text-[11px] text-slate-400">Direct operations thread with CargoConnect Team & Partner</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
          {loading && messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              Loading message thread...
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
              <MessageSquare className="w-8 h-8 stroke-1 text-slate-600" />
              <p className="text-xs">No messages yet. Send a note to discuss quotation, loading instructions, or ETA.</p>
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.senderName === user?.username || (user?.role === 'ROLE_ADMIN' && m.senderRole?.includes('ADMIN'));
              const isAdmin = m.senderRole?.includes('ADMIN') || m.senderRole?.includes('EMPLOYEE');
              const isPartner = m.senderRole?.includes('PARTNER');

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      {isAdmin && <ShieldCheck className="w-3 h-3 text-brand-400" />}
                      {isPartner && <Truck className="w-3 h-3 text-amber-400" />}
                      {!isAdmin && !isPartner && <User className="w-3 h-3 text-emerald-400" />}
                      {m.senderName || 'Operations'}
                    </span>
                    <span className="text-[9px] text-slate-500">
                      {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                      isMe
                        ? 'bg-brand-600 text-white rounded-tr-none'
                        : isAdmin
                        ? 'bg-slate-800 text-slate-200 border border-brand-500/20 rounded-tl-none'
                        : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                    }`}
                  >
                    {m.message}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
          <input
            type="text"
            placeholder="Type your message here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-brand-600/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ShipmentChatModal;
