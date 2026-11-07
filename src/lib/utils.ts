import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number, locale: string): string {
  if (locale === "fa") {
    const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num
      .toString()
      .replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
  }
  return num.toLocaleString("en-US");
}
