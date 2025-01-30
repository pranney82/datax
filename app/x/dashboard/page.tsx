"use client"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useRouter, useSearchParams } from "next/navigation"

import Summary from "./summary"
import Leads from "./leads/leads"
import Sales from "./sales/sales"
import Jobs from "./jobs/jobs"
import { DatePickerWithRange } from "@/components/datepicker"

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") ?? "summary"

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("tab", value)
    router.push(`?${params.toString()}`)
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 justify-between mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>    
        <DatePickerWithRange />
      </div>
      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground">
          <TabsTrigger value="summary" className="whitespace-nowrap">
            Summary
          </TabsTrigger>
          <TabsTrigger value="leads" className="whitespace-nowrap">
            Leads
          </TabsTrigger>
          <TabsTrigger value="sales" className="whitespace-nowrap">
            Sales
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <Summary />
        </TabsContent>
        <TabsContent value="leads">
          <Leads />
        </TabsContent>
        <TabsContent value="sales">
          <Sales />
        </TabsContent>
        <TabsContent value="jobs">
          <Jobs />
        </TabsContent>
      </Tabs>
    </main>
  )
}

