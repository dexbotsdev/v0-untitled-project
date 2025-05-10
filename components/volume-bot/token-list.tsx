"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Copy, Trash2, Loader2, MoreVertical, AlertTriangle, CoinsIcon as CoinIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

interface VolumeTokenListProps {
  tokens: any[]
  selectedTokenId: string | null
  onSelectToken: (token: any) => void
  onAddToken: () => void
  onDuplicateToken: (token: any) => void
  onDeleteToken: (token: any) => void
  isLoading: boolean
  anyBotRunning?: boolean
}

export function VolumeTokenList({
  tokens,
  selectedTokenId,
  onSelectToken,
  onAddToken,
  onDuplicateToken,
  onDeleteToken,
  isLoading,
  anyBotRunning = false,
}: VolumeTokenListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-lg font-medium">Tokens</h2>
        <Button variant="outline" size="sm" onClick={onAddToken}>
          <Plus className="mr-1 h-4 w-4" />
          Add Token
        </Button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : tokens.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-gray-500">
          <CoinIcon className="h-12 w-12 mb-4 opacity-20" />
          <p className="text-center">No tokens added yet</p>
          <Button variant="outline" className="mt-4" onClick={onAddToken}>
            Add Your First Token
          </Button>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          {tokens.map((token) => (
            <div
              key={token.id}
              className={`p-3 border-b border-gray-800 cursor-pointer hover:bg-gray-900 transition-colors ${
                selectedTokenId === token.id ? "bg-gray-900" : ""
              }`}
              onClick={() => onSelectToken(token)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={token.logo || "/placeholder.svg"} alt={token.symbol} className="w-8 h-8 rounded-full" />
                  <div>
                    <h3 className="font-medium">
                      {token.name} ({token.symbol})
                    </h3>
                    <div className="flex items-center text-sm text-gray-400">
                      <span>Progress: {token.progress}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {token.status === "active" && (
                    <Badge variant="success" className="mr-2">
                      Active
                    </Badge>
                  )}
                  {token.status === "paused" && (
                    <Badge variant="outline" className="mr-2">
                      Paused
                    </Badge>
                  )}
                  {token.status === "stopped" && (
                    <Badge variant="destructive" className="mr-2">
                      Stopped
                    </Badge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onDuplicateToken(token)
                        }}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteToken(token)
                        }}
                        className="text-red-500 focus:text-red-500"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="mt-2">
                <Progress value={token.progress} className="h-1" />
              </div>
              {token.status === "paused" && anyBotRunning && selectedTokenId === token.id && (
                <div className="mt-2 text-xs text-amber-500">
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                  Another bot is currently running. Stop it first to start this one.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
