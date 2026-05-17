import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, Instagram, ExternalLink } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Navbar onBookClick={() => {}} />
      <main className="max-w-3xl mx-auto px-6 py-24 md:py-32">
        <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold mb-4">Get in Touch</p>
        <h1 className="text-4xl md:text-5xl font-serif italic text-stone-800 mb-3 leading-tight">Contact Us</h1>
        <p className="text-stone-500 text-base mb-16 max-w-lg leading-relaxed">
          We love hearing from our guests. Whether you have a question about a property, a collaboration idea, or simply want to say hello — reach out below.
        </p>

        <div className="space-y-4">
          {/* Email */}
          <a
            href="mailto:atstaytheory@gmail.com"
            className="flex items-center gap-5 p-6 rounded-2xl border border-stone-100 bg-white shadow-sm hover:border-accent/30 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
              <Mail className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-1">Email</p>
              <p className="text-stone-800 font-medium group-hover:text-accent transition-colors">atstaytheory@gmail.com</p>
              <p className="text-stone-400 text-xs mt-0.5">We typically respond within 24 hours</p>
            </div>
            <ExternalLink className="w-4 h-4 text-stone-300 ml-auto group-hover:text-accent transition-colors" />
          </a>

          {/* Phone */}
          <a
            href="tel:+917827467208"
            className="flex items-center gap-5 p-6 rounded-2xl border border-stone-100 bg-white shadow-sm hover:border-accent/30 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
              <Phone className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-1">Phone</p>
              <p className="text-stone-800 font-medium group-hover:text-accent transition-colors">+91 78274 67208</p>
              <p className="text-stone-400 text-xs mt-0.5">Available Mon – Sat, 10 am – 7 pm IST</p>
            </div>
            <ExternalLink className="w-4 h-4 text-stone-300 ml-auto group-hover:text-accent transition-colors" />
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/staytheory.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-5 p-6 rounded-2xl border border-stone-100 bg-white shadow-sm hover:border-accent/30 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
              <Instagram className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-1">Instagram</p>
              <p className="text-stone-800 font-medium group-hover:text-accent transition-colors">@staytheory.in</p>
              <p className="text-stone-400 text-xs mt-0.5">Follow for sanctuary stories and behind the scenes</p>
            </div>
            <ExternalLink className="w-4 h-4 text-stone-300 ml-auto group-hover:text-accent transition-colors" />
          </a>

          {/* Booking */}
          <div className="mt-6 p-6 rounded-2xl bg-stone-50 border border-stone-100">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-2">Reservations</p>
            <p className="text-stone-600 text-sm leading-relaxed mb-4">
              All bookings are managed through Airbnb. Click the button below to view availability and reserve your stay directly.
            </p>
            <a
              href="https://www.airbnb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full text-sm font-medium hover:bg-[#8A4630] transition-colors"
            >
              Book on Airbnb
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-stone-100">
          <Link to="/" className="text-[10px] uppercase tracking-widest font-bold text-stone-400 hover:text-accent transition-colors">
            ← Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
