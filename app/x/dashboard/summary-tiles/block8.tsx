import DashCard from "@/components/dash-card";
import ReactECharts from "echarts-for-react";
import { useLeadsCount } from "@/lib/hooks/use-leads-count";

export function Block8() {
    const { block4MonthlyMetrics, block3MonthlyLeads } = useLeadsCount()

    const lineChartOption = {
        xAxis: {
            type: 'category',
            data: block4MonthlyMetrics.map(m => {
                const date = new Date(m.start)
                return date.toLocaleString('default', { month: 'short' })
            })
        },
        yAxis: [
            {
                type: 'value',
                name: 'Estimates',
                position: 'left',
                axisLine: {
                    show: true
                }
            },
            {
                type: 'value',
                name: 'Leads',
                position: 'right',
                axisLine: {
                    show: true
                },
                splitLine: { show: false }
            }
        ],
        series: [
            {
                name: 'Approved Estimates',
                data: block4MonthlyMetrics.map(m => m.metrics.count),
                type: 'line',
                yAxisIndex: 0
            },
            {
                name: 'Raw Leads',
                data: block3MonthlyLeads.map(m => m.count),
                type: 'bar',
                yAxisIndex: 1
            }
        ],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['Approved Estimates', 'Raw Leads'],
            bottom: 0
        }
    }

    return (
        <DashCard 
            title="Monthly Leads & Estimates" 
            description="Conversion performance over time"
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