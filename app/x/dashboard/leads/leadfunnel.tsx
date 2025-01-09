import { FunnelChart, Funnel, LabelList, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLeadsCount } from "@/lib/hooks/use-leads-count";

export default function LeadFunnel() {
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

    // Define the gradients with opacity
    const gradients = (
        <defs>
            <linearGradient id="topGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" />
                <stop offset="100%" stopColor="rgba(255, 212, 0, 0.8)" />
            </linearGradient>
            <linearGradient id="middleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255, 212, 0, 0.8)" />
                <stop offset="100%" stopColor="rgba(255, 167, 0, 0.8)" />
            </linearGradient>
            <linearGradient id="bottomGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255, 167, 0, 0.8)" />
                <stop offset="100%" stopColor="rgba(0, 0, 0, 0.8)" />
            </linearGradient>
        </defs>
    );

    // Transform into array format for the funnel chart
    const data = [
        {
            name: "Total Leads",
            value: leadsCount,
            fill: "url(#topGradient)",
            opacity: 0.8,
        },
        {
            name: "Qualified Leads",
            value: qualifiedLeadsTotal,
            conversionRate: ((qualifiedLeadsTotal / leadsCount) * 100).toFixed(1),
            fill: "url(#middleGradient)",
            opacity: 0.8,
        },
        {
            name: "Closed Leads",
            value: aggregatedStatusCounts['approved'] || 0,
            conversionRate: (((aggregatedStatusCounts['approved'] || 0) / leadsCount) * 100).toFixed(1),
            fill: "url(#bottomGradient)",
            opacity: 0.8,
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
                <div className="bg-background p-4 rounded-lg shadow-lg border">
                    <p className="font-bold text-foreground">{data.name}</p>
                    <p className="text-muted-foreground">Total: {data.value.toLocaleString()}</p>
                    {data.conversionRate && (
                        <p className="text-muted-foreground">Conversion Rate: {data.conversionRate}%</p>
                    )}
                </div>
            );
        }
        return null;
    };

    // Custom label component to display name and value with improved background visibility
    const CustomLabel = (props: {
        x: number;
        y: number;
        width: number;
        height: number;
        name: string;
        value: number;
    }) => {
        const { x, y, width, height, name, value } = props;
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        const labelWidth = 140;
        const labelHeight = 60;
        const cornerRadius = 8;

        return (
            <g>
                {/* Background rectangle with improved visibility */}
                <rect
                    x={centerX - labelWidth / 2}
                    y={centerY - labelHeight / 2}
                    width={labelWidth}
                    height={labelHeight}
                    fill="rgba(255, 255, 255, 0.95)"
                    stroke="rgba(0, 0, 0, 0.1)"
                    strokeWidth={1}
                    rx={cornerRadius}
                    ry={cornerRadius}
                />
                {/* Label text */}
                <text
                    x={centerX}
                    y={centerY - 10}
                    textAnchor="middle"
                    fill="hsl(var(--foreground))"
                    fontSize={14}
                    fontWeight="bold"
                >
                    {name}
                </text>
                <text
                    x={centerX}
                    y={centerY + 15}
                    textAnchor="middle"
                    fill="hsl(var(--foreground))"
                    fontSize={16}
                    fontWeight="bold"
                >
                    {value.toLocaleString()}
                </text>
            </g>
        );
    };

    // Custom shape for the bottom of the funnel
    const CustomShape = (props: {
        x: number;
        y: number;
        width: number;
        height: number;
        fill: string;
    }) => {
        const { x, y, width, height, fill } = props;
        const radius = 20; // Adjust this value to change the roundness

        return (
            <path
                d={`
                    M ${x},${y}
                    L ${x + width},${y}
                    L ${x + width / 2 + radius},${y + height}
                    Q ${x + width / 2},${y + height + radius} ${x + width / 2 - radius},${y + height}
                    Z
                `}
                fill={fill}
            />
        );
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-l font-bold">Lead Funnel</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <FunnelChart>
                        {gradients}
                        <Tooltip content={<CustomTooltip />} />
                        <Funnel
                            dataKey="value"
                            data={data}
                            isAnimationActive
                            labelLine={false}
                        >
                            <LabelList
                                dataKey="value"
                                position="center"
                                content={(props: any) => {
                                    const { x, y, width, height, name, value } = props;
                                    return <CustomLabel 
                                        x={Number(x)} 
                                        y={Number(y)} 
                                        width={Number(width)} 
                                        height={Number(height)} 
                                        name={String(name)} 
                                        value={Number(value)} 
                                    />;
                                }}
                            />
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.fill} 
                                    fillOpacity={entry.opacity}
                                    shape={index === data.length - 1 ? <CustomShape x={0} y={0} width={0} height={0} fill={entry.fill} /> : undefined}
                                />
                            ))}
                        </Funnel>
                    </FunnelChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

