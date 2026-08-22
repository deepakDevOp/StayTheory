import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { MapPin, ArrowRight } from "lucide-react";
import { publicService } from "../services/publicService";
import { preloadPropertyImages, optimizeImageUrl, markImageLoaded, imageLoadingAttr, getCachedProperties, setCachedProperties, fetchPropertiesDeduped } from "../utils/preload";
import { useRevalidateOnFocus } from "../hooks/useRevalidateOnFocus";

export default function PropertyCollection() {
  const [properties, setProperties] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProperties = useCallback(async (opts?: { showLoading?: boolean }) => {
    if (opts?.showLoading) setLoading(true);
    try {
      const data = await fetchPropertiesDeduped(() => publicService.getProperties());
      const validData = Array.isArray(data) ? data : [];
      setProperties(validData.slice(0, 5));
      preloadPropertyImages(validData.slice(0, 5));
      setCachedProperties(validData);
    } catch (error) {
      console.error("Failed to fetch public properties:", error);
    } finally {
      if (opts?.showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cached = getCachedProperties();
    if (cached) {
      setProperties(cached.slice(0, 5));
      setLoading(false);
      fetchProperties(); // silent background refresh
    } else {
      fetchProperties({ showLoading: true });
    }
  }, [fetchProperties]);

  // Picks up admin edits made elsewhere while the home page was left open.
  useRevalidateOnFocus(() => fetchProperties());

  const nextSlide = useCallback(() => {
    if (!isHovered && properties.length > 0) {
      setActiveIndex((prev) => (prev + 1) % properties.length);
    }
  }, [isHovered, properties.length]);

  useEffect(() => {
    if (properties.length === 0) return;
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide, properties.length]);

  if (loading) {
    return (
      <section className="h-screen w-full bg-background flex flex-col items-center justify-center">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="italic text-stone-400 font-serif text-xl"
        >
          Curating Sanctuaries...
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen md:h-screen w-full px-5 md:px-16 py-10 md:py-16 max-w-[1600px] mx-auto bg-background flex flex-col overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 md:mb-12 shrink-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex-1"
        >
          <span className="uppercase text-[10px] tracking-[0.4em] font-bold text-primary mb-3 block opacity-70">Our Collection</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-on-surface leading-[1.1] max-w-2xl">
            Sanctuaries designed <br />
            <span className="italic text-primary/80">for modern stillness.</span>
          </h2>
        </motion.div>

        <Link to="/properties" className="group flex items-center gap-4 text-primary mb-2 shrink-0">
          <div className="flex flex-col items-end">
            <span className="uppercase tracking-[0.2em] text-[10px] font-bold">View All</span>
            <div className="h-[1px] w-6 bg-primary transition-all duration-500 group-hover:w-full mt-1" />
          </div>
          <div className="w-9 h-9 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 flex-1 w-full gap-4 md:gap-5 min-h-[60vh] max-h-[80vh] overflow-hidden">
        {Array.isArray(properties) && properties.map((p, idx) => {
          const image = p.images?.find((img: any) => img.is_primary)?.url || p.images?.[0]?.url || p.coverImage || "";
          const location = p.city || "India";

          // Make the first item large, others small
          const isLarge = idx === 0;

          return (
            <motion.div
              key={p.id}
              className={`relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group shadow-2xl shadow-black/5 ${
                isLarge ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1 md:row-span-1'
              } ${p.isPlaceholder ? 'cursor-default' : 'cursor-pointer'}`}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              onClick={() => {
                if (!p.isPlaceholder) {
                  navigate(`/property/${p.slug}`);
                }
              }}
              whileHover={{ scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Gradient overlay */}
              <div
                className="absolute inset-0 z-10 bg-gradient-to-t from-stone-900/90 via-stone-900/10 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500"
              />

              {/* Image */}
              <img
                src={optimizeImageUrl(image, isLarge ? 1400 : 800)}
                alt={p.title}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 scale-105 group-hover:scale-110 group-hover:saturate-150 ${p.isPlaceholder ? 'grayscale brightness-75 contrast-[1.1]' : ''}`}
                referrerPolicy="no-referrer"
                decoding="async"
                loading={idx === 0 ? "eager" : imageLoadingAttr(image)}
                onLoad={() => markImageLoaded(image)}
              />

              {/* Content Overlays */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-8 pointer-events-none transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
                <div className="text-white">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <div className="px-3 py-1 rounded-full glass-premium border border-white/20 flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-white" />
                      <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-white shadow-sm">{location}</span>
                    </div>
                    {(p.isPlaceholder || p.airbnb_url) && (
                      <div className="px-3 py-1 rounded-full bg-primary/90 backdrop-blur-md border border-primary/30">
                        <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white whitespace-nowrap">
                          {p.airbnb_url ? "Direct Booking Coming Soon" : "Coming Soon"}
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className={`font-serif mb-2 leading-tight ${isLarge ? 'text-3xl md:text-5xl lg:text-6xl' : 'text-2xl md:text-3xl'}`}>
                    {p.title}
                  </h3>

                  <div className="h-[2px] bg-white/40 w-12 mb-3 group-hover:w-24 group-hover:bg-primary transition-all duration-500" />

                  {!p.isPlaceholder && isLarge && (
                    <p className="text-white/80 text-sm max-w-md font-light leading-relaxed hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      A curated sanctuary designed for ultimate serenity and architectural beauty. Explore the details.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
