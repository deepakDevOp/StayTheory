import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import PropertyGrid from "../components/admin/PropertyGrid";
import Overview from "../components/admin/Overview";
import ReviewManager from "../components/admin/ReviewManager";
import PropertyEditor from "../components/admin/PropertyEditor";
import CMSManager from "../components/admin/CMSManager";
import ContactManager from "../components/admin/ContactManager";
import ConfirmModal from "../components/admin/ConfirmModal";
import FocusBox from "../components/FocusBox";
import { adminService } from "../services/adminService";
import { useNoIndex } from "../hooks/useNoIndex";

export default function AdminDashboard() {
  useNoIndex();
  const navigate = useNavigate();

  // The backend rejects every admin request without a valid token anyway,
  // but this stops the dashboard shell (sidebar, tabs, branding) from
  // rendering at all for a logged-out visitor while the first API call is
  // still in flight.
  const [hasToken] = useState(() => !!localStorage.getItem("staytheory_token"));

  useEffect(() => {
    if (!hasToken) navigate("/admin/login", { replace: true });
  }, [hasToken, navigate]);

  const [activeTab, setActiveTab] = useState("overview");
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const props = await adminService.getProperties();
      setProperties(props);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasToken) fetchData();
  }, [hasToken, fetchData]);

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

  if (!hasToken) return null;

  return (
    <div className="h-[100dvh] w-full bg-background flex flex-col md:flex-row overflow-hidden fixed inset-0">
      <AdminSidebar activeTab={activeTab} setActiveTab={handleTabChange} />

      <main className="flex-grow flex flex-col min-w-0 overflow-hidden relative min-h-0">

        {/* ── MOBILE: properties tab = full-screen 3D carousel ── */}
        {activeTab === "properties" && (
          <div className="md:hidden absolute inset-0 pb-[72px] flex flex-col">
            {loading ? (
              <div className="flex-1 flex items-center justify-center italic text-stone-400">Loading...</div>
            ) : (
              <PropertyGrid
                properties={properties}
                onEdit={handleEditProperty}
                onPhotos={handleManagePhotos}
                onAddClick={handleAddProperty}
              />
            )}
          </div>
        )}

        {/* ── MOBILE: other tabs = normal scrollable layout ── */}
        {activeTab !== "properties" && (
          <div className="md:hidden flex-grow overflow-y-auto px-4 py-6 pb-[86px]">
            {activeTab === "overview" && <Overview />}
            {activeTab === "reviews" && <ReviewManager />}
            {activeTab === "cms" && <CMSManager />}
            {activeTab === "contact" && <ContactManager />}
          </div>
        )}

        {/* ── DESKTOP: all tabs via FocusBox ── */}
        <FocusBox className="hidden md:flex max-w-7xl mx-auto w-full flex-col flex-grow px-12 lg:px-16 py-10 h-full min-h-0">
          {activeTab === "overview" && <div className="flex-grow overflow-y-auto pr-2"><Overview /></div>}

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
              <div className="flex-grow flex items-center min-h-0 overflow-hidden">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center italic text-stone-400">Loading properties...</div>
                ) : (
                  <PropertyGrid
                    properties={properties}
                    onEdit={handleEditProperty}
                    onPhotos={handleManagePhotos}
                    onAddClick={handleAddProperty}
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === "reviews" && <div className="flex-grow overflow-y-auto"><ReviewManager /></div>}
          {activeTab === "cms" && <div className="flex-grow overflow-y-auto"><CMSManager /></div>}
          {activeTab === "contact" && <div className="flex-grow overflow-y-auto"><ContactManager /></div>}
        </FocusBox>
      </main>

      {/* Editor Modal */}
      <PropertyEditor 
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)} 
        property={selectedProperty}
        onSaveSuccess={fetchData}
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
        <div className="absolute inset-0 z-50 bg-white/95 h-[100dvh] flex flex-col items-center justify-center text-center">
          <p className="font-serif italic text-2xl">General settings coming soon.</p>
          <button onClick={() => setActiveTab('overview')} className="mt-4 px-6 py-2 bg-stone-900 text-white rounded-full">Go Back</button>
        </div>
      )}
    </div>
  );
}

// Simple motion import for the dashboard
import { motion } from "motion/react";
