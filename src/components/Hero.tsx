import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { propertiesData } from "../data/properties";

const properties = propertiesData.map(p => ({
  id: p.id,
  title: p.title,
  location: p.nearby[0]?.name || "Destination",
  description: p.subtitle,
  image: p.coverImage
}));

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const lastWheelTime = useRef(0);
  const navigate = useNavigate();

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % properties.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + properties.length) % properties.length);
  }, []);

  useEffect(() => {
    // Start interval immediately, but first change will be after 2000ms
    const timer = setInterval(nextSlide, 2000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Only handle significant horizontal scrolling to prevent interference with vertical page scroll
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

  const variants = {
    center: {
      x: "0%",
      scale: 1.15,
      opacity: 1,
      filter: "blur(0px)",
      zIndex: 10,
    },
    left: {
      x: "-70%",
      scale: 0.75,
      opacity: 0.5,
      filter: "blur(5px)",
      zIndex: 5,
    },
    right: {
      x: "70%",
      scale: 0.75,
      opacity: 0.5,
      filter: "blur(5px)",
      zIndex: 5,
    },
    hiddenLeft: {
      x: "-90%",
      scale: 0.55,
      opacity: 0,
      filter: "blur(10px)",
      zIndex: 0,
    },
    hiddenRight: {
      x: "90%",
      scale: 0.55,
      opacity: 0,
      filter: "blur(10px)",
      zIndex: 0,
    }
  };

  return (
    <section 
      className="relative h-[calc(100vh-72px)] flex flex-col justify-center overflow-hidden bg-surface-dim/30"
      onWheel={handleWheel}
    >
      {/* Background Blur Image corresponding to active slide */}
      <AnimatePresence mode="popLayout">
        <motion.img
          key={`bg-${activeIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          src={properties[activeIndex].image}
          className="absolute inset-0 w-full h-full object-cover blur-3xl scale-110 pointer-events-none"
          alt=""
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>

      <div className="relative w-full h-full flex items-center justify-center">
        {properties.map((prop, idx) => {
          const variant = getVariant(idx);
          const isActive = variant === "center";
          
          return (
            <motion.div
              key={prop.id}
              className="absolute w-[80vw] md:w-[60vw] h-[70vh] md:h-[75vh] rounded-[2rem] overflow-hidden shadow-2xl cursor-pointer"
              variants={variants}
              initial={false}
              animate={variant}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => {
                if (variant === "left") prevSlide();
                if (variant === "right") nextSlide();
                if (variant === "center") navigate(`/property/${prop.id}`);
              }}
              drag={isActive ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  nextSlide();
                } else if (swipe > swipeConfidenceThreshold) {
                  prevSlide();
                }
              }}
            >
              <img 
                src={prop.image} 
                alt={prop.title}
                className="w-full h-full object-cover pointer-events-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent pointer-events-none" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 text-center pointer-events-none">
                <motion.div 
                  initial={false}
                  animate={{ 
                    opacity: isActive ? 1 : 0, 
                    y: isActive ? 0 : 20 
                  }}
                  transition={{ duration: 0.5, delay: isActive ? 0.2 : 0 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-4 text-white/90">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-[0.2em] font-semibold">{prop.location}</span>
                  </div>
                  <h2 className="text-white text-4xl md:text-7xl font-serif italic mb-6 leading-tight drop-shadow-lg">
                    {prop.title}
                  </h2>
                  <p className="text-white/90 text-base md:text-lg font-light tracking-wide max-w-2xl mx-auto drop-shadow-md">
                    {prop.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {properties.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${activeIndex === idx ? "w-8 bg-on-surface" : "w-2 bg-on-surface/30 hover:bg-on-surface/50"}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
