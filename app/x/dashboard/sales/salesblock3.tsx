"use client"

import DashCard from "@/components/dash-card";
import { useLeadsCount } from "@/lib/hooks/use-leads-count";

export function SalesBlock3() {
    const { block4Metrics } = useLeadsCount();

    return (
        <DashCard 
            title="Average Deal Value" 
            description="this month" 
            content={`$${Math.round(block4Metrics.amountAvg || 0).toLocaleString()}`}
        />
    );
} 