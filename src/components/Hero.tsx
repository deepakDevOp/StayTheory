import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { publicService } from "../services/publicService";
import { preloadPropertyImages, optimizeImageUrl, markImageLoaded, imageLoadingAttr } from "../utils/preload";

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function Hero() {
  const [properties, setProperties] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const lastWheelTime = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const data = await publicService.getProperties();
        const mapped = data.slice(0, 5).map((p: any) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          location: p.city || "Destination",
          description: p.subtitle || p.description?.substring(0, 100) + "...",
          image: p.images?.find((img: any) => img.is_primary)?.url || p.images?.[0]?.url || p.coverImage || "",
          isPlaceholder: false
        }));

        setProperties(mapped);
        preloadPropertyImages(data.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch hero properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const nextSlide = useCallback(() => {
    if (properties.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % properties.length);
  }, [properties.length]);

  const prevSlide = useCallback(() => {
    if (properties.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + properties.length) % properties.length);
  }, [properties.length]);

  useEffect(() => {
    if (properties.length === 0) return;
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide, properties.length]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY) || Math.abs(e.deltaX) < 20) return;

    const now = Date.now();
    if (now - lastWheelTime.current < 600) return;

    if (e.deltaX > 0) {
      nextSlide();
      lastWheelTime.current = now;
    } else {
      prevSlide();
      lastWheelTime.current = now;
    }
  }, [nextSlide, prevSlide]);

  const getVariant = (index: number) => {
    const total = properties.length;
    let offset = index - activeIndex;
    if (offset < -total / 2) offset += total;
    if (offset > total / 2) offset -= total;

    if (offset === 0) return "center";
    if (offset === -1 || (offset < 0 && offset > -2)) return "left";
    if (offset === 1 || (offset > 0 && offset < 2)) return "right";
    return offset < 0 ? "hiddenLeft" : "hiddenRight";
  };

  // Blur removed from variants — CSS filter is expensive and causes layer compositing on every frame.
  // Opacity + scale alone achieve the depth effect without the GPU cost.
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const variants = useMemo(() => ({
    center:      { x: "0%",   scale: 1,    opacity: 1,    zIndex: 10 },
    left:        { x: isMobile ? "-84%" : "-68%", scale: isMobile ? 0.86 : 0.78, opacity: isMobile ? 0.25 : 0.55, zIndex: 5 },
    right:       { x: isMobile ? "84%"  : "68%",  scale: isMobile ? 0.86 : 0.78, opacity: isMobile ? 0.25 : 0.55, zIndex: 5 },
    hiddenLeft:  { x: "-110%", scale: 0.6, opacity: 0,    zIndex: 0 },
    hiddenRight: { x: "110%",  scale: 0.6, opacity: 0,    zIndex: 0 },
  }), [isMobile]);

  return (
    <section
      className="relative h-[calc(100dvh-72px)] flex flex-col justify-center overflow-hidden bg-surface-dim/30"
      onWheel={handleWheel}
    >
      {loading ? (
        <div className="h-full w-full flex items-center justify-center italic text-stone-400">
          Loading our world...
        </div>
      ) : properties.length === 0 ? (
        <div className="h-full w-full flex flex-col items-center justify-center text-center p-12">
          <MapPin className="w-12 h-12 text-stone-200 mb-6" />
          <h2 className="text-4xl font-serif italic text-accent mb-4">Finding Sanctuaries</h2>
          <p className="text-stone-400 max-w-md">Our collection is currently being curated. Please return shortly.</p>
        </div>
      ) : (
        <>
          {/* Static blurred background — only re-renders when activeIndex changes, not every frame */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ willChange: "auto" }}
          >
            <img
              src={optimizeImageUrl(properties[activeIndex].image, 400, "40")}
              className="w-full h-full object-cover blur-3xl scale-110 opacity-30"
              alt=""
              aria-hidden="true"
              decoding="async"
              fetchPriority="low"
            />
          </div>

          <div className="relative w-full h-full flex items-center justify-center">
            {properties.map((prop, idx) => {
              const variant = getVariant(idx);
              const isActive = variant === "center";
              const isVisible = variant !== "hiddenLeft" && variant !== "hiddenRight";

              return (
                <motion.div
                  key={prop.id}
                  className="absolute w-[88vw] md:w-[60vw] h-[76dvh] md:h-[78vh] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl cursor-pointer"
                  style={{ willChange: "transform, opacity" }}
                  variants={variants}
                  initial={false}
                  animate={variant}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  onClick={() => {
                    if (variant === "left") prevSlide();
                    if (variant === "right") nextSlide();
                    if (variant === "center") navigate(`/property/${prop.slug}`);
                  }}
                  drag={isActive ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.05}
                  dragMomentum={false}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);
                    if (swipe < -swipeConfidenceThreshold || offset.x < -50) {
                      nextSlide();
                    } else if (swipe > swipeConfidenceThreshold || offset.x > 50) {
                      prevSlide();
                    }
                  }}
                >
                  <img
                    src={optimizeImageUrl(prop.image, isActive ? 1400 : 800)}
                    alt={prop.title}
                    className={`w-full h-full object-cover object-center pointer-events-none ${prop.isPlaceholder ? 'brightness-90' : ''}`}
                    referrerPolicy="no-referrer"
                    decoding="async"
                    loading={idx === 0 ? "eager" : imageLoadingAttr(prop.image)}
                    fetchPriority={idx === 0 ? "high" : "low"}
                    onLoad={() => markImageLoaded(prop.image)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent pointer-events-none z-20" />

                  {isVisible && (
                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 text-center pointer-events-none z-30">
                      <motion.div
                        initial={false}
                        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 16 }}
                        transition={{ duration: 0.4, delay: isActive ? 0.15 : 0 }}
                      >
                        <div className="flex items-center justify-center gap-2 mb-2 md:mb-4 text-white/80">
                          <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-semibold">{prop.location}</span>
                        </div>
                        <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif italic mb-3 md:mb-6 leading-tight drop-shadow-lg">
                          {prop.title}
                        </h2>
                        <p className="text-white/80 text-xs md:text-base font-light max-w-2xl mx-auto drop-shadow-md line-clamp-2 md:line-clamp-none">
                          {prop.description}
                        </p>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
            {properties.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${activeIndex === idx ? "w-8 bg-on-surface" : "w-2 bg-on-surface/30 hover:bg-on-surface/50"}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
