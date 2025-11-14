import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export type THeaderItem = {
  key: string;
  label: string;
  href: string;
};

export type THeaderConfig = {
  leftItems?: THeaderItem[];
};

export function Header({ leftItems = [] }: THeaderConfig) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 print:hidden bg-background border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-4 items-center">
            <Link
              href="/"
              className="font-medium hover:underline text-sm md:text-md"
            >
              Milind's Resume
            </Link>
            {leftItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="font-medium hover:underline text-sm md:text-md"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-x-3 items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
