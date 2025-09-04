"use client";

import { useEffect } from "react";
import { useQueryState, parseAsStringLiteral } from "nuqs";
import { Sun, Moon } from "lucide-react";

export function ThemeSwitcher() {
  const [theme, setTheme] = useQueryState(
    "theme",
    parseAsStringLiteral(["dark", "light"]).withDefault("light")
  );

  useEffect(() => {
    // Apply theme to document body
    if (theme === "dark") {
      document.body.classList.add("latex-dark");
    } else {
      document.body.classList.remove("latex-dark");
    }
  }, [theme]);

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed top-4 right-4 print:hidden border p-1 rounded-full"
    >
      {theme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </button>
  );
}
