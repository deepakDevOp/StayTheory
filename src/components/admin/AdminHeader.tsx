import { Plus } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle: string;
  showAddButton?: boolean;
  onAddClick?: () => void;
}

export default function AdminHeader({ title, subtitle, showAddButton, onAddClick }: AdminHeaderProps) {
  return (
    <header className="flex justify-between items-end mb-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-serif italic text-on-surface leading-tight">
          {title}
        </h1>
        <p className="text-stone-400 mt-1 text-xs md:text-sm font-light">{subtitle}</p>
      </div>
      
      {showAddButton && (
        <button 
          onClick={onAddClick}
          className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all hover:scale-105 active:scale-95 shadow-md"
        >
          <Plus className="w-4 h-4" />
          New Listing
        </button>
      )}
    </header>
  );
}
