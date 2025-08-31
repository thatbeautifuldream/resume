"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is already enabled
    const hasDarkClass = document.body.classList.contains("latex-dark");
    setIsDark(hasDarkClass);
  }, []);

  const toggleDarkMode = () => {
    document.body.classList.toggle("latex-dark");
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed top-4 right-4 print:hidden bg-primary/50 p-1 rounded-full text-primary-foreground"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
