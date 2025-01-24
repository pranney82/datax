"use client"

import DashCard from "@/components/dash-card";
import { useLeadsCount } from "@/lib/hooks/use-leads-count";

export function SalesBlock1() {
    const { block4MonthlyMetrics, block3StatusCounts } = useLeadsCount();
    
    // Get current month's data
    const currentMonth = new Date().getMonth();
    const currentMonthStatusCounts = block3StatusCounts[11]?.statusCounts || [];
    const lastMonthStatusCounts = block3StatusCounts[10]?.statusCounts || [];

    // Calculate metrics
    const currentMonthMetrics = block4MonthlyMetrics[11]?.metrics || {};
    const lastMonthMetrics = block4MonthlyMetrics[10]?.metrics || {};
    const approvedDiff = Math.ceil(((currentMonthMetrics.amountSum - lastMonthMetrics.amountSum)/lastMonthMetrics.amountSum)*100);

    console.log('block4MonthlyMetrics:', block4MonthlyMetrics)

    return (
        <DashCard 
            title="Total Sales" 
            description="this month" 
            content={`$${Math.round(currentMonthMetrics.amountSum || 0).toLocaleString()}`}
            footer={{
                text: `${approvedDiff >= 0 ? '+' : '-'}${Math.abs(approvedDiff)}% from last month`,
                trend: approvedDiff >= 0 ? 'up' : 'down'
            }}
        />
    );
} 