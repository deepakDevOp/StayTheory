import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, ArrowRight } from "lucide-react";
import { propertiesData } from "../data/properties";

const properties = propertiesData.map((p) => ({
  id: p.id,
  title: p.title,
  location: p.nearby[0]?.name || "Location",
  image: p.coverImage,
}));

export default function PropertyCollection() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const navigate = useNavigate();

  const nextSlide = useCallback(() => {
    if (!isHovered) {
      setActiveIndex((prev) => (prev + 1) % properties.length);
    }
  }, [isHovered]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 2000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="py-24 px-8 md:px-16 max-w-[1440px] mx-auto bg-background overflow-hidden">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <span className="uppercase text-[11px] tracking-[0.2em] font-bold text-primary mb-4 block">Our Collection</span>
          <h2 className="text-4xl md:text-5xl font-serif text-on-surface leading-tight max-w-lg">
            Discover our curated sanctuaries.
          </h2>
        </div>
        <Link to="/properties" className="flex items-center gap-2 text-primary font-semibold hover:opacity-80 transition-opacity">
          <span className="uppercase tracking-widest text-sm">View All Properties</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="flex flex-col md:flex-row h-[80vh] md:h-[60vh] w-full gap-4">
        {properties.map((prop, idx) => {
          const isActive = activeIndex === idx;
          
          return (
            <motion.div
              key={prop.id}
              className="relative rounded-3xl overflow-hidden cursor-pointer min-h-[100px] md:min-h-0"
              onHoverStart={() => {
                setActiveIndex(idx);
                setIsHovered(true);
              }}
              onHoverEnd={() => setIsHovered(false)}
              onFocus={() => {
                setActiveIndex(idx);
                setIsHovered(true);
              }}
              onBlur={() => setIsHovered(false)}
              onClick={() => navigate(`/property/${prop.id}`)}
              tabIndex={0}
              animate={{
                flexGrow: isActive ? 4 : 1,
                flexShrink: isActive ? 0 : 1,
                flexBasis: isActive ? 'auto' : '0%'
              }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} // smooth easeOutExpo
            >
              <div className="absolute inset-0 bg-stone-900/40 z-10 transition-opacity duration-500" style={{ opacity: isActive ? 0.3 : 0.6 }} />
              <img 
                src={prop.image} 
                alt={prop.title}
                className="w-full h-full object-cover transition-transform duration-[2s] ease-out"
                style={{ transform: isActive ? "scale(1.05)" : "scale(1)" }}
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-8">
                 <AnimatePresence>
                   {isActive ? (
                     <motion.div 
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: 20 }}
                       transition={{ duration: 0.3, delay: 0.1 }}
                       className="text-white"
                     >
                       <div className="flex items-center gap-2 mb-2">
                         <MapPin className="w-4 h-4 text-white/80" />
                         <span className="text-xs uppercase tracking-widest font-semibold text-white/90">{prop.location}</span>
                       </div>
                       <h3 className="text-3xl font-serif italic drop-shadow-md">{prop.title}</h3>
                     </motion.div>
                   ) : (
                     <motion.div 
                       className="text-white hidden md:block md:-rotate-90 md:origin-bottom-left md:absolute md:bottom-12 md:left-14 whitespace-nowrap"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                     >
                       <h3 className="text-xl font-serif tracking-wide">{prop.title}</h3>
                     </motion.div>
                   )}
                 </AnimatePresence>
                 {/* Mobile fallback title when not active */}
                 {!isActive && (
                    <div className="text-white md:hidden font-serif text-xl tracking-wide">
                        {prop.title}
                    </div>
                 )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
