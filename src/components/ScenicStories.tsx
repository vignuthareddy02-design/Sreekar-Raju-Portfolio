import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { storage } from "../utils/storage";
import { DocumentaryStory } from "../types";
import { audio } from "../utils/audio";
import { X, ArrowRight, Play, Eye, Flame, MapPin } from "lucide-react";

export default function ScenicStories() {
  const [stories, setStories] = useState<DocumentaryStory[]>(() => storage.getStories());
  const [activeStory, setActiveStory] = useState<DocumentaryStory | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setStories(storage.getStories());
    };
    window.addEventListener("portfolio_updated", handleUpdate);
    return () => window.removeEventListener("portfolio_updated", handleUpdate);
  }, []);

  const triggerStory = (story: DocumentaryStory) => {
    audio.playShutterClick();
    setActiveStory(story);
  };

  return (
    <section id="stories" className="relative bg-black-pure py-28 border-t border-neutral-900 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(212,175,55,0.02)_0%,rgba(0,0,0,0)_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="max-w-xl mb-16">
          <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-3">Narrative Studies</p>
          <h2 className="font-serif text-3xl sm:text-5xl text-white-pure tracking-tight leading-none">
            Signature Stories
          </h2>
          <p className="text-gray-soft text-sm sm:text-base mt-4 leading-relaxed font-light">
            Each photographic project is crafted like a short, silent documentary series. We do not chase fast clicks — we search for genuine local trust.
          </p>
        </div>

        {/* Netflix Documentary Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story) => (
            <motion.div
              key={story.id}
              onClick={() => triggerStory(story)}
              onMouseEnter={() => audio.playLensTick()}
              className="relative aspect-[3/4.5] group cursor-pointer overflow-hidden rounded-2xl bg-neutral-950 border border-neutral-900 font-sans shadow-2xl"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Cover Photo */}
              <img
                src={story.coverImage}
                alt={story.title}
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-95 transition-all duration-[1s] ease-out pointer-events-none"
              />
              
              {/* Dynamic light refraction pass */}
              <div className="absolute inset-0 bg-gradient-to-t from-black-pure via-black-pure/45 to-transparent z-10" />

              {/* Cover Top Badges */}
              <div className="absolute top-5 left-5 right-5 z-20 flex justify-between items-center">
                <span className="px-3 py-1 bg-black-pure/60 border border-neutral-800 rounded-full text-[9px] font-mono tracking-widest text-gold uppercase select-none">
                  {story.timelineLabel}
                </span>
                <span className="text-[10px] text-white-pure/40 font-mono">
                  {story.releaseYear}
                </span>
              </div>

              {/* Cover Bottom Info */}
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <p className="font-mono text-[9px] text-gold uppercase tracking-[0.2em] mb-1">
                  {story.category}
                </p>
                <h3 className="font-serif text-2xl sm:text-3xl text-white-pure tracking-wide group-hover:text-gold transition-colors duration-400">
                  {story.title}
                </h3>
                <p className="text-[12px] text-gray-soft/80 mt-2 font-light line-clamp-2">
                  {story.subtitle}
                </p>
                
                {/* Simulated Watch Shutter control button */}
                <div className="mt-5 flex items-center gap-2 text-xs font-mono tracking-widest text-[#FFF] uppercase opacity-70 group-hover:opacity-100 group-hover:text-gold transition-all duration-300">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Read Chapter</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>

              {/* Subtle glass reflection lens overlay */}
              <div className="absolute inset-0 border border-white-pure/5 group-hover:border-gold/15 transition-all duration-700 pointer-events-none rounded-2xl" />
            </motion.div>
          ))}
        </div>

      </div>

      {/* Complete Fullscreen Immersive Chapter Overlay (Theater Modal) */}
      <AnimatePresence>
        {activeStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65 }}
            className="fixed inset-0 bg-black-pure z-[999] overflow-y-auto"
          >
            {/* Ambient Background Grain */}
            <div className="film-grain" />

            {/* Backstage Cover Image Panel */}
            <div className="relative w-full h-[55vh] lg:h-[65vh] bg-neutral-950 overflow-hidden">
              <img
                src={activeStory.coverImage}
                alt={activeStory.title}
                className="w-full h-full object-cover brightness-[0.45] scale-105 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black-pure via-black-pure/40 to-transparent" />
              
              {/* Back navigation buttons */}
              <div className="absolute top-6 left-6 sm:top-10 sm:left-10 z-55">
                <button
                  onClick={() => setActiveStory(null)}
                  onMouseEnter={() => audio.playLensTick()}
                  className="flex items-center gap-2.5 px-4.5 py-2.5 bg-neutral-900/80 hover:bg-gold hover:text-black-pure border border-neutral-800 rounded-full text-xs font-mono tracking-widest uppercase transition-colors duration-400 cursor-pointer"
                >
                  &larr; Back to Covers
                </button>
              </div>

              {/* Big central play marker */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center bg-black-pure/50 shadow-2xl relative">
                  <span className="absolute inset-0 rounded-full border border-gold/25 scale-110 animate-ping pointer-events-none" />
                  <Eye className="w-6 h-6 text-gold" />
                </div>
              </div>

              {/* Deep Category Overlay Card */}
              <div className="absolute bottom-8 left-6 sm:left-12 max-w-2xl px-2">
                <span className="flex items-center gap-2 text-[10px] font-mono text-gold tracking-[0.3em] uppercase mb-2">
                  <Flame className="w-3.5 h-3.5" />
                  {activeStory.category} &middot; Vol. 1
                </span>
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white-pure tracking-tight leading-none mt-2">
                  {activeStory.title}
                </h1>
                <p className="text-gray-soft text-sm sm:text-lg font-light mt-3">
                  {activeStory.subtitle}
                </p>
              </div>
            </div>

            {/* Reading Document pane */}
            <div className="max-w-4xl mx-auto px-6 py-16 font-sans relative z-10">
              
              {/* Powerful quote column */}
              <div className="border-l-2 border-gold pl-6 py-2 mb-12">
                <p className="font-serif italic text-xl sm:text-2xl text-white-pure leading-relaxed font-light">
                  &ldquo;{activeStory.emotionalQuote}&rdquo;
                </p>
                <div className="flex items-center gap-2 mt-4 text-[10px] font-mono text-gray-soft/50 uppercase tracking-widest">
                  <MapPin className="w-3.5 h-3.5 text-gold" />
                  <span>{activeStory.location} &middot; {activeStory.releaseYear}</span>
                </div>
              </div>

              {/* Story Narrative Bodies */}
              <div className="space-y-6 text-gray-soft text-sm sm:text-base leading-relaxed font-light">
                {activeStory.descriptionBlocks.map((block, i) => (
                  <p key={i} className="first-letter:text-3xl first-letter:font-serif first-letter:float-left first-letter:mr-2">
                    {block}
                  </p>
                ))}
              </div>

              {/* Horizontal line divider */}
              <div className="h-px bg-neutral-900 my-16" />

              {/* Featured photo frames from this specific chapter */}
              <div className="mb-12">
                <h3 className="font-serif text-xl sm:text-2xl text-white-pure mb-8">
                  Chapters in Focus
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {activeStory.featuredPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative rounded-xl overflow-hidden aspect-video border border-neutral-900 bg-neutral-950"
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black-pure/70 via-black-pure/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex flex-col justify-end p-4" />
                      <div className="absolute bottom-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-350">
                        <span className="text-[9px] font-mono text-gold tracking-widest uppercase">
                          {photo.category}
                        </span>
                        <h4 className="font-serif text-sm text-white-pure mt-1">{photo.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom control close actions */}
              <div className="text-center mt-20">
                <button
                  onClick={() => {
                    audio.playShutterClick();
                    window.scrollTo({ top: document.getElementById('stories')?.offsetTop, behavior: 'smooth' });
                    setActiveStory(null);
                  }}
                  onMouseEnter={() => audio.playLensTick()}
                  className="px-8 py-3.5 bg-gold text-black-pure font-mono text-xs tracking-widest uppercase hover:bg-transparent hover:text-gold border border-gold rounded-full transition-colors duration-400 cursor-pointer"
                >
                  Close Narrative &amp; Return
                </button>
              </div>

            </div>

            {/* Quick floating window overlay closer button */}
            <button
              onClick={() => setActiveStory(null)}
              className="fixed top-6 right-6 w-11 h-11 rounded-full bg-neutral-900 border border-neutral-800 text-white-pure hover:bg-gold hover:text-black-pure flex items-center justify-center transition-colors shadow-xl cursor-pointer z-55"
              title="Close window"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
