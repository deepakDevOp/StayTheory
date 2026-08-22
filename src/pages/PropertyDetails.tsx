import { useState, useEffect, useMemo, useCallback } from "react";
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
import "react-day-picker/style.css";
import { addDays, differenceInCalendarDays, parseISO } from "date-fns";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { preloadPropertyImages, markImageLoaded, imageLoadingAttr, optimizeImageUrl, getCachedPropertyDetail, setCachedPropertyDetail, getCachedProperties } from "../utils/preload";
import { useRevalidateOnFocus } from "../hooks/useRevalidateOnFocus";

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
   const [activeReviewIndex, setActiveReviewIndex] = useState(0);

   const fetchData = useCallback(async (opts?: { showLoading?: boolean }) => {
      if (!slug) return;
      if (opts?.showLoading) setLoading(true);
      try {
         const prop = await publicService.getPropertyBySlug(slug);
         if (prop) {
            setProperty(prop);
            preloadPropertyImages(prop);
            // Fetch reviews for this property
            const reviews = await publicService.getPropertyReviews(prop.id);
            setPropertyReviews(reviews);

            // Load blocked dates from the property availability data
            let blocked: Date[] = [];
            if (prop.availability && Array.isArray(prop.availability)) {
               blocked = prop.availability.map((a: any) => {
                  // Ensure we handle both string and date objects
                  const d = typeof a.date === 'string' ? parseISO(a.date) : new Date(a.date);
                  d.setHours(0, 0, 0, 0);
                  return d;
               });
               setBlockedDates(blocked);
            }

            setCachedPropertyDetail(slug, { property: prop, reviews, blockedDates: blocked });
         }
      } catch (error) {
         console.error("Failed to load property data:", error);
      } finally {
         if (opts?.showLoading) setLoading(false);
      }
   }, [slug]);

   // Seeds property + blocked dates from the already-fetched properties list
   // (from /properties or the homepage) when this exact property hasn't been
   // opened before. The list response carries the same fields (images,
   // price, availability) as the detail endpoint — only reviews are missing
   // — so this lets a first-ever click into a property render instantly
   // instead of showing the loading skeleton, which is the common case when
   // browsing through the listing (each click is a *different* property, so
   // the per-slug detail cache alone rarely has a hit).
   const seedFromListCache = useCallback(() => {
      const list = getCachedProperties();
      const match = list?.find((p: any) => p.slug === slug);
      if (!match) return null;

      let blocked: Date[] = [];
      if (match.availability && Array.isArray(match.availability)) {
         blocked = match.availability.map((a: any) => {
            const d = typeof a.date === 'string' ? parseISO(a.date) : new Date(a.date);
            d.setHours(0, 0, 0, 0);
            return d;
         });
      }
      return { property: match, blockedDates: blocked };
   }, [slug]);

   useEffect(() => {
      window.scrollTo(0, 0);
      if (!slug) return;

      // Serve instantly from cache (stale-while-revalidate) so returning to a
      // property already visited this session skips the loading skeleton and
      // avoids re-showing images as if they were never loaded.
      const cached = getCachedPropertyDetail(slug);
      if (cached) {
         setProperty(cached.property);
         setPropertyReviews(cached.reviews);
         setBlockedDates(cached.blockedDates);
         setLoading(false);
         fetchData(); // silent background refresh
      } else {
         const seed = seedFromListCache();
         if (seed) {
            setProperty(seed.property);
            setBlockedDates(seed.blockedDates);
            setLoading(false); // render instantly with list data; reviews trickle in
            fetchData(); // silent background fetch to fill in reviews + confirm full detail
         } else {
            fetchData({ showLoading: true });
         }
      }
   }, [slug, fetchData, seedFromListCache]);

   // Picks up admin edits made elsewhere while this page was left open.
   useRevalidateOnFocus(() => { if (slug) fetchData(); });

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
      <div className="min-h-screen bg-background overflow-x-hidden">
         <Navbar onBookClick={onBookClick || (() => { })} />

         {/* Hero Section */}
         <div className="relative h-[55vh] sm:h-[60vh] md:h-[72vh] w-full">
            <img
               src={optimizeImageUrl(property.coverImage || normalizedImages[0]?.url, 1600)}
               alt={property.title}
               className="w-full h-full object-cover"
               loading="eager"
               onLoad={() => markImageLoaded(property.coverImage || normalizedImages[0]?.url)}
            />

            {/* Gradient: subtle top darkening for back btn, strong bottom for title */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/75 via-stone-900/10 to-transparent" />

            {/* Back button — top left, minimal */}
            <Link
               to="/properties"
               className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-1.5 text-white/80 hover:text-white transition-colors group"
            >
               <div className="w-8 h-8 rounded-full bg-stone-900/40 border border-white/20 flex items-center justify-center group-hover:bg-stone-900/70 transition-all">
                  <ArrowLeft className="w-3.5 h-3.5" />
               </div>
               <span className="text-[10px] uppercase tracking-widest font-bold hidden sm:inline">Back</span>
            </Link>

            {/* Title only — bottom left, clean */}
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-12">
               <motion.p
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                  className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold text-white/60 mb-2"
               >
                  {property.city || "India"}
               </motion.p>
               <motion.h1
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif text-white italic leading-tight"
               >
                  {property.title}
               </motion.h1>
            </div>
         </div>

         {/* Sub-hero strip: subtitle + map link */}
         <div className="bg-stone-900 px-5 md:px-12 py-3 flex items-center justify-between gap-4">
            <span className="text-white/60 text-xs font-light truncate">
               {property.subtitle || `${property.property_type || 'Sanctuary'}`}
            </span>
            <a
               href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.title + " " + (property.city || 'Udaipur'))}`}
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 hover:text-primary transition-colors whitespace-nowrap shrink-0"
            >
               <MapPin className="w-3 h-3" />
               View on Maps
            </a>
         </div>

         <div className="max-w-7xl mx-auto px-4 md:px-12 py-10 md:py-16 flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 md:items-start">
            {/* Left Content Area */}
            <div className="flex-1 space-y-10 md:space-y-16 min-w-0">

               {/* Categorized Image Gallery */}
               <section className="w-full min-w-0">
                  <div className="mb-6 w-full min-w-0">
                     <h3 className="text-lg md:text-2xl font-serif text-stone-800 italic mb-3 md:mb-4">The Gallery</h3>
                     <div className="flex gap-2 p-1 bg-stone-50 rounded-full border border-stone-100 overflow-x-auto no-scrollbar" style={{ maxWidth: '100%' }}>
                        {["all", ...new Set(normalizedImages.map((img: any) => img.category))].filter(c => c !== 'main').map((cat: any) => (
                           <button
                              key={cat}
                              onClick={() => setActiveGalleryCategory(cat)}
                              className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${activeGalleryCategory === cat ? 'bg-white text-primary shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                           >
                              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:gap-4">
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
                                 initial={{ opacity: 0, y: 12 }}
                                 whileInView={{ opacity: 1, y: 0 }}
                                 viewport={{ once: true }}
                                 transition={{ duration: 0.4, delay: idx * 0.06 }}
                                 className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-sm"
                                 onClick={() => setLightboxIndex(normalizedImages.indexOf(img))}
                              >
                                 <img
                                    src={optimizeImageUrl(img.url, 800)}
                                    className="w-full h-52 sm:h-52 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                                    alt={`Property Image ${idx + 1}`}
                                    loading={idx < 2 ? "eager" : imageLoadingAttr(img.url)}
                                    decoding="async"
                                    onLoad={() => markImageLoaded(img.url)}
                                 />
                                 {isLastInitial && (
                                    <div className="absolute inset-0 bg-stone-900/60 flex flex-col items-center justify-center text-white group-hover:bg-stone-900/70 transition-all">
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

                        {/* Preload adjacent images as hidden elements so the browser caches them */}
                        {[-1, 1].map(offset => {
                           const adjIdx = (lightboxIndex! + offset + normalizedImages.length) % normalizedImages.length;
                           return <link key={offset} rel="preload" as="image" href={optimizeImageUrl(normalizedImages[adjIdx]?.url, 1920)} />;
                        })}

                        {/* Main Image */}
                        <div className="relative w-full h-full flex items-center justify-center p-4 md:p-20">
                           <motion.img
                              key={lightboxIndex}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.25 }}
                              src={optimizeImageUrl(normalizedImages[lightboxIndex].url, 1920)}
                              className="max-w-full max-h-full object-contain shadow-2xl"
                              decoding="async"
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
               <section className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 md:gap-6 text-stone-600 bg-stone-50/50 p-4 md:p-6 rounded-2xl border border-stone-100">
                  <div className="flex items-center gap-2">
                     <Users className="w-4 h-4 text-accent shrink-0" />
                     <span className="text-sm md:text-base font-medium text-stone-800">Up to {property.stats?.guests || property.max_guests} Guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Bed className="w-4 h-4 text-accent shrink-0" />
                     <span className="text-sm md:text-base font-medium text-stone-800">{property.stats?.bedrooms || property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Bath className="w-4 h-4 text-accent shrink-0" />
                     <span className="text-sm md:text-base font-medium text-stone-800">{property.stats?.baths || property.bathrooms} Baths</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Square className="w-4 h-4 text-accent shrink-0" />
                     <span className="text-sm md:text-base font-medium text-stone-800">{property.stats?.beds || property.beds} Beds</span>
                  </div>
               </section>

               {/* Description */}
               <section>
                  <h2 className="text-xl md:text-3xl font-serif font-bold text-stone-800 mb-4 md:mb-6">The Space</h2>
                  <p className="text-stone-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
                     {property.description || "No description available for this sanctuary yet."}
                  </p>
               </section>

               <hr className="border-stone-200" />

               {/* Amenities */}
               <section id="amenities">
                  <h3 className="text-lg md:text-2xl font-serif font-bold text-stone-800 mb-5 md:mb-8">What this sanctuary offers</h3>
                  {property.amenities && property.amenities.length > 0 ? (
                     <div className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 md:gap-y-6 gap-x-8 md:gap-x-12">
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
                                 <div key={idx} className="flex items-center gap-3 text-stone-700">
                                    <div className="text-stone-400 shrink-0 [&>svg]:w-4 [&>svg]:h-4 md:[&>svg]:w-5 md:[&>svg]:h-5">
                                       {getAmenityIcon(item)}
                                    </div>
                                    <span className="text-sm md:text-base font-light">{item}</span>
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
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 mb-5 md:mb-8">
                     <div className="space-y-2 md:space-y-4">
                        <h3 className="text-lg md:text-2xl font-serif font-bold text-stone-800">Location</h3>
                        <p className="text-stone-500 font-serif italic text-sm md:text-xl max-w-lg">
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

                  <div className="relative overflow-hidden rounded-2xl md:rounded-[2.5rem] border border-stone-100 shadow-xl aspect-[4/3] md:aspect-[21/9]">
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
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-10">
                     <h3 className="text-xl md:text-3xl font-serif font-bold text-stone-800 flex items-center gap-3">
                        Guest Experiences
                     </h3>
                     <Link
                        to={`/reviews?property=${property.id}`}
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary border border-primary/20 px-5 py-2.5 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm shrink-0"
                     >
                        View All Reviews
                     </Link>
                  </div>
                  {propertyReviews && propertyReviews.length > 0 ? (
                     <div className="relative">
                        <div
                           className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-6 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar"
                           onScroll={(e) => {
                              const el = e.currentTarget;
                              const scrollLeft = el.scrollLeft;
                              const childWidth = el.scrollWidth / propertyReviews.length;
                              const index = Math.min(propertyReviews.length - 1, Math.max(0, Math.round(scrollLeft / childWidth)));
                              setActiveReviewIndex(index);
                           }}
                        >
                           {propertyReviews.map((review: any, idx: number) => (
                              <div key={idx} className="snap-center snap-always shrink-0 w-[85vw] sm:w-80 md:w-96 p-6 md:p-8 bg-white rounded-[2rem] border border-stone-100 flex flex-col shadow-xl shadow-stone-200/30 hover:shadow-2xl hover:shadow-stone-200/50 transition-all duration-300 relative overflow-hidden group">
                                 {/* Decorative quote mark */}
                                 <div className="absolute top-4 right-6 text-[5rem] font-serif text-stone-100 group-hover:text-primary/10 transition-colors pointer-events-none select-none leading-none">
                                    "
                                 </div>

                                 <div className="flex gap-1 mb-5 relative z-10">
                                    {[...Array(Number(review.rating) || 0)].map((_, i) => (
                                       <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                                    ))}
                                 </div>
                                 <p className="text-stone-600 font-serif italic text-[15px] md:text-lg mb-6 leading-relaxed flex-grow relative z-10">"{review.comment || review.text}"</p>

                                 <div className="flex items-center gap-3 relative z-10">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                       {(review.author_name || review.author || "G")[0].toUpperCase()}
                                    </div>
                                    <div>
                                       <p className="text-[10px] font-bold uppercase tracking-widest text-stone-700">{review.author_name || review.author || "Guest"}</p>
                                       <p className="text-[9px] text-stone-400 mt-0.5">Verified Stay</p>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>

                        {propertyReviews.length > 1 && (
                           <div className="flex justify-center gap-2 mt-2 mb-4">
                              {propertyReviews.map((_: any, i: number) => (
                                 <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === activeReviewIndex ? "w-6 bg-primary" : "w-1.5 bg-stone-200"}`}
                                 />
                              ))}
                           </div>
                        )}
                     </div>
                  ) : (
                     <div className="p-12 bg-stone-50 rounded-3xl border border-dashed border-stone-200 text-center">
                        <p className="text-stone-400 italic font-serif">Be the first to experience this sanctuary and leave a story.</p>
                     </div>
                  )}
               </section>

               <hr className="border-stone-200" />


            </div>

            {/* Right Sidebar - Booking Widget (sticky on desktop only) */}
            <div className="w-full md:w-[350px] lg:w-[400px] shrink-0">
               <div className="md:sticky md:top-24 bg-white rounded-3xl shadow-xl border border-stone-100 p-4 sm:p-5">
                  {/* Calendar styles */}
                  <style>{`
                    /* ── Layout ── */
                    .st-cal .rdp-months { max-width: 100%; width: 100%; }
                    .st-cal .rdp-month  { width: 100%; }
                    .st-cal .rdp-month_grid { width: 100%; table-layout: fixed; border-collapse: separate; border-spacing: 0 2px; }
                    .st-cal .rdp-day { width: auto; }

                    /* ── Caption (month + year) ── */
                    .st-cal .rdp-month_caption { padding: 0 0 8px 0; }
                    .st-cal .rdp-caption_label { font-family: "Noto Serif", serif; font-style: italic; font-size: 16px; font-weight: 500; color: #1e1b18; letter-spacing: -0.01em; }

                    /* ── Nav buttons ── */
                    .st-cal .rdp-nav { gap: 6px; }
                    .st-cal .rdp-button_previous,
                    .st-cal .rdp-button_next { width: 26px; height: 26px; border-radius: 50%; border: none; background: transparent; display: flex; align-items: center; justify-content: center; transition: background 0.15s, transform 0.1s; cursor: pointer; }
                    .st-cal .rdp-button_previous:hover,
                    .st-cal .rdp-button_next:hover { background: #f0e4df; transform: scale(1.1); }
                    .st-cal .rdp-button_previous .rdp-chevron { fill: #8A4630; width: 14px; height: 14px; }
                    .st-cal .rdp-button_next .rdp-chevron { fill: #8A4630; width: 14px; height: 14px; }

                    /* ── Weekday headers ── */
                    .st-cal .rdp-weekday { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #c4b0a8; padding: 6px 0; }

                    /* ── Day cells ── */
                    .st-cal .rdp-day_button { font-size: 12px; font-weight: 500; border-radius: 50%; transition: background 0.12s, color 0.12s, transform 0.1s; }
                    .st-cal .rdp-day_button:hover:not(:disabled) { background: #f0e4df; color: #8A4630; transform: scale(1.05); }

                    /* ── Selected start/end ── */
                    .st-cal .rdp-day_range_start .rdp-day_button,
                    .st-cal .rdp-day_range_end .rdp-day_button { background: #8A4630 !important; color: white !important; box-shadow: 0 2px 8px rgba(138,70,48,0.35); }

                    /* ── Range middle ── */
                    .st-cal .rdp-day_range_middle .rdp-day_button { border-radius: 0; }

                    /* ── Today indicator ── */
                    .st-cal .rdp-day_today:not(.rdp-day_range_start):not(.rdp-day_range_end) .rdp-day_button { font-weight: 800; color: #8A4630; text-decoration: underline; text-underline-offset: 3px; }

                    /* ── Blocked / disabled ── */
                    .st-cal .rdp-day_blocked .rdp-day_button { opacity: 0.25; text-decoration: line-through; cursor: not-allowed; }
                    .st-cal .rdp-day_blocked .rdp-day_button:hover { background: none !important; transform: none; color: inherit; }
                    .st-cal .rdp-day_outside .rdp-day_button { opacity: 0.2; }

                    /* ── Dark mode ── */
                    html.dark .st-cal { --rdp-accent-background-color: rgba(208,112,80,0.09); }
                    html.dark .st-cal .rdp-caption_label { color: #f0e8e3; }
                    html.dark .st-cal .rdp-weekday { color: #5a4e48; }
                    html.dark .st-cal .rdp-day_button { color: #e4dcd6; }
                    html.dark .st-cal .rdp-button_previous:hover,
                    html.dark .st-cal .rdp-button_next:hover { background: rgba(208,112,80,0.15); }
                    html.dark .st-cal .rdp-button_previous .rdp-chevron,
                    html.dark .st-cal .rdp-button_next .rdp-chevron { fill: #d07050; }
                    html.dark .st-cal .rdp-day_button:hover:not(:disabled) { background: rgba(208,112,80,0.18); color: #d07050; }
                    html.dark .st-cal .rdp-day_range_start .rdp-day_button,
                    html.dark .st-cal .rdp-day_range_end .rdp-day_button { background: #d07050 !important; box-shadow: 0 2px 10px rgba(208,112,80,0.4); }
                    html.dark .st-cal .rdp-day_today:not(.rdp-day_range_start):not(.rdp-day_range_end) .rdp-day_button { color: #d07050; }
                    html.dark .st-cal .rdp-day_outside .rdp-day_button { opacity: 0.12; }
                  `}</style>

                  {/* Price row */}
                  <div className="flex items-baseline justify-between mb-4">
                     <div>
                        <span className="text-2xl font-serif italic text-stone-800">₹{price.toLocaleString()}</span>
                        <span className="text-stone-400 text-xs ml-1">/ night</span>
                     </div>
                     {property?.airbnb_url && (
                        <div className="flex items-center gap-1.5 bg-primary/5 px-2 py-1 rounded-lg border border-primary/10">
                           <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
                           <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">Coming soon</span>
                        </div>
                     )}
                  </div>

                  {/* Calendar */}
                  <div className="w-full mb-3 px-1">
                     <DayPicker
                        mode="range"
                        selected={range}
                        onSelect={(newRange) => {
                           if (!newRange) { setRange(undefined); return; }
                           if (newRange.from && blockedDates.some(bd => bd.getTime() === newRange.from!.getTime())) return;
                           if (newRange.from && newRange.to) {
                              const blocked = blockedDates.some(bd => {
                                 const t = bd.getTime();
                                 return t >= newRange.from!.getTime() && t < newRange.to!.getTime();
                              });
                              if (blocked) { setRange({ from: newRange.from, to: undefined }); return; }
                           }
                           setRange(newRange);
                        }}
                        disabled={[{ before: today }]}
                        modifiers={{ blocked: blockedDates }}
                        modifiersClassNames={{ blocked: "rdp-day_blocked" }}
                        className="st-cal"
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
                           "--rdp-nav_button-height": "26px",
                           "--rdp-nav_button-width": "26px",
                           "--rdp-nav-height": "1.75rem",
                           "--rdp-weekday-padding": "4px 0",
                           "--rdp-outside-opacity": "0.2",
                           "--rdp-disabled-opacity": "0.25",
                           fontSize: "13px",
                           width: "100%",
                        } as any}
                     />
                  </div>

                  {/* Total — slides in when dates are selected */}
                  {nights > 0 && (
                     <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-3 space-y-1.5"
                     >
                        <div className="flex justify-between text-xs text-stone-500">
                           <span>₹{price.toLocaleString()} × {nights} nights</span>
                           <span>₹{totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="pt-2 border-t border-stone-100 flex justify-between font-semibold text-sm text-stone-800">
                           <span>Total</span>
                           <span>₹{totalAmount.toLocaleString()}</span>
                        </div>
                     </motion.div>
                  )}

                  <button
                     className="w-full py-3.5 rounded-xl bg-accent text-white font-serif italic text-base hover:bg-[#723a28] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                     disabled={(nights === 0 && !property?.airbnb_url) || bookingLoading}
                     onClick={handleBooking}
                  >
                     {bookingLoading ? "Requesting..." : property?.airbnb_url ? "Book on Airbnb" : "Reserve Sanctuary"}
                  </button>

                  {/* WhatsApp enquiry */}
                  <a
                     href={`https://wa.me/917827467208?text=${encodeURIComponent(`Hi Ritu, I want to enquire about your property ”“ ${property.title}`)}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="mt-2 w-full py-3 rounded-xl border border-[#25D366]/30 bg-[#25D366]/5 text-[#1a9e4d] font-medium text-sm hover:bg-[#25D366]/10 transition-colors flex items-center justify-center gap-2"
                  >
                     <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                     </svg>
                     Enquire on WhatsApp
                  </a>

                  <p className="text-center text-[10px] text-stone-400 mt-2 uppercase tracking-widest">You won't be charged yet</p>
               </div>
            </div>
         </div>
         <Footer />

         {/* Amenities Modal — bottom sheet on mobile, centered dialog on desktop */}
         <AnimatePresence>
            {showAllAmenities && (
               <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6 md:p-10">
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     onClick={() => setShowAllAmenities(false)}
                     className="absolute inset-0 bg-stone-900/70"
                  />
                  <motion.div
                     initial={{ y: "100%" }}
                     animate={{ y: 0 }}
                     exit={{ y: "100%" }}
                     transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                     className="relative w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88dvh] sm:max-h-[85vh]"
                  >
                     {/* Drag handle */}
                     <div className="sm:hidden w-10 h-1 bg-stone-200 rounded-full mx-auto mt-3 mb-1 shrink-0" />

                     {/* Header */}
                     <div className="px-5 py-4 sm:p-6 border-b border-stone-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
                        <h3 className="text-base sm:text-xl font-serif text-stone-800 italic">What this sanctuary offers</h3>
                        <button
                           onClick={() => setShowAllAmenities(false)}
                           className="p-2 rounded-full hover:bg-stone-50 transition-colors"
                        >
                           <X className="w-5 h-5 text-stone-400" />
                        </button>
                     </div>

                     {/* Amenity list */}
                     <div className="overflow-y-auto overscroll-contain px-5 py-4 sm:p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                           {property.amenities.map((item: string, idx: number) => {
                              const getAmenityIcon = (name: string) => {
                                 const n = name.toLowerCase();
                                 if (n.includes('wifi')) return <Wifi className="w-4 h-4" />;
                                 if (n.includes('tv')) return <Tv className="w-4 h-4" />;
                                 if (n.includes('kitchen')) return <UtensilsCrossed className="w-4 h-4" />;
                                 if (n.includes('washing machine')) return <WashingMachine className="w-4 h-4" />;
                                 if (n.includes('air conditioning') || n.includes('ac')) return <Wind className="w-4 h-4" />;
                                 if (n.includes('pool')) return <Waves className="w-4 h-4" />;
                                 if (n.includes('parking')) return <Car className="w-4 h-4" />;
                                 if (n.includes('gym')) return <Dumbbell className="w-4 h-4" />;
                                 if (n.includes('work')) return <Briefcase className="w-4 h-4" />;
                                 if (n.includes('shampoo')) return <Droplets className="w-4 h-4" />;
                                 if (n.includes('hot water')) return <CloudRain className="w-4 h-4" />;
                                 if (n.includes('bed linen')) return <Bed className="w-4 h-4" />;
                                 if (n.includes('balcony') || n.includes('patio')) return <Layout className="w-4 h-4" />;
                                 if (n.includes('lift')) return <ArrowUp className="w-4 h-4" />;
                                 if (n.includes('camera') || n.includes('security')) return <Cctv className="w-4 h-4" />;
                                 if (n.includes('smoke alarm')) return <Bell className="w-4 h-4" />;
                                 if (n.includes('first aid')) return <PlusCircle className="w-4 h-4" />;
                                 if (n.includes('fire extinguisher')) return <Flame className="w-4 h-4" />;
                                 return <Check className="w-4 h-4" />;
                              };

                              return (
                                 <div key={idx} className="flex items-center gap-3 py-3 border-b border-stone-100 text-stone-700">
                                    <div className="text-stone-400 shrink-0">{getAmenityIcon(item)}</div>
                                    <span className="text-sm font-light">{item}</span>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
      </div>
   );
}
