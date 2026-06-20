import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { audio } from "./utils/audio";
import { signaturePhotos } from "./data";

// Custom Modular UI Components
import ShutterIntro from "./components/ShutterIntro";
import ScenicStories from "./components/ScenicStories";
import SignatureGallery from "./components/SignatureGallery";
import MemoryWall from "./components/MemoryWall";
import WorldLensMap from "./components/WorldLensMap";
import AwardsSection from "./components/AwardsSection";
import ContactSection from "./components/ContactSection";
import CreatorStudio from "./components/CreatorStudio";

import { Menu, X, ArrowDown, MapPin, Sparkles, Volume2, VolumeX, Eye, Settings, ShieldAlert, ShieldCheck, LogOut } from "lucide-react";
import { auth, isUserAdmin, logout, loginWithGoogle, ADMIN_EMAIL } from "./utils/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import OwnerAuthModal from "./components/OwnerAuthModal";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tideProgress, setTideProgress] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [hoveredMenuLink, setHoveredMenuLink] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 3D Parallax Mouse Coefficients
  const [mouseOffsets, setMouseOffsets] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const { width, height, left, top } = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 32;
    const y = (e.clientY - top - height / 2) / 32;
    setMouseOffsets({ x, y });
  };

  const handleScroll = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      setTideProgress(progress);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openVisualSection = (sectionId: string) => {
    setIsMenuOpen(false);
    audio.playShutterClick();
    const target = document.getElementById(sectionId);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth" });
      }, 350);
    }
  };

  const toggleSound = () => {
    setSoundOn(!soundOn);
    // Silent trigger to test AudioCtx bypass
    audio.playLensTick();
  };

  return (
    <div className="relative min-h-screen bg-black-pure text-white-soft font-sans select-none overflow-x-hidden">
      
      {/* Background Cinematic Dust Noise overlay */}
      <div className="film-grain" />

      {/* 1. Cinematic Doorway Shutter Intro opener */}
      <AnimatePresence>
        {showIntro && (
          <ShutterIntro onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {!showIntro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative min-h-screen"
        >
          {/* Elegant Dark Viewport Frame -- Immersive Picture Border */}
          <div className="fixed inset-0 pointer-events-none z-[49] border-[12px] sm:border-[24px] md:border-[36px] lg:border-[44px] border-black select-none">
            <div className="w-full h-full border border-white/10 relative">
              <div className="absolute -top-px -left-px w-6 h-6 sm:w-8 sm:h-8 border-t border-l border-gold"></div>
              <div className="absolute -top-px -right-px w-6 h-6 sm:w-8 sm:h-8 border-t border-r border-gold"></div>
              <div className="absolute -bottom-px -left-px w-6 h-6 sm:w-8 sm:h-8 border-b border-l border-gold"></div>
              <div className="absolute -bottom-px -right-px w-6 h-6 sm:w-8 sm:h-8 border-b border-r border-gold"></div>
            </div>
          </div>

          {/* Elegant Dark Vertical Social Rail */}
          <div className="fixed right-3 sm:right-6 md:right-10 lg:right-[48px] top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center space-y-8 z-45 select-none">
            <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-gold to-transparent opacity-60"></div>
            <div className="flex flex-col space-y-6 text-[10px] uppercase tracking-[0.3em] font-mono font-light [writing-mode:vertical-rl] text-white/30 rotate-180">
              <a
                href="https://www.linkedin.com/in/sreekarraju-411045243"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => audio.playLensTick()}
                className="hover:text-gold hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                LinkedIn
              </a>
              <a
                href="https://wa.me/917013352985"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => audio.playLensTick()}
                className="hover:text-gold hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                WhatsApp
              </a>
              <a
                href="mailto:sreekarraju46@gmail.com"
                onMouseEnter={() => audio.playLensTick()}
                className="hover:text-gold hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                Email
              </a>
            </div>
            <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-gold to-transparent opacity-60"></div>
          </div>

          {/* Tideline — Custom Scroll progress gold line */}
          <div
            className="fixed top-0 left-0 h-[2px] bg-gold z-[999] shadow-[0_0_8px_rgba(212,175,55,1)] transition-all duration-[0.1s]"
            style={{ width: `${tideProgress}%` }}
          />

          {/* Master Navigation Bar */}
          <header className="fixed top-3 sm:top-6 md:top-10 lg:top-12 left-3 sm:left-6 md:left-10 lg:left-12 right-3 sm:right-6 md:right-10 lg:right-12 z-50 py-3 sm:py-4 px-6 md:px-8 flex justify-between items-center transition-all bg-transparent">
            {/* Logo */}
            <div
              onClick={() => openVisualSection("hero")}
              onMouseEnter={() => audio.playLensTick()}
              className="font-serif text-lg tracking-[0.15em] text-white-pure cursor-pointer uppercase flex items-center gap-2 group select-none"
            >
              <span>Sreekar</span>
              <span className="text-gold group-hover:text-white-pure transition-colors duration-400">Raju</span>
            </div>

            {/* Quick indicators */}
            <div className="flex items-center gap-6">
              {/* Audio controller */}
              <button
                onClick={toggleSound}
                className="text-gray-soft/60 hover:text-gold transition-colors duration-300 flex items-center gap-1 cursor-pointer font-mono text-[9px] tracking-wider uppercase"
                title={soundOn ? "Mute mechanic sound effects" : "Unmute sounds"}
              >
                {soundOn ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-gold" />
                    <span className="hidden sm:inline">Sounds Live</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-gray-soft/40" />
                    <span className="hidden sm:inline">Sounds Quiet</span>
                  </>
                )}
              </button>

              {/* Shutter Toggle Hamburger */}
              <button
                onClick={() => {
                  audio.playShutterClick();
                  setIsMenuOpen(true);
                }}
                onMouseEnter={() => audio.playLensTick()}
                className="w-10 h-10 rounded-full bg-neutral-900/80 hover:bg-gold hover:text-black-pure border border-neutral-800 flex items-center justify-center text-white-pure transition-all duration-350 cursor-pointer shadow-lg relative group"
                id="shutter-menu-trigger"
              >
                <Menu className="w-4 h-4" />
                <span className="absolute -inset-1 rounded-full border border-gold/10 scale-90 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-350 pointer-events-none" />
              </button>
            </div>
          </header>

          {/* 2. Full-screen sliding menu overlay */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 bg-black-pure/98 z-[999] flex items-center"
              >
                {/* Backing Silhouette Images corresponding to hovered nav link */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-black-pure/90 z-10" />
                  
                  {/* Background images transitioning */}
                  {signaturePhotos.slice(0, 5).map((photo) => {
                    const isVisible = hoveredMenuLink === photo.id;
                    return (
                      <img
                        key={photo.id}
                        src={photo.url}
                        alt=""
                        className={`absolute w-full h-full object-cover transition-all duration-[1.5s] ease-out select-none mix-blend-color-dodge ${
                          isVisible
                            ? "opacity-25 scale-100 blur-[2px]"
                            : "opacity-0 scale-105 blur-[10px]"
                        }`}
                      />
                    );
                  })}
                </div>

                <div className="max-w-7xl mx-auto px-10 w-full relative z-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-12 select-none h-full py-24">
                  {/* Left Link list */}
                  <nav className="flex flex-col space-y-4">
                    <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-1">Index Map</p>
                    
                    {[
                      { id: "hero", label: "01 // Home Entrance", bgId: "img8" },
                      { id: "about", label: "02 // Behind The Lens", bgId: "img1" },
                      { id: "stories", label: "03 // Narrative Chapters", bgId: "img9" },
                      { id: "gallery", label: "04 // Signature Works", bgId: "img4" },
                      { id: "memory-wall", label: "05 // The Memory Wall", bgId: "img3" },
                      { id: "travel-map", label: "06 // Cartography", bgId: "img11" },
                      { id: "awards", label: "07 // Museum Exhibits", bgId: "img6" },
                      { id: "contact", label: "08 // Connect Ledger", bgId: "img12" },
                    ].map((link) => (
                      <button
                        key={link.id}
                        onClick={() => openVisualSection(link.id)}
                        onMouseEnter={() => {
                          setHoveredMenuLink(link.bgId);
                          audio.playLensTick();
                        }}
                        onMouseLeave={() => setHoveredMenuLink(null)}
                        className="text-left font-serif text-3xl sm:text-5xl text-gray-soft/50 hover:text-white-pure hover:-translate-x-1 hover:skew-x-1 transition-all duration-350 cursor-pointer block leading-none font-bold select-none h-14"
                      >
                        {link.label}
                      </button>
                    ))}
                  </nav>

                  {/* Right contact ledger bio summary */}
                  <div className="max-w-xs border-l border-neutral-900 pl-8 py-4 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-xl text-gold">Sreekar Raju</h4>
                      <p className="text-[11px] font-mono text-gray-soft/40 uppercase tracking-widest mt-1">
                        Visual Storyteller &middot; Bengaluru
                      </p>
                      <p className="text-gray-soft text-xs mt-4 leading-relaxed font-light font-sans">
                        Preserving South Indian fishing harbours, high-contrast monochrome street profiles, and corporate events with Scholar Z since 2025.
                      </p>
                      <div className="mt-8 space-y-2 font-mono text-[11px]">
                        <a href="mailto:sreekarraju46@gmail.com" className="block text-gray-soft hover:text-gold transition-colors">
                          sreekarraju46@gmail.com
                        </a>
                        <a href="tel:+917013352985" className="block text-gray-soft hover:text-gold transition-colors">
                          +91 70133 52985
                        </a>
                      </div>
                    </div>

                    {/* Launch Creator Studio Panel Trigger */}
                    <div className="mt-10 space-y-3 w-full">
                      {currentUser && (
                        <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-gray-soft/50 border-b border-neutral-900/40 pb-3">
                          <span className="flex items-center gap-1.5 overflow-hidden">
                            {currentUser.email === ADMIN_EMAIL ? (
                              <ShieldCheck className="w-3.5 h-3.5 text-gold shrink-0 animate-pulse" />
                            ) : (
                              <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            )}
                            <span className="truncate max-w-[150px]" title={currentUser.email || ""}>
                              {currentUser.email}
                            </span>
                          </span>
                          <button
                            onClick={async () => {
                              audio.playLensTick();
                              await logout();
                            }}
                            className="text-red-400 hover:text-red-500 transition-colors uppercase text-[9px] cursor-pointer flex items-center gap-1 shrink-0"
                          >
                            <LogOut className="w-3 h-3" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          audio.playShutterClick();
                          setIsMenuOpen(false);
                          if (currentUser && currentUser.email === ADMIN_EMAIL) {
                            setIsStudioOpen(true);
                          } else {
                            setIsAuthModalOpen(true);
                          }
                        }}
                        onMouseEnter={() => audio.playLensTick()}
                        className="px-5 py-3 rounded-xl border border-gold/40 hover:border-gold bg-gold/5 hover:bg-gold hover:text-black-pure text-gold transition-all duration-350 flex items-center justify-center gap-2.5 cursor-pointer font-mono text-[10px] tracking-[0.15em] uppercase shadow-lg shadow-gold/2 w-full animate-pulse hover:animate-none"
                      >
                        <Settings className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "6s" }} />
                        <span>
                          {currentUser && currentUser.email === ADMIN_EMAIL ? "Launch Studio Panel" : "Launch Studio Panel"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Close Button top-right */}
                <button
                  onClick={() => {
                    audio.playShutterClick();
                    setIsMenuOpen(false);
                  }}
                  onMouseEnter={() => audio.playLensTick()}
                  className="absolute top-6 right-6 w-11 h-11 rounded-full bg-neutral-900 border border-neutral-800 text-white-pure hover:bg-gold hover:text-black-pure flex items-center justify-center transition-colors shadow-2xl cursor-pointer z-[1000]"
                  title="Close index"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3. IMMERSIVE 3D HERO SECTION */}
          <section
            id="hero"
            ref={heroRef}
            onMouseMove={handleHeroMouseMove}
            onMouseLeave={() => setMouseOffsets({ x: 0, y: 0 })}
            className="relative h-screen flex flex-col justify-center items-center text-center overflow-hidden px-6"
          >
            {/* Visual background shadows/gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,15,15,0.45)_0%,rgba(0,0,0,0.95)_90%)] pointer-events-none z-10" />

            {/* FLOATING PHOTOGRAPHS (Tactile Memories Parallax Mesh) */}
            
            {/* Float Image 1: Fisherwoman Smile (Bottom-Left) */}
            <motion.div
              animate={{
                x: mouseOffsets.x * -1.4,
                y: mouseOffsets.y * -1.8,
              }}
              transition={{ type: "spring", damping: 30, stiffness: 100 }}
              className="absolute left-[5%] bottom-[12%] w-[150px] sm:w-[240px] aspect-[3/4] opacity-55 hover:opacity-100 hover:z-20 transition-opacity duration-350 z-0 group hidden md:block"
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden border border-neutral-900 bg-neutral-950 shadow-2xl skew-y-3 group-hover:skew-y-0 transition-transform duration-700">
                <img
                  src="https://images.unsplash.com/photo-1621215112102-2fe68b9db8d7?auto=format&fit=crop&w=500&q=80"
                  alt=""
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1.2s]"
                />
                <div className="absolute bottom-3 left-3 bg-neutral-950/70 border border-neutral-800 rounded px-1.5 py-0.5 text-[8px] font-mono text-gold tracking-widest uppercase">
                  Malpe Harbor &middot; raw
                </div>
              </div>
            </motion.div>

            {/* Float Image 2: Eagle on Rigging (Top-Right) */}
            <motion.div
              animate={{
                x: mouseOffsets.x * 1.6,
                y: mouseOffsets.y * 1.3,
              }}
              transition={{ type: "spring", damping: 35, stiffness: 90 }}
              className="absolute right-[6%] top-[14%] w-[160px] sm:w-[230px] aspect-[4/3] opacity-50 hover:opacity-100 hover:z-20 transition-opacity duration-350 z-0 group hidden md:block"
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden border border-neutral-900 bg-neutral-950 shadow-2xl -rotate-2 group-hover:rotate-0 transition-transform duration-700">
                <img
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=500&q=80"
                  alt=""
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1.2s]"
                />
                <div className="absolute bottom-3 right-3 bg-neutral-950/70 border border-neutral-800 rounded px-1.5 py-0.5 text-[8px] font-mono text-gold tracking-widest uppercase">
                  Backwater Flight &middot; manual
                </div>
              </div>
            </motion.div>

            {/* Float Image 3: Sailfish pattern (Top-Left, subtle) */}
            <motion.div
              animate={{
                x: mouseOffsets.x * -0.9,
                y: mouseOffsets.y * -0.9,
              }}
              transition={{ type: "spring", damping: 28, stiffness: 120 }}
              className="absolute left-[8%] top-[16%] w-[130px] sm:w-[200px] aspect-[3/4.5] opacity-35 hover:opacity-85 hover:z-20 transition-opacity duration-350 z-0 group hidden md:block"
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden border border-neutral-900/60 bg-neutral-950 rotate-3 group-hover:rotate-0 transition-transform duration-700">
                <img
                  src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=500&q=80"
                  alt=""
                  className="w-full h-full object-cover grayscale select-none pointer-events-none"
                />
              </div>
            </motion.div>

            {/* Float Image 4: Bengaluru Live Stage (Bottom-Right) */}
            <motion.div
              animate={{
                x: mouseOffsets.x * 1.2,
                y: mouseOffsets.y * 1.5,
              }}
              transition={{ type: "spring", damping: 30, stiffness: 110 }}
              className="absolute right-[8%] bottom-[15%] w-[180px] sm:w-[250px] aspect-[4/3] opacity-45 hover:opacity-100 hover:z-20 transition-opacity duration-350 z-0 group hidden md:block"
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden border border-neutral-900 bg-neutral-950 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-700">
                <img
                  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=500&q=80"
                  alt=""
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1.2s]"
                />
                <div className="absolute top-3 left-3 bg-neutral-950/70 border border-neutral-800 rounded px-1.5 py-0.5 text-[8px] font-mono text-gold tracking-widest uppercase">
                  Scholar Z Fest &middot; concert
                </div>
              </div>
            </motion.div>

            {/* Central Typography Typography Structure */}
            <div className="relative z-10 max-w-4xl px-4 flex flex-col items-center">
              {/* Motto Quote from Elias Thorne design layout - applied to Sreekar's profile */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="italic font-serif text-base sm:text-lg text-white-soft/50 mb-8 border-l-2 border-gold pl-5 text-left max-w-lg leading-relaxed select-none"
              >
                &ldquo;Some people press a shutter click. <br className="hidden sm:inline" />
                I preserve moments that time can never recreate.&rdquo;
              </motion.p>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-4xl sm:text-7xl lg:text-8xl text-white-pure tracking-tight leading-none text-center"
              >
                Stories Hidden<br />
                <span className="font-serif italic font-light text-gold text-center">
                  Between Moments
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.8 }}
                className="text-gray-soft text-sm sm:text-lg max-w-xl mt-6 leading-relaxed font-light text-center"
              >
                Capturing authentic emotions, journeys, coastal cultures, and fleeting light through the art of quiet visual storytelling.
              </motion.p>

              {/* Action Trigger Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 1 }}
                className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center"
              >
                <button
                  onClick={() => openVisualSection("gallery")}
                  onMouseEnter={() => audio.playLensTick()}
                  className="px-8 py-3.5 bg-gold text-black-pure font-mono text-xs tracking-widest uppercase hover:bg-transparent hover:text-gold border border-gold rounded-full transition-all duration-350 cursor-pointer shadow-lg w-48 sm:w-auto"
                >
                  Explore My World
                </button>
                <button
                  onClick={() => openVisualSection("stories")}
                  onMouseEnter={() => audio.playLensTick()}
                  className="px-8 py-3.5 bg-transparent text-white-pure hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-750 font-mono text-xs tracking-widest uppercase rounded-full transition-all duration-350 cursor-pointer w-48 sm:w-auto"
                >
                  View Signature Chapters
                </button>
              </motion.div>
            </div>

            {/* Elegant Dark Footer metadata overlay within Hero */}
            <div className="absolute bottom-[110px] left-14 right-14 hidden xl:flex justify-between items-center z-20 select-none">
              <div className="flex items-center space-x-12 text-left">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">Active Office</span>
                  <span className="text-[11px] font-serif text-white-pure">Bengaluru / Coastal Karnataka</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">Current Capture</span>
                  <span className="text-[11px] font-serif text-gold">Malpe Harbour Documentary</span>
                </div>
                <div className="flex items-center space-x-3.5 border-l border-white/10 pl-12">
                  <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">In Field: Recording Now</span>
                </div>
              </div>

              <div className="flex space-x-6 grayscale opacity-40 hover:opacity-100 transition-all duration-350">
                <div className="h-8 px-4 border border-white/15 flex items-center justify-center text-[8px] font-mono uppercase tracking-widest text-white-pure">Nikon DSLR Setup</div>
                <div className="h-8 px-4 border border-white/15 flex items-center justify-center text-[8px] font-mono uppercase tracking-widest text-[#D4AF37]">Scholar Z Chief</div>
              </div>
            </div>

            {/* Scroll Indicator Prompt */}
            <div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-gray-soft/40 cursor-pointer hover:text-gold transition-colors duration-400 select-none z-10"
              onClick={() => openVisualSection("about")}
            >
              <span>DESCEND TO THE PIER</span>
              <div className="w-px h-10 bg-gradient-to-b from-gold to-transparent animate-bounce mt-1" />
            </div>
          </section>

          {/* 4. ABOUT THE ARTIST VISUAL CHAPTER */}
          <section id="about" className="relative bg-black-pure py-32 border-t border-neutral-900 font-sans">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(212,175,55,0.015)_0%,rgba(0,0,0,1)_90%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                
                {/* Horizontal Film Strip Mockup (Left 5 cols) */}
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-2xl overflow-hidden aspect-[3/4] border border-neutral-900 bg-neutral-950 shadow-2xl glass-panel p-4 pb-14">
                    
                    {/* Visual sprocket holes mimicking slide film strip borders */}
                    <div className="absolute top-4 bottom-4 left-4 w-3.5 flex flex-col justify-between opacity-30 select-none">
                      {[...Array(14)].map((_, i) => (
                        <div key={i} className="w-2.5 h-3 bg-black-pure border border-neutral-850 rounded-sm" />
                      ))}
                    </div>

                    <div className="pl-8 pr-1 w-full h-full relative overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"
                        alt="Sreekar holding manual lens"
                        className="w-full h-full object-cover rounded-xl grayscale filter contrast-[1.05]"
                      />
                      <div className="absolute bottom-4 left-10 font-mono text-[9px] text-gray-soft/40">
                        FILM STRIP INDEX: SR2025/MANIPAL
                      </div>
                    </div>
                  </div>

                  {/* Absolute positioning marker coordinates */}
                  <div className="absolute -bottom-6 -right-6 bg-neutral-950/90 border border-neutral-800 p-4 rounded-xl flex items-center gap-3.5 shadow-2xl z-20">
                    <div className="w-2 h-2 rounded bg-gold animate-ping" />
                    <div>
                      <h4 className="font-mono text-[10px] text-gold uppercase tracking-wider">Active Location</h4>
                      <p className="font-serif text-sm text-white-pure">Bengaluru Office</p>
                    </div>
                  </div>
                </div>

                {/* Detailed narrative (Right 7 cols) */}
                <div className="lg:col-span-7 h-full flex flex-col justify-center">
                  <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-3">Narrative Profile</p>
                  
                  <h2 className="font-serif text-3xl sm:text-5xl text-white-pure tracking-tight leading-extratight">
                    From a 7th-Grade Smartphone<br />
                    <span className="font-serif italic font-light text-gold">
                      To Chasing Coastal Light
                    </span>
                  </h2>

                  <div className="h-px bg-neutral-900 my-8 w-1/3" />

                  <div className="space-y-6 text-gray-soft text-sm sm:text-base leading-relaxed font-light font-sans">
                    <p>
                      My obsession with photography wasn&rsquo;t sparked in a university lecture block or under high-budget studio lights. It started in the <strong>7th grade</strong>, armed with nothing but a basic smartphone, bad focus locks, and infinite curiosity.
                    </p>
                    <p>
                      I am entirely <strong>self-taught</strong>. I spent years conducting hands-on trial-and-error setups, reading exposure coordinates inside high-noon shadows, and following creative tutorials. I treat a camera not as an instrument of recording, but as an active translator.
                    </p>
                    <p>
                      Over the years, this path grew. I stepped into brand marketing, commercial visual guidelines during a cycle under <strong>SS Digital</strong>, professional fashion model portfolios, and fast-action event coverage. Today, I lead events visual coverage as <strong>Chief Event Photographer for Scholar Z</strong>, Bengaluru.
                    </p>
                    <p>
                      But when I desire to feel grounded, I return to South India&rsquo;s liquid borders: the active piers, the fish processing halls, and the morning fog of the <strong>Malpe Harbour</strong> community. There, where language is completely useless, the lens is where we understand each other.
                    </p>
                  </div>

                  {/* Statistics metrics display */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-neutral-900/60 font-serif">
                    <div>
                      <span className="block text-2xl sm:text-3xl text-gold">2025</span>
                      <span className="block text-[10px] font-mono text-gray-soft/40 uppercase tracking-widest mt-1">Scholar Z</span>
                    </div>
                    <div>
                      <span className="block text-2xl sm:text-3xl text-gold">14+</span>
                      <span className="block text-[10px] font-mono text-gray-soft/40 uppercase tracking-widest mt-1">Live Events</span>
                    </div>
                    <div>
                      <span className="block text-2xl sm:text-3xl text-gold">Malpe</span>
                      <span className="block text-[10px] font-mono text-gray-soft/40 uppercase tracking-widest mt-1">HALLMARK DOC</span>
                    </div>
                    <div>
                      <span className="block text-2xl sm:text-3xl text-gold">Self</span>
                      <span className="block text-[10px] font-mono text-gray-soft/40 uppercase tracking-widest mt-1">TAUGHT OBSESSION</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Collaborator Carousel Banner */}
          <div className="py-16 bg-neutral-950/80 border-t border-b border-neutral-900/60 relative overflow-hidden select-none">
            <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-wrap justify-between items-center gap-10 opacity-40 grayscale select-none pointer-events-none">
              <span className="font-serif text-lg sm:text-2xl tracking-[0.15em] text-white-pure">SCHOLAR Z</span>
              <span className="font-serif text-lg sm:text-2xl tracking-[0.15em] text-white-pure">SS DIGITAL</span>
              <span className="font-serif text-lg sm:text-2xl tracking-[0.15em] text-white-pure">LIVE EVENTS</span>
              <span className="font-serif text-lg sm:text-2xl tracking-[0.15em] text-white-pure">COASTAL CO-OP</span>
            </div>
          </div>

          {/* 5. Scenic Stories Section */}
          <ScenicStories />

          {/* 6. Signature Works Masonry Gallery */}
          <SignatureGallery />

          {/* 7. Memory Wall Interactive Polaroids */}
          <MemoryWall />

          {/* 8. Interactive Location Cartography */}
          <WorldLensMap />

          {/* 9. Milestones Backlit cards & Gear check */}
          <AwardsSection />

          {/* 10. Contact starry experience */}
          <ContactSection />

           {/* Creator Studio dynamic modal overlay 
          <CreatorStudio isOpen={isStudioOpen} onClose={() => setIsStudioOpen(false)} /> */}

          {/* Owner Google authentication gatekeeper modal */}
         <OwnerAuthModal 
  isOpen={isAuthModalOpen} 
  onClose={() => setIsAuthModalOpen(false)} 
  currentUser={currentUser}
  onAuthSuccess={() => {
    setIsAuthModalOpen(false);
    setIsStudioOpen(true);
  }}
/>

          {/* Footer Ledger */}
          <footer className="bg-black-pure border-t border-neutral-950 py-16 text-center select-none font-sans relative z-10">
            <div className="max-w-xl mx-auto px-6 flex flex-col items-center">
              <div className="font-serif text-xl tracking-[0.2em] text-white-pure mb-4 uppercase">
                SREEKAR <span className="text-gold">RAJU</span>
              </div>
              <p className="text-[10px] font-mono text-gray-soft/40 uppercase tracking-[0.25em] leading-relaxed">
                Visual Storyteller &middot; Bengaluru &middot; Coastal Karnataka
              </p>
              <div className="h-px bg-neutral-900/60 w-12 my-6" />
              <p className="text-[11px] text-gray-soft/45 font-light leading-relaxed max-w-sm">
                &copy; {new Date().getFullYear()} Sreekar Raju. All rights reserved. Every photograph has a narrative, and every conversation is a bridge.
              </p>
            </div>
          </footer>

        </motion.div>
      )}

    </div>
  );
}
