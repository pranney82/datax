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
      <div className="flex flex-col mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
          <div className="flex items-center justify-between sm:justify-start">
            <h1 className="text-2xl font-bold mb-2 sm:mb-0">Dashboard</h1>
            <div className="sm:ml-4 hidden sm:block">
              <DatePickerWithRange />
            </div>
          </div>
          <div className="sm:hidden mt-2">
            <DatePickerWithRange />
          </div>
        </div>
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

