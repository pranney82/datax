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

export default function LeadsAreaChart() {
  const { block3StatusCounts } = useLeadsCount();

  const transformedData = block3StatusCounts.map((item: Block3Item) => {
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
  
  const statusColors = {
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
              tick={{ fill: '#333333' }} // Changed to a darker color
              tickLine={{ stroke: '#9CA3AF' }}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: '#333333' }} // Changed to a darker color
              tickLine={{ stroke: '#9CA3AF' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <Legend
              onClick={handleLegendClick}
              formatter={(value) => (
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

