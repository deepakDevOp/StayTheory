import { Clock, XCircle, CheckCircle2 } from "lucide-react";

interface BookingRequest {
  id: string | number;
  guest: string;
  property: string;
  dates: string;
  amount: string;
  status: string;
}

interface BookingTableProps {
  requests: BookingRequest[];
  onConfirm: (id: string | number) => void;
  onCancel: (id: string | number) => void;
  onRowClick: (booking: BookingRequest) => void;
}

export default function BookingTable({ requests, onConfirm, onCancel, onRowClick }: BookingTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-stone-50/50">
            <tr>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-stone-400 font-bold border-b border-stone-100">Guest</th>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-stone-400 font-bold border-b border-stone-100">Property</th>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-stone-400 font-bold border-b border-stone-100">Stay Duration</th>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-stone-400 font-bold border-b border-stone-100">Total</th>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-stone-400 font-bold border-b border-stone-100 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50 cursor-pointer">
            {requests.map((req) => (
              <tr 
                key={req.id} 
                onClick={() => onRowClick(req)}
                className="hover:bg-stone-50/30 transition-colors group"
              >
                <td className="px-8 py-6">
                  <p className="font-medium text-on-surface">{req.guest}</p>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm text-stone-600 bg-stone-100 px-3 py-1 rounded-lg">{req.property}</span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-stone-500">
                    <Clock className="w-3.5 h-3.5 text-primary/60" />
                    <span className="text-sm">{req.dates}</span>
                  </div>
                </td>
                <td className="px-8 py-6 font-semibold text-primary">{req.amount}</td>
                <td className="px-8 py-6">
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => onCancel(req.id)}
                      className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title="Decline Request"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => onConfirm(req.id)}
                      className="flex items-center gap-2 bg-primary/5 text-primary px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-primary/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
