import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Check, X } from 'lucide-react';
import api from '../utils/api';

const DriverRatingModal = ({ isOpen, onClose, shipment, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !shipment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/ratings', {
        shipmentId: shipment.id,
        rating,
        feedback: feedback.trim()
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit driver review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-slate-100"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-white">Rate Driver Experience</h3>
            <p className="text-xs text-slate-400 mt-1">Shipment {shipment.shipmentId}</p>

            {/* Star Rating Selectors */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 text-slate-600 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        active
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                          : 'text-slate-700'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="inline-block mt-2 text-xs font-semibold text-amber-400">
              {rating === 5 && 'Outstanding Service (5/5)'}
              {rating === 4 && 'Great Service (4/5)'}
              {rating === 3 && 'Average Experience (3/5)'}
              {rating === 2 && 'Below Expectations (2/5)'}
              {rating === 1 && 'Poor Experience (1/5)'}
            </span>
          </div>

          {error && (
            <div className="p-3 mb-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Written Feedback (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Share details about punctuality, cargo handling, and communication..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors"
              >
                Skip
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-brand-600/20"
              >
                <Check className="w-4 h-4" />
                {loading ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DriverRatingModal;
