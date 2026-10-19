# Aditya Kumar — Portfolio

Interactive canvas portfolio built with **Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion · Lucide**.

- **Desktop (≥1024px):** a draggable, zoomable canvas of floating cards connected by dashed lines.
- **Tablet / mobile:** a polished stacked layout with a scrollable section nav (no canvas dragging needed).
- Light/dark mode (follows the system by default, remembers your choice), reduced-motion support, keyboard navigation, SEO metadata + JSON-LD.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run typecheck
```

## Canvas controls (desktop)

| Action | How |
|---|---|
| Pan | Drag the background or a card (not on buttons/links), or scroll / trackpad-swipe |
| Zoom | `Ctrl`/`⌘` + scroll, trackpad pinch, or the − / + buttons |
| Fit everything | Fit button (bottom right), or press `0` while the canvas is focused |
| Jump to a section | Top nav (the camera flies there) |
| Keyboard | Focus the canvas: arrow keys pan (hold Shift for bigger steps), `+`/`-` zoom, `0` fit, `Home` intro. Tabbing to an off-screen link brings its card into view. |

## What you still need to fill in

Everything lives in **`src/data/site.ts`**. Nothing below is invented; until you set them the UI shows dashed, clearly-labelled placeholders (they are not clickable).

1. **Social URLs**: `socials` → `github`, `linkedin`, `leetcode`, `codeforces`
2. **Project repos**: `projects[].repo` for E-Commerce API and Taskflow CLI
3. **Resume**: put your PDF at **`public/resume.pdf`** and rebuild. The Download Resume buttons activate automatically when the file exists (until then they show "PDF pending").
4. **Site URL**: set `NEXT_PUBLIC_SITE_URL` (e.g. in Vercel) for canonical URLs, sitemap and Open Graph.

## ⚠ Phone number safety

No phone number appears anywhere in this project, and `npm run build` runs `scripts/check-no-phone.mjs`, which **fails the build** if a phone-like number shows up in source or text assets.

It cannot read inside a PDF. **Before adding `public/resume.pdf`, open it and make sure it has no phone number** (export a copy of your resume without it).

## Editing content / layout

- Text, stats, stack, projects, education, leadership: `src/data/site.ts`
- Card positions and connectors on the canvas: `canvas.cards` and `canvas.edges` in the same file
- Cards: `src/components/cards.tsx` · canvas engine: `src/components/canvas.tsx` · shell/nav: `src/components/portfolio.tsx`
- Theme colors: CSS variables at the top of `src/app/globals.css`

## Deploy

Push to GitHub and import the repo on Vercel (framework auto-detected). Set `NEXT_PUBLIC_SITE_URL` to your domain.
