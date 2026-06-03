"use client";
import { motion } from "framer-motion";
import { RoastResult } from "@/types/roast";

export function CandidateSummary({ candidate }: { candidate: RoastResult["candidate"] }) {
  const domain = candidate.domain_focus.map((d, i) => (
    <span key={d}>
      <span className="text-[var(--ink)]">{d.toLowerCase()}</span>
      {i < candidate.domain_focus.length - 1
        ? i === candidate.domain_focus.length - 2
          ? " and "
          : ", "
        : "."}
    </span>
  ));

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <p className="kicker">who we&apos;re reading</p>
      <p className="mt-4 text-lg leading-8 text-[var(--ink-soft)]">
        <span className="font-display text-2xl font-bold text-[var(--ink)]">
          {candidate.name}
        </span>
        {" — "}
        a <span className="text-[var(--ink)]">{candidate.experience_level.toLowerCase()}</span> with{" "}
        <span className="text-[var(--ink)]">{candidate.experience_years} years</span>
        {candidate.location.length > 0 && (
          <>
            , out of{" "}
            <span className="text-[var(--ink)]">{candidate.location.join(" / ")}</span>
          </>
        )}
        .{" "}
        {candidate.education && (
          <>
            Did <span className="text-[var(--ink)]">{candidate.education.degree}</span> at{" "}
            <span className="text-[var(--ink)]">{candidate.education.college}</span>.{" "}
          </>
        )}
        Works in {domain}
      </p>
    </motion.section>
  );
}
