import { Menu } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { NavigationContent } from "@/app/navigation/navigation-content";
import { IconButton } from "@/shared/ui/icon-button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/shared/ui/drawer";
import { useSessionStore } from "@/modules/session/model";

export function MobileNavigationDrawer() {
  const { t } = useTranslation();
  const open = useSessionStore((state) => state.mobileNavigationOpen);
  const setOpen = useSessionStore((state) => state.setMobileNavigationOpen);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <IconButton ref={triggerRef} label={t("nav.open")} className="lg:hidden">
          <Menu className="size-5" aria-hidden="true" />
        </IconButton>
      </DrawerTrigger>
      <DrawerContent closeLabel={t("nav.close")} onCloseAutoFocus={(event) => {
        event.preventDefault();
        triggerRef.current?.focus();
      }}>
        <div className="flex h-16 items-center gap-3 px-2">
          <span className="grid size-10 place-items-center rounded-md bg-ink text-base font-black text-raised">D</span>
          <DrawerTitle className="text-lg font-bold">{t("app.name")}</DrawerTitle>
        </div>
        <div className="mobile-navigation-content flex flex-col">
          <NavigationContent expanded onNavigate={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
