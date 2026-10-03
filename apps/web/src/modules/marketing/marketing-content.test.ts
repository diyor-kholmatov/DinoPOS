import { describe, expect, it } from "vitest";
import { defaultMarketingContent, type MarketingLocale } from "./marketing-content";

describe("editable marketing story", () => {
  it.each(["ru", "uz", "en"] satisfies MarketingLocale[])("keeps %s content structurally safe for the admin", (locale) => {
    const content = defaultMarketingContent.locales[locale];

    expect(content.shiftEvents).toHaveLength(5);
    expect(content.shiftEvents.map((event) => event.tone)).toEqual(["opening", "rush", "offline", "inventory", "closing"]);
    expect(content.roleCards).toHaveLength(3);
    expect(content.pilotFeatures).toHaveLength(3);
    expect(content.shiftEvents.every((event) => event.time && event.title && event.description)).toBe(true);
  });
});
