import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // ✅ enables class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ ensures Tailwind scans TS files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
