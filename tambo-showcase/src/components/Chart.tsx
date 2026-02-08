"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import * as RechartsCore from "recharts";
import { z } from "zod/v3";

export const chartSchema = z.object({
  data: z
    .array(
      z.object({
        name: z.string().describe("Label for the data point"),
        value: z.number().describe("Numeric value for the data point"),
      })
    )
    .describe("Array of data points with name and value"),
  type: z
    .enum(["bar", "line", "pie"])
    .describe("Use bar for comparisons, line for trends, pie for proportions"),
});

export type ChartProps = z.infer<typeof chartSchema>;

const defaultColors = [
  "hsl(220, 100%, 62%)",
  "hsl(160, 82%, 47%)",
  "hsl(32, 100%, 62%)",
  "hsl(340, 82%, 66%)",
];

export const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
  ({ data, type }, ref) => {
    if (!data || data.length === 0) {
      return (
        <div
          ref={ref}
          className="w-full h-64 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center"
        >
          <span className="text-sm text-gray-500">Awaiting data...</span>
        </div>
      );
    }

    const chartData = data.map((d) => ({ name: d.name, value: d.value }));

    const renderChart = () => {
      switch (type) {
        case "bar":
          return (
            <RechartsCore.BarChart data={chartData}>
              <RechartsCore.CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />
              <RechartsCore.XAxis
                dataKey="name"
                stroke="var(--muted-foreground)"
                axisLine={false}
                tickLine={false}
              />
              <RechartsCore.YAxis
                stroke="var(--muted-foreground)"
                axisLine={false}
                tickLine={false}
              />
              <RechartsCore.Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "var(--radius)",
                  color: "var(--foreground)",
                }}
              />
              <RechartsCore.Bar
                dataKey="value"
                fill={defaultColors[0]}
                radius={[4, 4, 0, 0]}
              />
            </RechartsCore.BarChart>
          );

        case "line":
          return (
            <RechartsCore.LineChart data={chartData}>
              <RechartsCore.CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />
              <RechartsCore.XAxis
                dataKey="name"
                stroke="var(--muted-foreground)"
                axisLine={false}
                tickLine={false}
              />
              <RechartsCore.YAxis
                stroke="var(--muted-foreground)"
                axisLine={false}
                tickLine={false}
              />
              <RechartsCore.Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "var(--radius)",
                  color: "var(--foreground)",
                }}
              />
              <RechartsCore.Line
                type="monotone"
                dataKey="value"
                stroke={defaultColors[0]}
                dot={false}
              />
            </RechartsCore.LineChart>
          );

        case "pie":
          return (
            <RechartsCore.PieChart>
              <RechartsCore.Pie
                data={chartData.map((d, i) => ({
                  ...d,
                  fill: defaultColors[i % defaultColors.length],
                }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
              />
              <RechartsCore.Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "var(--radius)",
                  color: "var(--foreground)",
                }}
              />
              <RechartsCore.Legend />
            </RechartsCore.PieChart>
          );

        default:
          return (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <span className="text-sm">
                Unsupported chart type: {String(type)}
              </span>
            </div>
          );
      }
    };

    return (
      <div
        ref={ref}
        className={cn("w-full h-64 rounded-lg border border-gray-200 bg-white p-4")}
      >
        <div className="w-full h-full">
          <RechartsCore.ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </RechartsCore.ResponsiveContainer>
        </div>
      </div>
    );
  }
);

Chart.displayName = "Chart";
