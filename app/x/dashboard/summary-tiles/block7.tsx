import DashCard from "@/components/dash-card";
import ReactECharts from "echarts-for-react";
import { useLeadsCount } from "@/lib/hooks/use-leads-count";

export function Block7() {
    const { monthlyRevenue } = useLeadsCount()

    const lineChartOption = {
        xAxis: {
            type: 'category',
            data: monthlyRevenue.map(m => {
                const date = new Date(m.start)
                return new Date(date.getTime() + date.getTimezoneOffset() * 60000)
                    .toLocaleString('default', { month: 'short' })
            })
        },
        yAxis: [
            {
                type: 'value',
                name: '$$ Amount',
                position: 'left'
            },
            {
                type: 'value',
                name: 'Inv Count',
                position: 'right',
                axisLine: { show: true },
                splitLine: { show: false }
            }
        ],
        series: [
            {
                name: 'Total Amount',
                data: monthlyRevenue.map(m => m.data?.scope?.connection?.["Amount:sum"] || 0),
                type: 'line',
                yAxisIndex: 0
            },
            {
                name: 'Invoice Count',
                data: monthlyRevenue.map(m => m.data?.scope?.connection?.count || 0),
                type: 'bar',
                yAxisIndex: 1,
                color: '#4ade80'
            }
        ],
        legend: {
            data: ['Total Amount', 'Invoice Count'],
            bottom: 0
        }, 
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        }
    }

    return (
        <DashCard 
            title="Monthly Revenue" 
            description="Revenue collected over time"
        >
            <ReactECharts 
                option={lineChartOption} 
                style={{ 
                    height: '300px', 
                    width: '100%',
                    padding: 0,
                    marginBottom: '-20px'
                }}
                theme="light"
            />
        </DashCard>
    )
}