"use client";

import { Clock } from "@/components/clock";
import { useQueryState, parseAsStringLiteral } from "nuqs";
import Link from "next/link";

export type THeaderItem = {
  key: string;
  label: string;
  href: string;
};

export type THeaderConfig = {
  leftItems?: THeaderItem[];
};

const ThemeToggle = () => {
  const [theme, setTheme] = useQueryState(
    "theme",
    parseAsStringLiteral(["dark", "light"]).withDefault("light")
  );

  const toggleDarkMode = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("latex-dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("latex-dark");
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="size-5 hover:opacity-70 transition-opacity"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
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
};

const Header = ({ leftItems = [] }: THeaderConfig) => {
  const [theme] = useQueryState(
    "theme",
    parseAsStringLiteral(["dark", "light"]).withDefault("light")
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 print:hidden backdrop-blur-xl">
      <div className="max-w-full lg:max-w-[896px] lg:mx-auto px-4 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-4 items-center">
            <Link
              href={theme === "dark" ? "/?theme=dark" : "/"}
              className="text-base font-medium hover:underline"
            >
              Milind's Resume
            </Link>
            {leftItems.map((item) => (
              <Link
                key={item.key}
                href={theme === "dark" ? `${item.href}?theme=dark` : item.href}
                className="cursor-pointer hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-x-3 items-center">
            <Clock timeZone="Asia/Calcutta" />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };
