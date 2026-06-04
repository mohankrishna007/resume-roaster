"use client";
import { motion } from "framer-motion";
import { RoastResult } from "@/types/roast";
import { FADE_UP_ENTER } from "@/lib/motion";
import { SectionKicker } from "../ui/SectionKicker";

interface HeroRoastProps {
  archetype: RoastResult["archetype"];
  candidate: RoastResult["candidate"];
}

export function HeroRoast({ archetype, candidate }: HeroRoastProps) {
  return (
    <motion.section {...FADE_UP_ENTER}>
      <SectionKicker>
        verdict for {candidate.name.split(" ")[0]} · {candidate.experience_years} yrs
      </SectionKicker>

      <h1 className="font-display mt-5 text-[1.75rem] font-bold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl sm:leading-[1.05] lg:text-6xl 2xl:text-[4.5rem]">
        <span className="marker">{archetype.title}.</span>
      </h1>

      <p className="mt-6 text-[0.95rem] leading-7 text-[var(--ink-soft)] sm:text-base md:text-lg sm:leading-8">
        {archetype.tagline}
      </p>

      <p className="pull-quote mt-8 text-[1.35rem] leading-[1.18] text-[var(--ink)] sm:text-2xl md:text-3xl lg:text-4xl sm:leading-[1.15]">
        “{archetype.opener}”
      </p>
    </motion.section>
  );
}
