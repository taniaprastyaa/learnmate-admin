"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type NavItem = {
  title: string
  url: string
  icon?: Icon
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  function isActiveMenu(url: string, pathname: string) {
    if (url === "/") return pathname === url

    if (url === "/dashboard") return pathname === url || pathname === url + "/"

    const cleanUrl = url.endsWith("/") && url !== "/" ? url.slice(0, -1) : url
    const cleanPathname = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname

    return cleanPathname === cleanUrl || cleanPathname.startsWith(cleanUrl + "/")
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={isActiveMenu(item.url, pathname)}
                className="nav-menu-item"
              >
                <Link href={item.url} className="flex items-center gap-2">
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}