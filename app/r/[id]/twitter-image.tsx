// Twitter card mirrors the per-roast OpenGraph image. Static config exports
// must be declared here directly — Next.js can't detect them when they're
// re-exported from another module.
export const runtime = "nodejs";
export const alt = "A Resume Roaster verdict";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export { default } from "./opengraph-image";
