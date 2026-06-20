import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { storage } from "../utils/storage";
import { PhotoItem } from "../types";
import { audio } from "../utils/audio";
import { Camera, MapPin, X, Eye, ZoomIn, Contrast } from "lucide-react";

export default function SignatureGallery() {
  const [photos, setPhotos] = useState<PhotoItem[]>(() => storage.getPhotos());
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [monoOverride, setMonoOverride] = useState<boolean>(false);
  const elementsRef = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleUpdate = () => {
      setPhotos(storage.getPhotos());
    };
    window.addEventListener("portfolio_updated", handleUpdate);
    return () => window.removeEventListener("portfolio_updated", handleUpdate);
  }, []);

  const categories = ["All", "Documentary", "Portrait", "Wildlife", "Travel", "Concert"];

  const filteredPhotos = filterCategory === "All"
    ? photos
    : photos.filter(p => p.category === filterCategory);

  const openLightbox = (photo: PhotoItem) => {
    audio.playShutterClick();
    setSelectedPhoto(photo);
    setMonoOverride(!!photo.isBW);
  };

  // Run scroll reveal triggers
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-10");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    Object.values(elementsRef.current).forEach((el) => {
      if (el) observer.observe(el as Element);
    });

    return () => observer.disconnect();
  }, [filteredPhotos]);

  return (
    <section id="gallery" className="relative bg-black-pure py-28 border-t border-neutral-900 font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(212,175,55,0.025)_0%,rgba(0,0,0,0)_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Block with Filter Buttons */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-8">
          <div className="max-w-xl">
            <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-3">Portfolio</p>
            <h2 className="font-serif text-3xl sm:text-5xl text-white-pure tracking-tight leading-none">
              Signature Works
            </h2>
            <p className="text-gray-soft text-sm sm:text-base mt-4 leading-relaxed font-light">
              A curated archive of singular frames. Filter through themes or click any master photograph of Sreekar Raju to view its full details and exposure notes.
            </p>
          </div>

          {/* Luxury Filter list */}
          <div className="flex flex-wrap gap-2.5 max-w-lg md:justify-end">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  audio.playLensTick();
                  setFilterCategory(cat);
                }}
                className={`px-4 py-2 text-xs font-mono tracking-widest uppercase rounded-full border transition-all duration-350 cursor-pointer ${
                  filterCategory === cat
                    ? "bg-gold border-gold text-black-pure shadow-lg shadow-gold/5"
                    : "bg-transparent border-neutral-800 hover:border-neutral-700 text-gray-soft hover:text-white-pure"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Masonry Bento Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo, i) => {
              // Custom alternating aspect ratios to generate a genuine organic masonry layout
              const heightClass = i % 3 === 0 
                ? "aspect-[3/4.2]" 
                : i % 3 === 1 
                ? "aspect-[3/3]" 
                : "aspect-[3/4.8]";

              return (
                <motion.div
                  key={photo.id}
                  layoutId={`photo-wrapper-${photo.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="break-inside-avoid w-full group cursor-pointer"
                  onClick={() => openLightbox(photo)}
                >
                  <div className={`relative w-full ${heightClass} overflow-hidden rounded-xl border border-neutral-900 bg-neutral-950 shadow-2xl`}>
                    
                    {/* Golden Light ray shim on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black-pure/80 via-black-pure/10 to-transparent opacity-40 group-hover:opacity-75 transition-opacity duration-500 z-10" />

                    {/* True photograph */}
                    <img
                      src={photo.url}
                      alt={photo.title}
                      loading="lazy"
                      className={`w-full h-full object-cover transform scale-100 group-hover:scale-[1.04] transition-all duration-[1s] ease-out pointer-events-none ${
                        photo.isBW ? "grayscale" : "contrast-[1.03]"
                      }`}
                    />

                    {/* Camera Overlay Icon on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-350 z-20 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-black-pure/60 border border-gold/30 flex items-center justify-center text-gold shadow-2xl scale-75 group-hover:scale-100 transition-all duration-[0.4s]">
                        <ZoomIn className="w-5 h-5 pointer-events-none" />
                      </div>
                    </div>

                    {/* Technical details badge left-bottom */}
                    <div className="absolute bottom-5 left-5 right-5 z-20 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-350 flex flex-col pointer-events-none">
                      <span className="text-[9px] font-mono text-gold tracking-widest uppercase mb-1">
                        {photo.category} &middot; {photo.location.split(',')[0]}
                      </span>
                      <h4 className="font-serif text-lg text-white-pure">{photo.title}</h4>
                    </div>

                    {/* Lens reflective border */}
                    <div className="absolute inset-0 border border-white-pure/5 rounded-xl group-hover:border-gold/20 transition-colors duration-[1s] pointer-events-none" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>

      {/* Cinematic Photog Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 bg-black-pure/98 z-[999] flex items-center justify-center p-4 sm:p-10 select-none cursor-zoom-out"
          >
            <div className="film-grain" />

            <div className="absolute top-6 left-6 flex items-center gap-2 font-mono text-[10px] text-gray-soft/40 select-none">
              <Camera className="w-4 h-4 animate-pulse" />
              <span>SREEKAR RAJU CO-OP CAPTURE ARCHIVE</span>
            </div>

            {/* Main inspector */}
            <motion.div
              layoutId={`photo-wrapper-${selectedPhoto.id}`}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-[#0D0D0E]/95 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row cursor-default"
            >
              {/* Main Photo Frame */}
              <div className="relative md:w-3/5 lg:w-2/3 max-h-[60vh] md:max-h-full overflow-hidden bg-neutral-950 flex items-center justify-center p-2">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className={`w-full h-full object-contain max-h-[50vh] md:max-h-[75vh] transition-all duration-700 ${
                    monoOverride ? "grayscale contrast-[1.1]" : "grayscale-0 contrast-[1.01]"
                  }`}
                />
                
                {/* Visual lens alignment ring decoration */}
                <div className="absolute inset-4 border border-dashed border-white-pure/5 rounded-xl pointer-events-none" />
              </div>

              {/* Technical detail checklist metadata panel */}
              <div className="p-6 md:p-8 md:w-2/5 lg:w-1/3 flex flex-col justify-between bg-[#0F0F10] border-t md:border-t-0 md:border-l border-neutral-800 relative z-10">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gold tracking-widest uppercase flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedPhoto.category}
                    </span>
                    
                    {/* B&W filter simulation override toggle */}
                    <button
                      onClick={() => {
                        audio.playLensTick();
                        setMonoOverride(!monoOverride);
                      }}
                      className="flex items-center gap-1.5 px-2 py-0.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded text-[9px] font-mono text-gray-soft hover:text-white-pure transition-colors cursor-pointer"
                      title="Simulate lens filters"
                    >
                      <Contrast className="w-3 h-3 text-gold" />
                      <span>{monoOverride ? "Chrome" : "Mono"}</span>
                    </button>
                  </div>

                  <h3 className="font-serif text-2xl lg:text-3xl text-white-pure mt-4 font-bold tracking-tight">
                    {selectedPhoto.title}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-[10px] font-mono text-gray-soft/40 tracking-wider mt-1 border-b border-neutral-900 pb-4">
                    <span>INDEX: SR-{selectedPhoto.id.toUpperCase()}</span>
                    <span>&middot;</span>
                    <span>COORDINATES: {selectedPhoto.location.split(',')[0]}</span>
                  </div>

                  <p className="text-gray-soft text-xs sm:text-sm font-light leading-relaxed mt-6">
                    {selectedPhoto.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-900 space-y-3.5">
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <span className="text-gray-soft/50 uppercase">Location</span>
                    <span className="text-white-soft font-medium text-right max-w-[160px] truncate">
                      {selectedPhoto.location}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <span className="text-gray-soft/50 uppercase">Camera System</span>
                    <span className="text-white-soft font-medium">Nikon DSLR Manual</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <span className="text-gray-soft/50 uppercase">Exposure Index</span>
                    <span className="text-gold/90 font-medium">f/2.8 &middot; 1/1250s &middot; ISO 100</span>
                  </div>
                </div>
              </div>

              {/* Exit out */}
              <button
                onClick={() => setSelectedPhoto(null)}
                onMouseEnter={() => audio.playLensTick()}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-900/90 border border-neutral-800/80 text-white-pure hover:bg-gold hover:text-black-pure flex items-center justify-center transition-colors cursor-pointer shadow-lg"
              >
                <X className="w-4 h-4 pointer-events-none" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
