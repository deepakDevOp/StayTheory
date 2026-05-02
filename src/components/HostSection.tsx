import FocusBox from "./FocusBox";

export default function HostSection() {
  return (
    <section className="px-8 md:px-16 max-w-[1440px] mx-auto md:h-[calc(100vh-72px)] flex items-center py-12 md:py-0">
      <FocusBox className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center w-full">
        <div>
          <span className="uppercase text-[11px] tracking-[0.2em] font-bold text-primary mb-4 block">The Visionary</span>
          <h2 className="text-5xl md:text-6xl font-serif italic mb-8 leading-tight">Meet Your Host</h2>
          <div className="space-y-6">
            <p className="text-body-lg text-on-surface leading-relaxed">
              Hi, I’m Ritu! I love connecting with new people and having good conversations. I’m a bit of a Netflix buff (currently watching Gossip Girl), and I enjoy exploring great food—so I’m always happy to share recommendations.
            </p>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              Welcome to Stay Theory — a carefully curated 1BHK designed to give you the perfect balance of comfort and aesthetics. The apartment is fully furnished and thoughtfully equipped with all essential amenities to ensure a comfortable and hassle-free stay.
            </p>
            <div className="pt-8">
              <p className="text-3xl font-serif italic text-primary">— Ritu.</p>
              <p className="text-[11px] font-bold tracking-[0.2em] text-stone-400 uppercase mt-1">Working Professional</p>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="aspect-[4/5] rounded-xl overflow-hidden flex items-center justify-center bg-stone-100">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwfg1tLDkEN9NjptH8LGKn5IGL0mgWBen2oHuWxgB_Ig28w7YttqL_lwBWURn9QXh6Aym-n7RuKgd_UBSkke-meOVJVERQOdRk4ltBezjBHPZa9klkYdO4my2NXMjqGnfwxFSmg28OwJxGZeiszf4k8rp6DD8lZ9Oe_sjRJIHKKrC71OA4KAzlgca-NM6EWNngQwuqhbIftYaPTd5eWXlnxwgi_pcCI-QmBDTfu4BWYaWniEoVXRAWaO5P0N2QYInzJIqoLnGHj2E" 
              alt="Ritu - Your Host" 
              className="w-[85%] h-[85%] object-cover rounded-lg shadow-xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-container/10 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-secondary/10 rounded-full blur-3xl -z-10" />
        </div>
      </FocusBox>
    </section>
  );
}
