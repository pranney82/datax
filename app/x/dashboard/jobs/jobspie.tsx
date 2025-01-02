'use client'

import * as React from 'react'
import { PieChart, Pie, Cell, Sector } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
  ChartLegend,
} from "@/components/ui/chart"

const data = [
  { name: "Labor", value: 125000 },
  { name: "Materials", value: 98000 },
  { name: "Equipment", value: 45000 },
  { name: "Subcontractors", value: 78000 },
  { name: "Overhead", value: 32000 },
  { name: "Permits & Fees", value: 15000 },
]

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
]

const chartConfig: ChartConfig = data.reduce((config, item, index) => {
  config[item.name.toLowerCase()] = {
    label: item.name,
    color: COLORS[index % COLORS.length],
  }
  return config
}, {} as ChartConfig)

const renderActiveShape = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
  const sin = Math.sin(-midAngle * Math.PI / 180)
  const cos = Math.cos(-midAngle * Math.PI / 180)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="currentColor" className="text-xs">
        {`${payload.name} ${(percent * 100).toFixed(2)}%`}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="currentColor" className="text-xs">
        {`$${value.toLocaleString()}`}
      </text>
    </g>
  )
}

export default function JobPie() {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Cost Type</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <PieChart margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip
                content={({ payload }) => {
                  if (payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <ChartTooltipContent
                        title={data.name}
                        content={`$${data.value.toLocaleString()}`}
                      />
                    )
                  }
                  return null
                }}
              />
              <ChartLegend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

