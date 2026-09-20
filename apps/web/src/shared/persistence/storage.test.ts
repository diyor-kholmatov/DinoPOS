import { STORAGE_KEYS } from "@/shared/config/storage-keys";
import { getBrowserStorage, getOptionalBrowserStorage } from "@/shared/persistence/storage";

describe("browser persistence boundary", () => {
  it("preserves every public compatibility key", () => {
    expect(STORAGE_KEYS).toEqual({
      session: "dinopos-v6-session",
      catalog: "dinopos-v6-catalog",
      checkout: "dinopos-v6-checkout",
      customers: "dinopos-v6-customers",
      sales: "dinopos-v6-sales",
      operations: "dinopos-v6-operations",
      settings: "dinopos-v6-settings",
      legacyV5: "retailos-unified-brief-v5-i18n",
      legacyV5Backup: "dinopos-v5-backup",
    });
  });

  it("returns the browser storage used by persisted stores", () => {
    expect(getBrowserStorage()).toBe(window.localStorage);
    expect(getOptionalBrowserStorage()).toBe(window.localStorage);
  });
});
