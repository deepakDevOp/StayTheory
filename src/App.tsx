import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PropertyCollection from "./components/PropertyCollection";
import FeatureSection from "./components/FeatureSection";
import TactileSection from "./components/TactileSection";
import HostSection from "./components/HostSection";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import BookingModal from "./components/BookingModal";
import BookingRedirectionModal from "./components/BookingRedirectionModal";
import { publicService } from "./services/publicService";
import { useLocation } from "react-router-dom";
import { getCachedProperties, setCachedProperties, fetchPropertiesDeduped } from "./utils/preload";
import { useRevalidateOnFocus } from "./hooks/useRevalidateOnFocus";

// Route-only pages are lazy-loaded so their code (and, for the admin
// dashboard, recharts) doesn't ship in the main bundle every public visitor
// downloads on first load — only fetched when someone actually navigates there.
const PropertiesJournal = lazy(() => import("./pages/PropertiesJournal"));
const PropertyDetails = lazy(() => import("./pages/PropertyDetails"));
const AllReviews = lazy(() => import("./pages/AllReviews"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Sustainability = lazy(() => import("./pages/Sustainability"));
const Contact = lazy(() => import("./pages/Contact"));

function RouteFallback() {
  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse text-2xl font-serif italic text-stone-400">Loading...</div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function HomePage({ onBookClick }: { onBookClick: (prop?: any) => void }) {
  useEffect(() => {
    try {
      import("./services/api").then((m) => {
        m.default.post("/properties/analytics/track-homepage");
      }).catch(() => { });
    } catch (err) { }
  }, []);

  return (
    <>
      <Navbar onBookClick={onBookClick} />
      <Hero />
      <PropertyCollection />
      <FeatureSection />
      <TactileSection />
      <HostSection />
      <Testimonials />
      <div className="md:h-[calc(100vh-72px)] flex flex-col">
        <div className="flex-grow flex items-center">
          <CTA onBookClick={onBookClick} />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isRedirectOpen, setIsRedirectOpen] = useState(false);
  const [redirectProperty, setRedirectProperty] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);

  const fetchProperties = () => {
    fetchPropertiesDeduped(() => publicService.getProperties()).then((data) => {
      setProperties(data);
      setCachedProperties(data);
    }).catch(console.error);
  };

  useEffect(() => {
    const cached = getCachedProperties();
    if (cached) setProperties(cached);
    fetchProperties();
  }, []);

  useRevalidateOnFocus(fetchProperties);

  const handleBookClick = (property?: any) => {
    // Determine which property we are talking about
    let targetProperty = property;

    if (!targetProperty) {
      // If no specific property, find the first one that has an airbnb link
      targetProperty = properties.find(p => p.airbnb_url);
    }

    // If we have a target property with an airbnb link, show the redirection modal
    if (targetProperty?.airbnb_url) {
      setRedirectProperty(targetProperty);
      setIsRedirectOpen(true);
      return;
    }

    // Fallback to internal modal
    setIsBookingOpen(true);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <main className="bg-background min-h-screen selection:bg-[#ffb59e] selection:text-[#3a0b00] overflow-x-hidden w-full relative pt-[72px]">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage onBookClick={handleBookClick} />} />
            <Route path="/properties" element={<PropertiesJournal onBookClick={handleBookClick} />} />
            <Route path="/property/:id" element={<PropertyDetails onBookClick={handleBookClick} />} />
            <Route path="/reviews" element={<AllReviews onBookClick={handleBookClick} />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/sustainability" element={<Sustainability />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
        </Suspense>

        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          onRedirect={(prop) => {
            setIsBookingOpen(false);
            setRedirectProperty(prop);
            // Small delay to let the first modal close smoothly
            setTimeout(() => setIsRedirectOpen(true), 300);
          }}
        />

        <BookingRedirectionModal
          isOpen={isRedirectOpen}
          onClose={() => setIsRedirectOpen(false)}
          property={redirectProperty}
        />
      </main>
    </BrowserRouter>
  );
}
