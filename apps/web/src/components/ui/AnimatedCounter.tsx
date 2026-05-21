import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { animate } from "framer-motion";

type AnimatedCounterProps = {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
};

export function AnimatedCounter({ value, className, prefix = "", suffix = "" }: AnimatedCounterProps): ReactElement {
  const [displayValue, setDisplayValue] = useState<number>(Math.round(value));
  const previousValueRef = useRef<number>(Math.round(value));

  useEffect(() => {
    const controls = animate(previousValueRef.current, value, {
      duration: 0.55,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (latest: number) => {
        setDisplayValue(Math.round(latest));
      },
    });
    previousValueRef.current = value;

    return () => {
      controls.stop();
    };
  }, [value]);

  return <span className={className}>{`${prefix}${displayValue.toLocaleString()}${suffix}`}</span>;
}
