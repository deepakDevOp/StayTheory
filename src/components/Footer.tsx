import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-stone-50 w-full py-10 px-6 md:px-16 border-t border-stone-200">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-12">
        <div className="font-serif italic text-xl text-accent">
          Stay Theory
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          <Link to="/privacy"        className="text-[10px] tracking-wider uppercase text-stone-400 hover:text-accent transition-colors">Privacy</Link>
          <Link to="/terms"          className="text-[10px] tracking-wider uppercase text-stone-400 hover:text-accent transition-colors">Terms</Link>
          <Link to="/sustainability" className="text-[10px] tracking-wider uppercase text-stone-400 hover:text-accent transition-colors">Sustainability</Link>
          <Link to="/contact"        className="text-[10px] tracking-wider uppercase text-stone-400 hover:text-accent transition-colors">Contact</Link>
        </div>

        <div className="text-[10px] tracking-wider uppercase text-stone-400 text-center">
          © 2024 Stay Theory. A sanctuary for the senses.
        </div>
      </div>
    </footer>
  );
}
