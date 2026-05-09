import { 
  Plus, Wifi, Tv, UtensilsCrossed, WashingMachine, Wind, Waves, Car, 
  Dumbbell, Briefcase, Droplets, CloudRain, Layout, ArrowUp, Cctv, 
  Bell, PlusCircle, Flame, Thermometer, Zap, Mic2, Coffee, 
  Volume2, Monitor, Snowflake, Bath, Bed, Lock, Trash2
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface EditorAmenitiesProps {
  selectedAmenities: string[];
  onToggle: (item: string) => void;
  onAdd: (item: string) => void;
}

const AMENITY_CATEGORIES = [
  {
    title: "Connectivity & Tech",
    options: [
      { name: "High Speed Wifi", icon: Wifi },
      { name: "TV", icon: Tv },
      { name: "Sound System", icon: Volume2 },
      { name: "Dedicated Workspace", icon: Briefcase },
      { name: "Monitor", icon: Monitor },
    ]
  },
  {
    title: "Kitchen & Dining",
    options: [
      { name: "Kitchen", icon: UtensilsCrossed },
      { name: "Coffee Maker", icon: Coffee },
      { name: "Microwave", icon: Zap },
      { name: "Refrigerator", icon: Snowflake },
    ]
  },
  {
    title: "Climate & Comfort",
    options: [
      { name: "Air Conditioning", icon: Wind },
      { name: "Heating", icon: Thermometer },
      { name: "Hot Water", icon: CloudRain },
      { name: "Bed Linens", icon: Bed },
    ]
  },
  {
    title: "Bathroom & Laundry",
    options: [
      { name: "Washing Machine", icon: WashingMachine },
      { name: "Bathtub", icon: Bath },
      { name: "Shampoo", icon: Droplets },
      { name: "Hair Dryer", icon: Wind },
    ]
  },
  {
    title: "Outdoor & Facilities",
    options: [
      { name: "Private Pool", icon: Waves },
      { name: "Private Patio or Balcony", icon: Layout },
      { name: "Lift", icon: ArrowUp },
      { name: "Parking", icon: Car },
      { name: "Gym", icon: Dumbbell },
    ]
  },
  {
    title: "Safety & Security",
    options: [
      { name: "Security Cameras", icon: Cctv },
      { name: "Smoke Alarm", icon: Bell },
      { name: "First Aid Kit", icon: PlusCircle },
      { name: "Fire Extinguisher", icon: Flame },
    ]
  }
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
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" /> Feature Checklist
        </h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
        >
          <Plus className="w-3 h-3" /> Custom Amenity
        </button>
      </div>

      {isAdding && (
        <div className="p-6 bg-white border border-primary/20 rounded-2xl shadow-xl flex gap-4 items-center animate-in slide-in-from-top-4">
          <input 
            autoFocus
            type="text"
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="E.g. Yoga Studio"
            className="flex-grow bg-stone-50 outline-none text-sm font-medium text-on-surface px-4 py-3 rounded-xl border border-stone-100"
          />
          <button onClick={handleAdd} className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-xl">Add</button>
          <button onClick={() => setIsAdding(false)} className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">Cancel</button>
        </div>
      )}

      {AMENITY_CATEGORIES.map((cat) => (
        <div key={cat.title}>
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-6">{cat.title}</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cat.options.map((opt) => {
              const isSelected = selectedAmenities.some(a => a.toLowerCase().includes(opt.name.toLowerCase()));
              return (
                <label key={opt.name} className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer group ${
                  isSelected ? 'bg-white border-primary/20 shadow-sm' : 'bg-stone-50/50 border-stone-100 opacity-60 hover:opacity-100'
                }`}>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={isSelected} 
                      onChange={() => onToggle(opt.name)}
                      className="w-5 h-5 accent-primary opacity-0 absolute inset-0 cursor-pointer z-10" 
                    />
                    <div className={`w-5 h-5 rounded border transition-colors flex items-center justify-center ${
                      isSelected ? 'bg-primary border-primary' : 'bg-white border-stone-200'
                    }`}>
                      {isSelected && <Lock className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 overflow-hidden">
                    <opt.icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-primary' : 'text-stone-300'}`} />
                    <span className={`text-[11px] font-bold uppercase tracking-widest truncate transition-colors ${
                      isSelected ? 'text-on-surface' : 'text-stone-400'
                    }`}>{opt.name}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {/* Show custom amenities that aren't in the predefined list */}
      {selectedAmenities.filter(a => !AMENITY_CATEGORIES.some(c => c.options.some(o => a.toLowerCase().includes(o.name.toLowerCase())))).length > 0 && (
        <div>
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-6">Custom Amenities</h4>
          <div className="flex flex-wrap gap-3">
            {selectedAmenities.filter(a => !AMENITY_CATEGORIES.some(c => c.options.some(o => a.toLowerCase().includes(o.name.toLowerCase())))).map(item => (
              <div key={item} className="flex items-center gap-3 bg-white border border-primary/20 px-4 py-2 rounded-full shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface">{item}</span>
                <button onClick={() => onToggle(item)} className="p-1 hover:text-red-500 transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
