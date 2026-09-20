import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  balance: number;
  active: boolean;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  storeId: string;
  products: number;
  orderedAmount: number;
  receivedAmount: number;
  status: "created" | "accepted" | "paid" | "return";
  createdAt: string;
}

export interface TransferRecord {
  id: string;
  productId: string;
  productName: string;
  sourceStoreId: string;
  destinationStoreId: string;
  quantity: number;
  status: "draft" | "sent" | "accepted";
  createdAt: string;
}

export interface ReturnRecord {
  id: string;
  saleId: string;
  customerName: string;
  type: "return" | "exchange";
  amount: number;
  paymentMethod: "cash" | "prepayment";
  status: "completed";
  createdAt: string;
}

export interface HoldRecord {
  id: string;
  customerId: string;
  customerName: string;
  storeId: string;
  lines: Array<{ productId: string; productName: string; quantity: number; unitPrice: number }>;
  deposit: number;
  status: "active" | "redeemed" | "cancelled";
  createdAt: string;
}

export interface CashOperation {
  id: string;
  shiftId: string;
  storeId: string;
  type: "income" | "expense" | "collection";
  amount: number;
  reason: string;
  actor: string;
  createdAt: string;
}

export interface ShiftHistoryRecord {
  id: string;
  storeId: string;
  registerId: string;
  cashierName: string;
  openedAt: string;
  closedAt: string;
  openingAmount: number;
  expectedAmount: number;
  countedAmount: number;
  variance: number;
}

export interface StocktakeRecord {
  id: string;
  storeId: string;
  status: "in_progress" | "completed";
  progress: number;
  variance: number;
  createdAt: string;
}

export interface ImportRecord {
  id: string;
  fileName: string;
  rows: number;
  validRows: number;
  status: "checking" | "finished";
  createdAt: string;
}

interface OperationsState {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  transfers: TransferRecord[];
  returns: ReturnRecord[];
  holds: HoldRecord[];
  cashOperations: CashOperation[];
  shiftHistory: ShiftHistoryRecord[];
  stocktakes: StocktakeRecord[];
  imports: ImportRecord[];
  addPurchaseOrder: (order: PurchaseOrder) => void;
  addTransfer: (transfer: TransferRecord) => void;
  updateTransferStatus: (id: string, status: TransferRecord["status"]) => void;
  addReturn: (record: ReturnRecord) => void;
  addHold: (record: HoldRecord) => void;
  updateHoldStatus: (id: string, status: HoldRecord["status"]) => void;
  addCashOperation: (operation: CashOperation) => void;
  addShiftHistory: (record: ShiftHistoryRecord) => void;
  addStocktake: (record: StocktakeRecord) => void;
  addImport: (record: ImportRecord) => void;
}

const now = Date.now();
const isoDaysAgo = (days: number) => new Date(now - days * 86_400_000).toISOString();

const seedSuppliers: Supplier[] = [
  { id: "s1", name: "Coffee Trade", contact: "Daniel Reed", phone: "+998 90 410 2211", balance: 2_450_000, active: true },
  { id: "s2", name: "Urban Kicks", contact: "Maya Lee", phone: "+998 90 410 2212", balance: 6_820_000, active: true },
  { id: "s3", name: "Beauty World", contact: "Sara Khan", phone: "+998 90 410 2213", balance: 0, active: true },
  { id: "s4", name: "Fresh Foods", contact: "Alex Morgan", phone: "+998 90 410 2214", balance: 930_000, active: true },
];

const seedPurchaseOrders: PurchaseOrder[] = [
  { id: "PO-1048", supplierId: "s2", storeId: "b1", products: 4, orderedAmount: 8_400_000, receivedAmount: 5_600_000, status: "accepted", createdAt: isoDaysAgo(2) },
  { id: "PO-1047", supplierId: "s1", storeId: "b2", products: 3, orderedAmount: 3_250_000, receivedAmount: 3_250_000, status: "paid", createdAt: isoDaysAgo(5) },
  { id: "PO-1046", supplierId: "s4", storeId: "b1", products: 6, orderedAmount: 1_840_000, receivedAmount: 0, status: "created", createdAt: isoDaysAgo(7) },
];

