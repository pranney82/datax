import DashCard from "@/components/dash-card";
import DashCardTall from "@/components/dash-card-tall";
import ReactECharts from "echarts-for-react";

const lineChartOption = {
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
    }]
}

export default function Summary() {
  return (
    <div className="flex flex-col gap-4">
      {/* Top metrics row */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-5">
        <DashCard title="Revenue" description="last 12 months" content="$2,300,566.99" />
        <DashCard title="Approved Estimates" description="last 12 months" content="98" />
        <DashCard title="Pending Estimates" description="as of today" content="4" />
        <DashCard title="Total Estimates" description="last 12 months" content="255" />
        <DashCard title="Rev Per Employee" description="last 12 months" content="$90,000.00" />
      </div>

      {/* Monthly stats and chart */}
      <div className="grid gap-4 md:grid-cols-6">
        <div className="md:col-span-2">
          <DashCardTall title="November" description="Stats for this month"/>
        </div>
        <div className="md:col-span-4">
          <DashCard 
              title="Monthly Trends" 
              description="Revenue performance over time"
          >
              <ReactECharts 
                option={lineChartOption} 
                style={{ height: '300px', width: '100%' }}
                theme="light"
              />
          </DashCard>
        </div>
      </div>

      {/* Bottom metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <DashCard title="Performance" description="Current period metrics" content="Details here" />
        <DashCard title="Forecasts" description="Upcoming projections" content="Forecast data" />
      </div>
    </div>
  );
}