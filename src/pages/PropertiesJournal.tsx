import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, MapPin, Users, Star, ArrowRight, Compass, Shrub, Bed, Bath, LayoutGrid } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileNav from "../components/MobileNav";
import { publicService } from "../services/publicService";

interface PropertiesJournalProps {
  onBookClick: (prop?: any) => void;
}

export default function PropertiesJournal({ onBookClick }: PropertiesJournalProps) {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const data = await publicService.getProperties();
        
        // Demo Fallback: ONLY show placeholders if the database is completely empty.
        // If there is real data (even just one), show that so the user sees their actual images.
        if (!data || data.length === 0) {
          const demoProperties = [
            {
              id: "demo-1",
              slug: "moon-retreat-demo",
              title: "Moon Retreat (Demo)",
              city: "Gurugram",
              property_type: "Apartment",
              base_nightly_rate: 3200,
              max_guests: 3,
              bedrooms: 1,
              coverImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
              airbnb_url: "https://airbnb.com"
            },
            {
              id: "demo-2",
              slug: "sun-sanctuary-demo",
              title: "Sun Sanctuary (Demo)",
              city: "Jaipur",
              property_type: "Villa",
              base_nightly_rate: 8500,
              max_guests: 6,
              bedrooms: 3,
              coverImage: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80"
            }
          ];
          setProperties(demoProperties);
        } else {
          setProperties(data);
        }
      } catch (error) {
        console.error("Failed to fetch journal properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filters = ["all", "villa", "apartment", "sanctuary"];
  const filteredProperties = activeFilter === "all"
    ? properties
    : properties.filter(p => (p.property_type || "").toLowerCase().includes(activeFilter));

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center">
        <div className="text-xl font-serif italic text-stone-400 animate-pulse">Designing Sanctuaries...</div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Navbar onBookClick={onBookClick} />

      <div className="flex-1 flex flex-col lg:flex-row max-w-[1800px] mx-auto w-full">
        {/* Fixed Left Sidebar (Desktop) */}
        <aside className="w-full lg:w-1/3 lg:h-[calc(100vh-72px)] lg:sticky lg:top-[72px] p-8 md:px-16 md:pt-4 md:pb-16 flex flex-col border-b lg:border-b-0 lg:border-r border-stone-100 bg-stone-50/30">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <LayoutGrid className="w-4 h-4 text-primary" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-primary">Volume 01</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-serif italic text-accent leading-[0.85] tracking-tighter mb-4">
              The <br /> Journal.
            </h1>

            <p className="text-stone-400 font-light leading-relaxed max-w-sm mb-6 italic">
              A curated collection of architectural escapes. Designed for moments of profound stillness.
            </p>

            <div className="flex flex-wrap gap-3">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${activeFilter === filter
                      ? 'bg-accent text-white shadow-2xl shadow-accent/20 translate-y-[-2px]'
                      : 'bg-white text-stone-400 border border-stone-100 hover:border-accent/30 hover:text-stone-600'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </motion.div>
        </aside>

        {/* Scrollable Right Grid */}
        <main className="flex-1 p-8 md:px-16 md:pt-4 md:pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-16">
            {filteredProperties.length === 0 ? (
              <div className="col-span-full py-32 text-center">
                <Shrub className="w-12 h-12 text-stone-200 mx-auto mb-6" />
                <h2 className="text-2xl font-serif italic text-accent">No sanctuaries discovered.</h2>
              </div>
            ) : (
              filteredProperties.map((property, index) => {
                const image = property.coverImage || (property.images?.[0]?.url) || "";
                const priceVal = property.base_nightly_rate || 0;
                const price = `₹${parseFloat(String(priceVal)).toLocaleString()}`;

                return (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                    onClick={() => navigate(`/property/${property.slug}`)}
                    className="group cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] mb-4 shadow-2xl shadow-stone-900/5 group-hover:shadow-stone-900/20 transition-all duration-1000">
                      <img
                        src={image}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-white shadow-2xl">
                          <span className="text-xl font-serif italic text-accent">{price}</span>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-2xl">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="absolute top-6 left-6">
                        <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[9px] font-bold uppercase tracking-widest">
                          {property.property_type || "Retreat"}
                        </div>
                      </div>
                    </div>

                    <div className="px-4">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">{property.city}</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-serif text-accent mb-3 group-hover:italic transition-all duration-500">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-4 text-stone-400">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{property.max_guests} Guests</span>
                        </div>
                        <div className="h-3 w-[1px] bg-stone-200" />
                        <div className="flex items-center gap-1.5 text-primary">
                          <Star className="w-3.5 h-3.5 fill-primary" />
                          <span className="text-[10px] font-bold">4.9 Rating</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </main>
      </div>

      <Footer />
      <MobileNav onBookClick={onBookClick} />
    </div>
  );
}
