"use client";

import { useMemo } from "react";
import { useRoastFlow } from "@/hooks/useRoastFlow";
import {
  AnimatedBackground,
  UploadZone,
  ProcessingScreen,
  RoastResultView,
  SignInGate,
  AuthBadge,
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
import Image from "next/image";
import { Flame, RefreshCcw, Wrench, HeartCrack } from "lucide-react";
import dynamic from "next/dynamic";

const ShareAppButton = dynamic(() => import("@/components/ShareAppButton"), {
  ssr: false,
});

export default function Home() {
  const { step, uploadedResume, roastResult, shareId, handleUpload, reset, error } =
    useRoastFlow();

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
            {/* ── Masthead ───────────────────────────────────────────── */}
            <header className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 pt-5
                               sm:gap-3 sm:px-8 sm:pt-7
                               lg:max-w-7xl lg:px-12">
              <div className="flex items-center gap-2">
                  <Image
                  src="/icon.png"
                  alt="Roastume"
                  width={32}
                  height={32}
                  priority
                  className="h-8 w-8 sm:h-9 sm:w-9"
                />
                <p className="font-display text-lg font-bold tracking-tight sm:text-2xl md:text-3xl">
                  Roastume
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <p className="hidden text-right text-xs text-[var(--ink-mute)] md:block">
                  AI resume review · no recruiter cosplay
                </p>
                <AuthBadge />
              </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 sm:px-8 lg:max-w-7xl lg:px-12 2xl:max-w-[110rem]">

              {/* ── Hero ────────────────────────────────────────────── */}
              <section className="relative pt-10 sm:pt-16 lg:pt-24">

                {/* Doodles — only large screens */}
                <SparkleDoodle
                  aria-hidden
                  className="absolute right-[6%] top-[8%] hidden h-10 w-10 text-[var(--accent-lime)] opacity-90 motion-safe:animate-pulse xl:block"
                />
                <StarDoodle
                  aria-hidden
                  className="absolute right-[22%] top-[2%] hidden h-6 w-6 -rotate-12 text-[var(--accent-pink)] xl:block"
                />
                <ZigZagDoodle
                  aria-hidden
                  className="absolute -top-2 right-[40%] hidden h-4 w-20 text-[var(--accent)] opacity-70 xl:block"
                />

                {/* Kicker */}
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="kicker"
                >
                  AI resume roast · drop PDF · get the truth
                </motion.p>

                {/* Headline
                    Mobile  : 1.65rem  (tight, 2-line friendly)
                    sm      : 2.75rem
                    md      : 3.5rem
                    lg      : 4.5rem
                    xl      : 5rem
                    2xl     : 5.5rem                               */}
                <h1
                  className="font-display mt-4 max-w-4xl text-[1.65rem] font-bold leading-[1.12] tracking-tight
                             sm:mt-5 sm:text-[2.75rem] sm:leading-[1.08]
                             md:text-[3.5rem]
                             lg:text-[4.5rem] lg:leading-[1.05]
                             xl:text-[5rem]
                             2xl:text-[5.5rem] 2xl:max-w-5xl"
                >
                  <SplitText text="Think your resume is" delay={0.05} />{" "}
                  <span className="marker-pink marker relative -top-2">
                    good
                  </span>                  <br />
                  We&apos;ll tell you the{" "}
                  <span className="marker">truth</span>.
                </h1>

                {/* Sub-headline */}
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                  className="mt-4 max-w-xl text-[0.95rem] leading-7 text-[var(--ink-soft)]
                             sm:mt-6 sm:max-w-2xl sm:text-lg sm:leading-8
                             lg:max-w-3xl lg:text-xl"
                >
                  Drop your PDF.{" "}
                  <span className="font-semibold text-[var(--ink)]">
                    Get the recruiter&apos;s side-eye in 30 seconds.
                  </span>
                </motion.p>

                {/* Feature cards
                    Stack on mobile, 2-col from md only — sm screens are too narrow for side-by-side */}
                <motion.ul
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  className="mt-5 grid max-w-xl gap-2.5
                             sm:mt-6 sm:max-w-2xl
                             md:grid-cols-2 md:gap-3
                             lg:max-w-3xl"
                >
                  {[
                    {
                      Icon: HeartCrack,
                      tint: "var(--accent)",
                      title: "Every Weak Spot, Exposed",
                      body: "No fluff. No guessing. Just honest feedback on what's holding your resume back.",
                    },
                    {
                      Icon: Wrench,
                      tint: "var(--accent-lime)",
                      title: "Less Fluff. More Offers.",
                      body: "Turn vague bullets into measurable impact with practical, recruiter-focused fixes.",
                    },
                  ].map(({ Icon, tint, title, body }, i) => (
                    <motion.li
                      key={title}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.22 + i * 0.05, duration: 0.35 }}
                      className="group flex items-start gap-3 rounded-2xl border border-[var(--line)]
                                 bg-white/[0.02] px-3.5 py-3
                                 transition hover:border-white/15 hover:bg-white/[0.04]
                                 sm:px-4 sm:py-3.5"
                    >
                      <span
                        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg
                                   ring-1 ring-inset ring-white/10 transition group-hover:scale-110"
                        style={{
                          background: `color-mix(in oklab, ${tint} 18%, transparent)`,
                          color: tint,
                        }}
                        aria-hidden
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--ink)] sm:text-[0.95rem]">
                          {title}
                        </p>
                        <p className="mt-0.5 text-[0.82rem] leading-snug text-[var(--ink-mute)] sm:text-sm">
                          {body}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>

                {/* Tagline */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 max-w-xl text-sm italic text-[var(--ink-mute)]
                             sm:mt-5 sm:text-[0.95rem]
                             lg:max-w-3xl"
                >
                  Bring your ego. Leave with a better resume.
                </motion.p>

                {/* Arrow doodle — large screens only, positioned safely */}
                <ArrowDoodle
                  aria-hidden
                  className="absolute right-[6%] top-[55%] hidden h-20 w-28 -rotate-12 text-[var(--accent-lime)] opacity-90 xl:block"
                />

                {/* Upload zone */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative mt-7 sm:mt-9"
                >
                  <PaperDoodle
                    aria-hidden
                    className="absolute -left-7 -top-6 hidden h-14 w-12 -rotate-[14deg] text-[var(--accent-pink)] sm:block xl:block"
                  />
                  <UploadZone onUpload={handleUpload} />
                </motion.div>

                <p className="mt-4 text-sm leading-6 text-[var(--ink-mute)]">
                  Share your resume roast with friends and get their reactions
                </p>
              </section>

              {/* ── Ticker ──────────────────────────────────────────── */}
              <RevealOnScroll>
                <section aria-labelledby="buzz" className="mt-20 overflow-hidden sm:mt-20">
                  <p
                    id="buzz"
                    className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ink-mute)]"
                  >
                    what people actually said after
                  </p>
                  <div
                    className="ticker-wrap relative mt-5 overflow-hidden py-2
                               [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]"
                  >
                    <div className="ticker">
                      {doubledTickerLines.map((line, i) => (
                        <span
                          key={i}
                          className="whitespace-nowrap font-display text-xl text-[var(--ink-soft)]
                                     sm:text-2xl md:text-3xl lg:text-4xl"
                        >
                          {line}
                          <span className="ml-10 text-[var(--accent)]">✦</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </section>
              </RevealOnScroll>

              {/* ── "It finds the line" preview ──────────────────────
                  Layout:
                  Mobile  : single column, stacked
                  md      : copy | annotation pair (side-by-side)
                  The inner annotation grid also stacks on mobile
                  and goes side-by-side only at sm+              */}
              <RevealOnScroll>
                <section
                  className="relative mt-16 grid gap-8
                             sm:mt-20 sm:gap-10
                             md:grid-cols-[1fr_1.15fr] md:items-center md:gap-9
                             lg:mt-24 lg:gap-12"
                >
                  <LightningDoodle
                    aria-hidden
                    className="absolute -top-6 left-[-12px] hidden h-12 w-8 -rotate-[18deg] text-[var(--accent-lime)] lg:block"
                  />

                  {/* Left: editorial copy */}
                  <div>
                    <p className="kicker">a real line from a real report</p>
                    <h2
                      className="font-display mt-4 text-[1.5rem] font-bold leading-[1.12]
                                 sm:text-3xl
                                 md:text-4xl
                                 lg:text-5xl lg:leading-[1.05]"
                    >
                      It finds the line you{" "}
                      <span className="underline-wavy">already knew</span> was
                      cooked.
                    </h2>
                    <p className="mt-4 max-w-md text-base leading-7 text-[var(--ink-soft)] sm:mt-5">
                      No checklists. No AI mush. Just the exact sentence making
                      recruiters scroll past — and{" "}
                      <span className="font-semibold text-[var(--ink)]">why</span>,
                      in your sharpest friend&apos;s voice.
                    </p>
                  </div>

                  {/* Right: doc-line + annotation
                      Stack on mobile, side-by-side from sm                   */}
                  <div
                    className="grid gap-4
                               sm:grid-cols-[1fr_1.1fr] sm:gap-5 sm:items-start
                               md:gap-6"
                  >
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
                          &ldquo;Skills: Java, Python, C++, JavaScript, React,
                          Node, Angular, Vue, AWS, Azure, GCP, Docker,
                          Kubernetes, MongoDB, MySQL, Figma, Photoshop,
                          Leadership&rdquo;
                        </span>
                      </p>
                    </div>

                    <div className="annotation sev-savage">
                      <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--ink-mute)]">
                        what Roastume said
                      </p>
                      <p className="font-display mt-2 text-lg font-semibold leading-[1.3] sm:text-xl sm:text-[1.4rem]">
                        Pick a lane, bhai.
                        <br />
                        You&apos;re not a specialist anymore. You&apos;re the entire IT department.
                      </p>
                    </div>
                  </div>
                </section>
              </RevealOnScroll>

              {/* ── Testimonials ─────────────────────────────────── */}
              <RevealOnScroll>
                <section aria-labelledby="testimonials" className="relative mt-20 sm:mt-24">
                  <StarDoodle
                    aria-hidden
                    className="absolute right-2 top-2 hidden h-7 w-7 rotate-12 text-[var(--accent-pink)] lg:block"
                  />
                  <p className="kicker">straight from the group chats</p>
                  <h2
                    id="testimonials"
                    className="font-display mt-4 text-[1.5rem] font-bold leading-[1.12]
                               sm:text-3xl
                               md:text-4xl
                               lg:text-5xl lg:leading-[1.1]"
                  >
                    They came to laugh.
                    <br className="hidden sm:block" /> They left and{" "}
                    <span className="marker-green marker">fixed four lines.</span>
                  </h2>

                  {/* Cards: 1-col mobile → 2-col sm → 3-col lg */}
                  <div
                    className="mt-7 grid gap-4
                               sm:mt-9 sm:grid-cols-2 sm:gap-5
                               md:gap-6
                               lg:grid-cols-3"
                  >
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

                  {/* Trust strip */}
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--ink-mute)]">
                      used by folks at
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {TRUST_COMPANIES.map((c) => (
                        <span key={c} className="trust-chip">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>
              </RevealOnScroll>

              {/* ── Final CTA ───────────────────────────────────── */}
              <RevealOnScroll>
                <section
                  aria-labelledby="cta"
                  className="relative my-20 text-center sm:my-24"
                >
                  <ScribbleCircle
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-1/2 hidden
                               h-[140px] w-[300px] -translate-x-1/2 -translate-y-[42%]
                               text-[var(--accent-lime)] opacity-70
                               md:block md:h-[180px] md:w-[480px]"
                  />
                  <SparkleDoodle
                    aria-hidden
                    className="absolute left-[12%] top-0 hidden h-8 w-8 text-[var(--accent-pink)] lg:block"
                  />
                  <ExclaimDoodle
                    aria-hidden
                    className="absolute right-[14%] top-2 hidden h-12 w-3 rotate-[12deg] text-[var(--accent)] lg:block"
                  />

                  <h2
                    id="cta"
                    className="relative font-display mx-auto max-w-3xl text-[1.5rem] font-bold leading-[1.15]
                               sm:text-3xl
                               md:text-4xl
                               lg:text-5xl
                               2xl:text-6xl"
                  >
                    Okay, enough doomscrolling.
                    <br />
                    <span className="marker-green marker">
                      Find out what yours really says.
                    </span>
                  </h2>

                  <p className="mx-auto mt-5 max-w-sm px-2 text-sm text-[var(--ink-soft)] sm:max-w-md">
                    Drop the PDF, we&apos;ll handle the brutal honesty. Worst
                    case you laugh. Best case you fix the one line that&apos;s
                    been quietly costing you interviews.
                  </p>

                  <div className="mt-7 flex flex-col items-center gap-6 sm:gap-8">
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
                    <ShareAppButton iconOnly />
                  </div>
                </section>
              </RevealOnScroll>

              {/* ── Footer ──────────────────────────────────────── */}
              <footer
                className="border-t border-[var(--line)] px-4 py-7 text-center
                           text-xs leading-5 text-[var(--ink-mute)]
                           sm:px-0 sm:py-9"
              >
                <div className="mx-auto max-w-3xl flex items-center justify-center gap-4">
                  <div>
                    Roastume · AI resume review · made for people who
                    already kinda know · &copy; {new Date().getFullYear()}
                  </div>
                </div>
              </footer>
            </main>
          </motion.div>
        )}

        {/* ── Uploading state ──────────────────────────────────────── */}
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
                className="mx-auto text-5xl sm:text-6xl"
              >
                📄
              </motion.div>
              <p className="kicker mt-6 justify-center">reading your pdf</p>
              <h2
                className="font-display mt-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
              >
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

        {/* ── Processing state ─────────────────────────────────────── */}
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

        {/* ── Result state ─────────────────────────────────────────── */}
        {step === "result" && roastResult && (
          <RoastResultView
            key="result"
            roastResult={roastResult}
            shareId={shareId}
            onReset={reset}
          />
        )}

        {/* ── Sign-in gate ─────────────────────────────────────────── */}
        {step === "sign-in-required" && (
          <motion.div
            key="sign-in-required"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={CONTAINER_TRANSITION}
            className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16"
          >
            <div className="w-full max-w-3xl">
              <div className="mb-8 text-center">
                <p className="kicker">first one was on the house</p>
                <h2
                  className="font-display mt-3 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
                >
                  Sign in to roast{" "}
                  <span className="marker-pink marker">another</span>.
                </h2>
                <p className="mt-4 text-[var(--ink-soft)]">
                  You already used your free roast. One click with Google and
                  you&apos;re back in.
                </p>
              </div>
              <SignInGate />
              <div className="mt-6 text-center">
                <button
                  onClick={reset}
                  className="text-sm text-[var(--ink-mute)] underline-offset-4 hover:text-[var(--ink)] hover:underline"
                >
                  ← back
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Error state ──────────────────────────────────────────── */}
        {step === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={CONTAINER_TRANSITION}
            className="relative z-10 flex min-h-screen items-center justify-center px-6"
          >
            <div className="max-w-lg px-2 text-center">
              <p className="text-5xl sm:text-6xl">💀</p>
              <h2
                className="font-display mt-6 text-3xl font-bold sm:text-4xl md:text-5xl"
              >
                Welp, that flopped.
              </h2>
              <p className="mt-4 text-[var(--ink-soft)]">
                {error ??
                  "Make sure it's a real text-based PDF (not a scanned image) and give it another shot."}
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