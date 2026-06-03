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

      <h1 className="font-display mt-5 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.5rem]">
        <span className="marker">{archetype.title}.</span>
      </h1>

      <p className="mt-6 text-lg leading-8 text-[var(--ink-soft)]">
        {archetype.tagline}
      </p>

      <p className="pull-quote mt-8 text-3xl leading-[1.15] text-[var(--ink)] sm:text-4xl">
        “{archetype.opener}”
      </p>
    </motion.section>
  );
}
