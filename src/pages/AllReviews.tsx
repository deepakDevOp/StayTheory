import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Star, ArrowLeft, Quote, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { publicService } from "../services/publicService";
import { getCachedData, setCachedData } from "../utils/preload";
import { useRevalidateOnFocus } from "../hooks/useRevalidateOnFocus";

interface AllReviewsProps {
  onBookClick: () => void;
}

const cardAccents = [
  { border: "border-accent/20", star: "fill-amber-400 text-amber-400", num: "text-accent/30" },
  { border: "border-stone-200", star: "fill-amber-400 text-amber-400", num: "text-stone-200" },
  { border: "border-amber-200/60", star: "fill-amber-400 text-amber-400", num: "text-amber-100" },
  { border: "border-stone-200", star: "fill-amber-300 text-amber-300", num: "text-stone-200" },
];

export default function AllReviews({ onBookClick }: AllReviewsProps) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const propertyIdFilter = searchParams.get("property");

  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [propertyTitle, setPropertyTitle] = useState<string | null>(null);
  const [propertySlug, setPropertySlug] = useState<string | null>(null);

  const cacheKey = `allReviews:${propertyIdFilter || "all"}`;

  const fetchData = useCallback(async (opts?: { showLoading?: boolean }) => {
    if (opts?.showLoading) setLoading(true);
    try {
      if (propertyIdFilter) {
        const [propReviews, properties] = await Promise.all([
          publicService.getPropertyReviews(propertyIdFilter),
          publicService.getProperties()
        ]);
        setReviews(propReviews);
        const prop = properties.find((p: any) => p.id === propertyIdFilter);
        let title: string | null = null;
        let slug: string | null = null;
        if (prop) {
          title = prop.title;
          slug = prop.slug;
          setPropertyTitle(title);
          setPropertySlug(slug);
        }
        setCachedData(cacheKey, { reviews: propReviews, propertyTitle: title, propertySlug: slug });
      } else {
        const data = await publicService.getAllReviews();
        setReviews(data);
        setCachedData(cacheKey, { reviews: data, propertyTitle: null, propertySlug: null });
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      if (opts?.showLoading) setLoading(false);
    }
  }, [propertyIdFilter, cacheKey]);

  useEffect(() => {
    const cached = getCachedData<{ reviews: any[]; propertyTitle: string | null; propertySlug: string | null }>(cacheKey);
    if (cached) {
      setReviews(cached.reviews);
      setPropertyTitle(cached.propertyTitle);
      setPropertySlug(cached.propertySlug);
      setLoading(false);
      fetchData(); // silent background refresh
    } else {
      fetchData({ showLoading: true });
    }
  }, [cacheKey, fetchData]);

  // Picks up admin edits made elsewhere while this page was left open.
  useRevalidateOnFocus(() => fetchData());

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="font-serif italic text-stone-400 text-xl"
      >
        Gathering stories...
      </motion.div>
    </div>
  );

  return (
    <div className="bg-background min-h-screen">
      <Navbar onBookClick={onBookClick} />

      {/* Hero header */}
      <div className="relative overflow-hidden pt-[72px]">
        <div
          className="relative px-6 md:px-16 pt-14 pb-16 md:pt-20 md:pb-24"
          style={{ background: "linear-gradient(160deg, #1a0d08 0%, #3d1a10 40%, #6b2d1e 75%, #8A4630 100%)" }}
        >
          {/* Decorative rings */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[400, 280, 160].map((size, i) => (
              <motion.div
                key={size}
                className="absolute top-1/2 right-12 -translate-y-1/2 rounded-full border border-white/5"
                style={{ width: size, height: size, marginRight: -(size / 2) }}
                animate={{ scale: [1, 1.03, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Link
              to={propertySlug ? `/property/${propertySlug}` : "/"}
              className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] uppercase tracking-widest font-bold">
                {propertySlug ? "Back to sanctuary" : "Back to home"}
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-4 h-4 text-amber-400/70" />
              <span className="text-[9px] uppercase tracking-[0.5em] text-white/40 font-bold">Guest Stories</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif italic text-white mb-4 leading-tight">
              {propertyTitle ? `${propertyTitle}` : "Guest"}
              <br />
              <span className="gradient-text-gold">Stories</span>
            </h1>
            <p className="max-w-xl text-white/50 text-base md:text-lg font-light leading-relaxed">
              {propertyTitle
                ? `Voices from the ${propertyTitle}. A collection of experiences shared by our guests.`
                : "Whispers of stillness and moments of clarity — from those who have shared our space."}
            </p>

            {reviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 mt-6"
              >
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-white/60 text-sm font-medium">{reviews.length} {reviews.length === 1 ? "story" : "stories"}</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Reviews masonry */}
      <main className="max-w-7xl mx-auto px-5 md:px-16 py-12 md:py-16">
        {reviews.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6 pb-16">
            {reviews.map((review, index) => {
              const accent = cardAccents[index % cardAccents.length];
              const rating = review.rating || 5;

              return (
                <motion.div
                  key={review.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.6 }}
                  className={`break-inside-avoid p-6 md:p-8 bg-white border ${accent.border} rounded-3xl hover:shadow-xl transition-all duration-500 shadow-sm group relative overflow-hidden`}
                >
                  {/* Large background number */}
                  <span className={`absolute top-4 right-6 text-[80px] font-serif font-bold leading-none ${accent.num} select-none pointer-events-none`}>
                    {index + 1}
                  </span>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-0.5">
                        {[...Array(rating)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${accent.star}`} />
                        ))}
                      </div>
                      <Quote className="w-7 h-7 text-accent/10 group-hover:text-accent/20 transition-colors fill-current" />
                    </div>

                    <p className="text-lg md:text-xl font-serif italic leading-relaxed text-on-surface mb-8">
                      "{review.comment || review.text}"
                    </p>

                    <div className="flex items-center gap-3 pt-5 border-t border-stone-100">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-amber-500 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                        {(review.author_name || review.author || "G").charAt(0)}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase">
                          {review.author_name || review.author || "Guest"}
                        </p>
                        {review.property_title && (
                          <Link
                            to={`/property/${review.property_slug || review.property_id}`}
                            className="text-[10px] text-stone-400 hover:text-accent transition-colors uppercase tracking-widest font-medium"
                          >
                            at {review.property_title}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-32 text-center">
            <MessageCircle className="w-12 h-12 text-stone-200 mx-auto mb-4" />
            <p className="text-stone-400 italic font-serif text-xl">No stories have been shared yet.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
