import { IndianRupee, Plus, Trash2, Camera, LayoutGrid, Bed, Sofa, Trees, Utensils, Bath, Wind, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect, useMemo } from "react";

interface EditorGeneralProps {
  formData: any;
  setFormData: (data: any) => void;
  onPhotoUpload: (file: File, category: string) => Promise<void>;
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

const PROPERTY_TYPES = ["Villa", "Apartment", "Cottage", "Studio", "Boutique Hotel", "Private Sanctuary"];

export default function EditorGeneral({ formData, setFormData, onPhotoUpload }: EditorGeneralProps) {
  const [activePhotoTab, setActivePhotoTab] = useState("main");
  const [enabledCategories, setEnabledCategories] = useState<string[]>([]);

  useEffect(() => {
    // Dynamically enable categories based on existing images
    const existingCategories = Array.from(new Set(formData.images.map((img: any) => img.category)));
    // Ensure 'main' and a few defaults are always there, plus whatever is in the data
    const defaults = ["main", "bedroom", "living"];
    const combined = Array.from(new Set([...defaults, ...existingCategories]));
    setEnabledCategories(combined as string[]);
  }, [formData.images]);
  const [uploading, setUploading] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeTabs = MASTER_CATEGORIES.filter(cat => enabledCategories.includes(cat.id));

  // Filter images based on active tab
  const displayImages = useMemo(() => {
    if (activePhotoTab === "main") return formData.images;
    return formData.images.filter((img: any) => img.category === activePhotoTab);
  }, [formData.images, activePhotoTab]);

  const toggleCategory = (id: string) => {
    if (id === "main") return; // Main is always required
    setEnabledCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
    if (activePhotoTab === id && enabledCategories.includes(id)) {
      setActivePhotoTab("main");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
      {/* Gallery Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        multiple
        onChange={async (e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            setUploading(true);
            try {
              await Promise.all(Array.from(files).map(file => onPhotoUpload(file, activePhotoTab)));
            } finally {
              setUploading(false);
            }
          }
          if (fileInputRef.current) fileInputRef.current.value = "";
        }} 
        className="hidden" 
        accept="image/*" 
      />

      {/* Cover Image Input */}
      <input 
        type="file"
        id="cover-upload"
        onChange={async (e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            setUploading(true);
            try {
              await onPhotoUpload(files[0], 'cover_internal');
            } finally {
              setUploading(false);
            }
          }
        }}
        className="hidden"
        accept="image/*"
      />

      {/* Map Screenshot Input */}
      <input 
        type="file"
        id="map-upload"
        onChange={async (e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            setUploading(true);
            try {
              await onPhotoUpload(files[0], 'map_internal');
            } finally {
              setUploading(false);
            }
          }
        }}
        className="hidden"
        accept="image/*"
      />

      {/* Basic Identity */}
      <section>
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-8 flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" /> Basic Identity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Property Name</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Moon Retreat"
              className="w-full bg-white border border-stone-100 rounded-[1.5rem] px-8 py-5 outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm text-on-surface font-medium" 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Subtitle / Catchphrase</label>
            <input 
              type="text" 
              value={formData.subtitle} 
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="e.g. A Riverside Sanctuary"
              className="w-full bg-white border border-stone-100 rounded-[1.5rem] px-8 py-5 outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm text-on-surface font-medium" 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Base Nightly Rate</label>
            <div className="relative">
              <IndianRupee className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
              <input 
                type="text" 
                value={formData.base_nightly_rate} 
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setFormData({ ...formData, base_nightly_rate: val });
                }}
                className="w-full bg-white border border-stone-100 rounded-[1.5rem] pl-16 pr-8 py-5 outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm text-on-surface font-medium" 
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">City</label>
            <input 
              type="text" 
              value={formData.city} 
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="e.g. Udaipur"
              className="w-full bg-white border border-stone-100 rounded-[1.5rem] px-8 py-5 outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm text-on-surface font-medium" 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Property Type</label>
            <div className="relative" ref={dropdownRef}>
              <div 
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                className="w-full bg-white border border-stone-100 rounded-[1.5rem] px-8 py-5 outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm text-on-surface font-medium flex justify-between items-center cursor-pointer group"
              >
                <span>{formData.property_type || "Select Type"}</span>
                <ChevronDown className={`w-4 h-4 text-stone-300 transition-transform duration-500 ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {isTypeDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-white border border-stone-100 rounded-[1.5rem] shadow-2xl overflow-hidden z-50 p-2"
                  >
                    {PROPERTY_TYPES.map(type => (
                      <button
                        key={type}
                        onClick={() => {
                          setFormData({ ...formData, property_type: type });
                          setIsTypeDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-6 py-4 rounded-xl hover:bg-stone-50 transition-colors text-sm"
                      >
                        <span className={formData.property_type === type ? "text-primary font-bold" : "text-stone-600"}>{type}</span>
                        {formData.property_type === type && <Check className="w-4 h-4 text-primary" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Full Address</label>
            <input 
              type="text" 
              value={formData.address} 
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. Near Lake Pichola, Udaipur"
              className="w-full bg-white border border-stone-100 rounded-[1.5rem] px-8 py-5 outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm text-on-surface font-medium" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-10">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Max Guests</label>
            <input 
              type="number" 
              value={formData.max_guests} 
              onChange={(e) => setFormData({ ...formData, max_guests: parseInt(e.target.value) || 1 })}
              className="w-full bg-white border border-stone-100 rounded-[1.5rem] px-8 py-5 outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm text-on-surface font-medium" 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Bedrooms</label>
            <input 
              type="number" 
              value={formData.bedrooms} 
              onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 1 })}
              className="w-full bg-white border border-stone-100 rounded-[1.5rem] px-8 py-5 outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm text-on-surface font-medium" 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Bathrooms</label>
            <input 
              type="number" 
              value={formData.bathrooms} 
              onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 1 })}
              className="w-full bg-white border border-stone-100 rounded-[1.5rem] px-8 py-5 outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm text-on-surface font-medium" 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Total Beds</label>
            <input 
              type="number" 
              value={formData.beds} 
              onChange={(e) => setFormData({ ...formData, beds: parseInt(e.target.value) || 1 })}
              className="w-full bg-white border border-stone-100 rounded-[1.5rem] px-8 py-5 outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm text-on-surface font-medium" 
            />
          </div>
        </div>

        <div className="mt-10 space-y-3">
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Description</label>
          <textarea 
            rows={4}
            value={formData.description} 
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Tell the story of this sanctuary..."
            className="w-full bg-white border border-stone-100 rounded-[1.5rem] px-8 py-5 outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm text-on-surface font-medium resize-none" 
          />
        </div>
      </section>
      
      {/* Showcase Identity */}
      <section>
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-8 flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" /> Main Showcase Identity
        </h3>
        <div 
          onClick={() => !uploading && document.getElementById('cover-upload')?.click()}
          className="relative h-64 w-full bg-stone-100 rounded-[2.5rem] border-2 border-dashed border-stone-200 overflow-hidden group cursor-pointer hover:border-primary/30 transition-all"
        >
          {formData.coverImage ? (
            <>
              <img src={formData.coverImage} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-sm">
                <Camera className="w-8 h-8 mb-3" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Change Showcase Image</span>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 group-hover:text-primary transition-colors">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <p className="font-serif italic text-lg mb-1">Select Cinematic Cover</p>
              <p className="text-[9px] uppercase tracking-[0.2em] font-bold">Recommended: 16:9 High Resolution</p>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Uploading Showcase...</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Location Identity */}
      <section>
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-8 flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" /> Location Identity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Google Maps URL</label>
            <input 
              type="text" 
              value={formData.google_maps_url} 
              onChange={(e) => setFormData({ ...formData, google_maps_url: e.target.value })}
              placeholder="e.g. https://goo.gl/maps/..."
              className="w-full bg-white border border-stone-100 rounded-[1.5rem] px-8 py-5 outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm text-on-surface font-medium" 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Location Map Screenshot</label>
            <div className="flex gap-4">
              <div 
                onClick={() => !uploading && document.getElementById('map-upload')?.click()}
                className="flex-grow bg-white border border-stone-100 rounded-[1.5rem] px-8 py-5 flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-all group"
              >
                <span className="text-on-surface font-medium overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
                  {formData.map_image ? "Image Selected" : "Upload Map Screenshot"}
                </span>
                <Camera className="w-5 h-5 text-stone-300 group-hover:text-primary transition-colors" />
              </div>
              {formData.map_image && (
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-stone-100 shrink-0 shadow-sm relative group">
                  <img src={formData.map_image} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setFormData({ ...formData, map_image: "" })}
                    className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
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
          {/* Only show upload button if not in Main Gallery */}
          {activePhotoTab !== "main" && (
            <div 
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`aspect-square bg-white rounded-[2rem] border-2 border-dashed border-stone-200 flex flex-col items-center justify-center gap-3 text-stone-400 hover:border-primary/30 hover:text-primary transition-all cursor-pointer group ${uploading ? 'opacity-50 cursor-wait' : ''}`}
            >
              <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                <Plus className={`w-6 h-6 transition-transform ${uploading ? 'animate-spin' : 'group-hover:rotate-90'}`} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4">
                {uploading ? "Uploading..." : `Add to ${MASTER_CATEGORIES.find(c => c.id === activePhotoTab)?.label}`}
              </span>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {displayImages.length === 0 && !uploading && (
              <div className={`col-span-2 md:col-span-3 flex items-center px-6 ${activePhotoTab === "main" ? "md:col-span-4" : ""}`}>
                <p className="text-stone-300 italic text-sm font-serif">
                  {activePhotoTab === "main" 
                    ? "Upload photos to specific categories (Bedroom, Living, etc.) to see them appear here in the Main Gallery."
                    : "This category is empty. Select it and upload your first photo to bring this sanctuary to life."}
                </p>
              </div>
            )}
            {displayImages.map((img: any) => (
              <motion.div 
                key={img.url} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                className="aspect-square bg-stone-200 rounded-[2rem] relative group overflow-hidden"
              >
                <img src={img.url} alt="Gallery item" className="w-full h-full object-cover" />
                
                {/* Always show category tag in main gallery */}
                {activePhotoTab === "main" && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-white/80 backdrop-blur-md text-[8px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-lg text-stone-600 border border-white">
                      {img.category}
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <button 
                    onClick={() => setFormData({ ...formData, images: formData.images.filter((i: any) => i.url !== img.url) })}
                    className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-all hover:scale-110"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </motion.div>
  );
}
