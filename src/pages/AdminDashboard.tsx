import { useState, useCallback, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  Home as HomeIcon 
} from "lucide-react";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import BookingTable from "../components/admin/BookingTable";
import PropertyGrid from "../components/admin/PropertyGrid";
import Overview from "../components/admin/Overview";
import ReviewManager from "../components/admin/ReviewManager";
import PropertyEditor from "../components/admin/PropertyEditor";
import RequestFilterBar from "../components/admin/RequestFilterBar";
import ConfirmModal from "../components/admin/ConfirmModal";
import BookingDetailModal from "../components/admin/BookingDetailModal";
import FocusBox from "../components/FocusBox";

// Dummy data for design phase
const INITIAL_REQUESTS = [
  { 
    id: 1, guest: "Aria Smith", property: "The Tuscan Retreat", 
    dates: "June 12 - June 15", status: "pending", amount: "₹9,300",
    email: "aria.smith@example.com", phone: "+91 98765 43210"
  },
  { 
    id: 2, guest: "Julian V.", property: "Ocean Sanctuary", 
    dates: "July 01 - July 04", status: "pending", amount: "₹12,600",
    email: "j.verne@voyage.com", phone: "+91 88888 77777"
  },
  { 
    id: 3, guest: "Elena R.", property: "The Tuscan Retreat", 
    dates: "June 20 - June 22", status: "pending", amount: "₹6,200",
    email: "elena.r@cloud.com", phone: "+91 99999 11111"
  },
  { 
    id: 4, guest: "Marcus Aurelius", property: "Heritage Haveli", 
    dates: "Aug 05 - Aug 10", status: "pending", amount: "₹25,000",
    email: "marcus.a@stoic.com", phone: "+91 77777 55555"
  },
  { 
    id: 5, guest: "Sophia L.", property: "Modern Glass Villa", 
    dates: "Sept 10 - Sept 12", status: "pending", amount: "₹15,000",
    email: "sophia.l@design.it", phone: "+91 66666 44444"
  },
  { 
    id: 6, guest: "David Goggins", property: "The Tuscan Retreat", 
    dates: "Oct 01 - Oct 05", status: "pending", amount: "₹12,400",
    email: "david.g@stayhard.com", phone: "+91 55555 33333"
  },
  { 
    id: 7, guest: "Leila M.", property: "Ocean Sanctuary", 
    dates: "Oct 15 - Oct 18", status: "pending", amount: "₹14,000",
    email: "leila.m@travel.co", phone: "+91 44444 22222"
  },
  { 
    id: 8, guest: "Aman S.", property: "Heritage Haveli", 
    dates: "Nov 02 - Nov 05", status: "pending", amount: "₹18,000",
    email: "aman.s@start.in", phone: "+91 33333 11111"
  },
];

