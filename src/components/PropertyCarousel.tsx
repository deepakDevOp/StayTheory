import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { motion } from "motion/react";
import { MapPin, Users, Star, ArrowRight, Shrub } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { optimizeImageUrl, markImageLoaded, imageLoadingAttr } from "../utils/preload";

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

interface PropertyCarouselProps {
  properties: any[];
  onBookClick?: (property: any) => void;
  className?: string;
  showDots?: boolean;
  autoRotate?: boolean;
}

export default function PropertyCarousel({
  properties,
  onBookClick,
  className = "",
  showDots = true,
  autoRotate = false,
}: PropertyCarouselProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const lastWheelTime = useRef(0);
  const navigate = useNavigate();

  const next = useCallback(() => {
    if (properties.length === 0) return;
    setActiveIdx((prev) => (prev + 1) % properties.length);
  }, [properties.length]);

  const prev = useCallback(() => {
    if (properties.length === 0) return;
    setActiveIdx((prev) => (prev - 1 + properties.length) % properties.length);
  }, [properties.length]);

  // Reset when property list changes (e.g. filter applied)
  useEffect(() => {
    setActiveIdx(0);
  }, [properties.length]);

  useEffect(() => {
    if (!autoRotate || properties.length === 0) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [autoRotate, next, properties.length]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY) || Math.abs(e.deltaX) < 20) return;
    const now = Date.now();
    if (now - lastWheelTime.current < 600) return;
    if (e.deltaX > 0) { next(); lastWheelTime.current = now; }
    else { prev(); lastWheelTime.current = now; }
  }, [next, prev]);

  const getVariant = (index: number) => {
    const total = properties.length;
    let offset = index - activeIdx;
    if (offset < -total / 2) offset += total;
    if (offset > total / 2) offset -= total;
    if (offset === 0) return "center";
    if (offset === -1) return "left";
    if (offset === 1) return "right";
    return offset < 0 ? "hiddenLeft" : "hiddenRight";
  };

  const variants = useMemo(() => ({
    center:      { x: "0%",    scale: 1,    opacity: 1,    zIndex: 10 },
    left:        { x: "-84%",  scale: 0.86, opacity: 0.25, zIndex: 5 },
    right:       { x: "84%",   scale: 0.86, opacity: 0.25, zIndex: 5 },
    hiddenLeft:  { x: "-110%", scale: 0.6,  opacity: 0,    zIndex: 0 },
    hiddenRight: { x: "110%",  scale: 0.6,  opacity: 0,    zIndex: 0 },
  }), []);

  if (properties.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-20 ${className}`}>
        <Shrub className="w-10 h-10 text-stone-200 mb-4" />
        <p className="text-lg font-serif italic text-accent">No sanctuaries found.</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`} onWheel={handleWheel}>
      {/* Card stage */}
      <div className="relative flex-1 min-h-0 flex items-center justify-center overflow-hidden">
        {/* Blurred ambient background from active card */}
        {(() => {
          const active = properties[activeIdx];
          const img = active?.coverImage || active?.images?.find((i: any) => i.is_primary)?.url || active?.images?.[0]?.url || "";
          return img ? (
            <div className="absolute inset-0 pointer-events-none" style={{ willChange: "auto" }}>
              <img
                src={optimizeImageUrl(img, 400, "40")}
                className="w-full h-full object-cover blur-3xl scale-110 opacity-25"
                alt=""
                aria-hidden="true"
                decoding="async"
                fetchPriority="low"
              />
            </div>
          ) : null;
        })()}

        {properties.map((property, idx) => {
          const variant = getVariant(idx);
          const isActive = variant === "center";
          const isVisible = variant !== "hiddenLeft" && variant !== "hiddenRight";
          const image = property.coverImage || property.images?.find((i: any) => i.is_primary)?.url || property.images?.[0]?.url || "";
          const priceVal = property.base_nightly_rate || 0;
          const price = `₹${parseFloat(String(priceVal)).toLocaleString()}`;

          return (
            <motion.div
              key={property.id}
              className="absolute w-[88vw] h-[74%] rounded-[1.75rem] overflow-hidden shadow-2xl cursor-pointer"
              style={{ willChange: "transform, opacity" }}
              variants={variants}
              initial={false}
              animate={variant}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={() => {
                if (variant === "left") { prev(); return; }
                if (variant === "right") { next(); return; }
                navigate(`/property/${property.slug}`);
              }}
              drag={isActive ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.05}
              dragMomentum={false}
              onDragEnd={(_, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold || offset.x < -50) next();
                else if (swipe > swipeConfidenceThreshold || offset.x > 50) prev();
              }}
            >
              {/* Image */}
              {image ? (
                <img
                  src={optimizeImageUrl(image, isActive ? 1200 : 600)}
                  alt={property.title}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  referrerPolicy="no-referrer"
                  decoding="async"
                  loading={idx === 0 ? "eager" : imageLoadingAttr(image)}
                  fetchPriority={idx === 0 ? "high" : "low"}
                  onLoad={() => markImageLoaded(image)}
                />
              ) : (
                <div className="absolute inset-0 bg-stone-200" />
              )}

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none z-10" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent pointer-events-none z-10" />

              {/* Top row: type badge + counter */}
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-20 pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[8px] font-bold uppercase tracking-widest">
                  {property.property_type || "Retreat"}
                </span>
                <span className="text-white/40 text-[10px] font-mono tabular-nums">
                  {String(idx + 1).padStart(2, "0")} / {String(properties.length).padStart(2, "0")}
                </span>
              </div>

              {/* Overlay content — animated with active state */}
              {isVisible && (
                <div className="absolute inset-0 flex flex-col justify-end p-5 pb-6 z-20 pointer-events-none">
                  <motion.div
                    initial={false}
                    animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 16 }}
                    transition={{ duration: 0.4, delay: isActive ? 0.15 : 0 }}
                    className="pointer-events-auto"
                  >
                    {/* Price badge */}
                    {priceVal > 0 && (
                      <div className="inline-flex mb-3">
                        <span className="px-3 py-1.5 rounded-xl bg-white/95 text-accent text-[11px] font-serif italic font-semibold shadow-lg">
                          {price}
                          <span className="text-[8px] font-sans not-italic text-stone-400 ml-1">/night</span>
                        </span>
                      </div>
                    )}

                    <p className="flex items-center gap-1.5 text-white/55 text-[9px] uppercase tracking-[0.35em] mb-1.5">
                      <MapPin className="w-2.5 h-2.5 shrink-0" />
                      {property.city}
                    </p>
                    <h3 className="text-white text-[22px] font-serif italic leading-tight mb-3">
                      {property.title}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-white/55">
                          <Users className="w-3 h-3" />
                          <span className="text-[10px] uppercase tracking-wider">{property.max_guests} guests</span>
                        </div>
                        <div className="w-[1px] h-3 bg-white/20" />
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                          <span className="text-[10px] text-amber-300 font-bold">4.9</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {onBookClick && (
                          <button
                            onClick={e => { e.stopPropagation(); onBookClick(property); }}
                            className="px-4 py-2 rounded-xl bg-accent text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-accent/30"
                          >
                            Book
                          </button>
                        )}
                        <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Dot indicators */}
      {showDots && properties.length > 1 && (
        <div className="flex justify-center items-center gap-2 py-3 shrink-0">
          {properties.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveIdx(i)}
              animate={{ width: i === activeIdx ? 20 : 6, opacity: i === activeIdx ? 1 : 0.25 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="h-1.5 rounded-full bg-accent cursor-pointer"
            />
          ))}
        </div>
      )}
    </div>
  );
}
