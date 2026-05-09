import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
   MapPin, Star, Check, Info, ArrowLeft, Users, ChevronRight, Bed, Bath, Square, 
   ArrowRight, X, Share, Heart, ChevronLeft, Wifi, Tv, UtensilsCrossed, 
   WashingMachine, Wind, Waves, Car, Dumbbell, Briefcase, Droplets, CloudRain, 
   Layout, ArrowUp, Cctv, Bell, PlusCircle, Flame 
} from "lucide-react";
import { publicService } from "../services/publicService";
import { DayPicker, DateRange } from "react-day-picker";
import { addDays, differenceInCalendarDays, parseISO } from "date-fns";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileNav from "../components/MobileNav";

export default function PropertyDetails({ onBookClick }: { onBookClick?: (prop?: any) => void }) {
   const { id: slug } = useParams();
   const navigate = useNavigate();
   const [property, setProperty] = useState<any>(null);
   const [propertyReviews, setPropertyReviews] = useState<any[]>([]);
   const [blockedDates, setBlockedDates] = useState<Date[]>([]);
   const [loading, setLoading] = useState(true);
   const [bookingLoading, setBookingLoading] = useState(false);
   const [range, setRange] = useState<DateRange | undefined>(undefined);
   const [activeGalleryCategory, setActiveGalleryCategory] = useState("all");
   const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
   const [showAllAmenities, setShowAllAmenities] = useState(false);

   useEffect(() => {
      window.scrollTo(0, 0);
      const fetchData = async () => {
         if (!slug) return;
         setLoading(true);
         try {
            const prop = await publicService.getPropertyBySlug(slug);
            if (prop) {
               setProperty(prop);
               // Fetch reviews for this property
               const reviews = await publicService.getPropertyReviews(prop.id);
               setPropertyReviews(reviews);
               
               // Load blocked dates from the property availability data
               if (prop.availability && Array.isArray(prop.availability)) {
                  console.log("DEBUG: Raw availability data:", prop.availability);
                  const blocked = prop.availability.map((a: any) => {
                     // Ensure we handle both string and date objects
                     const d = typeof a.date === 'string' ? parseISO(a.date) : new Date(a.date);
                     d.setHours(0, 0, 0, 0);
                     return d;
                  });
                  console.log("DEBUG: Parsed blocked dates:", blocked);
                  setBlockedDates(blocked);
               }
            }
         } catch (error) {
            console.error("Failed to load property data:", error);
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, [slug]);

   useEffect(() => {
      if (lightboxIndex !== null) {
         document.body.style.overflow = 'hidden';
      } else {
         document.body.style.overflow = 'unset';
      }
      return () => { document.body.style.overflow = 'unset'; };
   }, [lightboxIndex]);

   useEffect(() => {
      if (blockedDates.length >= 0 && !range && !loading) {
         // Find first available 3-night range starting from tomorrow
         let start = addDays(new Date(), 1);
         start.setHours(0, 0, 0, 0);

         const isDateBlocked = (date: Date) => {
            return blockedDates.some(bd => bd.getTime() === date.getTime());
         };

         for (let i = 0; i < 90; i++) {
            const potentialStart = addDays(start, i);
            const potentialEnd = addDays(potentialStart, 2); // 3 days (2 nights)

            let rangeBlocked = false;
            for (let d = 0; d <= 2; d++) {
               if (isDateBlocked(addDays(potentialStart, d))) {
                  rangeBlocked = true;
                  break;
               }
            }

            if (!rangeBlocked) {
               setRange({ from: potentialStart, to: potentialEnd });
               break;
            }
         }
      }
   }, [blockedDates, loading]);

   const handleBooking = async () => {
      if (property?.airbnb_url) {
         onBookClick?.(property);
         return;
      }

      if (!range?.from || !range?.to || !property) return;
      setBookingLoading(true);
      try {
         await publicService.createBooking({
            property_id: property.id,
            check_in: range.from.toISOString().split('T')[0],
            check_out: range.to.toISOString().split('T')[0],
            guests: 1 // Default to 1 for now
         });
         alert("Booking request submitted! We will contact you soon.");
      } catch (error: any) {
         if (error.response?.status === 401) {
            alert("Please login to book a stay.");
         } else {
            alert(error.response?.data?.detail || "Booking failed. Please try again.");
         }
      } finally {
         setBookingLoading(false);
      }
   };

   const normalizedImages = useMemo(() => {
      if (!property?.images) return [];
      if (Array.isArray(property.images)) return property.images;
      // Handle static object structure
      return Object.entries(property.images).flatMap(([category, urls]: [string, any]) => {
         if (!Array.isArray(urls)) return [];
         return urls.map((url: string) => ({ url, category }));
      });
   }, [property]);

   if (loading) {
      return (
         <div className="h-screen flex items-center justify-center bg-background">
            <div className="animate-pulse text-2xl font-serif italic text-stone-400">Opening sanctuary doors...</div>
         </div>
      );
   }

   if (!property) {
      return <div className="h-screen flex items-center justify-center text-stone-500 font-serif">Property not found.</div>;
   }

   const nights = range?.from && range?.to ? differenceInCalendarDays(range.to, range.from) : 0;
   const rawPrice = property.price || property.base_nightly_rate || 0;
   const price = typeof rawPrice === 'string' ? parseFloat(rawPrice.replace(/,/g, '')) : rawPrice;
   const totalAmount = (nights || 0) * (price || 0);
   const today = new Date();
   today.setHours(0, 0, 0, 0);

   return (
      <div className="min-h-screen bg-background">
         <Navbar onBookClick={onBookClick || (() => { })} />

         {/* Hero Section */}
         <div className="relative h-[60vh] md:h-[70vh] w-full">
            <img src={property.coverImage || normalizedImages[0]?.url} alt={property.title} className="w-full h-full object-cover" />
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
                  className="text-xl md:text-2xl text-white/90 font-light max-w-2xl flex flex-wrap items-center gap-x-4"
               >
                  <span>{property.subtitle || `${property.property_type || 'Sanctuary'} in ${property.city || 'Goa'}`}</span>
                  <a
                     href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.title + " " + (property.city || 'Udaipur'))}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-xs uppercase tracking-[0.2em] font-bold text-white/60 hover:text-white flex items-center gap-2 border border-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm transition-all"
                  >
                     <MapPin className="w-3 h-3" />
                     View on Maps
                  </a>
               </motion.p>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 flex flex-col md:flex-row gap-12 lg:gap-16 items-start">
            {/* Left Content Area */}
            <div className="flex-1 space-y-16 min-w-0">

               {/* Categorized Image Gallery */}
               <section>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8">
                     <h3 className="text-2xl font-serif text-stone-800 italic">The Gallery</h3>
                     <div className="flex gap-4 p-1 bg-stone-50 rounded-full border border-stone-100 overflow-x-auto no-scrollbar max-w-full">
                        {["all", ...new Set(normalizedImages.map((img: any) => img.category))].filter(c => c !== 'main').map((cat: any) => (
                           <button
                              key={cat}
                              onClick={() => setActiveGalleryCategory(cat)}
                              className={`text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all whitespace-nowrap ${activeGalleryCategory === cat ? 'bg-white text-primary shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                           >
                              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {normalizedImages
                        .filter((img: any) => activeGalleryCategory === 'all' || img.category === activeGalleryCategory)
                        .slice(0, 4)
                        .map((img: any, idx: number) => {
                           const filtered = normalizedImages.filter((img: any) => activeGalleryCategory === 'all' || img.category === activeGalleryCategory);
                           const totalFiltered = filtered.length;
                           const isLastInitial = idx === 3 && totalFiltered > 4;

                           return (
                              <motion.div
                                 key={img.url || idx}
                                 initial={{ opacity: 0, scale: 0.95 }}
                                 whileInView={{ opacity: 1, scale: 1 }}
                                 viewport={{ once: true }}
                                 className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-sm"
                                 onClick={() => setLightboxIndex(normalizedImages.indexOf(img))}
                              >
                                 <img
                                    src={img.url}
                                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                                    alt={`Property Image ${idx + 1}`}
                                 />
                                 {isLastInitial && (
                                    <div className="absolute inset-0 bg-stone-900/40 flex flex-col items-center justify-center text-white backdrop-blur-[1px] group-hover:bg-stone-900/50 transition-all">
                                       <span className="text-3xl font-serif italic mb-2">+{totalFiltered - 4}</span>
                                       <span className="text-[10px] font-bold uppercase tracking-[0.2em]">View All Photos</span>
                                    </div>
                                 )}
                              </motion.div>
                           );
                        })}
                  </div>
               </section>

               {/* Lightbox Modal */}
               <AnimatePresence>
                  {lightboxIndex !== null && (
                     <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] bg-black w-screen h-screen flex flex-col items-center justify-center overflow-hidden"
                     >
                        {/* Header */}
                        <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-10">
                           <button onClick={() => setLightboxIndex(null)} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                              <X className="w-5 h-5" />
                              <span className="text-xs uppercase tracking-widest font-bold">Close</span>
                           </button>
                           <div className="text-white/60 text-xs font-bold uppercase tracking-[0.3em]">
                              {lightboxIndex + 1} / {normalizedImages.length}
                           </div>
                           <div className="flex gap-4">
                              <button className="text-white/60 hover:text-white"><Share className="w-5 h-5" /></button>
                              <button className="text-white/60 hover:text-white"><Heart className="w-5 h-5" /></button>
                           </div>
                        </div>

                        {/* Main Image */}
                        <div className="relative w-full h-full flex items-center justify-center p-4 md:p-20">
                           <motion.img
                              key={lightboxIndex}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              src={normalizedImages[lightboxIndex].url}
                              className="max-w-full max-h-full object-contain shadow-2xl"
                           />

                           {/* Navigation Arrows */}
                           <button
                              onClick={(e) => {
                                 e.stopPropagation();
                                 setLightboxIndex((prev) => (prev! === 0 ? normalizedImages.length - 1 : prev! - 1));
                              }}
                              className="absolute left-8 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                           >
                              <ChevronLeft className="w-6 h-6" />
                           </button>
                           <button
                              onClick={(e) => {
                                 e.stopPropagation();
                                 setLightboxIndex((prev) => (prev! === normalizedImages.length - 1 ? 0 : prev! + 1));
                              }}
                              className="absolute right-8 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                           >
                              <ChevronRight className="w-6 h-6" />
                           </button>
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>

               {/* Stats & Overview */}
               <section className="flex flex-wrap gap-8 text-stone-600 bg-stone-50/50 p-6 rounded-2xl border border-stone-100">
                  <div className="flex items-center gap-3">
                     <Users className="w-5 h-5 text-accent" />
                     <span className="font-medium text-stone-800">Up to {property.stats?.guests || property.max_guests} Guests</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <Bed className="w-5 h-5 text-accent" />
                     <span className="font-medium text-stone-800">{property.stats?.bedrooms || property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <Bath className="w-5 h-5 text-accent" />
                     <span className="font-medium text-stone-800">{property.stats?.baths || property.bathrooms} Baths</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <Square className="w-5 h-5 text-accent" />
                     <span className="font-medium text-stone-800">{property.stats?.beds || property.beds} Beds</span>
                  </div>
               </section>

               {/* Description */}
               <section>
                  <h2 className="text-3xl font-serif font-bold text-stone-800 mb-6">The Space</h2>
                  <p className="text-stone-600 leading-relaxed text-lg whitespace-pre-line">
                     {property.description || "No description available for this sanctuary yet."}
                  </p>
               </section>

               <hr className="border-stone-200" />

               {/* Amenities */}
               <section id="amenities">
                  <h3 className="text-2xl font-serif font-bold text-stone-800 mb-8">What this sanctuary offers</h3>
                  {property.amenities && property.amenities.length > 0 ? (
                     <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                           {property.amenities.slice(0, 10).map((item: string, idx: number) => {
                              const getAmenityIcon = (name: string) => {
                                 const n = name.toLowerCase();
                                 if (n.includes('wifi')) return <Wifi className="w-6 h-6" />;
                                 if (n.includes('tv')) return <Tv className="w-6 h-6" />;
                                 if (n.includes('kitchen')) return <UtensilsCrossed className="w-6 h-6" />;
                                 if (n.includes('washing machine')) return <WashingMachine className="w-6 h-6" />;
                                 if (n.includes('air conditioning') || n.includes('ac')) return <Wind className="w-6 h-6" />;
                                 if (n.includes('pool')) return <Waves className="w-6 h-6" />;
                                 if (n.includes('parking')) return <Car className="w-6 h-6" />;
                                 if (n.includes('gym')) return <Dumbbell className="w-6 h-6" />;
                                 if (n.includes('work')) return <Briefcase className="w-6 h-6" />;
                                 if (n.includes('shampoo')) return <Droplets className="w-6 h-6" />;
                                 if (n.includes('hot water')) return <CloudRain className="w-6 h-6" />;
                                 if (n.includes('bed linen')) return <Bed className="w-6 h-6" />;
                                 if (n.includes('balcony') || n.includes('patio')) return <Layout className="w-6 h-6" />;
                                 if (n.includes('lift')) return <ArrowUp className="w-6 h-6" />;
                                 if (n.includes('camera') || n.includes('security')) return <Cctv className="w-6 h-6" />;
                                 if (n.includes('smoke alarm')) return <Bell className="w-6 h-6" />;
                                 if (n.includes('first aid')) return <PlusCircle className="w-6 h-6" />;
                                 if (n.includes('fire extinguisher')) return <Flame className="w-6 h-6" />;
                                 return <Check className="w-6 h-6" />;
                              };

                              return (
                                 <div key={idx} className="flex items-center gap-4 text-stone-700">
                                    <div className="text-stone-500">
                                       {getAmenityIcon(item)}
                                    </div>
                                    <span className="text-lg font-light">{item}</span>
                                 </div>
                              );
                           })}
                        </div>
                        
                        {property.amenities.length > 10 && (
                           <button 
                              onClick={() => setShowAllAmenities(true)}
                              className="px-8 py-3.5 border border-stone-800 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-stone-50 transition-colors"
                           >
                              Show all {property.amenities.length} amenities
                           </button>
                        )}
                     </div>
                  ) : (
                     <div className="p-8 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-center">
                        <p className="text-stone-400 italic font-serif">No specific amenities listed yet. Please contact us for details.</p>
                     </div>
                  )}
               </section>

               <hr className="border-stone-200" />

               {/* Location - CLEAN UNOBSTRUCTED VERSION */}
               <section id="location">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                     <div className="space-y-4">
                        <h3 className="text-2xl font-serif font-bold text-stone-800">Location</h3>
                        <p className="text-stone-500 font-serif italic text-xl max-w-lg">
                           {property.address || property.city || "Location details being curated..."}
                        </p>
                     </div>
                     <a
                        href={property.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address || property.city || 'Udaipur')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent hover:underline flex items-center gap-2"
                     >
                        OPEN IN GOOGLE MAPS
                        <ArrowRight className="w-4 h-4" />
                     </a>
                  </div>

                  <div className="relative overflow-hidden rounded-[2.5rem] border border-stone-100 shadow-xl aspect-[21/9]">
                     <motion.img
                        initial={{ scale: 1 }}
                        whileInView={{ scale: 1 }}
                        src={property.map_image || "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000"}
                        alt="Location Map"
                        className="w-full h-full object-cover transition-transform duration-[4s] ease-out"
                        referrerPolicy="no-referrer"
                     />
                  </div>
               </section>

               <hr className="border-stone-200" />

               {/* Reviews */}
               <section>
                  <div className="flex justify-between items-center mb-10">
                     <h3 className="text-2xl font-serif font-bold text-stone-800">Guest Experiences</h3>
                     <Link to={`/reviews?property=${property.id}`} className="text-xs font-bold uppercase tracking-widest text-accent hover:underline">View All Reviews</Link>
                  </div>
                  {propertyReviews && propertyReviews.length > 0 ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {propertyReviews.slice(0, 2).map((review: any, idx: number) => (
                           <div key={idx} className="p-6 bg-stone-50/50 rounded-2xl border border-stone-100">
                              <div className="flex gap-1 mb-3">
                                 {[...Array(Number(review.rating) || 0)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-accent text-accent" />
                                 ))}
                              </div>
                              <p className="text-stone-600 italic text-sm mb-4 leading-relaxed">"{review.comment || review.text}"</p>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">— {review.author_name || review.author || "Guest"}</p>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div className="p-12 bg-stone-50 rounded-3xl border border-dashed border-stone-200 text-center">
                        <p className="text-stone-400 italic font-serif">Be the first to experience this sanctuary and leave a story.</p>
                     </div>
                  )}
               </section>

               <hr className="border-stone-200" />


            </div>

            {/* Right Sidebar - Sticky Booking Widget */}
            <div className="w-full md:w-[350px] lg:w-[400px] shrink-0">
               <div className="sticky top-24 bg-white rounded-3xl shadow-xl border border-stone-100 p-6 lg:p-8">
                  {property?.airbnb_url && (
                     <div className="flex items-center gap-2 mb-4 bg-primary/5 p-2 rounded-lg border border-primary/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Direct booking coming soon</span>
                     </div>
                  )}
                  <div className="mb-6">
                     <span className="text-3xl font-serif italic text-stone-800">₹{price.toLocaleString()}</span>
                     <span className="text-stone-500 text-sm"> / night</span>
                  </div>

                  <div className="space-y-4 mb-8">
                     <div className="p-3 border border-stone-200 rounded-xl bg-stone-50">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 block mb-2">Selected Sanctuary</label>
                        <div className="font-medium text-stone-800">{property.title}</div>
                     </div>

                     <div className="border border-stone-200 rounded-xl bg-white overflow-hidden flex justify-center w-full">
                        <style>{`
                  .rdp-day_disabled {
                    text-decoration: line-through !important;
                    text-decoration-color: #8A4630 !important;
                    text-decoration-thickness: 2px !important;
                    opacity: 0.3 !important;
                    color: #A8A29E !important;
                    cursor: not-allowed !important;
                  }
                  .rdp-day_selected {
                    background-color: #8A4630 !important;
                    color: white !important;
                  }
                  .rdp-day_selected.rdp-day_disabled {
                    background-color: #F5F5F4 !important;
                    color: #A8A29E !important;
                    text-decoration: line-through !important;
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
                                 // If they clicked a blocked date as their first choice, ignore it
                                 return;
                              }

                              if (newRange.from && newRange.to) {
                                 // Check if any date BETWEEN from and to is blocked
                                 const isMidRangeBlocked = blockedDates.some(bd => {
                                    const date = bd.getTime();
                                    // It's blocked if it's the start date OR any date BEFORE the end date
                                    return date >= newRange.from!.getTime() && date < newRange.to!.getTime();
                                 });

                                 if (isMidRangeBlocked) {
                                    // Reset to just the start date if they tried to jump over a block
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
                           <span>₹{price.toLocaleString()} × {nights} nights</span>
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
                     disabled={(nights === 0 && !property?.airbnb_url) || bookingLoading}
                     onClick={handleBooking}
                  >
                     {bookingLoading ? "Requesting..." : property?.airbnb_url ? "Book on Airbnb" : "Reserve Sanctuary"}
                  </button>
                  <p className="text-center text-[10px] text-stone-400 mt-4 uppercase tracking-widest">You won't be charged yet</p>
               </div>
            </div>
         </div>
         <Footer />
         <MobileNav onBookClick={onBookClick || (() => { })} />

         {/* Amenities Modal */}
         <AnimatePresence>
            {showAllAmenities && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     onClick={() => setShowAllAmenities(false)}
                     className="absolute inset-0 bg-stone-900/40 backdrop-blur-md"
                  />
                  <motion.div
                     initial={{ opacity: 0, y: 50, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 50, scale: 0.95 }}
                     className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-full"
                  >
                     <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <h3 className="text-2xl font-serif text-stone-800 italic">What this sanctuary offers</h3>
                        <button 
                           onClick={() => setShowAllAmenities(false)}
                           className="p-3 rounded-full hover:bg-stone-50 transition-colors"
                        >
                           <X className="w-6 h-6 text-stone-400" />
                        </button>
                     </div>
                     <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar">
                        <div className="space-y-12">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {property.amenities.map((item: string, idx: number) => {
                                 const getAmenityIcon = (name: string) => {
                                    const n = name.toLowerCase();
                                    if (n.includes('wifi')) return <Wifi className="w-6 h-6" />;
                                    if (n.includes('tv')) return <Tv className="w-6 h-6" />;
                                    if (n.includes('kitchen')) return <UtensilsCrossed className="w-6 h-6" />;
                                    if (n.includes('washing machine')) return <WashingMachine className="w-6 h-6" />;
                                    if (n.includes('air conditioning') || n.includes('ac')) return <Wind className="w-6 h-6" />;
                                    if (n.includes('pool')) return <Waves className="w-6 h-6" />;
                                    if (n.includes('parking')) return <Car className="w-6 h-6" />;
                                    if (n.includes('gym')) return <Dumbbell className="w-6 h-6" />;
                                    if (n.includes('work')) return <Briefcase className="w-6 h-6" />;
                                    if (n.includes('shampoo')) return <Droplets className="w-6 h-6" />;
                                    if (n.includes('hot water')) return <CloudRain className="w-6 h-6" />;
                                    if (n.includes('bed linen')) return <Bed className="w-6 h-6" />;
                                    if (n.includes('balcony') || n.includes('patio')) return <Layout className="w-6 h-6" />;
                                    if (n.includes('lift')) return <ArrowUp className="w-6 h-6" />;
                                    if (n.includes('camera') || n.includes('security')) return <Cctv className="w-6 h-6" />;
                                    if (n.includes('smoke alarm')) return <Bell className="w-6 h-6" />;
                                    if (n.includes('first aid')) return <PlusCircle className="w-6 h-6" />;
                                    if (n.includes('fire extinguisher')) return <Flame className="w-6 h-6" />;
                                    return <Check className="w-6 h-6" />;
                                 };

                                 return (
                                    <div key={idx} className="flex items-center gap-5 text-stone-700 pb-4 border-b border-stone-50">
                                       <div className="text-stone-400">
                                          {getAmenityIcon(item)}
                                       </div>
                                       <span className="text-lg font-light">{item}</span>
                                    </div>
                                 );
                              })}
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
      </div>
   );
}
