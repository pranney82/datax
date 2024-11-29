import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    { month: 'Jan', totalLeads: 450, closedLeads: 120 },
    { month: 'Feb', totalLeads: 520, closedLeads: 150 },
    { month: 'Mar', totalLeads: 480, closedLeads: 140 },
    { month: 'Apr', totalLeads: 600, closedLeads: 180 },
    { month: 'May', totalLeads: 750, closedLeads: 220 },
    { month: 'Jun', totalLeads: 820, closedLeads: 250 },
    { month: 'Jul', totalLeads: 900, closedLeads: 280 },
    { month: 'Aug', totalLeads: 850, closedLeads: 260 },
    { month: 'Sep', totalLeads: 950, closedLeads: 300 },
    { month: 'Oct', totalLeads: 1000, closedLeads: 320 },
    { month: 'Nov', totalLeads: 1100, closedLeads: 350 },
    { month: 'Dec', totalLeads: 1200, closedLeads: 380 },
];

export default function LeadsLineOne() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Leads by Month</CardTitle>
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
                            dataKey="totalLeads" 
                            stroke="#8884d8" 
                            name="Total Leads"
                            strokeWidth={2}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="closedLeads" 
                            stroke="#82ca9d" 
                            name="Closed Leads"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}