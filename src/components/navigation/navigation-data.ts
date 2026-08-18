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
  legacyFile?: string;
}

export const primaryNavigation: NavigationEntry[] = [
  { to: "/dashboard", labelKey: "dashboard", icon: Gauge, legacyFile: "dashboard.html" },
  { to: "/checkout", labelKey: "checkout", icon: ShoppingCart, legacyFile: "checkout.html" },
  { to: "/catalog", labelKey: "catalog", icon: PackageOpen, legacyFile: "catalog.html" },
];

export const operationsNavigation: NavigationEntry[] = [
  { to: "/inventory", labelKey: "inventory", icon: Warehouse, legacyFile: "inventory.html" },
  { to: "/customers", labelKey: "clients", icon: UsersRound, legacyFile: "clients.html" },
  { to: "/reports", labelKey: "reports", icon: BarChart3, legacyFile: "reports.html" },
];

export const additionalNavigation: NavigationEntry[] = [
  { to: "/sales", labelKey: "sales", icon: ReceiptText, legacyFile: "sales.html" },
  { to: "/suppliers", labelKey: "suppliers", icon: Truck, legacyFile: "suppliers.html" },
  { to: "/returns", labelKey: "returns", icon: RotateCcw, legacyFile: "returns.html" },
  { to: "/drafts", labelKey: "drafts", icon: FileClock, legacyFile: "drafts.html" },
  { to: "/holds", labelKey: "holds", icon: ArchiveRestore, legacyFile: "holds.html" },
  { to: "/shift", labelKey: "shift", icon: ClipboardClock, legacyFile: "shift.html" },
  { to: "/cash-operations", labelKey: "cash-operations", icon: HandCoins, legacyFile: "cash-operations.html" },
  { to: "/register-history", labelKey: "register-history", icon: WalletCards, legacyFile: "register-history.html" },
  { to: "/catalog/import", labelKey: "import", icon: Upload, legacyFile: "import.html" },
  { to: "/inventory/transfers", labelKey: "transfer", icon: Boxes, legacyFile: "transfer.html" },
];

export const settingsNavigation: NavigationEntry = {
  to: "/settings",
  labelKey: "configuration",
  icon: Settings,
  legacyFile: "configuration.html",
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

