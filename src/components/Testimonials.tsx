import { useState, useEffect } from "react";
import FocusBox from "./FocusBox";
import { motion } from "motion/react";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { publicService } from "../services/publicService";

export default function Testimonials() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicService.getAllReviews()
      .then(setReviews)
      .catch(err => console.error("Failed to load reviews:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <section id="reviews" className="px-0 md:px-16 bg-background py-16 md:py-32 border-t border-stone-200">
      <FocusBox className="max-w-[1440px] mx-auto w-full">
        <div className="text-center mb-10 md:mb-20 px-6 md:px-0">
          <span className="uppercase text-[11px] tracking-[0.2em] font-bold text-primary mb-4 block">Experiences</span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif italic text-on-surface mb-6 md:mb-8">Voices from the Guests</h2>
          <Link 
            to="/reviews"
            className="inline-flex items-center gap-3 px-6 py-2 border border-primary/20 rounded-full hover:border-primary/50 transition-all group"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary">View All</span>
            <div className="w-6 h-[1px] bg-primary/20 group-hover:w-10 transition-all" />
          </Link>
        </div>

        <div className="flex gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 md:pb-12 px-6 md:px-0 overscroll-x-contain scroll-smooth">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
                <motion.div
                  key={review.id || index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(index * 0.07, 0.4), duration: 0.5 }}
                  className="min-w-[82vw] sm:min-w-[360px] md:min-w-[400px] max-w-[400px] snap-center p-5 md:p-8 bg-white border border-stone-200/60 rounded-3xl hover:border-primary/30 transition-colors shadow-sm shrink-0 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(review.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-lg md:text-xl font-serif italic leading-relaxed text-on-surface mb-6 font-medium line-clamp-6">
                      "{review.comment || review.text}"
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-[1px] bg-primary/40" />
                    <p className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">{review.author_name || review.author || "GUEST"}</p>
                  </div>
                </motion.div>
            ))
          ) : (
            <div className="w-full py-12 text-center opacity-30 italic font-serif text-stone-500">
              New experiences being curated...
            </div>
          )}
        </div>
      </FocusBox>
    </section>
  );
}
