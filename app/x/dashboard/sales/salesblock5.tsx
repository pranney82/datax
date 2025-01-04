"use client"

import DashCard from "@/components/dash-card";
import { useLeadsCount } from "@/lib/hooks/use-leads-count";

export function SalesBlock5() {
    const { pendingQuery } = useLeadsCount();

    const pendingValue = pendingQuery?.scope?.connection?.["Amount:sum"] 
        ? Math.ceil(pendingQuery.scope.connection["Amount:sum"])
        : 0;

    return (
        <DashCard 
            title="Pipeline Value" 
            description="pending deals" 
            content={`$${Math.round(pendingValue).toLocaleString()}`}                    
        />
    );
} 