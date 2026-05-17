import { useState, useEffect } from "react";
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
import MobileNav from "./components/MobileNav";
import BookingModal from "./components/BookingModal";
import BookingRedirectionModal from "./components/BookingRedirectionModal";
import PropertiesJournal from "./pages/PropertiesJournal";
import PropertyDetails from "./pages/PropertyDetails";
import AllReviews from "./pages/AllReviews";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import { publicService } from "./services/publicService";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function HomePage({ onBookClick }: { onBookClick: (prop?: any) => void }) {
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
      <MobileNav onBookClick={onBookClick} />
    </>
  );
}

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isRedirectOpen, setIsRedirectOpen] = useState(false);
  const [redirectProperty, setRedirectProperty] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    publicService.getProperties().then(setProperties).catch(console.error);
  }, []);

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
      <main className="bg-background min-h-screen selection:bg-[#ffb59e] selection:text-[#3a0b00] overflow-x-hidden w-full relative pt-[72px] pb-[80px] md:pb-0">
        <Routes>
          <Route path="/" element={<HomePage onBookClick={handleBookClick} />} />
          <Route path="/properties" element={<PropertiesJournal onBookClick={handleBookClick} />} />
          <Route path="/property/:id" element={<PropertyDetails onBookClick={handleBookClick} />} />
          <Route path="/reviews" element={<AllReviews onBookClick={handleBookClick} />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
        
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
