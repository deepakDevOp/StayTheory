import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, ArrowRight } from "lucide-react";
import { publicService } from "../services/publicService";

export default function PropertyCollection() {
  const [properties, setProperties] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const data = await publicService.getProperties();
        
        const placeholders = [
          {
            id: 'placeholder-1',
            title: 'Desert Echo',
            city: 'Jaisalmer',
            images: [{ url: '/desert_echo.png' }],
            isPlaceholder: true
          },
          {
            id: 'placeholder-2',
            title: 'Misty Ridge',
            city: 'Coorg',
            images: [{ url: '/misty_ridge.png' }],
            isPlaceholder: true
          },
          {
            id: 'placeholder-3',
            title: 'Coastal Whisper',
            city: 'Gokarna',
            images: [{ url: '/coastal_whisper.png' }],
            isPlaceholder: true
          }
        ];
        
        setProperties([...data.slice(0, 5), ...placeholders]);
      } catch (error) {
        console.error("Failed to fetch public properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

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
    <section className="h-screen w-full px-8 md:px-16 py-12 md:py-16 max-w-[1600px] mx-auto bg-background flex flex-col overflow-hidden">
      {/* Header Section - More Compact */}
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

      {/* Main Accordion Area - Takes remaining space */}
      <div className="flex flex-col md:flex-row flex-1 w-full gap-4 md:gap-5 min-h-0 overflow-hidden">
        {properties.map((p, idx) => {
          const isActive = activeIndex === idx;
          const image = p.images?.find((img: any) => img.is_primary)?.url || p.images?.[0]?.url || p.coverImage || "";
          const location = p.city || "India";
          
          return (
            <motion.div
              key={p.id}
              className={`relative rounded-[2rem] md:rounded-[3rem] overflow-hidden ${p.isPlaceholder ? 'cursor-default' : 'cursor-pointer'} shadow-2xl shadow-black/5`}
              onHoverStart={() => {
                setActiveIndex(idx);
                setIsHovered(true);
              }}
              onHoverEnd={() => setIsHovered(false)}
              onClick={() => {
                if (!p.isPlaceholder) {
                  navigate(`/property/${p.slug}`);
                }
              }}
              animate={{
                flexGrow: isActive ? 6 : 1,
                flexBasis: isActive ? '20%' : '5%'
              }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Overlay Gradients */}
              <div 
                className="absolute inset-0 z-10 transition-opacity duration-1000" 
                style={{ 
                  background: isActive 
                    ? 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.85) 100%)' 
                    : 'rgba(0,0,0,0.45)',
                  opacity: isActive ? 1 : 0.6
                }} 
              />
              
              {/* Image Container with Parallax Effect */}
              <motion.div 
                className="absolute inset-0 w-full h-full"
                animate={{ scale: isActive ? 1.05 : 1.2 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                <img 
                  src={image} 
                  alt={p.title}
                  className={`w-full h-full object-cover object-center transition-all duration-1000 ${p.isPlaceholder ? 'grayscale brightness-75 contrast-[1.1] blur-[1px]' : ''}`}
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              
              {/* Content Overlays */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-10 pointer-events-none">
                <AnimatePresence mode="wait">
                  {isActive ? (
                    <motion.div 
                      key="active-info"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="text-white"
                    >
                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-primary" />
                          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-white">{location}</span>
                        </div>
                        {(p.isPlaceholder || p.airbnb_url) && (
                           <div className="px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30">
                              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-primary-light whitespace-nowrap">
                                {p.airbnb_url ? "Direct Booking Coming Soon" : "Coming Soon"}
                              </span>
                           </div>
                        )}
                      </div>
                      
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-2 leading-tight">
                        {p.title}
                      </h3>
                      
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: 40 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="h-[2px] bg-primary mb-4"
                      />
                      
                      {!p.isPlaceholder && (
                        <p className="text-white/70 text-sm max-w-sm font-light leading-relaxed mb-4 hidden lg:block">
                          A curated sanctuary designed for ultimate serenity and architectural beauty.
                        </p>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="inactive-info"
                      className="text-white hidden md:block md:-rotate-90 md:origin-bottom-left md:absolute md:bottom-12 md:left-12 whitespace-nowrap"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      exit={{ opacity: 0 }}
                    >
                      <h3 className="text-xl font-serif tracking-widest uppercase text-[11px] opacity-60">
                        {p.title}
                      </h3>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Mobile Title View */}
                {!isActive && (
                   <div className="text-white md:hidden font-serif text-xl tracking-wide opacity-80 mb-2">
                       {p.title}
                   </div>
                )}
              </div>

              {/* Decorative Pulsing Dot */}
              {isActive && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-6 right-6 md:top-10 md:right-10 z-30"
                >
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}


