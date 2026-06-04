"use client";

import { motion, type MotionProps } from "framer-motion";

type Blob = {
  animate: MotionProps["animate"];
  transition: MotionProps["transition"];
  className: string;
};

// Pre-defined animation configurations for better performance
const BLOB_ANIMATIONS: Blob[] = [
  {
    animate: { x: [0, 30, -20, 0], y: [0, -20, 20, 0] },
    transition: { duration: 22, repeat: Infinity, ease: "easeInOut" },
    className: "absolute -left-32 top-8 h-[28rem] w-[28rem] rounded-full bg-[#ff7a2f]/25 blur-[140px]",
  },
  {
    animate: { x: [0, -28, 16, 0], y: [0, 22, -18, 0] },
    transition: { duration: 26, repeat: Infinity, ease: "easeInOut" },
    className: "absolute right-[-6rem] top-1/3 h-[24rem] w-[24rem] rounded-full bg-[#ff4d8d]/18 blur-[150px]",
  },
  {
    animate: { x: [0, 18, -14, 0], y: [0, 20, -16, 0] },
    transition: { duration: 24, repeat: Infinity, ease: "easeInOut" },
    className: "absolute bottom-[-8rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-[#b39dff]/16 blur-[160px]",
  },
  {
    animate: { x: [0, -20, 14, 0], y: [0, -18, 22, 0] },
    transition: { duration: 28, repeat: Infinity, ease: "easeInOut" },
    className: "absolute right-1/4 bottom-1/4 h-[22rem] w-[22rem] rounded-full bg-[#c8ff3e]/10 blur-[150px]",
  },
];

// SSR-safe "is this running in the browser" gate — returns false on the server
// and true after hydration without ever calling setState in an effect.

export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {BLOB_ANIMATIONS.map((blob, index) => (
        <motion.div
          key={index}
          animate={blob.animate}
          transition={blob.transition}
          className={blob.className}
        />
      ))}

      {/* slow rotating conic aurora — only on bigger screens, reduced motion safe */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 hidden h-[140vmax] w-[140vmax] -translate-x-1/2 -translate-y-1/2 opacity-[0.18] mix-blend-screen motion-reduce:hidden sm:block"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, transparent 0deg, #ff7a2f33 60deg, transparent 120deg, #b39dff33 200deg, transparent 260deg, #c8ff3e33 320deg, transparent 360deg)",
          filter: "blur(80px)",
        }}
      />
    </div>
  );
}
