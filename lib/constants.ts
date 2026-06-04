/**
 * Shared constants used across the application.
 * Extracted to reduce module parsing overhead and enable code sharing.
 */

export const TICKER_LINES = [
  "“bro it read me for filth 😭”",
  "caught my fake 80% optimization in 4 seconds ☠️",
  "“passionate team player” → publicly executed",
  "sent it to the group chat. they sent it to theirs.",
  "my recruiter friend said ‘yeah this is what i think too’",
  "buzzword count hit 23. i am ashamed.",
  "“results-driven” is now banned in my house",
  "fixed 4 lines before i even finished reading",
  "finally feedback that doesn’t sound like a LinkedIn post 🫡",
  "this app knows i panic-added ‘leadership’ at 2am",
] as const;

export const TESTIMONIALS = [
  {
    seed: "Priya",
    name: "Priya, SDE-2",
    handle: "Bengaluru",
    quote:
      "first feedback that actually called out my fake metrics. brutal, healing, 10/10.",
  },
  {
    seed: "Rohit",
    name: "Rohit, PM",
    handle: "Hyderabad",
    quote:
      "my “results-driven team player” line got demolished in 2 sentences. i deserved that.",
  },
  {
    seed: "Aanya",
    name: "Aanya, Frontend",
    handle: "Mumbai",
    quote:
      "screenshot → WhatsApp group → cried laughing → fixed my resume same night.",
  },
] as const;

export const TRUST_COMPANIES = [
  "Razorpay",
  "Swiggy",
  "Microsoft",
  "TCS",
  "Zomato",
  "Flipkart",
] as const;

export const CONTAINER_TRANSITION = { duration: 0.4 } as const;
