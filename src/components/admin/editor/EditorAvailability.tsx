import { AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface EditorAvailabilityProps {
  blockedDates: number[];
  onToggleDate: (day: number) => void;
}

export default function EditorAvailability({ blockedDates, onToggleDate }: EditorAvailabilityProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
      <section>
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" /> Channel Sync
          </h3>
          <div className="bg-amber-50 px-4 py-2 rounded-full flex items-center gap-2 border border-amber-100">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Interactive Calendar</p>
          </div>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-sm">
          <p className="text-stone-500 text-sm mb-8 leading-relaxed max-w-xl">
            Click on dates below to block/unblock them for external platforms. Blocked dates appear in <span className="text-primary font-bold">Terracotta</span>.
          </p>
          <div className="grid grid-cols-7 gap-4 p-8 border border-stone-50 rounded-[2rem]">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-stone-300 uppercase tracking-[0.2em] mb-4">{day}</div>
            ))}
            {[...Array(31)].map((_, i) => {
              const day = i + 1;
              const isBlocked = blockedDates.includes(day);
              return (
                <button 
                  key={i} 
                  onClick={() => onToggleDate(day)}
                  className={`aspect-square rounded-2xl flex items-center justify-center text-sm font-medium transition-all ${
                    isBlocked 
                      ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' 
                      : 'hover:bg-stone-50 text-stone-500 border border-stone-50'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
