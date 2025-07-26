"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/category": "Halaman Kategori",
  "/dashboard/module": "Halaman Module",
  "/dashboard/module/create": "Halaman Tambah Module",
  "/dashboard/module/[id]": "Halaman Detail Module",
  "/dashboard/module/[id]/update": "Halaman Update Module",
  "/dashboard/sub-module": "Halaman Sub Module",
  "/dashboard/sub-module/create": "Halaman Tambah Sub Module",
  "/dashboard/sub-module/[id]": "Halaman Detail Sub Module",
  "/dashboard/sub-module/[id]/update": "Halaman Update Sub Module",
}

function getDynamicTitle(pathname: string): string {
  if (/^\/dashboard\/module\/[^\/]+$/.test(pathname)) {
    return pageTitles["/dashboard/module/create"]
  }

  if (/^\/dashboard\/module\/[^\/]+$/.test(pathname)) {
    return pageTitles["/dashboard/module/[id]"]
  }

  if (/^\/dashboard\/module\/[^\/]+\/update$/.test(pathname)) {
    return pageTitles["/dashboard/module/[id]/update"]
  }

  if (/^\/dashboard\/sub-module\/[^\/]+$/.test(pathname)) {
    return pageTitles["/dashboard/sub-module/create"]
  }

  if (/^\/dashboard\/sub-module\/[^\/]+$/.test(pathname)) {
    return pageTitles["/dashboard/sub-module/[id]"]
  }

  if (/^\/dashboard\/sub-module\/[^\/]+\/update$/.test(pathname)) {
    return pageTitles["/dashboard/sub-module/[id]/update"]
  }

  return pageTitles[pathname] ?? "Dashboard"
}

export function SiteHeader() {
  const pathname = usePathname()
  const title = getDynamicTitle(pathname)

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
      </div>
    </header>
  )
}
