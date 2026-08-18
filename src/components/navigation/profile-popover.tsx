import { ChevronRight, Languages, LogOut, Moon, Settings, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SelectField } from "@/components/ui/select-field";
import { useSessionStore } from "@/stores/session-store";

interface ProfilePopoverProps {
  expanded: boolean;
}

export function ProfilePopover({ expanded }: ProfilePopoverProps) {
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
          className={expanded ? "w-full justify-start px-2" : "w-full px-0"}
          aria-label={t("profile.title")}
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sunken text-xs font-bold text-ink">
            LJ
          </span>
          {expanded ? (
            <span className="min-w-0 flex-1 text-left">
              <strong className="block truncate text-sm">Liam Johnson</strong>
              <small className="block text-xs font-medium text-muted">{t("app.owner")}</small>
            </span>
          ) : null}
          {expanded ? <ChevronRight className="size-4 text-faint" aria-hidden="true" /> : null}
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
