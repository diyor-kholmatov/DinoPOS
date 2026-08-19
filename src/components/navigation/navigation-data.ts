import {
  ArchiveRestore,
  BarChart3,
  Boxes,
  ClipboardClock,
  FileClock,
  Gauge,
  HandCoins,
  PackageOpen,
  ReceiptText,
  RotateCcw,
  Settings,
  ShoppingCart,
  Store,
  Truck,
  Upload,
  UserRound,
  UsersRound,
  WalletCards,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

export interface NavigationEntry {
  to: string;
  labelKey: string;
  icon: LucideIcon;
}

export const primaryNavigation: NavigationEntry[] = [
  { to: "/dashboard", labelKey: "dashboard", icon: Gauge },
  { to: "/checkout", labelKey: "checkout", icon: ShoppingCart },
  { to: "/catalog", labelKey: "catalog", icon: PackageOpen },
];

export const operationsNavigation: NavigationEntry[] = [
  { to: "/inventory", labelKey: "inventory", icon: Warehouse },
  { to: "/customers", labelKey: "clients", icon: UsersRound },
  { to: "/reports", labelKey: "reports", icon: BarChart3 },
];

export const additionalNavigation: NavigationEntry[] = [
  { to: "/sales", labelKey: "sales", icon: ReceiptText },
  { to: "/suppliers", labelKey: "suppliers", icon: Truck },
  { to: "/returns", labelKey: "returns", icon: RotateCcw },
  { to: "/drafts", labelKey: "drafts", icon: FileClock },
  { to: "/holds", labelKey: "holds", icon: ArchiveRestore },
  { to: "/shift", labelKey: "shift", icon: ClipboardClock },
  { to: "/cash-operations", labelKey: "cash-operations", icon: HandCoins },
  { to: "/register-history", labelKey: "register-history", icon: WalletCards },
  { to: "/catalog/import", labelKey: "import", icon: Upload },
  { to: "/inventory/transfers", labelKey: "transfer", icon: Boxes },
];

export const settingsNavigation: NavigationEntry = {
  to: "/settings",
  labelKey: "configuration",
  icon: Settings,
};

export const allNavigation = [
  ...primaryNavigation,
  ...operationsNavigation,
  ...additionalNavigation,
  settingsNavigation,
];

export const navigationUtilityIcons = {
  store: Store,
  profile: UserRound,
};
