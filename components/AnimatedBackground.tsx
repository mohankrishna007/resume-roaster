"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-32 top-8 h-[28rem] w-[28rem] rounded-full bg-orange-500/20 blur-[140px]"
      />
      <motion.div
        animate={{ x: [0, -28, 16, 0], y: [0, 22, -18, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[-6rem] top-1/3 h-[24rem] w-[24rem] rounded-full bg-rose-500/12 blur-[150px]"
      />
      <motion.div
        animate={{ x: [0, 18, -14, 0], y: [0, 20, -16, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-8rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-amber-400/10 blur-[160px]"
      />
    </div>
  );
}
