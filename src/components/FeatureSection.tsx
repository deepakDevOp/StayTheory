import FocusBox from "./FocusBox";

export default function FeatureSection() {
  return (
    <section className="px-8 md:px-16 max-w-[1440px] mx-auto md:h-[calc(100vh-72px)] flex items-center py-12 md:py-0">
      <FocusBox className="flex flex-col md:flex-row gap-16 md:gap-24 items-center md:items-end w-full">
        <div className="md:w-1/2">
          <span className="uppercase text-[11px] tracking-[0.2em] font-bold text-primary mb-4 block">The Interior</span>
          <h2 className="text-4xl md:text-headline-lg font-serif mb-8 text-on-surface leading-tight max-w-md">
            Deliberate spaces designed for slow living.
          </h2>
          <p className="text-on-surface-variant text-body-md leading-relaxed max-w-md">
            Every corner of Stay Theory is a dialogue between light and material. We've removed the clinical sterility of modern hospitality, replacing it with organic textures and architectural rhythm.
          </p>
        </div>
        <div className="md:w-1/2 flex justify-end">
          <div className="relative group">
            <img 
              src="https://lh3.googleusercontent.com/aida/ADBb0uhpjxZcYyp5u94qH59xCzmrjjJ9rOv-vigsg8EV4KjWTuu0jp7MixDEylng5D5d4jXPwuoDY5jAPvx1xXnucpNV2omTdDkfYASpumxMgU6OjsnfyC379UPlFovYxEjUvv8x_KQLRA-BE9TRh7cebZLO7wcG5HiiWnb7k-GHqsDhv3JA9oV7tJWkzdcp3LZhJXnVhiNHUODNiibEOw5y3qOYfPBE-nC_SYXvlrSDMQsNkKk3Gqgu32u8q6vB62t6ePnnKpYNRhO5BQ" 
              alt="The Balcony" 
              className="w-[400px] h-[550px] object-cover rounded-xl shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-8 -left-8 bg-surface p-8 shadow-xl max-w-xs rounded-lg border border-primary/5">
              <h4 className="font-serif text-2xl mb-2">The Balcony</h4>
              <p className="text-body-md text-on-surface-variant">
                Morning rituals accompanied by the gentle breeze of the sanctuary.
              </p>
            </div>
          </div>
        </div>
      </FocusBox>
    </section>
  );
}
