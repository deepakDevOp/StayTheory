import { motion } from "motion/react";
import { Star, ArrowLeft, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileNav from "../components/MobileNav";
import { propertiesData } from "../data/properties";

interface AllReviewsProps {
  onBookClick: () => void;
}

import { useLocation } from "react-router-dom";

export default function AllReviews({ onBookClick }: AllReviewsProps) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const propertyIdFilter = searchParams.get("property");

  // Aggregate all reviews from all properties
  const allReviews = propertiesData
    .filter(p => !propertyIdFilter || p.id === propertyIdFilter)
    .flatMap(property => 
      property.reviews.map(review => ({
        ...review,
        propertyTitle: property.title,
        propertyId: property.id
      }))
    );

  const filteredPropertyTitle = propertyIdFilter ? propertiesData.find(p => p.id === propertyIdFilter)?.title : null;

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
              to={propertyIdFilter ? `/property/${propertyIdFilter}` : "/"} 
              className="inline-flex items-center gap-2 text-stone-500 hover:text-primary transition-colors group w-fit"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] md:text-sm uppercase tracking-widest font-bold">
                {propertyIdFilter ? "Back to sanctuary" : "Back to home"}
              </span>
            </Link>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-serif italic text-primary mb-6"
          >
            {filteredPropertyTitle ? `${filteredPropertyTitle} Stories` : "Guest Stories"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl text-stone-500 text-lg md:text-xl font-light leading-relaxed"
          >
            {filteredPropertyTitle 
              ? `Voices from the ${filteredPropertyTitle}. A collection of experiences shared by our guests during their stay.`
              : "Whispers of stillness and moments of clarity. A collection of experiences from those who have shared our space."}
          </motion.p>
        </header>

        <section className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 pb-20">
          {allReviews.map((review, index) => (
            <motion.div
              key={`${review.propertyId}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.8 }}
              className="break-inside-avoid p-8 md:p-10 bg-white/40 backdrop-blur-sm border border-stone-200/60 rounded-3xl hover:border-primary/30 transition-all duration-500 shadow-sm hover:shadow-xl group"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
              </div>

              <p className="text-xl font-serif italic leading-relaxed text-on-surface mb-8">
                "{review.text}"
              </p>

              <div className="pt-8 border-t border-stone-100 flex flex-col gap-2">
                <p className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">{review.author}</p>
                <Link to={`/property/${review.propertyId}`} className="text-[10px] text-stone-400 hover:text-primary transition-colors uppercase tracking-widest font-medium">
                  At {review.propertyTitle}
                </Link>
              </div>
            </motion.div>
          ))}
        </section>
      </main>

      <Footer />
      <MobileNav onBookClick={onBookClick} />
    </div>
  );
}
