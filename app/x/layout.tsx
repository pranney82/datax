import { AppSidebar } from "@/components/app-sidebar"
import { BottomMenu } from "@/components/bottom-menu"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function XLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow pb-16 md:pb-0">
            {children}
          </div>
          <BottomMenu />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

