import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Trash2, CheckCircle, User, Plus, X, Save, ArrowLeft } from "lucide-react";
import AdminHeader from "./AdminHeader";
import { adminService } from "../../services/adminService";
import { format } from "date-fns";

export default function ReviewManager() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    author: "",
    property_id: "",
    rating: 5,
    text: "",
    is_approved: true
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reviewsData, propsData] = await Promise.all([
        adminService.getAllReviews(),
        adminService.getProperties()
      ]);
      setReviews(reviewsData);
      setProperties(propsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.property_id) {
        alert("Please select a sanctuary for this story.");
        return;
    }
    setFormLoading(true);
    try {
      await adminService.createReview(formData);
      setIsAdding(false);
      setFormData({ author: "", property_id: "", rating: 5, text: "", is_approved: true });
      fetchData();
    } catch (error) {
      console.error("Failed to save review:", error);
      alert("Failed to save story. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this story?")) return;
    try {
      await adminService.deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await adminService.approveReview(id);
      fetchData();
    } catch (error) {
      console.error("Failed to approve review:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-stone-100 rounded-full mb-4" />
          <p className="font-serif italic text-stone-400">Opening guest stories...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col">
      <div className="flex-shrink-0">
        <AdminHeader 
          title={isAdding ? "Curate New Story" : "Guest Stories"} 
          subtitle={isAdding ? "Draft a beautiful narrative for your sanctuary." : "Manage and celebrate the experiences of your guests."} 
          showAddButton={!isAdding}
          onAddClick={() => setIsAdding(true)}
        />
      </div>

      <div className="flex-grow overflow-y-auto pr-2 no-scrollbar">
        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-6 md:p-10 rounded-[3rem] border border-stone-100 shadow-sm max-w-4xl"
            >
              <div className="flex justify-between items-center mb-8">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-stone-400 hover:text-primary transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${formData.rating >= star ? 'bg-primary/10 text-primary shadow-inner' : 'bg-stone-50 text-stone-200'}`}
                      >
                        <Star className={`w-4 h-4 ${formData.rating >= star ? 'fill-primary' : ''}`} />
                      </button>
                    ))}
                  </div>
              </div>

              <form onSubmit={handleSaveReview} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Author */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-stone-300 block px-2">Guest Name</label>
                    <input
                      type="text"
                      required
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-6 py-3.5 bg-stone-50 border border-stone-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-serif italic text-base"
                      placeholder="e.g. Sarah Connor"
                    />
                  </div>

                  {/* Property Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-stone-300 block px-2">Sanctuary</label>
                    <select
                      required
                      value={formData.property_id}
                      onChange={(e) => setFormData({ ...formData, property_id: e.target.value })}
                      className="w-full px-6 py-3.5 bg-stone-50 border border-stone-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-serif italic text-base appearance-none"
                    >
                      <option value="">Select Sanctuary</option>
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-stone-300 block px-2">The Story</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    className="w-full px-7 py-5 bg-stone-50 border border-stone-50 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-serif italic text-lg resize-none leading-relaxed"
                    placeholder="Share the guest's experience..."
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full md:w-auto px-10 py-4 rounded-full bg-primary text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-stone-900 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/10 disabled:opacity-50"
                  >
                    {formLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Curate Story</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 gap-6"
            >
              {reviews.length === 0 ? (
                <div className="bg-white py-24 px-12 rounded-[3rem] border border-stone-100 shadow-sm text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-6">
                    <Star className="w-10 h-10 text-stone-200" />
                  </div>
                  <h3 className="text-2xl font-serif italic text-on-surface mb-2">No Guest Stories</h3>
                  <p className="text-stone-400 max-w-sm mx-auto text-sm">
                    You haven't received any reviews yet. Approved guest stories will appear here for your moderation.
                  </p>
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:opacity-70 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Story
                  </button>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col md:flex-row gap-8 group hover:border-primary/20 transition-all duration-500">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                        <User className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-medium text-on-surface text-lg">{review.author || review.user?.name || "Guest"}</h4>
                          <p className="text-xs text-stone-400 font-medium uppercase tracking-widest mt-1">
                            Stayed at <span className="text-primary">{review.property?.title || "Sanctuary"}</span>
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>

                      <p className="text-stone-600 leading-relaxed italic mb-6">
                        "{review.text || review.content}"
                      </p>

                      <div className="flex justify-between items-center pt-6 border-t border-stone-50">
                        <p className="text-[10px] text-stone-300 uppercase tracking-widest font-bold">
                          {review.created_at ? format(new Date(review.created_at), "MMM d, yyyy") : "Recent"}
                        </p>
                        <div className="flex gap-4">
                          {!review.is_approved && (
                            <button 
                              onClick={() => handleApprove(review.id)}
                              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:opacity-80 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(review.id)}
                            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
