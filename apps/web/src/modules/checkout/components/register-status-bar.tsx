import { CircleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/select-field";
import { cn } from "@/lib/cn";
import { useSessionStore } from "@/stores/session-store";

interface RegisterStatusBarProps {
  onOpenShift: () => void;
}

export function RegisterStatusBar({ onOpenShift }: RegisterStatusBarProps) {
  const { t } = useTranslation();
  const stores = useSessionStore((state) => state.stores);
  const selectedStoreId = useSessionStore((state) => state.selectedStoreId);
  const register = useSessionStore((state) => state.register);
  const registerMode = useSessionStore((state) => state.registerMode);
  const setSelectedStore = useSessionStore((state) => state.setSelectedStore);
  const saleAvailable = registerMode !== "full" || register.isOpen;

  return (
    <section
      aria-label={t("checkout.registerStatus")}
      className={cn(
        "flex min-h-10 flex-wrap items-center gap-2 rounded-md border bg-raised px-3 py-1.5 text-sm",
        saleAvailable ? "border-border" : "border-danger/40",
      )}
    >
      {saleAvailable ? (
        <span className="flex items-center gap-2 font-semibold text-ink">
          <span className="size-2 rounded-full bg-positive" aria-hidden="true" />
          {t("checkout.registerReady")}
        </span>
      ) : (
        <span className="flex items-center gap-2 font-semibold text-danger">
          <CircleAlert className="size-4" aria-hidden="true" />
          {t("checkout.saleUnavailable")}
        </span>
      )}
      <span className="hidden text-faint sm:inline" aria-hidden="true">·</span>
      <SelectField
        label={t("checkout.activeStore")}
        hideLabel
        size="compact"
        value={selectedStoreId}
        options={stores.map((store) => ({ id: store.id, label: store.name }))}
        isDisabled={register.isOpen}
        onChange={setSelectedStore}
        className="min-w-44"
      />
      <span className="hidden text-faint sm:inline" aria-hidden="true">·</span>
      <span className={saleAvailable ? "text-muted" : "text-danger"}>
        {saleAvailable ? t("checkout.shiftOpen") : t("checkout.shiftClosedReason")}
      </span>
      {!saleAvailable ? (
        <Button variant="quiet" size="small" className="ml-auto" onClick={onOpenShift}>
          {t("checkout.openShiftAction")}
        </Button>
      ) : null}
    </section>
  );
}
