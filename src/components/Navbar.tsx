import { motion, AnimatePresence, useScroll } from "motion/react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sparkles, Home, Mail, CalendarCheck, Instagram, ArrowRight } from "lucide-react";

interface NavbarProps {
  onBookClick: () => void;
}

export default function Navbar({ onBookClick }: NavbarProps) {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    return scrollY.on("change", (latest) => setIsScrolled(latest > 50));
  }, [scrollY]);

  useEffect(() => { setIsMenuOpen(false); }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const navLinks = [
    { label: "Experiences",  desc: "Curated stays & stories",  path: "/#reviews",    icon: Sparkles },
    { label: "Properties",   desc: "Our sanctuary collection",  path: "/properties",  icon: Home },
    { label: "Contact",      desc: "Let's start a journey",     path: "/contact",     icon: Mail },
  ];

  return (
    <>
      <motion.nav
        animate={{
          background: isScrolled || isMenuOpen
            ? "rgba(255, 248, 245, 0.98)"
            : "linear-gradient(to bottom, rgba(255, 248, 245, 0.9) 0%, rgba(255, 248, 245, 0) 100%)",
          backdropFilter: isScrolled || isMenuOpen ? "blur(12px)" : "blur(4px)",
          boxShadow: isScrolled ? "0 4px 20px -5px rgba(138, 70, 48, 0.1)" : "none",
          borderBottom: isScrolled || isMenuOpen ? "1px solid rgba(138, 70, 48, 0.05)" : "1px solid rgba(138, 70, 48, 0)",
          paddingTop: isScrolled ? "0.6rem" : "1rem",
          paddingBottom: isScrolled ? "0.6rem" : "1rem",
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 lg:px-16 flex items-center justify-between"
      >
        <Link to="/" className="text-2xl font-serif italic text-accent" onClick={() => setIsMenuOpen(false)}>
          Stay Theory
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) =>
            link.path.startsWith("/#") ? (
              <a key={link.label} href={link.path}
                className="font-serif tracking-tight text-lg transition-all duration-300 relative group text-stone-500 hover:text-accent">
                {link.label}
                <span className="absolute -bottom-1 left-0 h-[1px] bg-accent transition-all duration-300 w-0 group-hover:w-full" />
              </a>
            ) : (
              <Link key={link.label} to={link.path}
                className={`font-serif tracking-tight text-lg transition-all duration-300 relative group ${
                  location.pathname === link.path ? "text-accent font-medium" : "text-stone-500 hover:text-accent"
                }`}>
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-[1px] bg-accent transition-all duration-300 ${
                  location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </Link>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onBookClick}
            className="hidden md:block bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-semibold text-xs uppercase tracking-wider hover:opacity-80 transition-all active:scale-95 whitespace-nowrap">
            Book Now
          </button>

          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            className="md:hidden flex items-center justify-center w-11 h-11 -mr-2 text-accent"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMenuOpen ? (
                <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                  <X className="w-6 h-6" />
                </motion.span>
              ) : (
                <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                  <Menu className="w-6 h-6" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* Mobile side drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: "rgba(20, 15, 10, 0.6)", backdropFilter: "blur(4px)" }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="fixed top-0 left-0 h-full z-50 md:hidden flex flex-col overflow-hidden"
              style={{ width: "78vw", maxWidth: "300px", background: "#FDF8F5" }}
            >
              {/* ── Branded header with gradient ── */}
              <div className="relative px-5 pt-5 pb-6 overflow-hidden shrink-0"
                style={{ background: "linear-gradient(135deg, #8A4630 0%, #6b3425 60%, #3d1e14 100%)" }}>
                {/* Decorative circles */}
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
                <div className="absolute top-4 right-8 w-10 h-10 rounded-full bg-white/8" />

                {/* Close button */}
                <button onClick={() => setIsMenuOpen(false)}
                  className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white/70 hover:bg-white/25 hover:text-white transition-all">
                  <X className="w-3.5 h-3.5" />
                </button>

                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="text-xl font-serif italic text-white mb-0.5">
                    Stay Theory
                  </motion.p>
                </Link>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                  className="text-[9px] uppercase tracking-[0.35em] text-white/50 font-medium">
                  Boutique Sanctuaries
                </motion.p>

                {/* Decorative divider line */}
                <motion.div
                  initial={{ width: 0 }} animate={{ width: 32 }} transition={{ delay: 0.2, duration: 0.4 }}
                  className="h-[1px] bg-white/30 mt-4"
                />
              </div>

              {/* ── Nav links ── */}
              <nav className="flex flex-col px-3 pt-4 flex-1 overflow-y-auto">
                <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-300 px-3 mb-3">Navigate</p>

                {navLinks.map((link, idx) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  const isHovered = hoveredLink === link.label;

                  const content = (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.07, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="mb-1.5"
                      onHoverStart={() => setHoveredLink(link.label)}
                      onHoverEnd={() => setHoveredLink(null)}
                    >
                      <div className={`relative flex items-center gap-3 px-3 py-3.5 rounded-2xl transition-all duration-200 overflow-hidden ${
                        isActive ? "bg-primary/10" : isHovered ? "bg-stone-100" : ""
                      }`}>
                        {/* Active left bar */}
                        <motion.div
                          animate={{ scaleY: isActive || isHovered ? 1 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-primary origin-center"
                        />

                        {/* Icon chip */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                          isActive
                            ? "bg-primary text-white shadow-md shadow-primary/30"
                            : isHovered
                            ? "bg-primary/15 text-primary"
                            : "bg-stone-100 text-stone-400"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p className={`font-serif italic text-base leading-tight transition-colors duration-200 ${
                            isActive ? "text-accent" : isHovered ? "text-stone-800" : "text-stone-600"
                          }`}>
                            {link.label}
                          </p>
                          <p className="text-[10px] text-stone-400 mt-0.5 truncate">{link.desc}</p>
                        </div>

                        {/* Arrow */}
                        <motion.div
                          animate={{ opacity: isActive || isHovered ? 1 : 0, x: isActive || isHovered ? 0 : -4 }}
                          transition={{ duration: 0.15 }}
                        >
                          <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-primary" : "text-stone-400"}`} />
                        </motion.div>
                      </div>
                    </motion.div>
                  );

                  return link.path.startsWith("/#") ? (
                    <a key={link.label} href={link.path} onClick={() => setIsMenuOpen(false)}>{content}</a>
                  ) : (
                    <Link key={link.label} to={link.path} onClick={() => setIsMenuOpen(false)}>{content}</Link>
                  );
                })}

                {/* ── Social row ── */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="mt-auto pt-4 pb-3 px-3"
                >
                  <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-300 mb-3">Follow Us</p>
                  <a
                    href="https://www.instagram.com/staytheory"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center shadow-sm">
                      <Instagram className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-stone-600 group-hover:text-accent transition-colors">@staytheory</p>
                      <p className="text-[9px] text-stone-400">Instagram</p>
                    </div>
                  </a>
                </motion.div>
              </nav>

              {/* ── Book Now CTA ── */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="px-4 pb-8 pt-3 border-t border-stone-100 shrink-0"
              >
                <button
                  onClick={() => { setIsMenuOpen(false); onBookClick(); }}
                  className="w-full py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.25em] flex items-center justify-center gap-2 transition-all active:scale-95 text-white shadow-lg shadow-primary/25"
                  style={{ background: "linear-gradient(135deg, #8A4630 0%, #6b3425 100%)" }}
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  Book a Stay
                </button>
                <p className="text-center text-[9px] text-stone-300 uppercase tracking-[0.25em] mt-3">
                  © {new Date().getFullYear()} Stay Theory
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
