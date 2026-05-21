import type { InputHTMLAttributes, ReactElement } from "react";

import { cn } from "@/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
};

export function Input({ id, label, helperText, className, ...props }: InputProps): ReactElement {
  return (
    <label className="block space-y-2" htmlFor={id}>
      {label ? <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted">{label}</span> : null}
      <input
        id={id}
        className={cn(
          "h-11 w-full rounded-control border border-borderSoft bg-track/60 px-3.5 text-sm text-text placeholder:text-muted/90 transition duration-fast ease-race focus:border-overtake focus:outline-none focus:shadow-redGlow",
          className,
        )}
        {...props}
      />
      {helperText ? <span className="block text-xs text-muted">{helperText}</span> : null}
    </label>
  );
}
