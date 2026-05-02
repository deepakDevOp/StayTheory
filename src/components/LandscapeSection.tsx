import { Sun, Wind, Cloud, MapPin } from "lucide-react";
import FocusBox from "./FocusBox";

export default function LandscapeSection() {
  const features = [
    { icon: Sun, label: "Olive Groves" },
    { icon: MapPin, label: "Mineral Pool" },
    { icon: Wind, label: "Private Trails" },
    { icon: Cloud, label: "Sunset Deck" },
  ];

  return (
    <section className="bg-surface-container px-8 md:px-16 overflow-hidden md:h-[calc(100vh-72px)] flex items-center py-12 md:py-0">
      <FocusBox className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center w-full">
        <div className="order-2 md:order-1">
          <div className="aspect-[4/5] bg-stone-300 rounded-xl overflow-hidden relative group">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBth1Cq7szZtqLGqJoWl17vM6nSNEnkw-_ch_zuC-p2w_fPKJ8u3yvAh6CP1mj-SOS_wLDGRFR_nVvo4TIK7POkw9JRfd3ihYr13D85K6VwoeLRGkybsAfpHeTmY4MPmksPRipBi5Z0fhsrqMdmURGu5KK_j-Li6NTdvQUl_2SLO-eWcJznsJ6tZwTF98JsNespJC2MccBDfCo7R0yBZFdf16sct0emXIIvZ3OgT_QcuZA0G8jkLSpUdV4WqlP-d17Qm_KjouEOzgg" 
              alt="Stay Theory Surroundings" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-transform duration-1000 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <div className="order-1 md:order-2">
          <span className="uppercase text-[11px] tracking-[0.2em] font-bold text-primary mb-4 block">The Surroundings</span>
          <h2 className="text-5xl md:text-6xl font-serif italic mb-8 leading-tight">
            A landscape that breathes with you.
          </h2>
          <p className="text-on-surface-variant text-body-lg leading-relaxed mb-10 max-w-xl">
            Situated at the intersection of wild nature and curated comfort. The grounds of Stay Theory offer endless paths for introspection, from hidden olive groves to our infinity meditation pool.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-primary" />
                <span className="text-xs uppercase font-semibold tracking-wider text-on-surface/70">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </FocusBox>
    </section>
  );
}
