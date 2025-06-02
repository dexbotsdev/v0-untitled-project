import type React from "react"
import { PathBreadcrumb } from "@/components/path-breadcrumb"
import { SolanaStatusBadges } from "@/components/solana-status-badges"
import { SidebarWrapper } from "@/components/sidebar-wrapper"
import { AutoLicenseValidator } from "@/components/auto-license-validator"
import { VolumeBotSDKInitializer } from "@/components/volume-bot/sdk-initializer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <VolumeBotSDKInitializer />
      <div className="flex min-h-screen w-full flex-col">
        <AutoLicenseValidator />
        <div className="h-auto py-1 m-1 flex flex-col sm:flex-row items-center justify-between px-2 sm:px-5 gap-2">
          <div className="flex items-center gap-2">
            <PathBreadcrumb />
          </div>
          <SolanaStatusBadges />
        </div>
        <div className="flex flex-1 border bg-[#1e2133] border-slate-800/60 m-1 w-full rounded-lg overflow-hidden">
          <SidebarWrapper />
          <main className="flex-1 overflow-auto w-full">{children}</main>
        </div>
      </div>
    </div>
  )
}
