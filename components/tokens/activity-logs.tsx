"use client"

import { useState, useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface LogEntry {
  timestamp: string
  message: string
  taskId: string
  taskType: string
}

interface ActivityLogsProps {
  logs: LogEntry[]
}

export function ActivityLogs({ logs }: ActivityLogsProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<string>("all")

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [logs])

  // Filter logs based on selected filter
  const filteredLogs = logs.filter((log) => {
    if (filter === "all") return true
    return log.taskType === filter
  })

  // Get task type label
  const getTaskTypeLabel = (type: string) => {
    switch (type) {
      case "meta":
        return "Metadata"
      case "bundle":
        return "Bundle"
      case "volume":
        return "Volume"
      case "trade":
        return "Trade"
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  // Get badge color based on task type
  const getTaskTypeBadgeColor = (type: string) => {
    switch (type) {
      case "meta":
        return "bg-blue-900 text-blue-200"
      case "bundle":
        return "bg-amber-900 text-amber-200"
      case "volume":
        return "bg-green-900 text-green-200"
      case "trade":
        return "bg-purple-900 text-purple-200"
      default:
        return "bg-gray-800 text-gray-200"
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-2 mb-2 px-2">
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
            filter === "volume" ? "bg-green-700 hover:bg-green-600" : "bg-gray-800 hover:bg-gray-700",
          )}
          onClick={() => setFilter("volume")}
        >
          Volume
        </Badge> 
      </div>

      <ScrollArea className="h-full w-full p-3 bg-[#12131f]" ref={scrollAreaRef}>
        <div className="space-y-1">
          {filteredLogs.length === 0 ? (
            <div className="text-xs text-gray-400 italic">No activity logs yet. Start a task to generate logs.</div>
          ) : (
            filteredLogs.map((log, index) => (
              <div key={index} className="text-xs flex items-start">
                <span className="text-gray-400 mr-2 whitespace-nowrap">[{log.timestamp}]</span>
                <Badge
                  className={cn("mr-2 px-1.5 py-0.5 text-[10px] font-normal", getTaskTypeBadgeColor(log.taskType))}
                >
                  {getTaskTypeLabel(log.taskType)}
                </Badge>
                <span className="text-gray-200">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
