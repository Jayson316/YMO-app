"use client";
import React from "react";
import { useTheme } from "@/lib/ThemeContext";
import { Sun, Moon } from "lucide-react";
export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} aria-label="Toggle dark mode" style={{ width: 38, height: 38, borderRadius: 10, border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(64,145,108,0.2)", background: isDark ? "rgba(255,255,255,0.08)" : "rgba(64,145,108,0.06)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: isDark ? "#74C69D" : "#40916C", transition: "all .25s", flexShrink: 0 }}>
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
