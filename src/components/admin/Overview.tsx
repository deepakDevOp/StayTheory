import { motion } from "motion/react";
import { 
  TrendingUp, 
  Users, 
  Star, 
  ArrowUpRight,
  ChevronRight,
  Clock
} from "lucide-react";
import AdminHeader from "./AdminHeader";

const stats = [
  { label: "Total Revenue", value: "₹1,42,500", change: "+12.5%", icon: TrendingUp },
  { label: "Total Guests", value: "48", change: "+3.2%", icon: Users },
  { label: "Avg. Rating", value: "4.9", change: "Stable", icon: Star },
];

const recentActivity = [
  { id: 1, type: "booking", title: "New Request: The Tuscan Retreat", time: "2 hours ago", status: "pending" },
  { id: 2, type: "review", title: "5-Star Review from Elena V.", time: "5 hours ago", status: "success" },
  { id: 3, type: "booking", title: "Julian V. Confirmed", time: "1 day ago", status: "confirmed" },
];

export default function Overview() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <AdminHeader 
        title="Welcome Back" 
        subtitle="Here is what's happening at your sanctuaries today." 
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] group-hover:scale-110 transition-transform duration-700" />
            <stat.icon className="w-6 h-6 text-primary mb-4" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-2 font-bold">{stat.label}</p>
            <div className="flex items-baseline gap-3">
              <p className="text-4xl font-serif italic text-on-surface">{stat.value}</p>
              <span className={`text-[10px] font-bold ${stat.change.includes('+') ? 'text-green-600' : 'text-stone-400'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Activity */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-serif italic text-on-surface">Recent Activity</h3>
            <button className="text-[10px] uppercase tracking-widest font-bold text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-8">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex gap-6 items-start group">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  item.status === 'pending' ? 'bg-amber-400' : 
                  item.status === 'confirmed' ? 'bg-primary' : 'bg-green-500'
                }`} />
                <div className="flex-grow">
                  <p className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors cursor-pointer">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-stone-300" />
                    <p className="text-xs text-stone-400">{item.time}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-200 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            ))}
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
    </motion.div>
  );
}
