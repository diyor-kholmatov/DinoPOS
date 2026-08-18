import { loadBootstrap } from "@/lib/legacy/migrate";

export const bootstrap = loadBootstrap(
  typeof window === "undefined" ? undefined : window.localStorage,
);

