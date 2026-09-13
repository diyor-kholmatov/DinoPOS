export type NavigationPreferenceGroup = "pinned" | "more";

export interface NavigationPreferences {
  navigationPinnedPaths: string[];
  navigationMorePaths: string[];
}

export const defaultPinnedNavigationPaths = [
  "/dashboard",
  "/checkout",
  "/catalog",
  "/inventory",
  "/customers",
  "/reports",
] as const;

export const defaultMoreNavigationPaths = [
  "/sales",
  "/suppliers",
  "/returns",
  "/drafts",
  "/holds",
  "/shift",
  "/cash-operations",
  "/register-history",
  "/catalog/import",
  "/inventory/transfers",
] as const;

const allNavigationPaths = [...defaultPinnedNavigationPaths, ...defaultMoreNavigationPaths];
const knownNavigationPaths = new Set<string>(allNavigationPaths);

function uniqueKnownPaths(paths: readonly string[] | undefined, excluded = new Set<string>()) {
  const seen = new Set(excluded);
  return (paths ?? []).filter((path) => {
    if (!knownNavigationPaths.has(path) || seen.has(path)) return false;
    seen.add(path);
    return true;
  });
}

export function normalizeNavigationPreferences(
  pinnedPaths?: readonly string[],
  morePaths?: readonly string[],
): NavigationPreferences {
  const usingDefaults = pinnedPaths === undefined && morePaths === undefined;
  const navigationPinnedPaths = uniqueKnownPaths(
    usingDefaults ? defaultPinnedNavigationPaths : pinnedPaths,
  );
  const navigationMorePaths = uniqueKnownPaths(
    usingDefaults ? defaultMoreNavigationPaths : morePaths,
    new Set(navigationPinnedPaths),
  );
  const assigned = new Set([...navigationPinnedPaths, ...navigationMorePaths]);

  for (const path of allNavigationPaths) {
    if (!assigned.has(path)) navigationMorePaths.push(path);
  }

  return { navigationPinnedPaths, navigationMorePaths };
}

export function toggleNavigationPin(
  preferences: NavigationPreferences,
  path: string,
): NavigationPreferences {
  const normalized = normalizeNavigationPreferences(
    preferences.navigationPinnedPaths,
    preferences.navigationMorePaths,
  );

  if (normalized.navigationPinnedPaths.includes(path)) {
    return {
      navigationPinnedPaths: normalized.navigationPinnedPaths.filter((item) => item !== path),
      navigationMorePaths: [path, ...normalized.navigationMorePaths],
    };
  }

  if (!normalized.navigationMorePaths.includes(path)) return normalized;
  return {
    navigationPinnedPaths: [...normalized.navigationPinnedPaths, path],
    navigationMorePaths: normalized.navigationMorePaths.filter((item) => item !== path),
  };
}

export function moveNavigationPath(
  preferences: NavigationPreferences,
  sourcePath: string,
  targetPath: string | null,
  targetGroup: NavigationPreferenceGroup,
): NavigationPreferences {
  const normalized = normalizeNavigationPreferences(
    preferences.navigationPinnedPaths,
    preferences.navigationMorePaths,
  );
  const sourceExists = normalized.navigationPinnedPaths.includes(sourcePath)
    || normalized.navigationMorePaths.includes(sourcePath);
  if (!sourceExists || sourcePath === targetPath) return normalized;

  const navigationPinnedPaths = normalized.navigationPinnedPaths.filter((path) => path !== sourcePath);
  const navigationMorePaths = normalized.navigationMorePaths.filter((path) => path !== sourcePath);
  const target = targetGroup === "pinned" ? navigationPinnedPaths : navigationMorePaths;
  const targetIndex = targetPath ? target.indexOf(targetPath) : -1;
  target.splice(targetIndex >= 0 ? targetIndex : target.length, 0, sourcePath);

  return { navigationPinnedPaths, navigationMorePaths };
}
