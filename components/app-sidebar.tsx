"use client"

import * as React from "react"
import {
  BookOpen,
  Home,
  LifeBuoy,
  LineChart,
  Settings2,
  SquareTerminal,
  X,
} from "lucide-react"

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
      icon: LineChart,
    },
    {
      title: "JT Features",
      url: "/x/features",
      icon: SquareTerminal,
    },
    {
      title: "Library",
      url: "/x/library/templates",
      icon: BookOpen,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/x/settings",
      icon: Settings2,
    },
    {
      title: "Support & Feedback",
      url: "/x/support",
      icon: LifeBuoy,
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/x">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-yellow-100 text-black">
                  <X className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">DATA x</span>
                  <span className="truncate text-xs">v0.2</span>
                </div>
              </a>
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
