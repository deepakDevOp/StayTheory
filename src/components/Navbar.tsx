import { motion, AnimatePresence, useScroll } from "motion/react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  onBookClick: () => void;
}

export default function Navbar({ onBookClick }: NavbarProps) {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const navLinks = [
    { label: "Experiences", path: "/#reviews" },
    { label: "Properties", path: "/properties" },
    { label: "Contact", path: "/contact" },
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
        <Link
          to="/"
          className="text-2xl font-serif italic text-accent"
          onClick={() => setIsMenuOpen(false)}
        >
          Stay Theory
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) =>
            link.path.startsWith("/#") ? (
              <a
                key={link.label}
                href={link.path}
                className="font-serif tracking-tight text-lg transition-all duration-300 relative group text-stone-500 hover:text-accent"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-[1px] bg-accent transition-all duration-300 w-0 group-hover:w-full" />
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.path}
                className={`font-serif tracking-tight text-lg transition-all duration-300 relative group ${
                  location.pathname === link.path ? "text-accent font-medium" : "text-stone-500 hover:text-accent"
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-[1px] bg-accent transition-all duration-300 ${
                  location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </Link>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBookClick}
            className="hidden md:block bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-semibold text-xs uppercase tracking-wider hover:opacity-80 transition-all active:scale-95 whitespace-nowrap"
          >
            Book Now
          </button>

          {/* Hamburger — mobile only */}
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

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-background flex flex-col md:hidden pt-[72px]"
          >
            <nav className="flex flex-col flex-1 px-8 pt-8 overflow-y-auto">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.07, duration: 0.3 }}
                >
                  {link.path.startsWith("/#") ? (
                    <a
                      href={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center py-6 border-b border-stone-100 text-4xl font-serif italic text-on-surface hover:text-accent transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center py-6 border-b border-stone-100 text-4xl font-serif italic transition-colors ${
                        location.pathname === link.path ? "text-accent" : "text-on-surface hover:text-accent"
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.3 }}
              className="px-8 pb-12 pt-6"
            >
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onBookClick();
                }}
                className="w-full bg-primary text-white py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-primary/20"
              >
                Book Now
              </button>
              <p className="text-center text-[10px] text-stone-400 uppercase tracking-widest mt-5 font-semibold">
                © 2024 Stay Theory
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}