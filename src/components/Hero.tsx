import { motion } from "motion/react";
import FocusBox from "./FocusBox";

export default function Hero() {
  return (
    <section className="relative h-[calc(100vh-72px)] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img 
          initial={{ filter: "blur(0px)", scale: 1.05 }}
          whileInView={{ filter: "blur(0px)", scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://lh3.googleusercontent.com/aida/ADBb0uhSbpgiJ1xfRVN3Lz8MCmkhVVNylX1cL-jByrRWafl7ngRiF6AETvBrljpqbJJX2E5DEvScBaruojpkmmZlj6ajrMqW-jpp_29MNezvab0DAa24JPQM7mQzQsNhUPnxYJI_3jbXsMvKqT7fNJPJP_vU4Q3goc-wgE0GtSEhPLifS8KFr5CczuBAktCs_HO-SQJQ0tU8TMRq3OKXbgcjKBGTs3KPd1bLfm_4_08uKsh_5JLrLVFnSpyQCsrIo1XPjY2HzLNV81Wf" 
          alt="Stay Theory sanctuary" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-stone-900/20" />
      </div>
      
      <FocusBox className="relative z-10 text-center px-6 max-w-4xl">
        <h1 className="text-white text-5xl md:text-8xl font-serif italic mb-8 leading-tight drop-shadow-sm">
          The Art Of Being Still.
        </h1>
        <p className="text-white/95 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto drop-shadow-sm">
          Experience a retreat designed to lower your heart rate. An intentional space curated for the discerning traveler.
        </p>
      </FocusBox>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-white/60 font-bold">Scroll to explore</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-8 bg-white/40"
        />
      </motion.div>
    </section>
  );
}
