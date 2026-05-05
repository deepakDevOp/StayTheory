import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Users, 
  Star, 
  ArrowUpRight, 
  ChevronRight, 
  Clock, 
  Eye, 
  ArrowRight, 
  X, 
  Home, 
  CheckCircle, 
  Calendar 
} from "lucide-react";
import AdminHeader from "./AdminHeader";
import AnalyticsChart from "./AnalyticsChart";
import { adminService } from "../../services/adminService";

const ICON_MAP: Record<string, any> = {
  TrendingUp,
  Users,
  Eye,
  Star,
  Home,
  CheckCircle,
  Calendar
};

const propertyTrafficData: Record<string, any[]> = {
  day: [
    { property: "Tuscan Retreat", visitors: 45, percentage: 40, color: "bg-primary" },
    { property: "Kyoto Machiya", visitors: 32, percentage: 28, color: "bg-stone-400" },
    { property: "Nordic Cabin", visitors: 28, percentage: 22, color: "bg-stone-300" },
    { property: "others", visitors: 10, percentage: 10, color: "bg-stone-200" },
  ],
  week: [
    { property: "Tuscan Retreat", visitors: 312, percentage: 42, color: "bg-primary" },
    { property: "Kyoto Machiya", visitors: 245, percentage: 33, color: "bg-stone-400" },
    { property: "Nordic Cabin", visitors: 110, percentage: 15, color: "bg-stone-300" },
    { property: "others", visitors: 74, percentage: 10, color: "bg-stone-200" },
  ],
  month: [
    { property: "Tuscan Retreat", visitors: 1240, percentage: 45, color: "bg-primary" },
    { property: "Kyoto Machiya", visitors: 890, percentage: 32, color: "bg-stone-400" },
    { property: "Nordic Cabin", visitors: 450, percentage: 16, color: "bg-stone-300" },
    { property: "others", visitors: 195, percentage: 7, color: "bg-stone-200" },
  ]
};

const mockSnapshot = {
  stats: [
    { label: "Total Bookings", value: "24", icon: "Calendar", trend: "up", trendValue: "+12%" },
    { label: "Active Listings", value: "4", icon: "Home", trend: "none", trendValue: "Stable" },
    { label: "Monthly Revenue", value: "₹45.2k", icon: "TrendingUp", trend: "up", trendValue: "+8%" },
    { label: "Avg Rating", value: "4.8", icon: "Star", trend: "none", trendValue: "Top Tier" }
  ],
  recent_activity: [
    { id: 1, type: "booking", message: "New booking request for Tuscan Retreat", time: "2 hours ago" },
    { id: 2, type: "review", message: "Sarah left a 5-star review for Ocean Sanctuary", time: "5 hours ago" },
    { id: 3, type: "booking", message: "Booking confirmed for Nordic Cabin", time: "1 day ago" }
  ],
  chart_data: [
    { name: "Mon", visitors: 400, bookings: 24 },
    { name: "Tue", visitors: 300, bookings: 13 },
    { name: "Wed", visitors: 200, bookings: 98 },
    { name: "Thu", visitors: 278, bookings: 39 },
    { name: "Fri", visitors: 189, bookings: 48 },
    { name: "Sat", visitors: 239, bookings: 38 },
    { name: "Sun", visitors: 349, bookings: 43 }
  ]
};

