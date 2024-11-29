import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    { month: 'Jan', averageZestimate: 450000 },
    { month: 'Feb', averageZestimate: 452000 },
    { month: 'Mar', averageZestimate: 455000 },
    { month: 'Apr', averageZestimate: 458000 },
    { month: 'May', averageZestimate: 462000 },
    { month: 'Jun', averageZestimate: 465000 },
    { month: 'Jul', averageZestimate: 468000 },
    { month: 'Aug', averageZestimate: 470000 },
    { month: 'Sep', averageZestimate: 473000 },
    { month: 'Oct', averageZestimate: 475000 },
    { month: 'Nov', averageZestimate: 478000 },
    { month: 'Dec', averageZestimate: 480000 },
];

export default function LeadsLineTwo() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Average Zestimate</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="averageZestimate" 
                            stroke="#8884d8" 
                            name="Average Zestimate"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}