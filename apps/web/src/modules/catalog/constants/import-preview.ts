export interface ImportPreviewRow {
  name: string;
  barcode: string;
  price: number;
  valid: boolean;
}

export const importPreviewRows: ImportPreviewRow[] = [
  { name: "Green Tea 500g", barcode: "4780091101", price: 92_000, valid: true },
  { name: "Leather Protector", barcode: "4780091102", price: 175_000, valid: true },
  { name: "", barcode: "4780091103", price: 48_000, valid: false },
];

