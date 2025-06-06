"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Coins, Wallet } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface MenuButtonProps {
  href: string
  icon: React.ElementType
  isActive: boolean
  tooltip: string
}

const MenuButton = ({ href, icon: Icon, isActive, tooltip }: MenuButtonProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={href}>
          <Button
            variant="ghost"
            size="icon"
            className={`w-12 h-12 rounded-none ${
              isActive
                ? " bg-transparent text-amber-600 hover:bg-amber-700/50 hover:text-amber-300"
                : "text-white hover:bg-gray-800/50 hover:text-amber-300"
            } transition-all duration-200 ease-in-out`}
          >
            <Icon className="h-5 w-5" />
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="bg-stone-800 text-stone-200 border-stone-700">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: "/tokens", icon: Coins, tooltip: "Tokens" },
    { href: "/wallets", icon: Wallet, tooltip: "Wallets" },
  ]

  return (
    <div className="flex h-full">
      <div className="flex w-12 flex-col items-center justify-between border-r border-gray-800 py-4">
        <div className="flex flex-col items-center space-y-4">
          {menuItems.map((item) => (
            <MenuButton
              key={item.href}
              href={item.href}
              icon={item.icon}
              isActive={pathname === item.href}
              tooltip={item.tooltip}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
