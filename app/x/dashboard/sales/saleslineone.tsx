"use client"

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Area } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLeadsCount } from "@/lib/hooks/use-leads-count";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/context/auth-context";

interface ChartData {
    month: string;
    actual: number;
    target: number;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        name: string;
        value: number;
    }>;
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <p className="label font-semibold text-gray-700">{`${label}`}</p>
                {payload.map((pld, index) => (
                    <p key={index} className={`${pld.name === 'Actual Revenue' ? 'text-yellow-500' : 'text-black'} font-medium`}>
                        {`${pld.name}: $${(pld.value / 10000).toFixed(0)}K`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function RevenueChart() {
    const { block4MonthlyMetrics, salesTarget, setSalesTarget } = useLeadsCount();
    const { user } = useAuth();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        async function fetchSalesTarget() {
            if (!user?.uid) return;

            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                const userOrg = userDoc.data()?.org;

                if (userOrg) {
                    const orgDoc = await getDoc(doc(db, "orgs", userOrg));
                    const target = orgDoc.data()?.salesTarget || 0;
                    setSalesTarget(target);
                }
            } catch (error) {
                console.error("Error fetching sales target:", error);
            }
        }

        fetchSalesTarget();
    }, [user, setSalesTarget]);

    const chartData: ChartData[] = block4MonthlyMetrics.map((metric, index) => {
        const cumulativeTarget = salesTarget * (index + 1);
        const cumulativeActual = block4MonthlyMetrics
            .slice(0, index + 1)
            .reduce((sum, m) => sum + (m.metrics.amountSum || 0), 0);

         // Direct month mapping to avoid any date parsing issues
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const [monthStr] = metric.start.split('-');
        const monthIndex = parseInt(monthStr, 10) - 1;
        const monthName = monthNames[monthIndex];
        
        return {
            month: monthName,
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
                    <LineChart 
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                        <XAxis 
                            dataKey="month" 
                            tickFormatter={(value, index) => {
                                if (isMobile && index % 2 !== 0) {
                                    return '';
                                }
                                return value;
                            }}
                            stroke="#9CA3AF"
                            tick={{ fill: '#333333' }}
                            tickLine={{ stroke: '#9CA3AF' }}
                        />
                        <YAxis 
                            tickFormatter={(value) => `${(value / 10000).toFixed(0)}K`}
                            stroke="#9CA3AF"
                            tick={{ fill: '#333333' }}
                            tickLine={{ stroke: '#9CA3AF' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                            verticalAlign="bottom" 
                            height={36}
                            iconType="circle"
                        />
                        <defs>
                            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FFD400" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#FFD400" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area 
                            type="monotone" 
                            dataKey="actual" 
                            stroke="#FFD400" 
                            fillOpacity={1}
                            fill="url(#actualGradient)"
                        />
                        <Line 
                            type="monotone" 
                            dataKey="actual" 
                            stroke="#FFD400" 
                            strokeWidth={3}
                            name="Actual Revenue"
                            dot={{ r: 6, fill: "#FFD400", strokeWidth: 2, stroke: "#FFFFFF" }}
                            activeDot={{ r: 8, fill: "#FFD400", strokeWidth: 2, stroke: "#FFFFFF" }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="target" 
                            stroke="#000000" 
                            strokeWidth={2}
                            name="Target Revenue"
                            dot={(props: { cx?: number; cy?: number }) => {
                                const { cx = 0, cy = 0 } = props;
                                return (
                                    <path
                                        d={`M${cx-4},${cy} L${cx},${cy-4} L${cx+4},${cy} L${cx},${cy+4} Z`}
                                        fill="#FFFFFF"
                                        stroke="#000000"
                                        strokeWidth={2}
                                    />
                                );
                            }}
                            activeDot={(props: { cx?: number; cy?: number }) => {
                                const { cx = 0, cy = 0 } = props;
                                return (
                                    <path
                                        d={`M${cx-6},${cy} L${cx},${cy-6} L${cx+6},${cy} L${cx},${cy+6} Z`}
                                        fill="#FFFFFF"
                                        stroke="#000000"
                                        strokeWidth={2}
                                    />
                                );
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

