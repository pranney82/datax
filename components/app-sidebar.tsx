"use client"

import * as React from "react"
import { Home, Settings2, SquareChevronLeft, SquareChevronRight, BarChart3, Zap, BookOpen } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"

// Updated data structure
const data = {
  navMain: [
    {
      title: "Getting Started",
      icon: Home,
      url: "/x",
      items: [
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
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar, open } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <img src="/assets/icons/4.png" alt="Sidebar Icon" className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Documentation</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items && item.items.map((subItem, index) => (
                  <SidebarMenuItem key={`${subItem.title}-${index}`}>
                    <SidebarMenuButton
                      asChild
                      tooltip={subItem.title}
                    >
                      <a href={subItem.url}>
                        <subItem.icon className="size-5" />
                        <span>{subItem.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <a href="/x/settings">
                <Settings2 className="size-4" />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleSidebar} tooltip={open ? "Collapse sidebar" : "Expand sidebar"}>
              {open ? <SquareChevronLeft className="size-4" /> : <SquareChevronRight className="size-4" />}
              <span>{open ? "Collapse sidebar" : "Expand sidebar"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

