"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartComponentProps {
  title?: string;
  type: "line" | "bar";
  data: Record<string, any>[];
  xKey: string;
  yKey: string;
  color?: string;
}

export default function ChartComponent({
  title,
  type,
  data,
  xKey,
  yKey,
  color = "#3B82F6",
}: ChartComponentProps) {
  const ChartType = type === "line" ? LineChart : BarChart;
  const DataComponent = type === "line" ? Line : Bar;

  return (
    <div className="glass-strong rounded-lg overflow-hidden h-full flex flex-col p-4">
      {title && <h3 className="text-sm font-medium mb-4">{title}</h3>}

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ChartType data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey={xKey} stroke="#ffffff50" fontSize={12} />
            <YAxis stroke="#ffffff50" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "0.5rem",
              }}
            />
            <DataComponent dataKey={yKey} fill={color} stroke={color} />
          </ChartType>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
