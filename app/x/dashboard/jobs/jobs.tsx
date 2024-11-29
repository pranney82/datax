import DashCard from "@/components/dash-card";
import JobTableOne from "./jobstableone";
import JobsBarOne from "./jobsbarone";
import JobPie from "./jobspie";
import JobLineOne from "./jobslineone";
import JobLineTwo from "./jobslinetwo";
          
export default function Jobs() {
    return (
    <div className="flex flex-col gap-4">
        {/* Top row */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-5">
        <DashCard title="Gross Profit" description="last 12 months" content="33%" />
        <DashCard title="Open AR" description="Accounts Receivable" content="$21,546" />
        <DashCard title="Open AP" description="Accounts Payable" content="$32,123" />
        <DashCard title="Gross Profit" description="last 12 months" content="$1,250,000" />
        <DashCard title="Cash In" description="last 12 months" content="$2,850.00" />
        </div>

        {/* Second row */}
        <div className="grid gap-4 md:grid-cols-6">
          <div className="md:col-span-3">
            <JobTableOne />
          </div>
          <div className="grid gap-4 md:col-span-3">
              <JobsBarOne />
          </div>
        </div>

        {/* Third row */}
        <div className="grid gap-4 md:grid-cols-6">
            <div className="md:col-span-2">
                <JobPie />
            </div>
            <div className="md:col-span-2">
                <JobLineOne />
            </div>
            <div className="md:col-span-2">
                <JobLineTwo />
            </div>
        </div>
    </div>
    );
}
