import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, Home, ChevronDown, Check } from 'lucide-react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, differenceInCalendarDays } from 'date-fns';
import 'react-day-picker/style.css';
import { publicService } from '../services/publicService';
import { optimizeImageUrl } from '../utils/preload';

const availableProperties = [
  {
    id: "tuscan",
    title: "The Tuscan Retreat",
    subtitle: "Experience the art of stillness.",
    price: 3100,
    image: "https://lh3.googleusercontent.com/aida/ADBb0uhSbpgiJ1xfRVN3Lz8MCmkhVVNylX1cL-jByrRWafl7ngRiF6AETvBrljpqbJJX2E5DEvScBaruojpkmmZlj6ajrMqW-jpp_29MNezvab0DAa24JPQM7mQzQsNhUPnxYJI_3jbXsMvKqT7fNJPJP_vU4Q3goc-wgE0GtSEhPLifS8KFr5CczuBAktCs_HO-SQJQ0tU8TMRq3OKXbgcjKBGTs3KPd1bLfm_4_08uKsh_5JLrLVFnSpyQCsrIo1XPjY2HzLNV81Wf"
  },
  {
    id: "ocean",
    title: "Ocean Sanctuary",
    subtitle: "Where the rhythm of waves sets the pace.",
    price: 4200,
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1920&q=80"
  },
  {
    id: "forest",
    title: "Forest Cabin",
    subtitle: "Immerse yourself in ancient wisdom.",
    price: 2800,
    image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1920&q=80"
  },
  {
    id: "desert",
    title: "Desert Oasis",
    subtitle: "Find clarity in the vast expanse.",
    price: 3500,
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1920&q=80"
  }
];

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRedirect?: (property: any) => void;
}

