import type { MouseEvent, PropsWithChildren, ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  defaultMotionTransition,
  modalBackdropVariants,
  modalPanelVariants,
  motionDurations,
  motionEase,
} from "@/lib/motion";
import { Button } from "@/components/ui/Button";
type ModalProps = PropsWithChildren & {
  open: boolean;
  title: string;
  onClose: () => void;
};

export function Modal({ open, title, onClose, children }: ModalProps): ReactElement {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-sm sm:items-center"
          variants={modalBackdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={defaultMotionTransition}
          onClick={onClose}
        >
          <motion.section
            className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-shell border border-borderSoft bg-surface p-lane shadow-card"
            variants={modalPanelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: motionDurations.base, ease: motionEase }}
            onClick={(event: MouseEvent<HTMLElement>) => {
              event.stopPropagation();
            }}
          >
            <header className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold text-text">{title}</h2>
              <Button variant="ghost" size="md" onClick={onClose} aria-label="ปิดหน้าต่างเพิ่มค่าเสียหาย">
                ปิด
              </Button>
            </header>
            <div>{children}</div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
