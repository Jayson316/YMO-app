import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0A0F1E",
        gold: "#C9A84C",
        "gold-light": "#F0D080",
        cream: "#F9F6F0",
        slate: "#1E2A3A",
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "serif"],
        body: ["'Trebuchet MS'", "Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
