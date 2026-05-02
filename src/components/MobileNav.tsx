import { CalendarDays, Moon, ArrowRight } from "lucide-react";

interface MobileNavProps {
  onBookClick: () => void;
}

export default function MobileNav({ onBookClick }: MobileNavProps) {
  return (
    <div className="fixed bottom-0 w-full z-50 pb-safe bg-white/80 backdrop-blur-md border-t border-stone-200/50 md:hidden">
      <div className="flex justify-around items-center px-6 py-3 w-full">
        <button 
          onClick={onBookClick}
          className="flex flex-col items-center justify-center text-stone-400 hover:text-accent transition-all bg-transparent border-none cursor-pointer"
        >
          <CalendarDays className="w-5 h-5 mb-1" />
          <span className="font-serif text-[10px] tracking-widest uppercase">Availability</span>
        </button>
        <a href="#" className="flex flex-col items-center justify-center text-accent scale-105">
          <Moon className="w-5 h-5 mb-1" />
          <span className="font-serif text-[10px] tracking-widest uppercase">Sanctuary</span>
        </a>
        <button 
          onClick={onBookClick}
          className="flex flex-col items-center justify-center text-stone-400 hover:text-accent transition-all bg-transparent border-none cursor-pointer"
        >
          <ArrowRight className="w-5 h-5 mb-1" />
          <span className="font-serif text-[10px] tracking-widest uppercase">Reserve</span>
        </button>
      </div>
    </div>
  );
}
