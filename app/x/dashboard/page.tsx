"use client"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { YoutubeIcon as YouTube } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"

import Summary from "./summary"
import Leads from "./leads/leads"
import Sales from "./sales/sales"
import Jobs from "./jobs/jobs"
import { DatePickerWithRange } from "@/components/datepicker"

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") ?? "summary"
  const [isTutorialOpen, setIsTutorialOpen] = useState(false)

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("tab", value)
    router.push(`?${params.toString()}`)
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="flex flex-col mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
          <div className="flex items-center justify-between sm:justify-start w-full">
            <h1 className="text-2xl font-bold mb-2 sm:mb-0">Dashboard</h1>
            <div className="flex items-center">
              <div className="sm:ml-4 hidden sm:block">
                <DatePickerWithRange />
              </div>
              <Button
                variant="outline"
                className="gap-2 text-black border-2 border-[#FFD400] bg-[#FFD400] transition-colors duration-300 shadow-lg hover:bg-[#FFD400]/80 ml-4"
                onClick={() => setIsTutorialOpen(true)}
              >
                <YouTube className="w-5 h-5" />
                <span className="font-semibold">Tutorial</span>
              </Button>
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

      <Dialog open={isTutorialOpen} onOpenChange={setIsTutorialOpen}>
        <DialogContent className="sm:max-w-[800px] max-w-[90vw] w-full bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-black">Dashboard Tutorial</DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/FEptwBb7IrM"
              title="Tutorial Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}