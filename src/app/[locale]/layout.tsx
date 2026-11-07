import React from "react";
import type { Metadata } from "next";
import { Locale, dictionary } from "@/lib/dictionary";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fa" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locale === "fa" ? "fa" : "en") as Locale;
  const dict = dictionary[currentLocale];

  return {
    title: {
      template: `%s | ${dict.brand.name}`,
      default: `${dict.brand.name} — ${dict.brand.sloganPrimary}`,
    },
    description: dict.brand.description,
    keywords: [
      "Elevator Technologies",
      "Escalator Systems",
      "High-Speed Lifts",
      "MRL Elevators",
      "Passenger Transportation",
      "EN 81-20",
      "EN 115",
      "آسانسور کششی",
      "پله‌برقی شهری",
      "کابین آسانسور لوکس",
    ],
    alternates: {
      canonical: `/${currentLocale}`,
      languages: {
        en: "/en",
        fa: "/fa",
      },
    },
    openGraph: {
      title: `${dict.brand.name} — ${dict.brand.sloganPrimary}`,
      description: dict.brand.description,
      siteName: dict.brand.name,
      locale: currentLocale === "fa" ? "fa_IR" : "en_US",
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = (locale === "fa" ? "fa" : "en") as Locale;
  const isRtl = currentLocale === "fa";

  return (
    <html
      lang={currentLocale}
      dir={isRtl ? "rtl" : "ltr"}
      className={isRtl ? "font-vazir" : "font-sans"}
    >
      <body className="bg-vertex-deep text-vertex-ice selection:bg-vertex-cyan selection:text-vertex-deep antialiased flex flex-col min-h-screen">
        <Navbar locale={currentLocale} />
        <main className="flex-1 pt-20">{children}</main>
        <Footer locale={currentLocale} />
      </body>
    </html>
  );
}
