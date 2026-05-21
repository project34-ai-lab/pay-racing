import type { HTMLAttributes, ReactElement } from "react";

import { cn } from "@/utils/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: "default" | "highlight";
};

export function Card({ tone = "default", className, ...props }: CardProps): ReactElement {
  return (
    <section
      className={cn(
        "rounded-card border bg-surface/85 p-lane backdrop-blur",
        tone === "highlight" ? "border-nitro/35 shadow-blueGlow" : "border-borderSoft shadow-card",
        className,
      )}
      {...props}
    />
  );
}
