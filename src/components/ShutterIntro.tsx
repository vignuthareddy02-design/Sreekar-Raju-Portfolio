import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { audio } from "../utils/audio";
import { Camera, Headphones } from "lucide-react";

interface ShutterIntroProps {
  onComplete: () => void;
}

export default function ShutterIntro({ onComplete }: ShutterIntroProps) {
  const [phase, setPhase] = useState<"idle" | "clicking" | "showingQuote" | "dissolving">("idle");
  const hasInteracted = useRef(false);

  const startSequence = () => {
    if (hasInteracted.current) return;
    hasInteracted.current = true;
    
    setPhase("clicking");
    audio.playShutterClick();
    
    // Time the shutter opening to first curtain snap
    setTimeout(() => {
      setPhase("showingQuote");
    }, 600);

    // Fade out quote and dissolve intro screen
    setTimeout(() => {
      setPhase("dissolving");
    }, 3800);

    // Final trigger to render main app
    setTimeout(() => {
      onComplete();
    }, 4800);
  };

  // Keyboard accessibility bypass
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        startSequence();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="fixed inset-0 bg-black-pure z-[9999] flex items-center justify-center overflow-hidden font-sans select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,20,20,0.8)_0%,rgba(0,0,0,1)_100%)]" />
      
      {/* Film Grain FX */}
      <div className="film-grain" />

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div
            key="idle-prompt"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center z-10 max-w-sm px-6 flex flex-col items-center"
          >
            {/* Visual camera lens ring button */}
            <button
              onClick={startSequence}
              onMouseEnter={() => audio.playLensTick()}
              className="relative w-32 h-32 rounded-full border border-gold/40 hover:border-gold group flex items-center justify-center transition-colors duration-500 cursor-pointer mb-8"
              id="initiate-trigger"
            >
              <div className="absolute inset-2 rounded-full border border-dashed border-gold/20 group-hover:rotate-45 transition-transform duration-[4s] ease-linear" />
              <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:scale-95 transition-transform duration-500 shadow-2xl">
                <Camera className="w-6 h-6 text-gold group-hover:scale-110 transition-transform duration-350" />
              </div>
              <span className="absolute -inset-4 rounded-full border border-gold/10 scale-90 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
            </button>

            <h2 className="font-serif text-white-pure text-lg tracking-wide uppercase mb-3">
              Sreekar Raju
            </h2>
            <p className="font-mono text-xs text-gold tracking-[0.25em] uppercase mb-4">
              Visual Storyteller
            </p>
            
            <div className="flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800/60 rounded-full text-[10px] text-gray-soft select-none font-mono tracking-wider">
              <Headphones className="w-3.5 h-3.5 text-gold" />
              <span>Headphones Recommended</span>
            </div>
            
            <p className="text-[11px] text-gray-soft/50 mt-10 font-mono">
              Press [SPACE] or Click lens to begin
            </p>
          </motion.div>
        )}

        {(phase === "clicking" || phase === "showingQuote") && (
          <motion.div
            key="shutter-blades-wrapper"
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          >
            {/* SVG Camera Aperture Shutter */}
            <svg
              className="w-full h-full max-w-lg max-h-lg opacity-85 select-none"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="blade-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1a1a1a" />
                  <stop offset="70%" stopColor="#0d0d0d" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              <g transform="translate(100, 100)">
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 360) / 12;
                  return (
                    <motion.path
                      key={i}
                      d="M 0 -70 L 40 -60 L 15 -10 Z"
                      fill="url(#blade-gradient)"
                      stroke="#000"
                      strokeWidth="0.5"
                      initial={{ rotate: angle, scale: 0.1, opacity: 1 }}
                      animate={
                        phase === "showingQuote"
                          ? { rotate: angle + 55, scale: 3.4, opacity: 0 }
                          : { rotate: angle, scale: 0.85, opacity: 1 }
                      }
                      transition={{
                        duration: 0.95,
                        ease: [0.77, 0, 0.175, 1], // sudden mechanic shutter curves
                      }}
                      style={{ originX: "0px", originY: "0px" }}
                    />
                  );
                })}
              </g>
            </svg>
          </motion.div>
        )}

        {phase === "showingQuote" && (
          <motion.div
            key="storyteller-quote"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.4, duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
            className="z-30 text-center max-w-2xl px-8"
          >
            <p className="font-serif italic text-white-pure text-2xl sm:text-3xl lg:text-4xl leading-relaxed font-light tracking-wide">
              &ldquo;Some people take photographs.
              <br />
              I preserve moments that time can never recreate.&rdquo;
            </p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ delay: 1.2, duration: 1.8, ease: "easeOut" }}
              className="h-px bg-gold/60 mx-auto mt-8 mb-4 shadow-[0_0_8px_rgba(212,175,55,0.8)]"
            />
            <p className="font-mono text-xs text-gold/80 tracking-[0.3em] uppercase">
              Sreekar Raju &middot; Visual Journey
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
