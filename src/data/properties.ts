export const propertiesData = [
  {
    id: "tuscan",
    title: "The Tuscan Retreat",
    subtitle: "Experience the art of stillness.",
    price: 3100,
    coverImage: "https://lh3.googleusercontent.com/aida/ADBb0uhSbpgiJ1xfRVN3Lz8MCmkhVVNylX1cL-jByrRWafl7ngRiF6AETvBrljpqbJJX2E5DEvScBaruojpkmmZlj6ajrMqW-jpp_29MNezvab0DAa24JPQM7mQzQsNhUPnxYJI_3jbXsMvKqT7fNJPJP_vU4Q3goc-wgE0GtSEhPLifS8KFr5CczuBAktCs_HO-SQJQ0tU8TMRq3OKXbgcjKBGTs3KPd1bLfm_4_08uKsh_5JLrLVFnSpyQCsrIo1XPjY2HzLNV81Wf",
    description: "Nestled in the rolling hills of Tuscany, this centuries-old farmhouse has been meticulously restored to offer a blend of rustic charm and modern luxury. Surrounded by olive groves and vineyards, it provides the ultimate sanctuary for those seeking peace, culinary delights, and breathtaking sunsets.",
    stats: { guests: 6, bedrooms: 3, beds: 4, baths: 3 },
    images: {
      bedrooms: [
        "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80"
      ],
      bathrooms: [
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"
      ],
      living: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
      ],
      kitchen: [
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80"
      ],
      outdoors: [
        "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    amenities: ["High-speed Wi-Fi", "Private Infinity Pool", "Air Conditioning", "Fully Equipped Kitchen", "Fireplace", "Outdoor BBQ", "Washing Machine"],
    rules: ["Check-in: 3:00 PM", "Check-out: 11:00 AM", "No smoking indoors", "Pets allowed upon request", "No parties or events"],
    nearby: [
      { name: "Florence City Center", distance: "45 mins drive" },
      { name: "Chianti Wineries", distance: "15 mins drive" },
      { name: "Local Farmers Market", distance: "10 mins walk" }
    ],
    reviews: [
      { author: "Elena R.", rating: 5, text: "An absolute dream! The views from the balcony are surreal, and the house itself is incredibly cozy and well-decorated." },
      { author: "Mark T.", rating: 5, text: "Perfect getaway. We spent our evenings by the fireplace drinking local wine. Can't wait to return." }
    ]
  },
  {
    id: "ocean",
    title: "Ocean Sanctuary",
    subtitle: "Where the rhythm of waves sets the pace.",
    price: 4200,
    coverImage: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1920&q=80",
    description: "Perched on a cliffside overlooking the Amalfi Coast, the Ocean Sanctuary offers panoramic views of the Mediterranean. Wake up to the sound of crashing waves and spend your days sunbathing on your private terrace or exploring the nearby coastal villages.",
    stats: { guests: 4, bedrooms: 2, beds: 2, baths: 2 },
    images: {
      bedrooms: [
        "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80"
      ],
      bathrooms: [
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80"
      ],
      living: [
        "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80"
      ],
      kitchen: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80"
      ],
      outdoors: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    amenities: ["Ocean View", "Private Beach Access", "Jacuzzi", "Wi-Fi", "Daily Housekeeping", "Nespresso Machine", "Smart TV"],
    rules: ["Check-in: 4:00 PM", "Check-out: 10:00 AM", "No smoking", "No pets allowed", "Quiet hours: 10 PM - 8 AM"],
    nearby: [
      { name: "Positano Beach", distance: "5 mins walk" },
      { name: "Amalfi Town", distance: "20 mins drive" },
      { name: "Path of the Gods Trailhead", distance: "30 mins drive" }
    ],
    reviews: [
      { author: "Sarah & John", rating: 5, text: "The views are even better than the photos. Falling asleep to the sound of the ocean was magical." },
      { author: "David L.", rating: 4, text: "Beautiful property. The steps down to the beach are steep, but it's worth it for the private cove." }
    ]
  },
  {
    id: "forest",
    title: "Forest Cabin",
    subtitle: "Immerse yourself in ancient wisdom.",
    price: 2800,
    coverImage: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1920&q=80",
    description: "Tucked away deep within the Black Forest, this modern architectural cabin features floor-to-ceiling windows that blur the lines between indoors and nature. Unplug from the digital world and reconnect with yourself amidst towering pines and tranquil silence.",
    stats: { guests: 2, bedrooms: 1, beds: 1, baths: 1 },
    images: {
      bedrooms: [
        "https://images.unsplash.com/photo-1522771731470-bea437360f58?auto=format&fit=crop&w=1200&q=80"
      ],
      bathrooms: [
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80"
      ],
      living: [
        "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80"
      ],
      kitchen: [
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80"
      ],
      outdoors: [
        "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    amenities: ["Wood Stove", "Outdoor Hot Tub", "Hiking Trails Access", "Library", "Vinyl Record Player", "Fully Stocked Kitchen", "Bicycles Provided"],
    rules: ["Check-in: 2:00 PM", "Check-out: 12:00 PM", "Eco-friendly products only", "No outdoor fires", "Respect local wildlife"],
    nearby: [
      { name: "Triberg Waterfalls", distance: "1 hour hike" },
      { name: "Local Bakery", distance: "15 mins bike ride" },
      { name: "Lake Titisee", distance: "40 mins drive" }
    ],
    reviews: [
      { author: "Michael H.", rating: 5, text: "The perfect digital detox. The architecture is stunning and sitting in the hot tub while it snowed was an unforgettable experience." }
    ]
  },
  {
    id: "desert",
    title: "Desert Oasis",
    subtitle: "Find clarity in the vast expanse.",
    price: 3500,
    coverImage: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1920&q=80",
    description: "Set against the striking landscape of Joshua Tree, the Desert Oasis is a masterpiece of minimalist design. With a private pool, stargazing deck, and unobstructed views of the horizon, it's a sanctuary designed for profound relaxation and inspiration.",
    stats: { guests: 8, bedrooms: 4, beds: 5, baths: 3 },
    images: {
      bedrooms: [
        "https://images.unsplash.com/photo-1522771731470-bea437360f58?auto=format&fit=crop&w=1200&q=80"
      ],
      bathrooms: [
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"
      ],
      living: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
      ],
      kitchen: [
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80"
      ],
      outdoors: [
        "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    amenities: ["Private Pool", "Stargazing Deck", "Fire Pit", "Air Conditioning", "Wi-Fi", "Record Player", "Yoga Mats"],
    rules: ["Check-in: 3:00 PM", "Check-out: 11:00 AM", "No glass near the pool", "No amplified music outdoors", "Photography permits required for commercial shoots"],
    nearby: [
      { name: "Joshua Tree National Park Entrance", distance: "10 mins drive" },
      { name: "Pappy & Harriet's", distance: "25 mins drive" },
      { name: "Noah Purifoy Art Museum", distance: "15 mins drive" }
    ],
    reviews: [
      { author: "Jenna K.", rating: 5, text: "A stunning property. We spent every night on the deck watching the stars. The house is beautifully curated." },
      { author: "Alex B.", rating: 5, text: "Incredible design and integration with the landscape. Highly recommend for a creative retreat." }
    ]
  }
];
