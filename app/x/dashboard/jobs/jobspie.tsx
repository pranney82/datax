import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    {
        name: "Labor",
        value: 125000,
    },
    {
        name: "Materials",
        value: 98000,
    },
    {
        name: "Equipment",
        value: 45000,
    },
    {
        name: "Subcontractors",
        value: 78000,
    },
    {
        name: "Overhead",
        value: 32000,
    },
    {
        name: "Permits & Fees",
        value: 15000,
    }
];

export default function JobPie() {
    const COLORS = [
        "#8884d8", // Purple
        "#82ca9d", // Green
        "#ffc658", // Yellow
        "#ff7c43", // Orange
        "#f1948a", // Pink
        "#86c5da", // Blue
    ];

    const CustomTooltip = ({ 
        active, 
        payload 
    }: { 
        active?: boolean; 
        payload?: Array<{ value: number; name: string; }>;
    }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border rounded-lg shadow-sm">
                    <p className="font-medium mb-2">{payload[0].name}</p>
                    <p>${payload[0].value.toLocaleString()}</p>
                </div>
            );
        }
        return null;
    };

    const totalValue = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Expenses by Cost Type</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name} (${((value / totalValue) * 100).toFixed(1)}%)`}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]} 
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
