"use client"

import * as React from "react"
import { BookOpen, Home, BarChart3, Settings2, Zap } from 'lucide-react'

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
  ] as const,
  navSecondary: [
    {
      title: "Settings",
      url: "/x/settings",
      icon: Settings2,
    }
  ] as NavItem[]

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

