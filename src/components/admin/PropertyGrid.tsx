import { Settings, Image as ImageIcon, MapPin } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

interface PropertyGridProps {
  properties: any[];
  onEdit: (p: any) => void;
  onPhotos: (p: any) => void;
}

export default function PropertyGrid({ properties, onEdit, onPhotos }: PropertyGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: containerRef });
  const progressWidth = useTransform(scrollXProgress, [0, 1], ["0%", "100%"]);

  return (
    <div 
      ref={containerRef}
      className="flex gap-12 overflow-x-auto overflow-y-hidden snap-x snap-mandatory py-4 md:py-10 px-[5%] md:px-[15%] no-scrollbar scroll-smooth"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {/* Starting Spacer */}
      <div className="flex-shrink-0 w-[10vw]" />

      {properties.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-shrink-0 w-[85vw] md:w-[600px] snap-center px-4"
        >
          <div className="bg-white rounded-[4rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-stone-100 flex flex-col h-[70vh] relative justify-center items-center text-center p-12">
            <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mb-8">
              <MapPin className="w-10 h-10 text-stone-200" />
            </div>
            <h3 className="text-4xl font-serif italic text-on-surface mb-4">No Sanctuaries Yet</h3>
            <p className="text-stone-500 max-w-sm mb-10 text-lg leading-relaxed">
              Your portfolio of boutique stays is empty. Begin by creating your first luxury sanctuary.
            </p>
            <button 
              onClick={() => onEdit(null)}
              className="px-12 py-5 bg-primary text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-stone-900 transition-all shadow-2xl shadow-primary/30"
            >
              Initialize First Listing
            </button>
          </div>
        </motion.div>
      ) : (
        properties.map((property) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0.5, scale: 0.9, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ root: containerRef, amount: 0.8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex-shrink-0 w-[85vw] md:w-[600px] snap-center px-4"
          >
            <div className="bg-white rounded-[4rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-stone-100 group flex flex-col h-[70vh] relative">
              {/* Image Section (Hero) */}
              <div className="relative h-2/3 overflow-hidden bg-stone-100">
                {/* Blurred background for cinematic feel with varying aspect ratios */}
                <img 
                  src={property.main_image_url || property.coverImage || (property.images?.[0]?.url)} 
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-30 scale-110"
                  alt=""
                />
                <img 
                  src={property.main_image_url || property.coverImage || (property.images?.[0]?.url)} 
                  alt={property.title}
                  className="relative z-10 w-full h-full object-contain group-hover:scale-105 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent" />
                
                <div className="absolute top-8 left-8">
                  <span className="bg-primary/90 backdrop-blur-md text-white text-[7px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                    Active Listing
                  </span>
                </div>

                <div className="absolute bottom-8 right-8">
                  <button 
                    onClick={() => onPhotos(property)}
                    className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-stone-900 transition-all shadow-xl"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-10 flex flex-col justify-between flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-serif italic text-on-surface group-hover:text-primary transition-colors">{property.title}</h3>
                    <div className="flex items-center gap-2 text-stone-400 mt-2">
                      <MapPin className="w-3 h-3" />
                      <span className="text-xs uppercase tracking-widest font-medium">{property.city || 'Udaipur, Rajasthan'}</span>
                    </div>
                    {property.description && (
                      <p className="mt-4 text-stone-500 text-xs line-clamp-2 leading-relaxed">
                        {property.description}
                      </p>
                    )}
                  </div>
                  <button className="p-3 text-stone-200 hover:text-primary transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-1">Nightly Rate</span>
                    <p className="text-xl font-serif italic text-on-surface">₹{(property.price || property.base_nightly_rate || 0).toLocaleString()}<span className="text-sm font-sans not-italic text-stone-400 ml-1">/night</span></p>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => onEdit(property)}
                      className="px-10 py-4 bg-stone-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-lg shadow-stone-200"
                    >
                      Manage Sanctuary
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))
      )}

      {/* Final Spacer */}
      <div className="flex-shrink-0 w-[20vw]" />

      {/* New Era UI Scroll Hint: Progress Bar */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-4 z-10 pointer-events-none">
        <div className="h-0.5 w-48 bg-stone-200/50 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-stone-800"
            style={{ 
              width: progressWidth
            }}
          />
        </div>
        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Swipe to Explore</span>
      </div>
    </div>
  );
}
