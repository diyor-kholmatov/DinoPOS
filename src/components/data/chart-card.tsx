import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";

interface ChartCardProps {
  title: string;
  value: string;
  labels: string[];
  values: number[];
}

export function ChartCard({ title, value, labels, values }: ChartCardProps) {
  const styles = getComputedStyle(document.documentElement);
  const dataColor = styles.getPropertyValue("--color-chart-data-1").trim() || "#4F6F9E";
  const borderColor = styles.getPropertyValue("--color-border-default").trim() || "#E5E2DA";
  const mutedColor = styles.getPropertyValue("--color-text-muted").trim() || "#77736C";
  const option: EChartsOption = {
    animationDuration: 180,
    grid: { left: 8, right: 8, top: 16, bottom: 22, containLabel: true },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: labels,
      boundaryGap: false,
      axisLine: { lineStyle: { color: borderColor } },
      axisTick: { show: false },
      axisLabel: { color: mutedColor },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { color: borderColor } },
      axisLabel: { show: false },
    },
    series: [{
      type: "line",
      data: values,
      smooth: 0.25,
      showSymbol: false,
      lineStyle: { color: dataColor, width: 3 },
      areaStyle: { color: dataColor, opacity: 0.12 },
    }],
  };

  return (
    <section className="w-full max-w-3xl rounded-md border border-border bg-raised p-4">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-base font-bold text-ink">{title}</h2>
        <strong className="text-xl text-ink tabular-nums">{value}</strong>
      </div>
      <ReactECharts option={option} style={{ height: 260 }} notMerge lazyUpdate />
    </section>
  );
}
