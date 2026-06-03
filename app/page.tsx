"use client";

import { useRoastFlow } from "@/hooks/useRoastFlow";
import {
  AnimatedBackground,
  UploadZone,
  ProcessingScreen,
  HeroRoast,
  CandidateSummary,
  PositivePoints,
  RoastCard,
  BiggestTruth,
  ScoresDisplay,
  VerdictPanel,
} from "@/components";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, RefreshCcw, Share2 } from "lucide-react";

const tickerLines = [
  "“bro this is too accurate 😭”",
  "called out my fake 80% optimization ☠️",
  "“passionate team player” → exposed",
  "shared it in the group chat immediately",
  "my recruiter friend approved every roast",
  "the buzzword density score broke me",
  "“results-driven” is now banned in my house",
  "i fixed 4 lines before finishing reading",
];

const containerTransition = { duration: 0.4 };

export default function Home() {
  const { step, uploadedResume, roastResult, handleUpload, reset, error } =
    useRoastFlow();

  return (
    <div className="relative min-h-screen text-[var(--ink)]">
      <AnimatedBackground />

      <AnimatePresence mode="wait">
        {step === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={containerTransition}
            className="relative z-10 min-h-screen"
          >
            {/* minimal masthead — no card, just a line */}
            <header className="mx-auto flex max-w-6xl items-center justify-between px-5 pt-6 sm:px-8">
              <div className="flex items-center gap-2.5">
                <Flame className="h-5 w-5 text-[var(--accent)]" />
                <p className="font-display text-lg font-bold tracking-tight">
                  Resume Roaster
                </p>
              </div>
              <p className="text-xs text-[var(--ink-mute)]">
                no signup. no fluff. just feedback.
              </p>
            </header>

            <main className="mx-auto max-w-6xl px-5 sm:px-8">
              {/* hero — editorial, one big idea */}
              <section className="pt-14 sm:pt-20 lg:pt-24">
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="kicker"
                >
                  Drop the PDF. Get roasted.
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="font-display mt-5 max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl lg:text-[5.5rem]"
                >
                  Your resume is{" "}
                  <span className="marker-pink marker">lying</span> to you.
                  <br className="hidden sm:block" /> We&apos;ll{" "}
                  <span className="marker">tell you how.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                  className="mt-7 max-w-2xl text-lg leading-8 text-[var(--ink-soft)]"
                >
                  Upload your PDF. We&apos;ll read every &ldquo;results-driven team
                  player&rdquo; and tell you what a recruiter actually thinks —
                  in the voice of a friend who&apos;s seen too many resumes.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-10"
                >
                  <UploadZone onUpload={handleUpload} />
                </motion.div>

                {/* tiny human reassurance — not a card */}
                <p className="mt-4 text-sm text-[var(--ink-mute)]">
                  takes ~90 seconds · PDF only · we don&apos;t store anything
                </p>
              </section>

              {/* social proof ticker — what people said */}
              <section className="mt-20 overflow-hidden">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ink-mute)]">
                  what people texted after
                </p>
                <div className="mt-5 relative overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
                  <div className="ticker">
                    {[...tickerLines, ...tickerLines].map((line, i) => (
                      <span
                        key={i}
                        className="font-display text-2xl text-[var(--ink-soft)] whitespace-nowrap sm:text-3xl"
                      >
                        {line}
                        <span className="ml-10 text-[var(--accent)]">✦</span>
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* preview of a roast — show, don't tell */}
              <section className="mt-24 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
                <div>
                  <p className="kicker">a real moment from the report</p>
                  <h2 className="font-display mt-4 text-4xl font-bold leading-[1.05] sm:text-5xl">
                    It&apos;ll find the line you{" "}
                    <span className="underline-wavy">already knew</span> was
                    weak.
                  </h2>
                  <p className="mt-5 max-w-md text-base leading-7 text-[var(--ink-soft)]">
                    Not generic AI feedback. Not a 47-bullet checklist. Just the
                    specific sentences that make a recruiter scroll past you —
                    in language you&apos;d send to a friend.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="bubble bubble-them max-w-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-mute)]">
                      line 4 of your resume
                    </p>
                    <p className="mt-2 italic text-[var(--ink-soft)]">
                      &ldquo;Optimized performance by 80%&rdquo;
                    </p>
                  </div>
                  <div className="bubble bubble-you ml-auto max-w-sm">
                    <p className="text-lg font-semibold leading-7">
                      WAIT 😭 80%? What was the app doing before — running on
                      emotional support?
                    </p>
                  </div>
                  <p className="ml-auto max-w-sm text-xs text-[var(--ink-mute)]">
                    metric inflation · aggressive percentage claim
                  </p>
                </div>
              </section>

              {/* final call — bare, no card */}
              <section className="my-24 text-center">
                <h2 className="font-display mx-auto max-w-3xl text-4xl font-bold leading-[1.15] sm:text-5xl">
                  Okay enough scrolling.
                  <br />
                  <span className="marker-green marker">
                    Find out what yours says.
                  </span>
                </h2>
                <a
                  href="#top"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="btn-hot mt-8"
                >
                  <Flame className="h-4 w-4" />
                  Roast my resume
                </a>
              </section>

              <footer className="border-t border-[var(--line)] py-6 text-center text-xs text-[var(--ink-mute)]">
                made for people who already know · {new Date().getFullYear()}
              </footer>
            </main>
          </motion.div>
        )}

        {step === "uploading" && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={containerTransition}
            className="relative z-10 flex min-h-screen items-center justify-center px-5"
          >
            <div className="max-w-lg text-center">
              <motion.div
                animate={{ rotate: [0, -8, 8, -8, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="mx-auto text-6xl"
              >
                📄
              </motion.div>
              <p className="kicker mt-6 justify-center">reading your pdf</p>
              <h2 className="font-display mt-4 text-4xl font-bold leading-tight sm:text-5xl">
                Okay, opening{" "}
                <span className="marker">
                  {uploadedResume?.filename ?? "your file"}
                </span>
                …
              </h2>
              <p className="mt-5 text-[var(--ink-soft)]">
                Pulling out every sentence, every metric, every &ldquo;passionate
                team player.&rdquo;
              </p>
            </div>
          </motion.div>
        )}

        {step === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={containerTransition}
            className="relative z-10"
          >
            <ProcessingScreen filename={uploadedResume?.filename} />
          </motion.div>
        )}

        {step === "result" && roastResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={containerTransition}
            className="relative z-10"
          >
            {/* minimal sticky topbar — name + share is the hero action */}
            <div className="sticky top-0 z-30 border-b border-[var(--line)] bg-[#0f0c0a]/80 backdrop-blur-xl">
              <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
                <div className="flex items-center gap-2.5">
                  <Flame className="h-4 w-4 text-[var(--accent)]" />
                  <p className="text-sm font-semibold text-[var(--ink-soft)]">
                    <span className="text-[var(--ink-mute)]">roast for</span>{" "}
                    {roastResult.candidate.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: `${roastResult.candidate.name}'s resume roast`,
                          text: roastResult.verdict.share_quote,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard?.writeText(window.location.href);
                      }
                    }}
                    className="btn-hot !px-4 !py-2 text-sm"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    Share
                  </button>
                  <button
                    onClick={reset}
                    className="btn-ghost !px-3 !py-2 text-sm"
                    aria-label="Roast another"
                  >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">New</span>
                  </button>
                </div>
              </div>
            </div>

            {/* one column, editorial scroll — no left/right card grid */}
            <article className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14 lg:py-16">
              <HeroRoast
                archetype={roastResult.archetype}
                candidate={roastResult.candidate}
              />

              <div className="my-12 rule-dotted" />

              <ScoresDisplay scores={roastResult.scores} />

              <div className="my-12 rule-dotted" />

              <CandidateSummary candidate={roastResult.candidate} />

              <div className="my-14">
                <p className="kicker">the breakdown</p>
                <h2 className="font-display mt-3 text-4xl font-bold leading-[1.05] sm:text-5xl">
                  Line by line, no mercy.
                </h2>
                <p className="mt-3 text-[var(--ink-soft)]">
                  {roastResult.roasts.length} moments your resume should
                  probably hear.
                </p>
              </div>

              <div className="space-y-8">
                {roastResult.roasts.map((roast, idx) => (
                  <RoastCard key={idx} roast={roast} index={idx} />
                ))}
              </div>

              <div className="my-14 rule-dotted" />

              <PositivePoints wins={roastResult.wins} />

              <div className="my-14 rule-dotted" />

              <BiggestTruth truth={roastResult.biggest_truth} />

              <div className="my-14 rule-dotted" />

              <VerdictPanel
                verdict={roastResult.verdict}
                candidateName={roastResult.candidate.name}
                onReset={reset}
              />
            </article>
          </motion.div>
        )}

        {step === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={containerTransition}
            className="relative z-10 flex min-h-screen items-center justify-center px-5"
          >
            <div className="max-w-lg text-center">
              <p className="text-6xl">💀</p>
              <h2 className="font-display mt-6 text-4xl font-bold sm:text-5xl">
                Yeah that didn&apos;t work.
              </h2>
              <p className="mt-4 text-[var(--ink-soft)]">
                {error ?? "Make sure it's a real PDF. Try one more time?"}
              </p>
              <button onClick={reset} className="btn-hot mt-7">
                <RefreshCcw className="h-4 w-4" />
                Try again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
