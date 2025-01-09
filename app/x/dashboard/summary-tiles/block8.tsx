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

export function Block8() {
  const { block4MonthlyMetrics, block3MonthlyLeads } = useLeadsCount();

  const data = block4MonthlyMetrics.map((m, index) => {
    const date = new Date(m.start);
    return {
      month: new Date(date.getTime() + date.getTimezoneOffset() * 60000)
        .toLocaleString('default', { month: 'short' }),
      approvedEstimates: m.metrics.count,
      rawLeads: block3MonthlyLeads[index]?.count || 0,
    };
  });

  return (
    <DashCard 
      title="Monthly Leads & Estimates" 
      description="Conversion performance over time"
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
            label={{ 
              value: 'Estimates', 
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
              value: 'Leads', 
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
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '10px',
            }}
          />
          <Bar 
            yAxisId="right" 
            dataKey="rawLeads" 
            fill="#FFD400" 
            name="Raw Leads" 
            radius={[4, 4, 0, 0]}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="approvedEstimates"
            stroke="#000"
            name="Approved Estimates"
            strokeWidth={2}
            dot={{ r: 3, fill: "#000" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </DashCard>
  );
}

