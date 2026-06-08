"use client";
import { motion } from "framer-motion";
import { Clock, Hash } from "lucide-react";
import { RoastResult } from "@/types/roast";
import { FADE_UP_VIEWPORT } from "@/lib/motion";
import { useCountUp } from "@/hooks/useCountUp";
import { SectionKicker } from "../ui/SectionKicker";

interface ScoresProps {
  scores: RoastResult["scores"];
  section_scores: RoastResult["section_scores"];
}

function CountUp({ to, duration = 1.1, delay = 0 }: { to: number; duration?: number; delay?: number }) {
  const { ref, value } = useCountUp(to, duration, delay);
  return <span ref={ref}>{value}</span>;
}

function Ring({ score, label, delay }: { score: number; label: string; delay: number }) {
  const pct = (score / 10) * 100;
  const color = score >= 7 ? "#c8ff3e" : score >= 5 ? "#ff7a2f" : "#ff4d8d";
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24 lg:h-28 lg:w-28">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" />
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
          <span className="font-display text-2xl font-bold sm:text-3xl lg:text-4xl">{score}</span>
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ink-mute)]">{label}</p>
        <p className="font-display mt-1 text-xl font-semibold">
          {score >= 8 ? "Strong" : score >= 6 ? "Decent" : score >= 4 ? "Mid" : "Rough"}
        </p>
      </div>
    </div>
  );
}

function SectionProgress({ score, label }: { score: number; label: string }) {
  const pct = (score / 10) * 100;
  const color =
    score >= 8
      ? "bg-[#c8ff3e]"
      : score >= 6
        ? "bg-[var(--accent)]"
        : score >= 4
          ? "bg-[#ff7a2f]"
          : "bg-[#ff4d8d]";
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white/[0.01] p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--ink-mute)]">{label}</p>
      <div className="mt-1 flex items-baseline justify-between gap-2">
        <span className="font-display text-2xl font-bold text-[var(--ink)]">{score}/10</span>
      </div>
      <div className="mt-3 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StatChip({
  icon: Icon,
  delay,
  children,
}: {
  icon: typeof Hash;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-2.5 rounded-full border border-[var(--line)] bg-white/[0.03] px-4 py-2"
    >
      <Icon className="h-4 w-4 text-[var(--accent)]" />
      <p className="text-sm">{children}</p>
    </motion.div>
  );
}

export function ScoresDisplay({ scores, section_scores }: ScoresProps) {
  const gap = scores.experience_strength - scores.resume_quality;
  const gapLine =
    gap >= 2
      ? "your work is louder than your resume."
      : gap <= -2
        ? "your resume is selling more than the work shows."
        : "resume and experience are roughly in sync.";

  return (
    <motion.section {...FADE_UP_VIEWPORT}>
      <SectionKicker>
        the scores · overall <span className="text-[var(--ink)]">{scores.overall}/10</span>
      </SectionKicker>

      <div className="mt-6 flex flex-col flex-wrap gap-6 sm:flex-row sm:items-center sm:gap-8 lg:gap-12">
        <Ring score={scores.resume_quality} label="Resume Quality" delay={0.1} />
        <Ring score={scores.experience_strength} label="Experience Strength" delay={0.25} />
      </div>

      <p className="mt-6 text-[var(--ink-soft)]">
        Translation: <span className="font-medium text-[var(--ink)]">{gapLine}</span>
      </p>

      <div className="mt-7 flex flex-wrap gap-3">
        <StatChip icon={Hash} delay={0.4}>
          <span className="font-display text-base font-bold text-[var(--ink)]">
            <CountUp to={scores.buzzword_count} delay={0.5} />
          </span>{" "}
          <span className="text-[var(--ink-mute)]">buzzwords detected</span>
        </StatChip>
        <StatChip icon={Clock} delay={0.55}>
          <span className="text-[var(--ink-mute)]">attention retention score</span>{" "}
          <span className="font-display text-base font-bold text-[var(--ink)]">
            <CountUp to={scores.attention_score} delay={0.65} />/10
          </span>
        </StatChip>
      </div>

      {section_scores && (
        <div className="mt-10 border-t border-[var(--line)] pt-8">
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ink-mute)]">Section Breakdown</h3>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <SectionProgress score={section_scores.summary} label="Summary" />
            <SectionProgress score={section_scores.experience} label="Experience" />
            <SectionProgress score={section_scores.skills} label="Skills" />
            <SectionProgress score={section_scores.projects} label="Projects" />
          </div>
        </div>
      )}
    </motion.section>
  );
}
