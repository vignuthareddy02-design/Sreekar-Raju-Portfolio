import { PhotoItem, DocumentaryStory, MemoryPin, TravelLocation, Milestone, GearItem } from "../types";
import { signaturePhotos, documentaryStories, memoryWallPins, mapLocations, achievementsTimeline, gearInventory } from "../data";
import { db } from "./firebase";
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc,
  writeBatch
} from "firebase/firestore";

// Cache fallback keys for local client storage to prevent flash of empty states
const KEYS = {
  PHOTOS: "sreekar_portfolio_photos",
  STORIES: "sreekar_portfolio_stories",
  MEMORIES: "sreekar_portfolio_memories",
  LOCATIONS: "sreekar_portfolio_locations",
  TIMELINE: "sreekar_portfolio_timeline",
  GEAR: "sreekar_portfolio_gear"
};

// In-memory runtime lists initialized with localstorage backups or default portfolios
let cachePhotos: PhotoItem[] = getLocalBackup(KEYS.PHOTOS, signaturePhotos);
let cacheStories: DocumentaryStory[] = getLocalBackup(KEYS.STORIES, documentaryStories);
let cacheMemories: MemoryPin[] = getLocalBackup(KEYS.MEMORIES, memoryWallPins);
let cacheLocations: TravelLocation[] = getLocalBackup(KEYS.LOCATIONS, mapLocations);
let cacheTimeline: Milestone[] = getLocalBackup(KEYS.TIMELINE, achievementsTimeline);
let cacheGear: GearItem[] = getLocalBackup(KEYS.GEAR, gearInventory);

function getLocalBackup<T>(key: string, defaults: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaults;
  } catch {
    return defaults;
  }
}

function saveLocalBackup(key: string, data: any) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error("Local caching failed:", err);
  }
}

// Subscribe to real-time events on Firestore to synchronize with clinical accuracy
let isFirestoreInitialized = {
  photos: false,
  stories: false,
  memories: false,
  locations: false,
  timeline: false,
  gear: false
};

// Listeners
onSnapshot(collection(db, "photos"), (snap) => {
  if (!snap.empty) {
    const list: PhotoItem[] = [];
    snap.forEach(d => list.push({ ...d.data(), id: d.id } as PhotoItem));
    cachePhotos = list;
    saveLocalBackup(KEYS.PHOTOS, list);
    window.dispatchEvent(new Event("portfolio_updated"));
  }
  isFirestoreInitialized.photos = true;
});

onSnapshot(collection(db, "stories"), (snap) => {
  if (!snap.empty) {
    const list: DocumentaryStory[] = [];
    snap.forEach(d => list.push({ ...d.data(), id: d.id } as DocumentaryStory));
    cacheStories = list;
    saveLocalBackup(KEYS.STORIES, list);
    window.dispatchEvent(new Event("portfolio_updated"));
  }
  isFirestoreInitialized.stories = true;
});

onSnapshot(collection(db, "memories"), (snap) => {
  if (!snap.empty) {
    const list: MemoryPin[] = [];
    snap.forEach(d => list.push({ ...d.data(), id: d.id } as MemoryPin));
    cacheMemories = list;
    saveLocalBackup(KEYS.MEMORIES, list);
    window.dispatchEvent(new Event("portfolio_updated"));
  }
  isFirestoreInitialized.memories = true;
});

onSnapshot(collection(db, "locations"), (snap) => {
  if (!snap.empty) {
    const list: TravelLocation[] = [];
    snap.forEach(d => list.push({ ...d.data(), id: d.id } as TravelLocation));
    cacheLocations = list;
    saveLocalBackup(KEYS.LOCATIONS, list);
    window.dispatchEvent(new Event("portfolio_updated"));
  }
  isFirestoreInitialized.locations = true;
});

onSnapshot(collection(db, "timeline"), (snap) => {
  if (!snap.empty) {
    const list: Milestone[] = [];
    snap.forEach(d => list.push({ ...d.data(), id: d.id } as Milestone));
    cacheTimeline = list;
    saveLocalBackup(KEYS.TIMELINE, list);
    window.dispatchEvent(new Event("portfolio_updated"));
  }
  isFirestoreInitialized.timeline = true;
});

