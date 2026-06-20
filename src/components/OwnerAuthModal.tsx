import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { auth, loginWithGoogle, logout, ADMIN_EMAIL, isUserAdmin } from "../utils/firebase";
import { User } from "firebase/auth";
import { audio } from "../utils/audio";
import { X, Shield, Lock, CheckCircle, AlertOctagon, LogOut, ArrowRight, Sparkles } from "lucide-react";

interface OwnerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onAuthSuccess: () => void;
}

export default function OwnerAuthModal({ isOpen, onClose, currentUser, onAuthSuccess }: OwnerAuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    audio.playShutterClick();

    try {
      const user = await loginWithGoogle();
      if (user && user.email === ADMIN_EMAIL) {
        audio.playShutterClick();
        onAuthSuccess();
      } else if (user) {
        // User logged in but not the authorized owner
        setErrorMsg(`Access Denied: ${user.email} is not authorized to modify this portfolio. Only the official owner account (vignuthareddy02@gmail.com) has write access.`);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Sign-in request got rejected by client.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    audio.playLensTick();
    try {
      await logout();
      setErrorMsg(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = currentUser && currentUser.email === ADMIN_EMAIL;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1100] bg-black-pure/90 backdrop-blur-md flex items-center justify-center p-4 font-sans text-white-pure"
        >
          {/* Closer Clickbackdrop */}
          <div className="absolute inset-0 z-0" onClick={onClose} />

          {/* Modal Card container */}
          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative z-10 w-full max-w-md bg-[#0a0c10] border border-neutral-900 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.05)] flex flex-col text-left"
          >
            {/* Elegant Header layout */}
            <div className="p-6 border-b border-neutral-900 bg-[#0d0f14] flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <Shield className="w-4 h-4 text-gold shrink-0" />
                <span className="font-mono text-[10px] tracking-[0.25em] text-gold uppercase">PORTFOLIO GATEKEEPER</span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center text-gray-soft hover:text-white-pure hover:border-white-pure/20 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Main content viewport */}
            <div className="p-6 space-y-6">
              
              {/* Conditional Display regarding authentication level */}
              {!currentUser ? (
                // State 1: Unauthenticated
                <div className="space-y-5">
                  <div className="text-center py-4">
                    <div className="w-12 h-12 bg-neutral-900 rounded-full border border-neutral-800 flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-5 h-5 text-gold" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-white-pure">Creator Studio Sign-In</h3>
                    <p className="text-xs text-gray-soft/60 font-light mt-1.5 leading-relaxed max-w-[280px] mx-auto">
                      Sreekar's Portfolio Studio is write-protected. Only Sreekar Raju (<span className="text-gold font-mono text-[11px]">vignuthareddy02@gmail.com</span>) can access this control room to add, edit, or delete items. Other visitors have read-only view access.
                    </p>
                  </div>

                  <button
                    disabled={loading}
                    onClick={handleSignIn}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-gold/90 to-[#b5942f] text-black-pure text-xs tracking-[0.22em] font-mono uppercase font-bold hover:scale-[1.01] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                    ) : (
                      <>
                        <span>Authenticate with Google</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              ) : !isAdmin ? (
                // State 2: Authenticated but restricted
                <div className="space-y-5 text-center py-2">
                  <div className="w-12 h-12 bg-red-950/20 rounded-full border border-red-900/40 flex items-center justify-center mx-auto mb-4">
                    <AlertOctagon className="w-5 h-5 text-red-400 animate-pulse" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-red-400">Access Restricted</h3>
                    <p className="text-xs text-gray-soft/80 leading-relaxed font-light">
                      You are authenticated as <span className="font-mono text-white-pure">{currentUser.email}</span>. Unfortunately, this email does not have Sreekar's portfolio administrative authorization.
                    </p>
                    <p className="text-[10.5px] text-gray-soft/50 italic leading-relaxed">
                      Only the official owner account (<strong className="text-gold font-normal">vignuthareddy02@gmail.com</strong>) is allowed write/edit operations to keep Sreekar's content accurate.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-900/60 flex flex-col gap-2">
                    <button
                      onClick={handleSignIn}
                      disabled={loading}
                      className="w-full py-2.5 rounded bg-neutral-900 hover:bg-neutral-850/80 text-[10px] uppercase font-mono tracking-widest text-gold cursor-pointer transition-all border border-gold/10"
                    >
                      Sign In with another Google account
                    </button>
                    
                    <button
                      onClick={handleSignOut}
                      disabled={loading}
                      className="w-full py-2.5 rounded hover:bg-red-950/20 text-[10px] uppercase font-mono tracking-widest text-red-400 cursor-pointer transition-all flex items-center justify-center gap-2 bg-transparent"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out from current account</span>
                    </button>
                  </div>
                </div>
              ) : (
                // State 3: Logged in and authorized as full owner
                <div className="space-y-5 text-center py-2">
                  <div className="w-12 h-12 bg-gold/10 rounded-full border border-gold/40 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-5 h-5 text-gold" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-serif text-lg font-bold text-gold">Access Unlocked</h3>
                    <p className="text-xs text-gray-soft/80 leading-relaxed font-light">
                      Welcome back, <strong className="text-white-pure font-semibold">Sreekar</strong>!
                    </p>
                    <p className="text-[11px] text-gray-soft/50 font-mono">
                      Owner: {currentUser.email}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-900/60 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        audio.playShutterClick();
                        onAuthSuccess();
                      }}
                      className="w-full py-3 rounded bg-gradient-to-r from-gold/90 to-[#b5942f] text-black-pure text-xs tracking-[0.2em] font-mono uppercase font-bold hover:scale-[1.01] transition-transform shadow-lg cursor-pointer"
                    >
                      Enter Sreekar's Control Panel
                    </button>

                    <button
                      onClick={handleSignOut}
                      disabled={loading}
                      className="w-full py-2.5 rounded hover:bg-red-950/20 text-[10px] uppercase font-mono tracking-widest text-red-400 cursor-pointer transition-all flex items-center justify-center gap-2 bg-transparent"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Switch Owner Account</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Error messages if any */}
              {errorMsg && (
                <div className="p-3.5 bg-red-950/20 border border-red-900/30 rounded-lg text-[11px] text-red-400 leading-relaxed font-light text-center">
                  {errorMsg}
                </div>
              )}
            </div>

            {/* Footer subtle brand lines */}
            <div className="bg-[#080a0e] px-6 py-4 border-t border-neutral-900/60 text-center font-mono text-[9px] text-gray-soft/30 tracking-widest uppercase">
              Cloud Secure Firebase Protection System
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
