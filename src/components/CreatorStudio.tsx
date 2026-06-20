import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { storage } from "../utils/storage";
import { PhotoItem, DocumentaryStory, MemoryPin, TravelLocation, Milestone } from "../types";
import { audio } from "../utils/audio";
import { auth, ADMIN_EMAIL } from "../utils/firebase";
import { 
  X, Save, RotateCcw, Image, Heart, MapPin, 
  Calendar, Layers, Sparkles, AlertCircle, Plus, Trash2, 
  Settings, Check, Upload, HelpCircle, ShieldCheck, ShieldAlert 
} from "lucide-react";

interface CreatorStudioProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatorStudio({ isOpen, onClose }: CreatorStudioProps) {
  const [activeTab, setActiveTab] = useState<"photos" | "events" | "memories" | "map">("photos");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [stories, setStories] = useState<DocumentaryStory[]>([]);
  const [memories, setMemories] = useState<MemoryPin[]>([]);
  const [locations, setLocations] = useState<TravelLocation[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Feedback notifications
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthChange = () => {
      const user = auth.currentUser;
      setIsAdmin(!!user && user.email === ADMIN_EMAIL);
    };
    handleAuthChange();
    const unsubscribe = auth.onAuthStateChanged(handleAuthChange);
    return () => unsubscribe();
  }, []);

  // Loading existing data on mount / open
  useEffect(() => {
    if (isOpen) {
      setPhotos(storage.getPhotos());
      setStories(storage.getStories());
      setMemories(storage.getMemoryPins());
      setLocations(storage.getLocations());
    }
  }, [isOpen]);

  const showToast = (message: string) => {
    audio.playShutterClick();
    setToastMsg(message);
    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };

  // Safe reset to custom preset default
  const handleReset = () => {
    if (confirm("Are you sure you want to reset all data back to the default portfolio values? This will clear any custom uploads.")) {
      storage.resetAll();
      setPhotos(storage.getPhotos());
      setStories(storage.getStories());
      setMemories(storage.getMemoryPins());
      setLocations(storage.getLocations());
      showToast("Portfolio data restored to default preset profiles");
    }
  };

  // --- Image Upload Helper ---
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldSetter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        fieldSetter(reader.result as string);
        showToast("Image loaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  // --- PHOTO OPERATIONS ---
  const [newPhoto, setNewPhoto] = useState<Partial<PhotoItem>>({
    url: "",
    title: "",
    category: "Portrait",
    description: "",
    location: "",
    isBW: false
  });

  const addPhotoItem = () => {
    if (!newPhoto.url || !newPhoto.title) {
      alert("Please provide at least a photo title and image URL/File.");
      return;
    }
    const created: PhotoItem = {
      id: "photo-" + Date.now(),
      url: newPhoto.url,
      title: newPhoto.title,
      category: newPhoto.category as any || "Portrait",
      description: newPhoto.description || "Captured Sreekar Portfolio study",
      location: newPhoto.location || "Bengaluru",
      isBW: !!newPhoto.isBW
    };

    const updated = [created, ...photos];
    setPhotos(updated);
    storage.savePhotos(updated);
    showToast(`Added picture: "${newPhoto.title}"`);
    // Clear state
    setNewPhoto({
      url: "",
      title: "",
      category: "Portrait",
      description: "",
      location: "",
      isBW: false
    });
  };

  const deletePhotoItem = (id: string, name: string) => {
    if (confirm(`Delete photographic frame "${name}"?`)) {
      const updated = photos.filter(p => p.id !== id);
      setPhotos(updated);
      storage.savePhotos(updated);
      showToast(`Removed "${name}"`);
    }
  };

  // --- EVENT STORY OPERATIONS ---
  const [newEvent, setNewEvent] = useState({
    title: "",
    subtitle: "",
    category: "Event Portfolio",
    coverImage: "",
    emotionalQuote: "",
    location: "",
    releaseYear: "2026",
    timelineLabel: "Event Study",
    descriptionText: ""
  });

  const addEventStory = () => {
    if (!newEvent.title || !newEvent.coverImage) {
      alert("Please provide the event title and a cover image source!");
      return;
    }
    const createdStories: DocumentaryStory = {
      id: "story-" + Date.now(),
      title: newEvent.title,
      subtitle: newEvent.subtitle || "Exploring authentic visual narratives.",
      category: newEvent.category,
      coverImage: newEvent.coverImage,
      emotionalQuote: newEvent.emotionalQuote || "A frame is capturing time that never repeats.",
      location: newEvent.location || "South India",
      releaseYear: newEvent.releaseYear,
      timelineLabel: newEvent.timelineLabel,
      descriptionBlocks: newEvent.descriptionText ? newEvent.descriptionText.split("\n\n") : ["Fresh event documented in detail"],
      featuredPhotos: photos.slice(0, 2) // Associate primary pictures automatically
    };

    const updated = [createdStories, ...stories];
    setStories(updated);
    storage.saveStories(updated);
    showToast(`Added event story: "${newEvent.title}"`);
    setNewEvent({
      title: "",
      subtitle: "",
      category: "Event Portfolio",
      coverImage: "",
      emotionalQuote: "",
      location: "",
      releaseYear: "2026",
      timelineLabel: "Event Study",
      descriptionText: ""
    });
  };

  const deleteEventStory = (id: string, title: string) => {
    if (confirm(`Delete the narrative chapter: "${title}"?`)) {
      const updated = stories.filter(s => s.id !== id);
      setStories(updated);
      storage.saveStories(updated);
      showToast(`Removed "${title}" narrative`);
    }
  };

  // --- MEMORY POLAROID OPERATIONS ---
  const [newMemory, setNewMemory] = useState({
    url: "",
    title: "",
    caption: "",
    stamp: "FIELD",
    date: ""
  });

  const addMemoryPin = () => {
    if (!newMemory.url || !newMemory.title) {
      alert("A title and image URL are required to pin this polaroid!");
      return;
    }
    // Random placement coordinate grids
    const randomRot = Math.floor(Math.random() * 14) - 7; // -7deg to 7deg
    const randomLeft = Math.floor(Math.random() * 65) + 10; // 10% to 75%
    const randomTop = Math.floor(Math.random() * 55) + 5; // 5% to 60%

    const created: MemoryPin = {
      id: "pin-" + Date.now(),
      url: newMemory.url,
      title: newMemory.title,
      caption: newMemory.caption || "An undocumented feeling captured in shadow.",
      stamp: newMemory.stamp.toUpperCase(),
      date: newMemory.date || new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase(),
      rotation: randomRot,
      left: randomLeft,
      top: randomTop
    };

    const updated = [created, ...memories];
    setMemories(updated);
    storage.saveMemoryPins(updated);
    showToast(`Pinned memory: "${newMemory.title}"`);
    setNewMemory({
      url: "",
      title: "",
      caption: "",
      stamp: "FIELD",
      date: ""
    });
  };

  const deleteMemoryPin = (id: string, title: string) => {
    if (confirm(`Unpin polarization piece "${title}" from grid?`)) {
      const updated = memories.filter(m => m.id !== id);
      setMemories(updated);
      storage.saveMemoryPins(updated);
      showToast(`Unpinned "${title}"`);
    }
  };

  // --- TRAVEL COORDINATES ON MAP ---
  const [newLoc, setNewLoc] = useState({
    name: "",
    x: 50,
    y: 50,
    status: "visited",
    shortStory: "",
    snippet: "",
    associatedImage: ""
  });

  const addLocationCoordinate = () => {
    if (!newLoc.name || !newLoc.associatedImage) {
      alert("Name and image are required!");
      return;
    }
    const created: TravelLocation = {
      id: "loc-" + Date.now(),
      name: newLoc.name,
      coordinates: { x: Number(newLoc.x), y: Number(newLoc.y) },
      labelPos: "bottom",
      status: newLoc.status as any,
      shortStory: newLoc.shortStory || "Coastal Recording Station",
      snippet: newLoc.snippet || "New photographic study location added.",
      associatedImage: newLoc.associatedImage
    };

    const updated = [created, ...locations];
    setLocations(updated);
    storage.saveLocations(updated);
    showToast(`Added coordinate pinpoint: "${newLoc.name}"`);
    setNewLoc({
      name: "",
      x: 50,
      y: 50,
      status: "visited",
      shortStory: "",
      snippet: "",
      associatedImage: ""
    });
  };

  const deleteLocationCoordinate = (id: string, name: string) => {
    if (confirm(`Delete GPS map coordinates for "${name}"?`)) {
      const updated = locations.filter(l => l.id !== id);
      setLocations(updated);
      storage.saveLocations(updated);
      showToast(`Deleted map coordinate "${name}"`);
    }
  };

  const tabs = [
    { id: "photos", label: "Signature Photos", desc: "Manage individual master frames rendered in the gallery and portfolio lists." },
    { id: "events", label: "Visited Events / Projects", desc: "Formulate large event journals, docu-covers, and high-energy fests you have photographed." },
    { id: "memories", label: "Memory Wall Journal", desc: "Pin digital Polaroid style notes, field stories, and candid snapshots onto your virtual corkboard." },
    { id: "map", label: "Photographic Map GPS", desc: "Chart geographical travel nodes with coordination markers mapped over Karnataka and South India." }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] bg-black-pure/95 backdrop-blur-md overflow-y-auto flex items-stretch md:justify-end text-white-pure font-sans"
        >
          {/* Main Backdrop closer element */}
          <div className="absolute inset-0 z-0" onClick={onClose} />

          {/* Toast Notification element */}
          <AnimatePresence>
            {toastMsg && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                className="fixed top-6 left-1/2 -translate-x-1/2 z-[1100] px-6 py-4 bg-neutral-900 border border-gold rounded-full shadow-[0_0_24px_rgba(212,175,55,0.15)] flex items-center space-x-3 text-gold text-xs font-mono tracking-widest uppercase select-none"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-gold animate-ping" />
                <span>{toastMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Panel Container (Slides out right) */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="relative z-10 w-full max-w-4xl bg-[#090a0d] border-l border-neutral-900 flex flex-col justify-between shadow-2xl h-screen select-none"
          >
            {/* Header section of Creator Studio */}
            <div className="p-6 border-b border-neutral-900 flex justify-between items-center bg-[#0d0e12]">
              <div>
                <span className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
                  <p className="font-mono text-[10px] text-gold tracking-[0.3em] uppercase">Control Panel</p>
                </span>
                <h2 className="font-serif text-2xl font-bold tracking-tight text-white-pure">
                  Sreekar's Portfolio Studio
                </h2>
              </div>

              <div className="flex items-center gap-4">
                {/* Reset button */}
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded border border-red-900/30 bg-red-950/20 hover:bg-red-950/40 text-[10px] text-red-400 font-mono tracking-widest uppercase cursor-pointer flex items-center gap-1.5 transition-colors"
                  title="Restore standard developer default profile presets"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Defaults</span>
                </button>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full border border-neutral-800 flex items-center justify-center text-white/50 hover:text-white-pure hover:border-white-pure/20 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Owner Auth status alert bar */}
            <div className={`px-6 py-2.5 flex items-center justify-between text-[10px] font-mono tracking-wider border-b border-neutral-900 ${isAdmin ? 'bg-gold/5 text-gold' : 'bg-red-950/10 text-red-400'}`}>
              <div className="flex items-center gap-2 overflow-hidden">
                {isAdmin ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-gold shrink-0 animate-pulse" />
                    <span className="truncate">AUTHENTICATED OWNER: {auth.currentUser?.email} (Cloud Sync Active)</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="truncate">DEMONSTRATION VIEWPORT (Read-Only): Login to {ADMIN_EMAIL} is required to apply adjustments to the cloud database.</span>
                  </>
                )}
              </div>
              <span className="text-[9px] text-gray-soft/40 hidden sm:block">SECURE GATEWAY</span>
            </div>

            {/* Middle Section: Layout split with Sidebar Navigation list */}
            <div className="flex-grow flex h-[calc(100vh-160px)] overflow-hidden">
              
              {/* Studio Tabs Navigation */}
              <div className="w-[180px] sm:w-[245px] border-r border-neutral-900 overflow-y-auto bg-[#07080b] p-3 space-y-1.5 flex flex-col">
                <span className="px-3 pb-2 pt-2 text-[9px] font-mono text-gray-soft/40 uppercase tracking-[0.25em] block">
                  Studio Assets
                </span>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      audio.playLensTick();
                      setActiveTab(tab.id as any);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl transition-all duration-300 text-xs flex flex-col justify-start gap-1 cursor-pointer select-none border ${
                      activeTab === tab.id
                        ? "bg-neutral-900/60 border-gold/35 text-gold"
                        : "bg-transparent border-transparent text-gray-soft hover:bg-neutral-950 hover:text-white-pure"
                    }`}
                  >
                    <span className="font-medium tracking-wide leading-none">{tab.label}</span>
                    <span className={`text-[9px] font-mono leading-relaxed truncate opacity-40 hover:opacity-100 hidden sm:block ${activeTab === tab.id ? 'text-gold' : 'text-gray-soft'}`}>
                      {tab.desc}
                    </span>
                  </button>
                ))}

                <div className="mt-auto p-4 bg-neutral-950/80 rounded-xl border border-neutral-900/60 m-2">
                  <div className="flex items-center space-x-2 text-gold mb-2">
                    <HelpCircle className="w-4 h-4" />
                    <span className="text-[10px] font-mono uppercase tracking-widest">Self Guide</span>
                  </div>
                  <p className="text-[10.5px] leading-relaxed text-gray-soft/60 font-light">
                    Add custom photos of events or travel visited, then click save. The applet re-renders live. You can upload files directly!
                  </p>
                </div>
              </div>

              {/* Dynamic Workspace Container */}
              <div className="flex-grow overflow-y-auto p-6 bg-[#08090c] custom-scrollbar text-left select-text">
                
                {/* 1. SIGNATURE PHOTOS WORKSPACE */}
                {activeTab === "photos" && (
                  <div className="space-y-8 animate-fade-in">
                    <div>
                      <h4 className="font-serif text-lg text-white-pure">Add New Photographic Frame</h4>
                      <p className="text-xs text-gray-soft/60 leading-relaxed font-light mt-1">
                        Insert a custom frame directly into your signature grid. You can upload an image file locally or paste a custom URL here.
                      </p>
                    </div>

                    {/* Photo Add Card Form */}
                    <div className="p-5 rounded-xl border border-neutral-900 bg-neutral-950 space-y-4 font-sans text-xs">
                      
                      {/* Image Source & Local File Loader */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">1. Web URL</label>
                          <input
                            type="text"
                            placeholder="Enter image web URL (e.g., Unsplash link)"
                            value={newPhoto.url}
                            onChange={(e) => setNewPhoto(prev => ({ ...prev, url: e.target.value }))}
                            className="w-full bg-[#111] border border-neutral-800 rounded p-2.5 outline-none focus:border-gold text-white-soft"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Or 2. Local File Upload</label>
                          <div className="relative w-full bg-[#111] border border-neutral-850 hover:border-gold/30 rounded p-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[38px]">
                            <Upload className="w-3.5 h-3.5 text-gray-soft" />
                            <span className="text-[10px] font-mono text-gray-soft truncate">
                              {newPhoto.url?.startsWith("data:") ? "✓ File base64 loaded" : "Upload Picture"}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload(e, (url) => setNewPhoto(prev => ({ ...prev, url })))}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Title & Category Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Photo Title</label>
                          <input
                            type="text"
                            placeholder="Frame Title / Subject (e.g., Coastal Sea Net)"
                            value={newPhoto.title}
                            onChange={(e) => setNewPhoto(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full bg-[#111] border border-neutral-800 rounded p-2.5 outline-none focus:border-gold text-white-soft"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Creative Category</label>
                          <select
                            value={newPhoto.category}
                            onChange={(e) => setNewPhoto(prev => ({ ...prev, category: e.target.value as any }))}
                            className="w-full bg-[#111] border border-neutral-800 rounded p-2.5 outline-none focus:border-gold text-white-soft"
                          >
                            <option value="Portrait">Portrait Study</option>
                            <option value="Documentary">Documentary</option>
                            <option value="Wildlife">Wildlife & Raptors</option>
                            <option value="Travel">Scenic Travel</option>
                            <option value="Concert">Concert / Event Portfolio</option>
                          </select>
                        </div>
                      </div>

                      {/* Exposure Details / Location */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Location</label>
                          <input
                            type="text"
                            placeholder="Manipal Backwaters, Bengaluru Fests, etc."
                            value={newPhoto.location}
                            onChange={(e) => setNewPhoto(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full bg-[#111] border border-neutral-800 rounded p-2.5 outline-none focus:border-gold text-white-soft"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Monochrome Style</label>
                          <div className="flex items-center space-x-2 mt-2 select-none cursor-pointer" onClick={() => setNewPhoto(prev => ({ ...prev, isBW: !prev.isBW }))}>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${newPhoto.isBW ? 'border-gold bg-gold text-black-pure' : 'border-neutral-700 bg-transparent'}`}>
                              {newPhoto.isBW && <Check className="w-3 h-3 text-current stroke-[3px]" />}
                            </div>
                            <span className="text-[11px] text-gray-soft font-mono">Simulate high-contrast Black & White filter</span>
                          </div>
                        </div>
                      </div>

                      {/* Short Behind The Scenes Description */}
                      <div>
                        <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Behind The Lens (Shot Story / Exposure specs)</label>
                        <textarea
                          placeholder="Detail the technical parameters (e.g., lens specs, 1/350s f/4) or emotional moment of capturing."
                          rows={2}
                          value={newPhoto.description}
                          onChange={(e) => setNewPhoto(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full bg-[#111] border border-neutral-800 rounded p-2.5 outline-none focus:border-gold text-white-soft font-light"
                        />
                      </div>

                      {/* Submit form */}
                      <button
                        onClick={addPhotoItem}
                        className="w-full py-3 rounded bg-gradient-to-r from-gold/90 to-[#b5942f] text-black-pure text-xs tracking-[0.2em] font-mono uppercase font-bold hover:scale-[1.01] transition-transform shadow-lg cursor-pointer"
                      >
                        Insert Into Signature Gallery
                      </button>
                    </div>

                    {/* Active list container */}
                    <div className="space-y-3">
                      <h5 className="font-mono text-[10px] uppercase tracking-widest text-gold text-left">Current Registered Frames ({photos.length})</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {photos.map((item) => (
                          <div key={item.id} className="flex gap-3 hover:bg-neutral-900 border border-neutral-900 p-2 rounded-lg relative group">
                            <img src={item.url} className={`w-14 h-14 object-cover rounded border border-neutral-800/80 ${item.isBW ? 'grayscale' : ''}`} alt="" />
                            <div className="overflow-hidden">
                              <h6 className="font-serif font-bold text-white-pure text-xs truncate">{item.title}</h6>
                              <span className="px-2 py-0.5 bg-neutral-900 rounded-full font-mono text-[8px] text-gold uppercase border border-neutral-800">{item.category}</span>
                              <p className="text-[9px] text-gray-soft/50 font-mono truncate mt-1">Loc: {item.location}</p>
                            </div>
                            <button
                              onClick={() => deletePhotoItem(item.id, item.title)}
                              className="absolute right-3 top-3 w-7 h-7 bg-red-950/20 border border-red-900/40 text-red-400 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer.svg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. VISITED EVENTS & PROJECTS WORKSPACE */}
                {activeTab === "events" && (
                  <div className="space-y-8 animate-fade-in">
                    <div>
                      <h4 className="font-serif text-lg text-white-pure">Document Visited Events / Concerts</h4>
                      <p className="text-xs text-gray-soft/60 leading-relaxed font-light mt-1">
                        Formulate full event projects (e.g. college concerts, fests, commercial programs) with title pages, descriptions, and location markers.
                      </p>
                    </div>

                    {/* Event Form */}
                    <div className="p-5 rounded-xl border border-neutral-900 bg-neutral-950 space-y-4 font-sans text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Event Title</label>
                          <input
                            type="text"
                            placeholder="e.g., Scholar Z Tech Fest Spark"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full bg-[#111] border border-neutral-800 rounded p-2.5 outline-none focus:border-gold text-white-soft"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Subtitle description</label>
                          <input
                            type="text"
                            placeholder="e.g., High shutter tracking under strobe lights"
                            value={newEvent.subtitle}
                            onChange={(e) => setNewEvent(prev => ({ ...prev, subtitle: e.target.value }))}
                            className="w-full bg-[#111] border border-neutral-800 rounded p-2.5 outline-none focus:border-gold text-white-soft"
                          />
                        </div>
                      </div>

                      {/* Cover upload / quote */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Cover Image (URL or uploaded file)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Image Link"
                              value={newEvent.coverImage}
                              onChange={(e) => setNewEvent(prev => ({ ...prev, coverImage: e.target.value }))}
                              className="w-full bg-[#111] border border-neutral-800 rounded p-2 outline-none focus:border-gold text-white-soft text-xs"
                            />
                            <div className="relative w-12 bg-neutral-900 hover:bg-gold/10 border border-neutral-800/80 rounded flex items-center justify-center cursor-pointer">
                              <Upload className="w-4 h-4 text-gray-soft" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handlePhotoUpload(e, (url) => setNewEvent(prev => ({ ...prev, coverImage: url })))}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Release Year</label>
                          <input
                            type="text"
                            placeholder="e.g., 2025"
                            value={newEvent.releaseYear}
                            onChange={(e) => setNewEvent(prev => ({ ...prev, releaseYear: e.target.value }))}
                            className="w-full bg-[#111] border border-neutral-800 rounded p-2.5 outline-none focus:border-gold text-white-soft"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Primary Location</label>
                          <input
                            type="text"
                            placeholder="e.g., Coastal Karnataka"
                            value={newEvent.location}
                            onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full bg-[#111] border border-neutral-800 rounded p-2.5 outline-none focus:border-gold text-white-soft"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Sensory Quote</label>
                          <input
                            type="text"
                            placeholder="e.g., Slid between speakers under bass strobes."
                            value={newEvent.emotionalQuote}
                            onChange={(e) => setNewEvent(prev => ({ ...prev, emotionalQuote: e.target.value }))}
                            className="w-full bg-[#111] border border-neutral-800 rounded p-2.5 outline-none focus:border-gold text-white-soft"
                          />
                        </div>
                      </div>

                      {/* Event description paragraphs */}
                      <div>
                        <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Narrative Blocks (Separate paragraphs by hitting enter twice)</label>
                        <textarea
                          placeholder="Draft full descriptions outlining what steps you went through at this event. Separate multiple paragraphs by hitting enter twice."
                          rows={3}
                          value={newEvent.descriptionText}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, descriptionText: e.target.value }))}
                          className="w-full bg-[#111] border border-neutral-800 rounded p-2.5 outline-none focus:border-gold text-white-soft font-light"
                        />
                      </div>

                      <button
                        onClick={addEventStory}
                        className="w-full py-3 rounded bg-gradient-to-r from-gold/90 to-[#b5942f] text-black-pure text-xs tracking-[0.2em] font-mono uppercase font-bold hover:scale-[1.01] transition-transform shadow-lg cursor-pointer"
                      >
                        Establish Event Narrative Study
                      </button>
                    </div>

                    {/* Active Projects List */}
                    <div className="space-y-3">
                      <h5 className="font-mono text-[10px] uppercase tracking-widest text-gold text-left">Active Event Chapters ({stories.length})</h5>
                      <div className="space-y-2">
                        {stories.map((story) => (
                          <div key={story.id} className="flex justify-between items-center bg-[#0d0e12] border border-neutral-900 p-3.5 rounded-xl group relative">
                            <div className="flex items-center gap-3.5">
                              <img src={story.coverImage} className="w-12 h-16 object-cover rounded-md" alt="" />
                              <div>
                                <h6 className="font-serif font-bold text-white-pure text-sm">{story.title}</h6>
                                <p className="text-[10.5px] text-gray-soft/40 font-mono mt-0.5">{story.location} &middot; {story.releaseYear}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => deleteEventStory(story.id, story.title)}
                              className="w-8 h-8 rounded-lg bg-red-950/20 text-red-500 hover:bg-red-900/30 font-mono flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. MEMORY WALL JOURNAL WORKSPACE */}
                {activeTab === "memories" && (
                  <div className="space-y-8 animate-fade-in">
                    <div>
                      <h4 className="font-serif text-lg text-white-pure">Pin Pinned Polaroid Memories</h4>
                      <p className="text-xs text-gray-soft/60 leading-relaxed font-light mt-1">
                        Add digital Polaroids with snapshots, custom locations, stamps, and dates that can be dragged and flipped on Sreekar's interactive board.
                      </p>
                    </div>

                    {/* Polaroid add card form */}
                    <div className="p-5 rounded-xl border border-neutral-900 bg-neutral-950 space-y-4 font-sans text-xs">
                      
                      {/* Image sources */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Polaroid Image Web URL</label>
                          <input
                            type="text"
                            placeholder="Paste image link"
                            value={newMemory.url}
                            onChange={(e) => setNewMemory(prev => ({ ...prev, url: e.target.value }))}
                            className="w-full bg-[#111] border border-neutral-800 rounded p-2.5 outline-none focus:border-gold text-white-soft"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Or Upload Polaroid File</label>
                          <div className="relative w-full bg-[#111] border border-neutral-850 hover:border-gold/30 rounded p-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[38px]">
                            <Upload className="w-3.5 h-3.5 text-gray-soft" />
                            <span className="text-[10px] font-mono text-gray-soft truncate">
                              {newMemory.url?.startsWith("data:") ? "✓ File uploaded" : "Upload Snapshot"}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload(e, (url) => setNewMemory(prev => ({ ...prev, url })))}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Polaroid details row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Polaroid Title</label>
                          <input
                            type="text"
                            placeholder="e.g., Malpe Harbor Morning"
                            value={newMemory.title}
                            onChange={(e) => setNewMemory(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full bg-[#111] border border-neutral-800 rounded p-2.5 outline-none focus:border-gold text-white-soft"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Memory Stamp (Tag)</label>
                          <select
                            value={newMemory.stamp}
                            onChange={(e) => setNewMemory(prev => ({ ...prev, stamp: e.target.value }))}
                            className="w-full bg-[#111] border border-neutral-800 rounded p-2.5 outline-none focus:border-gold text-white-soft"
                          >
                            <option value="HARB-01">HARB-01 (Harbour study)</option>
                            <option value="WILD-04">WILD-04 (Raptor/Wildlife)</option>
                            <option value="ST-MARY">ST-MARY (St Mary Rocks)</option>
                            <option value="SOUTH-IN">SOUTH-IN (South Travel)</option>
                            <option value="GEAR-REF">GEAR-REF (Camera setup)</option>
                            <option value="FIELD">FIELD (General Field Notes)</option>
                          </select>
                        </div>
                      </div>

                      {/* Caption & Date */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Date Marked</label>
                          <input
                            type="text"
                            placeholder="e.g., MAR 12, 2025"
                            value={newMemory.date}
                            onChange={(e) => setNewMemory(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full bg-[#111] border border-neutral-800 rounded p-2.5 outline-none focus:border-gold text-white-soft"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Polaroid ink note caption</label>
                          <input
                            type="text"
                            placeholder="Short ink style handwritten caption note..."
                            value={newMemory.caption}
                            onChange={(e) => setNewMemory(prev => ({ ...prev, caption: e.target.value }))}
                            className="w-full bg-[#111] border border-neutral-800 rounded p-2.5 outline-none focus:border-gold text-white-soft"
                          />
                        </div>
                      </div>

                      <button
                        onClick={addMemoryPin}
                        className="w-full py-3 rounded bg-gradient-to-r from-gold/90 to-[#b5942f] text-black-pure text-xs tracking-[0.2em] font-mono uppercase font-bold hover:scale-[1.01] transition-transform shadow-lg cursor-pointer"
                      >
                        Pin Polaroid onto Memory Board
                      </button>
                    </div>

                    {/* Active memories rendered list */}
                    <div className="space-y-3">
                      <h5 className="font-mono text-[10px] uppercase tracking-widest text-gold text-left">Pinned Board Polaroids ({memories.length})</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {memories.map((m) => (
                          <div key={m.id} className="flex gap-3 hover:bg-neutral-900 border border-neutral-900 p-2 rounded-lg relative group">
                            <img src={m.url} className="w-14 h-14 object-cover rounded border border-neutral-800/80" alt="" />
                            <div className="overflow-hidden">
                              <h6 className="font-serif font-bold text-white-pure text-xs truncate">{m.title}</h6>
                              <p className="text-[9.5px] text-gray-soft/60 italic truncate mt-0.5">"{m.caption}"</p>
                              <span className="font-mono text-[8px] text-gold/85 mt-2 block">{m.stamp} &middot; {m.date}</span>
                            </div>
                            <button
                              onClick={() => deleteMemoryPin(m.id, m.title)}
                              className="absolute right-2 top-2 w-7 h-7 bg-red-950/20 text-red-500 rounded flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. GPS MAP COORDINATES WORKSPACE */}
                {activeTab === "map" && (
                  <div className="space-y-8 animate-fade-in">
                    <div>
                      <h4 className="font-serif text-lg text-white-pure">Chart GPS Travel Coordinates Map</h4>
                      <p className="text-xs text-gray-soft/60 leading-relaxed font-light mt-1">
                        Place coordinates dynamically of geographical locations you have visited and associate popup cards containing summary texts & photographic records.
                      </p>
                    </div>

                    {/* Map nodes forms */}
                    <div className="p-5 rounded-xl border border-neutral-900 bg-neutral-950 space-y-4 font-sans text-xs">
                      
                      {/* Name & Coordinates */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Pinpoint Name</label>
                          <input
                            type="text"
                            placeholder="e.g., Someshawar beach"
                            value={newLoc.name}
                            onChange={(e) => setNewLoc(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-[#111] border border-neutral-800 rounded p-2.5 outline-none focus:border-gold text-white-soft"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">X axis coord (1% to 99%)</label>
                          <input
                            type="number"
                            min="1"
                            max="99"
                            value={newLoc.x}
                            onChange={(e) => setNewLoc(prev => ({ ...prev, x: Number(e.target.value) }))}
                            className="w-full bg-[#111] border border-neutral-800 rounded p-2.5 outline-none focus:border-gold text-white-soft font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Y axis coord (1% to 99%)</label>
                          <input
                            type="number"
                            min="1"
                            max="99"
                            value={newLoc.y}
                            onChange={(e) => setNewLoc(prev => ({ ...prev, y: Number(e.target.value) }))}
                            className="w-full bg-[#111] border border-neutral-800 rounded p-2.5 outline-none focus:border-gold text-white-soft font-mono"
                          />
                        </div>
                      </div>

                      {/* Map status and Image */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Node Photographic Record (URL or upload file)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Image Link"
                              value={newLoc.associatedImage}
                              onChange={(e) => setNewLoc(prev => ({ ...prev, associatedImage: e.target.value }))}
                              className="w-full bg-[#111] border border-neutral-800 rounded p-2 outline-none focus:border-gold text-white-soft text-xs"
                            />
                            <div className="relative w-12 bg-neutral-900 hover:bg-gold/10 border border-neutral-800/80 rounded flex items-center justify-center cursor-pointer">
                              <Upload className="w-4 h-4 text-gray-soft" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handlePhotoUpload(e, (url) => setNewLoc(prev => ({ ...prev, associatedImage: url })))}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Exploration Status</label>
                          <select
                            value={newLoc.status}
                            onChange={(e) => setNewLoc(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full bg-[#111] border border-neutral-800 rounded p-2.5 outline-none focus:border-gold text-white-soft"
                          >
                            <option value="visited">Visited (Archived studies completed)</option>
                            <option value="active">Active Spot (Working currently)</option>
                            <option value="exploring">Exploring (Gathering pre-production data)</option>
                          </select>
                        </div>
                      </div>

                      {/* Stories snip and details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Short Story title</label>
                          <input
                            type="text"
                            placeholder="e.g., Waves & Fisherman Study"
                            value={newLoc.shortStory}
                            onChange={(e) => setNewLoc(prev => ({ ...prev, shortStory: e.target.value }))}
                            className="w-full bg-[#111] border border-neutral-800 rounded p-2.5 outline-none focus:border-gold text-white-soft"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1.5">Exploration Snapshot text snippet</label>
                          <input
                            type="text"
                            placeholder="e.g., Spent days capturing fishermen sorting ice cubes..."
                            value={newLoc.snippet}
                            onChange={(e) => setNewLoc(prev => ({ ...prev, snippet: e.target.value }))}
                            className="w-full bg-[#111] border border-neutral-800 rounded p-2.5 outline-none focus:border-gold text-white-soft font-light"
                          />
                        </div>
                      </div>

                      <button
                        onClick={addLocationCoordinate}
                        className="w-full py-3 rounded bg-gradient-to-r from-gold/90 to-[#b5942f] text-black-pure text-xs tracking-[0.2em] font-mono uppercase font-bold hover:scale-[1.01] transition-transform shadow-lg cursor-pointer"
                      >
                        Pin Geographical Marker
                      </button>
                    </div>

                    {/* Active coordinates lists */}
                    <div className="space-y-3">
                      <h5 className="font-mono text-[10px] uppercase tracking-widest text-gold text-left">Active Geographical Markers ({locations.length})</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {locations.map((loc) => (
                          <div key={loc.id} className="flex gap-3 hover:bg-neutral-900 border border-neutral-900 p-2.5 rounded-xl relative group">
                            <img src={loc.associatedImage} className="w-12 h-12 object-cover rounded-md" alt="" />
                            <div className="overflow-hidden">
                              <h6 className="font-serif font-bold text-white-pure text-xs">{loc.name}</h6>
                              <p className="text-[9px] text-gray-soft/40 font-mono mt-0.5">X: {loc.coordinates.x}% &middot; Y: {loc.coordinates.y}%</p>
                              <span className="text-[9.5px] italic text-gold block truncate">"{loc.shortStory}"</span>
                            </div>
                            <button
                              onClick={() => deleteLocationCoordinate(loc.id, loc.name)}
                              className="absolute right-2 top-2 w-7 h-7 bg-red-950/20 text-red-500 rounded flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Bottom confirmation footer info */}
            <div className="p-4 sm:p-5 border-t border-neutral-900 bg-[#0d0e12] flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono tracking-wider uppercase text-gray-soft/40 select-none gap-2">
              <span>Sreekar Raju &para; Studio Engine v3.0</span>
              <span className="text-gold animate-pulse">Save instantly &middot; Data local to browser</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
