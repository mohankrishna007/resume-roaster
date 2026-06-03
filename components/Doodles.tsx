"use client";
/**
 * Hand-drawn SVG doodles — all use `currentColor` so they pick up the
 * surrounding text color. Each is tiny and tree-shakeable.
 */

type Props = React.SVGProps<SVGSVGElement>;

export function ArrowDoodle(props: Props) {
  return (
    <svg viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 14 C 30 6, 56 36, 70 50 S 102 68, 112 60" />
      <path d="M112 60 L 100 56" />
      <path d="M112 60 L 106 72" />
    </svg>
  );
}

export function SparkleDoodle(props: Props) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" {...props}>
      <path d="M20 4 L20 36" />
      <path d="M4 20 L36 20" />
      <path d="M9 9 L31 31" />
      <path d="M31 9 L9 31" />
    </svg>
  );
}

export function StarDoodle(props: Props) {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor" stroke="currentColor"
      strokeWidth="1.5" strokeLinejoin="round" {...props}>
      <path d="M20 3 L24 16 L37 16 L26.5 24 L30 37 L20 29 L10 37 L13.5 24 L3 16 L16 16 Z" />
    </svg>
  );
}

export function ScribbleCircle(props: Props) {
  return (
    <svg viewBox="0 0 140 80" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M70 8 C 30 8, 8 28, 8 42 C 8 60, 38 72, 72 72 C 110 72, 132 58, 132 42 C 132 24, 104 10, 70 10" />
      <path d="M70 10 C 36 12, 14 26, 14 42" opacity="0.55" />
    </svg>
  );
}

export function SquiggleUnderline(props: Props) {
  return (
    <svg viewBox="0 0 200 16" fill="none" stroke="currentColor" strokeWidth="3"
      strokeLinecap="round" {...props}>
      <path d="M3 10 Q 20 0, 38 10 T 76 10 T 114 10 T 152 10 T 190 10" />
    </svg>
  );
}

export function LightningDoodle(props: Props) {
  return (
    <svg viewBox="0 0 40 60" fill="currentColor" stroke="currentColor"
      strokeWidth="1.5" strokeLinejoin="round" {...props}>
      <path d="M24 3 L6 32 L18 32 L14 57 L34 26 L22 26 Z" />
    </svg>
  );
}

export function HeartDoodle(props: Props) {
  return (
    <svg viewBox="0 0 40 36" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 33 C 6 23, 2 14, 8 8 C 14 2, 20 8, 20 12 C 20 8, 26 2, 32 8 C 38 14, 34 23, 20 33 Z" />
    </svg>
  );
}

export function SmileyDoodle(props: Props) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="20" cy="20" r="16" />
      <path d="M14 16 L14 18" />
      <path d="M26 16 L26 18" />
      <path d="M12 24 Q 20 32, 28 24" />
    </svg>
  );
}

export function PaperDoodle(props: Props) {
  return (
    <svg viewBox="0 0 50 60" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 4 L36 4 L46 14 L46 56 L8 56 Z" />
      <path d="M36 4 L36 14 L46 14" />
      <path d="M14 24 L40 24" opacity="0.6" />
      <path d="M14 32 L40 32" opacity="0.6" />
      <path d="M14 40 L32 40" opacity="0.6" />
      <path d="M14 48 L36 48" opacity="0.6" />
    </svg>
  );
}

export function ExclaimDoodle(props: Props) {
  return (
    <svg viewBox="0 0 24 60" fill="none" stroke="currentColor" strokeWidth="3.5"
      strokeLinecap="round" {...props}>
      <path d="M12 6 L12 38" />
      <circle cx="12" cy="50" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function ZigZagDoodle(props: Props) {
  return (
    <svg viewBox="0 0 80 30" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 26 L18 6 L32 26 L46 6 L60 26 L76 6" />
    </svg>
  );
}

export function FireDoodle(props: Props) {
  return (
    <svg viewBox="0 0 40 50" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 4 C 26 14, 32 18, 32 28 C 32 38, 26 46, 20 46 C 14 46, 8 38, 8 28 C 8 22, 12 18, 14 14 C 16 18, 18 20, 20 18 C 20 14, 18 10, 20 4 Z" />
      <path d="M20 30 C 22 32, 24 34, 24 38 C 24 42, 22 44, 20 44 C 18 44, 16 42, 16 38 C 16 34, 18 32, 20 30 Z" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
