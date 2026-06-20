import { PhotoItem, DocumentaryStory, MemoryPin, TravelLocation, Milestone, GearItem } from "./types";

// Collection of Sreekar's premium signature shots (combining B&W documentary, vivid concerts, and portraits)
export const signaturePhotos: PhotoItem[] = [
  {
    id: "img1",
    url: "https://images.unsplash.com/photo-1621215112102-2fe68b9db8d7?auto=format&fit=crop&w=1200&q=85",
    title: "The Joy of Malpe",
    category: "Documentary",
    description: "A fisherwoman greets the lens with an authentic smile at Malpe Harbor. Despite our language gap, mutual respect was understood.",
    location: "Malpe Harbour, Karnataka",
    isBW: false
  },
  {
    id: "img2",
    url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=85",
    title: "Sorting the Morning Harvest",
    category: "Coastal",
    description: "Traditional fishermen collaborate under a gold sky, separating the morning bounty from the coastal net waves.",
    location: "Coastal District, Karnataka",
    isBW: false
  },
  {
    id: "img3",
    url: "https://images.unsplash.com/photo-1430990480609-2bf7c02a6b1a?auto=format&fit=crop&w=1200&q=85",
    title: "Soaring Freedom",
    category: "Wildlife",
    description: "A sea eagle sweeps gracefully over incoming waves, isolated against the blinding stark canvas of high morning mist.",
    location: "Malpe Backwaters",
    isBW: true
  },
  {
    id: "img4",
    url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85",
    title: "Apex of the Depths",
    category: "Documentary",
    description: "A magnificent sailfish catch resting in pristine focus, showcasing the textures, patterns, and scales of the ocean prize.",
    location: "Malpe Fish Hub",
    isBW: true
  },
  {
    id: "img5",
    url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85",
    title: "The Silent Watcher",
    category: "Wildlife",
    description: "An eagle perched regally on thick dock rigging wires, its gaze fixed on active fisherboats below.",
    location: "Manipal Backwaters",
    isBW: true
  },
  {
    id: "img6",
    url: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&w=1200&q=85",
    title: "Elegance in Shadows",
    category: "Portrait",
    description: "High fashion monochrome model portfolio session, exploring harsh contrast, profile contours, and dramatic backlighting.",
    location: "Studio Bengaluru",
    isBW: true
  },
  {
    id: "img7",
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=85",
    title: "Crimson Bassline",
    category: "Concert",
    description: "A high-octane live college band concert shot, capturing the bassist engulfed in magenta spotlights and kinetic crowd haze.",
    location: "Scholar Z Event Fest",
    isBW: false
  },
  {
    id: "img8",
    url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=85",
    title: "Chasing First Light",
    category: "Travel",
    description: "The Nikon DSLR held high at dawn, framing the silhouettes of distant trawler vessels moving past the wave breaks.",
    location: "Malpe Beach Rocks",
    isBW: false
  },
  {
    id: "img9",
    url: "https://images.unsplash.com/photo-1566275529824-cca6d00a25b5?auto=format&fit=crop&w=1200&q=85",
    title: "Carry the Tide",
    category: "Documentary",
    description: "A local woman carrying ice-packed harvest baskets gracefully on her head, moving with poise through busy harbour stalls.",
    location: "Malpe Harbour",
    isBW: true
  },
  {
    id: "img10",
    url: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=1200&q=85",
    title: "Vessel Outbound",
    category: "Coastal",
    description: "Traditional wooden vessel cutting through heavy sea swells under the intense coastal heat.",
    location: "South Karnataka Coast",
    isBW: true
  },
  {
    id: "img11",
    url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=85",
    title: "Seashore Solitude",
    category: "Travel",
    description: "Wide cinematic frame of a lone explorer navigating smooth volcanic boulders along the shoreline of St. Mary's Island.",
    location: "St. Mary's Rockbeds",
    isBW: false
  },
  {
    id: "img12",
    url: "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=1200&q=85",
    title: "Weathered Hands",
    category: "Portrait",
    description: "An extreme close up portrait of an elder mariner, every wrinkle on his face conveying stories of decades out at sea.",
    location: "Fisheries Co-Op",
    isBW: true
  }
];

