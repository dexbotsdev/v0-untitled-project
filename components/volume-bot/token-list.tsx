"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface VolumeTokenListProps {
  tokens: any[]
  selectedTokenId: string | null
  onSelectToken: (token: any) => void
  onAddToken: () => void
  isLoading: boolean
}

export function VolumeTokenList({
  tokens,
  selectedTokenId,
  onSelectToken,
  onAddToken,
  isLoading,
}: VolumeTokenListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col h-full">
 <div className="flex items-center justify-between p-2 m-3 rounded-lg text-[10px] bg-[#11111D]">        
   <h2 className="text-sm font-medium text-[#ECF1F0]">Volume Bots</h2>
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 bg-amber-700 hover:bg-amber-600 rounded-full"
          onClick={onAddToken}
        >
          <Plus className="h-3.5 w-3.5 text-white" />
        </Button> 
      </div>

      <div className="p-3">
        <div className="relative">
          <Input
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-gray-900/50 border-gray-800"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-3 rounded-md flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))
          ) : filteredTokens.length > 0 ? (
            filteredTokens.map((token) => (
              <button
                key={token.id}
                className={`w-full p-3 rounded-md flex items-center space-x-3 text-left transition-colors ${
                  selectedTokenId === token.id ? "bg-amber-500/10 text-amber-500" : "hover:bg-gray-800/50"
                }`}
                onClick={() => onSelectToken(token)}
              >
                <img src={token.logo || "/placeholder.svg"} alt={token.symbol} className="h-10 w-10 rounded-full" />
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">{token.symbol}</span>
                    <Badge
                      variant={token.status === "active" ? "default" : "secondary"}
                      className={`ml-2 ${
                        token.status === "active"
                          ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                          : "bg-gray-700/50 text-gray-400 hover:bg-gray-700/50"
                      }`}
                    >
                      {token.status === "active" ? "Active" : "Paused"}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-400 flex items-center">
                    <span>Progress: {token.progress}%</span>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No volume bots found</p>
              <p className="text-sm mt-1">Create a new volume bot to get started</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={onAddToken}>
                <Plus className="mr-1 h-4 w-4" />
                Create Volume Bot
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
