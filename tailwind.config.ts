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
          bg: "#F8FAFC", // Architectural Ice Slate
          surface: "#FFFFFF", // Pure White
          elevated: "#F1F5F9", // Crisp Light Aluminum
          muted: "#E2E8F0", // Engineering CAD Line
          border: "#E2E8F0", // Clean Border
          borderStrong: "#CBD5E1",
          primary: "#0F172A", // Deep Blueprint Slate for primary text
          secondary: "#334155", // Technical Charcoal
          steel: "#64748B", // Mechanical Gray
          blueprint: "#0284C7", // Precision Blueprint Blue
          blueprintDark: "#0369A1",
          cyan: "#0EA5E9", // Technical Cyan
          accent: "#2563EB", // International Cobalt
          emerald: "#059669", // Certified Standard Green
          amber: "#D97706",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        vazir: ["var(--font-vazirmatn)", "sans-serif"],
      },
      boxShadow: {
        blueprint: "0 0 0 1px rgba(2, 132, 199, 0.15), 0 4px 20px -2px rgba(2, 132, 199, 0.08)",
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 10px 25px -5px rgba(15, 23, 42, 0.04)",
        float: "0 20px 35px -10px rgba(15, 23, 42, 0.08)",
      },
      backgroundImage: {
        "cad-grid": "linear-gradient(to right, rgba(148, 163, 184, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.12) 1px, transparent 1px)",
        "cad-grid-dense": "linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.08) 1px, transparent 1px)",
        "radial-light": "radial-gradient(circle at 50% 0%, rgba(2, 132, 199, 0.06) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};

export default config;
