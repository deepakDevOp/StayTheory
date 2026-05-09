import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, Users, Mail, Phone, Info, Home, ChevronDown, Check } from 'lucide-react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, addDays, differenceInCalendarDays } from 'date-fns';
import 'react-day-picker/dist/style.css';
import { publicService } from '../services/publicService';

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
  const [loading, setLoading] = useState(false);

  const [range, setRange] = useState<DateRange | undefined>(undefined);

  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    infants: 0,
  });

  const [contact, setContact] = useState({
    email: '',
    phone: '',
  });

  const [showGuestPicker, setShowGuestPicker] = useState(false);

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
      setShowGuestPicker(false);
      setContact({ email: '', phone: '' });
      setRange(undefined);
    }
  }, [isOpen]);

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);
  const pricePerNight = selectedProperty ? selectedProperty.base_nightly_rate : 0;

  const totalGuests = guests.adults + guests.children;
  
  const nights = range?.from && range?.to 
    ? differenceInCalendarDays(range.to, range.from) 
    : 0;
  
  const totalAmount = nights * pricePerNight;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const updateGuest = (type: keyof typeof guests, delta: number) => {
    setGuests((prev) => ({
      ...prev,
      [type]: Math.max(type === 'adults' ? 1 : 0, prev[type] + delta),
    }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContact(prev => ({ ...prev, [name]: value }));
  };

  const handleBooking = async () => {
    if (!range?.from || !range?.to || !selectedPropertyId) return;
    setLoading(true);
    try {
      await publicService.createBooking({
        property_id: selectedPropertyId,
        check_in: format(range.from, 'yyyy-MM-dd'),
        check_out: format(range.to, 'yyyy-MM-dd'),
        guests: totalGuests,
        email: contact.email,
        phone: contact.phone
      });
      alert("Sanctuary request sent successfully!");
      onClose();
    } catch (err) {
      console.error("Failed to create booking from modal:", err);
      alert("Failed to send request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
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
            <div className="flex-1 p-6 md:p-10 overflow-y-auto max-h-[90vh]">
              <header className="mb-6 relative">
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
                            src={selectedProperty.images?.[0]?.url || selectedProperty.coverImage || ""} 
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
                                 <img src={prop.images?.[0]?.url || prop.coverImage || ""} className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover shadow-sm" />
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
                  <div className="booking-calendar p-2 md:p-4 border border-stone-100 rounded-xl bg-stone-50/50 flex justify-center">
                    <style>{`
                      .rdp-day_disabled {
                        text-decoration: line-through !important;
                        opacity: 0.4 !important;
                        color: #A8A29E !important;
                        cursor: not-allowed !important;
                        background-color: transparent !important;
                        border-radius: 0 !important;
                      }
                      .rdp-day_selected {
                        background-color: #8A4630 !important;
                        color: white !important;
                      }
                      .rdp-nav_button_previous[disabled],
                      .rdp-nav_button_previous:disabled {
                        display: none !important;
                      }
                      .rdp-day_hidden {
                        visibility: hidden !important;
                      }
                      .rdp-months {
                        justify-content: center;
                      }
                      .booking-calendar .rdp {
                        margin: 0;
                        width: 100%;
                        display: flex;
                        justify-content: center;
                      }
                      .booking-calendar {
                        --rdp-cell-size: 48px;
                        --rdp-accent-color: #8A4630;
                        --rdp-background-color: #F5F5F4;
                      }
                      @media (max-width: 768px) {
                        .booking-calendar {
                          --rdp-cell-size: 38px;
                        }
                      }
                    `}</style>
                    <DayPicker
                      mode="range"
                      selected={range}
                      onSelect={(newRange) => {
                        if (!newRange) {
                          setRange(undefined);
                          return;
                        }

                        // Prevent starting a stay on a blocked date
                        if (newRange.from && blockedDates.some(bd => bd.getTime() === newRange.from!.getTime())) {
                          return;
                        }

                        if (newRange.from && newRange.to) {
                          // Check if any date BETWEEN from and to is blocked
                          const isMidRangeBlocked = blockedDates.some(bd => {
                            const date = bd.getTime();
                            return date >= newRange.from!.getTime() && date < newRange.to!.getTime();
                          });
                          
                          if (isMidRangeBlocked) {
                            setRange({ from: newRange.from, to: undefined });
                            return;
                          }
                        }
                        setRange(newRange);
                      }}
                      disabled={[{ before: today }]}
                      modifiers={{
                        blocked: blockedDates
                      }}
                      modifiersStyles={{
                        blocked: { 
                          textDecoration: 'line-through',
                          textDecorationColor: '#8A4630',
                          textDecorationThickness: '2px'
                        }
                      }}
                      fromDate={today}
                      numberOfMonths={1}
                    />
                  </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Guests Section */}
                  <div className="space-y-3 relative">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">Guests</label>
                    <button 
                      onClick={() => setShowGuestPicker(!showGuestPicker)}
                      className="w-full p-3.5 flex items-center justify-between border border-stone-200 rounded-xl hover:border-accent/40 transition-colors bg-white shadow-sm text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-accent" />
                        <span className="text-stone-700">{totalGuests} Guest{totalGuests !== 1 ? 's' : ''}</span>
                      </div>
                      <Plus className={`w-3.5 h-3.5 text-stone-400 transition-transform ${showGuestPicker ? 'rotate-45' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {showGuestPicker && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowGuestPicker(false)} 
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-full left-0 w-full mb-3 bg-white border border-stone-200 rounded-xl shadow-xl p-4 z-20"
                          >
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-stone-800">Adults</p>
                                  <p className="text-[10px] text-stone-400">13+</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <button onClick={(e) => { e.stopPropagation(); updateGuest('adults', -1); }} className="p-1.5 border border-stone-100 rounded-full hover:bg-stone-50 disabled:opacity-30" disabled={guests.adults <= 1}><Minus className="w-3.5 h-3.5" /></button>
                                  <span className="w-4 text-center text-sm">{guests.adults}</span>
                                  <button onClick={(e) => { e.stopPropagation(); updateGuest('adults', 1); }} className="p-1.5 border border-stone-100 rounded-full hover:bg-stone-50"><Plus className="w-3.5 h-3.5" /></button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-stone-800">Children</p>
                                  <p className="text-[10px] text-stone-400">2–12</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <button onClick={(e) => { e.stopPropagation(); updateGuest('children', -1); }} className="p-1.5 border border-stone-100 rounded-full hover:bg-stone-50 disabled:opacity-30" disabled={guests.children <= 0}><Minus className="w-3.5 h-3.5" /></button>
                                  <span className="w-4 text-center text-sm">{guests.children}</span>
                                  <button onClick={(e) => { e.stopPropagation(); updateGuest('children', 1); }} className="p-1.5 border border-stone-100 rounded-full hover:bg-stone-50"><Plus className="w-3.5 h-3.5" /></button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Contact Section */}
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">Contact Info</label>
                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                        <input 
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          value={contact.email}
                          onChange={handleContactChange}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-1 focus:ring-accent focus:border-accent outline-none text-sm transition-all shadow-sm"
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                        <input 
                          type="tel"
                          name="phone"
                          placeholder="Phone Number"
                          value={contact.phone}
                          onChange={handleContactChange}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-1 focus:ring-accent focus:border-accent outline-none text-sm transition-all shadow-sm"
                        />
                      </div>
                    </div>
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
                {selectedProperty?.airbnb_url ? (
                  <button 
                    onClick={() => onRedirect?.(selectedProperty)}
                    className="w-full md:w-auto px-12 py-4 bg-primary text-white rounded-full font-serif italic text-lg hover:opacity-90 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3"
                  >
                    Book on Airbnb
                  </button>
                ) : (
                  <button 
                    onClick={() => alert(`Booking Request for ${selectedProperty?.title || 'Unknown'}\nGuest: ${contact.email || 'N/A'}\nTotal: ₹${totalAmount.toLocaleString()}`)}
                    disabled={!contact.email || !contact.phone || nights === 0 || !selectedProperty}
                    className="w-full md:w-auto px-12 py-4 bg-accent text-white rounded-full font-serif italic text-lg hover:bg-[#723a28] transition-all shadow-lg active:scale-95 disabled:bg-stone-300 disabled:shadow-none disabled:cursor-not-allowed"
                  >
                    Send Booking Request
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
