import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, ShieldCheck, CalendarClock, Globe } from "lucide-react";
import api from "../services/api";

interface BookingRedirectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
}

export default function BookingRedirectionModal({ isOpen, onClose, property }: BookingRedirectionModalProps) {
  if (!isOpen || !property) return null;

  const handleContinue = async () => {
    if (property.airbnb_url) {
      try {
        await api.post(`/properties/analytics/track-redirect/${property.id}`);
      } catch (err) {
        console.error("Failed to log redirection analytics", err);
      }
      window.open(property.airbnb_url, '_blank');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8"
      >
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 bg-stone-900/90 backdrop-blur-xl" onClick={onClose} />

        {/* Close Button - Fixed to screen corner to prevent clipping */}
        <button 
          onClick={onClose}
          className="fixed top-6 right-6 md:top-10 md:right-10 p-3 bg-white text-stone-900 hover:bg-primary hover:text-white rounded-full transition-all z-[2000] shadow-2xl flex items-center justify-center group"
          title="Close"
        >
          <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
        </button>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col border border-stone-200"
        >
          {/* Header Accent */}
          <div className="h-2 w-full bg-primary" />

          <div className="px-10 py-12 md:px-16 md:py-16 text-center">
            {/* Icon Group */}
            <div className="flex justify-center mb-8 gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                <CalendarClock className="w-8 h-8 text-primary" />
              </div>
            </div>

            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary mb-4 block">Reservation Notice</span>
            <h2 className="text-4xl md:text-5xl font-serif italic text-on-surface mb-6 leading-tight">
              Direct booking <br /> 
              <span className="text-stone-400">coming soon.</span>
            </h2>
            
            <p className="text-stone-500 leading-relaxed mb-10 max-w-sm mx-auto font-light">
              We are currently finalizing our direct reservation system. For now, we invite you to book this sanctuary through our trusted partner, <span className="text-primary font-medium">Airbnb</span>.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              <div className="flex items-start gap-4 p-5 bg-stone-50 rounded-2xl text-left border border-stone-100">
                <ShieldCheck className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-800 mb-1">Secure Booking</h4>
                  <p className="text-[11px] text-stone-400 leading-relaxed">Protected by Airbnb's trusted payment systems.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 bg-stone-50 rounded-2xl text-left border border-stone-100">
                <Globe className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-800 mb-1">Global Support</h4>
                  <p className="text-[11px] text-stone-400 leading-relaxed">24/7 guest assistance during your entire stay.</p>
                </div>
              </div>
            </div>

            {/* Action Area */}
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleContinue}
                className="w-full bg-primary text-white py-6 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 group"
              >
                Continue to Airbnb
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <button 
                onClick={onClose}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 hover:text-stone-600 transition-colors py-2"
              >
                Go Back
              </button>
            </div>
          </div>

          {/* Bottom Branding */}
          <div className="py-6 bg-stone-50 border-t border-stone-100 flex items-center justify-center gap-4">
            <div className="w-1 h-1 bg-primary rounded-full" />
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400">Stay Theory Signature Series</span>
            <div className="w-1 h-1 bg-primary rounded-full" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
