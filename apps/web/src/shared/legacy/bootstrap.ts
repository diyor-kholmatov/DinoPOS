import { loadBootstrap } from "@/shared/legacy/migrate";
import { getOptionalBrowserStorage } from "@/shared/persistence/storage";

export const bootstrap = loadBootstrap(getOptionalBrowserStorage());
