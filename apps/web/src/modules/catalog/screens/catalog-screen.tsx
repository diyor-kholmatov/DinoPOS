import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit2, Plus, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import type { Product } from "@/entities/product/model";
import { DataTable } from "@/components/data/data-table";
import { PageHeader, PageLayout, SectionHeader, SegmentedControl } from "@/components/patterns/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { SearchField } from "@/components/ui/search-field";
import { SelectField } from "@/components/ui/select-field";
import { formatMoney } from "@/lib/format";
import { useCatalogStore } from "@/stores/catalog-store";
import { useSessionStore } from "@/stores/session-store";

const ProductFormSchema = z.object({
  name: z.string().trim().min(1),
  sku: z.string().trim().min(1),
  barcode: z.string().trim().min(3),
  category: z.string().trim().min(1),
  supplier: z.string().trim().min(1),
  price: z.number().positive(),
  cost: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  unit: z.enum(["pcs", "service"]),
});
type ProductFormValues = z.infer<typeof ProductFormSchema>;

const defaults: ProductFormValues = {
  name: "",
  sku: "",
  barcode: "",
  category: "General",
  supplier: "In-house",
  price: 0,
  cost: 0,
  stock: 0,
  unit: "pcs",
};

export function CatalogPage() {
  const { t } = useTranslation();
  const products = useCatalogStore((state) => state.products);
  const addProduct = useCatalogStore((state) => state.addProduct);
  const updateProduct = useCatalogStore((state) => state.updateProduct);
  const selectedStoreId = useSessionStore((state) => state.selectedStoreId);
  const locale = useSessionStore((state) => state.locale);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: defaults,
  });
  const categories = ["all", ...new Set(products.map((product) => product.category))];
  const visible = useMemo(() => products.filter((product) => {
    const needle = search.trim().toLocaleLowerCase();
    return (!needle || [product.name, product.sku, product.barcode, product.supplier].some((value) => value.toLocaleLowerCase().includes(needle)))
      && (type === "all" || (type === "products" && product.unit === "pcs") || (type === "services" && product.unit === "service"))
      && (category === "all" || product.category === category);
  }), [category, products, search, type]);

  const openCreate = () => {
    setEditing(null);
    reset(defaults);
    setDialogOpen(true);
  };
  const openEdit = (product: Product) => {
    setEditing(product);
    reset({
      name: product.name,
      sku: product.sku,
      barcode: product.barcode,
      category: product.category,
      supplier: product.supplier,
      price: product.price,
      cost: product.cost,
      stock: product.unit === "service" ? 0 : product.stockByStore[selectedStoreId] ?? 0,
      unit: product.unit,
    });
    setDialogOpen(true);
  };
  const submit = (values: ProductFormValues) => {
    const duplicate = products.some((product) => product.barcode === values.barcode && product.id !== editing?.id);
    if (duplicate) {
      toast.error(t("toast.barcodeDuplicate"));
      return;
    }
    const product: Product = {
      id: editing?.id ?? `p-${crypto.randomUUID()}`,
      name: values.name,
      sku: values.sku,
      barcode: values.barcode,
      category: values.category,
      supplier: values.supplier,
      price: values.price,
      cost: values.cost,
      unit: values.unit,
      favorite: editing?.favorite ?? false,
      active: editing?.active ?? true,
      stockByStore: {
        ...(editing?.stockByStore ?? {}),
        [selectedStoreId]: values.unit === "service" ? 0 : values.stock,
      },
    };
    if (editing) updateProduct(product); else addProduct(product);
    setDialogOpen(false);
    toast.success(t("toast.productSaved"));
  };

  const columns: ColumnDef<Product>[] = [
    { accessorKey: "name", header: t("catalog.item"), cell: ({ row }) => <span><strong className="block">{row.original.name}</strong><small className="text-xs text-muted">{row.original.sku}</small></span> },
    { accessorKey: "unit", header: t("common.status"), cell: ({ row }) => <Badge>{t(row.original.unit === "service" ? "common.service" : "common.products")}</Badge> },
    { accessorKey: "price", header: t("catalog.salePrice"), cell: ({ row }) => <span className="tabular-nums">{formatMoney(row.original.price, locale)}</span> },
    { accessorKey: "cost", header: t("catalog.cost"), cell: ({ row }) => <span className="tabular-nums text-muted">{formatMoney(row.original.cost, locale)}</span> },
    { id: "stock", header: t("catalog.stockBalance"), accessorFn: (row) => row.stockByStore[selectedStoreId] ?? 0, cell: ({ row }) => row.original.unit === "service" ? "—" : <span className="tabular-nums">{row.original.stockByStore[selectedStoreId] ?? 0}</span> },
    { accessorKey: "category", header: t("common.category") },
    { accessorKey: "supplier", header: t("common.supplier") },
    { accessorKey: "active", header: t("common.status"), cell: ({ row }) => <Badge variant={row.original.active ? "positive" : "neutral"}>{t(row.original.active ? "status.active" : "status.inactive")}</Badge> },
    { id: "actions", enableSorting: false, header: t("common.action"), cell: ({ row }) => <IconButton label={t("catalog.editProduct")} size="small" tooltipSide="left" onClick={() => openEdit(row.original)}><Edit2 className="size-4" /></IconButton> },
  ];

  return (
    <PageLayout>
      <PageHeader
        title={t("catalog.title")}
        description={t("catalog.description")}
        actions={(
          <>
            <Button asChild><Link to="/catalog/import"><Upload className="size-4" />{t("import")}</Link></Button>
            <Button variant="primary" onClick={openCreate}><Plus className="size-4" />{t("catalog.createProduct")}</Button>
          </>
        )}
      />
      <section className="mt-5 flex flex-wrap items-end gap-3">
        <SearchField className="w-full sm:max-w-md" label={t("table.search")} placeholder={t("checkout.searchPlaceholder")} value={search} onChange={setSearch} />
        <SegmentedControl label={t("common.items")} value={type} onChange={setType} options={[
          { id: "all", label: t("common.all") },
          { id: "products", label: t("common.products") },
          { id: "services", label: t("common.services") },
        ]} />
        <SelectField hideLabel size="compact" className="min-w-44" label={t("common.category")} value={category} onChange={setCategory} options={categories.map((item) => ({ id: item, label: item === "all" ? t("common.all") : item }))} />
      </section>
      <section className="mt-5">
        <SectionHeader title={t("catalog.title")} description={t("catalog.stockActiveBranch")} />
        <DataTable data={visible} columns={columns} caption={t("catalog.title")} emptyMessage={t("catalog.noProducts")} />
      </section>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent closeLabel={t("common.closeDialog")}>
          <DialogHeader>
            <DialogTitle>{editing ? t("catalog.editProduct") : t("catalog.createProduct")}</DialogTitle>
            <DialogDescription>{t("catalog.description")}</DialogDescription>
          </DialogHeader>
          <form className="grid gap-3" onSubmit={handleSubmit(submit)}>
            <label className="grid gap-1.5 text-xs font-semibold text-muted">{t("common.name")}<Input {...register("name")} aria-invalid={Boolean(errors.name)} /></label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-semibold text-muted">SKU<Input {...register("sku")} aria-invalid={Boolean(errors.sku)} /></label>
              <label className="grid gap-1.5 text-xs font-semibold text-muted">{t("common.barcode")}<Input {...register("barcode")} aria-invalid={Boolean(errors.barcode)} /></label>
              <label className="grid gap-1.5 text-xs font-semibold text-muted">{t("common.category")}<Input {...register("category")} /></label>
              <label className="grid gap-1.5 text-xs font-semibold text-muted">{t("common.supplier")}<Input {...register("supplier")} /></label>
              <label className="grid gap-1.5 text-xs font-semibold text-muted">{t("catalog.salePrice")}<Input type="number" {...register("price", { valueAsNumber: true })} /></label>
              <label className="grid gap-1.5 text-xs font-semibold text-muted">{t("catalog.cost")}<Input type="number" {...register("cost", { valueAsNumber: true })} /></label>
              <label className="grid gap-1.5 text-xs font-semibold text-muted">{t("common.stock")}<Input type="number" {...register("stock", { valueAsNumber: true })} /></label>
              <label className="grid gap-1.5 text-xs font-semibold text-muted">{t("common.status")}<select className="h-11 rounded-md border border-border bg-raised px-3 text-ink" {...register("unit")}><option value="pcs">{t("common.products")}</option><option value="service">{t("common.service")}</option></select></label>
            </div>
            {Object.keys(errors).length ? <p className="text-xs text-danger">{t("common.validation")}</p> : null}
            <Button type="submit" variant="primary" className="mt-2">{t("common.save")}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}

export default CatalogPage;