const seedTransfers: TransferRecord[] = [
  { id: "TR-208", productId: "p5", productName: "White Sneakers", sourceStoreId: "b1", destinationStoreId: "b2", quantity: 2, status: "sent", createdAt: isoDaysAgo(1) },
  { id: "TR-207", productId: "p10", productName: "Shampoo 500ml", sourceStoreId: "b1", destinationStoreId: "b3", quantity: 4, status: "accepted", createdAt: isoDaysAgo(4) },
];

const seedReturns: ReturnRecord[] = [
  { id: "RET-039", saleId: "seed-sale-4", customerName: "Liam Thompson", type: "return", amount: 120_000, paymentMethod: "cash", status: "completed", createdAt: isoDaysAgo(3) },
];

const seedHolds: HoldRecord[] = [
  { id: "HOLD-118", customerId: "c2", customerName: "James Anderson", storeId: "b1", lines: [{ productId: "p5", productName: "White Sneakers", quantity: 1, unitPrice: 790_000 }], deposit: 300_000, status: "active", createdAt: isoDaysAgo(6) },
  { id: "HOLD-117", customerId: "c3", customerName: "Sophia Martinez", storeId: "b2", lines: [{ productId: "p6", productName: "Sneaker Cleaner Kit", quantity: 2, unitPrice: 150_000 }], deposit: 150_000, status: "active", createdAt: isoDaysAgo(10) },
];

const seedCashOperations: CashOperation[] = [
  { id: "CO-508", shiftId: "SH-336", storeId: "b1", type: "income", amount: 500_000, reason: "Opening change", actor: "Liam Johnson", createdAt: isoDaysAgo(1) },
  { id: "CO-507", shiftId: "SH-335", storeId: "b1", type: "collection", amount: 1_200_000, reason: "Safe collection", actor: "Emma Davis", createdAt: isoDaysAgo(2) },
];

const seedShiftHistory: ShiftHistoryRecord[] = [
  { id: "SH-335", storeId: "b1", registerId: "REG-01", cashierName: "Emma Davis", openedAt: isoDaysAgo(2), closedAt: isoDaysAgo(1), openingAmount: 500_000, expectedAmount: 4_820_000, countedAmount: 4_810_000, variance: -10_000 },
  { id: "SH-334", storeId: "b2", registerId: "REG-01", cashierName: "Noah Wilson", openedAt: isoDaysAgo(4), closedAt: isoDaysAgo(3), openingAmount: 300_000, expectedAmount: 2_640_000, countedAmount: 2_640_000, variance: 0 },
];

const seedStocktakes: StocktakeRecord[] = [
  { id: "INV-331", storeId: "b1", status: "in_progress", progress: 58, variance: -2, createdAt: isoDaysAgo(1) },
  { id: "INV-330", storeId: "b2", status: "completed", progress: 100, variance: 0, createdAt: isoDaysAgo(5) },
];

export const useOperationsStore = create<OperationsState>()(
  persist(
    (set) => ({
      suppliers: seedSuppliers,
      purchaseOrders: seedPurchaseOrders,
      transfers: seedTransfers,
      returns: seedReturns,
      holds: seedHolds,
      cashOperations: seedCashOperations,
      shiftHistory: seedShiftHistory,
      stocktakes: seedStocktakes,
      imports: [],
      addPurchaseOrder: (order) => set((state) => ({ purchaseOrders: [order, ...state.purchaseOrders] })),
      addTransfer: (transfer) => set((state) => ({ transfers: [transfer, ...state.transfers] })),
      updateTransferStatus: (id, status) => set((state) => ({
        transfers: state.transfers.map((item) => item.id === id ? { ...item, status } : item),
      })),
      addReturn: (record) => set((state) => ({ returns: [record, ...state.returns] })),
      addHold: (record) => set((state) => ({ holds: [record, ...state.holds] })),
      updateHoldStatus: (id, status) => set((state) => ({
        holds: state.holds.map((item) => item.id === id ? { ...item, status } : item),
      })),
      addCashOperation: (operation) => set((state) => ({ cashOperations: [operation, ...state.cashOperations] })),
      addShiftHistory: (record) => set((state) => ({ shiftHistory: [record, ...state.shiftHistory] })),
      addStocktake: (record) => set((state) => ({ stocktakes: [record, ...state.stocktakes] })),
      addImport: (record) => set((state) => ({ imports: [record, ...state.imports] })),
    }),
    {
      name: "dinopos-v6-operations",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
