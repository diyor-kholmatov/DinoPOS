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

