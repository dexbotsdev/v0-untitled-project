"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Package, CheckCircle, AlertCircle, Clock, Zap } from "lucide-react"

interface ActivityLoggerProps {
  botId: string
  isActive: boolean
  maxHeight?: string
}

interface LogEntry {
  id: string
  timestamp: Date
  type: "info" | "success" | "warning" | "error"
  message: string
  details?: string
}

export function ActivityLogger({ botId, isActive, maxHeight = "400px" }: ActivityLoggerProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(
      () => {
        const logTypes = ["info", "success", "warning"] as const
        const messages = [
          "Bundle group prepared with 5 transactions",
          "Bundle submitted to Jito block engine",
          "Bundle confirmed in block #245,123,456",
          "Bundle execution completed successfully",
          "Wallet rotation initiated for next bundle",
          "MEV protection enabled for bundle",
          "Bundle priority fee optimized",
          "Transaction bundle landed in slot",
          "Bundle efficiency: 98.5% success rate",
          "Next bundle scheduled in 10 seconds",
        ]

        const newLog: LogEntry = {
          id: Date.now().toString(),
          timestamp: new Date(),
          type: logTypes[Math.floor(Math.random() * logTypes.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
        }

        setLogs((prev) => [newLog, ...prev.slice(0, 49)]) // Keep last 50 logs
      },
      2000 + Math.random() * 3000,
    ) // Random interval between 2-5 seconds

    return () => clearInterval(interval)
  }, [isActive])

  const getIcon = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-3 w-3 text-green-400" />
      case "warning":
        return <AlertCircle className="h-3 w-3 text-amber-400" />
      case "error":
        return <AlertCircle className="h-3 w-3 text-red-400" />
      default:
        return <Package className="h-3 w-3 text-blue-400" />
    }
  }

  const getBadgeColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-600/20 text-green-400 hover:bg-green-600/30"
      case "warning":
        return "bg-amber-600/20 text-amber-400 hover:bg-amber-600/30"
      case "error":
        return "bg-red-600/20 text-red-400 hover:bg-red-600/30"
      default:
        return "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
    }
  }

  return (
    <Card className="border-gray-800 bg-gray-950">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <Zap className="mr-2 h-4 w-4 text-blue-500" />
              Bundle Activity Log
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">Real-time bundle execution updates</CardDescription>
          </div>
          <Badge
            className={`${
              isActive
                ? "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                : "bg-gray-600/20 text-gray-400 hover:bg-gray-600/30"
            }`}
          >
            {isActive ? "Live" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ScrollArea className="w-full" style={{ height: maxHeight }}>
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <Package className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No bundle activity yet</p>
              <p className="text-xs">Start the bot to see live updates</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start space-x-2 p-2 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">{getIcon(log.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-300 truncate">{log.message}</p>
                      <Badge className={`ml-2 text-xs ${getBadgeColor(log.type)}`}>{log.type}</Badge>
                    </div>
                    <div className="flex items-center mt-1">
                      <Clock className="h-3 w-3 text-gray-500 mr-1" />
                      <span className="text-xs text-gray-500">{log.timestamp.toLocaleTimeString()}</span>
                    </div>
                    {log.details && <p className="text-xs text-gray-400 mt-1 truncate">{log.details}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
