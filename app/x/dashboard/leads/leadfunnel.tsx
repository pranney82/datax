import { FunnelChart, Funnel, LabelList, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    {
        value: 250, // Visit (total of original 3728.3 + 354170)
        name: 'Raw Leads',
        fill: '#8884d8'
    },
    {
        value: 100,  // Page clicks that led to favorites
        name: 'Qualified Leads',
        fill: '#83a6ed'
    },
    {
        value: 65,   // Assumed conversion
        name: 'Closed Won',
        fill: '#82ca9d'
    },
];

export default function LeadFunnel() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Lead Funnel</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <FunnelChart>
                        <Tooltip />
                        <Funnel
                            dataKey="value"
                            data={data}
                            isAnimationActive
                            labelLine
                        >
                            <LabelList
                                position="right"
                                fill="#000"
                                stroke="none"
                                dataKey="name"
                            />
                        </Funnel>
                    </FunnelChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}