export default function Overview() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(mockSnapshot);
  const [showTrafficSources, setShowTrafficSources] = useState(false);
  const [trafficFilter, setTrafficFilter] = useState<"day" | "week" | "month">("week");

  useEffect(() => {
    // Static mode: no data fetching
    console.log("Overview: Static mode active");
  }, []);

  const { stats, recent_activity, chart_data } = data;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <AdminHeader 
        title="Welcome Back" 
        subtitle="Here is what's happening at your sanctuaries today." 
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mb-12">
        {stats.map((stat: any, i: number) => {
          const Icon = ICON_MAP[stat.icon] || TrendingUp;
          return (
            <div key={i} className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] group-hover:scale-110 transition-transform duration-700" />
              <Icon className="w-6 h-6 text-primary mb-4" />
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-2 font-bold">{stat.label}</p>
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-serif italic text-on-surface">{stat.value}</p>
                <span className={`text-[10px] font-bold ${stat.trend === 'up' ? 'text-green-600' : 'text-stone-400'}`}>
                  {stat.trendValue}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[2.5rem] border border-stone-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-serif italic text-on-surface">Traffic & Conversions</h3>
              <p className="text-xs text-stone-400 mt-1">Comparing daily visitors to booking requests</p>
            </div>
            <select className="bg-stone-50 border border-stone-100 text-stone-500 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="flex-grow">
            <AnalyticsChart data={chart_data} />
          </div>
        </div>

        {/* Conversion Rate Spotlight */}
        <div className="bg-primary text-white p-8 md:p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary-200 mb-2 text-white/70">Conversion Rate</h3>
            <p className="text-6xl font-serif italic mb-4">8.4%</p>
            <p className="text-sm text-white/80 leading-relaxed">
              Your conversion rate is up <span className="font-bold text-white">+1.2%</span> from last week. The <span className="font-bold text-white">Tuscan Retreat</span> is driving the highest conversions.
            </p>
          </div>
          <button 
            onClick={() => setShowTrafficSources(true)}
            className="relative z-10 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white hover:text-stone-200 transition-colors mt-8 self-start"
          >
            Top Properties <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Activity */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-serif italic text-on-surface">Recent Activity</h3>
            <button className="text-[10px] uppercase tracking-widest font-bold text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-8">
            {recent_activity.length === 0 ? (
              <div className="py-10 text-center">
                <Clock className="w-10 h-10 text-stone-200 mx-auto mb-4" />
                <p className="font-serif italic text-stone-400">No recent activity to report.</p>
              </div>
            ) : (
              recent_activity.map((item: any) => (
                <div key={item.id} className="flex gap-6 items-start group">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    item.type === 'booking' ? 'bg-amber-400' : 'bg-primary'
                  }`} />
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors cursor-pointer">
                      {item.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-stone-300" />
                      <p className="text-xs text-stone-400">{item.time}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-200 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="flex flex-col gap-8">
          <div className="bg-stone-900 p-10 rounded-[2.5rem] text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-serif italic mb-2">Pro Tip</h3>
              <p className="text-stone-400 text-sm leading-relaxed mb-6">
                Updated photos can increase booking requests by up to 40%. Add a new view of the Tuscan garden today.
              </p>
              <button className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors">
                Update Gallery <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="bg-primary/5 p-10 rounded-[2.5rem] border border-primary/10">
            <h3 className="text-xl font-serif italic text-primary mb-4">Need Help?</h3>
            <p className="text-stone-600 text-sm leading-relaxed mb-6">
              If you have any issues with a guest or a booking, reach out to support.
            </p>
            <button className="w-full py-4 bg-white border border-primary/20 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all">
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Traffic Sources Modal */}
      <AnimatePresence>
        {showTrafficSources && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setShowTrafficSources(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-10 rounded-[3rem] w-full max-w-md shadow-2xl relative"
            >
              <button onClick={() => setShowTrafficSources(false)} className="absolute top-8 right-8 p-2 text-stone-400 hover:text-stone-900 transition-colors bg-stone-50 rounded-full">
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-8 pr-12">
                <h3 className="text-2xl font-serif italic text-on-surface mb-6">Top Visited Properties</h3>
                <div className="flex gap-1 p-1 bg-stone-50 rounded-xl inline-flex border border-stone-100">
                  {["day", "week", "month"].map(filter => (
                    <button 
                      key={filter}
                      onClick={() => setTrafficFilter(filter as any)}
                      className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${
                        trafficFilter === filter ? 'bg-white text-primary shadow-sm' : 'text-stone-400 hover:text-stone-600'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {propertyTrafficData[trafficFilter].map((s, i) => (
                  <div key={`${trafficFilter}-${i}`}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-bold text-stone-700">{s.property}</span>
                      <div className="text-right">
                        <span className="text-xs font-bold text-stone-900 block">{s.percentage}%</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400">{s.visitors} visits</span>
                      </div>
                    </div>
                    <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${s.percentage}%` }} transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                        className={`h-full ${s.color}`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
