"use client"

import * as React from "react"
import {
  IconCategory,
  IconDashboard,
  IconInnerShadowTop,
  IconListDetails,
  IconSubtask,
} from "@tabler/icons-react"

import { NavMain } from "@/components/dashboard/sidebar/nav-main"
import { NavUser } from "@/components/dashboard/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSupabaseUser } from "@/hooks/use-supabase-user"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Kategori",
      url: "/dashboard/category",
      icon: IconCategory,
    },
    {
      title: "Modul",
      url: "/dashboard/module",
      icon: IconListDetails,
    },
    {
      title: "Sub Modul",
      url: "/dashboard/sub-module",
      icon: IconSubtask, 
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useSupabaseUser()
  const sidebarUser = {
    name: user?.user_metadata?.full_name || "User",
    email: user?.email || "no-email@example.com",
    avatar: user?.user_metadata?.avatar_url || "/avatar/avatar-default.png",
  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#" className="flex items-center gap-2">
                <img
                  src="/img/learnmate-logo.png"
                  alt="LearnMate Logo"
                  className="w-9 h-9 object-contain"
                />
                <span
                  className="text-lg font-bold tracking-wide"
                  style={{ color: "#EBA937" }}
                >
                  LearnMate
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
