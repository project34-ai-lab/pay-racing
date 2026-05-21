import type { ButtonHTMLAttributes, ReactElement } from "react";
import { motion } from "framer-motion";

import { motionDurations, motionEase } from "@/lib/motion";
import { cn } from "@/utils/cn";

type ButtonVariant = "turbo" | "ghost" | "danger";
type ButtonSize = "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

const variantClassMap: Record<ButtonVariant, string> = {
  turbo:
    "bg-gradient-to-r from-turbo to-overtake text-white shadow-redGlow hover:brightness-105 active:brightness-95",
  ghost: "border border-borderSoft bg-surfaceAlt/70 text-text hover:border-nitro/60 hover:shadow-blueGlow",
  danger: "border border-danger/40 bg-danger/15 text-danger hover:bg-danger/25",
};

const sizeClassMap: Record<ButtonSize, string> = {
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-[0.95rem]",
};

export function Button({
  variant = "turbo",
  size = "md",
  className,
  fullWidth = false,
  type = "button",
  ...props
}: ButtonProps): ReactElement {
  return (
    <motion.div
      whileTap={{ scale: 0.985 }}
      transition={{ duration: motionDurations.fast, ease: motionEase }}
      className={cn(fullWidth && "w-full")}
    >
      <button
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-control font-semibold tracking-wide transition duration-fast ease-race disabled:cursor-not-allowed disabled:opacity-55",
          variantClassMap[variant],
          sizeClassMap[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      />
    </motion.div>
  );
}
