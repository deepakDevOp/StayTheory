import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import FocusBox from "./FocusBox";
import api from "../services/api";

export default function FeatureSection() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get(`/cms/home/interior_balcony?t=${Date.now()}`);
        setContent(response.data);
      } catch (err) {
        console.error("Failed to fetch interior section content:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) return null;

  const displayContent = content || {
    title: "The Balcony",
    subtitle: "Morning rituals accompanied by the gentle breeze of the sanctuary.",
    image_url: `http://${window.location.hostname}:8000/media/sanctuaries/IMG_5732.jpg`
  };

  return (
    <section className="relative px-6 md:px-16 py-20 lg:py-0 max-w-[1440px] mx-auto min-h-screen lg:h-screen flex items-center overflow-hidden bg-background">
      {/* Background Decorative Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <FocusBox className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-center w-full py-12 relative">
        {/* Text Content */}
        <div className="lg:col-span-6 relative z-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-primary/40" />
              <span className="uppercase text-[9px] tracking-[0.5em] font-bold text-primary opacity-70">The Interior</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-[110px] font-serif text-on-surface leading-[0.88] mb-8 md:mb-12 tracking-tight">
              Deliberate <br />
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="italic text-primary/80 block mt-2"
              >
                Spaces.
              </motion.span>
            </h2>
            
            <div className="max-w-md space-y-10 relative">
              <p className="text-on-surface-variant text-lg md:text-xl font-light leading-relaxed">
                Every corner of Stay Theory is a dialogue between light and material. We've removed the clinical sterility of modern hospitality, replacing it with organic textures.
              </p>
              
              <motion.div 
                className="flex items-center gap-8 group cursor-pointer"
                whileHover={{ gap: '3rem' }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                     <div className="w-1.5 h-1.5 rounded-full bg-primary group-hover:bg-white transition-colors" />
                  </div>
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border border-primary/10 -z-10" 
                  />
                </div>
                <span className="uppercase tracking-[0.4em] text-[11px] font-bold text-primary group-hover:tracking-[0.5em] transition-all duration-500">Explore Philosophy</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Visual Content - Overlapping Image Layout */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end relative">
          <div className="relative group">
            {/* Background Frame Ornament */}
            <div className="absolute -top-10 -left-10 -right-10 -bottom-10 border border-primary/5 rounded-[3rem] -z-10" />

            <motion.div
              className="relative rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={displayContent.image_url}
                alt={displayContent.title}
                className="w-full max-w-[480px] aspect-[4/5] object-cover transition-transform duration-[3s] group-hover:scale-110"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
              />
              {/* Subtle Overlay Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </motion.div>

            {/* Background Glow */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10" />
          </div>
        </div>
      </FocusBox>
    </section>
  );
}
