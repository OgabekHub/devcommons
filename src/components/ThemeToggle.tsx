"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

/**
 * Light/Dark mavzu almashtirgich.
 * Mavzu <html data-theme="..."> atributi orqali boshqariladi; barcha ranglar
 * globals.css dagi CSS var tokenlariga bog'langan, shu sabab komponentlar
 * o'zgarishsiz ishlayveradi. Tanlov localStorage("theme") da saqlanadi;
 * flash'ni layout <head> dagi inline skript oldini oladi.
 */
export default function ThemeToggle() {
  // SSR'da mavzu noma'lum — mount'dan keyin DOM'dan o'qiymiz
  const [theme, setTheme] = useState<"dark" | "light" | null>(null);

  useEffect(() => {
    const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    setTheme(current);
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // localStorage yopiq bo'lsa — sessiya davomida baribir ishlaydi
    }
    setTheme(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={theme === "light" ? "Dark mavzuga o'tish" : "Light mavzuga o'tish"}
      className="icon-btn h-9 w-9"
      title={theme === "light" ? "Dark mode" : "Light mode"}
    >
      {/* Mount'gacha ikonka ko'rsatmaymiz — hydration mos kelishi uchun */}
      {theme === "light" ? <Moon className="h-4 w-4" /> : theme === "dark" ? <Sun className="h-4 w-4" /> : <span className="h-4 w-4" />}
    </button>
  );
}
