import type { ReactElement } from "react";
import { AppProviders } from "@/app/AppProviders";
import { AppRouter } from "@/app/AppRouter";

export function App(): ReactElement {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
