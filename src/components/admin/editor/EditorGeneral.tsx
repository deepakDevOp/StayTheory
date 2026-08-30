import { IndianRupee, Plus, Minus, Trash2, GripVertical, Camera, LayoutGrid, Bed, Sofa, Trees, Utensils, Bath, Wind, ChevronDown, Check, Sun } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect, useMemo } from "react";
import { optimizeImageUrl } from "../../../utils/preload";
import ConfirmModal from "../ConfirmModal";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  { id: "rooftop", label: "Rooftop", icon: Sun },
  { id: "exterior", label: "Exterior", icon: Trees },
];

const PROPERTY_TYPES = ["Villa", "Apartment", "Cottage", "Studio", "Boutique Hotel", "Private Sanctuary"];

function SortableImageTile({ img, idx, showCategoryBadge, onDelete }: {
  img: any;
  idx: number;
  showCategoryBadge: boolean;
  onDelete: (img: any) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: img.url });

  // A plain div, not motion.div — Framer Motion sets up its own internal
  // pointer/gesture handling on motion.* elements, which competes with
  // dnd-kit's own pointer listeners on the same node and is why dragging
  // wasn't activating reliably. dnd-kit's own transform/transition (from
  // useSortable) fully covers the drag animation we need here.
  //
  // {...attributes}/{...listeners} live on the grip handle below, NOT this
  // outer div. Putting them on the whole tile meant touch-scrolling and
  // dnd-kit's drag were both trying to own the same gesture with no
  // touch-action boundary between them, which is what caused the
  // flicker/snap-back — the tile's CSS transform kept getting fought over
  // between the browser's native scroll handling and dnd-kit. A dedicated
  // handle with touch-action: none scoped to just that small element avoids
  // the conflict entirely while leaving the rest of the tile fully
  // scrollable.
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`aspect-square bg-stone-200 rounded-[2rem] relative group overflow-hidden transition-opacity duration-200 ${isDragging ? "opacity-40" : "opacity-100"}`}
    >
      {/* Serve gallery thumbnails at 400px — avoids decoding multi-MB originals at 200px display size */}
      <img
        src={optimizeImageUrl(img.url, 400)}
        alt="Gallery item"
        decoding="async"
        loading={idx < 8 ? "eager" : "lazy"}
        className="w-full h-full object-cover pointer-events-none"
      />

      {showCategoryBadge && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-white shadow-md text-[8px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-lg text-stone-600 border border-stone-100">
            {img.category}
          </span>
        </div>
      )}

      {/* Drag handle — press and drag this to reorder. touch-none is scoped
          to just this small element, so it doesn't block scrolling the
          gallery when you touch anywhere else on the photo. */}
      <button
        {...attributes}
        {...listeners}
        className="absolute bottom-2 left-2 z-10 p-2 bg-stone-900/80 rounded-full text-white shadow-lg cursor-grab active:cursor-grabbing touch-none"
        title="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="absolute inset-0 bg-black/20 md:opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Always visible — hover-only would never show on touch devices (tablets/phones), where the admin panel is also used.
          Stops the pointerdown from bubbling to the tile so tapping delete never gets mistaken for the start of a drag. */}
      <button
        onClick={() => onDelete(img)}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute top-2 right-2 z-10 p-2 bg-stone-900/80 rounded-full text-white hover:bg-red-500 transition-all hover:scale-110 shadow-lg"
        title="Remove photo"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

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
  const [imageToDelete, setImageToDelete] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeTabs = MASTER_CATEGORIES.filter(cat => enabledCategories.includes(cat.id));

  // Filter images based on active tab
  const displayImages = useMemo(() => {
    if (activePhotoTab === "main") return formData.images;
    return formData.images.filter((img: any) => img.category === activePhotoTab);
  }, [formData.images, activePhotoTab]);

  // Dragging is triggered only from the dedicated grip handle (see
  // SortableImageTile), not the whole tile. A handle press unambiguously
  // means "drag" — no delay needed to disambiguate from scrolling, since
  // scrolling never starts from that handle. A small distance threshold
  // just avoids treating a plain tap as a drag.
  const dndSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  // Drag-reorders within the currently displayed (category-filtered) view,
  // then writes that new order back into the underlying full images array —
  // that array's order is what gets saved and is what the public property
  // page displays photos in.
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setFormData((prev: any) => {
      const visible = activePhotoTab === "main"
        ? prev.images
        : prev.images.filter((i: any) => i.category === activePhotoTab);
      const oldIndex = visible.findIndex((i: any) => i.url === active.id);
      const newIndex = visible.findIndex((i: any) => i.url === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      const reordered = arrayMove(visible, oldIndex, newIndex);

      // Drop the reordered subset back into the same full-array slots it
      // came from, in sequence, leaving other categories' images untouched.
      let subsetIdx = 0;
      const newImages = prev.images.map((img: any) =>
        (activePhotoTab === "main" || img.category === activePhotoTab) ? reordered[subsetIdx++] : img
      );
      return { ...prev, images: newImages };
    });
  };

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

  const inputCls = "w-full bg-white border border-stone-100 rounded-xl md:rounded-[1.5rem] px-4 md:px-8 py-3 md:py-5 outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm text-on-surface font-medium text-sm";
  const labelCls = "text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1";

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 md:space-y-12">
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
              await Promise.all(Array.from(files).map((file: any) => onPhotoUpload(file, activePhotoTab)));
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
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-4 md:mb-8 flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" /> Basic Identity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
          <div className="space-y-2">
            <label className={labelCls}>Property Name</label>
            <input type="text" value={formData.title}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Moon Retreat" className={inputCls} />
          </div>
          <div className="space-y-2">
            <label className={labelCls}>Subtitle / Catchphrase</label>
            <input type="text" value={formData.subtitle}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, subtitle: e.target.value }))}
              placeholder="e.g. A Riverside Sanctuary" className={inputCls} />
          </div>
          <div className="space-y-2">
            <label className={labelCls}>Base Nightly Rate</label>
            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
              <input type="text" value={formData.base_nightly_rate}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setFormData((prev: any) => ({ ...prev, base_nightly_rate: val }));
                }}
                className={inputCls + " pl-10 md:pl-12"} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10 mt-4 md:mt-10">
          <div className="space-y-2">
            <label className={labelCls}>City</label>
            <input type="text" value={formData.city}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, city: e.target.value }))}
              placeholder="e.g. Udaipur" className={inputCls} />
          </div>
          <div className="space-y-2">
            <label className={labelCls}>Property Type</label>
            <div className="relative" ref={dropdownRef}>
              <div onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                className={inputCls + " flex justify-between items-center cursor-pointer"}>
                <span>{formData.property_type || "Select Type"}</span>
                <ChevronDown className={`w-4 h-4 text-stone-300 transition-transform duration-300 ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              <AnimatePresence>
                {isTypeDropdownOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-100 rounded-2xl shadow-2xl overflow-hidden z-50 p-1">
                    {PROPERTY_TYPES.map(type => (
                      <button key={type} onClick={() => { setFormData((prev: any) => ({ ...prev, property_type: type })); setIsTypeDropdownOpen(false); }}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-stone-50 transition-colors text-sm">
                        <span className={formData.property_type === type ? "text-primary font-bold" : "text-stone-600"}>{type}</span>
                        {formData.property_type === type && <Check className="w-4 h-4 text-primary" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="space-y-2">
            <label className={labelCls}>Full Address</label>
            <input type="text" value={formData.address}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, address: e.target.value }))}
              placeholder="e.g. Near Lake Pichola, Udaipur" className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-10 mt-4 md:mt-10">
          {[
            { label: "Max Guests", key: "max_guests", min: 1 },
            { label: "Bedrooms", key: "bedrooms", min: 0 },
            { label: "Bathrooms", key: "bathrooms", min: 0 },
            { label: "Total Beds", key: "beds", min: 0 },
          ].map(({ label, key, min }) => (
            <div key={key} className="space-y-2">
              <label className={labelCls}>{label}</label>
              <div className={inputCls + " !py-2 flex items-center justify-between gap-2"}>
                <button
                  type="button"
                  onClick={() => setFormData((prev: any) => ({ ...prev, [key]: Math.max(min, (parseInt(prev[key]) || min) - 1) }))}
                  className="w-8 h-8 shrink-0 rounded-full bg-stone-100 text-stone-500 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  value={(formData as any)[key]}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, [key]: Math.max(min, parseInt(e.target.value) || min) }))}
                  className="w-full text-center bg-transparent outline-none font-medium [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => setFormData((prev: any) => ({ ...prev, [key]: (parseInt(prev[key]) || min) + 1 }))}
                  className="w-8 h-8 shrink-0 rounded-full bg-stone-100 text-stone-500 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 md:mt-10 space-y-2">
          <label className={labelCls}>Description</label>
          <textarea rows={3}
            value={formData.description}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
            placeholder="Tell the story of this sanctuary..."
            className={inputCls + " resize-none"} />
        </div>
      </section>
      
      {/* Showcase Identity */}
      <section>
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-4 md:mb-8 flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" /> Main Showcase Identity
        </h3>
        <div
          onClick={() => !uploading && document.getElementById('cover-upload')?.click()}
          className="relative h-48 md:h-64 w-full bg-stone-100 rounded-2xl md:rounded-[2.5rem] border-2 border-dashed border-stone-200 overflow-hidden group cursor-pointer hover:border-primary/30 transition-all"
        >
          {formData.coverImage ? (
            <>
              <img src={formData.coverImage} decoding="async" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
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
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
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
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-4 md:mb-8 flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" /> Location Identity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
          <div className="space-y-2">
            <label className={labelCls}>Google Maps URL</label>
            <input type="text" value={formData.google_maps_url}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, google_maps_url: e.target.value }))}
              placeholder="https://goo.gl/maps/..." className={inputCls} />
          </div>
          <div className="space-y-2">
            <label className={labelCls}>Airbnb URL</label>
            <input type="text" value={formData.airbnb_url}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, airbnb_url: e.target.value }))}
              placeholder="https://www.airbnb.com/rooms/..." className={inputCls} />
          </div>
          <div className="space-y-2">
            <label className={labelCls}>Location Map Screenshot</label>
            <div className="flex gap-3">
              <div onClick={() => !uploading && document.getElementById('map-upload')?.click()}
                className={inputCls + " flex-1 flex items-center justify-between cursor-pointer hover:bg-stone-50"}>
                <span className="truncate text-stone-500 text-sm">{formData.map_image ? "Image Selected" : "Upload Map Screenshot"}</span>
                <Camera className="w-4 h-4 text-stone-300 shrink-0 ml-2" />
              </div>
              {formData.map_image && (
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden border border-stone-100 shrink-0 shadow-sm relative group">
                  <img src={formData.map_image} decoding="async" className="w-full h-full object-cover" />
                  <button onClick={() => setFormData((prev: any) => ({ ...prev, map_image: "" }))}
                    className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Room Configurator */}
      <section className="bg-stone-100/50 p-4 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-stone-100">
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-500 mb-4 md:mb-8 flex items-center gap-3">
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-6 mb-4 md:mb-8">
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

        <DndContext sensors={dndSensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={displayImages.map((img: any) => img.url)} strategy={rectSortingStrategy}>
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
                {displayImages.map((img: any, idx: number) => (
                  <SortableImageTile
                    key={img.url}
                    img={img}
                    idx={idx}
                    showCategoryBadge={activePhotoTab === "main"}
                    onDelete={setImageToDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        </DndContext>
      </section>

      <ConfirmModal
        isOpen={!!imageToDelete}
        onClose={() => setImageToDelete(null)}
        onConfirm={() => {
          setFormData((prev: any) => ({ ...prev, images: prev.images.filter((i: any) => i.url !== imageToDelete.url) }));
          setImageToDelete(null);
        }}
        title="Remove this photo?"
        message="It will be removed from the gallery once you save. The image itself is only deleted from storage after you click Save Sanctuary — nothing is lost until then."
        confirmLabel="Remove Photo"
        cancelLabel="Keep It"
      />
    </motion.div>
  );
}
