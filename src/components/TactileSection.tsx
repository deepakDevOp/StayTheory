import { useState, useEffect } from "react";
import { Moon } from "lucide-react";
import FocusBox from "./FocusBox";
import axios from "axios";

export default function TactileSection() {
  const [mainContent, setMainContent] = useState<any>(null);
  const [detailContent, setDetailContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [mainRes, detailRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/v1/cms/home/tactile_main?t=${Date.now()}`),
          axios.get(`http://localhost:8000/api/v1/cms/home/tactile_detail?t=${Date.now()}`)
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
    <section className="max-w-[1440px] mx-auto px-8 md:px-16 py-12 md:py-0 md:h-[calc(100vh-72px)] flex items-center">
      <FocusBox className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center w-full">
        <div className="md:col-span-7 relative">
          <img 
            src={displayMain.image_url} 
            alt={displayMain.title} 
            className="w-full md:max-h-[70vh] object-cover rounded-xl shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="md:col-span-5 flex flex-col gap-6">
          <img 
            src={displayDetail.image_url} 
            alt="Detail of textures" 
            className="w-full aspect-[4/3] md:aspect-video object-cover rounded-xl shadow-2xl"
            referrerPolicy="no-referrer"
          />
          <div className="p-8 bg-surface-container-low rounded-xl border border-primary/5">
            <Moon className="w-5 h-5 text-primary mb-3" />
            <h3 className="text-xl font-serif mb-3">{displayDetail.title}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {displayDetail.subtitle}
            </p>
          </div>
        </div>
      </FocusBox>
    </section>
  );
}
