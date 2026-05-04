import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Home, 
  CalendarCheck, 
  MessageSquare, 
  LogOut 
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "bookings", label: "Booking Requests", icon: CalendarCheck },
    { id: "properties", label: "My Properties", icon: Home },
    { id: "reviews", label: "Guest Reviews", icon: MessageSquare },
  ];

  return (
    <aside className="w-64 md:w-72 h-screen bg-white border-r border-stone-100 flex flex-col p-8 md:p-12 flex-shrink-0">
      <div className="mb-16">
        <Link to="/" className="text-2xl md:text-3xl font-serif italic text-primary">StayTheory</Link>
        <p className="text-[9px] uppercase tracking-[0.3em] text-stone-300 mt-1 font-bold">Owner's Portal</p>
      </div>

      <nav className="flex-grow space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activeTab === item.id 
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
                : "text-stone-500 hover:bg-stone-100"
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? "animate-pulse" : ""}`} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-8 border-t border-stone-100">
        <button className="flex items-center gap-3 text-stone-400 hover:text-red-500 transition-colors group">
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
