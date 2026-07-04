import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Users, Star, ArrowRight, Shrub, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { publicService } from "../services/publicService";
import { preloadPropertyImages } from "../utils/preload";

interface PropertiesJournalProps {
  onBookClick: (prop?: any) => void;
}

const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

function MobileSlider({ properties, activeIdx, setActiveIdx, navigate }: {
  properties: any[];
  activeIdx: number;
  setActiveIdx: (i: number) => void;
  navigate: (path: string) => void;
}) {
  const total = properties.length;

  const prev = useCallback(() => setActiveIdx((activeIdx - 1 + total) % total), [activeIdx, total]);
  const next = useCallback(() => setActiveIdx((activeIdx + 1) % total), [activeIdx, total]);

  const variants = useMemo(() => ({
    center:      { x: "0%",    scale: 1,    opacity: 1,    zIndex: 10, rotateY: 0 },
    left:        { x: "-84%",  scale: 0.84, opacity: 0.45, zIndex: 5,  rotateY: 12 },
    right:       { x: "84%",   scale: 0.84, opacity: 0.45, zIndex: 5,  rotateY: -12 },
    hiddenLeft:  { x: "-120%", scale: 0.65, opacity: 0,    zIndex: 0,  rotateY: 20 },
    hiddenRight: { x: "120%",  scale: 0.65, opacity: 0,    zIndex: 0,  rotateY: -20 },
  }), []);

  const getVariant = (idx: number) => {
    let offset = idx - activeIdx;
    if (offset < -total / 2) offset += total;
    if (offset > total / 2) offset -= total;
    if (offset === 0) return "center";
    if (offset === -1) return "left";
    if (offset === 1) return "right";
    return offset < 0 ? "hiddenLeft" : "hiddenRight";
  };

  const active = properties[activeIdx];
  const activeImage = active?.coverImage || active?.images?.find((i: any) => i.is_primary)?.url || active?.images?.[0]?.url || "";

  return (
    <div className="relative">
      {/* Ambient blurred background — transitions with active card */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="sync">
          <motion.img
            key={activeIdx}
            src={activeImage}
            className="absolute inset-0 w-full h-full object-cover scale-125"
            style={{ filter: "blur(48px)", opacity: 0 }}
            animate={{ opacity: 0.28 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            aria-hidden
            decoding="async"
          />
        </AnimatePresence>
        {/* Gradient fade to background at top and bottom */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Card stage */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ height: "70dvh", perspective: "1100px" }}
      >
        {properties.map((property, idx) => {
          const variant = getVariant(idx);
          const isActive = variant === "center";
          const image = property.coverImage || property.images?.find((i: any) => i.is_primary)?.url || property.images?.[0]?.url || "";
          const priceVal = property.base_nightly_rate || 0;
          const price = priceVal > 0 ? `₹${parseFloat(String(priceVal)).toLocaleString()}` : null;

          return (
            <motion.div
              key={property.id}
              className="absolute w-[84vw] h-[62dvh] rounded-[2rem] overflow-hidden cursor-pointer"
              style={{ willChange: "transform, opacity", boxShadow: isActive ? "0 32px 80px rgba(0,0,0,0.45)" : "0 8px 24px rgba(0,0,0,0.2)" }}
              variants={variants}
              initial={false}
              animate={variant}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={() => {
                if (variant === "left") prev();
                else if (variant === "right") next();
                else navigate(`/property/${property.slug}`);
              }}
              drag={isActive ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.06}
              dragMomentum={false}
              onDragEnd={(_, { offset, velocity }) => {
                const power = swipePower(offset.x, velocity.x);
                if (power < -8000 || offset.x < -50) next();
                else if (power > 8000 || offset.x > 50) prev();
              }}
            >
              <img
                src={image}
                alt={property.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading={idx === 0 ? "eager" : "lazy"}
                decoding="async"
                referrerPolicy="no-referrer"
              />
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/10 to-black/20" />

              {/* Top badge */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <span className="px-2.5 py-1 rounded-full bg-black/40 border border-white/15 text-white text-[8px] font-bold uppercase tracking-widest backdrop-blur-sm">
                  {property.property_type || "Retreat"}
                </span>
                {price && (
                  <span className="px-2.5 py-1 rounded-full bg-white/95 text-accent text-[10px] font-serif italic font-semibold shadow-lg">
                    {price}<span className="text-[8px] font-sans not-italic text-stone-400 ml-0.5">/night</span>
                  </span>
                )}
              </div>

              {/* Bottom info — fades in only on active card */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-5"
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 14 }}
                transition={{ duration: 0.35, delay: isActive ? 0.1 : 0 }}
              >
                <p className="flex items-center gap-1.5 text-white/60 text-[9px] uppercase tracking-[0.3em] mb-1.5">
                  <MapPin className="w-2.5 h-2.5" />{property.city}
                </p>
                <h3 className="text-white text-[22px] font-serif italic leading-tight mb-3">{property.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white/60">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3 h-3" />
                      <span className="text-[9px]">{property.max_guests || 2} guests</span>
                    </div>
                    <div className="w-px h-3 bg-white/20" />
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                      <span className="text-[9px] text-amber-300 font-bold">4.9</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                    <span className="text-white text-[9px] font-bold uppercase tracking-wider">View</span>
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Dot indicators */}
      {total > 1 && (
        <div className="flex justify-center items-center gap-2 pb-4 pt-1">
          {properties.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className="p-1.5 -m-1.5 cursor-pointer"
              style={{ background: "none", border: "none" }}
            >
              <span
                className="block h-1 rounded-full bg-accent transition-all duration-300"
                style={{ width: i === activeIdx ? 20 : 6, opacity: i === activeIdx ? 1 : 0.25 }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PropertiesJournal({ onBookClick }: PropertiesJournalProps) {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeIdx, setActiveIdx] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const data = await publicService.getProperties();
        if (!data || data.length === 0) {
          const demoProperties = [
            {
              id: "demo-1",
              slug: "moon-retreat-demo",
              title: "Moon Retreat (Demo)",
              city: "Gurugram",
              property_type: "Apartment",
              base_nightly_rate: 3200,
              max_guests: 3,
              coverImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
              airbnb_url: "https://airbnb.com"
            },
            {
              id: "demo-2",
              slug: "sun-sanctuary-demo",
              title: "Sun Sanctuary (Demo)",
              city: "Jaipur",
              property_type: "Villa",
              base_nightly_rate: 8500,
              max_guests: 6,
              coverImage: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80"
            }
          ];
          setProperties(demoProperties);
          preloadPropertyImages(demoProperties);
        } else {
          setProperties(data);
          preloadPropertyImages(data);
        }
      } catch (error) {
        console.error("Failed to fetch journal properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filters = ["all", "villa", "apartment", "sanctuary"];
  const filteredProperties = activeFilter === "all"
    ? properties
    : properties.filter(p => (p.property_type || "").toLowerCase().includes(activeFilter));

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center">
        <div className="text-xl font-serif italic text-stone-400 animate-pulse">Designing Sanctuaries...</div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Navbar onBookClick={onBookClick} />

      {/* ── MOBILE: 3D hero-style slider + scrollable footer ── */}
      <div className="lg:hidden flex flex-col bg-background">

        {/* Filter chips */}
        <div className="px-4 pt-3 pb-2.5 border-b border-stone-100">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => { setActiveFilter(filter); setActiveIdx(0); }}
                className={`shrink-0 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeFilter === filter
                    ? "bg-accent text-white shadow-sm shadow-accent/20"
                    : "bg-stone-100 text-stone-400"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Slider */}
        {filteredProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Shrub className="w-10 h-10 text-stone-200 mb-4" />
            <p className="text-lg font-serif italic text-accent">No sanctuaries found.</p>
          </div>
        ) : (
          <MobileSlider
            properties={filteredProperties}
            activeIdx={activeIdx}
            setActiveIdx={setActiveIdx}
            navigate={navigate}
          />
        )}

        {/* Dark footer — scroll down to see it */}
        <Footer />
      </div>

      {/* ── DESKTOP: sidebar + scrollable grid ── */}
      <div className="hidden lg:flex flex-1 flex-row max-w-[1800px] mx-auto w-full">
        <aside className="w-1/3 h-[calc(100vh-72px)] sticky top-[72px] px-16 pt-4 pb-16 flex flex-col border-r border-stone-100 bg-stone-50/30">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <LayoutGrid className="w-4 h-4 text-primary" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-primary">Volume 01</span>
            </div>
            <h1 className="text-8xl font-serif italic text-accent leading-[0.9] tracking-tighter mb-4">
              The <br /> Journal.
            </h1>
            <p className="text-stone-400 font-light leading-relaxed max-w-sm mb-6 italic">
              A curated collection of architectural escapes. Designed for moments of profound stillness.
            </p>
            <div className="flex flex-wrap gap-3">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${
                    activeFilter === filter
                      ? "bg-accent text-white shadow-2xl shadow-accent/20 translate-y-[-2px]"
                      : "bg-white text-stone-400 border border-stone-100 hover:border-accent/30 hover:text-stone-600"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </motion.div>
        </aside>

        <main className="flex-1 px-16 pt-4 pb-16">
          <div className="grid grid-cols-2 gap-x-12 gap-y-16">
            {filteredProperties.length === 0 ? (
              <div className="col-span-full py-32 text-center">
                <Shrub className="w-12 h-12 text-stone-200 mx-auto mb-6" />
                <h2 className="text-2xl font-serif italic text-accent">No sanctuaries discovered.</h2>
              </div>
            ) : (
              filteredProperties.map((property, index) => {
                const image = property.coverImage || property.images?.[0]?.url || "";
                const priceVal = property.base_nightly_rate || 0;
                const price = `₹${parseFloat(String(priceVal)).toLocaleString()}`;
                return (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                    onClick={() => navigate(`/property/${property.slug}`)}
                    className="group cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] mb-4 shadow-2xl shadow-stone-900/5 group-hover:shadow-stone-900/20 transition-all duration-1000">
                      <img src={image} alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                        referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="bg-white px-4 py-3 rounded-2xl border border-stone-100 shadow-2xl">
                          <span className="text-xl font-serif italic text-accent">{price}</span>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-2xl">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="absolute top-6 left-6">
                        <div className="px-3 py-1.5 rounded-full bg-stone-900/60 border border-white/30 text-white text-[9px] font-bold uppercase tracking-widest">
                          {property.property_type || "Retreat"}
                        </div>
                      </div>
                    </div>
                    <div className="px-4">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">{property.city}</span>
                      </div>
                      <h3 className="text-3xl font-serif text-accent mb-3 group-hover:italic transition-all duration-500">{property.title}</h3>
                      <div className="flex items-center gap-4 text-stone-400">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{property.max_guests} Guests</span>
                        </div>
                        <div className="h-3 w-[1px] bg-stone-200" />
                        <div className="flex items-center gap-1.5 text-primary">
                          <Star className="w-3.5 h-3.5 fill-primary" />
                          <span className="text-[10px] font-bold">4.9 Rating</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </main>
      </div>

      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
}
