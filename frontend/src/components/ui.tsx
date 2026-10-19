"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { animate, motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { Check, Copy, Download, Moon, Sun, type LucideIcon } from "lucide-react";
import { isSet, site } from "@/data/site";

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/* ---------------- navigation context ---------------- */
export const NavContext = createContext<{ go: (key: string) => void }>({ go: () => {} });
export const useNav = () => useContext(NavContext);

/* ================================================================== */
/* Accent color system                                                 */
/* Maps card labels to distinct accents for visual grouping           */
/* ================================================================== */
export type AccentKey = "coral" | "violet" | "mint" | "yellow";

export const accentClasses: Record<AccentKey, {
  badge: string;
  text: string;
  strip: string;
  glow: string;
  chip: string;
}> = {
  coral: {
    badge: "bg-accent/12 text-accent",
    text: "text-accent",
    strip: "bg-accent",
    glow: "hover:shadow-glow",
    chip: "hover:border-accent/50 hover:text-accent hover:bg-accent/6",
  },
  violet: {
    badge: "bg-accent2/12 text-accent2",
    text: "text-accent2",
    strip: "bg-accent2",
    glow: "hover:shadow-glow2",
    chip: "hover:border-accent2/50 hover:text-accent2 hover:bg-accent2/6",
  },
  mint: {
    badge: "bg-accent3/12 text-accent3",
    text: "text-accent3",
    strip: "bg-[rgb(var(--accent3))]",
    glow: "hover:shadow-[0_0_0_1px_rgb(var(--accent3)/0.15),0_8px_32px_-8px_rgb(var(--accent3)/0.20)]",
    chip: "hover:border-[rgb(var(--accent3)/0.5)] hover:text-[rgb(var(--accent3))]",
  },
  yellow: {
    badge: "bg-accent4/12 text-accent4",
    text: "text-accent4",
    strip: "bg-[rgb(var(--accent4))]",
    glow: "hover:shadow-[0_0_0_1px_rgb(var(--accent4)/0.15),0_8px_32px_-8px_rgb(var(--accent4)/0.20)]",
    chip: "hover:border-[rgb(var(--accent4)/0.5)] hover:text-[rgb(var(--accent4))]",
  },
};

/* ================================================================== */
/* CardShell                                                           */
/* ================================================================== */
export function CardShell({
  label,
  icon: Icon,
  index,
  children,
  className,
  accent = "coral",
  cornerTag,
}: {
  label: string;
  icon: LucideIcon;
  index: string;
  children: React.ReactNode;
  className?: string;
  accent?: AccentKey;
  cornerTag?: string;
}) {
  const colors = accentClasses[accent];

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-line bg-card shadow-card transition-shadow duration-300",
        colors.glow,
        className,
      )}
    >
      {/* Top accent strip */}
      <span aria-hidden className={cn("card-accent-strip", colors.strip)} />

      {/* Corner decorative tag */}
      {cornerTag && (
        <span
          aria-hidden
          className="absolute right-4 top-3 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest"
          style={{ background: "rgb(var(--accent) / 0.10)", color: "rgb(var(--accent))" }}
        >
          {cornerTag}
        </span>
      )}

      {/* Card header */}
      <header className="flex items-center justify-between border-b border-line px-4 py-2.5 sm:px-5 sm:py-3">
        <span className="label flex items-center gap-2">
          {/* Icon badge */}
          <span
            className={cn("icon-badge h-6 w-6 rounded-lg text-[12px]", colors.badge)}
            aria-hidden
          >
            <Icon size={12} />
          </span>
          {label}
        </span>
        <span className="font-mono text-[11px] text-muted/60" aria-hidden>
          {index}
        </span>
      </header>

      <div className="p-4 sm:p-6 md:p-7">{children}</div>
    </motion.article>
  );
}

