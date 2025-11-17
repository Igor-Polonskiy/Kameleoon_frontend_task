import { useEffect, useRef } from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dataJSON from "../../data/data.json";
import styles from "./LineChart.module.scss";
import type { ChartDataItem, LineChartProps, RawItem } from "./LineChart.types";

export const LineChart = ({
  selectedVariations,
  timeFrame,
  lineStyle,
  height = 400,
  zoom = 100,
  onZoomChange
}: LineChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const variationKeys: string[] = dataJSON.variations.map(v => (v.id ?? "0").toString());
  const rawData = dataJSON.data as RawItem[];
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const aggregateByWeek = (dataArray: RawItem[]): ChartDataItem[] => {
    const result: ChartDataItem[] = [];
    let week: RawItem[] = [];

    dataArray.forEach((d: RawItem, idx: number) => {
      week.push(d);
      const isLast = idx === dataArray.length - 1;
      const isFullWeek = (idx + 1) % 7 === 0;

      if (isFullWeek || isLast) {
        const item: ChartDataItem = { date: `${week[0].date} - ${week[week.length - 1].date}` };
        variationKeys.forEach(key => {
          const dailyRates = week
            .map(day => {
              const visits = Number(day.visits?.[key] ?? 0);
              const conversions = day.conversions?.[key] ?? 0;
              return visits > 0 ? (conversions / visits) * 100 : null;
            })
            .filter((v): v is number => v !== null);

          item[key] = dailyRates.length > 0
            ? dailyRates.reduce((a, b) => a + b, 0) / dailyRates.length
            : null;
        });
        result.push(item);
        week = [];
      }
    });
    return result;
  };

  const getChartData = (): ChartDataItem[] => {
    if (timeFrame === "day") {
      return rawData.map(d => {
        const item: ChartDataItem = { date: d.date };
        variationKeys.forEach(key => {
          const visits = d.visits?.[key] ?? 0;
          const conversions = d.conversions?.[key] ?? 0;
          item[key] = visits > 0 ? (conversions / visits) * 100 : null;
        });
        return item;
      });
    }
    return aggregateByWeek(rawData);
  };

  const chartData = getChartData();

  const formatDate = (dateStr: string) => {
    const first = dateStr.split(" - ")[0];
    const d = new Date(first);
    return `${monthNames[d.getMonth()]} ${d.getDate()}`;
  };


useEffect(() => {
  const el = containerRef.current;
  if (!el) return;

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault(); // теперь можно
    const delta = e.deltaY < 0 ? 5 : -5;
    onZoomChange(delta); // функция из пропсов
  };

  el.addEventListener("wheel", handleWheel, { passive: false });

  return () => el.removeEventListener("wheel", handleWheel);
}, [onZoomChange]);

  return (
    <div ref={containerRef} style={{ overflowX: "auto" }}>
      <div >
        <ResponsiveContainer width={`${zoom}%`} height={height} className={styles.chart}>
          {lineStyle === "area" ? (
            <AreaChart data={chartData}>
              <CartesianGrid stroke="var(--grid-color)" strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} stroke="var(--axis-color)" interval={1}/>
              <YAxis stroke="var(--axis-color)" tickFormatter={v => (v != null ? `${v.toFixed(1)}%` : "")} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || label == null) return null;
                  const formatted = formatDate(String(label));
                  return (
                    <div className={styles.tooltip}>
                      <div className={styles.date}>{formatted}</div>
                      {payload.map(p => {
                        const variationObj = dataJSON.variations.find(v => (v.id ?? "0").toString() === p.dataKey);
                        const name = variationObj?.name ?? p.dataKey;
                        return <div key={p.dataKey} style={{ color: p.stroke }}>{name}: {p.value != null ? p.value.toFixed(1) : "-"}%</div>;
                      })}
                    </div>
                  );
                }}
              />
              {selectedVariations.map((v, i) => (
                <Area key={v} type="monotone" dataKey={v} connectNulls stroke={`var(--line-${i % 6})`} fill={`color-mix(in srgb, var(--line-${i % 6}) 30%, transparent)`} />
              ))}
            </AreaChart>
          ) : (
            <RechartsLineChart data={chartData}>
              <CartesianGrid stroke="var(--grid-color)" strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} stroke="var(--axis-color)" interval={1} />
              <YAxis stroke="var(--axis-color)" tickFormatter={v => (v != null ? `${v.toFixed(1)}%` : "")} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || label == null) return null;
                  const formatted = formatDate(String(label));
                  return (
                    <div className={styles.tooltip}>
                      <div className={styles.date}>{formatted}</div>
                      {payload.map(p => {
                        const variationObj = dataJSON.variations.find(v => (v.id ?? "0").toString() === p.dataKey);
                        const name = variationObj?.name ?? p.dataKey;
                        return <div key={p.dataKey} style={{ color: p.stroke }}>{name}: {p.value != null ? p.value.toFixed(1) : "-"}%</div>;
                      })}
                    </div>
                  );
                }}
              />
              {selectedVariations.map((v, i) => (
                <Line key={v} type={lineStyle === "smooth" ? "monotone" : "linear"} dataKey={v} dot={false} strokeWidth={2} connectNulls stroke={`var(--line-${i % 6})`} />
              ))}
            </RechartsLineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
