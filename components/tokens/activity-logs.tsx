"use client"

import { useState, useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useActivityLogs } from "@/hooks/use-bundler-sdk"
import { Trash2, Filter } from "lucide-react"

interface ActivityLogsProps {
  tokenAddress?: string
}

export function ActivityLogs({ tokenAddress }: ActivityLogsProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<string>("all")

  // Use the SDK hook for real-time activity logs
  const { logs, clearLogs } = useActivityLogs({
    limit: 1000,
  })

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [logs])

  // Filter logs based on selected filter and token address
  const filteredLogs = logs.filter((log) => {
    // Filter by category
    if (filter !== "all" && log.category !== filter) return false

    // Filter by token address if provided
    if (tokenAddress && log.data?.tokenAddress && log.data.tokenAddress !== tokenAddress) {
      return false
    }

    return true
  })

  // Get category label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "bundle":
        return "Bundle"
      case "wallet":
        return "Wallet"
      case "token":
        return "Token"
      case "volume":
        return "Volume"
      case "system":
        return "System"
      default:
        return category.charAt(0).toUpperCase() + category.slice(1)
    }
  }

  // Get badge color based on log type and category
  const getBadgeColor = (type: string, category: string) => {
    if (type === "error") return "bg-red-900 text-red-200"
    if (type === "warning") return "bg-yellow-900 text-yellow-200"
    if (type === "success") return "bg-green-900 text-green-200"

    switch (category) {
      case "bundle":
        return "bg-amber-900 text-amber-200"
      case "wallet":
        return "bg-blue-900 text-blue-200"
      case "token":
        return "bg-purple-900 text-purple-200"
      case "volume":
        return "bg-green-900 text-green-200"
      case "system":
        return "bg-gray-800 text-gray-200"
      default:
        return "bg-gray-800 text-gray-200"
    }
  }

  // Get text color based on log type
  const getTextColor = (type: string) => {
    switch (type) {
      case "error":
        return "text-red-300"
      case "warning":
        return "text-yellow-300"
      case "success":
        return "text-green-300"
      default:
        return "text-gray-200"
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="flex items-center space-x-2">
          <Filter className="h-3 w-3 text-gray-400" />
          <span className="text-xs text-gray-400">Filter:</span>
          <Badge
            className={cn(
              "cursor-pointer text-xs",
              filter === "all" ? "bg-amber-700 hover:bg-amber-600" : "bg-gray-800 hover:bg-gray-700",
            )}
            onClick={() => setFilter("all")}
          >
            All
          </Badge>
          <Badge
            className={cn(
              "cursor-pointer text-xs",
              filter === "bundle" ? "bg-amber-700 hover:bg-amber-600" : "bg-gray-800 hover:bg-gray-700",
            )}
            onClick={() => setFilter("bundle")}
          >
            Bundle
          </Badge>
          <Badge
            className={cn(
              "cursor-pointer text-xs",
              filter === "wallet" ? "bg-blue-700 hover:bg-blue-600" : "bg-gray-800 hover:bg-gray-700",
            )}
            onClick={() => setFilter("wallet")}
          >
            Wallet
          </Badge>
          <Badge
            className={cn(
              "cursor-pointer text-xs",
              filter === "token" ? "bg-purple-700 hover:bg-purple-600" : "bg-gray-800 hover:bg-gray-700",
            )}
            onClick={() => setFilter("token")}
          >
            Token
          </Badge>
          <Badge
            className={cn(
              "cursor-pointer text-xs",
              filter === "volume" ? "bg-green-700 hover:bg-green-600" : "bg-gray-800 hover:bg-gray-700",
            )}
            onClick={() => setFilter("volume")}
          >
            Volume
          </Badge>
        </div>

        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 text-gray-400 hover:text-gray-300"
          onClick={clearLogs}
          title="Clear logs"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      <ScrollArea className="h-full w-full p-3 bg-[#12131f]" ref={scrollAreaRef}>
        <div className="space-y-1">
          {filteredLogs.length === 0 ? (
            <div className="text-xs text-gray-400 italic">
              No activity logs yet. {filter !== "all" && `No ${filter} logs found.`}
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="text-xs flex items-start">
                <span className="text-gray-400 mr-2 whitespace-nowrap">[{log.timestamp}]</span>
                <Badge
                  className={cn("mr-2 px-1.5 py-0.5 text-[10px] font-normal", getBadgeColor(log.type, log.category))}
                >
                  {getCategoryLabel(log.category)}
                </Badge>
                <span className={cn("flex-1", getTextColor(log.type))}>{log.message}</span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
