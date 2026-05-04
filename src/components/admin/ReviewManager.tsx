import { motion } from "motion/react";
import { Star, Trash2, MessageCircle, User } from "lucide-react";
import AdminHeader from "./AdminHeader";

const reviews = [
  { id: 1, author: "Elena V.", rating: 5, property: "The Tuscan Retreat", text: "An architectural masterpiece that somehow feels like coming home. The light in the living hall is transformative.", date: "May 12, 2024" },
  { id: 2, author: "Marcus D.", rating: 5, property: "The Tuscan Retreat", text: "Stay Theory isn't just a place to sleep; it's a reset button for the soul.", date: "May 10, 2024" },
  { id: 3, author: "Sarah K.", rating: 4, property: "Ocean Sanctuary", text: "Waking up in the master bedroom was pure poetry in motion. Highly recommend.", date: "May 08, 2024" },
];

export default function ReviewManager() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <AdminHeader 
        title="Guest Stories" 
        subtitle="Manage and celebrate the experiences of your guests." 
      />

      <div className="grid grid-cols-1 gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col md:flex-row gap-8 group hover:border-primary/20 transition-all duration-500">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                <User className="w-6 h-6" />
              </div>
            </div>

            <div className="flex-grow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-medium text-on-surface text-lg">{review.author}</h4>
                  <p className="text-xs text-stone-400 font-medium uppercase tracking-widest mt-1">
                    Stayed at <span className="text-primary">{review.property}</span>
                  </p>
                </div>
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                  ))}
                </div>
              </div>

              <p className="text-stone-600 leading-relaxed italic mb-6">
                "{review.text}"
              </p>

              <div className="flex justify-between items-center pt-6 border-t border-stone-50">
                <p className="text-[10px] text-stone-300 uppercase tracking-widest font-bold">{review.date}</p>
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-primary transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    Reply
                  </button>
                  <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
