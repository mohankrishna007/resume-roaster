"use client";
import { motion } from "framer-motion";
import { RoastResult } from "@/types/roast";

interface HeroRoastProps {
  archetype: RoastResult["archetype"];
  candidate: RoastResult["candidate"];
}

export function HeroRoast({ archetype, candidate }: HeroRoastProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <p className="kicker">
        verdict for {candidate.name.split(" ")[0]} · {candidate.experience_years} yrs
      </p>

      <h1 className="font-display mt-5 text-[2.4rem] font-bold leading-[1.08] tracking-tight sm:text-6xl sm:leading-[1.05] lg:text-[4.5rem]">
        <span className="marker">{archetype.title}.</span>
      </h1>

      <p className="mt-6 text-base leading-7 text-[var(--ink-soft)] sm:text-lg sm:leading-8">
        {archetype.tagline}
      </p>

      <p className="pull-quote mt-8 text-[1.65rem] leading-[1.18] text-[var(--ink)] sm:text-4xl sm:leading-[1.15]">
        “{archetype.opener}”
      </p>
    </motion.section>
  );
}
