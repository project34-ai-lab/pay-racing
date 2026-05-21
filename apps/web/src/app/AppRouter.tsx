import type { ReactElement } from "react";
import { Suspense, lazy } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import { defaultMotionTransition, pageTransitionVariants } from "@/lib/motion";

const LandingPage = lazy(async () => import("@/pages/LandingPage").then((module) => ({ default: module.LandingPage })));
const TripJoinPage = lazy(async () => import("@/pages/TripJoinPage").then((module) => ({ default: module.TripJoinPage })));
const TripRoomPage = lazy(async () => import("@/pages/TripRoomPage").then((module) => ({ default: module.TripRoomPage })));

function AnimatedRoutes(): ReactElement {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageTransitionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={defaultMotionTransition}
        className="min-h-dvh"
      >
        <Suspense
          fallback={
            <div className="flex min-h-dvh items-center justify-center px-6 text-center text-sm text-muted">
              กำลังจูนเครื่องยนต์ให้เข้าพิท...
            </div>
          }
        >
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/trip/:tripId" element={<TripRoomPage />} />
            <Route path="/trip/:tripId/join" element={<TripJoinPage />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export function AppRouter(): ReactElement {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
