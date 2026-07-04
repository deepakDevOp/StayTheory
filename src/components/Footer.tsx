import { Link } from "react-router-dom";
import { Instagram, Mail, ArrowUpRight, Heart, Leaf } from "lucide-react";
import { motion } from "motion/react";

const explore = [
  { label: "Properties", to: "/properties" },
  { label: "Guest Stories", to: "/reviews" },
  { label: "Contact Us", to: "/contact" },
];
const company = [
  { label: "Sustainability", to: "/sustainability" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
];

export default function Footer() {
  return (
    <footer className="relative bg-stone-950 text-stone-400 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[60px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-16 pt-8 pb-5 md:pt-12 md:pb-8 relative z-10">

        {/* ── Mobile layout ── */}
        <div className="md:hidden space-y-5">

          {/* Brand + socials */}
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-serif italic text-white">Stay Theory</Link>
            <div className="flex gap-2">
              <motion.a whileTap={{ scale: 0.9 }}
                href="https://www.instagram.com/staytheory" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #f09433 0%, #e6683c 40%, #dc2743 70%, #bc1888 100%)" }}>
                <Instagram className="w-3.5 h-3.5 text-white" />
              </motion.a>
              <motion.a whileTap={{ scale: 0.9 }}
                href="mailto:atstaytheory@gmail.com"
                className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/20 flex items-center justify-center">
                <Mail className="w-3.5 h-3.5 text-accent" />
              </motion.a>
            </div>
          </div>

          {/* Links — 2 columns */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
            <p className="text-[8px] uppercase tracking-[0.35em] font-bold text-stone-600 col-span-1">Explore</p>
            <p className="text-[8px] uppercase tracking-[0.35em] font-bold text-stone-600 col-span-1">Company</p>
            {explore.map((l, i) => (
              <Link key={l.label} to={l.to} className="text-[12px] text-stone-400 hover:text-white transition-colors py-0.5">
                {l.label}
              </Link>
            ))}
            {company.map((l, i) => (
              <Link key={l.label} to={l.to} className="text-[12px] text-stone-400 hover:text-white transition-colors py-0.5">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Reservations + copyright */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-800/60">
            <p className="text-[10px] text-stone-700 flex items-center gap-1">
              Made with <Heart className="w-2.5 h-2.5 fill-accent text-accent inline mx-0.5" /> in India
            </p>
            <a href="https://www.airbnb.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/15 border border-accent/20 rounded-full text-accent text-[9px] font-bold uppercase tracking-wider">
              Airbnb <ArrowUpRight className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        {/* ── Desktop layout ── */}
        <div className="hidden md:block">
          <div className="grid grid-cols-4 gap-8 mb-10">
            <div>
              <Link to="/" className="text-2xl font-serif italic text-white mb-4 block hover:text-accent/90 transition-colors">Stay Theory</Link>
              <div className="flex gap-2">
                <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  href="https://www.instagram.com/staytheory" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #f09433 0%, #e6683c 40%, #dc2743 70%, #bc1888 100%)" }}>
                  <Instagram className="w-4 h-4 text-white" />
                </motion.a>
                <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  href="mailto:atstaytheory@gmail.com"
                  className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/20 flex items-center justify-center hover:bg-accent/25 transition-colors">
                  <Mail className="w-4 h-4 text-accent" />
                </motion.a>
              </div>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.35em] font-bold text-stone-600 mb-5">Explore</p>
              <ul className="space-y-3.5">
                {explore.map(l => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[12px] text-stone-500 hover:text-white transition-colors flex items-center gap-1.5 group w-fit">
                      <span>{l.label}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.35em] font-bold text-stone-600 mb-5">Company</p>
              <ul className="space-y-3.5">
                {company.map(l => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[12px] text-stone-500 hover:text-white transition-colors flex items-center gap-1.5 group w-fit">
                      <span>{l.label}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.35em] font-bold text-stone-600 mb-5">Reservations</p>
              <p className="text-[11px] text-stone-600 leading-relaxed mb-4">Bookings handled securely through Airbnb.</p>
              <motion.a whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                href="https://www.airbnb.com" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent/15 hover:bg-accent/25 border border-accent/25 rounded-full text-accent text-[9px] font-bold uppercase tracking-widest transition-all">
                Book on Airbnb <ArrowUpRight className="w-3 h-3" />
              </motion.a>
              <div className="mt-4 flex items-center gap-2 p-3 rounded-xl border border-stone-800 bg-stone-900/50">
                <Leaf className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <p className="text-[10px] text-stone-500">Low-impact sustainable stays</p>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-800/60 pt-5 flex justify-between items-center">
            <p className="text-[10px] text-stone-700">© {new Date().getFullYear()} Stay Theory. A sanctuary for the senses.</p>
            <p className="text-[10px] text-stone-700 flex items-center gap-1">Made with <Heart className="w-2.5 h-2.5 fill-accent text-accent inline mx-0.5" /> in India</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
