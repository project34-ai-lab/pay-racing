import type { PropsWithChildren, ReactElement } from "react";

export function MobileShellLayout({ children }: PropsWithChildren): ReactElement {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-bg text-text">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-20 top-12 h-64 w-64 rounded-full bg-overtake/15 blur-3xl" />
        <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-nitro/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-48 w-[140%] -translate-x-1/2 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.03)_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-dvh w-full max-w-[30rem] flex-col px-4 pb-[calc(var(--space-6)+env(safe-area-inset-bottom))] pt-[calc(var(--space-4)+env(safe-area-inset-top))] sm:px-5">
        {children}
      </div>
    </div>
  );
}
