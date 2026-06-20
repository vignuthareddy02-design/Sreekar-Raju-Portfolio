import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { storage } from "../utils/storage";
import { Milestone, GearItem } from "../types";
import { audio } from "../utils/audio";
import { Award, Briefcase, Cpu, Feather, HardDrive, Compass } from "lucide-react";

export default function AwardsSection() {
  const [timeline, setTimeline] = useState<Milestone[]>(() => storage.getTimeline());
  const [gearList, setGearList] = useState<GearItem[]>(() => storage.getGear());
  const [hoveredExhibit, setHoveredExhibit] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleUpdate = () => {
      setTimeline(storage.getTimeline());
      setGearList(storage.getGear());
    };
    window.addEventListener("portfolio_updated", handleUpdate);
    return () => window.removeEventListener("portfolio_updated", handleUpdate);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  return (
    <section id="awards" className="relative bg-black-pure py-28 border-t border-neutral-900 overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,175,55,0.015)_0%,rgba(0,0,0,1)_100%)] pointer-events-none" />

      {/* Background decoration: visual camera range finder focus box */}
      <div className="absolute -right-40 top-20 w-96 h-96 border border-neutral-900 rounded-full opacity-35 pointer-events-none select-none flex items-center justify-center">
        <div className="w-64 h-64 border border-dashed border-neutral-900 rounded-full" />
        <div className="w-32 h-32 border border-neutral-900 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Milestones Exhibit List (Left 7 cols) */}
          <div className="lg:col-span-7">
            <div className="max-w-xl mb-12">
              <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-3">Chronobiology</p>
              <h2 className="font-serif text-3xl sm:text-5xl text-white-pure tracking-tight leading-tight">
                Museum Exhibits
              </h2>
              <p className="text-gray-soft text-sm sm:text-base mt-4 leading-relaxed font-light">
                A brief recording of professional fests, corporate coverages, academic systems, and singular creative triggers that forged the storyteller.
              </p>
            </div>

            {/* Vertical timeline cards representing backlit glass shelves */}
            <div className="relative space-y-6">
              
              {/* Vertical link track line */}
              <div className="absolute left-6 top-6 bottom-6 w-px bg-neutral-900/80 pointer-events-none" />

              {timeline.map((milestone) => {
                const isHovered = hoveredExhibit === milestone.id;
                
                return (
                  <div
                    key={milestone.id}
                    onMouseMove={(e) => handleMouseMove(e, milestone.id)}
                    onMouseEnter={() => {
                      setHoveredExhibit(milestone.id);
                      audio.playLensTick();
                    }}
                    onMouseLeave={() => setHoveredExhibit(null)}
                    className="relative pl-14 sm:pl-16 group"
                  >
                    {/* Glowing active pinpoint icon */}
                    <div className="absolute left-3.5 top-8 -translate-x-1/2 z-10">
                      <div className={`w-5 h-5 rounded-full border transition-all duration-500 flex items-center justify-center ${
                        isHovered
                          ? "bg-gold border-gold scale-110 shadow-lg shadow-gold/30"
                          : "bg-neutral-950 border-neutral-800"
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isHovered ? 'bg-black-pure' : 'bg-neutral-600'}`} />
                      </div>
                    </div>

                    {/* Backlit spotlight dynamic glass card */}
                    <div className="relative glass-panel rounded-2xl p-6 sm:p-8 overflow-hidden transition-all duration-500 hover:border-gold/25 hover:-translate-y-1 shadow-2xl">
                      
                      {/* Dynamic Spotlight radial glow following cursor */}
                      {isHovered && (
                        <div
                          className="absolute pointer-events-none rounded-full"
                          style={{
                            width: "350px",
                            height: "350px",
                            background: "radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, rgba(0,0,0,0) 65%)",
                            left: `${mousePos.x - 175}px`,
                            top: `${mousePos.y - 175}px`,
                            transition: "left 0.15s ease, top 0.15s ease",
                          }}
                        />
                      )}

                      {/* Header row */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5">
                        <div>
                          <span className="text-[10px] font-mono tracking-widest text-gold uppercase">
                            {milestone.organization}
                          </span>
                          <h3 className="font-serif text-xl sm:text-2xl text-white-pure font-bold mt-1 group-hover:text-gold transition-colors duration-400">
                            {milestone.role}
                          </h3>
                        </div>
                        <span className="px-3.5 py-1 bg-neutral-900 border border-neutral-800 rounded-full font-mono text-[10px] text-gray-soft/80 w-fit">
                          {milestone.year}
                        </span>
                      </div>

                      {/* Summary */}
                      <p className="text-gray-soft text-xs sm:text-sm mt-4 leading-relaxed font-light">
                        {milestone.description}
                      </p>

                      {/* Technical detail bulletins */}
                      {milestone.detailsList && (
                        <ul className="mt-5 space-y-2 border-t border-neutral-900/60 pt-4 text-[11px] font-mono text-gray-soft/50">
                          {milestone.detailsList.map((dt, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-gold/50" />
                              <span>{dt}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Reflective corner lines */}
                      <div className="absolute inset-px rounded-2xl border border-white-pure/5 pointer-events-none" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gear I Trust Section (Right 5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="max-w-xl lg:pl-4">
              <div className="mb-10">
                <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-3">Hardware</p>
                <h2 className="font-serif text-3xl text-white-pure tracking-tight">
                  Gear I Trust
                </h2>
                <p className="text-gray-soft text-xs sm:text-sm mt-3 leading-relaxed font-light">
                  A photographer's gear is their sensory extensions. Sreekar Raju selects simple, durable toolsets to handle any high-spray sea, festival sweat, or studio scenario.
                </p>
              </div>

              {/* Dynamic Gear list */}
              <div className="space-y-4">
                {gearList.map((gear, idx) => {
                  // Map categories to modern crisp icons
                  const Icon = idx === 0 
                    ? Cpu 
                    : idx === 1 
                    ? Compass 
                    : idx === 2 
                    ? Feather 
                    : HardDrive;
                    
                  return (
                    <div
                      key={gear.id}
                      onMouseEnter={() => audio.playLensTick()}
                      className="glass-panel p-5 rounded-xl border border-neutral-900 hover:border-neutral-800 transition-all duration-400 flex gap-4 relative overflow-hidden"
                    >
                      <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800/80 flex items-center justify-center text-gold/80 flex-shrink-0">
                        <Icon className="w-5 h-5 text-gold" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono text-gold uppercase tracking-wider">
                            {gear.category}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-white-pure text-sm mt-1">
                          {gear.name}
                        </h4>
                        <p className="text-[10px] text-gray-soft/40 font-mono mt-0.5">
                          {gear.specs}
                        </p>
                        <p className="text-[11px] text-gray-soft text-light mt-2 bg-black-pure/30 p-2.5 rounded border border-neutral-900/60 leading-relaxed italic">
                          &ldquo;{gear.emotionalTag}&rdquo;
                        </p>
                      </div>

                      {/* Visual border highlight index */}
                      <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-neutral-900 group-hover:bg-gold/40 transition-colors" />
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
