import type { Config } from "tailwindcss";

// Soft Periwinkle palette — "Zart & Zeitlos" (palette 68)
// Primary: soft periwinkle blue-lavender | Neutrals: sand beige, warm grey, light stone, off-white

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // ── Primary: Periwinkle ───────────────────────────────────────────────
        periwinkle: {
          DEFAULT: "#9DA5D0",
          light: "#BCC2E4",
          lighter: "#E8EAF7",
          dark: "#7880B8",
          deep: "#565EA0",
          // Numeric aliases for admin UI components
          50: "#F0F1FA",
          100: "#E8EAF7",
          200: "#BCC2E4",
          300: "#A8B0D9",
          400: "#9DA5D0",
          500: "#8A92C4",
          600: "#7880B8",
          700: "#565EA0",
          800: "#424882",
          900: "#2F3464",
        },
        // ── Soft accent: champagne gold (subtle, not yellow) ─────────────────
        gold: {
          DEFAULT: "#D4C9B8",
          light: "#E5DDD0",
          lighter: "#F3EDE4",
          dark: "#C4B8A6",
          deeper: "#B5A896",
          muted: "#DDD4C6",
        },
        // ── Neutrals ─────────────────────────────────────────────────────────
        sand: {
          DEFAULT: "#E4D9CC", // Sand beige — warm off-tone
          light: "#F0E8DF", // Lighter sand
          dark: "#CABBA8", // Deeper sand for borders
        },
        stone: {
          DEFAULT: "#D0CBC4", // Light stone
          light: "#E2DFDC", // Near-white stone
          dark: "#B8B2AB", // Warm grey
        },
        offwhite: {
          DEFAULT: "#F8F6F3", // Off-white background
          warm: "#F2EFE9", // Slightly warmer off-white
          pure: "#FDFCFB", // Near pure white
        },
        warmgrey: {
          DEFAULT: "#B5AFA8", // Warm grey
          light: "#CEC9C3", // Light warm grey
          dark: "#8A847D", // Dark warm grey
        },
        // ── Text ─────────────────────────────────────────────────────────────
        charcoal: {
          DEFAULT: "#2C2A28", // Main text
          light: "#5A5754", // Secondary text
          lighter: "#8A8784", // Muted text
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["2.75rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
      },
      boxShadow: {
        soft: "0 2px 16px rgba(44,42,40,0.05)",
        card: "0 4px 24px rgba(44,42,40,0.07)",
        "card-hover": "0 8px 40px rgba(154,161,204,0.18)",
        periwinkle: "0 4px 20px rgba(194,200,232,0.4)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "glow-drift": {
          "0%, 100%": { opacity: "0.55", transform: "translate(0, 0) scale(1)" },
          "50%": { opacity: "0.75", transform: "translate(12px, -8px) scale(1.05)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease forwards",
        "fade-in": "fade-in 0.4s ease forwards",
        "scale-in": "scale-in 0.5s ease forwards",
        "glow-drift": "glow-drift 12s ease-in-out infinite",
        marquee: "marquee 45s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
