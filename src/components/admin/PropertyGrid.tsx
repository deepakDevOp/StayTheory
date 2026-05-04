import { Settings, Image as ImageIcon, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";

interface PropertyGridProps {
  properties: any[];
  onEdit: (p: any) => void;
  onPhotos: (p: any) => void;
}

export default function PropertyGrid({ properties, onEdit, onPhotos }: PropertyGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className="flex gap-12 overflow-x-auto overflow-y-hidden snap-x snap-mandatory py-10 px-[15%] no-scrollbar scroll-smooth"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {/* Starting Spacer */}
      <div className="flex-shrink-0 w-[10vw]" />

      {properties.map((property) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0.5, scale: 0.9, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ root: containerRef, amount: 0.8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex-shrink-0 w-[450px] md:w-[600px] snap-center px-4"
        >
          <div className="bg-white rounded-[4rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-stone-100 group flex flex-col h-[70vh] relative">
            {/* Image Section (Hero) */}
            <div className="relative h-2/3 overflow-hidden">
              <div className="absolute inset-0 bg-stone-200" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent" />
              
              <div className="absolute top-10 left-10">
                <span className="bg-primary text-white text-[9px] font-bold uppercase tracking-[0.3em] px-6 py-2.5 rounded-full shadow-2xl">
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
                    <span className="text-xs uppercase tracking-widest font-medium">Udaipur, Rajasthan</span>
                  </div>
                </div>
                <button className="p-3 text-stone-200 hover:text-primary transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between mt-8">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-1">Nightly Rate</span>
                  <p className="text-xl font-serif italic text-on-surface">{property.price}<span className="text-sm font-sans not-italic text-stone-400 ml-1">/night</span></p>
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
      ))}

      {/* Final Spacer */}
      <div className="flex-shrink-0 w-[20vw]" />

      {/* New Era UI Scroll Hint: Progress Bar */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <div className="h-0.5 w-48 bg-stone-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            style={{ 
              width: "25%",
              // In a real app, this would be linked to scrollX
            }}
          />
        </div>
        <span className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">Swipe to Explore</span>
      </div>
    </div>
  );
}
