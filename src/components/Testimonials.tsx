import { useState, useEffect } from "react";
import FocusBox from "./FocusBox";
import { Star, Quote, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { publicService } from "../services/publicService";

const cardStyles = [
  { bg: "bg-white", border: "border-stone-200/60", text: "text-on-surface", sub: "text-stone-400", quote: "text-accent/15 group-hover:text-accent/30" },
  { bg: "bg-stone-950", border: "border-white/8", text: "text-white", sub: "text-stone-500", quote: "text-white/8 group-hover:text-white/15" },
  { bg: "bg-accent/8", border: "border-accent/15", text: "text-stone-800", sub: "text-accent/60", quote: "text-accent/15 group-hover:text-accent/30" },
  { bg: "bg-amber-50", border: "border-amber-100", text: "text-stone-800", sub: "text-amber-600/70", quote: "text-amber-200 group-hover:text-amber-300" },
  { bg: "bg-stone-900", border: "border-stone-700", text: "text-white", sub: "text-stone-500", quote: "text-white/8 group-hover:text-white/15" },
  { bg: "bg-white", border: "border-stone-200/60", text: "text-on-surface", sub: "text-stone-400", quote: "text-accent/15 group-hover:text-accent/30" },
];

const starColors = ["text-amber-400 fill-amber-400", "text-amber-300 fill-amber-300", "text-yellow-400 fill-yellow-400"];

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
    <section id="reviews" className="relative bg-background py-16 md:py-28 overflow-hidden">
      {/* Section divider top */}
      <div className="section-divider mb-0" />

      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent/3 rounded-full blur-[120px]" />
      </div>

      <FocusBox className="max-w-[1440px] mx-auto w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16 px-6 md:px-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-accent/40" />
            <span className="text-[9px] uppercase tracking-[0.5em] font-bold text-accent/70">Experiences</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-accent/40" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif italic text-on-surface mb-6">
            Voices from the Guests
          </h2>
          <Link
            to="/reviews"
            className="inline-flex items-center gap-3 px-6 py-2.5 border border-accent/20 rounded-full hover:border-accent/50 hover:bg-accent/5 transition-all group"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-accent">View All Stories</span>
            <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Reviews scroll */}
        <div className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 md:pb-8 px-6 md:px-16 overscroll-x-contain">
          {reviews.length > 0 ? (
            reviews.map((review, index) => {
              const style = cardStyles[index % cardStyles.length];
              const starColor = starColors[index % starColors.length];
              const rating = review.rating || 5;

              return (
                <div
                  key={review.id || index}
                  className={`min-w-[82vw] sm:min-w-[340px] md:min-w-[380px] max-w-[380px] snap-center p-5 md:p-7 ${style.bg} border ${style.border} rounded-3xl transition-shadow duration-300 hover:shadow-xl shadow-sm shrink-0 flex flex-col justify-between relative group`}
                >
                  <div>
                    {/* Top row */}
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex gap-0.5">
                        {[...Array(rating)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${starColor}`} />
                        ))}
                      </div>
                      <Quote className={`w-7 h-7 ${style.quote} fill-current transition-colors`} />
                    </div>

                    {/* Review text */}
                    <p className={`text-base md:text-lg font-serif italic leading-relaxed ${style.text} mb-5 line-clamp-5`}>
                      "{review.comment || review.text}"
                    </p>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-current/10">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-amber-500 flex items-center justify-center text-white text-[10px] font-bold uppercase shrink-0">
                      {(review.author_name || review.author || "G").charAt(0)}
                    </div>
                    <div>
                      <p className={`text-[10px] font-bold tracking-[0.2em] uppercase ${style.text}`}>
                        {review.author_name || review.author || "Guest"}
                      </p>
                      {review.property_title && (
                        <p className={`text-[9px] ${style.sub} mt-0.5`}>at {review.property_title}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full py-12 text-center opacity-30 italic font-serif text-stone-500 px-6 md:px-16">
              New experiences being curated...
            </div>
          )}
        </div>

        {/* Scroll hint for mobile */}
        {reviews.length > 1 && (
          <div className="flex justify-center mt-4 gap-1.5 md:hidden">
            {reviews.slice(0, Math.min(reviews.length, 5)).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-stone-300" />
            ))}
          </div>
        )}
      </FocusBox>
    </section>
  );
}
