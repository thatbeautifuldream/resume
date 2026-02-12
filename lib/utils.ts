import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toSentenceCase(str: string): string {
  if (!str) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

if (!String.prototype.toSentenceCase) {
  String.prototype.toSentenceCase = function (this: string): string {
    return toSentenceCase(this);
  };
}

declare global {
  interface String {
    toSentenceCase(): string;
  }
}
