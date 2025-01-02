'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartConfig,
} from "@/components/ui/chart"

const data = [
    { month: "Jan", cashIn: 125000, cashOut: 98000, netCash: 27000 },
    { month: "Feb", cashIn: 142000, cashOut: 115000, netCash: 27000 },
    { month: "Mar", cashIn: 158000, cashOut: 122000, netCash: 36000 },
    { month: "Apr", cashIn: 132000, cashOut: 108000, netCash: 24000 },
    { month: "May", cashIn: 148000, cashOut: 118000, netCash: 30000 },
    { month: "Jun", cashIn: 165000, cashOut: 128000, netCash: 37000 },
    { month: "Jul", cashIn: 172000, cashOut: 132000, netCash: 40000 },
    { month: "Aug", cashIn: 168000, cashOut: 138000, netCash: 30000 },
    { month: "Sep", cashIn: 175000, cashOut: 142000, netCash: 33000 },
    { month: "Oct", cashIn: 182000, cashOut: 148000, netCash: 34000 },
    { month: "Nov", cashIn: 179000, cashOut: 145000, netCash: 34000 },
    { month: "Dec", cashIn: 192000, cashOut: 152000, netCash: 40000 },
]

const chartConfig: ChartConfig = {
  cashIn: {
    label: "Cash In",
    color: "hsl(var(--chart-1))",
  },
  cashOut: {
    label: "Cash Out",
    color: "hsl(var(--chart-2))",
  },
  netCash: {
    label: "Net Cash",
    color: "hsl(var(--chart-3))",
  },
}

export default function CashFlowTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Cash Flow Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tickFormatter={(value) => `$${value / 1000}k`}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={({ payload, label }) => {
                if (payload && payload.length) {
                  return (
                    <ChartTooltipContent
                      title={label}
                      content={
                        <div className="flex flex-col gap-1">
                          {payload.map((item) => (
                            <div key={item.name} className="flex items-center justify-between gap-2">
                              <span className="font-medium">{item.name}:</span>
                              <span>${item.value?.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      }
                    />
                  )
                }
                return null
              }}
            />
            <ChartLegend />
            <Area 
              type="monotone" 
              dataKey="cashIn" 
              stackId="1"
              stroke="var(--color-cashIn)" 
              fill="var(--color-cashIn)"
              fillOpacity={0.5}
            />
            <Area 
              type="monotone" 
              dataKey="cashOut" 
              stackId="1"
              stroke="var(--color-cashOut)" 
              fill="var(--color-cashOut)"
              fillOpacity={0.5}
            />
            <Area 
              type="monotone" 
              dataKey="netCash" 
              stackId="1"
              stroke="var(--color-netCash)" 
              fill="var(--color-netCash)"
              fillOpacity={0.5}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

