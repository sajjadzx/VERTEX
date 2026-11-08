import { PageInterconnect } from "@/components/PageInterconnect";
import React from "react";
import type { Metadata } from "next";
import { Locale, dictionary } from "@/lib/dictionary";
import { InteractiveConfigurator } from "@/components/InteractiveConfigurator";
import { TechBadge } from "@/components/TechBadge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locale === "fa" ? "fa" : "en") as Locale;
  const dict = dictionary[currentLocale];
  return {
    title: dict.nav.configurator,
    description: dict.configurator.subtitle,
  };
}

export default async function ConfiguratorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = (locale === "fa" ? "fa" : "en") as Locale;
  const dict = dictionary[currentLocale];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12 bg-vertex-bg">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <TechBadge variant="blueprint">{dict.configurator.badge}</TechBadge>
        <h1 className="text-4xl sm:text-5xl font-black text-vertex-primary font-mono tracking-tight">
          {dict.configurator.title}
        </h1>
        <p className="text-base text-vertex-secondary font-normal leading-relaxed">
          {dict.configurator.subtitle}
        </p>
      </div>

      <InteractiveConfigurator locale={currentLocale} />
      <PageInterconnect locale={currentLocale} />
    </div>
  );
}
