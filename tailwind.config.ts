import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lavender: {
          DEFAULT: "#9B7EC8",
          light: "#C4B0E0",
          lighter: "#EDE8F7",
          dark: "#7C5CBF",
        },
        mint: {
          DEFAULT: "#A8D5C2",
          light: "#CCE9DF",
          dark: "#7ABFA8",
        },
        cream: {
          DEFAULT: "#FAF9F7",
          warm: "#F0EDE8",
          deep: "#E8E3DC",
        },
        gold: {
          DEFAULT: "#C9A96E",
          light: "#E2C99A",
          dark: "#A6884E",
        },
        charcoal: {
          DEFAULT: "#2C2C2C",
          light: "#5A5A5A",
          lighter: "#8A8A8A",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["5rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
      },
      boxShadow: {
        soft: "0 2px 20px rgba(0,0,0,0.06)",
        card: "0 4px 32px rgba(0,0,0,0.08)",
        "card-hover": "0 8px 48px rgba(155,126,200,0.15)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease forwards",
        "fade-in": "fade-in 0.4s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
