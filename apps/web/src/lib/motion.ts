import type { Transition, Variants } from "framer-motion";

export const motionDurations = {
  fast: 0.14,
  base: 0.22,
  slow: 0.34,
} as const;

export const motionEase: Transition["ease"] = [0.2, 0.8, 0.2, 1];

export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const modalBackdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const modalPanelVariants: Variants = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 16, scale: 0.98 },
};

export const listItemVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const defaultMotionTransition: Transition = {
  duration: motionDurations.base,
  ease: motionEase,
};

export const listMotionTransition: Transition = {
  duration: motionDurations.fast,
  ease: motionEase,
};
