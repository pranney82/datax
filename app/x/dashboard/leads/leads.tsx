import DashCard from "@/components/dash-card";
import LeadFunnel from "./leadfunnel";
import LeadsLineOne from "./leadslineone";
import LeadsBarOne from "./leadsbarone";
import LeadsLineTwo from "./leadslinetwo";
import LeadsTable from "./leadstable";
import LeadsLost from "./leadslost";
import LeadsPie from "./leadspie";
        
export default function Leads() {
    return (
    <div className="flex flex-col gap-4">
        {/* Top row */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-5">
        <DashCard title="Raw Leads" description="past 30 days" content="1,234" />
        <DashCard title="Conversion Rate" description="current month" content="23%" />
        <DashCard title="Lead Acquisition Cost" description="30-day average" content="$45.50" />
        <DashCard title="Average Days to Close" description="this quarter" content="32" />
        <DashCard title="Revenue Per Lead" description="30-day average" content="$2,850.00" />
        </div>

        {/* Second row */}
        <div className="grid gap-4 md:grid-cols-6">
            <div className="md:col-span-2">
                <LeadFunnel />
            </div>
            <div className="md:col-span-4">
                <LeadsLineOne />
            </div>
        </div>

        {/* Third row */}
        <div className="grid gap-4 md:grid-cols-6">
            <div className="md:col-span-3"> 
                <LeadsBarOne />
            </div>
            <div className="md:col-span-3">
                <LeadsLineTwo />
            </div>
            <div className="md:col-span-6">
                <LeadsTable />
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
