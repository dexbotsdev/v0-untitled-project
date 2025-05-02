import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { PathBreadcrumb } from "@/components/path-breadcrumb"
import { SolanaStatusBadges } from "@/components/solana-status-badges"
import { Toaster } from "@/components/ui/toaster"
import { SidebarWrapper } from "@/components/sidebar-wrapper"

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Token Management",
  description: "Token management dashboard",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.className} text-stone-200 antialiased`}>
        <div className="flex min-h-screen flex-col overflow-hidden">
          <div className="h-auto py-1 m-1 flex flex-col sm:flex-row items-center justify-between px-2 sm:px-5 gap-2">
            <PathBreadcrumb />
            <SolanaStatusBadges />
          </div>
          <div className="flex flex-1 border bg-[#1e2133] border-slate-800/60 m-1 rounded-lg overflow-hidden">
            <SidebarWrapper />
            <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
