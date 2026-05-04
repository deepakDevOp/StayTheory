import { IndianRupee, Plus, Trash2, Camera, LayoutGrid, Bed, Sofa, Trees, Utensils, Bath, Wind } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef } from "react";

interface EditorGeneralProps {
  property: any;
  photos: { [key: string]: number[] };
  onAddPhoto: (category: string) => void;
  onRemovePhoto: (category: string, id: number) => void;
}

const MASTER_CATEGORIES = [
  { id: "main", label: "Main Gallery", icon: LayoutGrid },
  { id: "bedroom", label: "Bedroom", icon: Bed },
  { id: "living", label: "Living / Hall", icon: Sofa },
  { id: "kitchen", label: "Kitchen", icon: Utensils },
  { id: "bathroom", label: "Bathroom", icon: Bath },
  { id: "balcony", label: "Balcony", icon: Wind },
  { id: "exterior", label: "Exterior", icon: Trees },
];

export default function EditorGeneral({ property, photos, onAddPhoto, onRemovePhoto }: EditorGeneralProps) {
  const [activePhotoTab, setActivePhotoTab] = useState("main");
  const [enabledCategories, setEnabledCategories] = useState<string[]>(["main", "bedroom", "living", "exterior"]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeTabs = MASTER_CATEGORIES.filter(cat => enabledCategories.includes(cat.id));

  const toggleCategory = (id: string) => {
    if (id === "main") return; // Main is always required
    setEnabledCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
    if (activePhotoTab === id && enabledCategories.includes(id)) {
      setActivePhotoTab("main");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
      <input type="file" ref={fileInputRef} onChange={() => onAddPhoto(activePhotoTab)} className="hidden" accept="image/*" />

      {/* Basic Identity */}
      <section>
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-8 flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" /> Basic Identity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Property Name</label>
            <input type="text" defaultValue={property?.title || ""} className="w-full bg-white border border-stone-100 rounded-[1.5rem] px-8 py-5 outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm text-on-surface font-medium" />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Base Nightly Rate</label>
            <div className="relative">
              <IndianRupee className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
              <input type="text" defaultValue={property?.price || ""} className="w-full bg-white border border-stone-100 rounded-[1.5rem] pl-16 pr-8 py-5 outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm text-on-surface font-medium" />
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Room Configurator */}
      <section className="bg-stone-100/50 p-10 rounded-[2.5rem] border border-stone-100">
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-500 mb-8 flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-stone-300 rounded-full" /> Room Configuration (Select Applicable Areas)
        </h3>
        <div className="flex flex-wrap gap-4">
          {MASTER_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all ${
                enabledCategories.includes(cat.id) 
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                  : "bg-white text-stone-400 border-stone-200 hover:border-primary/20"
              }`}
            >
              <cat.icon className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Curated Gallery */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" /> Gallery Management
          </h3>
          
          <div className="flex gap-2 p-1 bg-stone-100 rounded-2xl overflow-x-auto max-w-full no-scrollbar">
            {activeTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivePhotoTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  activePhotoTab === tab.id ? "bg-white text-primary shadow-sm" : "text-stone-400 hover:text-stone-600"
                }`}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square bg-white rounded-[2rem] border-2 border-dashed border-stone-200 flex flex-col items-center justify-center gap-3 text-stone-400 hover:border-primary/30 hover:text-primary transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4">Add to {activePhotoTab}</span>
          </div>

          <AnimatePresence mode="popLayout">
            {(photos[activePhotoTab] || []).map((id) => (
              <motion.div 
                key={id} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                className="aspect-square bg-stone-200 rounded-[2rem] relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <button 
                    onClick={() => onRemovePhoto(activePhotoTab, id)}
                    className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-all hover:scale-110"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute inset-0 flex items-center justify-center"><Camera className="w-8 h-8 text-white/20" /></div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </motion.div>
  );
}
