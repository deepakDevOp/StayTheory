import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TermsOfService() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Navbar onBookClick={() => {}} />
      <main className="max-w-3xl mx-auto px-6 py-24 md:py-32">
        <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold mb-4">Legal</p>
        <h1 className="text-4xl md:text-5xl font-serif italic text-stone-800 mb-3 leading-tight">Terms of Service</h1>
        <p className="text-stone-400 text-sm mb-12">Last updated: May 2025</p>

        <div className="space-y-10 text-stone-600 leading-relaxed text-[15px]">

          <section>
            <h2 className="text-xl font-serif italic text-stone-800 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Stay Theory website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-stone-800 mb-3">2. Use of the Website</h2>
            <p>
              Stay Theory's website is provided for informational and inspirational purposes. You may browse our sanctuary listings, read guest reviews, and explore our spaces. All content is the property of Stay Theory and may not be reproduced without permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-stone-800 mb-3">3. Bookings</h2>
            <p>
              All reservations are facilitated through Airbnb. Stay Theory does not directly process bookings, payments, or guest data on this website. By proceeding to Airbnb, you agree to Airbnb's own terms and conditions, cancellation policies, and guest standards. Stay Theory holds no liability for disputes arising from Airbnb transactions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-stone-800 mb-3">4. Intellectual Property</h2>
            <p>
              All photography, copy, branding, and design elements on Stay Theory are owned by Stay Theory. Unauthorised use, reproduction, or distribution is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-stone-800 mb-3">5. Limitation of Liability</h2>
            <p>
              Stay Theory is not liable for any indirect, incidental, or consequential damages arising from your use of this website or the third-party booking platforms we link to. The website is provided "as is" without warranties of any kind.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-stone-800 mb-3">6. Changes to Terms</h2>
            <p>
              We reserve the right to update these terms at any time. Continued use of the website after changes are posted constitutes your acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-stone-800 mb-3">7. Contact</h2>
            <p>
              For legal enquiries, please contact us at{" "}
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
