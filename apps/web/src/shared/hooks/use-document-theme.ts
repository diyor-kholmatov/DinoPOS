import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  if (typeof document === "undefined") return () => undefined;
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return typeof document === "undefined"
    ? "light"
    : document.documentElement.dataset.theme ?? "light";
}

export function useDocumentTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, () => "light");
}
