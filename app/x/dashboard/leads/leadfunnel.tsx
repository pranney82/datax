import { FunnelChart, Funnel, LabelList, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLeadsCount } from "@/lib/hooks/use-leads-count";

export default function LeadFunnel() {
    //total leads
    const { leadsCount, block3StatusCounts } = useLeadsCount();

    // Aggregate status counts across all months
    const aggregatedStatusCounts = block3StatusCounts.reduce((acc, month) => {
        month.statusCounts.forEach(({ status, count }) => {
            acc[status] = (acc[status] || 0) + count;
        });
        return acc;
    }, {} as Record<string, number>);

    // Calculate qualified leads total
    const qualifiedLeadsTotal = ['denied', 'draft', 'pending'].reduce((total, status) => {
        return total + (aggregatedStatusCounts[status] || 0);
    }, 0);

    // Transform into array format for the funnel chart
    const data = [
        {
            name: "Total Leads",
            value: leadsCount,
            fill: "#8884d8",
        },
        {
            name: "Qualified Leads",
            value: qualifiedLeadsTotal,
            conversionRate: ((qualifiedLeadsTotal / leadsCount) * 100).toFixed(1),
            fill: "#83a6ed",
        },
        {
            name: "Closed Leads",
            value: aggregatedStatusCounts['approved'] || 0,
            conversionRate: (((aggregatedStatusCounts['approved'] || 0) / leadsCount) * 100).toFixed(1),
            fill: "#8dd1e1",
        },
    ];

    // Custom tooltip component
    const CustomTooltip = ({ active, payload }: { 
        active?: boolean; 
        payload?: Array<{ payload: { name: string; value: number; conversionRate?: string } }> 
    }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border">
                    <p className="font-bold">{data.name}</p>
                    <p>Total: {data.value}</p>
                    {data.conversionRate && (
                        <p>Conversion Rate: {data.conversionRate}%</p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Lead Funnel</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <FunnelChart>
                        <Tooltip content={<CustomTooltip />} />
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