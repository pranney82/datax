import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    {
        month: 'Jan',
        'Social Media': 150,
        'Google Ads': 200,
        'Referral': 90,
        'Direct': 130,
        'Email': 70,
        'Other': 30
    },
    {
        month: 'Feb',
        'Social Media': 155,
        'Google Ads': 210,
        'Referral': 95,
        'Direct': 140,
        'Email': 75,
        'Other': 35
    },
    {
        month: 'Mar',
        'Social Media': 160,
        'Google Ads': 220,
        'Referral': 100,
        'Direct': 145,
        'Email': 80,
        'Other': 40
    },
    {
        month: 'Apr',
        'Social Media': 165,
        'Google Ads': 225,
        'Referral': 105,
        'Direct': 150,
        'Email': 82,
        'Other': 42
    },
    {
        month: 'May',
        'Social Media': 170,
        'Google Ads': 230,
        'Referral': 110,
        'Direct': 155,
        'Email': 85,
        'Other': 45
    },
    {
        month: 'Jun',
        'Social Media': 175,
        'Google Ads': 235,
        'Referral': 115,
        'Direct': 158,
        'Email': 87,
        'Other': 48
    },
    {
        month: 'Jul',
        'Social Media': 180,
        'Google Ads': 240,
        'Referral': 120,
        'Direct': 160,
        'Email': 90,
        'Other': 50
    },
    {
        month: 'Aug',
        'Social Media': 200,
        'Google Ads': 260,
        'Referral': 140,
        'Direct': 180,
        'Email': 100,
        'Other': 60
    },
    {
        month: 'Sep',
        'Social Media': 220,
        'Google Ads': 280,
        'Referral': 150,
        'Direct': 190,
        'Email': 110,
        'Other': 70
    },
    {
        month: 'Oct',
        'Social Media': 250,
        'Google Ads': 300,
        'Referral': 170,
        'Direct': 200,
        'Email': 130,
        'Other': 80
    },
    {
        month: 'Nov',
        'Social Media': 280,
        'Google Ads': 320,
        'Referral': 190,
        'Direct': 220,
        'Email': 150,
        'Other': 90
    },
    {
        month: 'Dec',
        'Social Media': 300,
        'Google Ads': 350,
        'Referral': 200,
        'Direct': 240,
        'Email': 170,
        'Other': 100
    }
];

export default function LeadsSourceChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Leads by Source</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Social Media" stackId="a" fill="#8884d8" />
                        <Bar dataKey="Google Ads" stackId="a" fill="#82ca9d" />
                        <Bar dataKey="Referral" stackId="a" fill="#ffc658" />
                        <Bar dataKey="Direct" stackId="a" fill="#ff7300" />
                        <Bar dataKey="Email" stackId="a" fill="#0088fe" />
                        <Bar dataKey="Other" stackId="a" fill="#00C49F" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}