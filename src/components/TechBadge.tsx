import React from "react";
import { cn } from "@/lib/utils";

interface TechBadgeProps {
  children: React.ReactNode;
  variant?: "cyan" | "steel" | "emerald";
  className?: string;
  icon?: React.ReactNode;
}

export function TechBadge({
  children,
  variant = "cyan",
  className,
  icon,
}: TechBadgeProps) {
  const styles = {
    cyan: "text-vertex-cyan border-vertex-cyan/30 bg-vertex-cyan/10 shadow-[0_0_15px_rgba(0,194,184,0.15)]",
    steel: "text-vertex-steel border-vertex-steel/30 bg-vertex-surface/60",
    emerald: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 text-xs font-mono tracking-widest uppercase rounded-full border transition-all duration-300",
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
