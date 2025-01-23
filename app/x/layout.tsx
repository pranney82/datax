import { AppSidebar } from "@/components/app-sidebar"
import { BottomMenu } from "@/components/bottom-menu"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import Link from "next/link"

export default function XLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow pb-16 md:pb-0">
          <div className="mb-6">
            <Alert variant="default" className="bg-primary text-black">
              <AlertTitle><h3 className="text-2xl font-bold">We are now Official JobTread Partners!!</h3></AlertTitle>
              <AlertDescription>
                So we can officially offer our services: Tech Consulting, and Courses. <Link href="https://winyourdata.com/#cto" className="text-blue-500">Find out more here!</Link>
              </AlertDescription>
            </Alert>
          </div>
            {children}
          </div>
          <BottomMenu />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

