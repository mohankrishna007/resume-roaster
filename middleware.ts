import { NextResponse, type NextRequest } from "next/server";

/**
 * Flip MAINTENANCE_MODE=true in the deployment env to send every visitor
 * (and every API call) to /maintenance without touching code.
 *
 * Static assets, the maintenance page itself, and Next internals are skipped
 * so the page still renders.
 */
export function middleware(req: NextRequest) {
  if (process.env.MAINTENANCE_MODE !== "true") return NextResponse.next();

  const { pathname } = req.nextUrl;

  // Let the maintenance page + its assets through.
  if (pathname.startsWith("/maintenance")) return NextResponse.next();

  // API calls return JSON 503 instead of an HTML redirect.
  if (pathname.startsWith("/api")) {
    return NextResponse.json(
      { error: "maintenance", message: "Service temporarily unavailable." },
      { status: 503, headers: { "Retry-After": "300" } },
    );
  }

  const url = req.nextUrl.clone();
  url.pathname = "/maintenance";
  url.search = "";
  return NextResponse.rewrite(url, { status: 503 });
}

export const config = {
  matcher: ["/((?!_next/|favicon|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff2?)).*)"],
};
