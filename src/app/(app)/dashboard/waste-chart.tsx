"use client"

import * as React from "react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"

const chartData = [
  { category: "treated", value: 54, label: "Treated (54%)", fill: "var(--color-treated)" },
  { category: "landfilled", value: 24, label: "Landfilled (24%)", fill: "var(--color-landfilled)" },
  { category: "unaccounted", value: 22, label: "Unaccounted (22%)", fill: "var(--color-unaccounted)" },
]

const chartConfig = {
  value: {
    label: "Tonnes",
  },
  treated: {
    label: "Scientifically Treated",
    color: "hsl(var(--chart-1))",
  },
  landfilled: {
    label: "Dumped in Landfills",
    color: "hsl(var(--chart-2))",
  },
  unaccounted: {
    label: "Unaccounted",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function WasteChart() {
  const id = "pie-interactive"

  return (
    <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square h-full max-h-[300px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="category"
            innerRadius={60}
            strokeWidth={5}
          />
          <ChartLegend
            content={<ChartLegendContent nameKey="category" />}
            className="-translate-y-[2rem] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
          />
        </PieChart>
      </ChartContainer>
  )
}
