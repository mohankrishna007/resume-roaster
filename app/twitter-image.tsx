// Twitter card mirrors the OpenGraph image. Static config exports must be
// declared in this file directly — Next.js can't detect them when they're
// re-exported from another module ("can't recognize the exported runtime
// field" warning).
export const runtime = "edge";
export const alt =
  "Resume Roaster — the brutally honest AI resume review your friend won't give you";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export { default } from "./opengraph-image";
