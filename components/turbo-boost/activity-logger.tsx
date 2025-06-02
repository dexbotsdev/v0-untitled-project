"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface LogEntry {
  id: string
  timestamp: Date
  message: string
  type: "info" | "success" | "warning" | "error"
  data?: any
}

interface ActivityLoggerProps {
  botId: string
  isActive: boolean
  className?: string
  maxHeight?: string
}

export function ActivityLogger({ botId, isActive, className = "", maxHeight = "200px" }: ActivityLoggerProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  // Simulate WebSocket connection for real-time logs
  useEffect(() => {
    if (isActive) {
      // Add initial log
      addLog("Bot activated", "success")

      // Simulate WebSocket connection
      const mockServerLogs = [
        { msg: "Connecting to trading network...", type: "info" as const },
        { msg: "Trading wallet verified", type: "success" as const },
        { msg: "Checking token contract...", type: "info" as const },
        { msg: "Token contract verified", type: "success" as const },
        { msg: "Initializing trading sequence", type: "info" as const },
        { msg: "Selecting wallets for batch #1", type: "info" as const },
      ]

      // Add initial connection logs in sequence
      let index = 0
      const initialLogsInterval = setInterval(() => {
        if (index < mockServerLogs.length) {
          addLog(mockServerLogs[index].msg, mockServerLogs[index].type)
          index++
        } else {
          clearInterval(initialLogsInterval)

          // Start regular trading logs
          startTradingLogs()
        }
      }, 800)

      return () => {
        clearInterval(initialLogsInterval)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
        if (wsRef.current) {
          wsRef.current.close()
        }
      }
    } else {
      // Clear intervals when bot is not active
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      // Add paused log if there are existing logs
      if (logs.length > 0) {
        addLog("Bot operation paused", "warning")
      }
    }
  }, [isActive, botId])

  // Start generating trading logs
  const startTradingLogs = () => {
    // Generate random logs periodically to simulate server responses
    intervalRef.current = setInterval(() => {
      const tradeActions = [
        {
          msg: "Preparing trade with wallet W{walletId}",
          type: "info" as const,
          followUp: {
            msg: "Trade executed: {amount}M {tokenSymbol} @ ${price}",
            type: "success" as const,
            delay: 1200,
          },
        },
        {
          msg: "Network congestion detected, optimizing gas...",
          type: "warning" as const,
          followUp: {
            msg: "Transaction submitted with adjusted gas",
            type: "success" as const,
            delay: 1500,
          },
        },
        {
          msg: "Interval complete, processed {count} trades",
          type: "info" as const,
        },
        {
          msg: "Wallet W{walletId} funded with {solAmount} SOL",
          type: "success" as const,
        },
        {
          msg: "Volume milestone reached: ${volume}",
          type: "success" as const,
        },
        {
          msg: "Switching to next wallet batch",
          type: "info" as const,
        },
      ]

      // Select a random action
      const actionIndex = Math.floor(Math.random() * tradeActions.length)
      const action = tradeActions[actionIndex]

      // Generate random values for placeholders
      const walletId = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")
      const amount = (Math.random() * 2.5).toFixed(2)
      const price = (Math.random() * 0.0000001).toFixed(10)
      const count = Math.floor(Math.random() * 3) + 2
      const solAmount = "0.006"
      const volume = (Math.random() * 1000 + 500).toFixed(2)
      const tokenSymbol = "TOKEN"

      // Replace placeholders in the message
      const message = action.msg
        .replace("{walletId}", walletId)
        .replace("{amount}", amount)
        .replace("{price}", price)
        .replace("{count}", count.toString())
        .replace("{solAmount}", solAmount)
        .replace("{volume}", volume)
        .replace("{tokenSymbol}", tokenSymbol)

      // Add the log
      addLog(message, action.type)

      // Add follow-up message if exists
      if (action.followUp) {
        setTimeout(() => {
          const followUpMsg = action.followUp.msg
            .replace("{walletId}", walletId)
            .replace("{amount}", amount)
            .replace("{price}", price)
            .replace("{count}", count.toString())
            .replace("{solAmount}", solAmount)
            .replace("{volume}", volume)
            .replace("{tokenSymbol}", tokenSymbol)

          addLog(followUpMsg, action.followUp.type)
        }, action.followUp.delay || 1000)
      }
    }, 3000) // Add a new log every 3 seconds
  }

  // Add a log entry
  const addLog = (message: string, type: LogEntry["type"] = "info") => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      message,
      type,
    }
    setLogs((prev) => [newLog, ...prev].slice(0, 100)) // Keep only the latest 100 logs
  }

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  return (
    <Card className={`border-gray-800 bg-gray-900/30 ${className}`}>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400 flex items-center justify-between">
          <span>Activity Log</span>
          <Badge
            className={
              isActive
                ? "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                : "bg-gray-600/20 text-gray-400 hover:bg-gray-600/30"
            }
          >
            {isActive ? "Live" : "Inactive"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className={`h-[${maxHeight}] w-full`} ref={scrollAreaRef}>
          <div className="p-4 pt-0">
            {logs.length === 0 ? (
              <div className="text-xs text-gray-500 py-4 text-center">No activity recorded yet</div>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="text-xs flex items-start">
                    <div className="text-gray-500 min-w-[70px]">{formatTime(log.timestamp)}</div>
                    <div
                      className={`flex-1 ${
                        log.type === "success"
                          ? "text-green-400"
                          : log.type === "warning"
                            ? "text-amber-400"
                            : log.type === "error"
                              ? "text-red-400"
                              : "text-gray-300"
                      }`}
                    >
                      {log.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
