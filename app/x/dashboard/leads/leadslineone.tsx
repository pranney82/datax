"use client"

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLeadsCount } from "@/lib/hooks/use-leads-count";
import { Payload } from 'recharts/types/component/DefaultLegendContent';

interface StatusCount {
  status: string;
  count: number;
}

interface Block3Item {
  start: string;
  end: string;
  statusCounts: StatusCount[];
}

interface StatusObject {
  [key: string]: number;
}

interface TransformedDataItem {
  month: string;
  approved: number;
  denied: number;
  draft: number;
  pending: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

export default function LeadsAreaChart() {
  const { block3StatusCounts } = useLeadsCount();

  const transformedData: TransformedDataItem[] = block3StatusCounts.map((item: Block3Item) => {
    const statusObj: StatusObject = item.statusCounts.reduce((acc: StatusObject, curr: StatusCount) => {
      acc[curr.status] = curr.count;
      return acc;
    }, {});        
    return {
      month: new Date(item.start).toLocaleDateString('en-US', { month: 'short' }),
      approved: statusObj['approved'] || 0,
      denied: statusObj['denied'] || 0,
      draft: statusObj['draft'] || 0,
      pending: statusObj['pending'] || 0,
    };
  });
  
  const statusColors: { [key: string]: string } = {
    'approved': '#FFD400', // Bright yellow (as requested)
    'denied': '#FF6B6B',   // Soft red
    'draft': '#4ECDC4',    // Teal
    'pending': '#45B7D1'   // Sky blue
  };

  const [hiddenSeries, setHiddenSeries] = useState<{ [key: string]: boolean }>({});

  const handleLegendClick = (data: Payload) => {
    setHiddenSeries(prev => ({
      ...prev,
      [data.dataKey as string]: !prev[data.dataKey as string]
    }));
  };

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="label font-semibold mb-2">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="flex justify-between items-center my-1">
              <span className="capitalize mr-4" style={{ color: entry.color }}>{entry.name}</span>
              <span className="font-medium">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-l font-bold text-gray-800 dark:text-gray-100">Leads by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={transformedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="month"
              stroke="#9CA3AF"
              tick={{ fill: '#333333' }}
              tickLine={{ stroke: '#9CA3AF' }}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: '#333333' }}
              tickLine={{ stroke: '#9CA3AF' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              onClick={handleLegendClick}
              formatter={(value: string) => (
                <span style={{
                  color: hiddenSeries[value] ? '#9CA3AF' : '#374151',
                  fontWeight: 'bold',
                  textTransform: 'capitalize'
                }}>
                  {value}
                </span>
              )}
            />
            {Object.entries(statusColors).map(([status, color]) => (
              <Area
                key={status}
                type="monotone"
                dataKey={status}
                stroke={color}
                fill={color}
                fillOpacity={0.6}
                stackId="1"
                name={status}
                hide={hiddenSeries[status]}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
        <CardDescription className="text-sm text-center mt-4 text-gray-600 dark:text-gray-300">
          Click on a status name to toggle visibility
        </CardDescription>
      </CardContent>
    </Card>
  );
}

