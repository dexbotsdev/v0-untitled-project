"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Play, Square } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export interface TaskLog {
  timestamp: string
  message: string
}

export interface TaskItemProps {
  id: string
  title: string
  type: "meta" | "bundle" | "volume" | "trade"
  initialRunningState?: boolean
  initialLogs?: TaskLog[]
  onStart: () => void
  onStop: (logs: TaskLog[]) => void
  onComplete?: (type: string) => void
}

export function TaskItem({
  id,
  title,
  type,
  initialRunningState = false,
  initialLogs = [],
  onStart,
  onStop,
  onComplete,
}: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isRunning, setIsRunning] = useState(initialRunningState)
  const [logs, setLogs] = useState<TaskLog[]>(initialLogs)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const isInitialMount = useRef(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [logs])

  // Update running state if initialRunningState changes (only on mount or token switch)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    setIsRunning(initialRunningState)
  }, [initialRunningState])

  // Update logs if initialLogs changes (only on mount or token switch)
  useEffect(() => {
    if (initialLogs.length > 0 && isInitialMount.current) {
      setLogs(initialLogs)
    }
  }, [initialLogs])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const addLog = (message: string) => {
    const now = new Date()
    const timestamp = now.toLocaleTimeString()
    setLogs((prevLogs) => [...prevLogs, { timestamp, message }])
  }

  const handleStart = () => {
    setIsRunning(true)
    addLog(`Starting ${title} task...`)

    // Simulate different task types with different log messages
    if (type === "meta") {
      addLog("Fetching token metadata...")

      setTimeout(() => addLog("Analyzing token properties..."), 1000)

      // For Meta task, automatically complete after 3 seconds
      timerRef.current = setTimeout(() => {
        addLog("Token address generated successfully.")
        addLog("Developer wallet assigned.")
        addLog("Metadata task completed.")

        // Auto-stop the task after 3 seconds
        handleStop(true)

        // Notify parent that Meta task is complete
        if (onComplete) {
          onComplete("meta")
        }
      }, 3000)
    } else if (type === "bundle") {
      addLog("Initializing bundle configuration...")
      setTimeout(() => addLog("Setting up wallet connections..."), 1000)
      setTimeout(() => addLog("Preparing bundle parameters..."), 2000)
    } else if (type === "volume") {
      addLog("Starting volume bot...")
      setTimeout(() => addLog("Connecting to liquidity pools..."), 1000)
      setTimeout(() => addLog("Monitoring trading volume..."), 2000)
    } else if (type === "trade") {
      addLog("Initializing trading module...")
      setTimeout(() => addLog("Analyzing market conditions..."), 1000)
      setTimeout(() => addLog("Setting up trading parameters..."), 2000)
    }

    onStart()
  }

  const handleStop = (isAutoStop = false) => {
    // Clear any pending timers
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    setIsRunning(false)

    // Add the final log message
    const now = new Date()
    const timestamp = now.toLocaleTimeString()
    const stopMessage = isAutoStop ? "Task completed automatically." : "Task stopped successfully."

    // Create a new logs array with the stop message
    const updatedLogs = [...logs]

    if (!isAutoStop) {
      updatedLogs.push({ timestamp, message: `Stopping ${title} task...` })
    }

    // Update local state
    setLogs(updatedLogs)

    // After a short delay, add the final message and notify parent
    setTimeout(
      () => {
        const finalTimestamp = new Date().toLocaleTimeString()
        const finalLogs = [...updatedLogs, { timestamp: finalTimestamp, message: stopMessage }]
        setLogs(finalLogs)

        // Only notify parent when stopping to avoid update loops
        onStop(finalLogs)
      },
      isAutoStop ? 0 : 1000,
    )
  }

  return (
    <div className="mb-3 border border-gray-800 rounded-md overflow-hidden bg-[#444A69] shadow-sm">
      <div
        className="flex items-center justify-between p-3 cursor-pointer bg-[#444A69]"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <div className="mr-2">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
          <div>
            <h3 className="text-sm font-medium">{title}</h3>
            <p className="text-xs opacity-70">Task ID: {id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={cn(
              "px-2 py-1 text-[10px] rounded-full",
              isRunning ? "bg-green-900/30 text-green-400" : "bg-gray-800/30 text-gray-400",
            )}
          >
            {isRunning ? "Running" : "Stopped"}
          </div>
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "h-7 w-7 p-0",
              isRunning
                ? "text-red-400 hover:text-red-300 hover:bg-red-900/20"
                : "text-green-400 hover:text-green-300 hover:bg-green-900/20",
            )}
            onClick={(e) => {
              e.stopPropagation()
              isRunning ? handleStop() : handleStart()
            }}
          >
            {isRunning ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-800">
          <ScrollArea className="h-[200px] w-full p-3 bg-[#12131f]" ref={scrollAreaRef}>
            <div className="space-y-1">
              {logs.length === 0 ? (
                <div className="text-xs text-gray-400 italic">No activity logs yet. Click Start to begin.</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="text-xs">
                    <span className="text-gray-400">[{log.timestamp}]</span> {log.message}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
