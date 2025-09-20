"use client";

import { Clock } from "@/components/clock";
import { useQueryState, parseAsStringLiteral } from "nuqs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

// Types
export type THeaderConfig = {
  showClock?: boolean;
  showExpandAll?: boolean;
  showChatLink?: boolean;
  showBackToResume?: boolean;
  showClearChat?: boolean;
  expandAllState?: boolean;
  onExpandAllToggle?: () => void;
  onClearChat?: () => void;
  hasMessages?: boolean;
}

export type THeaderItem = {
  key: string;
  label: string;
  href?: string;
  onClick?: () => void;
  condition?: boolean;
  variant?: "default" | "secondary";
}

export type TRouteConfig = Record<string, THeaderConfig>;

// Theme Toggle Component
const ThemeToggle = () => {
  const [theme, setTheme] = useQueryState(
    "theme",
    parseAsStringLiteral(["dark", "light"]).withDefault("light")
  );

  const toggleDarkMode = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    // Apply theme to document immediately
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

// Left Content Component
const LeftContent = ({ config }: { config: THeaderConfig }) => {
  const [theme] = useQueryState(
    "theme",
    parseAsStringLiteral(["dark", "light"]).withDefault("light")
  );

  if (config.showClock) {
    return <Clock timeZone="Asia/Calcutta" />;
  }

  if (config.showBackToResume) {
    return (
      <Link
        href={theme === "dark" ? "/?theme=dark" : "/"}
        className="inline-block text-sm cursor-pointer hover:underline"
      >
        ← Back to Resume
      </Link>
    );
  }

  return null;
};

// Right Content Component
const RightContent = ({ config }: { config: THeaderConfig }) => {
  const [theme] = useQueryState(
    "theme",
    parseAsStringLiteral(["dark", "light"]).withDefault("light")
  );

  const items = [];

  if (config.showClearChat && config.hasMessages) {
    items.push(
      <button
        key="clear-chat"
        onClick={config.onClearChat}
        className="text-sm cursor-pointer hover:underline opacity-60 hover:opacity-100 transition-opacity"
        title="Clear chat history"
      >
        Clear Chat
      </button>
    );
  }

  if (config.showExpandAll && config.onExpandAllToggle) {
    items.push(
      <button
        key="expand-all"
        onClick={config.onExpandAllToggle}
        className="text-sm cursor-pointer hover:underline"
      >
        {config.expandAllState ? "Collapse All" : "Expand All"}
      </button>
    );
  }

  if (config.showChatLink) {
    items.push(
      <Link
        key="chat-link"
        href={theme === "dark" ? "/chat?theme=dark" : "/chat"}
        className="text-sm cursor-pointer hover:underline"
      >
        Chat with Resume
      </Link>
    );
  }

  // Always include theme toggle
  items.push(<ThemeToggle key="theme-toggle" />);

  return (
    <div className="text-right flex gap-x-2 items-center">
      {items}
    </div>
  );
};

// Main Header Component
type THeaderProps = THeaderConfig;

const DEFAULT_ROUTE_CONFIGS: Record<string, THeaderConfig> = {
  "/": {
    showClock: true,
    showExpandAll: false,
    showChatLink: true,
    showBackToResume: false,
    showClearChat: false,
  },
  "/chat": {
    showClock: false,
    showExpandAll: false,
    showChatLink: false,
    showBackToResume: true,
    showClearChat: true,
  },
};

const Header = (props: THeaderProps) => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Merge default config with passed props
  const defaultConfig = DEFAULT_ROUTE_CONFIGS[pathname] || {};
  const currentConfig: THeaderConfig = { ...defaultConfig, ...props };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show header when scrolling up or at top
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Don't render if no content to show
  const hasLeftContent = currentConfig.showClock || currentConfig.showBackToResume;
  const hasRightContent =
    (currentConfig.showClearChat && currentConfig.hasMessages) ||
    (currentConfig.showExpandAll && currentConfig.onExpandAllToggle) ||
    currentConfig.showChatLink ||
    true; // Always true because theme toggle is always shown

  if (!hasLeftContent && !hasRightContent) {
    return null;
  }

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 print:hidden transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        backdrop-blur-md bg-background/80 border-b border-border/50
      `}
    >
      <div className="max-w-full lg:max-w-[896px] lg:mx-auto px-4 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <LeftContent config={currentConfig} />
          </div>
          <div className="text-right">
            <RightContent config={currentConfig} />
          </div>
        </div>
      </div>
    </header>
  );
};

// Compound component exports
Header.ThemeToggle = ThemeToggle;
Header.LeftContent = LeftContent;
Header.RightContent = RightContent;

export { Header };