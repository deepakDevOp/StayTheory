import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  MessageSquare,
  Phone,
  LogOut
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const navigate = useNavigate();
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "properties", label: "My Properties", icon: Home },
    { id: "reviews", label: "Guest Reviews", icon: MessageSquare },
    { id: "cms", label: "Home Settings", icon: LayoutDashboard },
    { id: "contact", label: "Contact", icon: Phone },
  ];

  const handleLogout = () => {
    localStorage.removeItem("staytheory_token");
    navigate("/admin/login");
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-stone-100 flex-shrink-0 z-20">
        <div>
          <Link to="/" className="text-xl font-serif italic text-primary">StayTheory</Link>
        </div>
        <button onClick={handleLogout} className="p-2 text-stone-400 hover:text-red-500 transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 lg:w-72 h-screen bg-white border-r border-stone-100 flex-col p-8 flex-shrink-0 z-20">
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
        <button onClick={handleLogout} className="flex items-center gap-3 text-stone-400 hover:text-red-500 transition-colors group">
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 flex justify-around items-center p-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
              activeTab === item.id 
                ? "text-primary" 
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? "animate-pulse" : ""}`} />
            <span className="text-[10px] font-medium hidden sm:block">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
