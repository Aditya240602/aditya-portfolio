/**
 * Single source of truth for the portfolio.
 * Edit this file to change content, links and canvas positions.
 *
 * URLs left as "" are treated as PENDING: the UI renders them as clearly marked,
 * non-clickable placeholders. Nothing here is an invented link.
 */

export const site = {
  name: "Aditya Kumar",
  roles: ["Computer Science Student", "Software Developer", "Competitive Programmer"],
  college: "Netaji Subhas University of Technology (NSUT), New Delhi",
  collegeShort: "NSUT",
  degree: "B.Tech in Computer Science and Engineering",
  years: "2024–2028",
  location: "East Delhi, India",
  email: "adityasarraff24082006@gmail.com",
  /** Set NEXT_PUBLIC_SITE_URL in your host (e.g. Vercel) once you have the real domain. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  headline: "Hey, I’m Aditya Kumar.",
  intro:
    "I’m a Computer Science student at NSUT who enjoys building reliable software, exploring backend engineering, and solving challenging algorithmic problems.",
  seeking:
    "Seeking software engineering internships where I can build scalable systems and contribute to meaningful products.",
  contactLine: "Have an interesting problem to solve or something worth building? Let’s connect.",
  description:
    "Aditya Kumar is a Computer Science student at NSUT, New Delhi: a software developer and competitive programmer building backend systems, optimizing performance and solving algorithmic problems.",

  /**
   * Drop your resume at public/resume.pdf. The button activates automatically
   * at build time when that file exists. Make sure it does not list a phone number.
   */
  resume: { publicPath: "/resume.pdf", downloadName: "Aditya-Kumar-Resume.pdf" },
} as const;

/* ------------------------------------------------------------------ */
/* Social profiles: fill in the url fields. Empty string = pending.    */
/* ------------------------------------------------------------------ */
export type SocialId = "github" | "linkedin" | "leetcode" | "codeforces";
export type Social = { id: SocialId; label: string; url: string };

