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
      className="flex gap-6 md:gap-12 overflow-x-auto md:overflow-y-hidden snap-x snap-mandatory py-4 md:py-10 px-[4%] md:px-[15%] no-scrollbar scroll-smooth items-start"
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
            className="flex-shrink-0 w-[82vw] md:w-[600px] snap-center px-2 md:px-4"
          >
            <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-[0_20px_60px_-10px_rgba(0,0,0,0.12)] md:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-stone-100 group flex flex-col md:h-[70vh] relative">
              {/* Image Section (Hero) */}
              <div className="relative h-52 md:h-2/3 overflow-hidden bg-stone-100">
                <div className="absolute inset-0 bg-stone-900/5" />
                <img
                  src={property.main_image_url || property.coverImage || (property.images?.[0]?.url)}
                  alt={property.title}
                  className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent" />

                <div className="absolute top-5 left-5 md:top-8 md:left-8">
                  <span className="bg-primary text-white text-[7px] font-bold uppercase tracking-[0.2em] px-3 py-1 md:px-4 md:py-1.5 rounded-full shadow-lg">
                    Active Listing
                  </span>
                </div>

                <div className="absolute bottom-5 right-5 md:bottom-8 md:right-8">
                  <button
                    onClick={() => onPhotos(property)}
                    className="p-3 md:p-4 bg-stone-900/60 rounded-full text-white hover:bg-white hover:text-stone-900 transition-all shadow-xl"
                  >
                    <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 md:p-10 flex flex-col justify-between flex-grow">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-xl md:text-3xl font-serif italic text-on-surface group-hover:text-primary transition-colors leading-tight">{property.title}</h3>
                    <div className="flex items-center gap-2 text-stone-400 mt-1.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="text-xs uppercase tracking-widest font-medium truncate">{property.city || 'Udaipur, Rajasthan'}</span>
                    </div>
                    {property.description && (
                      <p className="mt-2 text-stone-500 text-xs line-clamp-2 leading-relaxed hidden sm:block">
                        {property.description}
                      </p>
                    )}
                  </div>
                  <button className="p-2 text-stone-200 hover:text-primary transition-colors shrink-0">
                    <Settings className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4 md:mt-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-1">Nightly Rate</span>
                    <p className="text-base md:text-xl font-serif italic text-on-surface">₹{(property.price || property.base_nightly_rate || 0).toLocaleString()}<span className="text-xs font-sans not-italic text-stone-400 ml-1">/night</span></p>
                  </div>

                  <button
                    onClick={() => onEdit(property)}
                    className="px-5 py-3 md:px-10 md:py-4 bg-stone-900 text-white rounded-xl md:rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-lg shadow-stone-200"
                  >
                    Manage
                  </button>
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
