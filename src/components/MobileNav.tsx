import { CalendarDays, Home, Compass } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface MobileNavProps {
  onBookClick: () => void;
}

export default function MobileNav({ onBookClick }: MobileNavProps) {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-0 w-full z-50 pb-safe bg-white/80 backdrop-blur-md border-t border-stone-200/50 md:hidden">
      <div className="flex justify-around items-center px-6 py-3 w-full">
        <a 
          href="/#reviews" 
          className={`flex flex-col items-center justify-center transition-all ${location.hash === '#reviews' ? 'text-accent scale-105' : 'text-stone-400 hover:text-accent'}`}
        >
          <Compass className="w-5 h-5 mb-1" />
          <span className="font-serif text-[10px] tracking-widest uppercase">Experiences</span>
        </a>
        <Link 
          to="/properties" 
          className={`flex flex-col items-center justify-center transition-all ${location.pathname === '/properties' ? 'text-accent scale-105' : 'text-stone-400 hover:text-accent'}`}
        >
          <Home className="w-5 h-5 mb-1" />
          <span className="font-serif text-[10px] tracking-widest uppercase">Properties</span>
        </Link>
        <button 
          onClick={onBookClick}
          className="flex flex-col items-center justify-center text-stone-400 hover:text-accent transition-all bg-transparent border-none cursor-pointer"
        >
          <CalendarDays className="w-5 h-5 mb-1" />
          <span className="font-serif text-[10px] tracking-widest uppercase">Book Now</span>
        </button>
      </div>
    </div>
  );
}
