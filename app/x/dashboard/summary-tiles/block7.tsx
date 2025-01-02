'use client'

import * as React from 'react'
import { Bar, Line, LineChart, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartConfig,
} from "@/components/ui/chart"
import { useLeadsCount } from "@/lib/hooks/use-leads-count"

const chartConfig: ChartConfig = {
  totalAmount: {
    label: "Total Amount",
    color: "hsl(var(--chart-1))",
  },
  invoiceCount: {
    label: "Invoice Count",
    color: "hsl(var(--chart-2))",
  },
}

export function Block7() {
  const { monthlyRevenue } = useLeadsCount()

  const data = monthlyRevenue.map(m => ({
    month: new Date(m.start).toLocaleString('default', { month: 'short' }),
    totalAmount: m.data?.scope?.connection?.["Amount:sum"] || 0,
    invoiceCount: m.data?.scope?.connection?.count || 0,
  }))

  const maxAmount = Math.max(...data.map(d => d.totalAmount))
  const maxCount = Math.max(...data.map(d => d.invoiceCount))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
        <CardDescription>Revenue collected over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              yAxisId="left"
              tickFormatter={(value) => `$${value / 1000}k`}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, maxAmount]}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, maxCount]}
            />
            <ChartTooltip
              content={({ payload, label }) => {
                if (payload && payload.length) {
                  return (
                    <ChartTooltipContent
                      title={label}
                      content={
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium">Total Amount:</span>
                            <span>${payload[0].value?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium">Invoice Count:</span>
                            <span>{payload[1].value}</span>
                          </div>
                        </div>
                      }
                    />
                  )
                }
                return null
              }}
            />
            <ChartLegend />
            <Line 
              type="monotone" 
              dataKey="totalAmount" 
              yAxisId="left"
              stroke="var(--color-totalAmount)" 
              strokeWidth={2}
              dot={false}
            />
            <Bar 
              dataKey="invoiceCount" 
              yAxisId="right"
              fill="var(--color-invoiceCount)"
              radius={[4, 4, 0, 0]}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

