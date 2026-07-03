import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { date: "May 1", visitors: 820, bookings: 12 },
  { date: "May 2", visitors: 932, bookings: 15 },
  { date: "May 3", visitors: 901, bookings: 10 },
  { date: "May 4", visitors: 1105, bookings: 22 },
  { date: "May 5", visitors: 1290, bookings: 28 },
  { date: "May 6", visitors: 1420, bookings: 35 },
  { date: "May 7", visitors: 1680, bookings: 42 },
];

export default function AnalyticsChart({ data = [] }: { data?: any[] }) {
  return (
    <div className="h-full w-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d6d3d1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#d6d3d1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8A4630" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8A4630" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a8a29e' }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a8a29e' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f5f5f4', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
            labelStyle={{ color: '#a8a29e', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}
          />
          <Area type="monotone" dataKey="total" name="Total Activity" stroke="#8A4630" fillOpacity={1} fill="url(#colorBookings)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
