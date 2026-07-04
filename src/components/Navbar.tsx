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
    { label: "Experiences", desc: "Curated stays & stories",  path: "/#reviews",   icon: Sparkles },
    { label: "Properties",  desc: "Our sanctuary collection", path: "/properties", icon: Home },
    { label: "Contact",     desc: "Let's start a journey",    path: "/contact",    icon: Mail },
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
        className="fixed top-0 left-0 w-full z-40 px-4 md:px-8 lg:px-16 flex items-center justify-between"
      >
        <Link to="/" className="text-2xl font-serif italic text-accent" onClick={() => setIsMenuOpen(false)}>
          Stay Theory
        </Link>

        {/* Desktop links */}
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

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-50 md:hidden"
              style={{ background: "rgba(10, 5, 3, 0.65)" }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Drawer panel — slides from left, ~75vw */}
            <motion.div
              key="drawer"
              initial={{ x: "-100%", borderTopRightRadius: "40px", borderBottomRightRadius: "40px" }}
              animate={{ x: 0, borderTopRightRadius: "0px", borderBottomRightRadius: "0px" }}
              exit={{ x: "-100%", borderTopRightRadius: "40px", borderBottomRightRadius: "40px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 left-0 h-full z-[60] md:hidden flex flex-col overflow-hidden shadow-2xl shadow-black/20 bg-background"
              style={{
                width: "75vw",
                maxWidth: "300px",
              }}
            >
              {/* Ambient glow */}
              <div className="absolute top-1/3 right-0 w-40 h-40 bg-accent/5 rounded-full blur-[60px] pointer-events-none" />
              <div className="absolute bottom-1/3 left-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] pointer-events-none" />

              {/* Header */}
              <div className="relative z-10 px-5 pt-6 pb-5 shrink-0">
                <div className="flex items-center justify-between mb-5">
                  <Link to="/" onClick={() => setIsMenuOpen(false)}>
                    <motion.span
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-xl font-serif italic text-accent block"
                    >
                      Stay Theory
                    </motion.span>
                  </Link>
                  <motion.button
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/70 hover:bg-primary/10 hover:text-primary transition-all active:scale-90"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Accent line */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="h-px bg-primary/10"
                />
              </div>

              {/* Nav links */}
              <nav className="relative z-10 flex-1 px-5 flex flex-col justify-center gap-1 overflow-y-auto">
                {navLinks.map((link, idx) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;

                  const inner = (
                    <motion.div
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ delay: 0.15 + idx * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      onClick={() => setIsMenuOpen(false)}
                      className="group"
                    >
                      <div className={`flex items-center gap-3.5 px-3 py-3.5 rounded-2xl transition-all duration-200 ${
                        isActive ? "bg-primary/10" : "hover:bg-stone-100/50"
                      }`}>
                        {/* Icon */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                          isActive ? "bg-primary text-white" : "bg-primary/5 text-primary/70 group-hover:bg-primary/10 group-hover:text-primary"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p className={`font-serif italic text-[18px] leading-tight transition-colors ${
                            isActive ? "text-accent" : "text-stone-700 group-hover:text-accent"
                          }`}>
                            {link.label}
                          </p>
                          <p className="text-[9px] text-stone-400 mt-0.5 truncate">{link.desc}</p>
                        </div>

                        <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition-all duration-200 group-hover:translate-x-0.5 ${
                          isActive ? "text-primary" : "text-stone-300 group-hover:text-primary"
                        }`} />
                      </div>

                      {idx < navLinks.length - 1 && (
                        <div className="h-px mx-3 bg-stone-100" />
                      )}
                    </motion.div>
                  );

                  return link.path.startsWith("/#") ? (
                    <a key={link.label} href={link.path}>{inner}</a>
                  ) : (
                    <Link key={link.label} to={link.path}>{inner}</Link>
                  );
                })}
              </nav>

              {/* Bottom */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 px-5 pb-8 pt-4 shrink-0"
              >
                {/* Divider */}
                <div className="h-px bg-stone-100 mb-4" />

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/staytheory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 mb-4 group"
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-stone-100 group-hover:bg-primary/10 transition-colors">
                    <Instagram className="w-3.5 h-3.5 text-stone-400 group-hover:text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-stone-600 group-hover:text-accent transition-colors">@staytheory</p>
                    <p className="text-[9px] text-stone-400">Instagram</p>
                  </div>
                </a>

                {/* CTA */}
                <button
                  onClick={() => { setIsMenuOpen(false); onBookClick(); }}
                  className="w-full py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 text-white bg-primary hover:bg-accent transition-all active:scale-[0.97] shadow-lg shadow-primary/20"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  Book a Stay
                </button>

                <p className="text-center text-[8px] text-stone-300 uppercase tracking-widest mt-3">
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
