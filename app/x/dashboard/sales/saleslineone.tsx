import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    {
        month: 'Jan',
        actual: 45000,
        target: 42000
    },
    {
        month: 'Feb',
        actual: 48000,
        target: 44000
    },
    {
        month: 'Mar',
        actual: 52000,
        target: 46000
    },
    {
        month: 'Apr',
        actual: 49000,
        target: 48000
    },
    {
        month: 'May',
        actual: 53000,
        target: 50000
    },
    {
        month: 'Jun',
        actual: 58000,
        target: 52000
    },
    {
        month: 'Jul',
        actual: 56000,
        target: 54000
    },
    {
        month: 'Aug',
        actual: 61000,
        target: 56000
    },
    {
        month: 'Sep',
        actual: 65000,
        target: 58000
    },
    {
        month: 'Oct',
        actual: 67000,
        target: 60000
    },
    {
        month: 'Nov',
        actual: 69000,
        target: 62000
    },
    {
        month: 'Dec',
        actual: 72000,
        target: 64000
    }
];

export default function RevenueChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Revenue vs Target</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis 
                            tickFormatter={(value) => `$${(value / 1000)}k`}
                        />
                        <Tooltip 
                            formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                        />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="actual" 
                            stroke="#2563eb" 
                            strokeWidth={2}
                            name="Actual Revenue"
                            dot={{ r: 4 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="target" 
                            stroke="#dc2626" 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            name="Target Revenue"
                            dot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
