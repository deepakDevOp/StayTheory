import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Navbar onBookClick={() => { }} />
      <main className="max-w-3xl mx-auto px-6 py-24 md:py-32">
        <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold mb-4">Legal</p>
        <h1 className="text-4xl md:text-5xl font-serif italic text-stone-800 mb-3 leading-tight">Privacy Policy</h1>
        <p className="text-stone-400 text-sm mb-12">Last updated: May 2025</p>

        <div className="prose prose-stone max-w-none space-y-10 text-stone-600 leading-relaxed text-[15px]">

          <section>
            <h2 className="text-xl font-serif italic text-stone-800 mb-3">1. Information We Collect</h2>
            <p>
              When you browse Stay Theory, we may collect basic usage data such as pages visited, device type, and approximate location through analytics tools. We do not collect any personally identifiable information unless you voluntarily contact us directly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-stone-800 mb-3">2. How We Use Your Information</h2>
            <p>
              Usage data is used solely to improve the experience on our website — understanding which sanctuaries attract the most interest and ensuring our pages load quickly. We do not sell, rent, or share any data with third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-stone-800 mb-3">3. Booking & External Services</h2>
            <p>
              All bookings are handled through Airbnb. When you click "Book on Airbnb," you leave Stay Theory and are subject to Airbnb's own privacy policy and terms of service. We encourage you to review their policies before providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-stone-800 mb-3">4. Cookies</h2>
            <p>
              We use minimal, functional cookies to remember your preferences during a session. We do not use advertising cookies or cross-site tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-stone-800 mb-3">5. Images & Media</h2>
            <p>
              Property photography on this site is owned by Stay Theory and may not be reproduced without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-stone-800 mb-3">6. Contact</h2>
            <p>
              For any privacy-related questions, please reach out at{" "}
              <a href="mailto:atstaytheory@gmail.com" className="text-accent hover:underline">atstaytheory@gmail.com</a>.
            </p>
          </section>
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
