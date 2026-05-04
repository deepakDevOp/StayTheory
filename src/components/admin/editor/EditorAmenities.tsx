import { Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface EditorAmenitiesProps {
  selectedAmenities: string[];
  onToggle: (item: string) => void;
  onAdd: (item: string) => void;
}

const AMENITY_OPTIONS = [
  "High Speed Wifi", "Private Pool", "Kitchen Suite", "Parking Space", 
  "Heating & AC", "Fire Pit", "Coffee Bar", "Library"
];

export default function EditorAmenities({ selectedAmenities, onToggle, onAdd }: EditorAmenitiesProps) {
  const [newAmenity, setNewAmenity] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (newAmenity.trim()) {
      onAdd(newAmenity);
      setNewAmenity("");
      setIsAdding(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-8 flex items-center gap-3">
        <div className="w-1.5 h-1.5 bg-primary rounded-full" /> Feature Checklist
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {AMENITY_OPTIONS.concat(selectedAmenities.filter(a => !AMENITY_OPTIONS.includes(a))).map((item) => (
          <label key={item} className={`flex items-center gap-4 p-6 rounded-2xl border transition-all cursor-pointer group ${
            selectedAmenities.includes(item) ? 'bg-white border-primary/20 shadow-sm' : 'bg-stone-50/50 border-stone-100 opacity-60'
          }`}>
            <input 
              type="checkbox" 
              checked={selectedAmenities.includes(item)} 
              onChange={() => onToggle(item)}
              className="w-5 h-5 accent-primary" 
            />
            <span className={`text-sm font-medium transition-colors ${
              selectedAmenities.includes(item) ? 'text-on-surface' : 'text-stone-400'
            }`}>{item}</span>
          </label>
        ))}

        {isAdding ? (
          <div className="flex flex-col gap-2 p-4 bg-white border border-primary/20 rounded-2xl shadow-sm">
            <input 
              autoFocus
              type="text"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Amenity name..."
              className="w-full bg-transparent outline-none text-sm font-medium text-on-surface px-2 py-1"
            />
            <div className="flex gap-2">
              <button onClick={handleAdd} className="flex-grow bg-primary text-white text-[9px] font-bold uppercase tracking-widest py-2 rounded-lg">Add</button>
              <button onClick={() => setIsAdding(false)} className="px-3 text-stone-400 text-[9px] font-bold uppercase tracking-widest">Cancel</button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-stone-100 rounded-2xl text-stone-300 hover:border-primary/20 hover:text-primary transition-all group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">New Amenity</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
