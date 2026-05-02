import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeatureSection from "./components/FeatureSection";
import TactileSection from "./components/TactileSection";
import LandscapeSection from "./components/LandscapeSection";
import HostSection from "./components/HostSection";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import MobileNav from "./components/MobileNav";
import BookingModal from "./components/BookingModal";
import PropertiesJournal from "./pages/PropertiesJournal";

function HomePage({ onBookClick }: { onBookClick: () => void }) {
  return (
    <>
      <Navbar onBookClick={onBookClick} />
      <Hero />
      <FeatureSection />
      <TactileSection />
      <LandscapeSection />
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

  return (
    <BrowserRouter>
      <main className="bg-background min-h-screen selection:bg-[#ffb59e] selection:text-[#3a0b00]">
        <Routes>
          <Route path="/" element={<HomePage onBookClick={() => setIsBookingOpen(true)} />} />
          <Route path="/journal" element={<PropertiesJournal onBookClick={() => setIsBookingOpen(true)} />} />
        </Routes>
        
        <BookingModal 
          isOpen={isBookingOpen} 
          onClose={() => setIsBookingOpen(false)} 
        />
      </main>
    </BrowserRouter>
  );
}
