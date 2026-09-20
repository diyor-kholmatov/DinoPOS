import { Plus } from "lucide-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "New sale" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: "primary", children: <><Plus className="size-4" />New sale</> } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Loading: Story = { args: { variant: "primary", isLoading: true } };
export const Disabled: Story = { args: { variant: "primary", disabled: true } };
export const Danger: Story = { args: { variant: "danger", children: "Delete data" } };
