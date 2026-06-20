export interface PhotoItem {
  id: string;
  url: string;
  title: string;
  category: "Portrait" | "Documentary" | "Wildlife" | "Travel" | "Concert" | "Coastal";
  description: string;
  location: string;
  isBW?: boolean;
}

export interface DocumentaryStory {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  coverImage: string;
  emotionalQuote: string;
  location: string;
  releaseYear: string;
  descriptionBlocks: string[];
  timelineLabel: string;
  featuredPhotos: PhotoItem[];
}

export interface MemoryPin {
  id: string;
  url: string;
  title: string;
  caption: string;
  stamp: string;
  date: string;
  rotation: number; // For Polaroids
  left: number; // Percent positioning inside layout
  top: number; // Percent positioning inside layout
}

export interface TravelLocation {
  id: string;
  name: string;
  coordinates: { x: number; y: number }; // Relative mapping coordinates on SVG map
  labelPos: "top" | "bottom" | "left" | "right";
  status: "active" | "visited" | "exploring";
  shortStory: string;
  snippet: string;
  associatedImage: string;
  routeToId?: string; // Optional target location for animated paths
}

export interface Milestone {
  id: string;
  year: string;
  role: string;
  organization: string;
  description: string;
  detailsList?: string[];
}

export interface GearItem {
  id: string;
  category: string;
  name: string;
  specs: string;
  emotionalTag: string;
}
