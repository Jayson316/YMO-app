"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
type Theme = "light" | "dark";
interface ThemeContextType { theme: Theme; toggleTheme: () => void; isDark: boolean; }
const ThemeContext = createContext<ThemeContextType>({ theme: "light", toggleTheme: () => {}, isDark: false });
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("ymo-theme") as Theme | null;
    if (stored) { setTheme(stored); } else { setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => { if (!localStorage.getItem("ymo-theme")) setTheme(e.matches ? "dark" : "light"); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  useEffect(() => { if (!mounted) return; document.documentElement.setAttribute("data-theme", theme); }, [theme, mounted]);
  const toggleTheme = () => setTheme(prev => { const next = prev === "light" ? "dark" : "light"; localStorage.setItem("ymo-theme", next); return next; });
  if (!mounted) return <>{children}</>;
  return <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === "dark" }}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);
