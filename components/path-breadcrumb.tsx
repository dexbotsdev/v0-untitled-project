"use client"

import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export function PathBreadcrumb() {
  const pathname = usePathname()

  // Create breadcrumb from current path
  const getBreadcrumb = () => {
    const segments = pathname.split("/").filter((segment) => segment)

    if (segments.length === 0) return "Dashboard"

    return segments.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1)).join(" / ")
  }

  return (
    <div className="relative flex items-center"> 
      <Badge
        variant="secondary"
        className="text-muted-foreground bg-[#11111D]/80 text-[12px] rounded-[5px] pr-3 py-1 z-10 backdrop-blur-sm border border-stone-800"
      >
        {getBreadcrumb()}
      </Badge>
    </div>
  )
}
