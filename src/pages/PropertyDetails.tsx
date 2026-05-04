import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { MapPin, Star, Check, Info, ArrowLeft, Users, ChevronRight, Bed, Bath, Square } from "lucide-react";
import { propertiesData } from "../data/properties";
import { DayPicker, DateRange } from "react-day-picker";
import { addDays, differenceInCalendarDays } from "date-fns";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileNav from "../components/MobileNav";

export default function PropertyDetails({ onBookClick }: { onBookClick?: () => void }) {
  const { id } = useParams();
  const property = propertiesData.find(p => p.id === id);

  const [activeGalleryTab, setActiveGalleryTab] = useState<keyof typeof property.images>("bedrooms");
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!property) {
    return <div className="h-screen flex items-center justify-center text-stone-500 font-serif">Property not found.</div>;
  }

  const nights = range?.from && range?.to ? differenceInCalendarDays(range.to, range.from) : 0;
  const totalAmount = nights * property.price;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const galleryTabs = Object.keys(property.images) as Array<keyof typeof property.images>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBookClick={onBookClick || (() => {})} />
      
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] w-full">
        <img src={property.coverImage} alt={property.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent flex flex-col justify-end p-8 md:p-16">
          <Link to="/properties" className="flex items-center gap-2 text-white/70 hover:text-white mb-6 w-fit transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm uppercase tracking-widest font-bold">Back to Properties</span>
          </Link>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-serif text-white mb-4 italic"
          >
            {property.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl md:text-2xl text-white/90 font-light max-w-2xl"
          >
            {property.subtitle}
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 flex flex-col md:flex-row gap-12 lg:gap-16 items-start">
        {/* Left Content Area */}
        <div className="flex-1 space-y-16 min-w-0">
          
          {/* Categorized Image Gallery */}
          <section>
            <div className="flex flex-wrap gap-2 md:gap-4 mb-6">
              {galleryTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveGalleryTab(tab)}
                  className={`px-5 py-2 md:px-6 md:py-2 rounded-full uppercase tracking-widest text-[10px] font-bold transition-all ${
                    activeGalleryTab === tab ? "bg-accent text-white shadow-md" : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.images[activeGalleryTab].map((img, idx) => (
                <motion.img
                  key={`${activeGalleryTab}-${idx}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  src={img}
                  className="w-full h-64 object-cover rounded-2xl shadow-sm"
                  alt={`${activeGalleryTab} ${idx}`}
                />
              ))}
            </div>
          </section>

          {/* Stats & Overview */}
          <section className="flex flex-wrap gap-8 text-stone-600 bg-stone-50/50 p-6 rounded-2xl border border-stone-100">
            {property.stats && (
              <>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-accent" />
                  <span className="font-medium text-stone-800">{property.stats.guests} Guests</span>
                </div>
                <div className="flex items-center gap-3">
                  <Bed className="w-5 h-5 text-accent" />
                  <span className="font-medium text-stone-800">{property.stats.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-3">
                  <Bath className="w-5 h-5 text-accent" />
                  <span className="font-medium text-stone-800">{property.stats.baths} Baths</span>
                </div>
              </>
            )}
          </section>

          {/* Description */}
          <section>
            <h2 className="text-3xl font-serif text-stone-800 mb-6">The Space</h2>
            <p className="text-stone-600 leading-relaxed text-lg">{property.description}</p>
          </section>

          <hr className="border-stone-200" />

          {/* Amenities & Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section>
              <h3 className="text-2xl font-serif text-stone-800 mb-6">Amenities</h3>
              <ul className="space-y-3">
                {property.amenities.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-stone-600">
                    <div className="p-1 rounded-full bg-accent/10"><Check className="w-3 h-3 text-accent" /></div>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-serif text-stone-800 mb-6">House Rules</h3>
              <ul className="space-y-3">
                {property.rules.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-stone-600">
                    <div className="p-1 rounded-full bg-stone-100"><Info className="w-3 h-3 text-stone-400" /></div>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <hr className="border-stone-200" />

          {/* Nearby Places */}
          <section>
            <h3 className="text-2xl font-serif text-stone-800 mb-6">Nearby Places</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {property.nearby.map((place, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-stone-100 bg-white flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-medium text-stone-800">{place.name}</h4>
                    <p className="text-sm text-stone-500">{place.distance}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-stone-200" />

          {/* Reviews */}
          <section>
            <h3 className="text-2xl font-serif text-stone-800 mb-8">Guest Reviews</h3>
            <div className="space-y-6">
              {property.reviews.map((review, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-stone-50/50 border border-stone-100">
                  <div className="flex items-center gap-2 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-stone-700 italic mb-4">"{review.text}"</p>
                  <p className="text-sm font-bold text-stone-400 uppercase tracking-wider">{review.author}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Sidebar - Sticky Booking Widget */}
        <div className="w-full md:w-[350px] lg:w-[400px] shrink-0">
          <div className="sticky top-24 bg-white rounded-3xl shadow-xl border border-stone-100 p-6 lg:p-8">
            <div className="mb-6">
              <span className="text-3xl font-serif italic text-stone-800">₹{property.price.toLocaleString()}</span>
              <span className="text-stone-500 text-sm"> / night</span>
            </div>

            <div className="space-y-4 mb-8">
              <div className="p-3 border border-stone-200 rounded-xl bg-stone-50">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 block mb-2">Selected Sanctuary</label>
                <div className="font-medium text-stone-800">{property.title}</div>
              </div>

              <div className="border border-stone-200 rounded-xl bg-white overflow-hidden flex justify-center w-full">
                <style>{`
                  .custom-calendar {
                    --rdp-cell-size: 40px;
                    margin: 0;
                    padding: 16px;
                  }
                  .custom-calendar .rdp-day_selected { background-color: #8A4630; color: white; }
                  .custom-calendar .rdp-caption { color: #8A4630; font-family: serif; font-style: italic; }
                  .custom-calendar .rdp-head_cell { color: #A8A29E; font-size: 0.75rem; font-weight: normal; }
                  @media (max-width: 400px) {
                    .custom-calendar {
                      --rdp-cell-size: 32px;
                    }
                  }
                `}</style>
                <DayPicker
                  mode="range"
                  selected={range}
                  onSelect={setRange}
                  disabled={{ before: today }}
                  className="custom-calendar"
                />
              </div>
            </div>

            {nights > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 space-y-3"
              >
                <div className="flex justify-between text-sm text-stone-600">
                  <span>₹{property.price.toLocaleString()} × {nights} nights</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="pt-3 border-t border-stone-100 flex justify-between font-medium text-lg text-stone-800">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
              </motion.div>
            )}

            <button 
              className="w-full py-4 rounded-xl bg-accent text-white font-serif italic text-lg hover:bg-[#723a28] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={nights === 0}
              onClick={() => alert(`Reserved ${property.title} for ${nights} nights. Total: ₹${totalAmount.toLocaleString()}`)}
            >
              Reserve Sanctuary
            </button>
            <p className="text-center text-[10px] text-stone-400 mt-4 uppercase tracking-widest">You won't be charged yet</p>
          </div>
        </div>
      </div>
      <Footer />
      <MobileNav onBookClick={onBookClick || (() => {})} />
    </div>
  );
}
