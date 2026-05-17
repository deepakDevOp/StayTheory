import { useState, useCallback, useMemo, useEffect } from "react";
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
import CMSManager from "../components/admin/CMSManager";
import RequestFilterBar from "../components/admin/RequestFilterBar";
import ConfirmModal from "../components/admin/ConfirmModal";
import BookingDetailModal from "../components/admin/BookingDetailModal";
import FocusBox from "../components/FocusBox";
import { adminService } from "../services/adminService";



// import { propertiesData } from "../data/properties";
// import { bookingsData } from "../data/bookings";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("bookings");
  const [requests, setRequests] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Filter States
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [props, bks] = await Promise.all([
        adminService.getProperties(),
        adminService.getAllBookings()
      ]);
      setProperties(props);
      setRequests(bks);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const handleConfirm = useCallback(async (id: string) => {
    try {
      await adminService.updateBookingStatus(id, "confirmed");
      fetchData(); // Refresh
    } catch (error) {
      console.error("Failed to confirm booking:", error);
    }
  }, [fetchData]);

  const handleCancel = useCallback(async (id: string) => {
    try {
      await adminService.updateBookingStatus(id, "cancelled");
      fetchData(); // Refresh
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    }
  }, [fetchData]);



  const handleAddProperty = useCallback(() => {
    setSelectedProperty(null);
    setIsEditorOpen(true);
  }, []);

  const handleEditProperty = useCallback((propOrId: any) => {
    if (!propOrId) return handleAddProperty();
    
    let prop;
    if (typeof propOrId === 'string') {
      prop = properties.find(p => p.id === propOrId);
    } else {
      prop = propOrId;
    }
    
    setSelectedProperty(prop);
    setIsEditorOpen(true);
  }, [properties, handleAddProperty]);

  const handleManagePhotos = useCallback((id: string) => {
    console.log("Managing photos for:", id);
  }, []);

  // Optimized Filtering Logic
  const filteredRequests = useMemo(() => {
    if (!Array.isArray(requests)) return [];
    return requests
      .filter(req => {
        const matchesProperty = propertyFilter === "all" || req.property?.title === propertyFilter;
        const dateStr = `${req.check_in} - ${req.check_out}`;
        const matchesDate = !dateFilter || dateStr.toLowerCase().includes(dateFilter.toLowerCase());
        return matchesProperty && matchesDate;
      })
      .map(req => ({
        id: req.id,
        guest: req.user?.full_name || "Guest",
        property: req.property?.title || "Property",
        dates: `${req.check_in} - ${req.check_out}`,
        amount: "₹12,400", // Static mock
        status: req.status
      }));
  }, [requests, propertyFilter, dateFilter]);

  return (
    <div className="h-[100dvh] w-full bg-background flex flex-col md:flex-row overflow-hidden fixed inset-0">
      <AdminSidebar activeTab={activeTab} setActiveTab={handleTabChange} />

      <main className="flex-grow flex flex-col min-w-0 overflow-y-auto md:overflow-hidden relative pb-[72px] md:pb-0">
        <FocusBox className="max-w-7xl mx-auto w-full flex flex-col flex-grow px-4 md:px-12 lg:px-16 py-6 md:py-10">
          {activeTab === "overview" && <div className="flex-grow overflow-y-auto"><Overview /></div>}

          {activeTab === "bookings" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="flex flex-col flex-grow md:h-full md:overflow-hidden"
            >
              <div className="flex-shrink-0">
                <AdminHeader 
                  title="Booking Requests" 
                  subtitle="Review and confirm guest stays for your sanctuaries." 
                />
                
                <RequestFilterBar 
                  properties={properties}
                  propertyFilter={propertyFilter}
                  setPropertyFilter={setPropertyFilter}
                  dateFilter={dateFilter}
                  setDateFilter={setDateFilter}
                  resultsCount={filteredRequests.length}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {[
                    { label: "Pending Approvals", value: Array.isArray(requests) ? requests.filter((r: any) => r.status === 'pending').length : 0, color: "text-primary" },
                    { label: "Confirmed Today", value: Array.isArray(requests) ? requests.filter((r: any) => r.status === 'confirmed').length : 0, color: "text-stone-900" },
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

              <div className="flex-grow md:overflow-y-auto min-h-0 pr-2 no-scrollbar relative group">
                {loading ? (
                  <div className="h-full flex items-center justify-center italic text-stone-400">Loading requests...</div>
                ) : (
                  <BookingTable 
                    requests={filteredRequests} 
                    onConfirm={handleConfirm} 
                    onCancel={handleCancel} 
                    onRowClick={(booking) => { setSelectedBooking(booking); setIsDetailOpen(true); }}
                  />
                )}
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
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center italic text-stone-400">Loading properties...</div>
                ) : (
                  <PropertyGrid 
                    properties={properties} 
                    onEdit={handleEditProperty} 
                    onPhotos={handleManagePhotos} 
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === "reviews" && <div className="flex-grow overflow-y-auto"><ReviewManager /></div>}
          
          {activeTab === "cms" && <div className="flex-grow overflow-y-auto"><CMSManager /></div>}

        </FocusBox>
      </main>

      {/* Editor Modal */}
      <PropertyEditor 
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)} 
        property={selectedProperty}
        onSaveSuccess={fetchData}
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
        <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm h-[100dvh] flex flex-col items-center justify-center text-center opacity-90">
          <p className="font-serif italic text-2xl">General settings coming soon.</p>
          <button onClick={() => setActiveTab('bookings')} className="mt-4 px-6 py-2 bg-stone-900 text-white rounded-full">Go Back</button>
        </div>
      )}
    </div>
  );
}

// Simple motion import for the dashboard
import { motion } from "motion/react";
