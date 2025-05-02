"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function SolanaStatusBadges() {
  const [solPrice, setSolPrice] = useState(103.42)
  const [priceChange, setPriceChange] = useState(2.34)
  const [priorityLevel, setPriorityLevel] = useState("Medium")
  const [priorityFee, setPriorityFee] = useState(0.000005)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Random price fluctuation between -1% and +1%
      const fluctuation = (Math.random() * 2 - 1) * solPrice * 0.01
      const newPrice = solPrice + fluctuation
      setSolPrice(newPrice)

      // Update price change (between -5% and +5%)
      const newChange = priceChange + (Math.random() * 0.4 - 0.2)
      setPriceChange(Math.min(Math.max(newChange, -5), 5))

      // Randomly update priority levels
      if (Math.random() > 0.7) {
        const levels = ["Low", "Medium", "High", "Urgent"]
        const newLevel = levels[Math.floor(Math.random() * levels.length)]
        setPriorityLevel(newLevel)

        // Set fee based on level
        const fees = {
          Low: 0.000001,
          Medium: 0.000005,
          High: 0.00001,
          Urgent: 0.00005,
        }
        setPriorityFee(fees[newLevel as keyof typeof fees])
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [solPrice, priceChange])

  // Get priority level color
  const getPriorityColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-green-900/60 text-green-300"
      case "Medium":
        return "bg-blue-900/60 text-blue-300"
      case "High":
        return "bg-amber-900/60 text-amber-300"
      case "Urgent":
        return "bg-red-900/60 text-red-300"
      default:
        return "bg-gray-900/60 text-gray-300"
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Solana Price Badge */}
      <Badge
        variant="secondary"
        className="bg-[#11111D] border border-gray-800 text-[12px] rounded-[5px] px-3 py-1 flex items-center"
      >
        <span className="font-medium mr-1.5">SOL:</span>
        <span className="mr-1.5">${solPrice.toFixed(2)}</span>
        <span className={cn("flex items-center text-[10px]", priceChange >= 0 ? "text-green-400" : "text-red-400")}>
          {priceChange >= 0 ? <ArrowUp className="h-3 w-3 mr-0.5" /> : <ArrowDown className="h-3 w-3 mr-0.5" />}
          {Math.abs(priceChange).toFixed(2)}%
        </span>
      </Badge>

      {/* Priority Level Badge */}
      <Badge
        variant="secondary"
        className={cn(
          "border border-gray-800 text-[12px] rounded-[5px] px-3 py-1 flex items-center",
          getPriorityColor(priorityLevel),
        )}
      >
        <span className="font-medium mr-1.5">Priority:</span>
        <span className="mr-1.5">{priorityLevel}</span>
        <span className="text-[10px] opacity-80">{priorityFee.toFixed(6)} SOL</span>
      </Badge>
    </div>
  )
}
