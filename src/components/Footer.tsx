import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-stone-50 w-full py-12 px-8 md:px-16 border-t border-stone-200">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="font-serif italic text-xl text-accent">
          Stay Theory
        </div>
        
        <div className="flex flex-wrap justify-center gap-10">
          <Link to="/privacy"       className="font-serif text-[10px] tracking-widest uppercase text-stone-400 hover:text-accent transition-colors">Privacy</Link>
          <Link to="/terms"         className="font-serif text-[10px] tracking-widest uppercase text-stone-400 hover:text-accent transition-colors">Terms</Link>
          <Link to="/sustainability" className="font-serif text-[10px] tracking-widest uppercase text-stone-400 hover:text-accent transition-colors">Sustainability</Link>
          <Link to="/contact"       className="font-serif text-[10px] tracking-widest uppercase text-stone-400 hover:text-accent transition-colors">Contact</Link>
        </div>
        
        <div className="font-serif text-[10px] tracking-widest uppercase text-stone-400">
          © 2024 STAY THEORY. A SANCTUARY FOR THE SENSES.
        </div>
      </div>
    </footer>
  );
}
