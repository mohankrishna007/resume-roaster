"use client";
import { animate, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { RoastResult } from "@/types/roast";
import { Clock, Hash } from "lucide-react";

interface ScoresProps {
  scores: RoastResult["scores"];
}

function CountUp({ to, duration = 1.1, delay = 0 }: { to: number; duration?: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      delay,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration, delay]);
  return <span ref={ref}>{val}</span>;
}

function Ring({
  score,
  label,
  delay,
}: {
  score: number;
  label: string;
  delay: number;
}) {
  const pct = (score / 10) * 100;
  const color = score >= 7 ? "#c8ff3e" : score >= 5 ? "#ff7a2f" : "#ff4d8d";
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-24 w-24 shrink-0">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={r}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="6"
            fill="none"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={r}
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            initial={{ strokeDashoffset: circ }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay, ease: "easeOut" }}
            strokeDasharray={circ}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-3xl font-bold">{score}</span>
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ink-mute)]">
          {label}
        </p>
        <p className="font-display mt-1 text-xl font-semibold">
          {score >= 8 ? "Strong" : score >= 6 ? "Decent" : score >= 4 ? "Mid" : "Rough"}
        </p>
      </div>
    </div>
  );
}

export function ScoresDisplay({ scores }: ScoresProps) {
  const gap = scores.experience_strength - scores.resume_quality;
  const gapLine =
    gap >= 2
      ? "your work is louder than your resume."
      : gap <= -2
      ? "your resume is selling more than the work shows."
      : "resume and experience are roughly in sync.";

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <p className="kicker">
        the scores · overall{" "}
        <span className="text-[var(--ink)]">{scores.overall}/10</span>
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-10">
        <Ring score={scores.resume_quality} label="Resume Quality" delay={0.1} />
        <Ring
          score={scores.experience_strength}
          label="Experience Strength"
          delay={0.25}
        />
      </div>

      <p className="mt-6 text-[var(--ink-soft)]">
        Translation:{" "}
        <span className="font-medium text-[var(--ink)]">{gapLine}</span>
      </p>

      {/* viral stats — designed to be screenshotted */}
      <div className="mt-7 flex flex-wrap gap-3">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex items-center gap-2.5 rounded-full border border-[var(--line)] bg-white/[0.03] px-4 py-2"
        >
          <Hash className="h-4 w-4 text-[var(--accent)]" />
          <p className="text-sm">
            <span className="font-display text-base font-bold text-[var(--ink)]">
              <CountUp to={scores.buzzword_count} delay={0.5} />
            </span>{" "}
            <span className="text-[var(--ink-mute)]">buzzwords detected</span>
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="flex items-center gap-2.5 rounded-full border border-[var(--line)] bg-white/[0.03] px-4 py-2"
        >
          <Clock className="h-4 w-4 text-[var(--accent)]" />
          <p className="text-sm">
            <span className="text-[var(--ink-mute)]">recruiter scrolls past in</span>{" "}
            <span className="font-display text-base font-bold text-[var(--ink)]">
              <CountUp to={scores.recruiter_scroll_seconds} delay={0.65} />s
            </span>
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
