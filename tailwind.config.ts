import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Single accent — logo indigo-violet ──
        brand: {
          DEFAULT: "#6B4EFF",
          dark:    "#5A3FE8",
          light:   "#8B73FF",
          50:      "#F0EDFF",
          100:     "#E0D9FF",
          200:     "#C4B8FF",
          500:     "#6B4EFF",
          600:     "#5A3FE8",
          700:     "#4530C4",
          900:     "#1A1050",
        },
        // ── Surfaces (zinc-950 system) ──
        surface: {
          DEFAULT:  "#09090b",   // page base
          subtle:   "#0f0f12",   // card, sidebar
          overlay:  "#18181b",   // hover, input, dropdown
          border:   "rgba(255,255,255,0.07)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
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
