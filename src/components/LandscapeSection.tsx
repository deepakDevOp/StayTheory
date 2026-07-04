import { Sun, Wind, Cloud, MapPin } from "lucide-react";
import { motion } from "motion/react";
import FocusBox from "./FocusBox";

const features = [
  {
    icon: Sun,
    label: "Olive Groves",
    desc: "Sunlit canopies",
    gradient: "from-amber-400/20 to-amber-600/10",
    border: "border-amber-400/15",
    iconColor: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    icon: MapPin,
    label: "Mineral Pool",
    desc: "Natural spring water",
    gradient: "from-cyan-400/20 to-cyan-600/10",
    border: "border-cyan-400/15",
    iconColor: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    icon: Wind,
    label: "Private Trails",
    desc: "Through forest & meadow",
    gradient: "from-emerald-400/20 to-emerald-600/10",
    border: "border-emerald-400/15",
    iconColor: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    icon: Cloud,
    label: "Sunset Deck",
    desc: "360° sky views",
    gradient: "from-violet-400/20 to-violet-600/10",
    border: "border-violet-400/15",
    iconColor: "text-violet-400",
    bg: "bg-violet-400/10",
  },
];

export default function LandscapeSection() {
  return (
    <section className="relative bg-stone-950 px-6 md:px-16 overflow-hidden py-16 md:h-[calc(100vh-72px)] flex items-center">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-emerald-500/6 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/6 rounded-full blur-[80px]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/4 rounded-full blur-[60px]" />
      </div>

      <FocusBox className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center w-full relative z-10">

        {/* Image */}
        <div className="order-2 md:order-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="aspect-[4/5] rounded-2xl overflow-hidden relative group shadow-2xl shadow-black/50"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBth1Cq7szZtqLGqJoWl17vM6nSNEnkw-_ch_zuC-p2w_fPKJ8u3yvAh6CP1mj-SOS_wLDGRFR_nVvo4TIK7POkw9JRfd3ihYr13D85K6VwoeLRGkybsAfpHeTmY4MPmksPRipBi5Z0fhsrqMdmURGu5KK_j-Li6NTdvQUl_2SLO-eWcJznsJ6tZwTF98JsNespJC2MccBDfCo7R0yBZFdf16sct0emXIIvZ3OgT_QcuZA0G8jkLSpUdV4WqlP-d17Qm_KjouEOzgg"
              alt="Stay Theory Surroundings"
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale group-hover:grayscale-0"
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent pointer-events-none" />

            {/* Floating nature badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute top-4 right-4 px-3 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 backdrop-blur-md"
            >
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">Natural Surroundings</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Text */}
        <div className="order-1 md:order-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-emerald-400/50" />
              <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-emerald-400/80">The Surroundings</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-white mb-6 leading-tight">
              A landscape that<br />
              breathes <span className="text-emerald-300/80">with you.</span>
            </h2>

            <p className="text-stone-400 leading-relaxed mb-10 max-w-md text-[14px] md:text-base">
              Situated at the intersection of wild nature and curated comfort. The grounds of Stay Theory offer endless paths for introspection, from hidden olive groves to our infinity meditation pool.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {features.map(({ icon: Icon, label, desc, gradient, border, iconColor, bg }, idx) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + idx * 0.08, duration: 0.5 }}
                  className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br ${gradient} border ${border}`}
                >
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                  </div>
                  <div>
                    <p className={`text-[11px] font-bold uppercase tracking-wide ${iconColor}`}>{label}</p>
                    <p className="text-[9px] text-stone-600">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </FocusBox>
    </section>
  );
}
