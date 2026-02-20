"use client";

import type { GraphHour } from "@/lib/weather-utils";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { useState, useId } from "react";

type GraphMetric = "Temperature" | "Precipitation" | "Wind";

const METRIC_CONFIG: Record<
  GraphMetric,
  { color: string; dataKey: keyof GraphHour; formatValue: (v: number) => string }
> = {
  Temperature: {
    color: "#facc15",
    dataKey: "temp",
    formatValue: (v) => `${Math.round(v)}°`,
  },
  Precipitation: {
    color: "#3b82f6",
    dataKey: "precipprob",
    formatValue: (v) => `${Math.round(v)}%`,
  },
  Wind: {
    color: "#0ea5e9",
    dataKey: "windspeed",
    formatValue: (v) => `${Math.round(v)} mph`,
  },
};

const HOUR_LABELS: Record<number, string> = {
  0: "12:00",
  1: "1:00",
  2: "2:00",
  3: "3:00",
  4: "4:00",
  5: "5:00",
  6: "6:00",
  7: "7:00",
  8: "8:00",
  9: "9:00",
  10: "10:00",
  11: "11:00",
  12: "12:00",
  13: "1:00",
  14: "2:00",
  15: "3:00",
  16: "4:00",
  17: "5:00",
  18: "6:00",
  19: "7:00",
  20: "8:00",
  21: "9:00",
  22: "10:00",
  23: "11:00",
};

/** eventOfDay → { startLabel, endLabel, leftGreyStart, leftGreyEnd, rightGreyStart, rightGreyEnd } */
const EVENT_FRAME: Record<
  string,
  { start: string; end: string; leftStart: string; leftEnd: string; rightStart: string; rightEnd: string }
> = {
  "Morning (8am - 12pm)": {
    start: "8:00",
    end: "12:00",
    leftStart: "5:00",
    leftEnd: "8:00",
    rightStart: "12:00",
    rightEnd: "3:00",
  },
  "Afternoon (12pm - 5pm)": {
    start: "12:00",
    end: "5:00",
    leftStart: "9:00",
    leftEnd: "12:00",
    rightStart: "5:00",
    rightEnd: "8:00",
  },
  "Evening (5pm - 9pm)": {
    start: "5:00",
    end: "9:00",
    leftStart: "2:00",
    leftEnd: "5:00",
    rightStart: "9:00",
    rightEnd: "12:00",
  },
};

type WeatherGraphProps = {
  hours: GraphHour[];
  eventOfDay: string;
};

export default function WeatherGraph({ hours, eventOfDay }: WeatherGraphProps) {
  const [metric, setMetric] = useState<GraphMetric>("Temperature");
  const gradientId = `gradient-${useId().replace(/:/g, "-")}`;

  if (!hours.length) return null;

  const frame = EVENT_FRAME[eventOfDay];

  const data = hours.map((h) => ({
    ...h,
    label: HOUR_LABELS[h.hour] ?? `${h.hour}:00`,
  }));

  const config = METRIC_CONFIG[metric];
  const values = data.map((d) => Number(d[config.dataKey]));
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);

  let yDomain: [number, number];
  if (metric === "Precipitation") {
    const range = dataMax - dataMin;
    const minRange = 30;
    const padding = range < minRange ? (minRange - range) / 2 : 5;
    yDomain = [Math.max(0, Math.floor(dataMin - padding)), Math.min(100, Math.ceil(dataMax + padding))];
  } else if (metric === "Wind") {
    const range = dataMax - dataMin;
    const minRange = 10;
    const padding = range < minRange ? (minRange - range) / 2 : 2;
    yDomain = [Math.max(0, Math.floor(dataMin - padding)), Math.ceil(dataMax + padding)];
  } else {
    const range = dataMax - dataMin;
    const minRange = 40;
    const padding = range < minRange ? (minRange - range) / 2 : 8;
    yDomain = [Math.floor(dataMin - padding), Math.ceil(dataMax + padding)];
  }

  return (
    <div className="h-72 w-full min-h-[280px]">
      <div className="mb-1 grid grid-cols-3 place-items-center">
        {(Object.keys(METRIC_CONFIG) as GraphMetric[]).map((m) => {
          const { color } = METRIC_CONFIG[m];
          const isActive = metric === m;
          return (
            <Button
              key={m}
              variant="link"
              size="sm"
              className="h-auto gap-2 rounded-none border-b-2 border-transparent p-0 pb-0.5 text-sm font-medium text-zinc-700 no-underline hover:border-zinc-900 hover:no-underline dark:text-zinc-300 dark:hover:border-zinc-100"
              style={isActive ? { borderBottomColor: "#000" } : undefined}
              onClick={() => setMetric(m)}
            >
              <span
                className="h-0.5 w-6 shrink-0 rounded"
                style={{ backgroundColor: color }}
                aria-hidden
              />
              {m}
            </Button>
          );
        })}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 40, right: 15, left: 5, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tick={(props) => {
              const { x, y, payload, index } = props;
              if (index === 0 || index === data.length - 1) return null;
              return (
                <text
                  x={x}
                  y={y}
                  dy={8}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize={11}
                  className="text-zinc-600 dark:text-zinc-400"
                >
                  {payload.value}
                </text>
              );
            }}
            axisLine={false}
            tickLine={false}
            interval={0}
          />
          <YAxis
            hide
            domain={yDomain}
          />
          {frame && (
            <>
              <ReferenceArea
                x1={frame.leftStart}
                x2={frame.leftEnd}
                fill="#d4d4d8"
                fillOpacity={0.12}
              />
              <ReferenceArea
                x1={frame.rightStart}
                x2={frame.rightEnd}
                fill="#d4d4d8"
                fillOpacity={0.12}
              />
              <ReferenceLine
                x={frame.start}
                stroke="#d4d4d8"
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />
              <ReferenceLine
                x={frame.end}
                stroke="#d4d4d8"
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />
            </>
          )}
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={config.color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={config.color} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey={config.dataKey}
            name=""
            stroke={config.color}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            baseValue="dataMin"
            dot={false}
            legendType="plainline"
            isAnimationActive={false}
          >
            <LabelList
              dataKey={config.dataKey}
              position="top"
              content={(props) => {
                const { index, value, x, y } = props;
                if (index === 0 || index === data.length - 1) return null;
                const text =
                  typeof value === "number" ? config.formatValue(value) : "";
                const yNum = typeof y === "number" ? y : 0;
                return (
                  <text
                    x={x}
                    y={yNum - 5}
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize={metric === "Wind" ? 9 : 11}
                    className="fill-zinc-600 dark:fill-zinc-400"
                  >
                    {text}
                  </text>
                );
              }}
            />
          </Area>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
