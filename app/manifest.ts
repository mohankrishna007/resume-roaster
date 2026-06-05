import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Resume Roaster",
    short_name: "Roaster",
    description:
      "Free AI resume roaster — drop a PDF, get a savage line-by-line review with concrete fixes.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0b0810",
    theme_color: "#0b0810",
    orientation: "portrait",
    categories: ["productivity", "business", "utilities"],
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
