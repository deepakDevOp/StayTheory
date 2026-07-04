import { motion, AnimatePresence, useScroll } from "motion/react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sparkles, Home, Mail, CalendarCheck, ArrowRight } from "lucide-react";
import { publicService } from "../services/publicService";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../hooks/useTheme";

const InstagramIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

interface NavbarProps {
  onBookClick: () => void;
}

export default function Navbar({ onBookClick }: NavbarProps) {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [contact, setContact] = useState<{ instagram?: string; whatsapp?: string; email?: string }>({});
  const { isDark } = useTheme();

  useEffect(() => {
    publicService.getContactSettings()
      .then(data => setContact(data))
      .catch(() => {});
  }, []);

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
            ? isDark ? "rgba(15, 12, 10, 0.97)" : "rgba(255, 248, 245, 0.98)"
            : isDark
              ? "linear-gradient(to bottom, rgba(15, 12, 10, 0.85) 0%, rgba(15, 12, 10, 0) 100%)"
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
          <ThemeToggle />
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

                {/* Social / contact links */}
                <div className="flex flex-col gap-2 mb-4">
                  {contact.instagram && (
                    <a
                      href={`https://www.instagram.com/${contact.instagram.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-[#E1306C]/8 group-hover:bg-[#E1306C]/15 transition-colors">
                        <InstagramIcon />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-stone-600 group-hover:text-[#E1306C] transition-colors">@{contact.instagram.replace(/^@/, "")}</p>
                        <p className="text-[9px] text-stone-400">Instagram</p>
                      </div>
                    </a>
                  )}
                  {contact.whatsapp && (
                    <a
                      href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hi, I'd like to enquire about a stay at Stay Theory.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-[#25D366]/10 group-hover:bg-[#25D366]/20 transition-colors">
                        <WhatsAppIcon />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-stone-600 group-hover:text-[#25D366] transition-colors">{contact.whatsapp}</p>
                        <p className="text-[9px] text-stone-400">WhatsApp</p>
                      </div>
                    </a>
                  )}
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-primary/5 group-hover:bg-primary/10 transition-colors">
                        <Mail className="w-3.5 h-3.5 text-primary/60 group-hover:text-primary" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-stone-600 group-hover:text-accent transition-colors">{contact.email}</p>
                        <p className="text-[9px] text-stone-400">Email</p>
                      </div>
                    </a>
                  )}
                </div>

                {/* CTA */}
                <button
                  onClick={() => { setIsMenuOpen(false); onBookClick(); }}
                  className="w-full py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 text-white bg-primary hover:bg-accent transition-all active:scale-[0.97] shadow-lg shadow-primary/20"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  Book a Stay
                </button>

                <div className="flex items-center justify-between mt-3">
                  <p className="text-[8px] text-stone-300 uppercase tracking-widest">
                    © {new Date().getFullYear()} Stay Theory
                  </p>
                  <ThemeToggle />
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