// Cinematic Netflix-style storytelling projects
export const documentaryStories: DocumentaryStory[] = [
  {
    id: "story-malpe",
    title: "Breaking Language Barriers",
    subtitle: "Through the lens of a camera. 📸🌊",
    category: "Documentary Series",
    coverImage: "https://images.unsplash.com/photo-1621215112102-2fe68b9db8d7?auto=format&fit=crop&w=1200&q=90",
    emotionalQuote: "Visual storytelling is a universal language. When you approach people with respect, the barrier of language completely disappears.",
    location: "Malpe Harbour (near Manipal), Karnataka",
    releaseYear: "2025",
    timelineLabel: "Featured Documentary",
    descriptionBlocks: [
      "During a recent stay in Manipal, a friend recommended I check out the local harbour. As a photographer, my camera goes wherever I go, so I decided to explore.",
      "When I arrived, I was hit by a beautiful, high-energy environment—but also a challenge: I didn't speak the local language. In photography, capturing authentic moments requires trust.",
      "Even without shared words, I wanted to ensure I respected the people working hard at the harbour. Through simple gestures, a smile, and showing genuine respect for their space, I was able to communicate my intentions, ask for their permission, and collaborate on some incredible frames.",
      "This experience reminded me that visual storytelling is a universal language. When you approach people with respect, the barrier of language completely disappears."
    ],
    featuredPhotos: signaturePhotos.filter(p => ["img1", "img4", "img9", "img2", "img12"].includes(p.id))
  },
  {
    id: "story-travel",
    title: "Coastlines & Crossings",
    subtitle: "A silent record of South India's liquid edges.",
    category: "Cinematic Travel Logs",
    coverImage: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=1200&q=90",
    emotionalQuote: "Land ends eventually, but the horizon pulls you forward.",
    location: "South India Travel Cycle",
    releaseYear: "2024",
    timelineLabel: "Travel Exploration",
    descriptionBlocks: [
      "Coastlines & Crossings represents months spent walking beach heads, standing on crumbling sea walls, and watching water meet sand.",
      "From the volcanic basalt columns of St. Mary's Island to hidden tidal pools, this series captures the serenity and power of South Indian oceans.",
      "Each composition uses long exposures and minimalist framing to emphasize the immense scale of nature over the footprint of man."
    ],
    featuredPhotos: signaturePhotos.filter(p => ["img8", "img11", "img10"].includes(p.id))
  },
  {
    id: "story-concert",
    title: "Scholar Z Nights",
    subtitle: "High shutter speeds tracking heavy basslines.",
    category: "Event Portfolio",
    coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=90",
    emotionalQuote: "In the chaos of music, find the fraction of a second where everything aligns.",
    location: "Live Concert Fests, Bengaluru",
    releaseYear: "2025",
    timelineLabel: "Event Coverage",
    descriptionBlocks: [
      "Live music is a battle of light and speed. Stage spotlights sweep randomly, strobe effects flare the sensor, and musicians are in constant frantic motion.",
      "Under Scholar Z, I photographed Bengaluru's high-energy college fests and concert nights, sliding between guitar amplifiers and standing in drum circles.",
      "This collection highlights the visual grit, the flying sweat, and the electric connectivity of thousands shouting together under neon strobes."
    ],
    featuredPhotos: signaturePhotos.filter(p => ["img7"].includes(p.id))
  }
];

// Interactive Journal/Memory Wall Polaroid assets
export const memoryWallPins: MemoryPin[] = [
  {
    id: "pin1",
    url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80",
    title: "Manipal Backwaters",
    caption: "Woke up at 4:30 AM to catch the eagles sweeping. Heavy fog, camera soaked in dew.",
    stamp: "ST-MARY",
    date: "MAR 12, 2025",
    rotation: -4,
    left: 8,
    top: 5
  },
  {
    id: "pin2",
    url: "https://images.unsplash.com/photo-1430990480609-2bf7c02a6b1a?auto=format&fit=crop&w=400&q=80",
    title: "Stark White",
    caption: "High key eagle composition. Pure white morning background. High shutter speed (1/4000s).",
    stamp: "WILD-04",
    date: "FEB 28, 2025",
    rotation: 5,
    left: 45,
    top: 2
  },
  {
    id: "pin3",
    url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80",
    title: "My Nikon Body",
    caption: "The trusty digital workhorse that handled saltwater spray and monsoon downpours.",
    stamp: "GEAR-REF",
    date: "JAN 04, 2025",
    rotation: -8,
    left: 78,
    top: 8
  },
  {
    id: "pin4",
    url: "https://images.unsplash.com/photo-1621215112102-2fe68b9db8d7?auto=format&fit=crop&w=400&q=80",
    title: "Malpe Smile",
    caption: "Met this wonderful host at the ice sorting floor. A true symbol of coastal warmth.",
    stamp: "HARB-01",
    date: "APR 02, 2025",
    rotation: 6,
    left: 22,
    top: 55
  },
  {
    id: "pin5",
    url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=400&q=80",
    title: "The Net Pullers",
    caption: "A team of eight rhythmic fisherfolk dragging heavy sea lines. The song they sang was beautiful.",
    stamp: "SOUTH-IN",
    date: "OCT 19, 2024",
    rotation: -3,
    left: 60,
    top: 50
  }
];

