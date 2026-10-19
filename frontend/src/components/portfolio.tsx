"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Github, Linkedin } from "lucide-react";
import { cardOrder, navItems, projects, site, social, type CardId } from "@/data/site";
import { Canvas, type CanvasHandle } from "./canvas";
import {
  AchievementsCard,
  ContactCard,
  EducationCard,
  IntroCard,
  LeadershipCard,
  ProjectCard,
  StackCard,
} from "./cards";
import { ExtLink, NavContext, ThemeToggle, cn } from "./ui";

type Mode = "ssr" | "canvas" | "stack";
const QUERY = "(min-width: 1024px)";

/** Desktop gets the pan/zoom canvas; everything narrower gets a stacked layout. */
function useMode(): Mode {
  return useSyncExternalStore<Mode>(
    (cb) => {
      const m = window.matchMedia(QUERY);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => (window.matchMedia(QUERY).matches ? "canvas" : "stack"),
    () => "ssr",
  );
}

export default function Portfolio({ resumeHref, year }: { resumeHref: string | null; year: number }) {
  const mode = useMode();
  const reduce = useReducedMotion();
  const canvasRef = useRef<CanvasHandle>(null);
  const [active, setActive] = useState<CardId>("intro");
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    if (mode === "canvas") return;
    const onScroll = () => {
      setShowTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mode]);

  const go = useCallback(
    (key: string) => {
      const target = navItems.find((n) => n.key === key);
      if (!target) return;
      if (mode === "canvas") canvasRef.current?.flyTo(target.ids);
      else document.getElementById(target.ids[0])?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    },
    [mode, reduce],
  );

  const cards = useMemo<Record<CardId, React.ReactNode>>(
    () => ({
      intro:        <IntroCard resumeHref={resumeHref} />,
      ecommerce:    <ProjectCard project={projects[0]} index={0} />,
      taskflow:     <ProjectCard project={projects[1]} index={1} />,
      stack:        <StackCard />,
      achievements: <AchievementsCard />,
      leadership:   <LeadershipCard />,
      education:    <EducationCard />,
      contact:      <ContactCard resumeHref={resumeHref} />,
    }),
    [resumeHref],
  );

  /* scroll-spy for the stacked layout */
  useEffect(() => {
    if (mode === "canvas") return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id as CardId)),
      { rootMargin: "-35% 0px -55% 0px" },
    );
    cardOrder.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [mode]);

  const activeKey = navItems.find((n) => n.ids.includes(active))?.key ?? "intro";

  return (
    <NavContext.Provider value={{ go }}>
      {/* Skip to content */}
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-accent px-4 py-2 text-sm text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <Header activeKey={activeKey} go={go} />

      {mode === "canvas" ? (
        <Canvas ref={canvasRef} onActive={setActive} items={cardOrder.map((id) => ({ id, node: cards[id] }))} />
      ) : (
        <main
          id="main"
          className={cn("mx-auto max-w-2xl px-3.5 sm:px-4 pb-12 pt-28 sm:pt-32", mode === "ssr" && "ssr-pending")}
        >
          {cardOrder.map((id, i) => (
            <div key={id}>
              {i > 0 && (
                <div aria-hidden className="mx-auto h-8 w-px border-l border-dashed border-accent/30" />
              )}
              <motion.section
                id={id}
                data-card={id}
                className="scroll-mt-28 sm:scroll-mt-32"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {cards[id]}
              </motion.section>
            </div>
          ))}

          {/* Mobile footer */}
          <footer className="mt-12 border-t border-line pt-8 text-center">
            <p className="font-mono text-[11px] text-muted">
              <span className="text-accent">$</span> echo &quot;Built by {site.name} · {year}&quot;
            </p>
            <p className="mt-1 font-mono text-[10px] text-muted/50">
              Next.js 15 · TypeScript · Tailwind CSS · Framer Motion
            </p>
          </footer>
        </main>
      )}

      {/* Floating back-to-top button on mobile */}
      <AnimatePresence>
        {mode === "stack" && showTop && (
          <motion.button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            aria-label="Back to top"
            className="fixed bottom-5 right-5 z-40 grid h-10 w-10 place-items-center rounded-full border border-line bg-card/95 text-fg shadow-lift backdrop-blur transition hover:border-accent hover:text-accent active:scale-95"
          >
            <ArrowUp size={16} aria-hidden />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Canvas footer */}
      {mode === "canvas" && (
        <footer className="pointer-events-none fixed inset-x-0 bottom-4 z-10 flex justify-center p-0">
          <span className="rounded-full bg-bg/80 px-3 py-1 font-mono text-[11px] text-muted backdrop-blur">
            © {year} {site.name}
          </span>
        </footer>
      )}
    </NavContext.Provider>
  );
}

