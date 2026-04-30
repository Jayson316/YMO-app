"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:bg-green-pale/20 dark:hover:bg-green-900/20 focus:outline-none focus:ring-2 focus:ring-green-500/50"
    >
      <Sun
        className={`absolute transition-all duration-300 ${
          theme === "dark"
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
        size={20}
        style={{ color: "var(--green)" }}
      />
      <Moon
        className={`absolute transition-all duration-300 ${
          theme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
        size={20}
        style={{ color: "#74C69D" }}
      />
    </button>
  );
}
