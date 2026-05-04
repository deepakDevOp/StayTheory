import FocusBox from "./FocusBox";
import { motion } from "motion/react";
import { Star } from "lucide-react";

import { Link } from "react-router-dom";

export default function Testimonials() {
  const quotes = [
    {
      text: "An architectural masterpiece that somehow feels like coming home. The light in the living hall is transformative.",
      author: "ELENA V."
    },
    {
      text: "Stay Theory isn't just a place to sleep; it's a reset button for the soul. The attention to tactile detail is unmatched.",
      author: "MARCUS D."
    },
    {
      text: "Waking up in the master bedroom, watching the sun hit the terracotta walls—pure poetry in motion.",
      author: "SARAH K."
    },
    {
      text: "A sanctuary in the truest sense. The quiet rustle of the surrounding foliage was the only soundtrack we needed.",
      author: "JAMES T."
    },
    {
      text: "Every corner of this retreat has been thoughtfully curated. It felt less like a rental and more like an exclusive private club.",
      author: "CHLOE M."
    }
  ];

  return (
    <section id="reviews" className="px-6 md:px-16 bg-background py-24 md:py-32 border-t border-stone-200">
      <FocusBox className="max-w-[1440px] mx-auto w-full">
        <div className="text-center mb-16 md:mb-20">
          <span className="uppercase text-[11px] tracking-[0.2em] font-bold text-primary mb-4 block">Experiences</span>
          <h2 className="text-4xl md:text-6xl font-serif italic text-on-surface mb-8">Voices from the Guests</h2>
          <Link 
            to="/reviews"
            className="inline-flex items-center gap-3 px-6 py-2 border border-primary/20 rounded-full hover:border-primary/50 transition-all group"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary">View All</span>
            <div className="w-6 h-[1px] bg-primary/20 group-hover:w-10 transition-all" />
          </Link>
        </div>

        <div className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-12 px-4 md:px-0">
          {quotes.map((quote, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
               transition={{ delay: index * 0.1, duration: 0.8 }}
              className="min-w-[85vw] md:min-w-[400px] max-w-[400px] snap-center p-8 md:p-10 bg-white/40 backdrop-blur-sm border border-stone-200/60 rounded-3xl hover:border-primary/30 transition-colors shadow-sm shrink-0 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-xl md:text-2xl font-serif italic leading-relaxed text-on-surface mb-8 font-medium">
                  "{quote.text}"
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-[1px] bg-primary/40" />
                <p className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">{quote.author}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </FocusBox>
    </section>
  );
}
