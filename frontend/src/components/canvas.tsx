"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { Home, Maximize2, Minus, Plus } from "lucide-react";
import { canvas, type CardId } from "@/data/site";

export type CanvasHandle = { flyTo: (ids: CardId[]) => void; fit: () => void };
type Item = { id: CardId; node: React.ReactNode };
type Side = "l" | "r" | "t" | "b";

const MIN = 0.3;
const MAX = 1.6;
const PAD = { x: 56, top: 96, bottom: 64 };
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const cardEl = (id: CardId) => document.getElementById(`card-${id}`);

/* ================================================================== */
/* Edge accent colors — meaningful visual grouping                     */
/* ================================================================== */
type EdgeGroup = "projects" | "personal" | "connect";

const edgeGroup: Record<string, EdgeGroup> = {
  "intro-ecommerce":       "projects",
  "ecommerce-taskflow":    "projects",
  "taskflow-stack":        "projects",
  "intro-achievements":    "personal",
  "achievements-leadership": "personal",
  "leadership-education":  "personal",
  "education-contact":     "connect",
  "stack-contact":         "connect",
};

const edgeColor: Record<EdgeGroup, string> = {
  projects: "rgb(var(--accent)  / 0.55)",   /* coral */
  personal: "rgb(var(--accent2) / 0.50)",   /* violet */
  connect:  "rgb(var(--accent3) / 0.50)",   /* mint */
};

const dotColor: Record<EdgeGroup, string> = {
  projects: "rgb(var(--accent))",
  personal: "rgb(var(--accent2))",
  connect:  "rgb(var(--accent3))",
};

