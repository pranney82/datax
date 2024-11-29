import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, Tooltip, XAxis, YAxis, Scatter, ScatterChart, Cell } from "recharts";

const data = [
    { name: "Kitchen Remodel", Jan: 45, Feb: 42, Mar: 55, Apr: 78, May: 85, Jun: 92, Jul: 88, Aug: 82, Sep: 74, Oct: 65, Nov: 48, Dec: 35 },
    { name: "Bathroom Remodel", Jan: 38, Feb: 40, Mar: 52, Apr: 65, May: 72, Jun: 78, Jul: 75, Aug: 70, Sep: 68, Oct: 58, Nov: 42, Dec: 32 },
    { name: "New Construction", Jan: 15, Feb: 18, Mar: 25, Apr: 35, May: 42, Jun: 48, Jul: 45, Aug: 40, Sep: 32, Oct: 25, Nov: 18, Dec: 12 },
    { name: "Room Addition", Jan: 22, Feb: 25, Mar: 32, Apr: 45, May: 52, Jun: 58, Jul: 55, Aug: 50, Sep: 42, Oct: 35, Nov: 28, Dec: 20 },
    { name: "Outdoor Space", Jan: 12, Feb: 15, Mar: 35, Apr: 68, May: 88, Jun: 95, Jul: 92, Aug: 85, Sep: 65, Oct: 42, Nov: 22, Dec: 10 },
    { name: "Basement Finish", Jan: 28, Feb: 32, Mar: 38, Apr: 42, May: 45, Jun: 40, Jul: 38, Aug: 42, Sep: 48, Oct: 52, Nov: 45, Dec: 30 },
    { name: "Window/Door", Jan: 25, Feb: 28, Mar: 42, Apr: 58, May: 65, Jun: 68, Jul: 65, Aug: 62, Sep: 55, Oct: 48, Nov: 35, Dec: 22 },
    { name: "Roofing", Jan: 15, Feb: 18, Mar: 35, Apr: 62, May: 75, Jun: 82, Jul: 85, Aug: 78, Sep: 65, Oct: 45, Nov: 25, Dec: 12 },
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const jobTypes = data.map(d => d.name);

// Transform data for Recharts
const transformedData: { x: number, y: number, value: number, name: string, month: string }[] = [];
data.forEach((row, yIndex) => {
    months.forEach((month, xIndex) => {
        transformedData.push({
            x: xIndex,
            y: yIndex,
            value: row[month as keyof typeof row] as number,
            name: row.name,
            month: month
        });
    });
});

export default function JobTypeHeatmap() {
    const maxValue = Math.max(...transformedData.map(item => item.value));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Job Type Seasonality Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart
                        margin={{ top: 20, right: 60, bottom: 20, left: 100 }}
                    >
                        <XAxis 
                            type="number" 
                            dataKey="x" 
                            domain={[0, 11]} 
                            tickCount={12}
                            ticks={[0,1,2,3,4,5,6,7,8,9,10,11]}
                            tickFormatter={(value) => months[value]}
                        />
                        <YAxis 
                            type="number" 
                            dataKey="y" 
                            domain={[0, 7]}
                            tickCount={8}
                            tickFormatter={(value) => jobTypes[value] || ''}
                        />
                        <Tooltip 
                            content={({ payload }) => {
                                if (!payload || !payload[0]) return null;
                                const data = payload[0].payload;
                                return (
                                    <div className="bg-white p-2 border rounded shadow">
                                        <p className="font-medium">{data.name}</p>
                                        <p>{data.month}: {data.value} leads</p>
                                    </div>
                                );
                            }}
                        />
                        <Scatter data={transformedData}>
                            {transformedData.map((entry, index) => (
                                <Cell
                                    key={index}
                                    fill={`rgb(59, 130, 246, ${(entry.value / maxValue) * 100}%)`}
                                />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}