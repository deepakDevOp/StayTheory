import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Star, ArrowLeft, Quote } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileNav from "../components/MobileNav";
import { publicService } from "../services/publicService";

interface AllReviewsProps {
  onBookClick: () => void;
}

export default function AllReviews({ onBookClick }: AllReviewsProps) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const propertyIdFilter = searchParams.get("property");

  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [propertyTitle, setPropertyTitle] = useState<string | null>(null);
  const [propertySlug, setPropertySlug] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (propertyIdFilter) {
          // Fetch property reviews
          const [propReviews, properties] = await Promise.all([
            publicService.getPropertyReviews(propertyIdFilter),
            publicService.getProperties()
          ]);
          setReviews(propReviews);
          const prop = properties.find((p: any) => p.id === propertyIdFilter);
          if (prop) {
            setPropertyTitle(prop.title);
            setPropertySlug(prop.slug);
          }
        } else {
          // Fetch all reviews
          const data = await publicService.getAllReviews();
          setReviews(data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [propertyIdFilter]);

  if (loading) return null;

  return (
    <div className="bg-background min-h-screen">
      <Navbar onBookClick={onBookClick} />
      
      <main className="max-w-7xl mx-auto px-6 md:px-16 py-20 mt-16 md:mt-24">
        <header className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link 
              to={propertySlug ? `/property/${propertySlug}` : "/"} 
              className="inline-flex items-center gap-2 text-stone-500 hover:text-primary transition-colors group w-fit"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] md:text-sm uppercase tracking-widest font-bold">
                {propertySlug ? "Back to sanctuary" : "Back to home"}
              </span>
            </Link>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-serif italic text-primary mb-6"
          >
            {propertyTitle ? `${propertyTitle} Stories` : "Guest Stories"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl text-stone-500 text-lg md:text-xl font-light leading-relaxed"
          >
            {propertyTitle 
              ? `Voices from the ${propertyTitle}. A collection of experiences shared by our guests during their stay.`
              : "Whispers of stillness and moments of clarity. A collection of experiences from those who have shared our space."}
          </motion.p>
        </header>

        <section className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 pb-20">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <motion.div
                key={review.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.8 }}
                className="break-inside-avoid p-8 md:p-10 bg-white/40 backdrop-blur-sm border border-stone-200/60 rounded-3xl hover:border-primary/30 transition-all duration-500 shadow-sm hover:shadow-xl group"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="flex gap-1">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
                </div>

                <p className="text-xl font-serif italic leading-relaxed text-on-surface mb-8">
                  "{review.comment || review.text}"
                </p>

                <div className="pt-8 border-t border-stone-100 flex flex-col gap-2">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">{review.author_name || review.author || "Guest"}</p>
                  {review.property_title && (
                    <Link to={`/property/${review.property_slug || review.property_id}`} className="text-[10px] text-stone-400 hover:text-primary transition-colors uppercase tracking-widest font-medium">
                      At {review.property_title}
                    </Link>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
                <p className="text-stone-400 italic font-serif text-xl">No stories have been shared yet.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
      <MobileNav onBookClick={onBookClick} />
    </div>
  );
}
