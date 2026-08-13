"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlexPilotLogo } from "@/components/ui/flex-pilot-logo";

export function LaunchScreen({ children }: { children: React.ReactNode }) {
  const [showAnimation, setShowAnimation] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    let hasSeen = null;
    try {
      hasSeen = sessionStorage.getItem("hasSeenLaunch");
    } catch (err) {
      console.warn("sessionStorage is not accessible:", err);
    }
    
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (hasSeen || prefersReducedMotion) {
      setShowAnimation(false);
    } else {
      // The total animation sequence takes about 3 seconds.
      // After that, we fade out and show the app.
      const timer = setTimeout(() => {
        setShowAnimation(false);
        try {
          sessionStorage.setItem("hasSeenLaunch", "true");
        } catch (err) {
          // Ignore storage block
        }
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#09090B] to-[#111827]"
          >
            {/* Cinematic Background Particles / Workflow flow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 3, delay: 1 }}
              className="absolute inset-0 pointer-events-none"
            >
               {/* Abstract workflow lines floating up */}
               <div className="absolute top-1/4 left-1/4 w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent -rotate-45" />
               <div className="absolute top-3/4 left-3/4 w-48 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent -rotate-45" />
               <div className="absolute top-1/2 left-2/3 w-24 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent -rotate-45" />
            </motion.div>

            {/* Logo Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: -10, // Slight upward float
              }}
              transition={{ 
                duration: 1.2, 
                ease: [0.16, 1, 0.3, 1], // Custom spring-like curve
                delay: 0.2
              }}
              className="relative w-24 h-24 sm:w-32 sm:h-32 mb-8"
            >
              {/* Shimmer sweep effect overlay */}
              <motion.div 
                className="absolute inset-0 z-10 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-full"
                initial={{ x: "-100%", y: "-100%" }}
                animate={{ x: "100%", y: "100%" }}
                transition={{ duration: 1.5, delay: 0.8, ease: "linear" }}
                style={{ mixBlendMode: 'overlay' }}
              />
              <FlexPilotLogo />
            </motion.div>

            {/* Tagline Sequence */}
            <div className="flex flex-col items-center justify-center h-16">
              <motion.div 
                className="flex items-center gap-3 text-lg sm:text-2xl font-light tracking-widest text-slate-300"
              >
                <motion.span
                  initial={{ opacity: 0, filter: "blur(4px)", y: 5 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                >
                  Find.
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, filter: "blur(4px)", y: 5 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{ duration: 0.8, delay: 1.6 }}
                >
                  Fix.
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, filter: "blur(4px)", y: 5 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{ duration: 0.8, delay: 2.0 }}
                  className="font-medium text-cyan-300"
                >
                  Verify.
                </motion.span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        We render children simultaneously but hide them visually until animation finishes. 
        Alternatively, just render them so they load in background. 
      */}
      <div className={showAnimation ? "invisible h-0 overflow-hidden" : "visible h-full"}>
        {children}
      </div>
    </>
  );
}