function Header({ activeKey, go }: { activeKey: string; go: (k: string) => void }) {
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const nav = navRef.current;
    const a = nav?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!nav || !a || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollTo({ left: a.offsetLeft - nav.clientWidth / 2 + a.clientWidth / 2, behavior: "smooth" });
  }, [activeKey]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)]">
      <div
        className={cn(
          "pointer-events-auto flex items-center justify-between gap-2.5 px-3.5 py-2.5 sm:px-6 sm:py-3",
          "border-b border-line bg-bg/90 backdrop-blur-md lg:pointer-events-none lg:border-0 lg:bg-transparent lg:backdrop-blur-none",
        )}
      >
        {/* Logo / name */}
        <a
          href="#main"
          onClick={(e) => { e.preventDefault(); go("intro"); }}
          className="pointer-events-auto flex items-center gap-2.5 transition-opacity hover:opacity-80"
          aria-label={`${site.name}, back to intro`}
        >
          <motion.span
            className="grid h-9 w-9 place-items-center rounded-xl bg-accent font-serif text-base italic text-white shadow-sm"
            whileHover={{ scale: 1.05, rotate: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 340, damping: 22 }}
          >
            AK
          </motion.span>
          <span className="hidden text-sm font-medium sm:block">{site.name}</span>
        </a>

        {/* Quick social links & theme toggle */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          <ExtLink
            url={social("github").url}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-card/90 text-fg shadow-card backdrop-blur transition hover:border-accent hover:text-accent"
          >
            <Github size={15} aria-hidden />
            <span className="sr-only">GitHub</span>
          </ExtLink>
          <ExtLink
            url={social("linkedin").url}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-card/90 text-fg shadow-card backdrop-blur transition hover:border-accent2 hover:text-accent2"
          >
            <Linkedin size={15} aria-hidden />
            <span className="sr-only">LinkedIn</span>
          </ExtLink>
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation pills */}
      <nav
        ref={navRef}
        aria-label="Sections"
        className={cn(
          "pointer-events-auto flex gap-1 overflow-x-auto border-b border-line bg-bg/90 px-3 py-1.5 sm:py-2 backdrop-blur-md [scrollbar-width:none] overscroll-x-contain",
          "lg:absolute lg:left-1/2 lg:top-3 lg:-translate-x-1/2 lg:overflow-visible lg:rounded-full lg:border lg:border-line/60 lg:bg-card/90 lg:p-1 lg:shadow-card",
        )}
      >
        {navItems.map((n) => {
          const on = n.key === activeKey;
          return (
            <a
              key={n.key}
              href={`#${n.ids[0]}`}
              aria-current={on ? "true" : undefined}
              onClick={(e) => { e.preventDefault(); go(n.key); }}
              className={cn(
                "relative shrink-0 rounded-full px-3 py-1 sm:px-3.5 sm:py-1.5 text-[12px] sm:text-[13px] font-medium transition-colors duration-150",
                on ? "text-white" : "text-muted hover:text-fg",
              )}
            >
              {on && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{n.label}</span>
            </a>
          );
        })}
      </nav>
    </header>
  );
}
