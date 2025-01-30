import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import DashCard from "@/components/dash-card";
import { useLeadsCount } from "@/lib/hooks/use-leads-count";

export function Block7() {
  const { monthlyRevenue } = useLeadsCount();

  const formatAmount = (amount: number) => {
    return `${Math.round(amount / 1000)}K`;
  };

  const data = monthlyRevenue.map(m => {
    const date = new Date(m.start);
    return {
      month: new Date(date.getTime() + date.getTimezoneOffset() * 60000)
        .toLocaleString('default', { month: 'short' }),
      totalAmount: m.data?.scope?.connection?.["Amount:sum"] || 0,
      invoiceCount: m.data?.scope?.connection?.count || 0,
    };
  });

  return (
    <DashCard 
      title="Monthly Revenue" 
      description="Revenue collected over time"
    >
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 10,
            bottom: 20,
          }}
        >
          <XAxis dataKey="month" stroke="#000" />
          <YAxis 
            yAxisId="left" 
            orientation="left" 
            stroke="#000"
            tickFormatter={formatAmount}
            label={{ 
              value: '$$ Amount', 
              angle: -90, 
              position: 'insideLeft',
              offset: -5,
              style: { textAnchor: 'middle' }
            }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#000"
            label={{ 
              value: 'Inv Count', 
              angle: 90, 
              position: 'insideRight',
              offset: -5,
              style: { textAnchor: 'middle' }
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: 'none',
              borderRadius: '4px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              color: '#000',
            }}
            formatter={(value, name) => {
              if (name === "Total Amount") {
                return [formatAmount(value as number), name];
              }
              return [value, name];
            }}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '10px',
            }}
          />
          <Bar 
            yAxisId="right" 
            dataKey="invoiceCount" 
            fill="#FFD400" 
            name="Invoice Count" 
            radius={[4, 4, 0, 0]}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="totalAmount"
            stroke="#000"
            name="Total Amount"
            strokeWidth={2}
            dot={{ r: 3, fill: "#000" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </DashCard>
  );
}

