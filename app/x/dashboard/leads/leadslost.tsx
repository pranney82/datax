import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    {
        reason: "Price Too High",
        count: 145,
    },
    {
        reason: "Chose Competitor",
        count: 98,
    },
    {
        reason: "Timeline Mismatch",
        count: 87,
    },
    {
        reason: "No Budget",
        count: 76,
    },
    {
        reason: "Changed Plans",
        count: 45,
    },
    {
        reason: "No Response",
        count: 32,
    },
    {
        reason: "Other",
        count: 17,
    },
];

export default function LeadsLost() {
    const formatTooltip = (value: number, name: string) => {
        if (name === 'count') return `${value} leads`;
        return `${value}%`;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Reasons for Lost Leads</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis 
                            type="category" 
                            dataKey="reason"
                            width={100}
                        />
                        <Tooltip 
                            formatter={formatTooltip}
                        />
                        <Legend />
                        <Bar 
                            dataKey="count" 
                            fill="#8884d8" 
                            name="Number of Leads"
                            radius={[0, 4, 4, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}