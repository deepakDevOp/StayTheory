import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Leaf, Sun, Droplets, Users, BarChart3, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const sections = [
  {
    icon: Sun,
    title: "Low-Impact Architecture",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    body: "Our properties are designed to integrate with their natural surroundings rather than overpower them. We use locally sourced materials wherever possible, prioritising natural stone, reclaimed wood, and traditional craft over mass-produced finishes.",
  },
  {
    icon: Droplets,
    title: "Energy & Water",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20",
    body: "Each sanctuary is equipped with energy-efficient systems — solar water heating, LED lighting, and smart climate controls that adapt to occupancy. We encourage guests to embrace natural ventilation and the rhythm of the environment around them.",
  },
  {
    icon: Leaf,
    title: "Minimal Waste",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    body: "We have eliminated single-use plastics from all our spaces. Guests are provided with refillable glass bottles, organic bath amenities in ceramic dispensers, and linens laundered with biodegradable detergents. Kitchen pantries are stocked with local, seasonal, and unpackaged goods wherever possible.",
  },
  {
    icon: Users,
    title: "Supporting Local Communities",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
    body: "Our caretakers, artisans, and suppliers are all drawn from the communities near each sanctuary. We believe that a stay at Stay Theory should benefit not just the guest, but the land and the people who tend it.",
  },
  {
    icon: BarChart3,
    title: "A Living Commitment",
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/20",
    body: "Sustainability is not a checklist — it is an ongoing practice. We regularly audit our properties, listen to our guests' feedback, and work with environmental consultants to raise our standards each year.",
  },
];

export default function Sustainability() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Navbar onBookClick={() => { }} />

      {/* Hero section */}
      <div
        className="relative overflow-hidden pt-[72px]"
        style={{ background: "linear-gradient(160deg, #0d1a10 0%, #1a3a1c 40%, #2a5a2e 75%, #3a7040 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[400, 250, 140].map((size, i) => (
            <motion.div
              key={size}
              className="absolute top-1/2 right-16 -translate-y-1/2 rounded-full border border-white/5"
              style={{ width: size, height: size, marginRight: -(size / 2) }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
            />
          ))}
          <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-lime-400/5 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 px-6 md:px-16 pt-14 pb-16 md:pt-20 md:pb-24 max-w-3xl">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Back to Home</span>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-4 h-4 text-emerald-400/80" />
              <span className="text-[9px] uppercase tracking-[0.5em] font-bold text-white/40">Our Ethos</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif italic text-white leading-tight mb-4">
              Sustainability
            </h1>
            <p className="text-white/55 text-base md:text-lg font-light leading-relaxed max-w-lg">
              At Stay Theory, every sanctuary is designed with the land in mind. We believe that true luxury is never at the expense of the world that cradles it.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 md:px-8 py-12 md:py-16">
        <div className="space-y-5">
          {sections.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.section
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06, duration: 0.5 }}
                className={`p-6 rounded-2xl border ${s.border} ${s.bg}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon className={`w-4.5 h-4.5 ${s.color}`} />
                  </div>
                  <div>
                    <h2 className={`text-base font-semibold ${s.color} mb-2`}>{s.title}</h2>
                    <p className="text-stone-600 leading-relaxed text-[14px] md:text-[15px]">{s.body}</p>
                  </div>
                </div>
              </motion.section>
            );
          })}
        </div>

        <div className="mt-12 pt-8 border-t border-stone-100">
          <Link to="/" className="text-[10px] uppercase tracking-widest font-bold text-stone-400 hover:text-accent transition-colors">
            ← Back to Home
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
