"use client"

import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export function PathBreadcrumb() {
  const pathname = usePathname()

  // Create breadcrumb from current path
  const getBreadcrumb = () => {
    const segments = pathname.split("/").filter((segment) => segment)

    if (segments.length === 0) return "Dashboard"

    return segments.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1)).join(" / ")
  }

  return (
    <Badge variant="secondary" className="text-muted-foreground bg-[#11111D] text-[12px] rounded-[5px]">
      {getBreadcrumb()}
    </Badge>
  )
}
