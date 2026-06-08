import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Setting this to true will profile the sampling of your transactions
  // Our profiling SDK is currently in Beta for JS
  profilesSampleRate: 1.0,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