export const socials: Social[] = [
  { id: "github", label: "GitHub", url: "https://github.com/Aditya240602" },
  { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/aditya-k-a82474323/" },
  { id: "leetcode", label: "LeetCode", url: "https://leetcode.com/u/Pinnacle_76/" },
  { id: "codeforces", label: "Codeforces", url: "https://codeforces.com/profile/adityak2006" },
];
export const social = (id: SocialId) => socials.find((s) => s.id === id)!;
export const isSet = (url?: string) => !!url && /^https?:\/\//.test(url);

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */
export type Project = {
  id: "ecommerce" | "taskflow";
  name: string;
  tagline: string;
  kind: "api" | "cli";
  tech: string[];
  description: string;
  highlights: string[];
  /** GitHub repository URL. Empty = pending placeholder. */
  repo: string;
};

export const projects: Project[] = [
  {
    id: "ecommerce",
    name: "E-Commerce API",
    tagline: "REST Backend for Order Management",
    kind: "api",
    tech: ["Node.js", "Express.js", "MongoDB", "Mongoose", "JWT", "Zod"],
    description:
      "A REST API for product catalogs, carts, checkout, and order management, with JWT authentication and role-based administrator access.",
    highlights: [
      "Increased peak sustained throughput from approximately 5,000 to 11,600 requests per second (2.3×).",
      "Reduced p99 latency under peak concurrent load from over 6.9 seconds to under 350 milliseconds.",
      "Maintained a 0% error rate across the reported test loads.",
      "Used systematic load testing with autocannon, scaling tests from 100 to 1,500 concurrent connections.",
      "Reworked the process model using Node.js cluster to utilize available CPU cores.",
      "Implemented precomputed and cached gzip-compressed responses.",
      "Added request validation and a self-invalidating in-memory product cache.",
    ],
    repo: "https://github.com/Aditya240602/e-commerce-api",
  },
  {
    id: "taskflow",
    name: "Taskflow CLI",
    tagline: "Terminal-Based Task Manager",
    kind: "cli",
    tech: ["C++17", "CMake", "CTest"],
    description:
      "A color-coded terminal task manager featuring full CRUD operations, priority filtering, keyword search, multi-key sorting, and CSV export.",
    highlights: [
      "Custom JSON serializer for local persistence.",
      "Modular architecture separating core logic, rendering, and I/O.",
      "Automated test suite with 30+ assertions and a 100% pass rate via CTest.",
      "Cross-platform CMake build tested across three compiler versions.",
      "Autosave on mutations to preserve data across sessions.",
    ],
    repo: "https://github.com/Aditya240602/taskflow-cli",
  },
];

/* ------------------------------------------------------------------ */
/* Tech stack (no skill bars, since percentages would be arbitrary)    */
/* ------------------------------------------------------------------ */
export const stack = [
  { id: "languages", title: "Languages", items: ["C++", "Java", "JavaScript", "TypeScript", "Python"] },
  { id: "frontend", title: "Frontend", items: ["React", "Next.js"] },
  {
    id: "backend",
    title: "Backend",
    items: ["Node.js", "Express.js", "Django REST Framework", "REST APIs", "JWT authentication"],
  },
  { id: "databases", title: "Databases", items: ["MongoDB", "PostgreSQL"] },
  { id: "tools", title: "Tools & platforms", items: ["Git", "GitHub", "CMake", "CTest", "Render", "Vercel"] },
] as const;

/* ------------------------------------------------------------------ */
/* Problem solving & achievements (from resume)                        */
/* ------------------------------------------------------------------ */
export type Stat = {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  note?: string;
  platform?: "leetcode" | "codeforces" | "google" | "dsa";
};

export const stats: Stat[] = [
  { id: "dsa", value: 881, suffix: "+", label: "DSA problems solved", note: "across platforms", platform: "dsa" },
  { id: "lc-solved", value: 551, suffix: "+", label: "LeetCode problems solved", platform: "leetcode" },
  { id: "lc-rating", value: 1612, label: "LeetCode rating", platform: "leetcode" },
  { id: "cf-rating", value: 1255, label: "Codeforces rating", platform: "codeforces" },
  {
    id: "lc-rank",
    value: 197733,
    prefix: "~",
    label: "LeetCode global rank",
    note: "approximate, per my resume",
    platform: "leetcode",
  },
  {
    id: "bigcode",
    value: 15000,
    prefix: "Top ",
    label: "Google Big Code, global",
    note: "competition ranking",
    platform: "google",
  },
];

export const openSource = {
  title: "GirlScript Summer of Code (GSSoC)",
  text: "Selected as an open-source contributor.",
  url: "https://gssoc.girlscript.tech/",
};

/* ------------------------------------------------------------------ */
/* Leadership                                                          */
/* ------------------------------------------------------------------ */
export const leadership = {
  role: "Head of DSA",
  org: "The Debugging Society, NSUT",
  period: "December 2025 – Present",
  mentored: { value: 100, suffix: "+", label: "students mentored across different academic years" },
  bullets: [
    "Lead coding workshops covering data structures and algorithms, from fundamentals to advanced concepts.",
    "Curate weekly problem sets.",
    "Mentor junior members on debugging, complexity analysis, and competitive programming strategy.",
    "Mentored 100+ students across different academic years.",
  ],
};

/* ------------------------------------------------------------------ */
/* Education                                                           */
/* ------------------------------------------------------------------ */
export const education = [
  {
    school: "Netaji Subhas University of Technology (NSUT)",
    program: "B.Tech in Computer Science and Engineering",
    years: "2024–2028",
    result: "CGPA: 7.85/10",
  },
  {
    school: "Universal Public School",
    program: "Class XII — Senior Secondary",
    years: "2022–2024",
    result: "91%",
  },
];

/* ------------------------------------------------------------------ */
/* Canvas layout (desktop). World units are CSS pixels at 100% zoom.   */
/* ------------------------------------------------------------------ */
export type CardId = "intro" | "ecommerce" | "taskflow" | "stack" | "achievements" | "leadership" | "education" | "contact";

export const canvas = {
  width: 2800,
  height: 2000,
  cards: {
    intro: { x: 140, y: 170, w: 600 },
    ecommerce: { x: 880, y: 110, w: 560 },
    taskflow: { x: 1540, y: 250, w: 500 },
    stack: { x: 2140, y: 120, w: 520 },
    achievements: { x: 140, y: 1200, w: 780 },
    leadership: { x: 1020, y: 1230, w: 540 },
    education: { x: 1660, y: 1260, w: 440 },
    contact: { x: 2200, y: 880, w: 520 },
  } satisfies Record<CardId, { x: number; y: number; w: number }>,
  /** Connectors between cards. l/r/t/b = which side of the card the line attaches to. */
  edges: [
    { from: "intro", to: "ecommerce", fromSide: "r", toSide: "l" },
    { from: "ecommerce", to: "taskflow", fromSide: "r", toSide: "l" },
    { from: "taskflow", to: "stack", fromSide: "r", toSide: "l" },
    { from: "intro", to: "achievements", fromSide: "b", toSide: "t" },
    { from: "achievements", to: "leadership", fromSide: "r", toSide: "l" },
    { from: "leadership", to: "education", fromSide: "r", toSide: "l" },
    { from: "education", to: "contact", fromSide: "r", toSide: "l" },
    { from: "stack", to: "contact", fromSide: "b", toSide: "t" },
  ] as { from: CardId; to: CardId; fromSide: "l" | "r" | "t" | "b"; toSide: "l" | "r" | "t" | "b" }[],
};

/** Navigation targets. A target can frame several cards at once. */
export const navItems: { key: string; label: string; ids: CardId[] }[] = [
  { key: "intro", label: "Intro", ids: ["intro"] },
  { key: "projects", label: "Projects", ids: ["ecommerce", "taskflow"] },
  { key: "stack", label: "Stack", ids: ["stack"] },
  { key: "achievements", label: "Achievements", ids: ["achievements"] },
  { key: "leadership", label: "Leadership", ids: ["leadership"] },
  { key: "education", label: "Education", ids: ["education"] },
  { key: "contact", label: "Contact", ids: ["contact"] },
];

export const cardOrder: CardId[] = [
  "intro",
  "ecommerce",
  "taskflow",
  "stack",
  "achievements",
  "leadership",
  "education",
  "contact",
];
