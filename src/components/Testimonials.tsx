import FocusBox from "./FocusBox";

export default function Testimonials() {
  const quotes = [
    {
      text: "An architectural masterpiece that somehow feels like coming home. The light in the living hall is transformative.",
      author: "ELENA V."
    },
    {
      text: "Stay Theory isn't just a place to sleep; it's a reset button for the soul. The attention to tactile detail is unmatched.",
      author: "MARCUS D."
    },
    {
      text: "Waking up in the master bedroom, watching the sun hit the terracotta walls—pure poetry in motion.",
      author: "SARAH K."
    }
  ];

  return (
    <section className="px-8 md:px-16 bg-background md:h-[calc(100vh-72px)] flex items-center py-12 md:py-0">
      <FocusBox className="max-w-[1440px] mx-auto w-full">
        <div className="text-center mb-20">
          <span className="uppercase text-[11px] tracking-[0.2em] font-bold text-primary mb-4 block">EXPERIENCES</span>
          <h2 className="text-headline-lg font-serif italic text-on-surface">Voices from the Guests</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {quotes.map((quote, index) => (
            <div key={index} className="p-8 border-l border-primary/20 hover:border-primary transition-colors duration-500">
              <p className="text-2xl font-serif italic leading-relaxed text-on-surface mb-6 font-medium">
                "{quote.text}"
              </p>
              <p className="text-[11px] font-bold tracking-[0.2em] text-primary">— {quote.author}</p>
            </div>
          ))}
        </div>
      </FocusBox>
    </section>
  );
}
