import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Firebase signInWithPopup needs the popup to postMessage back to the
        // opener. Modern browsers block that under the default COOP, which
        // shows up as the Google tab opening and immediately closing with
        // no sign-in. `same-origin-allow-popups` keeps the rest of COOP's
        // isolation while permitting the OAuth popup handshake.
        source: "/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        ],
      },
    ];
  },
};

export default nextConfig;
