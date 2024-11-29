import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipProps } from 'recharts';

const data = [
    { week: "Week 1", completion: 8, budgetUsed: 12 },
    { week: "Week 2", completion: 15, budgetUsed: 18 },
    { week: "Week 3", completion: 25, budgetUsed: 28 },
    { week: "Week 4", completion: 32, budgetUsed: 35 },
    { week: "Week 5", completion: 40, budgetUsed: 42 },
    { week: "Week 6", completion: 48, budgetUsed: 50 },
    { week: "Week 7", completion: 55, budgetUsed: 58 },
    { week: "Week 8", completion: 65, budgetUsed: 68 },
    { week: "Week 9", completion: 72, budgetUsed: 75 },
    { week: "Week 10", completion: 80, budgetUsed: 82 },
    { week: "Week 11", completion: 88, budgetUsed: 90 },
    { week: "Week 12", completion: 95, budgetUsed: 98 },
];

export default function JobLineTwo() {
    const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border rounded-lg shadow-sm">
                    <p className="font-medium mb-2">{label}</p>
                    <p className="text-blue-500">Completion: {payload[0].value}%</p>
                    <p className="text-orange-500">Budget Used: {payload[1].value}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Project Progress vs Budget</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis tickFormatter={(value) => `${value}%`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="completion" 
                            stroke="#3b82f6" 
                            name="Project Completion" 
                        />
                        <Line 
                            type="monotone" 
                            dataKey="budgetUsed" 
                            stroke="#f97316" 
                            name="Budget Used" 
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
