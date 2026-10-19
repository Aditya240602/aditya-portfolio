"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Award,
  BarChart3,
  BookOpen,
  Braces,
  ChevronDown,
  ClipboardList,
  Code2,
  Database,
  GraduationCap,
  Github,
  Layout,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Server,
  Sparkles,
  Target,
  Terminal,
  Trophy,
  Users,
  Wrench,
  ArrowUpRight,
  Zap,
  Star,
  GitBranch,
  type LucideIcon,
} from "lucide-react";
import {
  education,
  leadership,
  openSource,
  projects,
  site,
  social,
  socials,
  stack,
  stats,
  type Project,
  type SocialId,
} from "@/data/site";
import { CardShell, CopyEmail, CountUp, ExtLink, ResumeButton, TagPill, btn, cn, useNav, type AccentKey } from "./ui";

/* ================================================================== */
/* Brand-style icon map for social platforms                           */
/* ================================================================== */
const socialIcon: Record<SocialId, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  leetcode: Code2,
  codeforces: BarChart3,
};

const socialAccent: Record<SocialId, AccentKey> = {
  github: "coral",
  linkedin: "violet",
  leetcode: "mint",
  codeforces: "yellow",
};

/* ================================================================== */
/* Floating technical symbols — hero illustration                      */
/* ================================================================== */
const techSymbols = [
  { text: "{}", x: "8%",  y: "18%", delay: 0,    size: "text-xl" },
  { text: "</>",x: "88%", y: "12%", delay: 0.4,  size: "text-sm" },
  { text: "=>", x: "80%", y: "72%", delay: 0.8,  size: "text-base" },
  { text: "C++",x: "5%",  y: "78%", delay: 1.2,  size: "text-xs" },
  { text: "∑",  x: "50%", y: "5%",  delay: 0.2,  size: "text-2xl" },
  { text: "//", x: "92%", y: "42%", delay: 0.6,  size: "text-base" },
  { text: "[]", x: "15%", y: "55%", delay: 1.0,  size: "text-base" },
  { text: "O(n)",x:"65%", y: "88%", delay: 1.4,  size: "text-xs" },
];

/* ================================================================== */
/* Developer mascot illustration (minimal SVG)                         */
/* ================================================================== */
function DevMascot({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Laptop base */}
      <rect x="14" y="72" width="92" height="8" rx="4" fill="rgb(var(--fg)/0.12)" />
      {/* Laptop screen */}
      <rect x="22" y="28" width="76" height="46" rx="6" fill="rgb(var(--card))" stroke="rgb(var(--line))" strokeWidth="2" />
      {/* Terminal lines on screen */}
      <rect x="30" y="38" width="20" height="2.5" rx="1.25" fill="rgb(var(--accent)/0.7)" />
      <rect x="30" y="45" width="40" height="2.5" rx="1.25" fill="rgb(var(--fg)/0.25)" />
      <rect x="30" y="52" width="30" height="2.5" rx="1.25" fill="rgb(var(--fg)/0.18)" />
      <rect x="30" y="59" width="12" height="2.5" rx="1.25" fill="rgb(var(--accent3)/0.7)" />
      {/* Cursor blink */}
      <rect x="44" y="59" width="2" height="2.5" rx="1" fill="rgb(var(--accent))" opacity="0.9" />
      {/* Screen dot decorations (traffic light) */}
      <circle cx="31" cy="33" r="2" fill="#ff6b5e" opacity="0.85" />
      <circle cx="38" cy="33" r="2" fill="#f5bf4f" opacity="0.85" />
      <circle cx="45" cy="33" r="2" fill="#5ec269" opacity="0.85" />
    </svg>
  );
}

