import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Star, Save, User } from "lucide-react";
import { adminService } from "../../services/adminService";

interface ReviewEditorProps {
  isOpen: boolean;
  onClose: () => void;
  properties: any[];
  onSaveSuccess: () => void;
}

export default function ReviewEditor({ isOpen, onClose, properties, onSaveSuccess }: ReviewEditorProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    author: "",
    property_id: "",
    rating: 5,
    text: "",
    is_approved: true
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.property_id) {
        alert("Please select a property for this review.");
        return;
    }
    setLoading(true);
    try {
      await adminService.createReview({
        author: formData.author,
        property_id: formData.property_id,
        rating: formData.rating,
        text: formData.text,
        is_approved: formData.is_approved
      });
      onSaveSuccess();
      onClose();
      setFormData({ author: "", property_id: "", rating: 5, text: "", is_approved: true });
    } catch (error) {
      console.error("Failed to save review:", error);
      alert("Failed to save review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-stone-100"
          >
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-3xl font-serif italic text-stone-800">Add Guest Story</h2>
                  <p className="text-stone-400 text-xs uppercase tracking-widest font-bold mt-1">Curate a new experience</p>
                </div>
                <button 
                  onClick={onClose}
                  className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:bg-stone-900 hover:text-white transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-8">
                {/* Author */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 block px-2">Guest Name</label>
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                    <input
                      type="text"
                      required
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full pl-14 pr-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-serif italic text-lg"
                      placeholder="e.g. Sarah Connor"
                    />
                  </div>
                </div>

                {/* Property Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 block px-2">Associate Sanctuary</label>
                  <select
                    required
                    value={formData.property_id}
                    onChange={(e) => setFormData({ ...formData, property_id: e.target.value })}
                    className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-serif italic text-lg appearance-none"
                  >
                    <option value="">Select a Property</option>
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                {/* Rating */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 block px-2 text-center">Sanctuary Rating</label>
                  <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${formData.rating >= star ? 'bg-primary/10 text-primary shadow-inner' : 'bg-stone-50 text-stone-200'}`}
                      >
                        <Star className={`w-6 h-6 ${formData.rating >= star ? 'fill-primary' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 block px-2">The Story</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    className="w-full px-6 py-5 bg-stone-50 border border-stone-100 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-serif italic text-lg resize-none"
                    placeholder="Share the guest's experience..."
                  />
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 rounded-full bg-primary text-white font-bold uppercase tracking-[0.2em] text-sm hover:bg-stone-900 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Curate Story</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
