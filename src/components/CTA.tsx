import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, CalendarCheck } from "lucide-react";

interface CTAProps {
  onBookClick: () => void;
}

export default function CTA({ onBookClick }: CTAProps) {
  return (
    <section
      className="relative w-full overflow-hidden py-24 md:py-32 flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #140a06 0%, #3d1a10 30%, #6b2d1e 60%, #8A4630 85%, #a85030 100%)" }}
    >
      {/* Animated concentric rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {[600, 440, 300, 180].map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full border border-white/5"
            style={{ width: size, height: size }}
            animate={{ scale: [1, 1.04, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8, ease: "easeInOut" }}
          />
        ))}
        {/* Central glow */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-30 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(200,150,60,0.5) 0%, rgba(168,94,70,0.3) 40%, transparent 70%)" }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { left: "12%", top: "18%", delay: 0 },
          { left: "88%", top: "25%", delay: 0.6 },
          { left: "22%", top: "72%", delay: 1.2 },
          { left: "78%", top: "68%", delay: 0.4 },
          { left: "50%", top: "12%", delay: 0.9 },
          { left: "35%", top: "85%", delay: 1.5 },
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-amber-300/40"
            style={{ left: p.left, top: p.top }}
            animate={{ y: [-15, 15, -15], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 4 + i * 0.4, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Label row */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-white/20" />
            <Sparkles className="w-3 h-3 text-amber-400/70" />
            <span className="text-[9px] uppercase tracking-[0.5em] text-white/40 font-bold">Limited Availability</span>
            <Sparkles className="w-3 h-3 text-amber-400/70" />
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-white/20" />
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif italic text-white leading-[1.1] mb-4">
            Begin your
          </h2>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif italic leading-[1.1] mb-8 gradient-text-gold">
            journey.
          </h2>

          <p className="text-base md:text-lg mb-12 text-white/45 font-light leading-relaxed max-w-lg mx-auto">
            Reserved for those who value the art of the pause.<br />
            <span className="text-white/25 text-sm">A sanctuary designed for modern stillness.</span>
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              onClick={onBookClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="group relative overflow-hidden bg-white text-stone-900 px-10 py-4 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-2xl shadow-black/40 hover:bg-amber-50 transition-colors"
            >
              <span className="flex items-center justify-center gap-2.5">
                <CalendarCheck className="w-3.5 h-3.5" />
                Check Availability
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            <Link to="/properties">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="border border-white/15 text-white/70 px-10 py-4 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-white/8 hover:border-white/30 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                View Properties
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
