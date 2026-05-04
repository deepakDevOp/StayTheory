import { useState, useRef, useEffect } from "react";
import { Home, Calendar, Filter, ChevronDown, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface RequestFilterBarProps {
  properties: any[];
  propertyFilter: string;
  setPropertyFilter: (val: string) => void;
  dateFilter: string;
  setDateFilter: (val: string) => void;
  resultsCount: number;
}

export default function RequestFilterBar({ 
  properties, 
  propertyFilter, 
  setPropertyFilter, 
  dateFilter, 
  setDateFilter,
  resultsCount
}: RequestFilterBarProps) {
  const [isPropOpen, setIsPropOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const propRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (propRef.current && !propRef.current.contains(event.target as Node)) setIsPropOpen(false);
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) setIsDateOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-3 mb-6 p-1.5 bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/50 shadow-xl shadow-stone-200/40 z-50 relative">
      
      {/* Custom Property Dropdown */}
      <div className="flex-grow relative" ref={propRef}>
        <div 
          onClick={() => setIsPropOpen(!isPropOpen)}
          className="flex items-center gap-3 px-6 py-3.5 bg-white rounded-[1.5rem] border border-stone-100 shadow-sm hover:border-primary/20 transition-all duration-500 cursor-pointer group"
        >
          <Home className="w-3.5 h-3.5 text-primary/60" />
          <div className="flex flex-col flex-grow">
            <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest leading-none mb-0.5">Sanctuary</span>
            <span className="text-xs font-serif italic text-on-surface">
              {propertyFilter === "all" ? "All Sanctuaries" : propertyFilter}
            </span>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-stone-300 transition-transform duration-500 ${isPropOpen ? 'rotate-180' : ''}`} />
        </div>

        <AnimatePresence>
          {isPropOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-4 bg-white border border-stone-100 rounded-[2rem] shadow-2xl overflow-hidden z-[60] p-4"
            >
              <button 
                onClick={() => { setPropertyFilter("all"); setIsPropOpen(false); }}
                className="w-full flex items-center justify-between px-6 py-4 rounded-xl hover:bg-stone-50 transition-colors"
              >
                <span className="text-sm font-medium text-stone-600">All Sanctuaries</span>
                {propertyFilter === "all" && <Check className="w-4 h-4 text-primary" />}
              </button>
              {properties.map((p) => (
                <button 
                  key={p.id}
                  onClick={() => { setPropertyFilter(p.title); setIsPropOpen(false); }}
                  className="w-full flex items-center justify-between px-6 py-4 rounded-xl hover:bg-stone-50 transition-colors"
                >
                  <span className="text-sm font-medium text-stone-600">{p.title}</span>
                  {propertyFilter === p.title && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom Date Range Filter */}
      <div className="flex-grow relative" ref={dateRef}>
        <div 
          onClick={() => setIsDateOpen(!isDateOpen)}
          className="flex items-center gap-3 px-6 py-3.5 bg-white rounded-[1.5rem] border border-stone-100 shadow-sm hover:border-primary/20 transition-all duration-500 cursor-pointer group"
        >
          <Calendar className="w-3.5 h-3.5 text-primary/60" />
          <div className="flex flex-col flex-grow">
            <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest leading-none mb-0.5">Stay Duration</span>
            <span className="text-xs font-medium text-on-surface">
              {dateFilter || "Filter by stay dates..."}
            </span>
          </div>
          {dateFilter && (
            <X 
              className="w-4 h-4 text-stone-300 hover:text-red-500 transition-colors mr-2" 
              onClick={(e) => { e.stopPropagation(); setDateFilter(""); }}
            />
          )}
          <ChevronDown className={`w-4 h-4 text-stone-300 transition-transform duration-500 ${isDateOpen ? 'rotate-180' : ''}`} />
        </div>

        <AnimatePresence>
          {isDateOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-4 bg-white border border-stone-100 rounded-[2rem] shadow-2xl overflow-hidden z-[60] p-8"
            >
              <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-6">Select Range</p>
              <div className="grid grid-cols-7 gap-2">
                {["S","M","T","W","T","F","S"].map(d => (
                  <div key={d} className="text-center text-[10px] text-stone-300 font-bold mb-2">{d}</div>
                ))}
                {[...Array(31)].map((_, i) => {
                  const day = i + 1;
                  const isRange = day >= 12 && day <= 15;
                  return (
                    <button 
                      key={i}
                      onClick={() => { setDateFilter(`June ${day} - June ${day + 3}`); setIsDateOpen(false); }}
                      className={`aspect-square rounded-xl flex items-center justify-center text-xs transition-all ${
                        isRange ? "bg-primary text-white" : "hover:bg-stone-100 text-stone-500"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Icon */}
      <div className="hidden lg:flex items-center gap-6 px-10">
        <div className="h-8 w-px bg-stone-100" />
        <div className="flex flex-col items-end min-w-[80px]">
          <div className="flex items-center gap-2 text-primary">
            <Filter className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{resultsCount} Matches</span>
          </div>
        </div>
      </div>

    </div>
  );
}
