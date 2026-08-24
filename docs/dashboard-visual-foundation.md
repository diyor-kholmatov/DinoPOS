# DinoPOS Dashboard Visual Foundation

Status: approved visual direction. Future work may restore behavior and polish spacing, but must not replace this composition or visual language without a separate design review.

Reference screenshot: [`dashboard-approved-1440x900.png`](./dashboard-approved-1440x900.png)

## Visual Rules

- Typography: Inter throughout. Page context is `24px / 30px`, section titles are `14-15px`, labels are `11-12px`, and the main analytical total is `28px / 36px`.
- Numerals: money, counts, percentages, axes, and tabular data use tabular numerals. Numeric columns are right-aligned and never wrap.
- Spacing: use the 4px token scale only: 4, 8, 12, 16, 20, 24, 32, 40, and 48px.
- Radii: 4px for compact states, 6px for controls, and 8px for complete workspaces. Avoid oversized rounding.
- Borders: use `--color-border-default` only to define complete functional workspaces, navigation groups, and row separation. Do not card every metric or row.
- Shadow: only the primary analytics workspace receives `--shadow-sm`. Secondary workspaces remain flat.
- Icons: neutral by default. Do not add decorative icon containers.

## Option A Color Roles

- Primary action: `#A6E000`. Reserve it for the main action and focus treatment.
- Positive status: `#15803D`.
- Warning status: `#C77A06`.
- Danger status: `#C2342B`.
- Data series: `#4F6F9E`, `#2F8E86`, `#747B91`, `#8A6F8F`, `#8C7A5B`.
- Light surfaces: canvas `#FAFAF7`, panel `#F3F3EE`, raised `#FFFFFF`, border `#E6E6DF`, primary text `#1A1A16`.
- Dark surfaces: canvas `#090B0F`, panel `#15171C`, raised `#1E2026`, border `#2A2D35`, primary text `#FFFFFF`.

Action colors must not be used as chart categories. Semantic colors must communicate an actual positive, warning, or danger state.

## Desktop Layout

- Expanded Dashboard sidebar: 176px. Manual collapsed state: 64px. Expanded remains the desktop default.
- Content: fluid width with a 1600px maximum and 24px page padding.
- Header: 40px minimum height. Store scope is the primary title. New Sale is a compact 40px action.
- Filter rail: 40px high, integrated surface, period selector on the left, date range on the right.
- Primary analytics workspace at 1440x900: approximately 375px high, 8px radius, 20px internal padding.
- Chart: dominant region with a 258px visualization height.
- Period summary: 272px at 1280px and wider. It moves below the chart at narrower widths and becomes a two-column definition list.
- Detail control: 256px wide and 40px high so RU, UZ, and EN values remain readable.
- Secondary operational workspace: one shared border with two regions. Internal padding is 16px, data rows are 48px, and Needs attention shows at most three exceptions.
- Main section gaps: 16px from filters to analytics, then 20px to the operational workspace.

## Responsive Behavior

- 1440px: expanded 176px sidebar, chart and 272px summary side by side, lower workspace split into two regions.
- 1280px: same composition with a fluid chart region. No horizontal page overflow.
- 1024px: expanded 176px sidebar remains visible; summary moves below the chart in two columns; lower workspace stays structured and the page scrolls vertically.
- Values must remain right-aligned, non-wrapping, and free from label overlap at all three review widths.

## Period And Detail Behavior

Date range and chart detail are independent controls. All totals, comparisons, labels, points, axes, and tooltips are generated from the same hourly source dataset.

| Period | Available detail | Default |
| --- | --- | --- |
| Yesterday | Hour | Hour |
| Today | Hour | Hour |
| Week | Hour, Day | Day |
| Month | Hour, Day, Week | Day |
| Year | Day, Week, Month | Month |

Custom ranges use duration rules inherited from the previous implementation:

- 1-2 days: hour or day.
- 3-45 days: day or week.
- 46-180 days: day, week, or month.
- More than 180 days: week or month.

The previous period is the immediately preceding range with the same duration. ECharts inside and slider zoom are enabled when a selected detail produces more than 36 points; dense series initially show the latest 120 points.

## Foundation For Remaining Modules

Future modules should reuse this sidebar, type scale, warm neutral surfaces, Option A role-based colors, 4px spacing grid, restrained borders, 40px controls, 44-48px operational rows, and right-aligned tabular numeric columns. They should not copy the Dashboard composition when another workflow requires a different information structure.
