import DashCard from "@/components/dash-card";
import LeadFunnel from "./leadfunnel";
import LeadsLineOne from "./leadslineone";
import LeadsBarOne from "./leadsbarone";
import LeadsLost from "./leadslost";
import LeadsPie from "./leadspie";
import { LeadsBlock3 } from "./leadsblock3";
import { LeadsBlock4 } from "./leadsblock4";
import { useLeadsCount } from "@/lib/hooks/use-leads-count"

export default function Leads() {
    const { block3MonthlyLeads, block4Metrics } = useLeadsCount()
    
    // Get current month's leads count (last item in array)
    const currentMonthLeads = block3MonthlyLeads.length > 0 
        ? block3MonthlyLeads[block3MonthlyLeads.length - 1].count
        : 0

    // Calculate conversion rate using the same logic as block4
    const conversionRate = currentMonthLeads 
        ? ((block4Metrics.count / currentMonthLeads) * 100).toFixed(1) 
        : '0'

    // Calculate revenue per lead
    const revenuePerLead = block4Metrics.count > 0
        ? `$${(block4Metrics.amountSum / block4Metrics.count).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`
        : '$0.00'

    return (
    <div className="flex flex-col gap-4">
        {/* Top row */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-5">
        <DashCard title="Raw Leads" description="this month" content={currentMonthLeads.toLocaleString()} />
        <DashCard title="Conversion Rate" description="this month" content={`${conversionRate}%`} />
        <LeadsBlock3 />
        <LeadsBlock4 />
        <DashCard 
            title="Revenue Per Lead" 
            description="last 12 months" 
            content={revenuePerLead} 
        />
        </div>

        {/* second row */}
        <div className="grid gap-4 md:grid-cols-6">
            <div className="md:col-span-6">
                <LeadsLineOne />
            </div>
            <div className="md:col-span-2">
                <LeadFunnel />
            </div>
            <div className="md:col-span-4"> 
                <LeadsBarOne />
            </div>
            <div className="md:col-span-3">
                <LeadsLost />
            </div>
            <div className="md:col-span-3">
                <LeadsPie />
            </div>
        </div>
    </div>
    );
}
