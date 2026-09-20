import { useEffect, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { i18n } from "@/i18n";
import { useSessionStore } from "@/modules/session/model";

export function AppProviders({ children }: { children: ReactNode }) {
  const locale = useSessionStore((state) => state.locale);
  const theme = useSessionStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = locale;
    void i18n.changeLanguage(locale);
  }, [locale, theme]);

  return (
    <I18nextProvider i18n={i18n}>
      <TooltipProvider delayDuration={300}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast: "border border-border bg-raised text-ink",
              description: "text-muted",
            },
          }}
        />
      </TooltipProvider>
    </I18nextProvider>
  );
}

