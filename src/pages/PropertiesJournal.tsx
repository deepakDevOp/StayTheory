import { motion } from "motion/react";
import { ArrowLeft, MapPin, Users, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const properties = [
  {
    id: "sanctuary",
    title: "The Sanctuary",
    location: "Kasauli, Himachal Pradesh",
    price: "₹3,100",
    rating: 4.98,
    guests: 4,
    image: "https://lh3.googleusercontent.com/aida/ADBb0uhSbpgiJ1xfRVN3Lz8MCmkhVVNylX1cL-jByrRWafl7ngRiF6AETvBrljpqbJJX2E5DEvScBaruojpkmmZlj6ajrMqW-jpp_29MNezvab0DAa24JPQM7mQzQsNhUPnxYJI_3jbXsMvKqT7fNJPJP_vU4Q3goc-wgE0GtSEhPLifS8KFr5CczuBAktCs_HO-SQJQ0tU8TMRq3OKXbgcjKBGTs3KPd1bLfm_4_08uKsh_5JLrLVFnSpyQCsrIo1XPjY2HzLNV81Wf",
    tag: "Mountain Retreat"
  },
  {
    id: "river-house",
    title: "The River House",
    location: "Rishikesh, Uttarakhand",
    price: "₹4,500",
    rating: 4.95,
    guests: 6,
    image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80&w=2070",
    tag: "River Front"
  },
  {
    id: "pine-cabin",
    title: "Pine Ridge Cabin",
    location: "Manali, Himachal Pradesh",
    price: "₹2,800",
    rating: 4.92,
    guests: 2,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070",
    tag: "Cozy Hideout"
  },
  {
    id: "valley-view",
    title: "Valley View Estate",
    location: "Mussoorie, Uttarakhand",
    price: "₹5,200",
    rating: 4.99,
    guests: 8,
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=2070",
    tag: "Luxury Villa"
  }
];

interface PropertiesJournalProps {
  onBookClick: () => void;
}

export default function PropertiesJournal({ onBookClick }: PropertiesJournalProps) {
  return (
    <div className="bg-background min-h-screen">
      <Navbar onBookClick={onBookClick} />
      
      <main className="max-w-7xl mx-auto px-8 md:px-16 py-20">
        <header className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-stone-500 hover:text-accent transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm uppercase tracking-widest font-bold">Back to sanctuary</span>
            </Link>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-serif italic text-accent mb-6"
          >
            Properties <br /> Journal
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl text-stone-500 text-xl font-light leading-relaxed"
          >
            A curated collection of retreats designed for still moments and quiet contemplation. Each property is hand-selected to offer a unique perspective on being.
          </motion.p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6 shadow-sm group-hover:shadow-xl transition-all duration-700">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-white/90 backdrop-blur-md text-accent text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                    {property.tag}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-serif text-accent mb-2 group-hover:italic transition-all">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-4 text-stone-500 text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {property.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      Up to {property.guests}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-accent font-bold mb-1">
                    <Star className="w-3.5 h-3.5 fill-accent" />
                    <span>{property.rating}</span>
                  </div>
                  <p className="text-stone-400 text-sm">from <span className="text-accent font-medium">{property.price}</span></p>
                </div>
              </div>
              
              <div className="mt-8 flex items-center gap-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                <span className="text-accent font-serif italic text-lg">View Details</span>
                <div className="w-12 h-[1px] bg-accent/30" />
                <ArrowRight className="w-4 h-4 text-accent" />
              </div>
            </motion.div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