/* ================================================================== */
/* Canvas component                                                    */
/* ================================================================== */
export const Canvas = forwardRef<CanvasHandle, { items: Item[]; onActive: (id: CardId) => void }>(function Canvas(
  { items, onActive },
  ref,
) {
  const vp = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const s = useMotionValue(1);
  const reduce = useReducedMotion();
  const tween = useRef<{ stop: () => void } | null>(null);
  const drag = useRef<{ px: number; py: number; x0: number; y0: number; moved: boolean } | null>(null);
  const lastActive = useRef<CardId | null>(null);
  const raf = useRef(0);
  const [heights, setHeights] = useState<Partial<Record<CardId, number>>>({});
  const [grabbing, setGrabbing] = useState(false);
  const [pct, setPct] = useState(100);
  const [activeId, setActiveId] = useState<CardId>("intro");

  /* ---------- view math ---------- */
  const box = () => vp.current!.getBoundingClientRect();
  const limit = (nx: number, ny: number, ns: number) => {
    const { width: w, height: h } = box();
    const sc = clamp(ns, MIN, MAX);
    return {
      x: clamp(nx, w * 0.4 - canvas.width * sc, w * 0.6),
      y: clamp(ny, h * 0.4 - canvas.height * sc, h * 0.6),
      s: sc,
    };
  };
  const stop = () => { tween.current?.stop(); tween.current = null; };
  const set = (nx: number, ny: number, ns: number) => {
    const v = limit(nx, ny, ns);
    x.set(v.x); y.set(v.y); s.set(v.s);
  };
  const moveTo = (nx: number, ny: number, ns: number, instant = false) => {
    stop();
    const v = limit(nx, ny, ns);
    if (instant || reduce) return set(v.x, v.y, v.s);
    const [x0, y0, s0] = [x.get(), y.get(), s.get()];
    tween.current = animate(0, 1, {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (t) => {
        x.set(x0 + (v.x - x0) * t);
        y.set(y0 + (v.y - y0) * t);
        s.set(s0 + (v.s - s0) * t);
      },
    });
  };
  const frame = (ids: CardId[], instant = false) => {
    const { width: w, height: h } = box();
    let [x1, y1, x2, y2] = [Infinity, Infinity, -Infinity, -Infinity];
    ids.forEach((id) => {
      const c = canvas.cards[id];
      const hh = cardEl(id)?.offsetHeight ?? 600;
      x1 = Math.min(x1, c.x);
      y1 = Math.min(y1, c.y);
      x2 = Math.max(x2, c.x + c.w);
      y2 = Math.max(y2, c.y + hh);
    });
    const bw = x2 - x1;
    const bh = y2 - y1;
    const aw = w - PAD.x * 2;
    const ah = h - PAD.top - PAD.bottom;
    const sc = clamp(Math.min(aw / bw, ah / bh, 1), MIN, MAX);
    moveTo(PAD.x + (aw - bw * sc) / 2 - x1 * sc, PAD.top + (ah - bh * sc) / 2 - y1 * sc, sc, instant);
  };
  const zoomAt = (cx: number, cy: number, factor: number, smooth = false) => {
    const r = box();
    const [px, py, s0] = [cx - r.left, cy - r.top, s.get()];
    const ns = clamp(s0 * factor, MIN, MAX);
    const k = ns / s0;
    const nx = px - (px - x.get()) * k;
    const ny = py - (py - y.get()) * k;
    smooth ? moveTo(nx, ny, ns) : (stop(), set(nx, ny, ns));
  };
  const zoomCenter = (f: number) => {
    const r = box();
    zoomAt(r.left + r.width / 2, r.top + r.height / 2, f, true);
  };

  const allIds = items.map((i) => i.id);
  useImperativeHandle(ref, () => ({ flyTo: (ids) => frame(ids), fit: () => frame(allIds) }));

  /* ---------- initial view ---------- */
  useLayoutEffect(() => {
    frame(["intro", "ecommerce"], true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- wheel handler ---------- */
  useEffect(() => {
    const el = vp.current!;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      stop();
      if (e.ctrlKey || e.metaKey) return zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.0025));
      const k = e.deltaMode === 1 ? 16 : 1;
      let dx = e.deltaX * k;
      const dy = e.deltaY * k;
      if (e.shiftKey && !dx) return set(x.get() - dy, y.get(), s.get());
      set(x.get() - dx, y.get() - dy, s.get());
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- drag ---------- */
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest("a,button,input,textarea,select,[data-nodrag]")) return;
    stop();
    drag.current = { px: e.clientX, py: e.clientY, x0: x.get(), y0: y.get(), moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.px;
    const dy = e.clientY - d.py;
    if (!d.moved) {
      if (Math.hypot(dx, dy) < 4) return;
      d.moved = true;
      vp.current!.setPointerCapture(e.pointerId);
      setGrabbing(true);
    }
    set(d.x0 + dx, d.y0 + dy, s.get());
  };
  const endDrag = (e: React.PointerEvent) => {
    if (drag.current?.moved && vp.current!.hasPointerCapture(e.pointerId)) vp.current!.releasePointerCapture(e.pointerId);
    drag.current = null;
    setGrabbing(false);
  };

  /* ---------- keyboard ---------- */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    const step = e.shiftKey ? 360 : 120;
    const map: Record<string, () => void> = {
      ArrowLeft:  () => set(x.get() + step, y.get(), s.get()),
      ArrowRight: () => set(x.get() - step, y.get(), s.get()),
      ArrowUp:    () => set(x.get(), y.get() + step, s.get()),
      ArrowDown:  () => set(x.get(), y.get() - step, s.get()),
      "+":        () => zoomCenter(1.25),
      "=":        () => zoomCenter(1.25),
      "-":        () => zoomCenter(0.8),
      "0":        () => frame(allIds),
      Home:       () => frame(["intro"]),
    };
    if (map[e.key]) { e.preventDefault(); stop(); map[e.key](); }
  };

  /* focus-follows-card */
  const onFocusCapture = (e: React.FocusEvent) => {
    const t = e.target as HTMLElement;
    if (t === vp.current || !t.matches(":focus-visible")) return;
    const card = t.closest("[data-card]");
    if (!card) return;
    const r = t.getBoundingClientRect();
    const v = box();
    const inside = r.left >= v.left && r.right <= v.right && r.top >= v.top + 70 && r.bottom <= v.bottom - 20;
    if (!inside) frame([card.getAttribute("data-card") as CardId]);
  };

  /* ---------- active card + zoom % ---------- */
  const compute = () => {
    raf.current = 0;
    const { width: w, height: h } = box();
    const cx = (w / 2 - x.get()) / s.get();
    const cy = (h / 2 - y.get()) / s.get();
    let best: CardId | null = null;
    let bd = Infinity;
    items.forEach(({ id }) => {
      const c = canvas.cards[id];
      const d = Math.hypot(c.x + c.w / 2 - cx, c.y + (cardEl(id)?.offsetHeight ?? 500) / 2 - cy);
      if (d < bd) [bd, best] = [d, id];
    });
    if (best && best !== lastActive.current) {
      lastActive.current = best;
      setActiveId(best);
      onActive(best);
    }
    setPct(Math.round(s.get() * 100));
  };
  const scheduleCompute = () => {
    if (!raf.current) raf.current = requestAnimationFrame(compute);
  };
  useMotionValueEvent(x, "change", scheduleCompute);
  useMotionValueEvent(y, "change", scheduleCompute);
  useMotionValueEvent(s, "change", scheduleCompute);

  /* ---------- measure card heights ---------- */
  useEffect(() => {
    const ro = new ResizeObserver((entries) =>
      setHeights((prev) => {
        const next = { ...prev };
        let changed = false;
        entries.forEach((en) => {
          const id = (en.target as HTMLElement).dataset.cardId as CardId;
          const h = Math.round((en.target as HTMLElement).offsetHeight);
          if (next[id] !== h) [next[id], changed] = [h, true];
        });
        return changed ? next : prev;
      }),
    );
    allIds.forEach((id) => {
      const el = cardEl(id);
      if (el) ro.observe(el);
    });
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- connectors ---------- */
  const port = (id: CardId, side: Side) => {
    const c = canvas.cards[id];
    const h = heights[id] ?? 520;
    return {
      l: { x: c.x,           y: c.y + 56 },
      r: { x: c.x + c.w,    y: c.y + 56 },
      t: { x: c.x + c.w / 2, y: c.y },
      b: { x: c.x + c.w / 2, y: c.y + h },
    }[side];
  };
  const out = (p: { x: number; y: number }, side: Side, d: number) =>
    ({ r: { x: p.x + d, y: p.y }, l: { x: p.x - d, y: p.y }, b: { x: p.x, y: p.y + d }, t: { x: p.x, y: p.y - d } })[side];

  /* ---------- background dot grid ---------- */
  const gridPos = useMotionTemplate`${x}px ${y}px`;
  const gridSize = useTransform(s, (v) => `${28 * v}px ${28 * v}px`);

  /* ---------- "Start here" arrow position (near intro card top-left corner) ---------- */
  const introCard = canvas.cards["intro"];

  return (
    <div
      ref={vp}
      id="main"
      tabIndex={0}
      role="region"
      aria-label="Interactive portfolio canvas. Drag to pan, hold Control or Command and scroll to zoom. Arrow keys pan, plus and minus zoom, zero shows everything."
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
      onFocusCapture={onFocusCapture}
      className={`fixed inset-0 select-none overflow-clip overscroll-none outline-offset-[-4px] [touch-action:none] ${
        grabbing ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      {/* Background dot grid */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgb(var(--fg) / 0.13) 1px, transparent 1.3px)",
          backgroundPosition: gridPos,
          backgroundSize: gridSize,
        }}
      />

      {/* World canvas */}
      <motion.div
        className="absolute left-0 top-0 will-change-transform"
        style={{ x, y, scale: s, originX: 0, originY: 0, width: canvas.width, height: canvas.height }}
      >
        {/* SVG connector layer */}
        <svg width={canvas.width} height={canvas.height} className="pointer-events-none absolute inset-0" aria-hidden>

          {/* Decorative bracket annotations */}
          <text
            x={introCard.x + introCard.w / 2 - 30}
            y={introCard.y - 28}
            className="pointer-events-none"
            style={{ fontFamily: "JetBrains Mono Variable, monospace", fontSize: 11, fill: "rgb(var(--accent) / 0.45)" }}
          >
            ▼ Start here
          </text>

          {/* Decorative dot cluster — top-right area */}
          {Array.from({ length: 5 }, (_, r) =>
            Array.from({ length: 5 }, (_, c) => (
              <circle
                key={`d-${r}-${c}`}
                cx={2480 + c * 14}
                cy={400 + r * 14}
                r={2}
                fill="rgb(var(--accent2) / 0.25)"
              />
            ))
          )}

          {/* Decorative bracket near stack card */}
          <text
            x={canvas.cards["stack"].x + canvas.cards["stack"].w + 16}
            y={canvas.cards["stack"].y + 60}
            className="pointer-events-none"
            style={{ fontFamily: "JetBrains Mono Variable, monospace", fontSize: 10, fill: "rgb(var(--accent3) / 0.5)" }}
          >
            {"{ }"}
          </text>

          {/* Edge connectors with accent colors */}
          {canvas.edges.map((e) => {
            const group = edgeGroup[`${e.from}-${e.to}`] ?? "projects";
            const stroke = edgeColor[group];
            const dot = dotColor[group];
            const a = port(e.from, e.fromSide);
            const b = port(e.to, e.toSide);
            const dx = Math.max(90, Math.abs(b.x - a.x) * 0.5);
            const dy = Math.max(90, Math.abs(b.y - a.y) * 0.5);
            const c1 = out(a, e.fromSide, e.fromSide === "l" || e.fromSide === "r" ? dx : dy);
            const c2 = out(b, e.toSide, e.toSide === "l" || e.toSide === "r" ? dx : dy);
            return (
              <g key={`${e.from}-${e.to}`}>
                <path
                  d={`M${a.x} ${a.y} C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${b.x} ${b.y}`}
                  fill="none"
                  strokeWidth={1.5}
                  strokeDasharray="6 8"
                  className="animate-dash"
                  style={{ stroke }}
                />
                {[a, b].map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={4}
                    style={{ fill: "rgb(var(--card))", stroke: dot }}
                    strokeWidth={2}
                  />
                ))}
              </g>
            );
          })}
        </svg>

        {/* Cards */}
        {items.map(({ id, node }, i) => {
          const c = canvas.cards[id];
          const isActive = id === activeId;
          return (
            <motion.div
              key={id}
              id={`card-${id}`}
              data-card={id}
              data-card-id={id}
              style={{ position: "absolute", left: c.x, top: c.y, width: c.w }}
              initial={reduce ? false : { opacity: 0, y: 28, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Active card ring */}
              {isActive && (
                <motion.div
                  layoutId="active-ring"
                  className="pointer-events-none absolute -inset-[3px] rounded-[22px]"
                  style={{
                    boxShadow: "0 0 0 2px rgb(var(--accent) / 0.45), 0 4px 24px -4px rgb(var(--accent) / 0.20)",
                  }}
                  transition={{ type: "spring", stiffness: 280, damping: 24 }}
                />
              )}
              <div className="animate-float" style={{ animationDelay: `${-i * 1.3}s`, animationDuration: `${6 + (i % 3)}s` }}>
                {node}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Hint text */}
      <p className="pointer-events-none absolute bottom-4 left-5 hidden rounded-full bg-bg/80 px-3 py-1 font-mono text-[11px] text-muted backdrop-blur xl:block">
        drag to pan · ⌘/ctrl + scroll to zoom · arrows &amp; +/− when focused · 0 = fit all
      </p>

      {/* Zoom controls + Home button */}
      <div
        data-nodrag
        className="absolute bottom-4 right-5 flex items-center gap-1 rounded-full border border-line bg-card/90 p-1 shadow-card backdrop-blur"
      >
        <CtrlBtn label="Zoom out" onClick={() => zoomCenter(0.8)}>
          <Minus size={15} aria-hidden />
        </CtrlBtn>
        <span className="w-11 text-center font-mono text-[11px] tabular-nums text-muted" aria-live="off">
          {pct}%
        </span>
        <CtrlBtn label="Zoom in" onClick={() => zoomCenter(1.25)}>
          <Plus size={15} aria-hidden />
        </CtrlBtn>
        {/* Divider */}
        <span aria-hidden className="h-4 w-px bg-line" />
        <CtrlBtn label="Fit everything in view" onClick={() => frame(allIds)}>
          <Maximize2 size={14} aria-hidden />
        </CtrlBtn>
        <CtrlBtn label="Return to intro" onClick={() => frame(["intro"])}>
          <Home size={14} aria-hidden />
        </CtrlBtn>
      </div>
    </div>
  );
});

function CtrlBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-full text-fg transition-all duration-150 hover:bg-accent/10 hover:text-accent"
    >
      {children}
    </button>
  );
}