/* ================================================================== */
/* Placeholder-aware external link                                     */
/* ================================================================== */
export function ExtLink({
  url,
  className,
  children,
  hideBadge,
}: {
  url: string;
  className?: string;
  children: React.ReactNode;
  hideBadge?: boolean;
}) {
  if (isSet(url)) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <span
      aria-disabled="true"
      title="URL not added yet. Set it in src/data/site.ts"
      className={cn(className, "cursor-not-allowed !border-dashed opacity-60 hover:!translate-y-0")}
    >
      {children}
      <span className="sr-only"> (link not added yet)</span>
      {!hideBadge && (
        <span
          aria-hidden
          className="ml-1.5 rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent"
        >
          URL pending
        </span>
      )}
    </span>
  );
}

/* ================================================================== */
/* Buttons                                                             */
/* ================================================================== */
export const btn = {
  base: "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.97]",
  primary:
    "border-accent bg-accent text-white hover:bg-accent/90 hover:border-accent/90 shadow-sm hover:shadow-md",
  outline:
    "border-line bg-card text-fg hover:border-fg/30 hover:-translate-y-0.5 hover:shadow-sm",
  ghost:
    "border-transparent bg-transparent text-muted hover:text-fg hover:bg-fg/6",
};

export function ResumeButton({
  href,
  variant = "outline",
  className,
}: {
  href: string | null;
  variant?: "primary" | "outline";
  className?: string;
}) {
  const cls = cn(btn.base, btn[variant], className);
  if (href) {
    return (
      <a href={href} download={site.resume.downloadName} className={cls}>
        <Download size={15} aria-hidden /> Download Resume
      </a>
    );
  }
  return (
    <span
      aria-disabled="true"
      title="Resume placeholder: add your PDF at public/resume.pdf and rebuild"
      className={cn(cls, "cursor-not-allowed !border-dashed opacity-60 hover:!translate-y-0")}
    >
      <Download size={15} aria-hidden /> Download Resume
      <span className="sr-only"> (resume file not added yet)</span>
      <span aria-hidden className="rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent">
        PDF pending
      </span>
    </span>
  );
}

/* ================================================================== */
/* Count-up number                                                     */
/* ================================================================== */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const fmt = (n: number) => `${prefix}${Math.round(n).toLocaleString("en-US")}${suffix}`;
  const [text, setText] = useState(fmt(0));

  useEffect(() => {
    if (!inView) return;
    if (reduce) return setText(fmt(value));
    const c = animate(0, value, { duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setText(fmt(v)) });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{fmt(value)}</span>
      <span aria-hidden>{text}</span>
    </span>
  );
}

/* ================================================================== */
/* Copy email                                                          */
/* ================================================================== */
export function CopyEmail({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
    } catch {
      const t = document.createElement("textarea");
      t.value = site.email;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button type="button" onClick={copy} className={cn(btn.base, btn.outline, className)} data-nodrag>
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
            <Check size={15} aria-hidden />
          </motion.span>
        ) : (
          <motion.span key="copy" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
            <Copy size={15} aria-hidden />
          </motion.span>
        )}
      </AnimatePresence>
      <span aria-live="polite">{copied ? "Copied!" : "Copy email"}</span>
    </button>
  );
}

/* ================================================================== */
/* Theme Toggle — animated sun/moon                                    */
/* ================================================================== */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
    setDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      data-nodrag
      className="grid h-9 w-9 place-items-center rounded-full border border-line bg-card/90 text-fg shadow-card backdrop-blur transition-all duration-200 hover:border-accent/40 hover:text-accent"
    >
      <AnimatePresence mode="wait" initial={false}>
        {!mounted ? (
          <motion.span key="placeholder" className="h-4 w-4" />
        ) : dark ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <Sun size={16} aria-hidden />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <Moon size={16} aria-hidden />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/* ================================================================== */
/* Section label pill (for card category tags)                         */
/* ================================================================== */
export function TagPill({ children, accent = "coral" }: { children: React.ReactNode; accent?: AccentKey }) {
  const colors = accentClasses[accent];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest", colors.badge)}>
      {children}
    </span>
  );
}
