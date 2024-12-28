import DashCard from "@/components/dash-card";
import ReactECharts from "echarts-for-react";
import { Block1 } from "./summary-tiles/block1";
import { Block2 } from "./summary-tiles/block2";
import { Block3 } from "./summary-tiles/block3";
import { Block4 } from "./summary-tiles/block4";
import { Block5 } from "./summary-tiles/block5";
import { Block6 } from "./summary-tiles/block6";

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
        <Block1 />
        <Block2 />
        <Block3 />
        <Block4 />
        <Block5 />
      </div>

      {/* Monthly stats and chart */}
      <div className="grid gap-4 md:grid-cols-6">
        <div className="md:col-span-3">
          <Block6 />
        </div>
        <div className="md:col-span-3">
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