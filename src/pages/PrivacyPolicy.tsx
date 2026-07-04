import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Shield, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const sections = [
  {
    num: "01",
    title: "Information We Collect",
    body: "When you browse Stay Theory, we may collect basic usage data such as pages visited, device type, and approximate location through analytics tools. We do not collect any personally identifiable information unless you voluntarily contact us directly.",
  },
  {
    num: "02",
    title: "How We Use Your Information",
    body: "Usage data is used solely to improve the experience on our website — understanding which sanctuaries attract the most interest and ensuring our pages load quickly. We do not sell, rent, or share any data with third parties for marketing purposes.",
  },
  {
    num: "03",
    title: "Booking & External Services",
    body: "All bookings are handled through Airbnb. When you click \"Book on Airbnb,\" you leave Stay Theory and are subject to Airbnb's own privacy policy and terms of service. We encourage you to review their policies before providing any personal information.",
  },
  {
    num: "04",
    title: "Cookies",
    body: "We use minimal, functional cookies to remember your preferences during a session. We do not use advertising cookies or cross-site tracking cookies.",
  },
  {
    num: "05",
    title: "Images & Media",
    body: "Property photography on this site is owned by Stay Theory and may not be reproduced without written permission.",
  },
];

export default function PrivacyPolicy() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Navbar onBookClick={() => { }} />

      {/* Hero */}
      <div
        className="relative overflow-hidden pt-[72px]"
        style={{ background: "linear-gradient(160deg, #10141a 0%, #1a2540 50%, #2a3a6b 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/8 rounded-full blur-[60px]" />
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
              <Shield className="w-4 h-4 text-blue-400/70" />
              <span className="text-[9px] uppercase tracking-[0.5em] font-bold text-white/40">Legal</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif italic text-white mb-3">Privacy Policy</h1>
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
              className="flex gap-5 p-6 rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <span className="text-[28px] font-serif font-bold text-stone-100 group-hover:text-blue-100 transition-colors leading-none shrink-0 select-none mt-0.5">
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
            transition={{ delay: 0.3 }}
            className="flex gap-5 p-6 rounded-2xl bg-blue-50/50 border border-blue-100/80"
          >
            <span className="text-[28px] font-serif font-bold text-blue-100 leading-none shrink-0 select-none mt-0.5">06</span>
            <div>
              <h2 className="text-[15px] font-semibold text-stone-800 mb-2">Contact</h2>
              <p className="text-stone-500 leading-relaxed text-[14px] md:text-[15px]">
                For any privacy-related questions, please reach out at{" "}
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
