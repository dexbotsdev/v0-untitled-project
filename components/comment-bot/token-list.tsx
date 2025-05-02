"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Pause } from "lucide-react"

interface TokenListProps {
  tokens: any[]
  selectedTokenId: string | null
  onSelectToken: (token: any) => void
  onToggleStatus: (tokenId: string) => void
}

export function TokenList({ tokens, selectedTokenId, onSelectToken, onToggleStatus }: TokenListProps) {
  const [hoveredTokenId, setHoveredTokenId] = useState<string | null>(null)

  // Format time ago
  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((new Date().getTime() - timestamp) / 1000)

    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  // Get bot type label
  const getBotTypeLabel = (type: string) => {
    switch (type) {
      case "random":
        return "Random"
      case "shill":
        return "Shill"
      case "koth":
        return "KOTH"
      case "spam":
        return "Spam"
      default:
        return "Bot"
    }
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-2">
        {tokens.map((token) => (
          <div
            key={token.id}
            className={`relative rounded-md p-3 mb-2 cursor-pointer transition-all duration-200 ${
              selectedTokenId === token.id
                ? "bg-amber-900/20 border border-amber-800/50"
                : "hover:bg-gray-800/50 border border-transparent"
            }`}
            onClick={() => onSelectToken(token)}
            onMouseEnter={() => setHoveredTokenId(token.id)}
            onMouseLeave={() => setHoveredTokenId(null)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    token.status === "active" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                />
                <span className="font-medium text-white">{token.symbol}</span>
              </div>

              <div
                className={`transition-opacity duration-200 ${
                  hoveredTokenId === token.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleStatus(token.id)
                  }}
                >
                  {token.status === "active" ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </Button>
              </div>
            </div>

            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs text-gray-400">{getBotTypeLabel(token.botType)}</span>
              <span className="text-xs text-gray-500">{formatTimeAgo(token.lastActive)}</span>
            </div>

            <div className="mt-1 text-xs text-gray-500 truncate" title={token.address}>
              {token.address.substring(0, 6)}...{token.address.substring(token.address.length - 4)}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
