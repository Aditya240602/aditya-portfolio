import type { Config } from "tailwindcss";

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg:      token("bg"),
        fg:      token("fg"),
        muted:   token("muted"),
        card:    token("card"),
        line:    token("line"),
        accent:  token("accent"),
        accent2: token("accent2"),
        accent3: token("accent3"),
        accent4: token("accent4"),
        ok:      token("ok"),
      },
      fontFamily: {
        sans:  ['"Inter Variable"', "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ['"Instrument Serif"', "ui-serif", "Georgia", "serif"],
        mono:  ['"JetBrains Mono Variable"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        card:  "0 1px 2px rgb(0 0 0 / 0.04), 0 8px 24px -12px rgb(0 0 0 / 0.10)",
        lift:  "0 2px 8px rgb(0 0 0 / 0.06), 0 20px 48px -16px rgb(0 0 0 / 0.22)",
        glow:  "0 0 0 1px rgb(var(--accent) / 0.12), 0 8px 32px -8px rgb(var(--accent) / 0.18)",
        "glow2": "0 0 0 1px rgb(var(--accent2) / 0.15), 0 8px 32px -8px rgb(var(--accent2) / 0.20)",
      },
      keyframes: {
        float:      { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-5px)" } },
        dash:       { to: { strokeDashoffset: "-28" } },
        blink:      { "50%": { opacity: "0" } },
        "fade-in":  { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "slide-in": { from: { opacity: "0", transform: "translateX(-12px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        wiggle:     { "0%,100%": { transform: "rotate(-2deg)" }, "50%": { transform: "rotate(2deg)" } },
        shimmer:    { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
      animation: {
        float:     "float 7s ease-in-out infinite",
        dash:      "dash 2.4s linear infinite",
        blink:     "blink 1.1s steps(1) infinite",
        "fade-in": "fade-in 0.6s ease both",
        "slide-in":"slide-in 0.5s ease both",
        wiggle:    "wiggle 0.5s ease-in-out",
        shimmer:   "shimmer 2.4s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
