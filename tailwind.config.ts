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
        rose: {
          accent: "#e8637a",
          light: "#f9d5db",
          dark: "#c94860",
        },
        gold: {
          accent: "#c8953a",
          light: "#f5e6cc",
        },
        cream: "#fdf8f3",
        "cream-dark": "#f5ede3",
      },
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
        sans: ["DM Sans", "sans-serif"],
      },
      maxWidth: {
        app: "420px",
      },
      borderRadius: {
        card: "16px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.07)",
        "card-hover": "0 6px 20px rgba(232,99,122,0.18)",
        fab: "0 4px 16px rgba(232,99,122,0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
