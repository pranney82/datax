"use client"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import DashCard from "@/components/dash-card"
import DashCardTall from "@/components/dash-card-tall"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import ReactECharts from 'echarts-for-react';

export default function Page() {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lineChartOption = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisLine: {
        lineStyle: {
          color: '#666'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#666'
        }
      }
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320, 1450, 1400, 1380, 1420, 1500],
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#3b82f6' // blue-500
        },
        areaStyle: {
          opacity: 0.2,
          color: '#3b82f6' // blue-500
        }
      }
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    }
  }

  return (
    <main className="flex flex-col flex-1 p-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Summary</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
        <div className="flex items-center gap-2 justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2">
          <Button variant="outline">
              <Plus className="h-4 w-4" />Add Card
            </Button>
            <div className="flex items-center gap-2">
                <Button 
                  onClick={handleCopy}
                  variant="outline"
                >
                  {copied ? "Copied!" : "Share URL"}
              </Button>
            </div>            
          </div>
        </div>
        <Tabs defaultValue="one">
          <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground">
            <TabsTrigger value="one" className="whitespace-nowrap">Summary</TabsTrigger>
            <TabsTrigger value="two" className="whitespace-nowrap">
              Leads
              <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs font-medium">Paid</Badge>
            </TabsTrigger>
            <TabsTrigger value="three" className="whitespace-nowrap">
              Sales
              <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs font-medium">Paid</Badge>
            </TabsTrigger>
            <TabsTrigger value="four" className="whitespace-nowrap">
              Job Finances
              <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs font-medium">Paid</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        

        <div className="grid auto-rows-min gap-4 md:grid-cols-5">
          <DashCard title="Revenue" description="last 12 months" content="$2,300,566.99" footer="" />
          <DashCard title="Approved Estimates" description="last 12 months" content="98" footer="" />
          <DashCard title="Pending Estimates" description="as of today" content="4" footer="" />
          <DashCard title="Total Estimates" description="last 12 months" content="255" footer="" />
          <DashCard title="Rev Per Employee" description="last 12 months" content="$90,000.00" footer="" />
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-6">
          <div className="grid auto-rows-min gap-4 md:col-span-2">
            <DashCardTall title="November" description="Stats for this month"/>
          </div>
          <div className="grid auto-rows-min gap-4 md:col-span-4">
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
        <div className="grid auto-rows-min gap-4 md:grid-cols-6">
          <div className="grid auto-rows-min gap-4 md:col-span-3">
            <DashCard title="Card 12" description="Card 12 Description" content="Card 12" footer="" />
          </div>
          <div className="grid auto-rows-min gap-4 md:col-span-3">
            <DashCard title="Card 13" description="Card 13 Description" content="Card 13" footer="" />
          </div>
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-6">
          <div className="grid auto-rows-min gap-4 md:col-span-2">
            <DashCardTall title="November" description="Stats for this month"/>
          </div>
          <div className="grid auto-rows-min gap-4 md:col-span-4">
            <DashCard title="Card 15" description="Card 15 Description" content="Card 15" footer="" />
          </div>
        </div>
      </div>
    </main>
  )
}
