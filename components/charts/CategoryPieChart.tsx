// components/charts/CategoryPieChart.tsx
"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatINR } from "@/lib/utils/format";

interface CategoryPieData {
  name: string;
  value: number;
  color: string;
}

interface CategoryPieChartProps {
  data: CategoryPieData[];
}

function CustomPieTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="rounded-xl border border-curo-border bg-curo-surface p-3 shadow-md text-xs">
        <p className="font-medium text-curo-text">{item.name}</p>
        <p className="font-mono text-curo-primary mt-1 tabular-nums">
          {formatINR(item.value)}
        </p>
      </div>
    );
  }
  return null;
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-curo-text-muted">
        No category data available.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomPieTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
