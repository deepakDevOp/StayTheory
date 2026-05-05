import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Star, Trash2, CheckCircle, User } from "lucide-react";
import AdminHeader from "./AdminHeader";
import { adminService } from "../../services/adminService";
import { format } from "date-fns";

const mockReviews = [
  {
    id: "REV-001",
    user: { name: "Sarah Connor" },
    property: { title: "The Tuscan Retreat" },
    rating: 5,
    content: "An absolute dream! The views from the balcony are surreal, and the house itself is incredibly cozy.",
    created_at: "2024-05-01T10:00:00Z",
    is_approved: true
  },
  {
    id: "REV-002",
    user: { name: "David Lister" },
    property: { title: "Ocean Sanctuary" },
    rating: 4,
    content: "Beautiful property. The steps down to the beach are steep, but it's worth it for the private cove.",
    created_at: "2024-05-05T14:30:00Z",
    is_approved: false
  }
];

export default function ReviewManager() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

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
      fetchReviews();
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <AdminHeader 
        title="Guest Stories" 
        subtitle="Manage and celebrate the experiences of your guests." 
      />

      <div className="grid grid-cols-1 gap-6">
        {reviews.length === 0 ? (
          <div className="bg-white py-24 px-12 rounded-[3rem] border border-stone-100 shadow-sm text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-6">
              <Star className="w-10 h-10 text-stone-200" />
            </div>
            <h3 className="text-2xl font-serif italic text-on-surface mb-2">No Guest Stories</h3>
            <p className="text-stone-400 max-w-sm mx-auto text-sm">
              You haven't received any reviews yet. Approved guest stories will appear here for your moderation.
            </p>
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
                    <h4 className="font-medium text-on-surface text-lg">{review.user?.name || "Guest"}</h4>
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
                  "{review.content}"
                </p>

                <div className="flex justify-between items-center pt-6 border-t border-stone-50">
                  <p className="text-[10px] text-stone-300 uppercase tracking-widest font-bold">
                    {format(new Date(review.created_at), "MMM d, yyyy")}
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
      </div>
    </motion.div>
  );
}
