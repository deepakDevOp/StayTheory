import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Quote, Star, Sparkles } from "lucide-react";
import FocusBox from "./FocusBox";
import api from "../services/api";

export default function HostSection() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get(`/cms/home/host_section?t=${Date.now()}`);
        setContent(response.data);
      } catch (err) {
        console.error("Failed to fetch host section content:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) return null;

  const display = content || {
    title: "Ritu",
    subtitle: "Hi, I'm Ritu! I loveeee connecting with new people and having good conversations. I'm a bit of a Netflix buff (currently watching Gossip Girl), and I enjoy exploring great food—so I'm always happy to share recommendations.\n\nWelcome to Stay Theory — a carefully curated 1BHK designed to give you the perfect balance of comfort and aesthetics. The apartment is fully furnished and thoughtfully equipped with all essential amenities to ensure a comfortable and hassle-free stay.\n\nWorking Professional",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwfg1tLDkEN9NjptH8LGKn5IGL0mgWBen2oHuWxgB_Ig28w7YttqL_lwBWURn9QXh6Aym-n7RuKgd_UBSkke-meOVJVERQOdRk4ltBezjBHPZa9klkYdO4my2NXMjqGnfwxFSmg28OwJxGZeiszf4k8rp6DD8lZ9Oe_sjRJIHKKrC71OA4KAzlgca-NM6EWNngQwuqhbIftYaPTd5eWXlnxwgi_pcCI-QmBDTfu4BWYaWniEoVXRAWaO5P0N2QYInzJIqoLnGHj2E"
  };

  const parts = display.subtitle.split('\n\n');
  const bio = parts.slice(0, -1);
  const subLabel = parts[parts.length - 1];

  return (
    <section className="relative px-6 md:px-16 max-w-[1440px] mx-auto md:min-h-[calc(100vh-72px)] flex items-center py-16 md:py-0 overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-gold/4 rounded-full blur-[80px]" />
      </div>

      <FocusBox className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center w-full relative z-10">

        {/* Text column */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-accent/50" />
              <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-accent/70">The Visionary</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif italic text-on-surface mb-8 leading-tight">
              Meet Your<br />
              <span className="text-accent">Host</span>
            </h2>

            {/* Quote card */}
            <div className="relative mb-8 pl-5 border-l-2 border-accent/30">
              <Quote className="absolute -top-1 -left-2 w-4 h-4 text-accent/50 fill-accent/10" />
              <div className="space-y-4">
                {bio.map((p: string, i: number) => (
                  <p key={i} className={`leading-relaxed ${i === 0 ? "text-base text-on-surface font-medium" : "text-sm text-on-surface-variant"}`}>
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* Signature */}
            <div className="flex items-center gap-4 pt-4 border-t border-stone-100">
              <div>
                <p className="text-2xl md:text-3xl font-serif italic text-accent">— {display.title}.</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase">{subLabel}</p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 mt-6">
              {["Superhost", "Verified", "5-Star Rated"].map(badge => (
                <div key={badge} className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-full border border-stone-200">
                  <Sparkles className="w-2.5 h-2.5 text-accent" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-stone-600">{badge}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Image column */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Decorative frame behind image */}
            <div className="absolute -inset-3 rounded-3xl border border-accent/10 -z-10" />
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-accent/5 to-gold/3 -z-20 blur-xl" />

            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-accent/10">
              <img
                src={display.image_url}
                alt={`${display.title} — Your Host`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
              />
              {/* Light shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent opacity-40 pointer-events-none" />
            </div>

            {/* Floating rating card */}
            <motion.div
              initial={{ opacity: 0, y: 10, x: 10 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl shadow-black/10 border border-stone-100 px-4 py-3 min-w-[140px]"
            >
              <p className="text-[8px] uppercase tracking-[0.3em] font-bold text-stone-400 mb-1">Guest Rating</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-on-surface">5.0</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-[9px] text-stone-400 mt-0.5">on Airbnb</p>
            </motion.div>
          </motion.div>
        </div>
      </FocusBox>
    </section>
  );
}
