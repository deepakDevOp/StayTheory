import { motion, AnimatePresence } from "motion/react";
import { X, User, Mail, Phone, Calendar, IndianRupee, CheckCircle2, XCircle } from "lucide-react";

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onConfirm: (id: any) => void;
  onCancel: (id: any) => void;
}

export default function BookingDetailModal({ 
  isOpen, onClose, booking, onConfirm, onCancel 
}: BookingDetailModalProps) {
  if (!isOpen || !booking) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8"
      >
        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-md" onClick={onClose} />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-10 py-8 border-b border-stone-100 flex justify-between items-center bg-white flex-shrink-0">
            <div>
              <h2 className="text-3xl font-serif italic text-on-surface">Request Details</h2>
              <p className="text-stone-400 text-sm mt-1">Review guest information and stay details.</p>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-stone-50 rounded-full transition-colors">
              <X className="w-6 h-6 text-stone-300" />
            </button>
          </div>

          <div className="p-10 space-y-10 overflow-y-auto flex-grow custom-scrollbar">
            {/* Guest Info Section */}
            <section>
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary mb-6">Guest Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-5 bg-stone-50 rounded-2xl border border-stone-100">
                  <User className="w-5 h-5 text-stone-300" />
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Name</p>
                    <p className="text-sm font-medium text-on-surface">{booking.guest}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-stone-50 rounded-2xl border border-stone-100">
                  <Mail className="w-5 h-5 text-stone-300" />
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Email</p>
                    <p className="text-sm font-medium text-on-surface">{booking.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-stone-50 rounded-2xl border border-stone-100 md:col-span-2">
                  <Phone className="w-5 h-5 text-stone-300" />
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Phone Number</p>
                    <p className="text-sm font-medium text-on-surface">{booking.phone}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Stay Info Section */}
            <section>
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary mb-6">Stay Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-white border border-stone-100 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Property & Dates</p>
                      <p className="text-sm font-medium text-on-surface">{booking.property} • {booking.dates}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Duration</p>
                    <p className="text-sm font-medium text-on-surface">3 Nights</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-primary/5 border border-primary/10 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <IndianRupee className="w-5 h-5 text-primary" />
                    <p className="text-sm font-bold text-primary uppercase tracking-widest">Total Estimated Price</p>
                  </div>
                  <p className="text-2xl font-serif italic text-primary">{booking.amount}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Actions Footer */}
          <div className="px-10 py-8 border-t border-stone-100 bg-white flex justify-end gap-4 flex-shrink-0">
            <button 
              onClick={() => { onCancel(booking.id); onClose(); }}
              className="flex items-center gap-2 px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-red-500 transition-all"
            >
              <XCircle className="w-4 h-4" />
              Decline
            </button>
            <button 
              onClick={() => { onConfirm(booking.id); onClose(); }}
              className="flex items-center gap-2 bg-primary text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve Booking
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
