import {
  defaultMoreNavigationPaths,
  defaultPinnedNavigationPaths,
  moveNavigationPath,
  normalizeNavigationPreferences,
  toggleNavigationPin,
} from "@/lib/navigation-preferences";

describe("navigation preferences", () => {
  it("uses the approved visible modules by default", () => {
    expect(normalizeNavigationPreferences()).toEqual({
      navigationPinnedPaths: [...defaultPinnedNavigationPaths],
      navigationMorePaths: [...defaultMoreNavigationPaths],
    });
  });

  it("removes duplicates and appends newly available modules", () => {
    const preferences = normalizeNavigationPreferences(
      ["/checkout", "/checkout", "/missing"],
      ["/reports", "/checkout"],
    );

    expect(preferences.navigationPinnedPaths).toEqual(["/checkout"]);
    expect(preferences.navigationMorePaths[0]).toBe("/reports");
    expect(new Set([...preferences.navigationPinnedPaths, ...preferences.navigationMorePaths]).size).toBe(16);
  });

  it("pins, unpins, and moves modules between groups", () => {
    const defaults = normalizeNavigationPreferences();
    const pinned = toggleNavigationPin(defaults, "/sales");
    expect(pinned.navigationPinnedPaths.at(-1)).toBe("/sales");

    const moved = moveNavigationPath(pinned, "/sales", "/dashboard", "pinned");
    expect(moved.navigationPinnedPaths[0]).toBe("/sales");

    const unpinned = toggleNavigationPin(moved, "/sales");
    expect(unpinned.navigationPinnedPaths).not.toContain("/sales");
    expect(unpinned.navigationMorePaths[0]).toBe("/sales");
  });
});
