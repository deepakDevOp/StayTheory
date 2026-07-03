import { useState, useCallback, useEffect, useMemo } from "react";
import { Settings, MapPin, Users, TrendingUp, Plus } from "lucide-react";
import { motion } from "motion/react";

const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;
const THRESHOLD = 8000;

interface PropertyGridProps {
  properties: any[];
  onEdit: (p: any) => void;
  onPhotos: (p: any) => void;
  onAddClick?: () => void;
}

export default function PropertyGrid({ properties, onEdit, onPhotos, onAddClick }: PropertyGridProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  const next = useCallback(() => {
    if (properties.length === 0) return;
    setActiveIdx(p => (p + 1) % properties.length);
  }, [properties.length]);

  const prev = useCallback(() => {
    if (properties.length === 0) return;
    setActiveIdx(p => (p - 1 + properties.length) % properties.length);
  }, [properties.length]);

  useEffect(() => { setActiveIdx(0); }, [properties.length]);

  const getVariant = (index: number) => {
    const total = properties.length;
    let offset = index - activeIdx;
    if (offset < -total / 2) offset += total;
    if (offset > total / 2) offset -= total;
    if (offset === 0) return "center";
    if (offset === -1) return "left";
    if (offset === 1) return "right";
    return offset < 0 ? "farLeft" : "farRight";
  };

  const variants = useMemo(() => ({
    center:  { x: "0%",    scale: 1,    opacity: 1,    zIndex: 10, rotateY: 0 },
    left:    { x: "-78%",  scale: 0.82, opacity: 0.3,  zIndex: 5,  rotateY: 12 },
    right:   { x: "78%",   scale: 0.82, opacity: 0.3,  zIndex: 5,  rotateY: -12 },
    farLeft: { x: "-110%", scale: 0.6,  opacity: 0,    zIndex: 0,  rotateY: 0 },
    farRight:{ x: "110%",  scale: 0.6,  opacity: 0,    zIndex: 0,  rotateY: 0 },
  }), []);

  // ── EMPTY STATE ──────────────────────────────────────────
  if (properties.length === 0) {
    return (
      <>
        <div className="md:hidden flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6 text-stone-300" />
          </div>
          <h3 className="text-xl font-serif italic text-accent mb-2">No Sanctuaries Yet</h3>
          <p className="text-stone-400 text-sm leading-relaxed mb-6 max-w-xs">
            Your portfolio is empty. Create your first luxury sanctuary.
          </p>
          <button onClick={onAddClick}
            className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest">
            <Plus className="w-4 h-4" /> Add First Property
          </button>
        </div>
        <div className="hidden md:flex items-center justify-center flex-1">
          <div className="w-[600px] h-[70vh] bg-white rounded-[4rem] border border-stone-100 shadow-2xl flex flex-col items-center justify-center text-center p-12">
            <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mb-8">
              <MapPin className="w-10 h-10 text-stone-200" />
            </div>
            <h3 className="text-4xl font-serif italic text-on-surface mb-4">No Sanctuaries Yet</h3>
            <button onClick={onAddClick} className="px-12 py-5 bg-primary text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em]">
              Initialize First Listing
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          MOBILE — framer-motion 3D carousel
      ══════════════════════════════════════════════════════ */}
      <div className="md:hidden flex flex-col" style={{ height: "100%", perspective: "1200px" }}>

        {/* Card stage — takes all remaining height */}
        <div className="relative flex-1 min-h-0 flex items-center justify-center overflow-hidden">

          {/* Ambient blurred background */}
          {(() => {
            const a = properties[activeIdx];
            const img = a?.main_image_url || a?.coverImage || a?.images?.[0]?.url || "";
            return img ? (
              <div className="absolute inset-0 pointer-events-none">
                <img src={img} className="w-full h-full object-cover blur-2xl scale-110 opacity-40" alt="" aria-hidden />
              </div>
            ) : null;
          })()}

          {/* Cards */}
          {properties.map((property, idx) => {
            const variant = getVariant(idx);
            const isActive = variant === "center";
            const image = property.main_image_url || property.coverImage || property.images?.[0]?.url || "";
            const price = (property.price || property.base_nightly_rate || 0).toLocaleString();

            return (
              <motion.div
                key={property.id}
                className="absolute rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
                style={{ width: "84vw", height: "82%", willChange: "transform, opacity" }}
                variants={variants}
                initial={false}
                animate={variant}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                drag={isActive ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.06}
                dragMomentum={false}
                onDragEnd={(_, { offset, velocity }) => {
                  const power = swipePower(offset.x, velocity.x);
                  if (power < -THRESHOLD || offset.x < -50) next();
                  else if (power > THRESHOLD || offset.x > 50) prev();
                }}
                onClick={() => {
                  if (variant === "left") prev();
                  else if (variant === "right") next();
                }}
              >
                {/* Image */}
                {image ? (
                  <img
                    src={image}
                    alt={property.title}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    style={{ transform: isActive ? "scale(1)" : "scale(1.08)", transition: "transform 0.6s ease" }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300" />
                )}

                {/* Gradient layers for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
                <div className="absolute inset-0" style={{
                  background: "radial-gradient(ellipse at 50% 0%, transparent 60%, rgba(0,0,0,0.3) 100%)"
                }} />

                {/* Top row */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-emerald-500/90 backdrop-blur-sm text-white text-[8px] font-bold uppercase tracking-widest rounded-full">
                    Active
                  </span>
                  <span className="text-white/40 text-[9px] font-mono tracking-wider">
                    {String(idx + 1).padStart(2, "0")} / {String(properties.length).padStart(2, "0")}
                  </span>
                </div>


                {/* Bottom content */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-5 pb-6"
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 16 }}
                  transition={{ duration: 0.4, delay: isActive ? 0.1 : 0 }}
                >
                  <div className="inline-flex mb-2.5">
                    <span className="px-2.5 py-1.5 rounded-xl bg-white/95 text-accent text-[11px] font-serif italic font-semibold shadow-lg">
                      ₹{price}
                      <span className="text-[8px] font-sans not-italic text-stone-400 ml-0.5">/night</span>
                    </span>
                  </div>
                  <p className="flex items-center gap-1.5 text-white/55 text-[9px] uppercase tracking-[0.3em] mb-1">
                    <MapPin className="w-2.5 h-2.5 shrink-0" />
                    {property.city || "—"}
                  </p>
                  <h3 className="text-white text-[20px] font-serif italic leading-tight mb-4">
                    {property.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-white/55">
                      {property.max_guests && <>
                        <Users className="w-3 h-3" />
                        <span className="text-[9px] uppercase tracking-wider">{property.max_guests} guests</span>
                      </>}
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); onEdit(property); }}
                      className="px-5 py-2.5 bg-white text-stone-900 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl active:scale-95 transition-transform"
                    >
                      Manage
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom strip: title + NEW + dots */}
        <div className="shrink-0 px-5 py-3 flex items-center justify-between bg-background/80 backdrop-blur-sm">
          <div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-stone-400 font-bold">My Properties</p>
            <div className="flex items-center gap-2 mt-1">
              {properties.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  animate={{ width: i === activeIdx ? 18 : 5, opacity: i === activeIdx ? 1 : 0.25 }}
                  transition={{ duration: 0.3 }}
                  className="h-1 rounded-full bg-accent cursor-pointer"
                />
              ))}
            </div>
          </div>
          <button
            onClick={onAddClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white rounded-full text-[9px] font-bold uppercase tracking-widest active:scale-95 transition-transform"
          >
            <Plus className="w-3.5 h-3.5" />
            New
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          DESKTOP — horizontal snap scroll (unchanged)
      ══════════════════════════════════════════════════════ */}
      <div className="hidden md:flex gap-12 overflow-x-auto snap-x snap-mandatory py-10 px-[15%] no-scrollbar scroll-smooth items-center w-full">
        <div className="flex-shrink-0 w-[5vw]" />
        {properties.map((property) => {
          const image = property.main_image_url || property.coverImage || property.images?.[0]?.url || "";
          const price = (property.price || property.base_nightly_rate || 0).toLocaleString();
          return (
            <motion.div
              key={property.id}
              initial={{ opacity: 0.5, scale: 0.9, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              viewport={{ amount: 0.8 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex-shrink-0 w-[600px] snap-center"
            >
              <div className="bg-white rounded-[4rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-stone-100 group flex flex-col h-[70vh]">
                <div className="relative h-2/3 overflow-hidden bg-stone-100">
                  {image && <img src={image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent" />
                  <div className="absolute top-8 left-8">
                    <span className="bg-primary text-white text-[7px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">Active Listing</span>
                  </div>
                  <div className="absolute bottom-8 right-8">
                    <button onClick={() => onPhotos(property)} className="p-4 bg-stone-900/60 rounded-full text-white hover:bg-white hover:text-stone-900 transition-all shadow-xl">
                      <TrendingUp className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-10 flex flex-col justify-between flex-grow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className="text-3xl font-serif italic text-on-surface group-hover:text-primary transition-colors leading-tight">{property.title}</h3>
                      <div className="flex items-center gap-2 text-stone-400 mt-1.5">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="text-xs uppercase tracking-widest font-medium truncate">{property.city || "—"}</span>
                      </div>
                    </div>
                    <button onClick={() => onEdit(property)} className="p-2 text-stone-200 hover:text-primary transition-colors shrink-0">
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-8">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Nightly Rate</span>
                      <p className="text-xl font-serif italic text-on-surface">₹{price}<span className="text-xs font-sans not-italic text-stone-400 ml-1">/night</span></p>
                    </div>
                    <button onClick={() => onEdit(property)} className="px-10 py-4 bg-stone-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all">
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        <div className="flex-shrink-0 w-[20vw]" />
      </div>
    </>
  );
}
