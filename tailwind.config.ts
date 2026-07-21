import type { Config } from "tailwindcss";

/** CSS-var brand color that still supports Tailwind opacity modifiers (/40, /50, …). */
function brand(cssVar: string, fallback: string) {
  return `color-mix(in srgb, var(${cssVar}, ${fallback}) calc(100% * <alpha-value>), transparent)`;
}

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        periwinkle: {
          DEFAULT: brand("--color-periwinkle", "#9DA5D0"),
          light: brand("--color-periwinkle-light", "#BCC2E4"),
          lighter: brand("--color-periwinkle-lighter", "#E8EAF7"),
          dark: brand("--color-periwinkle-dark", "#7880B8"),
          deep: brand("--color-periwinkle-deep", "#565EA0"),
          50: brand("--color-periwinkle-lighter", "#F0F1FA"),
          100: brand("--color-periwinkle-lighter", "#E8EAF7"),
          200: brand("--color-periwinkle-light", "#BCC2E4"),
          300: brand("--color-periwinkle", "#A8B0D9"),
          400: brand("--color-periwinkle", "#9DA5D0"),
          500: brand("--color-periwinkle", "#8A92C4"),
          600: brand("--color-periwinkle-dark", "#7880B8"),
          700: brand("--color-periwinkle-deep", "#565EA0"),
          800: "#424882",
          900: "#2F3464",
        },
        gold: {
          DEFAULT: brand("--color-gold", "#D4C9B8"),
          light: brand("--color-gold-light", "#E5DDD0"),
          lighter: brand("--color-gold-lighter", "#F3EDE4"),
          dark: brand("--color-gold-dark", "#C4B8A6"),
          deeper: brand("--color-gold-deeper", "#B5A896"),
          muted: brand("--color-gold-muted", "#DDD4C6"),
        },
        sand: {
          DEFAULT: brand("--color-sand", "#E4D9CC"),
          light: brand("--color-sand-light", "#F0E8DF"),
          dark: "#CABBA8",
        },
        stone: {
          DEFAULT: brand("--color-stone", "#D0CBC4"),
          light: brand("--color-stone-light", "#E2DFDC"),
          dark: "#B8B2AB",
        },
        offwhite: {
          DEFAULT: brand("--color-offwhite", "#F8F6F3"),
          warm: brand("--color-offwhite-warm", "#F2EFE9"),
          pure: "#FDFCFB",
        },
        warmgrey: {
          DEFAULT: brand("--color-warmgrey", "#B5AFA8"),
          light: "#CEC9C3",
          dark: "#8A847D",
        },
        charcoal: {
          DEFAULT: brand("--color-charcoal", "#2C2A28"),
          light: brand("--color-charcoal-light", "#5A5754"),
          lighter: brand("--color-charcoal-lighter", "#8A8784"),
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
