import { ChevronRight, Languages, LogOut, Moon, Settings, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SelectField } from "@/components/ui/select-field";
import { cn } from "@/lib/cn";
import { useSessionStore } from "@/stores/session-store";

interface ProfilePopoverProps {
  expanded: boolean;
  compact?: boolean;
}

export function ProfilePopover({ expanded, compact = false }: ProfilePopoverProps) {
  const { t } = useTranslation();
  const locale = useSessionStore((state) => state.locale);
  const theme = useSessionStore((state) => state.theme);
  const setLocale = useSessionStore((state) => state.setLocale);
  const toggleTheme = useSessionStore((state) => state.toggleTheme);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="quiet"
          className={cn(
            expanded ? "w-full justify-start px-2" : "w-full px-0",
            compact && "h-11 min-h-11 gap-2",
          )}
          aria-label={t("profile.title")}
        >
          <span className={cn("grid shrink-0 place-items-center rounded-full bg-sunken font-semibold text-ink", compact ? "size-8 text-[11px]" : "size-9 text-xs")}>
            LJ
          </span>
          {expanded ? (
            <span className="min-w-0 flex-1 text-left">
              <strong className={cn("block truncate", compact ? "text-xs font-semibold" : "text-sm")}>Liam Johnson</strong>
              <small className={cn("block font-medium text-muted", compact ? "text-[10px]" : "text-xs")}>{t("app.owner")}</small>
            </span>
          ) : null}
          {expanded && !compact ? <ChevronRight className="size-4 text-faint" aria-hidden="true" /> : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="right" align="end" className="grid gap-2">
        <div className="flex items-center gap-3 border-b border-border p-2 pb-3">
          <span className="grid size-10 place-items-center rounded-full bg-sunken text-sm font-bold">LJ</span>
          <span className="min-w-0">
            <strong className="block truncate">Liam Johnson</strong>
            <small className="text-xs text-muted">{t("app.owner")}</small>
          </span>
        </div>
        <div className="profile-language-grid grid items-end gap-2 px-2 py-1">
          <Languages className="mb-3 size-4 text-faint" aria-hidden="true" />
          <SelectField
            label={t("common.language")}
            value={locale}
            onChange={(value) => setLocale(value as "en" | "ru" | "uz")}
            options={[
              { id: "en", label: "English" },
              { id: "ru", label: "Русский" },
              { id: "uz", label: "O'zbek" },
            ]}
          />
        </div>
        <Button variant="quiet" className="w-full justify-start" onClick={toggleTheme}>
          {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          {t("common.toggleTheme")}
        </Button>
        <Button asChild variant="quiet" className="w-full justify-start">
          <Link to="/settings">
            <Settings className="size-4" aria-hidden="true" />
            {t("profile.settings")}
          </Link>
        </Button>
        <Button variant="quiet" className="w-full justify-start text-danger">
          <LogOut className="size-4" aria-hidden="true" />
          {t("nav.signOut")}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
