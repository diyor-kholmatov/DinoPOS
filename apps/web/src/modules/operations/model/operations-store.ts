import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/shared/config/storage-keys";
import { getBrowserStorage } from "@/shared/persistence/storage";
import type {
  CashOperation,
  HoldRecord,
  ImportRecord,
  PurchaseOrder,
  ReturnRecord,
  ShiftHistoryRecord,
  StocktakeRecord,
  Supplier,
  TransferRecord,
} from "./types";
import {
  seedCashOperations,
  seedHolds,
  seedPurchaseOrders,
  seedReturns,
  seedShiftHistory,
  seedStocktakes,
  seedSuppliers,
  seedTransfers,
} from "./seed";

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
      name: STORAGE_KEYS.operations,
      version: 1,
      storage: createJSONStorage(getBrowserStorage),
    },
  ),
);
