import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Single accent — logo indigo-violet (CSS var'lardan, mavzuga tayyor) ──
        brand: {
          DEFAULT: "rgb(var(--brand) / <alpha-value>)",       // #6B4EFF
          dark:    "rgb(var(--brand-dark) / <alpha-value>)",  // #5A3FE8
          light:   "rgb(var(--brand-light) / <alpha-value>)", // #8B73FF
          50:      "#F0EDFF",
          100:     "#E0D9FF",
          200:     "#C4B8FF",
          500:     "#6B4EFF",
          600:     "#5A3FE8",
          700:     "#4530C4",
          900:     "#1A1050",
        },
        // ── Surfaces (zinc-950 system, CSS var'lardan) ──
        surface: {
          DEFAULT:  "rgb(var(--surface-1) / <alpha-value>)", // page base   #09090b
          subtle:   "rgb(var(--surface-2) / <alpha-value>)", // card/sidebar #0f0f12
          overlay:  "rgb(var(--surface-3) / <alpha-value>)", // hover/input  #18181b
          border:   "var(--line)",
        },
        // ── Chiziqlar — border-line / border-line-muted / border-line-strong ──
        line: {
          DEFAULT: "var(--line)",        /* 7%  — standart border */
          muted:   "var(--line-muted)",  /* 4%  — juda nozik */
          strong:  "var(--line-strong)", /* 12% — hover/ajratilgan */
        },
        // ── Mavzuga-sezgir matn/overlay ──
        fg:  "rgb(var(--fg) / <alpha-value>)",   /* asosiy matn (dark: oq, light: qora) */
        ink: "rgb(var(--ink) / <alpha-value>)",  /* fon-qarama-qarshi alpha qatlam (bg-ink/5) */
        // ── Zinc — CSS var'lardan (light mavzuda avtomatik ag'dariladi) ──
        zinc: {
          50:  "rgb(var(--zinc-50) / <alpha-value>)",
          100: "rgb(var(--zinc-100) / <alpha-value>)",
          200: "rgb(var(--zinc-200) / <alpha-value>)",
          300: "rgb(var(--zinc-300) / <alpha-value>)",
          400: "rgb(var(--zinc-400) / <alpha-value>)",
          500: "rgb(var(--zinc-500) / <alpha-value>)",
          600: "rgb(var(--zinc-600) / <alpha-value>)",
          700: "rgb(var(--zinc-700) / <alpha-value>)",
          800: "rgb(var(--zinc-800) / <alpha-value>)",
          900: "rgb(var(--zinc-900) / <alpha-value>)",
          950: "rgb(var(--zinc-950) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      animation: {
        "fade-in":       "fadeIn 0.6s ease-out forwards",
        "fade-in-up":    "fadeInUp 0.6s ease-out forwards",
        "fade-in-down":  "fadeInDown 0.5s ease-out forwards",
        "slide-in-left": "slideInLeft 0.6s ease-out forwards",
        "slide-in-right":"slideInRight 0.6s ease-out forwards",
        "scale-in":      "scaleIn 0.4s ease-out forwards",
        "float":         "float 6s ease-in-out infinite",
        "float-slow":    "float 8s ease-in-out infinite",
        "float-slower":  "float 10s ease-in-out infinite",
        "shimmer":       "shimmer 2.5s linear infinite",
        "spin-slow":     "spin 12s linear infinite",
        "fadeIn":        "fadeIn 0.3s ease-out forwards",
        "blink":         "blink 1s step-end infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%":   { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%":   { opacity: "0", transform: "translateX(-32px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%":   { opacity: "0", transform: "translateX(32px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%":   { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":  "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        // subtle, non-glow shadows
        "card":       "0 1px 3px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)",
        "card-hover": "0 2px 8px rgba(0,0,0,0.16), 0 8px 24px rgba(0,0,0,0.12)",
        "brand":      "0 4px 14px rgba(107,78,255,0.22)",
        "brand-lg":   "0 8px 24px rgba(107,78,255,0.28)",
        "overlay":    "0 8px 32px rgba(0,0,0,0.48), 0 2px 8px rgba(0,0,0,0.24)",
      },
    },
  },
  plugins: [],
};

export default config;
