import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        vertex: {
          navy: "#101923",
          deep: "#0B1118",
          surface: "#152230",
          elevated: "#1C2B3C",
          border: "#233547",
          cyan: "#00C2B8",
          cyanHover: "#00E0D4",
          cyanDark: "#008A83",
          steel: "#A9B7C4",
          steelDark: "#6C7D8E",
          ice: "#F4F7FA",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        vazir: ["var(--font-vazirmatn)", "sans-serif"],
      },
      boxShadow: {
        cyan: "0 0 25px -5px rgba(0, 194, 184, 0.3)",
        cyanLg: "0 0 45px -10px rgba(0, 194, 184, 0.4)",
        glow: "0 0 20px rgba(0, 194, 184, 0.15)",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(to right, rgba(169, 183, 196, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(169, 183, 196, 0.05) 1px, transparent 1px)",
        "dots-pattern": "radial-gradient(rgba(0, 194, 184, 0.15) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
