import { motion } from "motion/react";
import { ArrowLeft, MapPin, Users, Star, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileNav from "../components/MobileNav";
import { propertiesData } from "../data/properties";

interface PropertiesJournalProps {
  onBookClick: () => void;
}

import { useState, useEffect } from "react";
import { publicService } from "../services/publicService";

export default function PropertiesJournal({ onBookClick }: PropertiesJournalProps) {
  const [properties, setProperties] = useState<any[]>(propertiesData);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Static mode
    console.log("PropertiesJournal: Static mode active");
  }, []);

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <Navbar onBookClick={onBookClick} />
        <div className="animate-pulse text-2xl font-serif italic text-stone-400">Loading our collection...</div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Navbar onBookClick={onBookClick} />
      
      <main className="max-w-7xl mx-auto px-6 md:px-16 py-20">
        <header className="mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-stone-500 hover:text-accent transition-colors group w-fit"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] md:text-sm uppercase tracking-widest font-bold">Back to sanctuary</span>
            </Link>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-serif italic text-accent mb-6"
          >
            Properties
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl text-stone-500 text-lg md:text-xl font-light leading-relaxed"
          >
            A curated collection of retreats designed for still moments and quiet contemplation. Each property is hand-selected to offer a unique perspective on being.
          </motion.p>
        </header>

        <section className={properties.length === 0 ? "" : "grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24"}>
          {properties.length === 0 ? (
            <div className="py-32 flex flex-col items-center text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-8 border border-stone-100">
                <MapPin className="w-8 h-8 text-stone-200" />
              </div>
              <h2 className="text-3xl font-serif italic text-accent mb-4">No Sanctuaries Found</h2>
              <p className="text-stone-500 leading-relaxed text-sm">
                Our collection is currently undergoing maintenance. Please return shortly to discover our hand-picked boutique retreats.
              </p>
            </div>
          ) : (
            properties.map((property, index) => {
              const image = property.coverImage || (property.images?.[0]?.url) || "";
              const priceVal = property.price || property.base_nightly_rate || 0;
              const price = `₹${parseFloat(String(priceVal)).toLocaleString()}`;
              const location = property.city || "India";
              
              return (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  onClick={() => navigate(`/property/${property.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-3xl mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-700">
                    <img 
                      src={image} 
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute top-6 left-6 z-10">
                      <span className="bg-white/90 backdrop-blur-md text-accent text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-sm">
                        {property.property_type || "Retreat"}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-serif text-accent mb-3 group-hover:italic transition-all">
                        {property.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 md:gap-4 text-stone-500 text-xs md:text-sm">
                        <span className="flex items-center gap-1.5 bg-stone-100 px-3 py-1 rounded-full">
                          <MapPin className="w-3.5 h-3.5" />
                          {location}
                        </span>
                        <span className="flex items-center gap-1.5 bg-stone-100 px-3 py-1 rounded-full">
                          <Users className="w-3.5 h-3.5" />
                          Up to {property.stats?.guests || property.max_guests} guests
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center justify-end gap-1 text-accent font-bold mb-1">
                        <Star className="w-3.5 h-3.5 fill-accent" />
                        <span>4.9</span>
                      </div>
                      <p className="text-stone-400 text-xs md:text-sm">from <span className="text-accent font-medium">{price}</span></p>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex items-center gap-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 -translate-x-0 md:-translate-x-4 md:group-hover:translate-x-0 transition-all duration-500">
                    <span className="text-accent font-serif italic text-lg">View Details</span>
                    <div className="w-12 h-[1px] bg-accent/30" />
                    <ArrowRight className="w-4 h-4 text-accent" />
                  </div>
                </motion.div>
              );
            })
          )}
        </section>
      </main>

      <Footer />
      <MobileNav onBookClick={onBookClick} />
    </div>
  );
}
