import FocusBox from "./FocusBox";
import { Link } from "react-router-dom";

interface CTAProps {
  onBookClick: () => void;
}

export default function CTA({ onBookClick }: CTAProps) {
  return (
    <section className="bg-primary text-white text-center overflow-hidden relative w-full h-full flex items-center py-24">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
      </div>
      <FocusBox className="relative z-10 max-w-2xl mx-auto px-8 md:px-16 w-full">
        <h2 className="text-headline-xl mb-8 italic">Begin your journey.</h2>
        <p className="text-lg mb-12 opacity-80 font-light leading-relaxed">
          Reserved for those who value the art of the pause. Limited availability throughout the season.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button 
            onClick={onBookClick}
            className="bg-white text-primary px-12 py-5 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-surface-container transition-colors"
          >
            Check Availability
          </button>
          <Link 
            to="/journal"
            className="border border-white text-white px-12 py-5 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors inline-block"
          >
            View Journal
          </Link>
        </div>
      </FocusBox>
    </section>
  );
}
