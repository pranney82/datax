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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import Summary from "./summary";
import Leads from "./leads/leads";
import Sales from "./sales/sales";
import Jobs from "./jobs/jobs";

export default function Page() {
  return (
    <main className="flex flex-col flex-1 p-0 w-full max-w-full overflow-x-hidden">
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
        </div>
        <Tabs defaultValue="summary">
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
            <TabsTrigger value="jobs" className="whitespace-nowrap">
              Job Finances
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
      </div>
    </main>
  )
}
