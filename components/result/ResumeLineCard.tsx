"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUpStaggered } from "@/lib/motion";
import { SEVERITY_META, type SevKey } from "@/lib/roast/severity";
import type { Severity } from "@/types/roast";
import { AnnotationLabel } from "../ui/AnnotationLabel";
import { FormattedText } from "../ui/FormattedText";

interface ResumeLineCardProps {
  /** Drives the visual treatment + icon. */
  severity: Severity | "actually_good";
  /** 1-based index — used both for the stagger and the L01/W01 stamp. */
  index: number;
  /** Prefix on the doc stamp — "L" for roasts, "W" for wins. */
  numberPrefix?: "L" | "W";
  /** The exact line lifted from the resume. Omit to render annotation-only. */
  resumeLine?: string;
  /** Eyebrow on the annotation panel. */
  annotationLabel: ReactNode;
  /** Short reaction line ("BHAI 💀", "WAIT 😭"). */
  reaction?: string;
  /** The actual roast / callout. */
  body: string;
  /** Optional footer slot — used for the "try this" fix row. */
  footer?: ReactNode;
}

/**
 * The two-column annotated-document card used by both the roast feed and the
 * wins list. Left = the resume line as a quoted doc; right = the roaster's
 * annotation. When `resumeLine` is omitted, renders annotation-only.
 */
export function ResumeLineCard({
  severity,
  index,
  numberPrefix = "L",
  resumeLine,
  annotationLabel,
  reaction,
  body,
  footer,
}: ResumeLineCardProps) {
  const meta = SEVERITY_META[severity];
  const lineNum = String(index + 1).padStart(2, "0");

  const renderFormatted = (text: string) => {
    return <FormattedText text={text} />;
  };

  if (!resumeLine) {
    return (
      <motion.div
        {...fadeUpStaggered(index)}
        className={`annotation sev-${meta.key}`}
      >
        <AnnotationLabel>
          {numberPrefix}
          {lineNum} · {annotationLabel}
        </AnnotationLabel>
        {reaction && (
          <p className="mt-2 text-sm font-semibold text-[var(--ink-soft)]">
            {renderFormatted(reaction)}
          </p>
        )}
        <p className="font-display mt-2 text-lg leading-[1.3] font-semibold sm:text-xl md:text-[1.3rem] lg:text-[1.4rem]">
          {renderFormatted(body)}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      {...fadeUpStaggered(index)}
      className="grid gap-4 sm:gap-5 md:grid-cols-[1fr_1.15fr] md:gap-6 md:items-start lg:gap-8"
    >
      <DocLine sevKey={meta.key} number={`${numberPrefix}${lineNum}`} text={resumeLine}>
        <div className={`sev-stamp sev-${meta.key}`}>
          <meta.Icon className="h-3 w-3" />
          {meta.label}
        </div>
      </DocLine>

      <div className="space-y-3">
        <div className={`annotation sev-${meta.key}`}>
          <AnnotationLabel>{annotationLabel}</AnnotationLabel>
          {reaction && (
            <p className="mt-2 text-sm font-semibold text-[var(--ink-soft)]">
              {renderFormatted(reaction)}
            </p>
          )}
          <p className="font-display mt-2 text-lg leading-[1.3] font-semibold sm:text-xl md:text-[1.3rem] lg:text-[1.4rem]">
            {renderFormatted(body)}
          </p>
        </div>
        {footer}
      </div>
    </motion.div>
  );
}

/**
 * The quoted resume-line block. Exported for the static demo on the landing
 * page where we hand-author both sides without an animation wrapper.
 */
export function DocLine({
  sevKey,
  number,
  text,
  children,
}: {
  sevKey: SevKey;
  number: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <div className={`doc-line sev-${sevKey}`}>
      {children}
      <div className="doc-meta">
        <span className="doc-num">{number}</span>
        <span>your resume said</span>
      </div>
      <p className="doc-text">
        <span className="doc-text-highlight">&ldquo;{text}&rdquo;</span>
        <span className="annot-caret md:hidden" aria-hidden>
          ↘
        </span>
      </p>
    </div>
  );
}