/* ================================================================== */
/* Intro Card                                                          */
/* ================================================================== */
export function IntroCard({ resumeHref }: { resumeHref: string | null }) {
  const { go } = useNav();
  const reduce = useReducedMotion();

  return (
    <CardShell label="Intro" icon={Sparkles} index="01" accent="coral" cornerTag="Available">
      {/* Floating symbols — desktop only, decorative */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl hidden sm:block"
      >
        {techSymbols.map((sym, i) => (
          <motion.span
            key={i}
            className={cn(
              "absolute select-none font-mono font-medium opacity-0",
              sym.size,
            )}
            style={{ left: sym.x, top: sym.y, color: "rgb(var(--accent2))" }}
            initial={{ opacity: 0, y: 8 }}
            animate={reduce ? {} : {
              opacity: [0, 0.35, 0.35, 0],
              y: [8, 0, 0, -8],
            }}
            transition={{
              delay: sym.delay + 0.8,
              duration: 6,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut",
            }}
          >
            {sym.text}
          </motion.span>
        ))}
      </div>

      {/* Mascot illustration */}
      <div className="relative">
        <motion.div
          className="absolute -right-2 -top-2 hidden sm:block"
          initial={reduce ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <DevMascot className="h-24 w-24 opacity-90" />
        </motion.div>

        {/* Status badge */}
        <motion.div
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent3/30 bg-accent3/8 px-3 py-1.5"
          initial={reduce ? false : { opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span
            className="pulse-dot h-2 w-2 rounded-full bg-accent3"
            style={{ color: "rgb(var(--accent3) / 0.4)" }}
          />
          <span className="font-mono text-[11px] text-accent3">
            Open to internships
          </span>
        </motion.div>

        {/* Currently building label */}
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          {site.roles.join("  ·  ")}
        </p>

        {/* Main headline */}
        <h1 className="mt-3 font-serif text-[2.5rem] leading-[0.98] tracking-tight sm:text-[3.6rem] md:text-[4.2rem]">
          Hey, I'm{" "}
          <span
            className="italic"
            style={{ color: "rgb(var(--accent))" }}
          >
            Aditya Kumar.
          </span>
        </h1>

        {/* Currently building note */}
        <p className="mt-3 inline-flex max-w-full flex-wrap items-center gap-2 rounded-lg border border-line bg-bg/60 px-3 py-1.5 font-mono text-[11px] text-muted">
          <Zap size={11} className="text-accent4 shrink-0" aria-hidden />
          <span>Currently building: REST APIs · CLI tools · DSA mastery</span>
        </p>
      </div>

      <p className="mt-4 max-w-[34rem] text-base leading-relaxed text-fg/85">{site.intro}</p>
      <p className="mt-2 max-w-[34rem] text-[15px] leading-relaxed text-muted">{site.seeking}</p>

      {/* Info chips */}
      <ul className="mt-5 flex flex-wrap gap-2">
        <li className="chip gap-1.5">
          <GraduationCap size={12} aria-hidden /> {site.collegeShort} · {site.years}
        </li>
        <li className="chip gap-1.5">
          <MapPin size={12} aria-hidden /> {site.location}
        </li>
      </ul>

      {/* CTAs */}
      <div className="mt-7 flex flex-wrap gap-2.5" data-nodrag>
        <motion.button
          type="button"
          onClick={() => go("projects")}
          className={cn(btn.base, btn.primary, "text-white w-full sm:w-auto")}
          whileHover={reduce ? {} : { scale: 1.03 }}
          whileTap={reduce ? {} : { scale: 0.97 }}
        >
          Explore My Projects <ArrowUpRight size={15} aria-hidden />
        </motion.button>
        <ExtLink url={social("github").url} className={cn(btn.base, btn.outline, "flex-1 sm:flex-initial")}>
          <Github size={15} aria-hidden /> GitHub
        </ExtLink>
        <ExtLink url={social("linkedin").url} className={cn(btn.base, btn.outline, "flex-1 sm:flex-initial")}>
          <Linkedin size={15} aria-hidden /> LinkedIn
        </ExtLink>
        <button type="button" onClick={() => go("contact")} className={cn(btn.base, btn.outline, "flex-1 sm:flex-initial")}>
          <Mail size={15} aria-hidden /> Contact Me
        </button>
        <ResumeButton href={resumeHref} className="w-full sm:w-auto" />
      </div>

      {/* Quick profile links bar */}
      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line/60 pt-4" data-nodrag>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted">Profiles:</span>
        {socials.map((s) => {
          const Icon = socialIcon[s.id];
          return (
            <ExtLink
              key={s.id}
              url={s.url}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg/50 px-2.5 py-1 font-mono text-[11px] text-fg/80 transition hover:border-accent hover:text-accent hover:bg-accent/5"
            >
              <Icon size={12} aria-hidden />
              <span>{s.label}</span>
              <ArrowUpRight size={10} className="text-muted/60" aria-hidden />
            </ExtLink>
          );
        })}
      </div>
    </CardShell>
  );
}

/* ================================================================== */
/* Project Cards                                                       */
/* ================================================================== */

/* Terminal "traffic light" dots */
const Dots = () => (
  <span className="hidden gap-1.5 sm:flex" aria-hidden>
    {["#ff6b5e", "#f5bf4f", "#5ec269"].map((c) => (
      <i key={c} className="block h-2.5 w-2.5 rounded-full" style={{ background: c, opacity: 0.85 }} />
    ))}
  </span>
);

/* Animated bar row for metrics */
function BarRow({ name, pct, text, accent }: { name: string; pct: number; text: string; accent?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div className="grid grid-cols-[2.8rem_1fr_auto] sm:grid-cols-[3.2rem_1fr_auto] items-center gap-2 sm:gap-2.5">
      <span className="text-[#8d8b82] text-[11px] sm:text-[12px]">{name}</span>
      <div className="h-2 overflow-hidden rounded-sm bg-white/[0.07]">
        <motion.div
          className="h-full rounded-sm"
          style={{ background: accent ? "#FF775B" : "#5d5b54" }}
          initial={reduce ? false : { width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span className={accent ? "text-[#ffb59b]" : "text-[#b7b5ab]"}>{text}</span>
    </div>
  );
}

/** API benchmark visualization — figures from actual test data */
function ApiVisual() {
  return (
    <div className="term rounded-xl p-3.5 sm:p-4 font-mono text-[11px] sm:text-[12px] leading-relaxed overflow-x-auto">
      <div className="flex items-center justify-between gap-3 text-[#8d8b82] max-sm:justify-start">
        <Dots />
        <span className="truncate">autocannon · 100 → 1,500 connections</span>
      </div>

      <div className="mt-4 space-y-1.5">
        <p className="text-[#8d8b82]">throughput (req/s)</p>
        <BarRow name="before" pct={43} text="~5,000" />
        <BarRow name="after"  pct={100} text="11,600" accent />
      </div>

      <div className="mt-4 space-y-1.5">
        <p className="text-[#8d8b82]">p99 latency at peak load</p>
        <BarRow name="before" pct={100} text=">6.9 s" />
        <BarRow name="after"  pct={5}   text="<350 ms" accent />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
        <div className="rounded-lg bg-white/[0.04] px-3 py-2 text-center">
          <p className="text-[10px] text-[#8d8b82]">error rate</p>
          <p className="mt-0.5 text-[#7ad9a4] font-medium">0%</p>
        </div>
        <div className="rounded-lg bg-white/[0.04] px-3 py-2 text-center">
          <p className="text-[10px] text-[#8d8b82]">throughput gain</p>
          <p className="mt-0.5 text-[#ffb59b] font-medium">2.3×</p>
        </div>
      </div>
    </div>
  );
}

/** CLI task manager terminal visualization */
function CliVisual() {
  const tasks = [
    { done: true,  text: "✓ CRUD operations", color: "#7ad9a4" },
    { done: true,  text: "✓ Priority filtering", color: "#7ad9a4" },
    { done: true,  text: "✓ Multi-key sorting", color: "#7ad9a4" },
    { done: true,  text: "✓ CSV export", color: "#7ad9a4" },
    { done: false, text: "» Custom JSON serializer", color: "#ffb59b" },
  ];

  return (
    <div className="term rounded-xl p-3.5 sm:p-4 font-mono text-[11px] sm:text-[12px] leading-relaxed overflow-x-auto">
      <div className="flex items-center justify-between gap-3 text-[#8d8b82] max-sm:justify-start">
        <Dots />
        <span>taskflow · C++17</span>
      </div>

      <p className="mt-4">
        <span className="text-[#FF775B]">$</span> ctest --verbose
      </p>
      <p className="text-[#7ad9a4]">100% tests passed  (30+ assertions)</p>

      <ul className="mt-3 space-y-0.5 border-t border-white/10 pt-3">
        {tasks.map((t) => (
          <li key={t.text} style={{ color: t.color }}>{t.text}</li>
        ))}
      </ul>

      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3 text-[#b7b5ab]">
        <div>
          <p className="text-[#8d8b82] text-[10px]">compilers</p>
          <p>3 via CMake</p>
        </div>
        <div>
          <p className="text-[#8d8b82] text-[10px]">persistence</p>
          <p>custom JSON</p>
        </div>
      </div>

      <p className="mt-3">
        <span className="text-[#FF775B]">$</span> <span className="animate-blink">▌</span>
      </p>
    </div>
  );
}

const projectAccent: Record<string, AccentKey> = {
  ecommerce: "coral",
  taskflow: "violet",
};

const projectTag: Record<string, string> = {
  ecommerce: "API Project",
  taskflow: "CLI Project",
};

export function ProjectCard({ project: p, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false);
  const head = p.highlights.slice(0, 3);
  const rest = p.highlights.slice(3);
  const n = String(index + 1).padStart(2, "0");
  const accent = projectAccent[p.id] ?? "coral";

  return (
    <CardShell
      label={`Project ${n}`}
      icon={p.kind === "api" ? Server : Terminal}
      index={`${n}/02`}
      accent={accent}
      cornerTag={projectTag[p.id]}
    >
      {/* Featured badge & repository link */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <TagPill accent={accent}>Featured Project</TagPill>
        <ExtLink
          url={p.repo}
          className="inline-flex items-center gap-1 font-mono text-[11px] text-muted transition-colors hover:text-accent"
        >
          <Github size={12} aria-hidden />
          <span>Source Code</span>
          <ArrowUpRight size={11} aria-hidden />
        </ExtLink>
      </div>

      <ExtLink
        url={p.repo}
        className="group inline-flex items-center gap-2 transition-opacity hover:opacity-90 max-w-full"
      >
        <h2 className="font-serif text-[2rem] sm:text-[2.6rem] leading-none tracking-tight transition-colors group-hover:text-accent">
          {p.name}
        </h2>
        <ArrowUpRight
          size={20}
          className="shrink-0 text-muted/60 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
          aria-hidden
        />
      </ExtLink>
      <p
        className="mt-2 font-mono text-xs"
        style={{ color: `rgb(var(--${accent === "coral" ? "accent" : "accent2"}))` }}
      >
        {p.tagline}
      </p>
      <p className="mt-4 text-[15px] leading-relaxed text-fg/80">{p.description}</p>

      <div className="mt-5">{p.kind === "api" ? <ApiVisual /> : <CliVisual />}</div>

      <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
        {p.tech.map((t) => (
          <li key={t} className="chip">{t}</li>
        ))}
      </ul>

      <h3 className="label mt-6">Key highlights</h3>
      <ul className="mt-2.5 space-y-2.5 text-[14px] leading-snug text-fg/85">
        {head.map((h) => (
          <Highlight key={h} accent={accent}>{h}</Highlight>
        ))}
        <AnimatePresence initial={false}>
          {open &&
            rest.map((h) => (
              <motion.li
                key={h}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="flex gap-2.5 overflow-hidden"
              >
                <Bullet accent={accent} />
                <span>{h}</span>
              </motion.li>
            ))}
        </AnimatePresence>
      </ul>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3" data-nodrag>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted transition hover:text-fg self-start sm:self-auto"
        >
          {open ? "Show less" : `Show all ${p.highlights.length} highlights`}
          <ChevronDown size={14} aria-hidden className={cn("transition-transform", open && "rotate-180")} />
        </button>
        <ExtLink url={p.repo} className={cn(btn.base, btn.primary, "!py-2 text-white w-full sm:w-auto")}>
          <Github size={15} aria-hidden /> View Project Repo <ArrowUpRight size={14} aria-hidden />
        </ExtLink>
      </div>
    </CardShell>
  );
}

const Bullet = ({ accent }: { accent?: AccentKey }) => (
  <span
    aria-hidden
    className="mt-[3px] font-mono text-xs"
    style={{ color: `rgb(var(--${accent === "violet" ? "accent2" : "accent"}))` }}
  >
    ›
  </span>
);

const Highlight = ({ children, accent }: { children: React.ReactNode; accent?: AccentKey }) => (
  <li className="flex gap-2.5">
    <Bullet accent={accent} />
    <span>{children}</span>
  </li>
);

export const ProjectCards = () => projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />);

/* ================================================================== */
/* Stack Card                                                          */
/* ================================================================== */
const groupIcon: Record<string, LucideIcon> = {
  languages: Braces,
  frontend: Layout,
  backend: Server,
  databases: Database,
  tools: Wrench,
};

const groupAccent: Record<string, { badge: string; text: string }> = {
  languages: { badge: "bg-accent/10 text-accent", text: "text-accent" },
  frontend:  { badge: "bg-accent2/10 text-accent2", text: "text-accent2" },
  backend:   { badge: "bg-accent3/10 text-accent3", text: "text-accent3" },
  databases: { badge: "bg-accent4/10 text-accent4", text: "text-accent4" },
  tools:     { badge: "bg-muted/15 text-muted", text: "text-muted" },
};

/** Tech items that are actively being explored (vs. comfortable with) */
const exploringItems = new Set(["Django REST Framework", "Next.js", "PostgreSQL"]);

export function StackCard() {
  return (
    <CardShell label="Tech stack" icon={Braces} index="04" accent="mint">
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-serif text-[2rem] sm:text-[2.6rem] leading-none tracking-tight">Tools I build with</h2>
        <div className="mt-2 shrink-0 hidden sm:block">
          <GitBranch size={32} className="text-accent3/40" aria-hidden />
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-muted">
          <span className="h-2 w-2 rounded-full bg-accent3" aria-hidden /> Comfortable with
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-muted">
          <span className="h-2 w-2 rounded-full bg-accent4" aria-hidden /> Currently exploring
        </span>
      </div>

      <div className="mt-5 space-y-5">
        {stack.map((g) => {
          const Icon = groupIcon[g.id];
          const colors = groupAccent[g.id] ?? groupAccent.tools;
          return (
            <section key={g.id} aria-label={g.title}>
              <h3 className="label flex items-center gap-2">
                <span className={cn("icon-badge h-5 w-5 rounded-md text-[10px]", colors.badge)} aria-hidden>
                  <Icon size={10} />
                </span>
                {g.title}
              </h3>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {g.items.map((it) => {
                  const isExploring = exploringItems.has(it);
                  return (
                    <li
                      key={it}
                      className={cn(
                        "chip",
                        isExploring
                          ? "border-accent4/40 text-fg/70 hover:border-accent4/60 hover:text-accent4"
                          : "hover:border-accent3/50 hover:text-accent3",
                      )}
                    >
                      {isExploring && (
                        <Star size={9} className="text-accent4 opacity-80" aria-hidden />
                      )}
                      {it}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </CardShell>
  );
}

/* ================================================================== */
/* Achievements Card                                                   */
/* ================================================================== */
const platformMeta = {
  dsa:        { icon: Target,   name: "All platforms",  accent: "coral"  as AccentKey },
  leetcode:   { icon: Code2,    name: "LeetCode",       accent: "mint"   as AccentKey },
  codeforces: { icon: BarChart3,name: "Codeforces",     accent: "violet" as AccentKey },
  google:     { icon: Trophy,   name: "Google",         accent: "yellow" as AccentKey },
} as const;

const platformBadge: Record<string, string> = {
  dsa:        "bg-accent/10 text-accent",
  leetcode:   "bg-accent3/10 text-accent3",
  codeforces: "bg-accent2/10 text-accent2",
  google:     "bg-accent4/10 text-accent4",
};

export function AchievementsCard() {
  return (
    <CardShell label="Problem solving" icon={Trophy} index="05" accent="yellow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <TagPill accent="yellow">Problem Solving</TagPill>
          <h2 className="mt-2 font-serif text-[2rem] sm:text-[2.6rem] leading-none tracking-tight">
            Achievements
          </h2>
        </div>
        <Trophy size={36} className="mt-1 shrink-0 text-accent4/30 hidden sm:block" aria-hidden />
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-3">
        {stats.map((s) => {
          const m = platformMeta[s.platform ?? "dsa"];
          const Icon = m.icon;
          const badge = platformBadge[s.platform ?? "dsa"];
          return (
            <li
              key={s.id}
              className="group rounded-xl border border-line bg-bg/40 p-3 sm:p-4 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className={cn("icon-badge h-6 w-6 rounded-lg text-[11px]", badge)} aria-hidden>
                  <Icon size={11} />
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted truncate">{m.name}</span>
              </div>
              <CountUp
                value={s.value}
                prefix={s.prefix}
                suffix={s.suffix}
                className="mt-3 block whitespace-nowrap font-serif text-[clamp(1.35rem,5.5vw,2.4rem)] leading-none tracking-tight"
              />
              <p className="mt-2 text-[12px] leading-snug text-fg/80">{s.label}</p>
              {s.note && <p className="mt-0.5 font-mono text-[10px] text-muted truncate">{s.note}</p>}
            </li>
          );
        })}
      </ul>

      {/* Open source contribution */}
      <ExtLink
        url={openSource.url}
        className="mt-3 flex items-start gap-3 rounded-xl border border-accent3/20 bg-accent3/5 p-3.5 sm:p-4 transition-all hover:border-accent3/50 hover:-translate-y-0.5 hover:shadow-sm"
      >
        <Award size={18} className="mt-0.5 shrink-0 text-accent3" aria-hidden />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <TagPill accent="mint">Open Source</TagPill>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-accent3 truncate">
              gssoc.girlscript.tech <ArrowUpRight size={11} aria-hidden />
            </span>
          </div>
          <h3 className="mt-1.5 text-sm font-medium">{openSource.title}</h3>
          <p className="text-[13px] text-muted">{openSource.text}</p>
        </div>
      </ExtLink>

      {/* Profile links */}
      <div className="mt-4 flex flex-wrap gap-2" data-nodrag>
        {(["leetcode", "codeforces"] as SocialId[]).map((id) => {
          const Icon = socialIcon[id];
          const acc = socialAccent[id];
          return (
            <ExtLink key={id} url={social(id).url} className={cn(btn.base, btn.outline, "!py-2 flex-1 sm:flex-initial")}>
              <span
                className={cn("icon-badge h-5 w-5 rounded-md text-[10px]")}
                style={{ background: `rgb(var(--${acc === "mint" ? "accent3" : acc === "violet" ? "accent2" : "accent4"}) / 0.12)`, color: `rgb(var(--${acc === "mint" ? "accent3" : acc === "violet" ? "accent2" : "accent4"}))` }}
                aria-hidden
              >
                <Icon size={10} />
              </span>
              {social(id).label} profile <ArrowUpRight size={13} className="text-muted/60" aria-hidden />
            </ExtLink>
          );
        })}
      </div>
    </CardShell>
  );
}

/* ================================================================== */
/* Leadership Card                                                     */
/* ================================================================== */
export function LeadershipCard() {
  const L = leadership;
  const steps = [
    { icon: BookOpen, label: "DSA workshops" },
    { icon: ClipboardList, label: "Weekly problem sets" },
    { icon: MessageSquare, label: "Mentoring" },
  ];
  return (
    <CardShell label="Leadership" icon={Users} index="06" accent="violet">
      <TagPill accent="violet">Leadership</TagPill>
      <h2 className="mt-2 font-serif text-[2rem] sm:text-[2.6rem] leading-none tracking-tight">{L.role}</h2>
      <p className="mt-2 text-[15px]">{L.org}</p>
      <p className="mt-1 font-mono text-xs text-accent2">{L.period}</p>

      {/* Mentorship counter */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4 rounded-xl border border-accent2/20 bg-accent2/5 p-3.5 sm:p-4">
        <CountUp
          value={L.mentored.value}
          suffix={L.mentored.suffix}
          className="font-serif text-[2.8rem] sm:text-[3.4rem] leading-none tracking-tight text-accent2"
        />
        <p className="pb-1 text-[13px] leading-snug text-muted">{L.mentored.label}</p>
      </div>

      {/* Activity tiles */}
      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2" aria-label="What I do">
        {steps.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex sm:flex-col items-center gap-2.5 sm:gap-1.5 rounded-xl border border-line bg-bg/40 px-3 py-2.5 sm:py-3 text-left sm:text-center text-[12px] leading-tight transition-colors hover:border-accent2/40"
          >
            <span className="icon-badge h-7 w-7 rounded-xl bg-accent2/10 text-accent2 shrink-0" aria-hidden>
              <Icon size={14} />
            </span>
            <span>{label}</span>
          </li>
        ))}
      </ul>

      <ul className="mt-5 space-y-2.5 text-[14px] leading-snug text-fg/85">
        {L.bullets.map((b) => (
          <Highlight key={b} accent="violet">{b}</Highlight>
        ))}
      </ul>
    </CardShell>
  );
}

/* ================================================================== */
/* Education Card                                                      */
/* ================================================================== */
export function EducationCard() {
  return (
    <CardShell label="Education" icon={GraduationCap} index="07" accent="mint">
      <TagPill accent="mint">Education</TagPill>
      <h2 className="mt-2 font-serif text-[2rem] sm:text-[2.6rem] leading-none tracking-tight">Education</h2>
      <ol className="relative mt-6 space-y-6 border-l border-line pl-5 sm:pl-6">
        {education.map((e, i) => (
          <li key={e.school} className="relative">
            <span
              aria-hidden
              className={cn(
                "absolute -left-[27px] sm:-left-[31px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-card",
                i === 0 ? "bg-accent3" : "bg-muted/50",
              )}
            />
            <p className="font-mono text-xs text-muted">
              {e.years} · <span className="text-fg">{e.result}</span>
            </p>
            <h3 className="mt-1 text-[15px] font-medium leading-snug">{e.school}</h3>
            <p className="text-[13px] text-muted">{e.program}</p>
          </li>
        ))}
      </ol>
    </CardShell>
  );
}

/* ================================================================== */
/* Contact Card                                                        */
/* ================================================================== */
export function ContactCard({ resumeHref }: { resumeHref: string | null }) {
  return (
    <CardShell label="Contact" icon={Mail} index="08" accent="coral">
      {/* Terminal closing line */}
      <p className="mb-4 font-mono text-[11px] text-muted">
        <span className="text-accent">$</span>{" "}
        <span className="text-fg/60">echo</span>{" "}
        <span className="text-accent3">"Let's build something useful."</span>
      </p>

      <h2 className="font-serif text-[1.8rem] sm:text-[2.2rem] leading-[1.1] tracking-tight">{site.contactLine}</h2>

      {/* Availability note */}
      <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-accent3/25 bg-accent3/8 px-3 py-1.5 font-mono text-[11px] text-accent3">
        <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent3" style={{ color: "rgb(var(--accent3) / 0.4)" }} />
        Available for internships · Starting Summer 2027
      </p>

      {/* Email section */}
      <div className="mt-5 rounded-xl border border-line bg-bg/50 p-3.5 sm:p-4" data-nodrag>
        <p className="label">Email</p>
        <a
          href={`mailto:${site.email}`}
          className="mt-1 block select-text break-all font-mono text-[13px] text-accent underline-offset-4 hover:underline"
        >
          {site.email}
        </a>
        <div className="mt-3 flex flex-col sm:flex-row gap-2">
          <a href={`mailto:${site.email}`} className={cn(btn.base, btn.primary, "!py-2 justify-center")}>
            <Mail size={15} aria-hidden /> Send an email
          </a>
          <CopyEmail className="!py-2 justify-center" />
        </div>
      </div>

      {/* Social links */}
      <ul className="mt-3 grid gap-2 sm:grid-cols-2" data-nodrag>
        {socials.map((s) => {
          const Icon = socialIcon[s.id];
          const acc = socialAccent[s.id];
          const colorVar = acc === "mint" ? "accent3" : acc === "violet" ? "accent2" : acc === "yellow" ? "accent4" : "accent";
          return (
            <li key={s.id}>
              <ExtLink
                url={s.url}
                className="flex w-full items-center gap-2.5 rounded-xl border border-line bg-bg/50 px-3.5 py-3 text-sm transition hover:border-fg/30 hover:-translate-y-0.5 hover:shadow-sm"
              >
                <span
                  className="icon-badge h-7 w-7 rounded-lg shrink-0"
                  style={{ background: `rgb(var(--${colorVar}) / 0.12)`, color: `rgb(var(--${colorVar}))` }}
                  aria-hidden
                >
                  <Icon size={13} />
                </span>
                <span className="truncate">{s.label}</span>
              </ExtLink>
            </li>
          );
        })}
      </ul>

      <div className="mt-5" data-nodrag>
        <ResumeButton href={resumeHref} variant="primary" className="w-full sm:w-auto" />
      </div>

      {/* Footer terminal line */}
      <p className="mt-6 border-t border-line pt-4 font-mono text-[10px] text-muted/60">
        <span className="text-accent/60">// </span>
        Made with Next.js 15 · TypeScript · Tailwind CSS · Framer Motion
      </p>
    </CardShell>
  );
}
