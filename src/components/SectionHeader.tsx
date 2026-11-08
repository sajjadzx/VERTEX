import React from "react";
import { TechBadge } from "./TechBadge";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export function SectionHeader({
  badge,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeaderProps) {
  const alignClass = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end",
  }[align];

  return (
    <div className={cn("flex flex-col max-w-3xl mb-12", alignClass, className)}>
      {badge && <TechBadge className="mb-4">{badge}</TechBadge>}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-vertex-primary tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-vertex-secondary leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
      <div className="mt-5 flex items-center gap-2">
        <span className="w-10 h-[2px] bg-vertex-blueprint" />
        <span className="w-2 h-2 rounded-full bg-vertex-blueprint" />
        <span className="w-16 h-[1px] bg-vertex-borderStrong" />
      </div>
    </div>
  );
}
