import { NextRequest, NextResponse } from "next/server";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const LOG_DIR = path.join(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "auth.log");

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return JSON.stringify({ error: "meta_unserializable" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const record = {
      ts: typeof body?.ts === "string" ? body.ts : new Date().toISOString(),
      level: typeof body?.level === "string" ? body.level : "debug",
      message: typeof body?.message === "string" ? body.message : "[auth] unknown",
      meta: body?.meta ?? null,
      href: typeof body?.href === "string" ? body.href : null,
      userAgent: typeof body?.userAgent === "string" ? body.userAgent : req.headers.get("user-agent"),
      ip: req.headers.get("x-forwarded-for") ?? null,
    };

    await mkdir(LOG_DIR, { recursive: true });
    await appendFile(LOG_FILE, `${safeStringify(record)}\n`, "utf8");
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "failed_to_write_auth_log",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const raw = await readFile(LOG_FILE, "utf8");
    const lines = raw.trim().split("\n").filter(Boolean);
    const tail = lines.slice(-200).join("\n");
    return new NextResponse(tail, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new NextResponse("", {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }
}
