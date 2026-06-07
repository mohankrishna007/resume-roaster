import { ImageResponse } from "next/og";
import { getRoast } from "@/lib/roast/store";

// Node runtime so we can reuse the firebase-admin SDK from getRoast.
// Edge runtime can't load firebase-admin (Node-only dependencies).
export const runtime = "nodejs";
export const alt = "A Resume Roaster verdict";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Params {
  params: Promise<{ id: string }>;
}

export default async function OgImage({ params }: Params) {
  const { id } = await params;
  const stored = await getRoast(id);

  const name = stored?.result.candidate.name?.trim() || "Anonymous";
  const archetype = stored?.result.archetype.title || "A resume got roasted";
  const score = stored?.result.scores.overall;
  const quote =
    stored?.result.verdict.share_quote ||
    "Drop your resume. Get a savage AI roast in under a minute.";

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
            top: -140,
            right: -140,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background:
              "radial-gradient(closest-side, rgba(255,122,47,0.55), transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -180,
            left: -120,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(closest-side, rgba(200,255,62,0.25), transparent 70%)",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              🔥
            </div>
            <span>Resume Roaster</span>
          </div>
          {typeof score === "number" && (
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.08)",
                border: "1.5px solid rgba(255,240,220,0.22)",
              }}
            >
              <span style={{ fontSize: 36, fontWeight: 800, color: "#c8ff3e" }}>
                {score}
              </span>
              <span style={{ fontSize: 20, color: "#9c8b9a" }}>/10</span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontSize: 22,
              textTransform: "uppercase",
              letterSpacing: 4,
              color: "#ff7a2f",
              fontWeight: 700,
            }}
          >
            {name}&apos;s resume · roasted
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              maxWidth: 1040,
            }}
          >
            “{truncate(quote, 140)}”
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#e9d9c4",
              maxWidth: 1000,
            }}
          >
            {truncate(archetype, 100)}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "#9c8b9a",
          }}
        >
          <span>roastume.app</span>
          <span style={{ color: "#c8ff3e" }}>Roast yours · free</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}
