import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface EditorAvailabilityProps {
  blockedDates: string[];
  onToggleDate: (dateStr: string) => void;
  onSelectRange: (dates: string[]) => void;
}

// Every date string (inclusive) between two "YYYY-MM-DD" dates, in either order.
function getDatesBetween(aStr: string, bStr: string): string[] {
  const a = new Date(aStr + "T00:00:00");
  const b = new Date(bStr + "T00:00:00");
  const start = a <= b ? a : b;
  const end = a <= b ? b : a;
  const dates: string[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    const yyyy = cur.getFullYear();
    const mm = String(cur.getMonth() + 1).padStart(2, "0");
    const dd = String(cur.getDate()).padStart(2, "0");
    dates.push(`${yyyy}-${mm}-${dd}`);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

export default function EditorAvailability({ blockedDates, onToggleDate, onSelectRange }: EditorAvailabilityProps) {
  const realCurrentDate = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  // First click sets the range anchor; a second click on a different date
  // blocks everything in between. Clicking the anchor again just toggles
  // that single day, matching the previous one-click behavior.
  const [rangeStart, setRangeStart] = useState<string | null>(null);

  const handleDayClick = (dateStr: string) => {
    if (!rangeStart) {
      setRangeStart(dateStr);
      return;
    }
    if (rangeStart === dateStr) {
      onToggleDate(dateStr);
      setRangeStart(null);
      return;
    }
    onSelectRange(getDatesBetween(rangeStart, dateStr));
    setRangeStart(null);
  };

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const isPrevDisabled = currentYear === realCurrentDate.getFullYear() && currentMonth <= realCurrentDate.getMonth();

  const handlePrevMonth = () => {
    if (isPrevDisabled) return;
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const formatDate = (d: number) => {
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${currentYear}-${mm}-${dd}`;
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" /> Channel Sync
        </h3>
        <div className="bg-amber-50 px-4 py-2 rounded-full flex items-center gap-2 border border-amber-100 shadow-sm">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <p className="text-[9px] font-bold text-amber-700 uppercase tracking-widest">
            {rangeStart ? "Now pick an end date to block the range" : "Click a start date, then an end date to block a range"}
          </p>
        </div>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-stone-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center mb-8">
          <h4 className="text-2xl md:text-3xl font-serif italic text-on-surface">
            {monthNames[currentMonth]} <span className="text-stone-300 font-sans not-italic text-xl">{currentYear}</span>
          </h4>
          <div className="flex gap-3">
            <button
              onClick={handlePrevMonth}
              disabled={isPrevDisabled}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isPrevDisabled
                ? 'bg-stone-50 text-stone-300 cursor-not-allowed'
                : 'bg-stone-100 text-stone-600 hover:bg-primary hover:text-white hover:scale-110 shadow-sm'
                }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="w-10 h-10 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center hover:bg-primary hover:text-white hover:scale-110 shadow-sm transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 md:gap-3">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="text-center text-[10px] font-bold text-stone-300 uppercase tracking-[0.2em] mb-4">
              {day}
            </div>
          ))}

          {[...Array(firstDayOfMonth)].map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const dateStr = formatDate(day);
            const isBlocked = blockedDates.includes(dateStr);
            const isRangeAnchor = rangeStart === dateStr;

            const isPast = currentYear < realCurrentDate.getFullYear() ||
              (currentYear === realCurrentDate.getFullYear() && currentMonth < realCurrentDate.getMonth()) ||
              (currentYear === realCurrentDate.getFullYear() && currentMonth === realCurrentDate.getMonth() && day < realCurrentDate.getDate());

            return (
              <button
                key={i}
                disabled={isPast}
                onClick={() => handleDayClick(dateStr)}
                className={`h-10 md:h-12 w-full rounded-2xl flex items-center justify-center text-sm font-medium transition-all duration-300 active:scale-95 ${isPast
                  ? 'text-stone-300 bg-stone-50/50 cursor-not-allowed'
                  : isRangeAnchor
                    ? 'bg-amber-400 text-white shadow-lg shadow-amber-400/40 scale-105 ring-2 ring-amber-400 ring-offset-2'
                    : isBlocked
                      ? 'bg-primary text-white shadow-lg shadow-primary/40 scale-105 ring-2 ring-primary ring-offset-2'
                      : 'bg-white text-stone-600 border-2 border-stone-100 hover:border-primary/30 hover:bg-stone-50 hover:-translate-y-1'
                  }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
