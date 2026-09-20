import { render, screen } from "@testing-library/react";
import { TableToolbar } from "@/components/data/table-toolbar";
import { LoadingState } from "@/components/patterns/feedback-state";
import { PageContextHeader, WorkspaceSurface } from "@/components/patterns/workspace";

describe("shared visual foundations", () => {
  it("keeps page context and actions in one header composition", () => {
    render(
      <PageContextHeader
        context={<h1>All stores</h1>}
        actions={<button type="button">New sale</button>}
      />,
    );

    expect(screen.getByRole("heading", { name: "All stores" })).toBeVisible();
    expect(screen.getByRole("button", { name: "New sale" })).toBeVisible();
  });

  it("provides an accessible loading state", () => {
    render(<LoadingState label="Loading sales" />);

    expect(screen.getByRole("status", { name: "Loading sales" })).toHaveAttribute("aria-busy", "true");
  });

  it("composes table controls without adding another surface", () => {
    render(
      <WorkspaceSurface aria-label="Inventory workspace">
        <TableToolbar
          search={<input aria-label="Search inventory" />}
          meta="2 results"
          actions={<button type="button">Add item</button>}
        />
      </WorkspaceSurface>,
    );

    expect(screen.getByRole("region", { name: "Inventory workspace" })).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Search inventory" })).toBeVisible();
    expect(screen.getByText("2 results")).toBeVisible();
  });
});
