"use client";

import { useMemo } from "react";
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
  ArrowDoodle,
  SparkleDoodle,
  StarDoodle,
  ScribbleCircle,
  LightningDoodle,
  ZigZagDoodle,
  PaperDoodle,
  ExclaimDoodle,
  MagneticButton,
  RevealOnScroll,
  TiltCard,
  SplitText,
} from "@/components";
import {
  TICKER_LINES,
  TESTIMONIALS,
  TRUST_COMPANIES,
  CONTAINER_TRANSITION,
} from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, RefreshCcw, Share2 } from "lucide-react";

export default function Home() {
  const { step, uploadedResume, roastResult, handleUpload, reset, error } =
    useRoastFlow();

  // Memoize doubled ticker lines to avoid recreation on every render
  const doubledTickerLines = useMemo(
    () => [...TICKER_LINES, ...TICKER_LINES],
    []
  );

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
            transition={CONTAINER_TRANSITION}
            className="relative z-10 min-h-screen"
          >
            {/* minimal masthead — no card, just a line */}
            <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 pt-7 sm:px-8">
              <div className="flex items-center gap-2.5">
                <Flame className="h-5 w-5 text-[var(--accent)]" />
                <p className="font-display text-lg font-bold tracking-tight">
                  Resume Roaster
                </p>
              </div>
              <p className="hidden text-right text-xs text-[var(--ink-mute)] sm:block">
                AI resume review · no recruiter cosplay
              </p>
              <p className="text-right text-[0.7rem] text-[var(--ink-mute)] sm:hidden">
                no fluff
              </p>
            </header>

            <main className="mx-auto max-w-6xl px-6 sm:px-8">
              {/* hero — editorial, one big idea */}
              <section className="relative pt-12 sm:pt-20 lg:pt-24">
                {/* hero gutter doodles — only visible on larger screens */}
                <SparkleDoodle
                  aria-hidden
                  className="absolute right-[6%] top-[8%] hidden h-10 w-10 text-[var(--accent-lime)] opacity-90 motion-safe:animate-pulse lg:block"
                />
                <StarDoodle
                  aria-hidden
                  className="absolute right-[22%] top-[2%] hidden h-6 w-6 -rotate-12 text-[var(--accent-pink)] lg:block"
                />
                <ZigZagDoodle
                  aria-hidden
                  className="absolute -top-2 right-[40%] hidden h-4 w-20 text-[var(--accent)] opacity-70 xl:block"
                />

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="kicker"
                >
                  AI resume roast · drop PDF · get the truth
                </motion.p>

                <h1
                  className="font-display mt-6 max-w-4xl text-[2.15rem] font-bold leading-[1.1] tracking-tight sm:mt-5 sm:text-7xl sm:leading-[1.05] lg:text-[5.5rem]"
                >
                  <SplitText text="Your resume is" delay={0.05} />{" "}
                  <span className="marker-pink marker">quietly lying</span>.
                  <br className="hidden sm:block" /> Our AI will{" "}
                  <span className="marker">roast</span>{" "}
                  <span className="text-shimmer">every line</span>.
                </h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                  className="mt-6 max-w-2xl text-base leading-7 text-[var(--ink-soft)] sm:mt-7 sm:text-lg sm:leading-8"
                >
                  Drop your PDF. We&apos;ll read it the way a recruiter actually
                  does — fast, unimpressed, and side-eyeing every &ldquo;passionate
                  team player.&rdquo; You&apos;ll get the exact lines making
                  them scroll past, a one-line fix you can paste straight back
                  in, and zero LinkedIn-coach energy. Bring your ego. Leave with
                  a better resume.
                </motion.p>

                {/* curved arrow pointing from copy down to the upload zone */}
                <ArrowDoodle
                  aria-hidden
                  className="absolute right-[8%] top-[58%] hidden h-20 w-28 -rotate-12 text-[var(--accent-lime)] opacity-90 lg:block"
                />

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative mt-8 sm:mt-10"
                >
                  {/* tiny paper doodle peeking into the upload box from the side */}
                  <PaperDoodle
                    aria-hidden
                    className="absolute -left-7 -top-6 hidden h-14 w-12 -rotate-[14deg] text-[var(--accent-pink)] sm:block"
                  />
                  <UploadZone onUpload={handleUpload} />
                </motion.div>

                {/* tiny human reassurance — not a card */}
                <p className="mt-5 text-sm leading-6 text-[var(--ink-mute)]">
                  PDF only · nothing stored
                </p>
              </section>

              {/* social proof ticker — what people said */}
              <RevealOnScroll>
              <section aria-labelledby="buzz" className="mt-24 overflow-hidden sm:mt-20">
                <p id="buzz" className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ink-mute)]">
                  what people actually said after
                </p>
                <div className="ticker-wrap mt-5 relative overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
                  <div className="ticker">
                    {doubledTickerLines.map((line, i) => (
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
              </RevealOnScroll>

              {/* preview of a roast — show, don't tell — uses the actual annotation style */}
              <RevealOnScroll>
              <section className="relative mt-24 grid gap-8 sm:mt-24 sm:gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
                <LightningDoodle
                  aria-hidden
                  className="absolute -top-6 left-[-12px] hidden h-12 w-8 -rotate-[18deg] text-[var(--accent-lime)] lg:block"
                />
                <div>
                  <p className="kicker">a real line from a real report</p>
                  <h2 className="font-display mt-4 text-[2rem] font-bold leading-[1.1] sm:text-5xl sm:leading-[1.05]">
                    It finds the line you{" "}
                    <span className="underline-wavy">already knew</span> was
                    cooked.
                  </h2>
                  <p className="mt-5 max-w-md text-base leading-7 text-[var(--ink-soft)]">
                    No generic AI mush. No 47-point checklist nobody reads.
                    Just the exact sentences making recruiters scroll past you,
                    explained like your sharpest friend — and a one-line fix
                    for every roast you can paste straight back in.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-[1fr_1.15fr] md:gap-6 md:items-start">
                  <div className="doc-line sev-savage">
                    <div className="sev-stamp sev-savage">
                      <Flame className="h-3 w-3" /> savage
                    </div>
                    <div className="doc-meta">
                      <span className="doc-num">L04</span>
                      <span>your resume said</span>
                    </div>
                    <p className="doc-text">
                      <span className="doc-text-highlight">
                        &ldquo;Skills: Java, Python, C++, JavaScript, React, Node, Angular, Vue, AWS, Azure, GCP, Docker, Kubernetes, MongoDB, MySQL, Figma, Photoshop, Leadership&rdquo;
                      </span>
                    </p>
                  </div>
                  <div className="annotation sev-savage">
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--ink-mute)]">
                      what the roaster said
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--ink-soft)]">
                      BHAI 💀 this is Big Bazaar sale
                    </p>
                    <p className="font-display mt-2 text-xl leading-[1.3] font-semibold sm:text-[1.4rem]">
                      Buy 1 skill get 14 free. Recruiter walks in, sees this aisle, walks straight out.
                    </p>
                  </div>
                </div>
              </section>
              </RevealOnScroll>

              {/* testimonials — illustrated avatars (DiceBear) */}
              <RevealOnScroll>
              <section aria-labelledby="testimonials" className="relative mt-24 sm:mt-24">
                <StarDoodle
                  aria-hidden
                  className="absolute right-2 top-2 hidden h-7 w-7 rotate-12 text-[var(--accent-pink)] lg:block"
                />
                <p className="kicker">straight from the group chats</p>
                <h2 id="testimonials" className="font-display mt-4 text-[1.85rem] font-bold leading-[1.12] sm:text-4xl sm:leading-[1.1]">
                  They came to laugh.
                  <br className="hidden sm:block" /> They left and{" "}
                  <span className="marker-green marker">fixed four lines.</span>
                </h2>

                <div className="mt-8 grid gap-6 sm:mt-10 sm:gap-5 md:grid-cols-3">
                  {TESTIMONIALS.map((t) => (
                    <TiltCard key={t.seed} className="testimonial">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://api.dicebear.com/9.x/notionists/svg?seed=${t.seed}&backgroundColor=ffd5a0,ffc9a8,fcd5ce,b9fbc0&radius=50`}
                          alt=""
                          className="avatar"
                          width={42}
                          height={42}
                        />
                        <div>
                          <p className="font-display text-sm font-semibold text-[var(--ink)]">
                            {t.name}
                          </p>
                          <p className="text-xs text-[var(--ink-mute)]">
                            @ {t.handle}
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 leading-7 text-[var(--ink-soft)]">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </TiltCard>
                  ))}
                </div>

                {/* trust strip — small, greyscale, just enough */}
                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--ink-mute)]">
                    used by folks at
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TRUST_COMPANIES.map(
                      (c) => (
                        <span key={c} className="trust-chip">
                          {c}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </section>
              </RevealOnScroll>

              {/* final call — bare, no card */}
              <RevealOnScroll>
              <section aria-labelledby="cta" className="relative my-24 text-center sm:my-24">
                <ScribbleCircle
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[180px] w-[480px] -translate-x-1/2 -translate-y-[42%] text-[var(--accent-lime)] opacity-70 sm:block"
                />
                <SparkleDoodle
                  aria-hidden
                  className="absolute left-[12%] top-0 hidden h-8 w-8 text-[var(--accent-pink)] lg:block"
                />
                <ExclaimDoodle
                  aria-hidden
                  className="absolute right-[14%] top-2 hidden h-12 w-3 rotate-[12deg] text-[var(--accent)] lg:block"
                />
                <h2 id="cta" className="relative font-display mx-auto max-w-3xl text-[2rem] font-bold leading-[1.15] sm:text-5xl">
                  Okay, enough doomscrolling.
                  <br />
                  <span className="marker-green marker">
                    Find out what yours really says.
                  </span>
                </h2>
                <p className="mx-auto mt-5 max-w-md px-2 text-sm text-[var(--ink-soft)]">
                  Drop the PDF, we&apos;ll handle the brutal honesty. Worst
                  case you laugh. Best case you fix the one line that&apos;s
                  been quietly costing you interviews.
                </p>
                <div className="mt-7 inline-block">
                  <MagneticButton
                    href="#top"
                    ariaLabel="Upload your resume and get roasted"
                    className="btn-hot relative"
                    onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    strength={0.4}
                  >
                    <Flame className="h-4 w-4" />
                    Roast my resume
                  </MagneticButton>
                </div>
              </section>
              </RevealOnScroll>

              <footer className="border-t border-[var(--line)] px-6 py-7 text-center text-xs leading-5 text-[var(--ink-mute)] sm:px-0">
                Resume Roaster · AI resume review · made for people who already kinda know · &copy; {new Date().getFullYear()}
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
            transition={CONTAINER_TRANSITION}
            className="relative z-10 flex min-h-screen items-center justify-center px-6"
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
                Cracking open{" "}
                <span className="marker">
                  {uploadedResume?.filename ?? "your file"}
                </span>
                …
              </h2>
              <p className="mt-5 text-[var(--ink-soft)]">
                Scanning every sentence, every metric, every suspiciously
                &ldquo;passionate team player&rdquo; lurking in there.
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
            transition={CONTAINER_TRANSITION}
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
            transition={CONTAINER_TRANSITION}
            className="relative z-10"
          >
            {/* minimal sticky topbar — name + share is the hero action */}
            <div className="bar-gradient sticky top-0 z-30 border-b border-[var(--line)] bg-[#0b0810]/80 backdrop-blur-xl">
              <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
                <div className="flex min-w-0 items-center gap-2.5">
                  <Flame className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                  <p className="truncate text-sm font-semibold text-[var(--ink-soft)]">
                    <span className="text-[var(--ink-mute)]">roast for</span>{" "}
                    {roastResult.candidate.name}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
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

            {/* editorial scroll — narrative sections stay narrow, breakdown grid goes wide */}
            <article className="mx-auto max-w-5xl px-6 py-12 sm:px-8 sm:py-14 lg:py-16">
              <div className="mx-auto max-w-3xl">
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
                  <h2 className="font-display mt-3 text-[2rem] font-bold leading-[1.1] sm:text-5xl sm:leading-[1.05]">
                    Line by line, no mercy.
                  </h2>
                  <p className="mt-3 text-[var(--ink-soft)]">
                    {roastResult.roasts.length} moments your resume should
                    probably hear.
                  </p>
                </div>
              </div>

              <div className="space-y-10 sm:space-y-12">
                {roastResult.roasts.map((roast, idx) => (
                  <RoastCard key={idx} roast={roast} index={idx} />
                ))}
              </div>

              <div className="mx-auto mt-14 max-w-3xl">
                <div className="rule-dotted" />

                <div className="mt-14">
                  <PositivePoints wins={roastResult.wins} />
                </div>

                <div className="my-14 rule-dotted" />

                <BiggestTruth truth={roastResult.biggest_truth} />

                <div className="my-14 rule-dotted" />

                <VerdictPanel
                  verdict={roastResult.verdict}
                  candidateName={roastResult.candidate.name}
                  onReset={reset}
                />
              </div>
            </article>
          </motion.div>
        )}

        {step === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={CONTAINER_TRANSITION}
            className="relative z-10 flex min-h-screen items-center justify-center px-6"
          >
            <div className="max-w-lg text-center">
              <p className="text-6xl">💀</p>
              <h2 className="font-display mt-6 text-4xl font-bold sm:text-5xl">
                Welp, that flopped.
              </h2>
              <p className="mt-4 text-[var(--ink-soft)]">
                {error ?? "Make sure it's a real text-based PDF (not a scanned image) and give it another shot."}
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
