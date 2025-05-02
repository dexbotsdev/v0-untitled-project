"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "./sidebar"

export function SidebarWrapper() {
  const pathname = usePathname()

  // Don't render sidebar on license validator page
  if (pathname === "/license-validator") {
    return null
  }

  return <Sidebar />
}
