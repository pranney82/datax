"use client"

import DashCard from "@/components/dash-card";
import { useLeadsCount } from "@/lib/hooks/use-leads-count";

export function SalesBlock2() {
    const { block3StatusCounts } = useLeadsCount();
    
    // Get current month's data
    const currentMonth = new Date().getMonth();
    const currentMonthStatusCounts = block3StatusCounts[11]?.statusCounts || [];
    const lastMonthStatusCounts = block3StatusCounts[10]?.statusCounts || [];

    // Calculate metrics
    const approvedDeals = currentMonthStatusCounts.find(s => s.status === 'approved')?.count || 0;
    const lastMonthApproved = lastMonthStatusCounts.find(s => s.status === 'approved')?.count || 0;
    const approvedDiff = approvedDeals - lastMonthApproved;

    return (
        <DashCard 
            title="Won Deals" 
            description="this month" 
            content={approvedDeals.toString()}
            footer={{
                text: `${approvedDiff >= 0 ? '+' : '-'}${Math.abs(approvedDiff)} from last month`,
                trend: approvedDiff >= 0 ? 'up' : 'down'
            }}
        />
    );
} 