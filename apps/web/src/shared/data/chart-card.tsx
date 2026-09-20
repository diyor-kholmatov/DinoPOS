import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { WorkspaceSurface } from "@/components/patterns/workspace";

interface ChartCardProps {
  title: string;
  value: string;
  labels: string[];
  values: number[];
}

export function ChartCard({ title, value, labels, values }: ChartCardProps) {
  const styles = getComputedStyle(document.documentElement);
  const dataColor = styles.getPropertyValue("--color-data-1").trim() || "currentColor";
  const borderColor = styles.getPropertyValue("--color-border-default").trim() || "transparent";
  const mutedColor = styles.getPropertyValue("--color-text-muted").trim() || "currentColor";
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
    <WorkspaceSurface className="w-full p-4">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-base font-bold text-ink">{title}</h2>
        <strong className="text-xl text-ink tabular-nums">{value}</strong>
      </div>
      <ReactECharts option={option} style={{ height: 260 }} notMerge lazyUpdate />
    </WorkspaceSurface>
  );
}
