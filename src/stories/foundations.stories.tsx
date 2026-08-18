import type { Meta, StoryObj } from "@storybook/react-vite";

const semanticTokens = [
  ["Action", "--color-action-primary"],
  ["Positive", "--color-status-positive"],
  ["Warning", "--color-status-warning"],
  ["Danger", "--color-status-danger"],
  ["Data 1", "--color-chart-data-1"],
  ["Data 2", "--color-chart-data-2"],
] as const;

function Foundations() {
  return (
    <div className="w-full max-w-4xl bg-canvas p-6 text-ink">
      <h1 className="text-2xl font-bold">Option A foundations</h1>
      <p className="mt-1 text-sm text-muted">Action, semantic status, and data colors have separate jobs.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {semanticTokens.map(([label, token]) => (
          <div key={token} className="rounded-md border border-border bg-raised p-3">
            <span className="block h-12 rounded-sm" style={{ background: `var(${token})` }} />
            <strong className="mt-3 block text-sm">{label}</strong>
            <code className="text-xs text-muted">{token}</code>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-3 rounded-md border border-border bg-panel p-4">
        <h2 className="text-xl font-bold">Warm neutral hierarchy</h2>
        <p className="text-sm text-muted">Primary and secondary text remain readable without using status colors as decoration.</p>
      </div>
    </div>
  );
}

const meta = { title: "Foundations/Option A", component: Foundations, parameters: { layout: "fullscreen" } } satisfies Meta<typeof Foundations>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Tokens: Story = {};
