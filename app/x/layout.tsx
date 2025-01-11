'use client';

import "../globals.css"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AuthDialog } from '@/components/home/signup1';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Don't render anything while checking auth status
  if (loading) {
    return (
      <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        > 
            <SidebarProvider>
                <AppSidebar />
              <SidebarInset className="flex-1">
                {children}
              </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    );
  }

  if (!user) {
    return (
      <div className="relative min-h-screen">
        {/* Blurred content */}
        <div className="blur-sm pointer-events-none">
          <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
            <SidebarProvider>
                <AppSidebar />
              <SidebarInset className="flex-1">
                {children}
              </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
        </div>

        {/* Overlay with login prompt */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="text-center space-y-4 p-8 rounded-lg bg-background/95 shadow-lg">
            <h2 className="text-2xl font-bold">Login Required</h2>
            <p className="text-muted-foreground">You need to be logged in to access this page</p>
            <Button 
              onClick={() => setShowAuthDialog(true)}
              className="bg-primary text-primary-foreground"
            >
              Log in
            </Button>
          </div>
        </div>

        {/* Auth Dialog */}
        <AuthDialog 
          isOpen={showAuthDialog} 
          onClose={() => setShowAuthDialog(false)}
          defaultView="login"
        />
      </div>
    );
  }

  return (
    
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
      
  )
}
