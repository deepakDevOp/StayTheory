import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { FileText, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const sections = [
  {
    num: "01",
    title: "Acceptance of Terms",
    body: "By accessing and using the Stay Theory website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website.",
  },
  {
    num: "02",
    title: "Use of the Website",
    body: "Stay Theory's website is provided for informational and inspirational purposes. You may browse our sanctuary listings, read guest reviews, and explore our spaces. All content is the property of Stay Theory and may not be reproduced without permission.",
  },
  {
    num: "03",
    title: "Bookings",
    body: "All reservations are facilitated through Airbnb. Stay Theory does not directly process bookings, payments, or guest data on this website. By proceeding to Airbnb, you agree to Airbnb's own terms and conditions, cancellation policies, and guest standards. Stay Theory holds no liability for disputes arising from Airbnb transactions.",
  },
  {
    num: "04",
    title: "Intellectual Property",
    body: "All photography, copy, branding, and design elements on Stay Theory are owned by Stay Theory. Unauthorised use, reproduction, or distribution is strictly prohibited.",
  },
  {
    num: "05",
    title: "Limitation of Liability",
    body: "Stay Theory is not liable for any indirect, incidental, or consequential damages arising from your use of this website or the third-party booking platforms we link to. The website is provided \"as is\" without warranties of any kind.",
  },
  {
    num: "06",
    title: "Changes to Terms",
    body: "We reserve the right to update these terms at any time. Continued use of the website after changes are posted constitutes your acceptance of the revised terms.",
  },
];

export default function TermsOfService() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Navbar onBookClick={() => { }} />

      {/* Hero */}
      <div
        className="relative overflow-hidden pt-[72px]"
        style={{ background: "linear-gradient(160deg, #1a0d08 0%, #3d1a10 50%, #6b2d1e 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 bg-accent/10 rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10 px-6 md:px-16 pt-14 pb-14 md:pt-20 md:pb-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Back to Home</span>
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-accent/70" />
              <span className="text-[9px] uppercase tracking-[0.5em] font-bold text-white/40">Legal</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif italic text-white mb-3">Terms of Service</h1>
            <p className="text-white/35 text-sm">Last updated: May 2025</p>
          </motion.div>
        </div>
      </div>

      {/* Sections */}
      <main className="max-w-3xl mx-auto px-6 md:px-8 py-12 md:py-16">
        <div className="space-y-4">
          {sections.map((s, idx) => (
            <motion.section
              key={s.num}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              className="flex gap-5 p-6 rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-md hover:border-accent/20 transition-all group"
            >
              <span className="text-[28px] font-serif font-bold text-stone-100 group-hover:text-accent/20 transition-colors leading-none shrink-0 select-none mt-0.5">
                {s.num}
              </span>
              <div>
                <h2 className="text-[15px] font-semibold text-stone-800 mb-2">{s.title}</h2>
                <p className="text-stone-500 leading-relaxed text-[14px] md:text-[15px]">{s.body}</p>
              </div>
            </motion.section>
          ))}

          {/* Contact section */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
            className="flex gap-5 p-6 rounded-2xl bg-accent/5 border border-accent/20"
          >
            <span className="text-[28px] font-serif font-bold text-accent/20 leading-none shrink-0 select-none mt-0.5">07</span>
            <div>
              <h2 className="text-[15px] font-semibold text-stone-800 mb-2">Contact</h2>
              <p className="text-stone-500 leading-relaxed text-[14px] md:text-[15px]">
                For legal enquiries, please contact us at{" "}
                <a href="mailto:atstaytheory@gmail.com" className="text-accent hover:underline font-medium">
                  atstaytheory@gmail.com
                </a>.
              </p>
            </div>
          </motion.section>
        </div>

        <div className="mt-10 pt-8 border-t border-stone-100">
          <Link to="/" className="text-[10px] uppercase tracking-widest font-bold text-stone-400 hover:text-accent transition-colors">
            ← Back to Home
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
