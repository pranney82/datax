import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    {
        name: "Downtown Office Complex",
        budgeted: 31500,
        actual: 33200,
    },
    {
        name: "Smith Residence",
        budgeted: 8125,
        actual: 7900,
    },
    {
        name: "24/7 Grocery Store",
        budgeted: 5525,
        actual: 5800,
    },
    {
        name: "Tech Plaza",
        budgeted: 9750,
        actual: 9600,
    },
    {
        name: "Shopping Mall",
        budgeted: 59500,
        actual: 62000,
    },
    {
        name: "Corporate HQ",
        budgeted: 3575,
        actual: 3500,
    },
    {
        name: "Medical Center",
        budgeted: 14300,
        actual: 15100,
    },
    {
        name: "Johnson Family Home",
        budgeted: 2275,
        actual: 2150,
    },
    {
        name: "Restaurant Row",
        budgeted: 12025,
        actual: 12500,
    },
    {
        name: "Office Park",
        budgeted: 42250,
        actual: 41800,
    },
    {
        name: "Retail Center",
        budgeted: 16250,
        actual: 16100,
    },
    {
        name: "Hotel Complex",
        budgeted: 8125,
        actual: 8400,
    }
].sort((a, b) => b.budgeted - a.budgeted); // Sort by budget size

export default function ExpensesComparisonChart() {
    const COLORS = {
        budgeted: "#8884d8",  // Purple for budget
        underBudget: "#82ca9d", // Green for under budget
        overBudget: "#ef4444"   // Red for over budget
    };

    const CustomTooltip = ({ 
        active, 
        payload, 
        label 
    }: {
        active?: boolean;
        payload?: Array<{ value: number }>;
        label?: string;
    }) => {
        if (active && payload && payload.length) {
            const actualValue = payload[1].value;
            const budgetedValue = payload[0].value;
            const isOverBudget = actualValue > budgetedValue;

            return (
                <div className="bg-white p-4 border rounded-lg shadow-sm">
                    <p className="font-medium mb-2">{label}</p>
                    <p style={{ color: COLORS.budgeted }}>
                        Budgeted: ${payload[0].value.toLocaleString()}
                    </p>
                    <p style={{ color: isOverBudget ? COLORS.overBudget : COLORS.underBudget }}>
                        Actual: ${payload[1].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Budgeted vs Actual Expenses</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={600}>
                    <BarChart
                        layout="vertical"
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 150,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            type="number"
                            tickFormatter={(value) => `$${(value / 1000)}k`}
                        />
                        <YAxis 
                            type="category" 
                            dataKey="name"
                            width={140}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                            payload={[
                                { value: 'Budgeted', type: 'rect', color: COLORS.budgeted },
                                { value: 'Actual', type: 'rect', color: COLORS.underBudget }
                            ]}
                        />
                        <Bar 
                            dataKey="budgeted" 
                            fill={COLORS.budgeted}
                            name="Budgeted"
                        />
                        <Bar 
                            dataKey="actual" 
                            name="Actual"
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`}
                                    fill={entry.actual > entry.budgeted ? COLORS.overBudget : COLORS.underBudget}
                                />
                            ))}
                        </Bar>
                        <ReferenceLine x={0} stroke="#000" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
} 