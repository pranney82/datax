import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLeadsCount } from "@/lib/hooks/use-leads-count";
import { useState } from 'react';
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

export default function LeadsLineOne() {
    const {block3StatusCounts} = useLeadsCount();
    console.log('block3StatusCounts:', block3StatusCounts);
    // Transform the data to work with multiple status lines
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
    
    // Define status colors
    const statusColors = {
        'approved': '#8884d8',
        'denied': '#ff7f0e',
        'draft': '#2196f3',
        'pending': '#82ca9d'
    };

    const [hiddenSeries, setHiddenSeries] = useState<{ [key: string]: boolean }>({});

    // Fix the legend click handler with proper typing and logic
    const handleLegendClick = (data: Payload) => {
        setHiddenSeries(prev => ({
            ...prev,
            [data.dataKey as string]: !prev[data.dataKey as string]
        }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Leads by Status</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={transformedData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend 
                            onClick={handleLegendClick}
                            formatter={(value) => (
                                <span style={{ color: hiddenSeries[value] ? '#999' : '#000' }}>
                                    {value}
                                </span>
                            )}
                        />
                        {Object.entries(statusColors).map(([status, color]) => (
                            <Line
                                key={status}
                                type="monotone"
                                dataKey={status}
                                stroke={color}
                                name={status}
                                strokeWidth={2}
                                hide={hiddenSeries[status]}
                                // Remove opacity and use hide prop instead
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
                <CardDescription className="text-muted-foreground text-center">
                    Click on a status name to hide it
                </CardDescription>
            </CardContent>
        </Card>
    );
}