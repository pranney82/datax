"use client"

import * as React from "react"
import { BookOpen, Home, BarChart3, Settings2, Zap, LucideIcon, Landmark } from 'lucide-react'

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import { useUserStore } from "@/lib/stores/user-store"

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { admin, isLoading } = useUserStore();
  
  const navItems = {
    navMain: [
      {
        title: "Home",
        url: "/x",
        icon: Home,
      },
      {
        title: "Dashboard",
        url: "/x/dashboard",
        icon: BarChart3,
      },
      {
        title: "Toolbox",
        url: "/x/toolbox",
        icon: Zap,
      },
      {
        title: "Library",
        url: "/x/library/templates",
        icon: BookOpen,
      },
      // Only include Admin after loading is complete
      ...(!isLoading && admin === true ? [{
        title: "Admin",
        url: "/x/admin",
        icon: Landmark,
      }] : [])
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "/x/settings",
        icon: Settings2,
      }
    ] as NavItem[]
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              {/* Add your button content here */}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems.navMain} />
        <NavSecondary items={navItems.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}

