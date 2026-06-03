"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// the steps the roaster pretends to be doing — each with its own vibe
const STEPS: { line: string; emoji: string; aside?: string }[] = [
  { line: "opening the pdf", emoji: "📄", aside: "okay let's see what we're working with" },
  { line: "counting buzzwords", emoji: "🔢", aside: "'synergy' detected. multiple times." },
  { line: "side-eyeing every metric", emoji: "🧐", aside: "'increased efficiency by 80%'... of what??" },
  { line: "checking for 'passionate'", emoji: "🤨", aside: "yep. there it is." },
  { line: "reading between the bullet points", emoji: "🔍", aside: "the silence is loud" },
  { line: "consulting the recruiter brain", emoji: "🧠", aside: "she would not survive this resume" },
  { line: "deciding how honest to be", emoji: "⚖️", aside: "(very)" },
  { line: "warming up the keyboard", emoji: "⌨️", aside: "okay i'm cooking" },
];

export function ProcessingScreen({ filename }: { filename?: string }) {
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setStepIdx((p) => (p + 1) % STEPS.length),
      1400,
    );
    return () => clearInterval(id);
  }, []);

  const current = STEPS[stepIdx];
  const dots = useMemo(() => Array.from({ length: STEPS.length }), []);

  return (
    <div className="relative mx-auto flex min-h-screen max-w-3xl items-center justify-center px-5 sm:px-8">
      <div className="relative z-10 w-full">
        {/* live "now roasting" badge */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-pink)]/40 bg-[var(--accent-pink)]/10 px-3 py-1.5"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-pink)] opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-pink)]" />
          </span>
          <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[var(--accent-pink)]">
            now roasting · live
          </span>
        </motion.div>

        {/* big chunky headline that changes vibe per step */}
        <h2 className="font-display mt-6 text-5xl font-bold leading-[1.02] tracking-[-0.035em] sm:text-7xl">
          <span className="text-[var(--ink-mute)]">cooking up</span>{" "}
          <br className="hidden sm:block" />
          <span className="marker-green marker">your roast.</span>
        </h2>

        <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-[var(--ink-mute)]">
          file · <span className="text-[var(--ink-soft)]">{filename ?? "your_resume.pdf"}</span>
        </p>

        {/* the actual live step — emoji + line + aside, animated in and out */}
        <div className="relative mt-12 min-h-[150px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIdx}
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex items-start gap-4"
            >
              <motion.span
                animate={{ rotate: [0, -8, 8, -4, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
                className="text-5xl sm:text-6xl"
              >
                {current.emoji}
              </motion.span>
              <div className="flex-1 pt-1">
                <p className="font-display text-2xl font-bold leading-tight sm:text-3xl">
                  {current.line}
                  <span className="ml-1 text-[var(--accent-lime)]">
                    <Dots />
                  </span>
                </p>
                {current.aside && (
                  <p className="mt-2 font-mono text-sm italic text-[var(--ink-mute)]">
                    &gt; {current.aside}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* step progress dots — rhythmic, no fake percentage */}
        <div className="mt-10 flex items-center gap-1.5">
          {dots.map((_, i) => (
            <motion.span
              key={i}
              animate={{
                width: i === stepIdx ? 32 : i < stepIdx ? 14 : 8,
                opacity: i === stepIdx ? 1 : i < stepIdx ? 0.6 : 0.2,
                backgroundColor:
                  i === stepIdx
                    ? "var(--accent-lime)"
                    : i < stepIdx
                    ? "var(--accent)"
                    : "rgba(255,245,230,0.25)",
              }}
              transition={{ duration: 0.35 }}
              className="h-1.5 rounded-full"
            />
          ))}
        </div>

        {/* tiny disclaimer in the genz voice */}
        <p className="mt-8 max-w-md font-mono text-xs leading-5 text-[var(--ink-mute)]">
          this takes ~30s. don&apos;t close the tab pls. we&apos;re cooking
          your resume with our whole chest
          <span className="text-[var(--accent-lime)]">.</span>
        </p>
      </div>
    </div>
  );
}

// the blinking three dots — uses simple staggered opacity
function Dots() {
  return (
    <span className="inline-flex gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
        >
          .
        </motion.span>
      ))}
    </span>
  );
}
