import "./globals.css"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
            <SidebarProvider>
                <AppSidebar />
              <SidebarInset className="flex-1">
                {children}
              </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
