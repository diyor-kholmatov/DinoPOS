import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import { NavigationRail } from "@/components/navigation/navigation-rail";

const meta = { title: "Navigation/NavigationRail", component: NavigationRail, parameters: { layout: "fullscreen" } } satisfies Meta<typeof NavigationRail>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Compact: Story = {
  render: () => <MemoryRouter initialEntries={["/checkout"]}><NavigationRail /></MemoryRouter>,
};
