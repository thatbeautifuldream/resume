"use client";

import { Clock } from "@/components/clock";
import Link from "next/link";

export type THeaderItem = {
  key: string;
  label: string;
  href: string;
};

export type THeaderConfig = {
  leftItems?: THeaderItem[];
};

const Header = ({ leftItems = [] }: THeaderConfig) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 print:hidden bg-background border-b">
      <div className="max-w-full lg:max-w-[896px] lg:mx-auto px-4 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-4 items-center">
            <Link href="/" className="text-base font-medium hover:underline">
              Milind's Resume
            </Link>
            {leftItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="cursor-pointer hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-x-3 items-center">
            <Clock timeZone="Asia/Kolkata" />
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };
