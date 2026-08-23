import type { EChartsOption, LineSeriesOption } from "echarts";
import ReactECharts from "echarts-for-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSessionStore } from "@/stores/session-store";

interface SeriesInput {
  name: string;
  values: number[];
  colorIndex?: 1 | 2 | 3 | 4 | 5;
  area?: boolean;
}

interface ChartStateProps {
  height: number;
  ariaLabel: string;
  isLoading?: boolean;
  errorMessage?: string;
  isEmpty: boolean;
}

function ChartState({ height, ariaLabel, isLoading, errorMessage, isEmpty }: ChartStateProps) {
  const { t } = useTranslation();
  if (!isLoading && !errorMessage && !isEmpty) return null;
  return (
    <div className="grid place-items-center text-center text-sm text-muted" style={{ height }} role="status" aria-label={ariaLabel}>
      <span className={errorMessage ? "text-danger" : ""}>
        {isLoading ? t("common.loading") : errorMessage || t("chart.noData")}
      </span>
    </div>
  );
}

function chartTokens() {
  const styles = getComputedStyle(document.documentElement);
  return {
    colors: [1, 2, 3, 4, 5].map((index) => styles.getPropertyValue(`--color-data-${index}`).trim()),
    border: styles.getPropertyValue("--color-border-default").trim(),
    muted: styles.getPropertyValue("--color-text-muted").trim(),
    raised: styles.getPropertyValue("--color-surface-raised").trim(),
    ink: styles.getPropertyValue("--color-text-primary").trim(),
  };
}

export function TimeSeriesChart({
  labels,
  series,
  ariaLabel,
  height = 300,
  isLoading = false,
  errorMessage,
}: {
  labels: string[];
  series: SeriesInput[];
  ariaLabel: string;
  height?: number;
  isLoading?: boolean;
  errorMessage?: string;
}) {
  const theme = useSessionStore((state) => state.theme);
  const option = useMemo<EChartsOption>(() => {
    const tokens = chartTokens();
    const chartSeries: LineSeriesOption[] = series.map((item, index) => {
      const color = tokens.colors[(item.colorIndex ?? ((index + 1) as 1 | 2 | 3 | 4 | 5)) - 1];
      return {
        name: item.name,
        type: "line",
        data: item.values,
        smooth: 0.28,
        showSymbol: false,
        symbolSize: 8,
        emphasis: { focus: "series" },
        lineStyle: { width: 3, color },
        itemStyle: { color },
        areaStyle: item.area ? { color, opacity: 0.12 } : undefined,
      };
    });
    return {
      animationDuration: 180,
      color: tokens.colors,
      grid: { left: 8, right: 12, top: 42, bottom: 20, containLabel: true },
      legend: { top: 4, left: 4, textStyle: { color: tokens.muted } },
      tooltip: {
        trigger: "axis",
        backgroundColor: tokens.raised,
        borderColor: tokens.border,
        textStyle: { color: tokens.ink },
        axisPointer: { type: "line", lineStyle: { type: "dashed", color: tokens.muted } },
      },
      xAxis: {
        type: "category",
        data: labels,
        boundaryGap: false,
        axisLine: { lineStyle: { color: tokens.border } },
        axisTick: { show: false },
        axisLabel: { color: tokens.muted },
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: tokens.border } },
        axisLabel: { color: tokens.muted },
      },
      series: chartSeries,
    };
  }, [labels, series, theme]);

  const state = <ChartState height={height} ariaLabel={ariaLabel} isLoading={isLoading} errorMessage={errorMessage} isEmpty={!labels.length || !series.some((item) => item.values.length)} />;
  if (isLoading || errorMessage || !labels.length || !series.some((item) => item.values.length)) return state;

  return <ReactECharts option={option} style={{ height }} notMerge lazyUpdate opts={{ renderer: "svg" }} aria-label={ariaLabel} />;
}

export function HorizontalBarChart({
  labels,
  values,
  ariaLabel,
  height = 260,
  isLoading = false,
  errorMessage,
}: {
  labels: string[];
  values: number[];
  ariaLabel: string;
  height?: number;
  isLoading?: boolean;
  errorMessage?: string;
}) {
  const theme = useSessionStore((state) => state.theme);
  const option = useMemo<EChartsOption>(() => {
    const tokens = chartTokens();
    return {
      animationDuration: 180,
      grid: { left: 8, right: 16, top: 8, bottom: 8, containLabel: true },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      xAxis: { type: "value", axisLabel: { show: false }, splitLine: { show: false } },
      yAxis: {
        type: "category",
        data: labels,
        inverse: true,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: tokens.muted, width: 130, overflow: "truncate" },
      },
      series: [{
        type: "bar",
        data: values,
        barWidth: 10,
        itemStyle: { color: tokens.colors[1], borderRadius: 3 },
      }],
    };
  }, [labels, values, theme]);
  if (isLoading || errorMessage || !labels.length || !values.length) {
    return <ChartState height={height} ariaLabel={ariaLabel} isLoading={isLoading} errorMessage={errorMessage} isEmpty={!labels.length || !values.length} />;
  }
  return <ReactECharts option={option} style={{ height }} notMerge lazyUpdate opts={{ renderer: "svg" }} aria-label={ariaLabel} />;
}

export function DonutChart({
  data,
  ariaLabel,
  height = 260,
  isLoading = false,
  errorMessage,
}: {
  data: Array<{ name: string; value: number }>;
  ariaLabel: string;
  height?: number;
  isLoading?: boolean;
  errorMessage?: string;
}) {
  const theme = useSessionStore((state) => state.theme);
  const option = useMemo<EChartsOption>(() => {
    const tokens = chartTokens();
    return {
      animationDuration: 180,
      color: tokens.colors,
      tooltip: { trigger: "item" },
      legend: { orient: "vertical", right: 8, top: "center", textStyle: { color: tokens.muted } },
      series: [{
        type: "pie",
        radius: ["46%", "70%"],
        center: ["34%", "50%"],
        avoidLabelOverlap: true,
        label: { show: false },
        data,
      }],
    };
  }, [data, theme]);
  if (isLoading || errorMessage || !data.length) {
    return <ChartState height={height} ariaLabel={ariaLabel} isLoading={isLoading} errorMessage={errorMessage} isEmpty={!data.length} />;
  }
  return <ReactECharts option={option} style={{ height }} notMerge lazyUpdate opts={{ renderer: "svg" }} aria-label={ariaLabel} />;
}
