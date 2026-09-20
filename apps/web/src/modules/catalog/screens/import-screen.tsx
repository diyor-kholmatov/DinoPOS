import { CheckCircle2, FileSpreadsheet, ScanBarcode, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PageHeader, PageLayout, SectionHeader } from "@/components/patterns/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCatalogStore } from "@/stores/catalog-store";
import { useOperationsStore } from "@/stores/operations-store";

const previewRows = [
  { name: "Green Tea 500g", barcode: "4780091101", price: 92_000, valid: true },
  { name: "Leather Protector", barcode: "4780091102", price: 175_000, valid: true },
  { name: "", barcode: "4780091103", price: 48_000, valid: false },
];

export function ImportPage() {
  const { t } = useTranslation();
  const products = useCatalogStore((state) => state.products);
  const addImport = useOperationsStore((state) => state.addImport);
  const imports = useOperationsStore((state) => state.imports);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [scan, setScan] = useState("");
  const upload = (name: string) => {
    setFileName(name || "products.xlsx");
  };
  const finishImport = () => {
    addImport({ id: `IMP-${Date.now().toString().slice(-4)}`, fileName, rows: previewRows.length, validRows: previewRows.filter((row) => row.valid).length, status: "finished", createdAt: new Date().toISOString() });
    toast.success(t("template.imported", { count: 2 }));
    setFileName("");
  };
  const scanProduct = () => {
    const product = products.find((item) => item.barcode === scan || item.sku === scan);
    if (product) toast.success(product.name);
    else toast.error(t("toast.productNotFound"));
    setScan("");
  };

  return (
    <PageLayout>
      <PageHeader title={t("import")} description={t("import.description")} actions={<Button onClick={() => fileRef.current?.click()}><Upload className="size-4" />{t("import.uploadFile")}</Button>} />
      <input ref={fileRef} type="file" accept=".xlsx,.csv" className="sr-only" onChange={(event) => upload(event.target.files?.[0]?.name ?? "")} />
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-md border border-border bg-raised p-4">
          <SectionHeader title={t("import.fileImport")} description={t("import.fileHelp")} />
          {!fileName ? (
            <button type="button" className="grid min-h-56 w-full place-items-center rounded-md border border-dashed border-border text-center hover:bg-sunken" onClick={() => fileRef.current?.click()}>
              <span><FileSpreadsheet className="mx-auto size-8 text-faint" /><strong className="mt-3 block">{t("import.chooseFile")}</strong><small className="mt-1 block text-muted">.xlsx, .csv</small></span>
            </button>
          ) : (
            <div>
              <div className="flex items-center justify-between gap-3 border-b border-border pb-3"><strong>{fileName}</strong><Badge variant="information">{t("common.validation")}</Badge></div>
              <ul className="divide-y divide-border">
                {previewRows.map((row, index) => <li key={row.barcode} className="flex min-h-12 items-center gap-3 py-2"><span className="grid size-7 place-items-center rounded-sm bg-sunken text-xs font-bold">{index + 1}</span><span className="min-w-0 flex-1"><strong className="block truncate text-sm">{row.name || t("validation.missingName")}</strong><small className="text-xs text-muted">{row.barcode}</small></span><Badge variant={row.valid ? "positive" : "danger"}>{row.valid ? t("import.valid") : t("common.errors")}</Badge></li>)}
              </ul>
              <Button variant="primary" className="mt-4 w-full" onClick={finishImport}><CheckCircle2 className="size-4" />{t("import.validRows")}</Button>
            </div>
          )}
        </section>
        <section className="rounded-md border border-border bg-raised p-4">
          <SectionHeader title={t("import.manualScanner")} description={t("import.scanUnknown")} />
          <div className="flex gap-2"><Input value={scan} onChange={(event) => setScan(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") scanProduct(); }} placeholder={t("common.barcode")} /><Button onClick={scanProduct}><ScanBarcode className="size-4" />{t("common.select")}</Button></div>
          <SectionHeader title={t("import.history")} description={t("import.historyHelp")} />
          {imports.length ? <ul className="divide-y divide-border">{imports.map((record) => <li key={record.id} className="flex min-h-14 items-center justify-between gap-3 py-2"><span><strong className="block text-sm">{record.fileName}</strong><small className="text-xs text-muted">{record.validRows}/{record.rows} {t("common.rows")}</small></span><Badge variant="positive">{t("status.finished")}</Badge></li>)}</ul> : <p className="py-12 text-center text-sm text-muted">{t("import.noSession")}</p>}
        </section>
      </div>
    </PageLayout>
  );
}

export default ImportPage;