onSnapshot(collection(db, "gear"), (snap) => {
  if (!snap.empty) {
    const list: GearItem[] = [];
    snap.forEach(d => list.push({ ...d.data(), id: d.id } as GearItem));
    cacheGear = list;
    saveLocalBackup(KEYS.GEAR, list);
    window.dispatchEvent(new Event("portfolio_updated"));
  }
  isFirestoreInitialized.gear = true;
});

export const storage = {
  getPhotos(): PhotoItem[] {
    return cachePhotos;
  },

  async savePhotos(photos: PhotoItem[]) {
    // 1. Optimistic update
    const previous = [...cachePhotos];
    cachePhotos = photos;
    saveLocalBackup(KEYS.PHOTOS, photos);
    window.dispatchEvent(new Event("portfolio_updated"));

    // 2. Persist to Firestore
    try {
      // Find deleted photos to remove specifically from DB
      const incomingIds = new Set(photos.map(p => p.id));
      const deletedIds = previous.filter(p => !incomingIds.has(p.id)).map(p => p.id);

      // Save/Update current photos
      for (const item of photos) {
        await setDoc(doc(db, "photos", item.id), item);
      }
      // Remove deleted
      for (const dId of deletedIds) {
        await deleteDoc(doc(db, "photos", dId));
      }
    } catch (error) {
      console.error("Firestore savePhotos error:", error);
      // Rollback to keep UI consistent in case of permission error
      cachePhotos = previous;
      saveLocalBackup(KEYS.PHOTOS, previous);
      window.dispatchEvent(new Event("portfolio_updated"));
    }
  },

  getStories(): DocumentaryStory[] {
    return cacheStories;
  },

  async saveStories(stories: DocumentaryStory[]) {
    const previous = [...cacheStories];
    cacheStories = stories;
    saveLocalBackup(KEYS.STORIES, stories);
    window.dispatchEvent(new Event("portfolio_updated"));

    try {
      const incomingIds = new Set(stories.map(s => s.id));
      const deletedIds = previous.filter(s => !incomingIds.has(s.id)).map(s => s.id);

      for (const item of stories) {
        await setDoc(doc(db, "stories", item.id), item);
      }
      for (const dId of deletedIds) {
        await deleteDoc(doc(db, "stories", dId));
      }
    } catch (error) {
      console.error("Firestore saveStories error:", error);
      cacheStories = previous;
      saveLocalBackup(KEYS.STORIES, previous);
      window.dispatchEvent(new Event("portfolio_updated"));
    }
  },

  getMemoryPins(): MemoryPin[] {
    return cacheMemories;
  },

  async saveMemoryPins(pins: MemoryPin[]) {
    const previous = [...cacheMemories];
    cacheMemories = pins;
    saveLocalBackup(KEYS.MEMORIES, pins);
    window.dispatchEvent(new Event("portfolio_updated"));

    try {
      const incomingIds = new Set(pins.map(p => p.id));
      const deletedIds = previous.filter(p => !incomingIds.has(p.id)).map(p => p.id);

      for (const item of pins) {
        await setDoc(doc(db, "memories", item.id), item);
      }
      for (const dId of deletedIds) {
        await deleteDoc(doc(db, "memories", dId));
      }
    } catch (error) {
      console.error("Firestore saveMemoryPins error:", error);
      cacheMemories = previous;
      saveLocalBackup(KEYS.MEMORIES, previous);
      window.dispatchEvent(new Event("portfolio_updated"));
    }
  },

  getLocations(): TravelLocation[] {
    return cacheLocations;
  },

  async saveLocations(locs: TravelLocation[]) {
    const previous = [...cacheLocations];
    cacheLocations = locs;
    saveLocalBackup(KEYS.LOCATIONS, locs);
    window.dispatchEvent(new Event("portfolio_updated"));

    try {
      const incomingIds = new Set(locs.map(l => l.id));
      const deletedIds = previous.filter(l => !incomingIds.has(l.id)).map(l => l.id);

      for (const item of locs) {
        await setDoc(doc(db, "locations", item.id), item);
      }
      for (const dId of deletedIds) {
        await deleteDoc(doc(db, "locations", dId));
      }
    } catch (error) {
      console.error("Firestore saveLocations error:", error);
      cacheLocations = previous;
      saveLocalBackup(KEYS.LOCATIONS, previous);
      window.dispatchEvent(new Event("portfolio_updated"));
    }
  },

  getTimeline(): Milestone[] {
    return cacheTimeline;
  },

  async saveTimeline(timeline: Milestone[]) {
    const previous = [...cacheTimeline];
    cacheTimeline = timeline;
    saveLocalBackup(KEYS.TIMELINE, timeline);
    window.dispatchEvent(new Event("portfolio_updated"));

    try {
      const incomingIds = new Set(timeline.map(t => t.id));
      const deletedIds = previous.filter(t => !incomingIds.has(t.id)).map(t => t.id);

      for (const item of timeline) {
        await setDoc(doc(db, "timeline", item.id), item);
      }
      for (const dId of deletedIds) {
        await deleteDoc(doc(db, "timeline", dId));
      }
    } catch (error) {
      console.error("Firestore saveTimeline error:", error);
      cacheTimeline = previous;
      saveLocalBackup(KEYS.TIMELINE, previous);
      window.dispatchEvent(new Event("portfolio_updated"));
    }
  },

  getGear(): GearItem[] {
    return cacheGear;
  },

  async saveGear(gear: GearItem[]) {
    const previous = [...cacheGear];
    cacheGear = gear;
    saveLocalBackup(KEYS.GEAR, gear);
    window.dispatchEvent(new Event("portfolio_updated"));

    try {
      const incomingIds = new Set(gear.map(g => g.id));
      const deletedIds = previous.filter(g => !incomingIds.has(g.id)).map(g => g.id);

      for (const item of gear) {
        await setDoc(doc(db, "gear", item.id), item);
      }
      for (const dId of deletedIds) {
        await deleteDoc(doc(db, "gear", dId));
      }
    } catch (error) {
      console.error("Firestore saveGear error:", error);
      cacheGear = previous;
      saveLocalBackup(KEYS.GEAR, previous);
      window.dispatchEvent(new Event("portfolio_updated"));
    }
  },

  // Perform lazy-seeding of Sreekar's spectacular portfolio values to the cloud database
  async seedOriginalPortfolioToCloud() {
    try {
      for (const photo of signaturePhotos) {
        await setDoc(doc(db, "photos", photo.id), photo);
      }
      for (const story of documentaryStories) {
        await setDoc(doc(db, "stories", story.id), story);
      }
      for (const pin of memoryWallPins) {
        await setDoc(doc(db, "memories", pin.id), pin);
      }
      for (const loc of mapLocations) {
        await setDoc(doc(db, "locations", loc.id), loc);
      }
      for (const milestone of achievementsTimeline) {
        await setDoc(doc(db, "timeline", milestone.id), milestone);
      }
      for (const gear of gearInventory) {
        await setDoc(doc(db, "gear", gear.id), gear);
      }
      console.log("Firestore catalog successfully initialized with pre-production records.");
    } catch (err) {
      console.error("Failed to seed initial cloud values:", err);
      throw err;
    }
  },

  async resetAll() {
    // Reverts to original constants locally and tries to sync
    cachePhotos = signaturePhotos;
    cacheStories = documentaryStories;
    cacheMemories = memoryWallPins;
    cacheLocations = mapLocations;
    cacheTimeline = achievementsTimeline;
    cacheGear = gearInventory;

    saveLocalBackup(KEYS.PHOTOS, signaturePhotos);
    saveLocalBackup(KEYS.STORIES, documentaryStories);
    saveLocalBackup(KEYS.MEMORIES, memoryWallPins);
    saveLocalBackup(KEYS.LOCATIONS, mapLocations);
    saveLocalBackup(KEYS.TIMELINE, achievementsTimeline);
    saveLocalBackup(KEYS.GEAR, gearInventory);

    window.dispatchEvent(new Event("portfolio_updated"));

    try {
      await this.seedOriginalPortfolioToCloud();
    } catch (e) {
      console.error("Could not sync default reset values with cloud server:", e);
    }
  }
};
