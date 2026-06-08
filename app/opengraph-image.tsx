import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Roastume — the brutally honest AI resume review your friend won't give you";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "linear-gradient(135deg, #0b0810 0%, #181020 55%, #2a0f1a 100%)",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          color: "#fff5e6",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(closest-side, rgba(255,122,47,0.55), transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            left: -100,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background:
              "radial-gradient(closest-side, rgba(200,255,62,0.30), transparent 70%)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: -0.5,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            🔥
          </div>
          <span>Roastume</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -2,
              maxWidth: 1000,
            }}
          >
            Your resume is <span style={{ color: "#ff7a2f" }}>bluffing</span>.
            <br />
            We&apos;ll <span style={{ color: "#c8ff3e" }}>roast</span> the
            truth out of it.
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#e9d9c4",
              maxWidth: 980,
              lineHeight: 1.3,
            }}
          >
            Free AI resume review. Drop a PDF — get a savage, line-by-line
            critique in under a minute.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#9c8b9a",
          }}
        >
          <span>roastume.app</span>
          <span style={{ color: "#c8ff3e" }}>No signup · No fluff</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
