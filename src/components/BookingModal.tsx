import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, Users, Mail, Phone, Info } from 'lucide-react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, addDays, differenceInCalendarDays } from 'date-fns';
import 'react-day-picker/dist/style.css';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2026, 4, 16),
    to: addDays(new Date(2026, 4, 16), 3),
  });

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

  const totalGuests = guests.adults + guests.children;
  const pricePerNight = 3100;
  
  const nights = range?.from && range?.to 
    ? differenceInCalendarDays(range.to, range.from) 
    : 0;
  
  const totalAmount = nights * pricePerNight;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const disabledDays = [
    { before: today },
    { from: new Date(2026, 4, 1), to: new Date(2026, 4, 15) },
  ];

  const hiddenDays = { before: today };

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
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5 text-stone-500" />
            </button>

            {/* Left Side: Info & Hero Image */}
            <div className="hidden lg:block lg:w-1/3 relative bg-stone-100">
              <img 
                src="https://lh3.googleusercontent.com/aida/ADBb0uhSbpgiJ1xfRVN3Lz8MCmkhVVNylX1cL-jByrRWafl7ngRiF6AETvBrljpqbJJX2E5DEvScBaruojpkmmZlj6ajrMqW-jpp_29MNezvab0DAa24JPQM7mQzQsNhUPnxYJI_3jbXsMvKqT7fNJPJP_vU4Q3goc-wgE0GtSEhPLifS8KFr5CczuBAktCs_HO-SQJQ0tU8TMRq3OKXbgcjKBGTs3KPd1bLfm_4_08uKsh_5JLrLVFnSpyQCsrIo1XPjY2HzLNV81Wf"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                alt="Retreat main"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-white text-2xl font-serif italic mb-2">The Sanctuary</h3>
                <p className="text-white/80 text-sm mb-6">Experience the art of stillness.</p>
                
                <div className="space-y-3 pt-6 border-t border-white/20">
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
              </div>
            </div>

            {/* Right Side: Booking Controls */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto max-h-[90vh]">
              <header className="mb-6">
                <h2 className="text-3xl font-serif mb-2 text-stone-800">Complete Your Request</h2>
                <p className="text-stone-500 text-sm">Fine-tune your stay and provide contact details.</p>
              </header>

              <div className="space-y-6">
                {/* Date Picker Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">Select Dates</label>
                    {nights > 0 && <span className="text-[10px] bg-accent/10 text-accent px-2 py-1 rounded font-bold uppercase tracking-wider">{nights} Night{nights > 1 ? 's' : ''}</span>}
                  </div>
                  <div className="booking-calendar p-2 border border-stone-100 rounded-xl bg-stone-50/50">
                    <style>{`
                      .rdp-day_disabled {
                        text-decoration: line-through !important;
                        opacity: 0.4 !important;
                        color: #A8A29E !important;
                        cursor: not-allowed !important;
                        background-color: transparent !important;
                      }
                      .rdp-day_disabled.rdp-day_selected {
                        background-color: transparent !important;
                        color: #A8A29E !important;
                      }
                      .rdp-nav_button_previous[disabled],
                      .rdp-nav_button_previous:disabled {
                        display: none !important;
                      }
                      .rdp-day_hidden {
                        visibility: hidden !important;
                      }
                    `}</style>
                    <DayPicker
                      mode="range"
                      selected={range}
                      onSelect={setRange}
                      disabled={disabledDays}
                      hidden={hiddenDays}
                      fromDate={today}
                      numberOfMonths={2}
                      className="mx-auto"
                      modifiersStyles={{
                        disabled: { 
                          textDecoration: 'line-through',
                        }
                      }}
                      styles={{
                        caption: { color: '#8A4630', fontFamily: 'serif', fontStyle: 'italic' },
                        head_cell: { color: '#A8A29E', fontWeight: 'normal', fontSize: '0.75rem' },
                        day_selected: { backgroundColor: '#8A4630', color: 'white' },
                        day_today: { color: '#8A4630', fontWeight: 'bold' }
                      }}
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
                <button 
                  onClick={() => alert(`Request received for ${contact.email || 'guest'}. Total: ₹${totalAmount.toLocaleString()}`)}
                  disabled={!contact.email || !contact.phone || nights === 0}
                  className="w-full md:w-auto px-12 py-4 bg-accent text-white rounded-full font-serif italic text-lg hover:bg-[#723a28] transition-all shadow-lg active:scale-95 disabled:bg-stone-300 disabled:shadow-none"
                >
                  Send Booking Request
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
