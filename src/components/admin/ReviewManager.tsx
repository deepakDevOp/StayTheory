import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Trash2, CheckCircle, User, Plus, Save, ArrowLeft, ChevronRight, MapPin, Calendar } from "lucide-react";
import { adminService } from "../../services/adminService";
import { format } from "date-fns";

export default function ReviewManager() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    author_name: "", property_id: "", rating: 5, comment: "", is_approved: true
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

  useEffect(() => { fetchData(); }, []);

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.property_id) { alert("Please select a sanctuary."); return; }
    setFormLoading(true);
    try {
      await adminService.createReview(formData);
      setIsAdding(false);
      setFormData({ author_name: "", property_id: "", rating: 5, comment: "", is_approved: true });
      fetchData();
    } catch { alert("Failed to save story."); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await adminService.deleteReview(deleteTargetId);
      setReviews(prev => prev.filter(r => r.id !== deleteTargetId));
      if (expandedId === deleteTargetId) setExpandedId(null);
    } catch (error) { console.error(error); }
    finally { setDeleteTargetId(null); }
  };

  const handleApprove = async (id: string) => {
    try { await adminService.approveReview(id); fetchData(); }
    catch (error) { console.error(error); }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
          className="font-serif italic text-stone-400">Opening guest stories...</motion.div>
      </div>
    );
  }

  // ── ADD FORM ─────────────────────────────────────────────
  if (isAdding) {
    return (
      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="h-full flex flex-col">
        {/* Header */}
        <div className="shrink-0 px-1 pt-1 pb-4">
          <button onClick={() => setIsAdding(false)}
            className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-4 active:opacity-60">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Stories
          </button>
          <h1 className="text-2xl font-serif italic text-accent">Curate New Story</h1>
          <p className="text-xs text-stone-400 mt-0.5">Draft a guest narrative for your sanctuary.</p>
        </div>

        <div className="flex-grow overflow-y-auto no-scrollbar">
          <form onSubmit={handleSaveReview} className="space-y-4 pb-8">
            {/* Rating */}
            <div className="bg-white rounded-2xl p-4 border border-stone-100">
              <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-stone-300 mb-3">Rating</p>
              <div className="flex gap-3">
                {[1,2,3,4,5].map(star => (
                  <button key={star} type="button" onClick={() => setFormData({ ...formData, rating: star })}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 ${formData.rating >= star ? "bg-primary/10" : "bg-stone-50"}`}>
                    <Star className={`w-4 h-4 ${formData.rating >= star ? "fill-primary text-primary" : "text-stone-200"}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Guest name */}
            <div className="bg-white rounded-2xl p-4 border border-stone-100">
              <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-stone-300 block mb-2">Guest Name</label>
              <input type="text" required
                value={formData.author_name}
                onChange={e => setFormData({ ...formData, author_name: e.target.value })}
                className="w-full bg-stone-50 rounded-xl px-4 py-3 font-serif italic text-base focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="e.g. Sarah Connor" />
            </div>

            {/* Sanctuary */}
            <div className="bg-white rounded-2xl p-4 border border-stone-100">
              <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-stone-300 block mb-2">Sanctuary</label>
              <select required value={formData.property_id}
                onChange={e => setFormData({ ...formData, property_id: e.target.value })}
                className="w-full bg-stone-50 rounded-xl px-4 py-3 font-serif italic text-base focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                <option value="">Select Sanctuary</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>

            {/* Story text */}
            <div className="bg-white rounded-2xl p-4 border border-stone-100">
              <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-stone-300 block mb-2">The Story</label>
              <textarea required rows={5}
                value={formData.comment}
                onChange={e => setFormData({ ...formData, comment: e.target.value })}
                className="w-full bg-stone-50 rounded-xl px-4 py-3 font-serif italic text-base focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
                placeholder="Share the guest's experience..." />
            </div>

            <button type="submit" disabled={formLoading}
              className="w-full py-4 bg-stone-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-50">
              {formLoading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Save className="w-4 h-4" /><span>Curate Story</span></>}
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  // ── LIST VIEW ────────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col">
      {/* Header */}
      <div className="shrink-0 pb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-serif italic text-accent leading-tight">Guest Stories</h1>
          <p className="text-xs text-stone-400 mt-0.5">{reviews.length} {reviews.length === 1 ? "story" : "stories"} collected</p>
        </div>
        <button onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-900 text-white rounded-full text-[9px] font-bold uppercase tracking-widest active:scale-95 transition-transform shrink-0 mt-1">
          <Plus className="w-3.5 h-3.5" /> New
        </button>
      </div>

      {/* Delete confirmation popup */}
      <AnimatePresence>
        {deleteTargetId && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDeleteTargetId(null)}
            />
            {/* Sheet */}
            <motion.div
              className="relative w-full max-w-sm mx-4 mb-8 bg-white rounded-3xl p-6 shadow-2xl"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-serif italic text-accent text-center mb-1">Remove Story?</h3>
              <p className="text-sm text-stone-400 text-center leading-relaxed mb-6">
                This guest story will be permanently deleted and cannot be recovered.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTargetId(null)}
                  className="flex-1 py-3 rounded-2xl bg-stone-100 text-stone-600 text-[11px] font-bold uppercase tracking-wider active:scale-95 transition-transform"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 rounded-2xl bg-red-500 text-white text-[11px] font-bold uppercase tracking-wider active:scale-95 transition-transform"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-grow overflow-y-auto no-scrollbar -mx-1 px-1">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
              <Star className="w-7 h-7 text-stone-300" />
            </div>
            <h3 className="text-xl font-serif italic text-accent mb-2">No Guest Stories</h3>
            <p className="text-stone-400 text-sm leading-relaxed max-w-xs mb-6">
              Approved guest reviews will appear here.
            </p>
            <button onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-full text-[9px] font-bold uppercase tracking-widest">
              <Plus className="w-3.5 h-3.5" /> Add First Story
            </button>
          </div>
        ) : (
          <div className="space-y-3 pb-6">
            {reviews.map((review, idx) => {
              const isOpen = expandedId === review.id;
              const name = review.author_name || review.author || review.user?.name || "Guest";
              const property = review.property_title || review.property?.title || "Sanctuary";
              const date = review.created_at ? format(new Date(review.created_at), "MMM d, yyyy") : "Recent";
              const text = review.comment || review.text || review.content || "";

              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${isOpen ? "border-accent/20 shadow-md shadow-accent/5" : "border-stone-100 shadow-sm"}`}
                >
                  {/* Row — tap to expand */}
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-stone-50 transition-colors"
                    onClick={() => setExpandedId(isOpen ? null : review.id)}
                  >
                    {/* Avatar */}
                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isOpen ? "bg-accent/10" : "bg-stone-100"}`}>
                      <User className={`w-4.5 h-4.5 ${isOpen ? "text-accent" : "text-stone-400"}`} style={{ width: 18, height: 18 }} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[14px] text-accent truncate">{name}</span>
                        {!review.is_approved && (
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-600 text-[8px] font-bold uppercase tracking-wider rounded-full shrink-0">Pending</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 mb-1">
                        <MapPin className="w-2.5 h-2.5 text-stone-400 shrink-0" />
                        <span className="text-[10px] text-stone-400 truncate">{property}</span>
                      </div>
                      {text && !isOpen && (
                        <p className="text-[11px] text-stone-500 italic leading-snug line-clamp-2">
                          "{text}"
                        </p>
                      )}
                    </div>

                    {/* Stars + chevron */}
                    <div className="shrink-0 flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-2.5 h-2.5 ${i < review.rating ? "fill-primary text-primary" : "text-stone-200"}`} />
                        ))}
                      </div>
                      <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.25 }}>
                        <ChevronRight className="w-4 h-4 text-stone-300" />
                      </motion.div>
                    </div>
                  </button>

                  {/* Expanded content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="detail"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <div className="px-4 pb-4 pt-1">
                          {/* Divider */}
                          <div className="h-px bg-stone-100 mb-3" />

                          {/* Review text */}
                          <p className="text-stone-600 text-sm leading-relaxed italic mb-4">
                            "{text || "No review text provided."}"
                          </p>

                          {/* Meta + actions */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-stone-300">
                              <Calendar className="w-3 h-3" />
                              <span className="text-[10px] uppercase tracking-wider font-bold">{date}</span>
                            </div>

                            <div className="flex items-center gap-3">
                              {!review.is_approved && (
                                <button onClick={() => handleApprove(review.id)}
                                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500 active:opacity-60">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  Approve
                                </button>
                              )}
                              <button onClick={() => setDeleteTargetId(review.id)}
                                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-300 hover:text-red-400 active:opacity-60 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
