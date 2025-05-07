"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "./sidebar"

export function SidebarWrapper() {
  const pathname = usePathname()

  // Don't render sidebar on license validator page or main page
  if (pathname === "/license-validator" || pathname === "/") {
    return null
  }

  return <Sidebar />
}