const INITIAL_PROPERTIES = [
  { id: "tuscan", title: "The Tuscan Retreat", price: "₹3,100/night", active: true },
  { id: "ocean", title: "Ocean Sanctuary", price: "₹4,200/night", active: true },
  { id: "heritage", title: "Heritage Haveli", price: "₹5,500/night", active: true },
  { id: "modern", title: "Modern Glass Villa", price: "₹7,800/night", active: true },
  { id: "stone", title: "Stone Sanctuary", price: "₹6,400/night", active: true },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("bookings");
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Filter States
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const handleTabChange = useCallback((tab: string) => {
    if (isEditorOpen) {
      setPendingTab(tab);
      setShowExitConfirm(true);
    } else {
      setActiveTab(tab);
    }
  }, [isEditorOpen]);

  const confirmExit = useCallback(() => {
    if (pendingTab) {
      setActiveTab(pendingTab);
      setIsEditorOpen(false);
      setPendingTab(null);
    }
    setShowExitConfirm(false);
  }, [pendingTab]);

  // Memoized handlers for maximum speed
  const handleConfirm = useCallback((id: string | number) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    // API call would happen here
  }, []);

  const handleCancel = useCallback((id: string | number) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    // API call would happen here
  }, []);

  const handleEditProperty = useCallback((id: string) => {
    const prop = INITIAL_PROPERTIES.find(p => p.id === id);
    setSelectedProperty(prop);
    setIsEditorOpen(true);
  }, []);

  const handleAddProperty = useCallback(() => {
    setSelectedProperty(null);
    setIsEditorOpen(true);
  }, []);

  const handleManagePhotos = useCallback((id: string) => {
    console.log("Managing photos for:", id);
  }, []);

  // Optimized Filtering Logic
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesProperty = propertyFilter === "all" || req.property === propertyFilter;
      const matchesDate = !dateFilter || req.dates.toLowerCase().includes(dateFilter.toLowerCase());
      return matchesProperty && matchesDate;
    });
  }, [requests, propertyFilter, dateFilter]);

  return (
    <div className="h-[100dvh] w-full bg-background flex overflow-hidden fixed inset-0">
      <AdminSidebar activeTab={activeTab} setActiveTab={handleTabChange} />

      <main className="flex-grow flex flex-col min-w-0 overflow-hidden relative">
        <FocusBox className="max-w-7xl mx-auto w-full h-full flex flex-col px-8 md:px-12 lg:px-16 py-6 md:py-10">
          {activeTab === "overview" && <div className="flex-grow overflow-y-auto"><Overview /></div>}

          {activeTab === "bookings" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="flex flex-col h-full overflow-hidden"
            >
              <div className="flex-shrink-0">
                <AdminHeader 
                  title="Booking Requests" 
                  subtitle="Review and confirm guest stays for your sanctuaries." 
                />
                
                <RequestFilterBar 
                  properties={INITIAL_PROPERTIES}
                  propertyFilter={propertyFilter}
                  setPropertyFilter={setPropertyFilter}
                  dateFilter={dateFilter}
                  setDateFilter={setDateFilter}
                  resultsCount={filteredRequests.length}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {[
                    { label: "Pending Approvals", value: requests.length, color: "text-primary" },
                    { label: "Confirmed Today", value: "05", color: "text-stone-900" },
                    { label: "Revenue (MTD)", value: "₹45,200", color: "text-stone-900" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/50 backdrop-blur-sm p-5 rounded-2xl border border-stone-100 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-[8px] uppercase tracking-[0.2em] text-stone-400 mb-1 font-bold">{stat.label}</p>
                        <p className={`text-2xl font-serif italic ${stat.color}`}>{stat.value}</p>
                      </div>
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-inner">
                        <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-primary' : 'bg-stone-300'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-grow overflow-y-auto min-h-0 pr-2 no-scrollbar relative group">
                <BookingTable 
                  requests={filteredRequests} 
                  onConfirm={handleConfirm} 
                  onCancel={handleCancel} 
                  onRowClick={(booking) => { setSelectedBooking(booking); setIsDetailOpen(true); }}
                />
                {/* Scroll Hint: Bottom Gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          )}

          {activeTab === "properties" && (
            <div className="flex-grow flex flex-col min-h-0 overflow-hidden">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-shrink-0">
                <AdminHeader 
                  title="My Properties" 
                  subtitle="Curate descriptions, pricing, and amenities for each sanctuary." 
                  showAddButton 
                  onAddClick={handleAddProperty}
                />
              </motion.div>
              <div className="flex-grow flex items-center min-h-0">
                <PropertyGrid 
                  properties={INITIAL_PROPERTIES} 
                  onEdit={handleEditProperty} 
                  onPhotos={handleManagePhotos} 
                />
              </div>
            </div>
          )}

          {activeTab === "reviews" && <div className="flex-grow overflow-y-auto"><ReviewManager /></div>}

          {/* Editor Modal */}
          <PropertyEditor 
            isOpen={isEditorOpen} 
            onClose={() => setIsEditorOpen(false)} 
            property={selectedProperty}
          />

          {/* Booking Detail Modal */}
          <BookingDetailModal 
            isOpen={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
            booking={selectedBooking}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />

          {/* Exit Confirmation Modal */}
          <ConfirmModal 
            isOpen={showExitConfirm}
            onClose={() => setShowExitConfirm(false)}
            onConfirm={confirmExit}
            title="Unsaved Changes"
            message="You are currently editing a sanctuary. If you leave now, your changes will be discarded. Would you like to continue?"
            confirmLabel="Discard & Exit"
            cancelLabel="Stay and Edit"
          />

          {/* Placeholder for other tabs */}
          {activeTab === "settings" && (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center opacity-40">
              <p className="font-serif italic text-xl">General settings coming soon.</p>
            </div>
          )}
        </FocusBox>
      </main>
    </div>
  );
}

// Simple motion import for the dashboard
import { motion } from "motion/react";
