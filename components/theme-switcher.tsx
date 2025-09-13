"use client";

import { useEffect } from "react";
import { useQueryState, parseAsStringLiteral } from "nuqs";

export function ThemeSwitcher() {
  const [theme, setTheme] = useQueryState(
    "theme",
    parseAsStringLiteral(["dark", "light"]).withDefault("light")
  );

  useEffect(() => {
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
      className="fixed top-4 right-4 print:hidden size-5"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M12 3l0 18" />
        <path d="M12 9l4.65 -4.65" />
        <path d="M12 14.3l7.37 -7.37" />
        <path d="M12 19.6l8.85 -8.85" />
      </svg>
    </button>
  );
}
