"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Settings, HelpCircle, BarChart2, TrendingUp, Zap, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Volume Bot",
      href: "/volume-bot",
      icon: BarChart2,
    },
    {
      name: "TurboBoost Bot",
      href: "/turbo-boost-bot",
      icon: Zap,
    },
    {
      name: "Bundler Bot",
      href: "/bundler",
      icon: Package, // Add Package import from lucide-react
    },
    {
      name: "Volume Bot Strategy Guide",
      href: "/strategies",
      icon: TrendingUp,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
    {
      name: "Help",
      href: "/help",
      icon: HelpCircle,
    },
  ]

  return (
    <div className="flex flex-col h-screen bg-black border-r border-gray-800 w-16">
      <div className="flex items-center justify-center h-16 border-b border-gray-800">
        <Image src="/images/iconLogo2.png" alt="Boss Logo" width={80} height={80} className="object-contain" />
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <TooltipProvider key={item.name} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-amber-900/20 text-amber-500"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
