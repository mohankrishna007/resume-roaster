// Re-export everything through a single barrel so callers keep using
// `@/components`. Internal moves don't ripple outward.

export { AnalyticsBoot } from "./AnalyticsBoot";

// animation
export { MagneticButton } from "./animation/MagneticButton";
export { RevealOnScroll } from "./animation/RevealOnScroll";
export { SplitText } from "./animation/SplitText";
export { TiltCard } from "./animation/TiltCard";

// auth
export { AuthProvider, useAuth } from "./auth/AuthProvider";
export { AuthBadge } from "./auth/AuthBadge";
export { GoogleOneTap } from "./auth/GoogleOneTap";
export { SignInGate } from "./auth/SignInGate";

// decoration
export { AnimatedBackground } from "./decoration/AnimatedBackground";
export * from "./decoration/Doodles";

// result view + its building blocks
export { BiggestTruth } from "./result/BiggestTruth";
export { CandidateSummary } from "./result/CandidateSummary";
export { HeroRoast } from "./result/HeroRoast";
export { PositivePoints } from "./result/PositivePoints";
export { ResumeLineCard, DocLine } from "./result/ResumeLineCard";
export { RoastCard } from "./result/RoastCard";
export { RoastResultView } from "./result/RoastResultView";
export { ScoresDisplay } from "./result/ScoresDisplay";
export { VerdictPanel } from "./result/VerdictPanel";

// upload flow
export { ProcessingScreen } from "./upload/ProcessingScreen";
export { UploadZone } from "./upload/UploadZone";

// ui primitives
export { AnnotationLabel } from "./ui/AnnotationLabel";
export { SectionKicker } from "./ui/SectionKicker";
export { FormattedText } from "./ui/FormattedText";

