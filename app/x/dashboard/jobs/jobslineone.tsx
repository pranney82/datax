import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    { month: "Jan", cashIn: 125000, cashOut: 98000, netCash: 27000 },
    { month: "Feb", cashIn: 142000, cashOut: 115000, netCash: 27000 },
    { month: "Mar", cashIn: 158000, cashOut: 122000, netCash: 36000 },
    { month: "Apr", cashIn: 132000, cashOut: 108000, netCash: 24000 },
    { month: "May", cashIn: 148000, cashOut: 118000, netCash: 30000 },
    { month: "Jun", cashIn: 165000, cashOut: 128000, netCash: 37000 },
    { month: "Jul", cashIn: 172000, cashOut: 132000, netCash: 40000 },
    { month: "Aug", cashIn: 168000, cashOut: 138000, netCash: 30000 },
    { month: "Sep", cashIn: 175000, cashOut: 142000, netCash: 33000 },
    { month: "Oct", cashIn: 182000, cashOut: 148000, netCash: 34000 },
    { month: "Nov", cashIn: 179000, cashOut: 145000, netCash: 34000 },
    { month: "Dec", cashIn: 192000, cashOut: 152000, netCash: 40000 },
];

type TooltipProps = {
    active?: boolean;
    payload?: Array<{
        value: number;
        dataKey: string;
    }>;
    label?: string;
};

export default function CashFlowTrendChart() {
    const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border rounded-lg shadow-sm">
                    <p className="font-medium mb-2">{label}</p>
                    <p className="text-blue-500">Cash In: ${payload[0].value.toLocaleString()}</p>
                    <p className="text-red-500">Cash Out: ${payload[1].value.toLocaleString()}</p>
                    <p className="text-green-500">Net Cash: ${payload[2].value.toLocaleString()}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Cash Flow Trend</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="cashIn" stroke="#3b82f6" name="Cash In" />
                        <Line type="monotone" dataKey="cashOut" stroke="#ef4444" name="Cash Out" />
                        <Line type="monotone" dataKey="netCash" stroke="#22c55e" name="Net Cash" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