export default function BookingModal({ isOpen, onClose, onRedirect }: BookingModalProps) {
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);

  const [range, setRange] = useState<DateRange | undefined>(undefined);

  // Fetch properties on mount
  useEffect(() => {
    const fetchProps = async () => {
      try {
        const data = await publicService.getProperties();
        setProperties(data);
      } catch (err) {
        console.error("Failed to fetch properties for modal:", err);
      }
    };
    fetchProps();
  }, []);

  // Update blocked dates when property changes
  useEffect(() => {
    if (selectedPropertyId) {
      const prop = properties.find(p => p.id === selectedPropertyId);
      if (prop && prop.availability) {
        const blocked = prop.availability.map((a: any) => {
          const d = typeof a.date === 'string' ? new Date(a.date) : new Date(a.date);
          d.setHours(0, 0, 0, 0);
          return d;
        });
        setBlockedDates(blocked);
      } else {
        setBlockedDates([]);
      }
    } else {
      setBlockedDates([]);
    }
  }, [selectedPropertyId, properties]);

  // Clear form state when the modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedPropertyId(null);
      setIsPropertyDropdownOpen(false);
      setRange(undefined);
    }
  }, [isOpen]);

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);
  const pricePerNight = selectedProperty ? selectedProperty.base_nightly_rate : 0;

  const nights = range?.from && range?.to 
    ? differenceInCalendarDays(range.to, range.from) 
    : 0;
  
  const totalAmount = nights * pricePerNight;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/80"
          />

          {/* Close Button - Fixed to screen corner to prevent clipping */}
          <button 
            onClick={onClose}
            className="fixed top-6 right-6 md:top-10 md:right-10 p-3 bg-white text-stone-900 hover:bg-primary hover:text-white rounded-full transition-all z-[2000] shadow-2xl flex items-center justify-center group"
            title="Close"
          >
            <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
          </button>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-white w-full max-w-4xl rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92dvh] sm:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Left Side: Info & Hero Image */}
            <div className="hidden lg:block lg:w-1/3 relative bg-stone-100 overflow-hidden">
              <AnimatePresence mode="wait">
                {selectedProperty ? (
                  <motion.img 
                    key={selectedProperty.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    src={selectedProperty.images?.[0]?.url || selectedProperty.coverImage || ""}
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    alt={selectedProperty.title}
                  />
                ) : (
                  <motion.img 
                    key="template"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80"
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-60"
                    referrerPolicy="no-referrer"
                    alt="Select a sanctuary"
                  />
                )}
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/30 to-transparent flex flex-col justify-end p-8 z-10 pointer-events-none">
                <AnimatePresence mode="wait">
                  {selectedProperty ? (
                    <motion.div
                      key={`text-${selectedProperty.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-white text-3xl font-serif italic mb-2 leading-tight">{selectedProperty.title}</h3>
                      <p className="text-white/80 text-sm mb-6 leading-relaxed">{selectedProperty.subtitle}</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="text-template"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-white text-3xl font-serif italic mb-2 leading-tight drop-shadow-md">Choose Your Escape</h3>
                      <p className="text-white/80 text-sm mb-6 leading-relaxed drop-shadow-sm">Please select a sanctuary from the menu to view availability and specific rates.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {selectedProperty && (
                  <div className="space-y-3 pt-6 border-t border-white/20 pointer-events-auto">
                    <div className="flex justify-between text-white/70 text-xs">
                      <span>Rate</span>
                      <span>₹{pricePerNight.toLocaleString()} / night</span>
                    </div>
                    {nights > 0 && (
                      <>
                        <div className="flex justify-between text-white/90 text-sm font-medium">
                          <span>Total for {nights} night{nights > 1 ? 's' : ''}</span>
                          <span>₹{totalAmount.toLocaleString()}</span>
                        </div>
                        <p className="text-[10px] text-white/50 italic">* Taxes & fees included</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Booking Controls */}
            <div className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto">
              {/* Drag handle — visible on mobile as bottom sheet affordance */}
              <div className="sm:hidden w-10 h-1 bg-stone-200 rounded-full mx-auto mb-4" />
              <header className="mb-5 relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Direct booking coming soon</span>
                </div>
                <h2 className="text-3xl font-serif mb-2 text-stone-800 italic">Complete Your Request</h2>
                <p className="text-stone-500 text-sm">Fine-tune your stay and provide contact details.</p>
              </header>

              <div className="space-y-6">
                {/* Property Selection */}
                <div className="space-y-3 relative">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">Select Sanctuary</label>
                  <div className="relative">
                    <button 
                      onClick={() => setIsPropertyDropdownOpen(!isPropertyDropdownOpen)}
                      className={`w-full p-3 bg-white border ${!selectedProperty ? 'border-accent/50 ring-1 ring-accent/30' : 'border-stone-200'} rounded-xl focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all shadow-sm flex items-center justify-between hover:border-accent/40 relative z-20`}
                    >
                      {selectedProperty ? (
                        <div className="flex items-center gap-4">
                          <img
                            src={optimizeImageUrl(selectedProperty.images?.[0]?.url || selectedProperty.coverImage || "", 96)}
                            alt={selectedProperty.title}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover shadow-sm"
                          />
                          <div className="text-left">
                            <div className="font-serif italic font-medium text-stone-800 text-base md:text-lg">{selectedProperty.title}</div>
                            <div className="text-[10px] md:text-xs text-stone-500 tracking-wide">₹{(selectedProperty.base_nightly_rate || 0).toLocaleString()} / night</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 py-2 pl-2">
                           <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
                             <Home className="w-4 h-4 text-stone-400" />
                           </div>
                           <div className="text-left">
                             <div className="font-medium text-stone-800 text-base">Select a property...</div>
                             <div className="text-[10px] text-accent tracking-wide uppercase font-semibold">Required for booking</div>
                           </div>
                        </div>
                      )}
                      <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform ${isPropertyDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isPropertyDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsPropertyDropdownOpen(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 w-full mt-2 bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden z-30 p-1"
                          >
                            {properties.map(prop => (
                              <button
                                key={prop.id}
                                onClick={() => {
                                  setSelectedPropertyId(prop.id);
                                  setIsPropertyDropdownOpen(false);
                                }}
                                className={`w-full p-3 flex items-center gap-4 rounded-lg hover:bg-stone-50 transition-colors ${selectedPropertyId === prop.id ? 'bg-stone-50' : ''}`}
                              >
                                 <img src={optimizeImageUrl(prop.images?.[0]?.url || prop.coverImage || "", 96)} loading="lazy" className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover shadow-sm" />
                                 <div className="text-left flex-1">
                                   <div className={`font-serif italic text-sm md:text-base ${selectedPropertyId === prop.id ? 'text-accent font-semibold' : 'text-stone-800'}`}>{prop.title}</div>
                                   <div className="text-[10px] md:text-xs text-stone-500 tracking-wide">₹{(prop.base_nightly_rate || 0).toLocaleString()} / night</div>
                                 </div>
                                {selectedPropertyId === prop.id && <Check className="w-5 h-5 text-accent" />}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Date Picker Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">Select Dates</label>
                    {nights > 0 && <span className="text-[10px] bg-accent/10 text-accent px-2 py-1 rounded font-bold uppercase tracking-wider">{nights} Night{nights > 1 ? 's' : ''}</span>}
                  </div>
                  <div className="booking-calendar px-1">
                    <style>{`
                      .booking-calendar .rdp-months { max-width: 100%; width: 100%; }
                      .booking-calendar .rdp-month  { width: 100%; }
                      .booking-calendar .rdp-month_grid { width: 100%; table-layout: fixed; border-collapse: separate; border-spacing: 0 2px; }
                      .booking-calendar .rdp-day { width: auto; }
                      .booking-calendar .rdp-month_caption { padding: 0 0 8px 0; }
                      .booking-calendar .rdp-caption_label { font-family: "Noto Serif", serif; font-style: italic; font-size: 16px; font-weight: 500; color: #1e1b18; letter-spacing: -0.01em; }
                      .booking-calendar .rdp-nav { gap: 6px; }
                      .booking-calendar .rdp-button_previous,
                      .booking-calendar .rdp-button_next { width: 26px; height: 26px; border-radius: 50%; border: none; background: transparent; display: flex; align-items: center; justify-content: center; transition: background 0.15s, transform 0.1s; cursor: pointer; }
                      .booking-calendar .rdp-button_previous:hover,
                      .booking-calendar .rdp-button_next:hover { background: #f0e4df; transform: scale(1.1); }
                      .booking-calendar .rdp-button_previous .rdp-chevron { fill: #8A4630; width: 14px; height: 14px; }
                      .booking-calendar .rdp-button_next .rdp-chevron { fill: #8A4630; width: 14px; height: 14px; }
                      .booking-calendar .rdp-weekday { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #c4b0a8; padding: 6px 0; }
                      .booking-calendar .rdp-day_button { font-size: 12px; font-weight: 500; border-radius: 50%; transition: background 0.12s, color 0.12s, transform 0.1s; }
                      .booking-calendar .rdp-day_button:hover:not(:disabled) { background: #f0e4df; color: #8A4630; transform: scale(1.05); }
                      .booking-calendar .rdp-day_range_start .rdp-day_button,
                      .booking-calendar .rdp-day_range_end .rdp-day_button { background: #8A4630 !important; color: white !important; box-shadow: 0 2px 8px rgba(138,70,48,0.35); }
                      .booking-calendar .rdp-day_range_middle .rdp-day_button { border-radius: 0; }
                      .booking-calendar .rdp-day_today:not(.rdp-day_range_start):not(.rdp-day_range_end) .rdp-day_button { font-weight: 800; color: #8A4630; text-decoration: underline; text-underline-offset: 3px; }
                      .booking-calendar .rdp-day_blocked .rdp-day_button { opacity: 0.25; text-decoration: line-through; cursor: not-allowed; }
                      .booking-calendar .rdp-day_blocked .rdp-day_button:hover { background: none !important; transform: none; color: inherit; }
                      .booking-calendar .rdp-day_outside .rdp-day_button { opacity: 0.2; }

                      /* ── Dark mode ── */
                      html.dark .booking-calendar { --rdp-accent-background-color: rgba(208,112,80,0.09); }
                      html.dark .booking-calendar .rdp-caption_label { color: #f0e8e3; }
                      html.dark .booking-calendar .rdp-weekday { color: #5a4e48; }
                      html.dark .booking-calendar .rdp-day_button { color: #e4dcd6; }
                      html.dark .booking-calendar .rdp-button_previous:hover,
                      html.dark .booking-calendar .rdp-button_next:hover { background: rgba(208,112,80,0.15); }
                      html.dark .booking-calendar .rdp-button_previous .rdp-chevron,
                      html.dark .booking-calendar .rdp-button_next .rdp-chevron { fill: #d07050; }
                      html.dark .booking-calendar .rdp-day_button:hover:not(:disabled) { background: rgba(208,112,80,0.18); color: #d07050; }
                      html.dark .booking-calendar .rdp-day_range_start .rdp-day_button,
                      html.dark .booking-calendar .rdp-day_range_end .rdp-day_button { background: #d07050 !important; box-shadow: 0 2px 10px rgba(208,112,80,0.4); }
                      html.dark .booking-calendar .rdp-day_today:not(.rdp-day_range_start):not(.rdp-day_range_end) .rdp-day_button { color: #d07050; }
                      html.dark .booking-calendar .rdp-day_outside .rdp-day_button { opacity: 0.12; }
                    `}</style>
                    <DayPicker
                      mode="range"
                      selected={range}
                      onSelect={(newRange) => {
                        if (!newRange) { setRange(undefined); return; }
                        if (newRange.from && blockedDates.some(bd => bd.getTime() === newRange.from!.getTime())) return;
                        if (newRange.from && newRange.to) {
                          const isMidRangeBlocked = blockedDates.some(bd => {
                            const date = bd.getTime();
                            return date >= newRange.from!.getTime() && date < newRange.to!.getTime();
                          });
                          if (isMidRangeBlocked) { setRange({ from: newRange.from, to: undefined }); return; }
                        }
                        setRange(newRange);
                      }}
                      disabled={[{ before: today }]}
                      modifiers={{ blocked: blockedDates }}
                      modifiersClassNames={{ blocked: "rdp-day_blocked" }}
                      numberOfMonths={1}
                      style={{
                        "--rdp-accent-color": "#8A4630",
                        "--rdp-accent-background-color": "rgba(138,70,48,0.07)",
                        "--rdp-today-color": "#8A4630",
                        "--rdp-range_middle-color": "#8A4630",
                        "--rdp-range_middle-background-color": "rgba(138,70,48,0.07)",
                        "--rdp-day-height": "36px",
                        "--rdp-day-width": "36px",
                        "--rdp-day_button-height": "34px",
                        "--rdp-day_button-width": "34px",
                        "--rdp-day_button-border-radius": "50%",
                        "--rdp-weekday-padding": "4px 0",
                        "--rdp-outside-opacity": "0.2",
                        "--rdp-disabled-opacity": "0.25",
                        width: "100%",
                        fontSize: "13px",
                      } as React.CSSProperties}
                    />
                  </div>
                </div>



                {/* Price Breakdown */}
                <AnimatePresence mode="wait">
                  {nights > 0 && (
                    <motion.div 
                      key="price-breakdown"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 bg-accent/5 rounded-2xl border border-accent/10 space-y-3">
                        <div className="flex justify-between items-center text-[10px] text-accent uppercase tracking-widest font-bold">
                          <span>Reservation Details</span>
                          <Info className="w-3 h-3" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-stone-600">Price per night</span>
                            <span className="text-sm font-medium text-stone-900 font-serif italic">₹{pricePerNight.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-stone-600">Duration</span>
                            <span className="text-sm font-medium text-stone-900">{nights} night{nights > 1 ? 's' : ''}</span>
                          </div>
                          
                          <div className="pt-2 border-t border-accent/10 flex justify-between items-end">
                            <div className="text-xs text-accent font-bold uppercase tracking-wider">
                              ₹{pricePerNight.toLocaleString()} × {nights}
                            </div>
                            <div className="text-xl font-serif italic text-accent leading-none">
                              ₹{totalAmount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-1">Total Stay Value</p>
                  <p className="text-2xl font-serif italic text-accent tracking-tight">₹{totalAmount.toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => onRedirect?.(selectedProperty)}
                  disabled={!selectedProperty || nights === 0}
                  className="w-full md:w-auto px-12 py-4 bg-primary text-white rounded-full font-serif italic text-lg hover:opacity-90 transition-all shadow-lg active:scale-95 disabled:bg-stone-300 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  Book on Airbnb
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
