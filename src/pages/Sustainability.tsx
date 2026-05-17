import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Sustainability() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Navbar onBookClick={() => {}} />
      <main className="max-w-3xl mx-auto px-6 py-24 md:py-32">
        <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold mb-4">Our Ethos</p>
        <h1 className="text-4xl md:text-5xl font-serif italic text-stone-800 mb-3 leading-tight">Sustainability</h1>
        <p className="text-stone-500 text-base mb-12 max-w-xl leading-relaxed">
          At Stay Theory, every sanctuary is designed with the land in mind. We believe that true luxury is never at the expense of the world that cradles it.
        </p>

        <div className="space-y-12 text-stone-600 leading-relaxed text-[15px]">

          <section>
            <h2 className="text-xl font-serif italic text-stone-800 mb-3">Low-Impact Architecture</h2>
            <p>
              Our properties are designed to integrate with their natural surroundings rather than overpower them. We use locally sourced materials wherever possible, prioritising natural stone, reclaimed wood, and traditional craft over mass-produced finishes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-stone-800 mb-3">Energy & Water</h2>
            <p>
              Each sanctuary is equipped with energy-efficient systems — solar water heating, LED lighting, and smart climate controls that adapt to occupancy. We encourage guests to embrace natural ventilation and the rhythm of the environment around them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-stone-800 mb-3">Minimal Waste</h2>
            <p>
              We have eliminated single-use plastics from all our spaces. Guests are provided with refillable glass bottles, organic bath amenities in ceramic dispensers, and linens laundered with biodegradable detergents. Kitchen pantries are stocked with local, seasonal, and unpackaged goods wherever possible.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-stone-800 mb-3">Supporting Local Communities</h2>
            <p>
              Our caretakers, artisans, and suppliers are all drawn from the communities near each sanctuary. We believe that a stay at Stay Theory should benefit not just the guest, but the land and the people who tend it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif italic text-stone-800 mb-3">A Living Commitment</h2>
            <p>
              Sustainability is not a checklist — it is an ongoing practice. We regularly audit our properties, listen to our guests' feedback, and work with environmental consultants to raise our standards each year.
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-stone-100">
          <Link to="/" className="text-[10px] uppercase tracking-widest font-bold text-stone-400 hover:text-accent transition-colors">
            ← Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
