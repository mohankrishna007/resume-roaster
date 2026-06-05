import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://resume-roaster.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /api/* never has indexable content. /r/* pages are user-shared
        // roast snapshots — they're great for social previews but create
        // thin/duplicate search results, so keep crawlers out. The per-page
        // <meta robots> on /r/[id] already says noindex; this is an extra
        // layer that also blocks crawling cost.
        disallow: ["/api/", "/r/", "/maintenance"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
