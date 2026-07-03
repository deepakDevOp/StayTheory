import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, ShieldCheck, Globe } from "lucide-react";
import api from "../services/api";

interface BookingRedirectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
}

export default function BookingRedirectionModal({ isOpen, onClose, property }: BookingRedirectionModalProps) {
  if (!isOpen || !property) return null;

  const handleContinue = () => {
    if (property.airbnb_url) {
      // Open immediately — must be synchronous to avoid popup blocker
      window.open(property.airbnb_url, "_blank", "noopener,noreferrer");
      onClose();
      // Track analytics in the background after navigation
      api.post(`/properties/analytics/track-redirect/${property.id}`).catch(() => {});
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:p-6"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 250 }}
          className="relative w-full sm:max-w-md bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl max-h-[92dvh] overflow-y-auto"
        >
          {/* Drag handle (mobile) */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-stone-200" />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="px-6 pt-4 pb-6 sm:px-8 sm:pt-6 sm:pb-8">
            {/* Label */}
            <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-primary/70 block mb-3">
              Reservation Notice
            </span>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-serif italic text-stone-800 leading-snug mb-3">
              Direct booking{" "}
              <span className="text-stone-400 not-italic">coming soon.</span>
            </h2>

            {/* Body */}
            <p className="text-stone-500 text-sm leading-relaxed mb-5">
              We're finalizing our direct reservation system. For now, book through our trusted partner{" "}
              <span className="text-primary font-semibold">Airbnb</span>.
            </p>

            {/* Trust badges — horizontal on mobile */}
            <div className="flex flex-col sm:flex-row gap-2 mb-6">
              <div className="flex items-center gap-3 flex-1 px-4 py-3 bg-stone-50 rounded-xl border border-stone-100">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-stone-700">Secure Booking</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">Airbnb's trusted payment</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-1 px-4 py-3 bg-stone-50 rounded-xl border border-stone-100">
                <Globe className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-stone-700">24/7 Support</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">Guest assistance anytime</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleContinue}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-[#723a28] active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group mb-3"
            >
              Continue to Airbnb
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            <button
              onClick={onClose}
              className="w-full text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400 hover:text-stone-600 transition-colors py-2"
            >
              Go Back
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
