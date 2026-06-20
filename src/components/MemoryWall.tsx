import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { storage } from "../utils/storage";
import { MemoryPin } from "../types";
import { audio } from "../utils/audio";
import { RotateCw, X, MapPin, Calendar, Heart } from "lucide-react";

export default function MemoryWall() {
  const [pins, setPins] = useState<MemoryPin[]>(() => storage.getMemoryPins());
  const [selectedPin, setSelectedPin] = useState<MemoryPin | null>(null);
  const [flippedMap, setFlippedMap] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setPins(storage.getMemoryPins());
    };
    window.addEventListener("portfolio_updated", handleUpdate);
    return () => window.removeEventListener("portfolio_updated", handleUpdate);
  }, []);

  const toggleFlip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audio.playLensTick();
    setFlippedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openPin = (pin: MemoryPin) => {
    audio.playShutterClick();
    setSelectedPin(pin);
  };

  return (
    <section id="memory-wall" className="relative bg-black-pure py-28 overflow-hidden border-t border-neutral-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.03)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
      
      {/* Visual background lines mimicking a workspace layout cutting mat */}
      <div className="absolute inset-0 opacity-15 pointer-events-none grid grid-cols-6 grid-rows-4 border border-neutral-900">
        {[...Array(24)].map((_, i) => (
          <div key={i} className="border-r border-b border-neutral-900/60" />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="max-w-2xl mb-16">
          <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-3">Field Notes</p>
          <h2 className="font-serif text-3xl sm:text-5xl text-white-pure tracking-tight leading-tight">
            The Memory Wall
          </h2>
          <p className="text-gray-soft text-sm sm:text-base mt-4 leading-relaxed font-light">
            An untidy journal of polaroids, scribbled coordinates, and physical travel remnants pinned during overnight stays on South Indian piers. Drag, flip, and explore Sreekar Raju's personal process.
          </p>
        </div>

        {/* Board Canvas */}
        <div
          ref={containerRef}
          className="relative w-full h-[650px] bg-[#070708] border border-neutral-800/80 rounded-2xl p-6 overflow-hidden shadow-2xl select-none"
        >
          {/* Virtual pin shadows */}
          <div className="absolute top-4 left-6 font-mono text-[9px] text-[#222]" style={{ letterSpacing: "0.2em" }}>
            BOARD ID: SR-MANIPAL-2025
          </div>
          
          <div className="absolute bottom-4 right-6 font-serif italic text-[11px] text-[#444] tracking-wider">
            "We lived out of camera backpacks."
          </div>

          {pins.map((pin) => {
            const isFlipped = !!flippedMap[pin.id];
            
            return (
              <motion.div
                key={pin.id}
                drag
                dragConstraints={containerRef}
                dragElastic={0.06}
                whileDrag={{ scale: 1.05, zIndex: 100 }}
                dragTransition={{ bounceStiffness: 400, bounceDamping: 25 }}
                onDragStart={() => audio.playLensTick()}
                style={{
                  left: `${pin.left}%`,
                  top: `${pin.top}%`,
                  transform: `rotate(${pin.rotation}deg)`,
                }}
                className="absolute w-56 sm:w-64 cursor-grab active:cursor-grabbing z-10 group"
              >
                {/* Polaroid Frame */}
                <div className="relative bg-neutral-100 p-3 pb-6 shadow-[0_15px_30px_rgba(0,0,0,0.45)] border border-neutral-300 rounded-sm overflow-hidden text-neutral-900">
                  
                  {/* Decorative tape on top */}
                  <div className="absolute -top-3 left-1/2 -translateX-1/2 w-20 h-7 bg-neutral-300/40 border-b border-dashed border-neutral-400/20 rotate-1 transform origin-center opacity-70" style={{ backdropFilter: "blur(1px)" }} />
                  
                  {/* Miniature metal thumbtack visual */}
                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-800 rounded-full border border-red-900 shadow-md">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full m-auto mt-0.5" />
                  </div>

                  {/* Dynamic perspective flip wrap */}
                  <div className="relative h-48 sm:h-56 overflow-hidden border border-neutral-300/40 bg-neutral-950">
                    <AnimatePresence mode="wait">
                      {!isFlipped ? (
                        <motion.img
                          key="front"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          src={pin.url}
                          alt={pin.title}
                          className="w-full h-full object-cover pointer-events-none grayscale group-hover:grayscale-0 transition-all duration-[1s]"
                        />
                      ) : (
                        <motion.div
                          key="back"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-full h-full bg-[#EBE7DF] p-4 flex flex-col justify-between text-[11px] leading-relaxed font-mono text-neutral-800"
                        >
                          <div>
                            <p className="font-bold border-b border-neutral-400 pb-1 text-[12px] text-neutral-900 font-serif italic mb-2">
                              Field Log Note
                            </p>
                            <p className="text-neutral-700">{pin.caption}</p>
                          </div>
                          <div className="text-[9px] text-neutral-500 border-t border-neutral-300 pt-2 flex justify-between">
                            <span>GPS: L-COAST</span>
                            <span>{pin.stamp}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Polaroid text info bar */}
                  <div className="mt-4 px-1 flex justify-between items-end">
                    <div>
                      <h3 className="font-serif italic text-xs font-semibold tracking-wide text-neutral-900 leading-none">
                        {pin.title}
                      </h3>
                      <span className="text-[9px] text-neutral-500 font-mono mt-2 block">
                        {pin.date}
                      </span>
                    </div>
                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => toggleFlip(pin.id, e)}
                        className="w-6 h-6 rounded-full bg-neutral-200 hover:bg-neutral-300 flex items-center justify-center text-neutral-700 hover:text-gold cursor-pointer transition-colors"
                        title="Flip over"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openPin(pin)}
                        className="w-6 h-6 rounded-full bg-neutral-900 hover:bg-gold flex items-center justify-center text-white-pure hover:text-neutral-950 cursor-pointer transition-colors"
                        title="View photo"
                      >
                        <span className="text-[10px]">&uarr;</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal for Pin Preview */}
      <AnimatePresence>
        {selectedPin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black-pure/95 z-[999] flex items-center justify-center p-4 sm:p-10"
            onClick={() => setSelectedPin(null)}
          >
            {/* Background grain */}
            <div className="film-grain" />

            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="relative max-w-4xl w-full bg-[#121214] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image side */}
              <div className="relative md:w-2/3 max-h-[70vh] md:max-h-full overflow-hidden bg-neutral-950">
                <img
                  src={selectedPin.url}
                  alt={selectedPin.title}
                  className="w-full h-full object-contain md:object-cover aspect-4/3 md:aspect-square"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black-pure/40 to-transparent pointer-events-none" />
              </div>

              {/* Story summary side */}
              <div className="p-6 md:p-8 md:w-1/3 flex flex-col justify-between bg-[#121212] border-t md:border-t-0 md:border-l border-neutral-800">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-gold tracking-widest uppercase mb-4">
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                    <span>Coastal Karnataka</span>
                  </div>

                  <h3 className="font-serif text-2xl text-white-pure">{selectedPin.title}</h3>
                  <p className="font-mono text-[10px] text-gray-soft/50 uppercase mt-1 tracking-wider">
                    POLAROID LOG {selectedPin.stamp}
                  </p>

                  <div className="h-px bg-neutral-900 my-6" />

                  <p className="text-gray-soft text-sm leading-relaxed font-light mt-3 italic">
                    &ldquo;{selectedPin.caption}&rdquo;
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-900/60 flex items-center justify-between text-xs font-mono text-gray-soft/60">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedPin.date}
                  </span>
                  <span className="flex items-center gap-1 text-gold">
                    <Heart className="w-3.5 h-3.5 fill-gold/10" />
                    Verified Archive
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedPin(null)}
                onMouseEnter={() => audio.playLensTick()}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-900/80 hover:bg-gold hover:text-black-pure border border-neutral-800 flex items-center justify-center text-white-pure cursor-pointer smooth-duration"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
