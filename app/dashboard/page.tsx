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

export default function Page() {
  return (
    <main className="flex flex-col flex-1 p-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Features</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid auto-rows-min gap-4 md:grid-cols-6">
          <DashCard title="Revenue" description="last 12 months" content="$2,300,566.99" footer="" />
          <DashCard title="Active Projects" description="as of today" content="10" footer="" />
          <DashCard title="Approved Estimates" description="last 12 months" content="98" footer="" />
          <DashCard title="Pending Estimates" description="as of today" content="4" footer="" />
          <DashCard title="Total Estimates" description="last 12 months" content="255" footer="" />
          <DashCard title="Rev Per Employee" description="last 12 months" content="$90,000.00" footer="" />
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-6">
          <div className="grid auto-rows-min gap-4 md:col-span-2">
            <DashCardTall title="November" description="Stats for this month" content="" footer="" />
          </div>
          <div className="grid auto-rows-min gap-4 md:col-span-4">
            <DashCard title="Card 8" description="Card 8 Description" content="Card 8" footer="" />
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
            <DashCardTall title="November" description="Stats for this month" content="" footer="" />
          </div>
          <div className="grid auto-rows-min gap-4 md:col-span-4">
            <DashCard title="Card 15" description="Card 15 Description" content="Card 15" footer="" />
          </div>
        </div>
      </div>
    </main>
  )
}
