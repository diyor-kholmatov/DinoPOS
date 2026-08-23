import type { Customer } from "@/entities/customer/model";
import type { Product } from "@/entities/product/model";
import type { Register } from "@/entities/register/model";
import type { Sale } from "@/entities/sale/model";
import type { Employee } from "@/entities/shift/model";
import type { Store } from "@/entities/store/model";

export const seedStores: Store[] = [
  { id: "b1", name: "Downtown Store" },
  { id: "b2", name: "Airport Kiosk" },
  { id: "b3", name: "Salon Corner" },
];

const productRows = [
  ["Espresso", "ROS-0001", "4780010001", "Drinks", "Coffee Trade", 25000, 15500, 40, 18],
  ["Cappuccino", "ROS-0002", "4780010002", "Drinks", "Coffee Trade", 38000, 23500, 35, 12],
  ["Sparkling Water 330ml", "ROS-0003", "4780010003", "Drinks", "Fresh Foods", 12000, 7200, 5, 16],
  ["Matcha Syrup", "ROS-0004", "4780010004", "Drinks", "Tea Imports", 85000, 52000, 3, 8],
  ["White Sneakers", "ROS-0005", "4780010005", "Sneakers", "Urban Kicks", 790000, 490000, 14, 4],
  ["Sneaker Cleaner Kit", "ROS-0006", "4780010006", "Sneakers", "Urban Kicks", 150000, 90000, 2, 5],
  ["Shoe Laces", "ROS-0007", "4780010007", "Sneakers", "Shoe Hub", 30000, 15000, 3, 20],
  ["Classic Haircut", "ROS-0008", "4780010008", "Beauty", "In-house", 120000, 0, 999, 999],
  ["Sneakers Cleaning", "ROS-0009", "4780010009", "Services", "In-house", 250000, 0, 999, 999],
  ["Shampoo 500ml", "ROS-0010", "4780010010", "Beauty", "Beauty World", 120000, 70000, 22, 9],
  ["Face Cream", "ROS-0011", "4780010011", "Beauty", "Beauty World", 180000, 105000, 0, 6],
  ["Coffee Beans 1kg", "ROS-0012", "4780010012", "Groceries", "Coffee Co.", 210000, 135000, 25, 11],
] as const;

export const seedProducts: Product[] = productRows.map((row, index) => ({
  id: `p${index + 1}`,
  name: row[0],
  sku: row[1],
  barcode: row[2],
  category: row[3],
  supplier: row[4],
  price: row[5],
  cost: row[6],
  stockByStore: {
    b1: row[7],
    b2: row[8],
    b3: Math.max(0, Math.floor(row[7] / 2)),
  },
  unit: row[7] > 100 ? "service" : "pcs",
  favorite: index < 6,
  active: row[7] !== 0,
}));

const customerNames = [
  "Emily Carter",
  "James Anderson",
  "Sophia Martinez",
  "Liam Thompson",
  "Olivia Brown",
  "Noah Wilson",
];

export const seedCustomers: Customer[] = customerNames.map((name, index) => ({
  id: `c${index + 1}`,
  name,
  phone: `+998 90 555 ${1100 + index}`,
  totalSpent: (index + 2) * 620000,
  debt: index === 1 ? 450000 : index === 5 ? 200000 : 0,
  prepayment: index === 2 ? 750000 : index === 3 ? 300000 : 0,
  loyalty: ["Gold", "Silver", "VIP", "Silver", "Gold", "Bronze"][index] ?? "",
  receiptHistory: [],
}));

export const seedEmployees: Employee[] = [
  { id: "e1", name: "Liam Johnson", role: "Owner", active: true },
  { id: "e2", name: "Emma Davis", role: "Manager", active: true },
  { id: "e3", name: "Noah Wilson", role: "Cashier", active: true },
  { id: "e4", name: "Olivia Brown", role: "Cashier", active: true },
];

export const seedRegister: Register = {
  id: "REG-01",
  storeId: "b1",
  isOpen: false,
  shiftId: "",
  cashierId: "",
  openingAmount: 0,
  expectedCash: 0,
  openedAt: "",
};

const saleDays = [0, 0, 1, 2, 3, 5, 6, 8, 12, 18, 24, 29];

export const seedSales: Sale[] = saleDays.map((daysAgo, index) => {
  const product = seedProducts[index % seedProducts.length]!;
  const customer = seedCustomers[index % seedCustomers.length]!;
  const cashier = seedEmployees[index % seedEmployees.length]!;
  const quantity = product.unit === "service" ? 1 : (index % 3) + 1;
  const subtotal = product.price * quantity;
  const discount = index % 4 === 0 ? Math.round(subtotal * 0.05) : 0;
  const tax = Math.round((subtotal - discount) * 0.12);
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - daysAgo);
  createdAt.setHours(9 + (index % 9), 10 + index, 0, 0);

  return {
    id: `seed-sale-${index + 1}`,
    receiptNumber: `R-${10482 + index}`,
    createdAt: createdAt.toISOString(),
    storeId: seedStores[index % seedStores.length]!.id,
    registerId: "REG-01",
    shiftId: `SH-${330 + index}`,
    cashierName: cashier.name,
    customerId: customer.id,
    customerName: customer.name,
    lines: [{
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity,
      lineDiscount: discount ? 5 : 0,
    }],
    subtotal,
    discount,
    tax,
    total: subtotal - discount + tax,
    paymentMethod: ["cash", "card", "qr", "transfer"][index % 4] as Sale["paymentMethod"],
    fiscalized: true,
    fiscalId: `FISC-${8200 + index}`,
    status: "completed",
  };
});
