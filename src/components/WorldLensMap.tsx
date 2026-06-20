import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { storage } from "../utils/storage";
import { TravelLocation } from "../types";
import { audio } from "../utils/audio";
import { Compass, Film, MapPin, Sparkles, ChevronRight } from "lucide-react";

export default function WorldLensMap() {
  const [locations, setLocations] = useState<TravelLocation[]>(() => storage.getLocations());
  const [selectedLoc, setSelectedLoc] = useState<TravelLocation>(() => {
    const locs = storage.getLocations();
    return locs[0] || {} as TravelLocation;
  });
  const [hoveredLoc, setHoveredLoc] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      const updated = storage.getLocations();
      setLocations(updated);
      setSelectedLoc(prev => {
        const found = updated.find(l => l.id === prev.id);
        return found || updated[0] || {} as TravelLocation;
      });
    };
    window.addEventListener("portfolio_updated", handleUpdate);
    return () => window.removeEventListener("portfolio_updated", handleUpdate);
  }, []);

  const selectLocation = (loc: TravelLocation) => {
    if (selectedLoc.id === loc.id) return;
    audio.playShutterClick();
    setSelectedLoc(loc);
  };

  return (
    <section id="travel-map" className="relative bg-black-pure py-28 border-t border-neutral-900 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(214,175,55,0.02)_0%,rgba(0,0,0,0)_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text panel (Left 5 cols) */}
          <div className="lg:col-span-5 h-full flex flex-col justify-center">
            <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-3">Cartography</p>
            <h2 className="font-serif text-3xl sm:text-5xl text-white-pure tracking-tight leading-tight">
              The World<br />Through My Lens
            </h2>
            <p className="text-gray-soft text-sm sm:text-base mt-4 leading-relaxed font-light">
              Every coordinate holds a visual quest. Click to explore Sreekar Raju's main hubs, track travel corridors, and read behind-the-scene photographic moments.
            </p>

            {/* Glowing Locations Menu List */}
            <div className="mt-8 flex flex-col gap-3">
              {locations.map((loc) => {
                const isSelected = selectedLoc.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => selectLocation(loc)}
                    onMouseEnter={() => {
                      setHoveredLoc(loc.id);
                      audio.playLensTick();
                    }}
                    onMouseLeave={() => setHoveredLoc(null)}
                    className={`text-left p-4 rounded-xl border transition-all duration-500 cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? "bg-neutral-900/60 border-gold/40 shadow-lg shadow-gold/2"
                        : "bg-transparent border-neutral-900 hover:border-neutral-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <span className={`absolute inset-0 rounded-full bg-gold/30 blur-sm scale-110 ${isSelected || hoveredLoc === loc.id ? 'animate-ping' : 'opacity-0'}`} />
                        <div className={`w-3.5 h-3.5 rounded-full border transition-all duration-500 flex items-center justify-center ${
                          isSelected ? "bg-gold border-gold" : "bg-neutral-900 border-neutral-700 group-hover:border-gold"
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full bg-black-pure transition-transform duration-500 ${isSelected ? 'scale-100' : 'scale-0'}`} />
                        </div>
                      </div>
                      <div>
                        <h4 className={`text-sm tracking-wide font-medium transition-colors duration-300 ${isSelected ? 'text-gold' : 'text-white-soft'}`}>
                          {loc.name}
                        </h4>
                        <span className="text-[10px] text-gray-soft/50 font-mono italic">
                          {loc.shortStory}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-soft/40 group-hover:text-gold transition-all duration-300 ${isSelected ? 'translate-x-1 text-gold/80' : ''}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Map canvas (Right 7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6 items-center">
            <div className="relative w-full max-w-[580px] aspect-[4/3] bg-neutral-950/80 border border-neutral-900 rounded-2xl overflow-hidden p-6 shadow-2xl flex items-center justify-center">
              
              {/* Retro SVG Map Outline of Karnataka / South India coastal tip */}
              <svg
                viewBox="0 0 200 150"
                className="absolute inset-0 w-full h-full opacity-35 text-neutral-800 pointer-events-none select-none"
                style={{ strokeDasharray: "2" }}
              >
                {/* Visual state map contours */}
                <path
                  d="M10,20 Q48,5 80,18 T120,45 T110,95 T100,140 Q40,110 32,95 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.75"
                />
                
                {/* Dotted oceanic travel waves */}
                <path d="M5,40 C12,42 18,38 25,40" fill="none" stroke="currentColor" strokeWidth="0.4" />
                <path d="M120,110 C128,112 134,108 142,110" fill="none" stroke="currentColor" strokeWidth="0.4" />
                
                {/* SVG Route Paths */}
                {locations.map((loc) => {
                  if (!loc.routeToId) return null;
                  const nextLoc = locations.find(l => l.id === loc.routeToId);
                  if (!nextLoc) return null;

                  return (
                    <g key={`route-${loc.id}`}>
                      {/* Dotted static link */}
                      <line
                        x1={loc.coordinates.x * 2}
                        y1={loc.coordinates.y * 1.5}
                        x2={nextLoc.coordinates.x * 2}
                        y2={nextLoc.coordinates.y * 1.5}
                        stroke="#D4AF37"
                        strokeWidth="0.8"
                        strokeDasharray="3,3"
                        className="opacity-30"
                      />
                      
                      {/* Animated signal particle traveling along route */}
                      <circle r="1.5" fill="#D4AF37" className="blur-[0.5px]">
                        <animateMotion
                          dur="4s"
                          repeatCount="indefinite"
                          path={`M ${loc.coordinates.x * 2} ${loc.coordinates.y * 1.5} L ${nextLoc.coordinates.x * 2} ${nextLoc.coordinates.y * 1.5}`}
                        />
                      </circle>
                    </g>
                  );
                })}
              </svg>

              {/* Glowing Interactive Markers */}
              {locations.map((loc) => {
                const isSelected = selectedLoc.id === loc.id;
                const isHovered = hoveredLoc === loc.id;
                
                return (
                  <div
                    key={loc.id}
                    style={{
                      position: "absolute",
                      left: `${loc.coordinates.x}%`,
                      top: `${loc.coordinates.y}%`,
                    }}
                    className="transform -translate-x-1/2 -translate-y-1/2 z-20 group"
                  >
                    <button
                      onClick={() => selectLocation(loc)}
                      onMouseEnter={() => {
                        setHoveredLoc(loc.id);
                        audio.playLensTick();
                      }}
                      onMouseLeave={() => setHoveredLoc(null)}
                      className="relative w-6 h-6 flex items-center justify-center cursor-pointer"
                    >
                      {/* concentric ripples */}
                      <span className={`absolute w-12 h-12 rounded-full border border-gold/30 scale-100 ${isSelected || isHovered ? 'animate-pulse-ring' : 'opacity-0'} pointer-events-none`} style={{ animationDuration: '2s', animationIterationCount: 'infinite' }} />
                      <span className="absolute w-8 h-8 rounded-full bg-gold/15 scale-90 opacity-70 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
                      
                      <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 flex items-center justify-center ${
                        isSelected ? 'bg-gold border-gold' : 'bg-neutral-900 border-neutral-700 group-hover:border-gold'
                      }`}>
                        <div className="w-1 h-1 rounded-full bg-black-pure" />
                      </div>
                    </button>

                    {/* Minimal floating map tag */}
                    <div className="absolute top-7 left-1/2 transform -translate-x-1/2 bg-neutral-950/90 border border-neutral-800/80 px-2 py-0.5 rounded text-[9px] font-mono whitespace-nowrap text-gray-soft pointer-events-none shadow-md">
                      {loc.name}
                    </div>
                  </div>
                );
              })}

              <div className="absolute top-4 left-6 flex items-center gap-2 font-mono text-[10px] text-gray-soft/40 select-none">
                <Compass className="w-4 h-4 animate-spin-slow" style={{ animationDuration: '10s' }} />
                <span>COASTAL KARNATAKA CARTOGRAPHY</span>
              </div>
            </div>

            {/* Glowing active details capsule (Under Map) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedLoc.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[580px] glass-panel p-6 rounded-2xl flex flex-col sm:flex-row gap-5 items-stretch shadow-2xl relative"
              >
                {/* Ambient glow decoration */}
                <div className="absolute -inset-px rounded-2xl border border-gold/15 pointer-events-none" />

                {/* Imagery view */}
                <div className="w-full sm:w-1/3 rounded-xl overflow-hidden aspect-video sm:aspect-square relative flex-shrink-0 bg-neutral-950 border border-neutral-800">
                  <img
                    src={selectedLoc.associatedImage}
                    alt={selectedLoc.name}
                    className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-750"
                  />
                  <div className="absolute top-2 left-2 bg-black-pure/70 border border-neutral-800/80 rounded px-1.5 py-0.5 text-[8px] font-mono text-gold flex items-center gap-1">
                    <Film className="w-2.5 h-2.5" />
                    <span>RAW</span>
                  </div>
                </div>

                {/* Bio & obstacles */}
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <span className="flex items-center gap-1 text-[9px] font-mono text-gold uppercase tracking-widest mb-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedLoc.name}
                    </span>
                    <h3 className="font-serif text-lg text-white-pure font-medium leading-snug">
                      {selectedLoc.shortStory}
                    </h3>
                    <p className="text-gray-soft text-xs font-light mt-2.5 leading-relaxed">
                      {selectedLoc.snippet}
                    </p>
                  </div>

                  <div className="mt-5 sm:mt-0 border-t border-neutral-900 pt-3 flex items-center gap-1.5 text-[10px] text-gray-soft/50 font-mono uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-gold/80" />
                    <span>Focus Area · {selectedLoc.status}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
