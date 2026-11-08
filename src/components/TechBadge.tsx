import React from "react";
import { cn } from "@/lib/utils";

interface TechBadgeProps {
  children: React.ReactNode;
  variant?: "blueprint" | "slate" | "emerald" | "amber";
  className?: string;
  icon?: React.ReactNode;
}

export function TechBadge({
  children,
  variant = "blueprint",
  className,
  icon,
}: TechBadgeProps) {
  const styles = {
    blueprint: "text-vertex-blueprint bg-vertex-blueprint/10 border-vertex-blueprint/30",
    slate: "text-vertex-secondary bg-vertex-elevated border-vertex-borderStrong",
    emerald: "text-emerald-700 bg-emerald-50 border-emerald-300",
    amber: "text-amber-800 bg-amber-50 border-amber-300",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 text-xs font-mono font-semibold tracking-wider uppercase rounded-full border transition-all duration-200 shadow-sm",
        styles[variant],
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {icon && <span className="opacity-90">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}
