import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { MapPin, Users, Star, Shrub } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { optimizeImageUrl, markImageLoaded, imageLoadingAttr } from "../utils/preload";

interface PropertyCarouselProps {
  properties: any[];
  onBookClick?: (property: any) => void;
  className?: string;
  showDots?: boolean;
}

export default function PropertyCarousel({
  properties,
  onBookClick,
  className = "",
  showDots = true,
}: PropertyCarouselProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    setActiveIdx(Math.round(scrollLeft / clientWidth));
  };

  const scrollTo = (idx: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ left: idx * scrollRef.current.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    setActiveIdx(0);
    scrollRef.current?.scrollTo({ left: 0 });
  }, [properties.length]);

  if (properties.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-20 ${className}`}>
        <Shrub className="w-10 h-10 text-stone-200 mb-4" />
        <p className="text-lg font-serif italic text-accent">No sanctuaries found.</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Scroll container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 flex overflow-x-auto no-scrollbar"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {properties.map((property, index) => {
          const image = property.coverImage || property.images?.find((i: any) => i.is_primary)?.url || property.images?.[0]?.url || "";
          const priceVal = property.base_nightly_rate || 0;
          const price = `₹${parseFloat(String(priceVal)).toLocaleString()}`;
          const isActive = index === activeIdx;

          return (
            <div
              key={property.id}
              className="relative flex-shrink-0 overflow-hidden cursor-pointer"
              style={{ width: "100%", height: "100%", scrollSnapAlign: "start" }}
              onClick={() => navigate(`/property/${property.slug}`)}
            >
              {/* Image */}
              {image ? (
                <img
                  src={optimizeImageUrl(image, isActive ? 1200 : 600)}
                  alt={property.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
                  style={{ transform: isActive ? "scale(1.0)" : "scale(1.06)" }}
                  referrerPolicy="no-referrer"
                  decoding="async"
                  loading={index === 0 ? "eager" : imageLoadingAttr(image)}
                  fetchPriority={index === 0 ? "high" : "low"}
                  onLoad={() => markImageLoaded(image)}
                />
              ) : (
                <div className="absolute inset-0 bg-stone-200" />
              )}

              {/* Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent" />

              {/* Overlay content */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-5 pb-6"
                animate={{ y: isActive ? 0 : 16, opacity: isActive ? 1 : 0.5 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="flex items-center gap-1.5 text-white/60 text-[9px] uppercase tracking-[0.35em] mb-1.5">
                  <MapPin className="w-2.5 h-2.5 shrink-0" />
                  {property.city}
                </p>
                <h3 className="text-white text-[22px] font-serif italic leading-tight mb-3">
                  {property.title}
                </h3>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-white/60">
                      <Users className="w-3 h-3" />
                      <span className="text-[9px] uppercase tracking-wider">{property.max_guests} guests</span>
                    </div>
                    <div className="w-[1px] h-3 bg-white/20" />
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                      <span className="text-[9px] text-amber-300 font-bold">4.9</span>
                    </div>
                  </div>

                  {priceVal > 0 && (
                    <span className="px-2.5 py-1 rounded-lg bg-white/95 text-accent text-[11px] font-serif italic font-semibold shadow-md">
                      {price}
                      <span className="text-[8px] font-sans not-italic text-stone-400 ml-0.5">/night</span>
                    </span>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Dot indicators */}
      {showDots && properties.length > 1 && (
        <div className="flex justify-center items-center gap-2 py-3 shrink-0">
          {properties.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => scrollTo(i)}
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
