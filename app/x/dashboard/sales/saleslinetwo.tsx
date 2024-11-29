import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    {
        month: 'Jan',
        'Social Media': 12000,
        'Google Ads': 15000,
        'Referral': 8000,
        'Direct': 10000,
        'Email': 5000,
        'Other': 3000
    },
    {
        month: 'Feb',
        'Social Media': 13000,
        'Google Ads': 16000,
        'Referral': 8500,
        'Direct': 11000,
        'Email': 5500,
        'Other': 3200
    },
    {
        month: 'Mar',
        'Social Media': 14000,
        'Google Ads': 17000,
        'Referral': 9000,
        'Direct': 12000,
        'Email': 6000,
        'Other': 3500
    },
    {
        month: 'Apr',
        'Social Media': 13500,
        'Google Ads': 16500,
        'Referral': 8800,
        'Direct': 11500,
        'Email': 5800,
        'Other': 3300
    },
    {
        month: 'May',
        'Social Media': 15000,
        'Google Ads': 18000,
        'Referral': 9500,
        'Direct': 13000,
        'Email': 6500,
        'Other': 3800
    },
    {
        month: 'Jun',
        'Social Media': 16000,
        'Google Ads': 19000,
        'Referral': 10000,
        'Direct': 14000,
        'Email': 7000,
        'Other': 4000
    },
    {
        month: 'Jul',
        'Social Media': 17000,
        'Google Ads': 20000,
        'Referral': 10500,
        'Direct': 15000,
        'Email': 7500,
        'Other': 4200
    },
    {
        month: 'Aug',
        'Social Media': 18000,
        'Google Ads': 21000,
        'Referral': 11000,
        'Direct': 16000,
        'Email': 8000,
        'Other': 4500
    },
    {
        month: 'Sep',
        'Social Media': 19000,
        'Google Ads': 22000,
        'Referral': 11500,
        'Direct': 17000,
        'Email': 8500,
        'Other': 4800
    },
    {
        month: 'Oct',
        'Social Media': 20000,
        'Google Ads': 23000,
        'Referral': 12000,
        'Direct': 18000,
        'Email': 9000,
        'Other': 5000
    },
    {
        month: 'Nov',
        'Social Media': 21000,
        'Google Ads': 24000,
        'Referral': 12500,
        'Direct': 19000,
        'Email': 9500,
        'Other': 5200
    },
    {
        month: 'Dec',
        'Social Media': 22000,
        'Google Ads': 25000,
        'Referral': 13000,
        'Direct': 20000,
        'Email': 10000,
        'Other': 5500
    }
];

const COLORS = {
    'Social Media': '#8884d8',
    'Google Ads': '#82ca9d',
    'Referral': '#ffc658',
    'Direct': '#ff7300',
    'Email': '#0088fe',
    'Other': '#00C49F'
};

export default function RevenueBySourceChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Revenue by Lead Source</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis 
                            tickFormatter={(value) => `$${(value / 1000)}k`}
                        />
                        <Tooltip 
                            formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                        />
                        <Legend />
                        {Object.keys(COLORS).map((key) => (
                            <Area
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stackId="1"
                                stroke={COLORS[key as keyof typeof COLORS]}
                                fill={COLORS[key as keyof typeof COLORS]}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
