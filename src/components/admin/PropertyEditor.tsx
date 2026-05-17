import { useState, useEffect } from "react";
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
  onSaveSuccess?: () => void;
}

import { adminService } from "../../services/adminService";

export default function PropertyEditor({ isOpen, onClose, property, onSaveSuccess }: PropertyEditorProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);

  // Unified Form State
  const [formData, setFormData] = useState({
    title: property?.title || "",
    subtitle: property?.subtitle || "",
    description: property?.description || "",
    base_nightly_rate: property?.base_nightly_rate || "0",
    max_guests: property?.max_guests || 2,
    bedrooms: property?.bedrooms || 1,
    bathrooms: property?.bathrooms || 1,
    beds: property?.beds || 1,
    property_type: property?.property_type || "Villa",
    city: property?.city || "",
    address: property?.address || "",
    google_maps_url: property?.google_maps_url || "",
    airbnb_url: property?.airbnb_url || "",
    map_image: property?.map_image || "",
    coverImage: property?.images?.find((img: any) => img.is_primary)?.url || property?.images?.[0]?.url || "",
    amenities: property?.amenities || [],
    rules: property?.rules || [],
    availability: property?.availability?.map((a: any) => a.date) || [],
    images: property?.images || [] // This will be an array of {url: string}
  });

  useEffect(() => {
    if (property) {
      setFormData({
        ...formData,
        ...property,
        coverImage: property.images?.find((img: any) => img.is_primary)?.url || property.images?.[0]?.url || "",
        availability: property.availability?.map((a: any) => a.date) || [],
        base_nightly_rate: property.base_nightly_rate ? String(property.base_nightly_rate) : "0",
        beds: property.beds || property.bedrooms || 1
      });
    }
  }, [property]);

  const handlePhotoUpload = async (file: File, category: string) => {
    try {
      const { url } = await adminService.uploadMedia(file);
      if (category === 'map_internal') {
        setFormData(prev => ({ ...prev, map_image: url }));
      } else if (category === 'cover_internal') {
        setFormData(prev => ({ ...prev, coverImage: url }));
      } else {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, { url, category }]
        }));
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image.");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      // Prepare final images list
      let finalImages = [...formData.images];
      if (formData.coverImage) {
        // Find if this image already exists to get its original category
        const existingImg = formData.images.find(img => img.url === formData.coverImage);
        const originalCategory = existingImg?.category || 'main';

        // Remove the cover image from images if it's already there to avoid duplicates
        finalImages = finalImages.filter(img => img.url !== formData.coverImage);
        
        // Add it back as primary with its original category preserved
        finalImages.unshift({
          url: formData.coverImage,
          category: originalCategory,
          is_primary: true,
          order: 0
        });
      }

      const payload = {
        ...formData,
        slug,
        images: finalImages,
        base_nightly_rate: parseFloat(String(formData.base_nightly_rate)) || 0,
        max_guests: parseInt(String(formData.max_guests)) || 1,
        bedrooms: parseInt(String(formData.bedrooms)) || 1,
        bathrooms: parseInt(String(formData.bathrooms)) || 1,
        beds: parseInt(String(formData.beds)) || 1,
      };

      if (property?.id) {
        console.info("HITTING UPDATE API for ID:", property.id);
        console.log("PAYLOAD:", payload);
        await adminService.updateProperty(property.id, payload);
      } else {
        console.info("HITTING CREATE API");
        console.log("PAYLOAD:", payload);
        await adminService.createProperty(payload);
      }
      
      onSaveSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Save failed:", error);
      const errorMsg = error.response?.data?.detail?.[0]?.msg || error.response?.data?.detail || "Check console for details.";
      alert(`Failed to save property: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

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
        className="fixed inset-0 z-[100] flex items-center justify-center md:p-4"
      >
        {/* Deep Backdrop for silhouette */}
        <div className="absolute inset-0 bg-stone-900/95 backdrop-blur-md" onClick={onClose} />
 
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full h-[100dvh] md:h-full bg-white md:rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col md:border-[6px] md:border-white ring-1 ring-stone-200"
        >
          {/* Top Accent Line */}
          <div className="h-1.5 w-full bg-primary" />
          
          {/* Header */}
          <div className="px-6 py-6 md:px-12 md:py-10 border-b border-stone-100 flex justify-between items-start md:items-center bg-white">
            <div className="w-full">
              <h2 className="text-3xl md:text-4xl font-serif italic text-on-surface">{property ? property.title : 'New Sanctuary'}</h2>
              <div className="flex gap-6 md:gap-8 mt-6 overflow-x-auto no-scrollbar w-full pr-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all pb-2 border-b-2 whitespace-nowrap flex-shrink-0 ${activeTab === tab.id ? "text-primary border-primary" : "text-stone-300 border-transparent hover:text-stone-500"
                      }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={onClose} className="p-3 md:p-4 hover:bg-stone-50 rounded-full transition-all group absolute top-4 right-4 md:static">
              <X className="w-5 h-5 md:w-6 md:h-6 text-stone-300 group-hover:text-stone-900 group-hover:rotate-90 transition-all duration-500" />
            </button>
          </div>

          {/* Tab Content Rendering */}
          <div className="flex-grow overflow-y-auto p-6 md:p-12 bg-stone-50/30 no-scrollbar">
            {activeTab === "general" && (
              <EditorGeneral
                formData={formData}
                setFormData={setFormData}
                onPhotoUpload={handlePhotoUpload}
              />
            )}
            {activeTab === "availability" && (
              <EditorAvailability
                blockedDates={formData.availability}
                onToggleDate={(dateStr) => setFormData(prev => ({
                  ...prev,
                  availability: prev.availability.includes(dateStr) 
                    ? prev.availability.filter(d => d !== dateStr) 
                    : [...prev.availability, dateStr]
                }))} 
              />
            )}
            {activeTab === "amenities" && (
              <EditorAmenities
                selectedAmenities={formData.amenities}
                onToggle={(item) => setFormData(prev => ({
                  ...prev,
                  amenities: prev.amenities.includes(item) ? prev.amenities.filter(a => a !== item) : [...prev.amenities, item]
                }))}
                onAdd={(item) => setFormData(prev => ({ ...prev, amenities: [...prev.amenities, item] }))}
              />
            )}
            {activeTab === "rules" && (
              <EditorRules
                rules={formData.rules} 
                onAddRule={(rule) => setFormData(prev => ({ ...prev, rules: [...prev.rules, rule] }))}
                onRemoveRule={(i) => setFormData(prev => ({ ...prev, rules: prev.rules.filter((_, idx) => idx !== i) }))}
              />
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 md:px-12 md:py-10 border-t border-stone-100 bg-white flex flex-col-reverse md:flex-row justify-between items-center gap-4">
            <button onClick={onClose} className="w-full md:w-auto text-[10px] font-bold text-stone-400 uppercase tracking-widest hover:text-red-500 transition-colors py-2 md:py-0">
              Discard Changes
            </button>
            <button 
              onClick={handleSave}
              disabled={loading}
              className={`w-full md:w-auto flex items-center justify-center gap-2 md:gap-3 bg-primary text-white px-8 md:px-12 py-3 md:py-4 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/30 flex-1 md:flex-none ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "Saving..." : <><Save className="w-4 h-4" /> Save Sanctuary</>}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
