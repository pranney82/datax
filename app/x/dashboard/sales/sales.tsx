import DashCard from "@/components/dash-card";
import SalesMap from "./salesmap";
import SalesLineOne from "./saleslineone";
import SalesLineTwo from "./saleslinetwo";
import SalesPie from "./salespie";
import SalesTable from "./salestable";
          
export default function Sales() {
    return (
    <div className="flex flex-col gap-4">
        {/* Top row */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-5">
        <DashCard title="Total Sales" description="past 30 days" content="$1,234,567" />
        <DashCard title="Won Deals" description="past 30 days" content="23" />
        <DashCard title="Average Deal Value" description="past 30 days" content="$32,123" />
        <DashCard title="Sales Target %" description="this quarter" content="32%" />
        <DashCard title="Pipeline Value" description="past 30 days" content="$2,850.00" />
        </div>

        {/* Second row */}
        <div className="grid gap-4 md:grid-cols-6">
        <div className="md:col-span-2">
            <SalesMap />
        </div>
        <div className="grid gap-4 md:col-span-4">
            <div className="md:col-span-4">
                <SalesLineOne />
            </div>
            <div className="md:col-span-4">
                <SalesLineTwo />
            </div>
        </div>
        </div>

        {/* Third row */}
        <div className="grid gap-4 md:grid-cols-6">
            <div className="md:col-span-3">
                <SalesPie />
            </div>
            <div className="md:col-span-3">
                <SalesTable />
            </div>
        </div>
    </div>
    );
}
