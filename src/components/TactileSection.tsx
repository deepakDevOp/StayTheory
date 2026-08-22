import { useState, useEffect } from "react";
import { Moon } from "lucide-react";
import { motion } from "motion/react";
import FocusBox from "./FocusBox";
import api from "../services/api";
import { optimizeImageUrl } from "../utils/preload";

export default function TactileSection() {
  const [mainContent, setMainContent] = useState<any>(null);
  const [detailContent, setDetailContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [mainRes, detailRes] = await Promise.all([
          api.get(`/cms/home/tactile_main?t=${Date.now()}`),
          api.get(`/cms/home/tactile_detail?t=${Date.now()}`)
        ]);
        setMainContent(mainRes.data);
        setDetailContent(detailRes.data);
      } catch (err) {
        console.error("Failed to fetch tactile section content:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) return null;

  const displayMain = mainContent || {
    image_url: "https://lh3.googleusercontent.com/aida/ADBb0ujVJ7_ZFUr2mOOji05rJxiTvswzTDm2r2KzxzRxGL1mr-9f1Qbh9fquXWLWKhkZRftti82rrhGgXih490PuokQJ9wD8nUkmR7WqrryE3P6gUJlQbS-sDl1i0mcdoZdYk-KlpWRICpEmSlqvQQ9DwfujzfNNjsOFouxjEdo1LGEFi_Xl25oWb8_OIyHlO1dJyBLtcIQ58w02hym8TdAUTowYoNgA5XiTEkB5xpeIbCd383Nq-cGanuZZZ_C7CaxqjHTvXFcqDsBQlA",
    title: "Living Hall Sanctuary"
  };

  const displayDetail = detailContent || {
    image_url: "https://lh3.googleusercontent.com/aida/ADBb0ugbe_m3Xp7FfQG_Id58at-UhcH5FNFuazzXTMizuloMGNXJK2KVyOqVATQotj5ytRbcD_ZB1ZziVia2U0_pdgMowxikNTinAZj_BER-z3CdaFWXRuHivZkPvGS0JmR5HvkuSFrnV8N4tNDfAZV1VYN0zA1Azadyqo2O1JUDoJeghUSk4Qh2Z_oQdC8lK9hxKB3u14BMujK5PQTrarkld5k-XTS_c1Fsj1-5taNwH4CXrwAmb1WnJhslQ4UkjZ1Y7KHBqHOnPbruFw",
    title: "Tactile Warmth",
    subtitle: "Experience shadows as structural elements. Our design uses light-play to define depth, creating a physical sense of tranquility that evolves throughout the day."
  };

  return (
    <section className="relative py-16 md:py-0 md:min-h-[calc(100vh-72px)] flex items-center overflow-hidden bg-stone-950">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-stone-900/50 rounded-full blur-[120px]" />
      </div>

      <FocusBox className="max-w-[1440px] mx-auto px-6 md:px-16 w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center w-full">

          {/* Main image */}
          <div className="md:col-span-7 relative">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 group"
            >
              <img
                src={optimizeImageUrl(displayMain.image_url, 900)}
                alt={displayMain.title}
                className="w-full md:max-h-[62vh] object-cover transition-transform duration-[3s] group-hover:scale-105"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />

              {/* Floating label */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-4 left-4 right-4 flex items-center justify-between"
              >
                <div className="px-3 py-2 rounded-xl border border-white/15 bg-black/40 backdrop-blur-md">
                  <p className="text-white text-[10px] font-bold uppercase tracking-widest">{displayMain.title}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse-soft" />
              </motion.div>
            </motion.div>
          </div>

          {/* Right column */}
          <div className="md:col-span-5 flex flex-col gap-4">
            {/* Detail image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden group shadow-2xl shadow-black/40"
            >
              <img
                src={optimizeImageUrl(displayDetail.image_url, 600)}
                alt="Detail of textures"
                className="w-full aspect-[4/3] md:aspect-video object-cover transition-transform duration-[3s] group-hover:scale-110"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 to-transparent pointer-events-none" />
            </motion.div>

            {/* Text card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="p-5 rounded-2xl border border-white/8"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(168,94,70,0.08) 100%)" }}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-full bg-amber-400/15 flex items-center justify-center">
                  <Moon className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="text-[9px] uppercase tracking-[0.35em] font-bold text-stone-500">Design Philosophy</span>
              </div>
              <h3 className="text-base md:text-lg font-serif text-white mb-2 italic">{displayDetail.title}</h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                {displayDetail.subtitle}
              </p>
            </motion.div>
          </div>
        </div>
      </FocusBox>
    </section>
  );
}
