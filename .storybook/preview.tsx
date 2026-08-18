import type { Preview } from "@storybook/react-vite";
import { AppProviders } from "../src/app/providers/app-providers";
import "../src/styles/index.css";

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    a11y: { test: "error" },
    backgrounds: { disable: true },
    layout: "centered",
  },
  globalTypes: {
    theme: {
      description: "Retail OS theme",
      defaultValue: "light",
      toolbar: {
        icon: "mirror",
        items: ["light", "dark"],
      },
    },
  },
  decorators: [
    (Story, context) => {
      document.documentElement.dataset.theme = context.globals.theme;
      return (
        <AppProviders>
          <Story />
        </AppProviders>
      );
    },
  ],
};

export default preview;
