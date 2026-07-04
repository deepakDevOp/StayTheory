import { useEffect, useState, type ComponentType } from "react";
import { Link } from "react-router-dom";
import { Mail, Instagram, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { publicService } from "../services/publicService";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

interface ContactSettings {
  whatsapp?: string;
  email?: string;
  instagram?: string;
  hours_weekday?: string;
  hours_weekend?: string;
}

export default function Contact() {
  const [contactSettings, setContactSettings] = useState<ContactSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicService.getContactSettings()
      .then(data => setContactSettings(data))
      .catch(() => {/* silently ignore — page still renders */})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  const { whatsapp, email, instagram, hours_weekday, hours_weekend } = contactSettings;

  const waNumber = whatsapp?.replace(/\D/g, "") || "";
  const waMessage = encodeURIComponent("Hi, I want to enquire about your properties on Stay Theory.");

  // Build contacts list dynamically from API data
  type ContactEntry = {
    icon: ComponentType<{ className?: string }>;
    label: string;
    value: string;
    sub: string;
    href: string;
    external?: boolean;
    iconColor: string;
    bgColor: string;
  };

  const contacts: ContactEntry[] = [
    email && {
      icon: Mail,
      label: "Email",
      value: email,
      sub: "Responds within 24 hours",
      href: `mailto:${email}`,
      iconColor: "text-accent",
      bgColor: "bg-accent/8 group-hover:bg-accent/15",
    },
    whatsapp && {
      icon: WhatsAppIcon,
      label: "WhatsApp",
      value: whatsapp,
      sub: "Chat with us on WhatsApp",
      href: `https://wa.me/${waNumber}?text=${waMessage}`,
      external: true,
      iconColor: "text-[#25D366]",
      bgColor: "bg-[#25D366]/10 group-hover:bg-[#25D366]/20",
    },
    instagram && {
      icon: Instagram,
      label: "Instagram",
      value: `@${instagram.replace(/^@/, "")}`,
      sub: "Stories & behind the scenes",
      href: `https://www.instagram.com/${instagram.replace(/^@/, "")}`,
      external: true,
      iconColor: "text-[#E1306C]",
      bgColor: "bg-[#E1306C]/8 group-hover:bg-[#E1306C]/15",
    },
  ].filter(Boolean) as ContactEntry[];

  return (
    <>
      <Navbar onBookClick={() => {}} />

      <main className="fixed md:relative inset-0 md:inset-auto flex flex-col pt-[72px] md:pt-0 md:min-h-screen overflow-hidden md:overflow-visible">
        <div className="flex-1 min-h-0 overflow-hidden md:overflow-visible flex flex-col">
          <div className="flex-1 min-h-0 flex flex-col px-5 md:px-8 lg:px-16 pt-6 pb-4 md:py-20 max-w-2xl mx-auto w-full overflow-hidden">

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-4 md:mb-10 shrink-0"
            >
              <p className="text-[9px] uppercase tracking-[0.4em] text-accent font-bold mb-1.5">Get in Touch</p>
              <h1 className="text-3xl md:text-5xl font-serif italic text-stone-800 leading-tight mb-1.5">Contact Us</h1>
              <p className="text-stone-400 text-sm leading-snug">
                Questions, collaborations, or a hello — we'd love to hear from you.
              </p>
            </motion.div>

            {/* Contact cards */}
            <div className="flex flex-col gap-2 md:gap-4 shrink-0">
              {loading ? (
                [0, 1, 2].map(i => (
                  <div key={i} className="h-16 rounded-2xl bg-stone-100 animate-pulse" />
                ))
              ) : contacts.length === 0 ? (
                <p className="text-stone-400 text-sm italic text-center py-6">
                  Contact details coming soon.
                </p>
              ) : (
                contacts.map((c, idx) => {
                  const Icon = c.icon;
                  return (
                    <motion.a
                      key={c.label}
                      href={c.href}
                      target={c.external ? "_blank" : undefined}
                      rel={c.external ? "noopener noreferrer" : undefined}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + idx * 0.07, duration: 0.38 }}
                      className="flex items-center gap-3 px-4 py-3 md:p-5 rounded-2xl border border-stone-100 bg-white shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className={`w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${c.bgColor}`}>
                        <span className={c.iconColor}><Icon /></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-stone-300 mb-0.5">{c.label}</p>
                        <p className="text-stone-700 font-medium text-sm truncate group-hover:text-accent transition-colors">{c.value}</p>
                        <p className="text-stone-400 text-[10px] truncate">{c.sub}</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-stone-300 shrink-0 group-hover:text-accent transition-colors" />
                    </motion.a>
                  );
                })
              )}
            </div>

            {/* Business hours strip */}
            {(hours_weekday || hours_weekend) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.38 }}
                className="mt-2 px-4 py-3 rounded-2xl bg-stone-50 border border-stone-100 shrink-0"
              >
                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-1.5">Hours</p>
                {hours_weekday && (
                  <p className="text-stone-500 text-xs"><span className="text-stone-400 font-medium">Mon–Fri</span> · {hours_weekday}</p>
                )}
                {hours_weekend && (
                  <p className="text-stone-500 text-xs mt-0.5"><span className="text-stone-400 font-medium">Sat–Sun</span> · {hours_weekend}</p>
                )}
              </motion.div>
            )}

            {/* Reservations strip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.38 }}
              className="mt-2 px-4 py-3 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between gap-3 shrink-0"
            >
              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-0.5">Reservations</p>
                <p className="text-stone-500 text-xs">Bookings managed via Airbnb</p>
              </div>
              <a
                href="https://www.airbnb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-[#723a28] transition-colors"
              >
                Airbnb <ExternalLink className="w-3 h-3" />
              </a>
            </motion.div>

            {/* Back link */}
            <div className="mt-auto pt-3 shrink-0">
              <Link to="/" className="text-[9px] uppercase tracking-widest font-bold text-stone-300 hover:text-accent transition-colors">
                ← Back to Home
              </Link>
            </div>

          </div>
        </div>

        <div className="hidden md:block shrink-0">
          <Footer />
        </div>
      </main>
    </>
  );
}
