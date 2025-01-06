"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLeadsCount } from "@/lib/hooks/use-leads-count";
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/context/auth-context";

interface ChartData {
    month: string;
    actual: number;
    target: number;
}

export default function RevenueChart() {
    const { block4MonthlyMetrics, salesTarget, setSalesTarget } = useLeadsCount();
    const { user } = useAuth();

    // Keep the useEffect to fetch initial value
    useEffect(() => {
        async function fetchSalesTarget() {
            if (!user?.uid) return;

            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                const userOrg = userDoc.data()?.org;

                if (userOrg) {
                    const orgDoc = await getDoc(doc(db, "orgs", userOrg));
                    const target = orgDoc.data()?.salesTarget || 0;
                    setSalesTarget(target); // Use store's setSalesTarget
                }
            } catch (error) {
                console.error("Error fetching sales target:", error);
            }
        }

        fetchSalesTarget();
    }, [user]);

    // Transform data for the chart
    const data: ChartData[] = block4MonthlyMetrics.map((metric, index) => {
        // Calculate cumulative target
        const cumulativeTarget = salesTarget * (index + 1);
        
        // Calculate cumulative actual revenue by summing all months up to current index
        const cumulativeActual = block4MonthlyMetrics
            .slice(0, index + 1)
            .reduce((sum, m) => sum + (m.metrics.amountSum || 0), 0);
        
        return {
            month: new Date(metric.start).toLocaleString('default', { month: 'short' }),
            actual: Math.round(cumulativeActual),
            target: cumulativeTarget
        };
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Revenue vs Target</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis 
                            tickFormatter={(value) => `$${(value / 1000)}k`}
                        />
                        <Tooltip 
                            formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                        />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="actual" 
                            stroke="#2563eb" 
                            strokeWidth={2}
                            name="Actual Revenue"
                            dot={{ r: 4 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="target" 
                            stroke="#dc2626" 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            name="Target Revenue"
                            dot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
