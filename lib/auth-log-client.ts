"use client";

type AuthLogLevel = "debug" | "info" | "warn" | "error";

interface AuthLogPayload {
  ts: string;
  level: AuthLogLevel;
  message: string;
  meta?: unknown;
  href?: string;
  userAgent?: string;
}

const AUTH_LOG_ENDPOINT = "/api/auth-logs";

export function authLog(level: AuthLogLevel, message: string, meta?: unknown): void {
  const payload: AuthLogPayload = {
    ts: new Date().toISOString(),
    level,
    message,
    meta,
    href: typeof window !== "undefined" ? window.location.href : undefined,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
  };

  const logger = level === "error" ? console.error : level === "warn" ? console.warn : console.debug;
  logger(message, meta ?? "");

  if (typeof window === "undefined") return;

  try {
    const body = JSON.stringify(payload);
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(AUTH_LOG_ENDPOINT, blob)) return;
    }

    void fetch(AUTH_LOG_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    // Swallow all logging transport errors to avoid impacting auth flow.
  }
}
