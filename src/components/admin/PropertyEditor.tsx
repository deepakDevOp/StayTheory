import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Save, Calendar, ShieldCheck, Image as ImageIcon, CheckCircle2 } from "lucide-react";

// Modular Sub-components
import EditorGeneral from "./editor/EditorGeneral";
import EditorAvailability from "./editor/EditorAvailability";
import EditorAmenities from "./editor/EditorAmenities";
import EditorRules from "./editor/EditorRules";

interface PropertyEditorProps {
  isOpen: boolean;
  onClose: () => void;
  property?: any;
}

export default function PropertyEditor({ isOpen, onClose, property }: PropertyEditorProps) {
  const [activeTab, setActiveTab] = useState("general");

  // Shared Management States
  const [blockedDates, setBlockedDates] = useState<number[]>([12, 13, 14]);
  const [amenities, setAmenities] = useState<string[]>([
    "High Speed Wifi", "Private Pool", "Kitchen Suite", "Parking Space"
  ]);
  const [rules, setRules] = useState<string[]>([
    "No smoking indoors", "Check-in after 2:00 PM", "Check-out before 11:00 AM"
  ]);
  const [newRule, setNewRule] = useState("");
  const [photos, setPhotos] = useState<{ [key: string]: number[] }>({
    main: [1, 2],
    bedroom: [3],
    living: [4],
    exterior: [5]
  });

  if (!isOpen) return null;

  const tabs = [
    { id: "general", label: "General Info", icon: ImageIcon },
    { id: "availability", label: "Availability", icon: Calendar },
    { id: "amenities", label: "Amenities", icon: CheckCircle2 },
    { id: "rules", label: "Rules & Discounts", icon: ShieldCheck },
  ];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4"
      >
        {/* Deep Backdrop for silhouette */}
        <div className="absolute inset-0 bg-stone-900/95 backdrop-blur-md" onClick={onClose} />
 
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full h-full bg-white rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-stone-200"
        >
          {/* Top Accent Line */}
          <div className="h-1.5 w-full bg-primary" />
          
          {/* Header */}
          <div className="px-12 py-10 border-b border-stone-100 flex justify-between items-center bg-white">
            <div>
              <h2 className="text-4xl font-serif italic text-on-surface">{property ? property.title : 'New Sanctuary'}</h2>
              <div className="flex gap-8 mt-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all pb-2 border-b-2 ${activeTab === tab.id ? "text-primary border-primary" : "text-stone-300 border-transparent hover:text-stone-500"
                      }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={onClose} className="p-4 hover:bg-stone-50 rounded-full transition-all group">
              <X className="w-6 h-6 text-stone-300 group-hover:text-stone-900 group-hover:rotate-90 transition-all duration-500" />
            </button>
          </div>

          {/* Tab Content Rendering */}
          <div className="flex-grow overflow-y-auto p-12 bg-stone-50/30 no-scrollbar">
            {activeTab === "general" && (
              <EditorGeneral
                property={property}
                photos={photos}
                onAddPhoto={(cat) => setPhotos(p => ({ ...p, [cat]: [...p[cat], Math.random()] }))}
                onRemovePhoto={(cat, id) => setPhotos(p => ({ ...p, [cat]: p[cat].filter(x => x !== id) }))}
              />
            )}
            {activeTab === "availability" && (
              <EditorAvailability
                blockedDates={blockedDates}
                onToggleDate={(day) => setBlockedDates(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
              />
            )}
            {activeTab === "amenities" && (
              <EditorAmenities
                selectedAmenities={amenities}
                onToggle={(item) => setAmenities(prev => prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item])}
                onAdd={(item) => setAmenities(prev => [...prev, item])}
              />
            )}
            {activeTab === "rules" && (
              <EditorRules
                rules={rules} newRule={newRule}
                onNewRuleChange={setNewRule}
                onAddRule={() => { if (newRule.trim()) { setRules(r => [...r, newRule]); setNewRule(""); } }}
                onRemoveRule={(i) => setRules(r => r.filter((_, idx) => idx !== i))}
              />
            )}
          </div>

          {/* Footer */}
          <div className="px-12 py-10 border-t border-stone-100 bg-white flex justify-between items-center">
            <button onClick={onClose} className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-600 transition-colors">Discard Changes</button>
            <button className="flex items-center gap-3 bg-primary text-white px-12 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/30">
              <Save className="w-4 h-4" /> Save Sanctuary
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