// Interactive travel map locations SVG relative pos (mapped from 0 to 100 on canvas)
export const mapLocations: TravelLocation[] = [
  {
    id: "loc-manipal",
    name: "Manipal",
    coordinates: { x: 38, y: 55 },
    labelPos: "bottom",
    status: "active",
    shortStory: "Chasing Backwater Wildlife",
    snippet: "Weeks spent tracking high-altitude raptors, eagles, and river birds in dense early morning mists.",
    associatedImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=500&q=80",
    routeToId: "loc-malpe"
  },
  {
    id: "loc-malpe",
    name: "Malpe Harbour",
    coordinates: { x: 28, y: 64 },
    labelPos: "left",
    status: "visited",
    shortStory: "Fisheries & Faces Documentary",
    snippet: "Sreekar's hallmark portrait study. Earned the local community's trust and broke verbal barriers using a camera.",
    associatedImage: "https://images.unsplash.com/photo-1621215112102-2fe68b9db8d7?auto=format&fit=crop&w=500&q=80",
    routeToId: "loc-bengaluru"
  },
  {
    id: "loc-bengaluru",
    name: "Bengaluru",
    coordinates: { x: 74, y: 78 },
    labelPos: "right",
    status: "exploring",
    shortStory: "Commercial Studio & Music Fests",
    snippet: "Current visual post. Directing events with Scholar Z, modeling projects, and commercial fashion lines.",
    associatedImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "loc-mary",
    name: "St. Mary's Island",
    coordinates: { x: 18, y: 44 },
    labelPos: "top",
    status: "visited",
    shortStory: "Volcanic Rock Edges",
    snippet: "Capturing geometric basalt cliff patterns and intense white foam tides in high-speed monochrome.",
    associatedImage: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=500&q=80",
    routeToId: "loc-manipal"
  }
];

// Documented Milestones (Museum exhibit list)
export const achievementsTimeline: Milestone[] = [
  {
    id: "m4",
    year: "2025 - Present",
    role: "Event Photographer",
    organization: "Scholar Z, Bengaluru",
    description: "Spearheading overall visual coverage, promotional reels, and fast action lifestyle photographs for premier educational forums, live music fests, and student communities.",
    detailsList: ["Photographed 12+ live concerts", "Created high-impact digital campaign materials", "Managed digital post-production and monochrome color setups"]
  },
  {
    id: "m3",
    year: "2024",
    role: "Digital Campaign Creator",
    organization: "SS Digital Agency",
    description: "Operated as chief product designer and high-contrast commercial camera lead, establishing brand visual standards for five regional start-ups.",
    detailsList: ["Engineered studio backlighting presets", "Doubled social click-through rates with premium imagery"]
  },
  {
    id: "m2",
    year: "2022 - 2024",
    role: "BCA Scholar",
    organization: "Sri Chaitanya College of Education",
    description: "Studied core software systems and digital UI logic while spending weekends walking coastlines, practicing full manual exposures, and conducting early portrait trials.",
  },
  {
    id: "m1",
    year: "7th Grade",
    role: "The Smartphone Catalyst",
    organization: "First Handheld Exposure",
    description: "Acquired a modest smartphone. Taught himself exposure rules, geometry, and digital editing using sheer instinct and YouTube tutorials, sparking an unbreakable obsession.",
  }
];

// Trusted gear inventory
export const gearInventory: GearItem[] = [
  {
    id: "g1",
    category: "Camera Body",
    name: "Nikon DSLR System",
    specs: "Full-Frame CMOS · High Dynamic Range Raw",
    emotionalTag: "Engineered to withstand heavy salt spray, river fog, and dense stage soot with unwavering mechanical reliability."
  },
  {
    id: "g2",
    category: "Optics Portfolio",
    name: "Telephoto Zoom Zoom",
    specs: "f/2.8 Constant Aperture · Internal Stabilization",
    emotionalTag: "Capturing candid portraits and fast-gliding eagles from a distance, respecting the subject's personal space."
  },
  {
    id: "g3",
    category: "Prime Glass",
    name: "Manual Focus 50mm",
    specs: "f/1.8 High Luminescence Portrait Lens",
    emotionalTag: "An intimate focal length that matches human eyes, ideal for capturing soft wrinkles, texture, and genuine light reflections."
  },
  {
    id: "g4",
    category: "Post-Processing Engine",
    name: "Lightroom Classic & Custom Presets",
    specs: "16-bit Monochrome Grading Calibration",
    emotionalTag: "Where the story gets its final tone: compressing highlights, enhancing dark textures, and establishing cinematic depth."
  }
];
