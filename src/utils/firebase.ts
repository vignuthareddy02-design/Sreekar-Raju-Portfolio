import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  User, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  deleteDoc,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import config from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = initializeApp(config);

// Core instances
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Allowed admin email configured per user's prompt request
export const ADMIN_EMAIL = "vignuthareddy02@gmail.com";

export function isUserAdmin(user: User | null): boolean {
  return !!user && user.email === ADMIN_EMAIL;
}

// Authentication Helpers
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
}

export async function logout() {
  await signOut(auth);
}
