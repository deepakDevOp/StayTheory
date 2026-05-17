import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Image as ImageIcon, Save, CheckCircle, Upload, AlertCircle } from "lucide-react";
import { adminService } from "../../services/adminService";

export default function CMSManager() {
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchCMS();
  }, []);

  const fetchCMS = async () => {
    try {
      const data = await adminService.getCMSContent();
      setContent(data);
    } catch (err) {
      console.error("Failed to fetch CMS content:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleUpdate = async (key: string, data: any) => {
    setSaving(true);
    setMessage(null);
    try {
      await adminService.updateCMSContent(key, data);
      setMessage({ type: 'success', text: "Section updated successfully!" });
      fetchCMS();
    } catch (err) {
      setMessage({ type: 'error', text: "Failed to update section." });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (key: string, file: File) => {
    setSaving(true);
    try {
      const { url } = await adminService.uploadMedia(file);
      await handleUpdate(key, { image_url: url });
    } catch (err) {
      setMessage({ type: 'error', text: "Failed to upload image." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-64 flex items-center justify-center italic text-stone-400">Loading home page settings...</div>;

  return (
    <div className="space-y-12 pb-24">
      <header className="mb-12">
        <h2 className="text-3xl font-serif italic mb-2">Home Page Management</h2>
        <p className="text-stone-500 text-sm">Update text and imagery for your main landing sections.</p>
      </header>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl flex items-center gap-3 mb-8 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
        >
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{message.text}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-12">
        {content.map((section) => (
          <SectionEditor 
            key={section.id} 
            section={section} 
            onSave={(data: any) => handleUpdate(section.section_key, data)}
            onImageUpload={(file: File) => handleImageUpload(section.section_key, file)}
            isSaving={saving}
          />
        ))}
      </div>
    </div>
  );
}

function SectionEditor({ section, onSave, onImageUpload, isSaving }: any) {
  const [formData, setFormData] = useState({
    title: section.title,
    subtitle: section.subtitle,
    image_url: section.image_url
  });

  // Sync with prop updates (crucial for showing new images after upload)
  useEffect(() => {
    setFormData({
      title: section.title,
      subtitle: section.subtitle,
      image_url: section.image_url
    });
  }, [section]);

  return (
    <div className="bg-white rounded-[2rem] border border-stone-100 overflow-hidden shadow-sm flex flex-col md:flex-row md:h-[450px]">
      {/* Image Preview / Upload */}
      <div className="md:w-1/2 relative bg-stone-50 group h-64 md:h-full">
        <img 
          src={formData.image_url} 
          alt={section.title} 
          className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100" 
        />
        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white">
          <Upload className="w-8 h-8 mb-2" />
          <span className="text-xs font-bold uppercase tracking-widest">Replace Photo</span>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={(e) => e.target.files?.[0] && onImageUpload(e.target.files[0])} 
          />
        </label>
        <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase tracking-widest">
          {section.section_key.replace('_', ' ')}
        </div>
      </div>

      {/* Content Form */}
      <div className="md:w-1/2 p-10 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Section Title</label>
            <input 
              className="w-full text-2xl font-serif border-b border-stone-100 focus:border-primary outline-none py-2 transition-colors"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Description / Subtitle</label>
            <textarea 
              rows={3}
              className="w-full text-sm text-stone-500 leading-relaxed border-none focus:ring-0 outline-none resize-none bg-stone-50/50 p-4 rounded-xl"
              value={formData.subtitle}
              onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
            />
          </div>
        </div>

        <button 
          onClick={() => onSave(formData)}
          disabled={isSaving}
          className="mt-8 self-end px-8 py-3 bg-primary text-white rounded-full flex items-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span className="text-sm font-bold uppercase tracking-widest">Save Changes</span>
        </button>
      </div>
    </div>
  );
}
