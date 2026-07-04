import { motion } from "motion/react";
import { Home, Compass, CalendarCheck, Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface MobileNavProps {
  onBookClick: () => void;
}

export default function MobileNav({ onBookClick }: MobileNavProps) {
  const location = useLocation();

  const tabs = [
    {
      icon: Compass,
      label: "Explore",
      href: "/#reviews",
      type: "anchor" as const,
      active: location.hash === "#reviews",
      color: "text-amber-400",
      bg: "bg-amber-400/15",
    },
    {
      icon: Home,
      label: "Stays",
      href: "/properties",
      type: "link" as const,
      active: location.pathname === "/properties",
      color: "text-accent",
      bg: "bg-accent/15",
    },
    {
      icon: Mail,
      label: "Contact",
      href: "/contact",
      type: "link" as const,
      active: location.pathname === "/contact",
      color: "text-sage",
      bg: "bg-sage/15",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe pointer-events-none">
      <div className="pointer-events-auto mx-3 mb-3 rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
        style={{ background: "rgba(15, 10, 8, 0.92)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.07)" }}>

        {/* Top accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

        <div className="flex items-stretch px-1 py-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const item = (
              <motion.div
                key={tab.label}
                whileTap={{ scale: 0.88 }}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl transition-all ${tab.active ? tab.bg : ""}`}
              >
                <Icon className={`w-[18px] h-[18px] mb-1 transition-colors ${tab.active ? tab.color : "text-stone-500"}`} />
                <span className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${tab.active ? tab.color : "text-stone-600"}`}>
                  {tab.label}
                </span>
              </motion.div>
            );

            return tab.type === "anchor" ? (
              <a key={tab.label} href={tab.href} className="flex-1">{item}</a>
            ) : (
              <Link key={tab.label} to={tab.href} className="flex-1">{item}</Link>
            );
          })}

          {/* Book Now — special CTA */}
          <motion.button
            onClick={onBookClick}
            whileTap={{ scale: 0.88 }}
            className="flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl relative overflow-hidden"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center mb-0.5 shadow-lg"
              style={{ background: "linear-gradient(135deg, #A85E46 0%, #6b2d1e 100%)", boxShadow: "0 4px 12px rgba(168,94,70,0.5)" }}
            >
              <CalendarCheck className="w-4 h-4 text-white" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-accent">Book</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
