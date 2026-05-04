import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
}

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmLabel, 
  cancelLabel 
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-10 text-center"
        >
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          
          <h3 className="text-2xl font-serif italic text-on-surface mb-3">{title}</h3>
          <p className="text-stone-500 text-sm leading-relaxed mb-8">{message}</p>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={onConfirm}
              className="w-full py-4 bg-stone-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 transition-all"
            >
              {confirmLabel}
            </button>
            <button 
              onClick={onClose}
              className="w-full py-4 bg-stone-50 text-stone-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-100 transition-all"
            >
              {cancelLabel}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
