import { motion, useScroll } from "motion/react";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  onBookClick: () => void;
}

export default function Navbar({ onBookClick }: NavbarProps) {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const navLinks = [
    { label: "Rooms", path: "#" },
    { label: "Sanctuary", path: "/" },
    { label: "Experiences", path: "#" },
    { label: "Journal", path: "/journal" },
  ];

  return (
    <motion.nav 
      animate={{ 
        backgroundColor: isScrolled ? "rgba(255, 248, 245, 0.9)" : "rgba(255, 248, 245, 0.2)",
        backdropFilter: "blur(12px)",
        boxShadow: isScrolled ? "0 4px 20px -5px rgba(138, 70, 48, 0.1)" : "none",
        borderBottom: isScrolled ? "1px solid rgba(138, 70, 48, 0.05)" : "1px solid rgba(138, 70, 48, 0)",
        paddingTop: isScrolled ? "0.75rem" : "1.25rem",
        paddingBottom: isScrolled ? "0.75rem" : "1.25rem",
      }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 left-0 w-full z-50 px-8 md:px-16 flex items-center justify-between border-none transition-all duration-300"
    >
      <Link to="/" className="text-2xl font-serif italic text-accent cursor-pointer">
        Stay Theory
      </Link>
      
      <div className="hidden md:flex items-center space-x-12">
        {navLinks.map((link) => (
          <Link 
            key={link.label}
            to={link.path} 
            className={`font-serif tracking-tight text-lg transition-all duration-300 relative group
              ${location.pathname === link.path ? 'text-accent font-medium' : 'text-stone-500 hover:text-accent'}
            `}
          >
            {link.label}
            <span className={`absolute -bottom-1 left-0 h-[1px] bg-accent transition-all duration-300 
              ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}
            `} />
          </Link>
        ))}
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={onBookClick}
          className="bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-semibold text-xs uppercase tracking-wider hover:opacity-80 transition-all active:scale-95"
        >
          Book Now
        </button>
        <button className="md:hidden p-2 text-on-surface">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </motion.nav>
  );
}
