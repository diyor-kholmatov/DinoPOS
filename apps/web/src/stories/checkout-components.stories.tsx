import type { Meta, StoryObj } from "@storybook/react-vite";
import { CartLine } from "@/features/checkout/components/cart-line";
import { ProductTile } from "@/features/checkout/components/product-tile";
import { seedProducts } from "@/lib/legacy/seed";

const meta = { title: "Checkout/Product tile", component: ProductTile } satisfies Meta<typeof ProductTile>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Available: Story = { args: { product: seedProducts[0]!, available: 40, quantityInCart: 0, locale: "en", onAdd: () => undefined } };
export const InCart: Story = { args: { product: seedProducts[4]!, available: 14, quantityInCart: 2, locale: "en", onAdd: () => undefined } };
export const LowStock: Story = { args: { product: seedProducts[5]!, available: 2, quantityInCart: 0, locale: "en", onAdd: () => undefined } };
export const OutOfStock: Story = { args: { product: seedProducts[10]!, available: 0, quantityInCart: 0, locale: "en", onAdd: () => undefined } };

export const CartItem: StoryObj<typeof CartLine> = {
  render: () => (
    <ul className="w-96 rounded-md border border-border bg-raised px-4">
      <CartLine
        line={{ productId: "p1", name: "Espresso", unitPrice: 25000, quantity: 2, lineDiscount: 0 }}
        locale="en"
        canIncrease
        onDecrease={() => undefined}
        onIncrease={() => undefined}
        onRemove={() => undefined}
      />
    </ul>
  ),
};
