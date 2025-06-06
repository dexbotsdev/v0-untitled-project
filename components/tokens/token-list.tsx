"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Plus, Edit2, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { AddTokenDialog, type TokenFormData } from "@/components/tokens/add-token-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TokenListProps {
  onSelectToken: (token: Token) => void
  className?: string
  externalTokens?: Token[]
}

// Update the Token interface to use tokenType instead of platform
export interface Token {
  id: number
  name: string
  symbol: string
  address: string
  isActive: boolean
  tokenType: string
  description?: string
  telegramUrl?: string
  twitterUrl?: string
  websiteUrl?: string
  image?: string | null
  hasRunningTasks?: boolean
}

export function TokenList({ onSelectToken, className, externalTokens }: TokenListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [tokenToEdit, setTokenToEdit] = useState<Token | null>(null)
  const [tokenToDelete, setTokenToDelete] = useState<Token | null>(null)
  // Update the mock tokens data to use tokenType instead of platform
  const [tokens, setTokens] = useState<Token[]>([
    {
      id: 1,
      name: "Solana",
      symbol: "SOL",
      address: "0x1234567890123456789012345678901234567890",
      isActive: true,
      tokenType: "spl",
      description: "Solana is a high-performance blockchain supporting builders around the world.",
      telegramUrl: "https://t.me/solana",
      twitterUrl: "https://twitter.com/solana",
      websiteUrl: "https://solana.com",
      image: null,
      hasRunningTasks: false,
    },
    {
      id: 2,
      name: "Ethereum",
      symbol: "ETH",
      address: "",
      isActive: false,
      tokenType: "token-2022",
      description: "Ethereum is a decentralized, open-source blockchain with smart contract functionality.",
      telegramUrl: "https://t.me/ethereum",
      twitterUrl: "https://twitter.com/ethereum",
      websiteUrl: "https://ethereum.org",
      image: null,
      hasRunningTasks: false,
    },
    {
      id: 3,
      name: "Binance Coin",
      symbol: "BNB",
      address: "0xABCDEF1234567890ABCDEF1234567890ABCDEF12",
      isActive: true,
      tokenType: "spl",
      description: "Binance Coin is the cryptocurrency issued by the Binance exchange.",
      telegramUrl: "https://t.me/binance",
      twitterUrl: "https://twitter.com/binance",
      websiteUrl: "https://binance.com",
      image: null,
      hasRunningTasks: false,
    },
    {
      id: 4,
      name: "Cardano",
      symbol: "ADA",
      address: "",
      isActive: true,
      tokenType: "token-2022",
      description: "Cardano is a proof-of-stake blockchain platform.",
      telegramUrl: "https://t.me/cardano",
      twitterUrl: "https://twitter.com/cardano",
      websiteUrl: "https://cardano.org",
      image: null,
      hasRunningTasks: false,
    },
    {
      id: 5,
      name: "Polkadot",
      symbol: "DOT",
      address: "",
      isActive: false,
      tokenType: "spl",
      description: "Polkadot is a sharded heterogeneous multi-chain architecture.",
      telegramUrl: "https://t.me/polkadot",
      twitterUrl: "https://twitter.com/polkadot",
      websiteUrl: "https://polkadot.network",
      image: null,
      hasRunningTasks: false,
    },
  ])

  // Update tokens if external tokens are provided
  useEffect(() => {
    if (externalTokens && externalTokens.length > 0) {
      // Merge external tokens with existing tokens, avoiding duplicates by ID
      const existingIds = tokens.map((t) => t.id)
      const newTokens = externalTokens.filter((t) => !existingIds.includes(t.id))

      if (newTokens.length > 0) {
        setTokens((prev) => [...prev, ...newTokens])
      }
    }
  }, [externalTokens])

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectToken = (token: Token) => {
    setSelectedTokenId(token.id)
    onSelectToken(token)
  }

  // Update the handleAddToken function to use tokenType
  const handleAddToken = (tokenData: TokenFormData) => {
    const newToken: Token = {
      id: tokens.length + 1,
      name: tokenData.name,
      symbol: tokenData.symbol,
      address: tokenData.hasAddress ? tokenData.address || "" : "",
      isActive: true,
      tokenType: tokenData.tokenType,
      description: tokenData.description,
      telegramUrl: tokenData.telegramUrl,
      twitterUrl: tokenData.twitterUrl,
      websiteUrl: tokenData.websiteUrl,
      image: tokenData.image,
      hasRunningTasks: false,
    }

    setTokens([...tokens, newToken])
    setIsAddDialogOpen(false)
  }

  // Update the handleEditToken function to use tokenType
  const handleEditToken = (tokenData: TokenFormData) => {
    if (!tokenToEdit) return

    const updatedTokens = tokens.map((token) => {
      if (token.id === tokenToEdit.id) {
        return {
          ...token,
          name: tokenData.name,
          symbol: tokenData.symbol,
          address: tokenData.hasAddress ? tokenData.address || "" : "",
          tokenType: tokenData.tokenType,
          description: tokenData.description,
          telegramUrl: tokenData.telegramUrl,
          twitterUrl: tokenData.twitterUrl,
          websiteUrl: tokenData.websiteUrl,
          image: tokenData.image,
        }
      }
      return token
    })

    setTokens(updatedTokens)
    setIsEditDialogOpen(false)
    setTokenToEdit(null)

    // If the edited token was selected, update the selected token
    if (selectedTokenId === tokenToEdit.id) {
      const updatedToken = updatedTokens.find((t) => t.id === tokenToEdit.id)
      if (updatedToken) {
        onSelectToken(updatedToken)
      }
    }
  }

  const handleDeleteToken = () => {
    if (!tokenToDelete) return

    const updatedTokens = tokens.filter((token) => token.id !== tokenToDelete.id)
    setTokens(updatedTokens)
    setIsDeleteDialogOpen(false)
    setTokenToDelete(null)

    // If the deleted token was selected, clear the selection
    if (selectedTokenId === tokenToDelete.id) {
      setSelectedTokenId(null)
    }
  }

  const openEditDialog = (token: Token, e: React.MouseEvent) => {
    e.stopPropagation()
    setTokenToEdit(token)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (token: Token, e: React.MouseEvent) => {
    e.stopPropagation()
    setTokenToDelete(token)
    setIsDeleteDialogOpen(true)
  }

  // Check if a token can be edited or deleted
  const canModifyToken = (token: Token) => {
    return !token.address || !token.hasRunningTasks
  }

  // Update the tokenToFormData function to use tokenType
  const tokenToFormData = (token: Token): TokenFormData => {
    return {
      name: token.name,
      symbol: token.symbol,
      address: token.address,
      hasAddress: !!token.address,
      tokenType: token.tokenType,
      description: token.description || "",
      telegramUrl: token.telegramUrl || "",
      twitterUrl: token.twitterUrl || "",
      websiteUrl: token.websiteUrl || "",
      image: token.image,
    }
  }

  // Update the getTokenTypeLabel function (previously getPlatformLabel)
  const getTokenTypeLabel = (tokenTypeId: string): string => {
    const tokenTypeMap: Record<string, string> = {
      spl: "SPL Token",
      "token-2022": "Token 2022",
    }
    return tokenTypeMap[tokenTypeId] || tokenTypeId
  }

  return (
    <div className={cn("flex flex-col h-full bg-black w-full md:w-1/4", className)}>
      <div className="flex items-center justify-between p-2 m-3 rounded-lg text-[10px] bg-[#11111D]">
        <h2 className="text-sm font-medium text-[#ECF1F0]">My Tokens</h2>
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 bg-amber-700 hover:bg-amber-600 rounded-full"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-3.5 w-3.5 text-white" />
        </Button>
      </div>

      <div className="p-3 border-b border-gray-800">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8  bg-[#11111D] border-gray-800 text-[#ECF1F0] text-sm"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 max-h-screen">
        <div className="p-1">
          {filteredTokens.length === 0 ? (
            <div className="text-center py-4 text-gray-400 text-sm">
              No tokens found. Add a new token to get started.
            </div>
          ) : (
            filteredTokens.map((token) => (
              <div
                key={token.id}
                className={cn(
                  "flex items-center p-3 rounded-md cursor-pointer mb-1 hover:bg-gray-800/30 group",
                  selectedTokenId === token.id ? "bg-gray-800/50" : "",
                )}
                onClick={() => handleSelectToken(token)}
              >
                <Checkbox
                  checked={selectedTokenId === token.id}
                  className="mr-3 data-[state=checked]:bg-amber-700 data-[state=checked]:border-amber-800"
                  onCheckedChange={() => handleSelectToken(token)}
                />
                {token.image ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-3 border border-gray-700">
                    <img
                      src={token.image || "/placeholder.svg"}
                      alt={token.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-green flex items-center justify-center mr-3">
                    <span className="text-xs font-bold text-white">{token.symbol.substring(0, 2)}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#ECF1F0] truncate">{token.name}</p>
                    <div className="flex items-center space-x-1">
                      <div className={cn("w-2 h-2 rounded-full", token.isActive ? "bg-amber-700" : "bg-red-500")} />
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "h-6 w-6 p-0",
                                  canModifyToken(token)
                                    ? "text-amber-500 hover:text-amber-400 hover:bg-amber-900/20"
                                    : "text-gray-600 cursor-not-allowed",
                                )}
                                onClick={(e) => canModifyToken(token) && openEditDialog(token, e)}
                                disabled={!canModifyToken(token)}
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-stone-800 text-stone-200 border-stone-700 text-xs">
                              {canModifyToken(token)
                                ? "Edit token"
                                : "Cannot edit token with address and running tasks"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "h-6 w-6 p-0",
                                  canModifyToken(token)
                                    ? "text-red-500 hover:text-red-400 hover:bg-red-900/20"
                                    : "text-gray-600 cursor-not-allowed",
                                )}
                                onClick={(e) => canModifyToken(token) && openDeleteDialog(token, e)}
                                disabled={!canModifyToken(token)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-stone-800 text-stone-200 border-stone-700 text-xs">
                              {canModifyToken(token)
                                ? "Delete token"
                                : "Cannot delete token with address and running tasks"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 truncate">
                      {token.symbol}
                      {token.address && (
                        <span className="ml-1 text-amber-400 text-[10px]">
                          ({token.address.substring(0, 4)}...{token.address.substring(token.address.length - 4)})
                        </span>
                      )}
                    </p>
                    {/* Update the token list display to show token type */}
                    <span className="text-[8px] px-1.5 py-0.5 bg-gray-600 rounded text-gray-300">
                      {getTokenTypeLabel(token.tokenType)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Add Token Dialog */}
      <AddTokenDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSave={handleAddToken} />

      {/* Edit Token Dialog */}
      {tokenToEdit && (
        <AddTokenDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleEditToken}
          initialData={tokenToFormData(tokenToEdit)}
          isEditing={true}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#11111D] border-gray-800 text-[#ECF1F0]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#ECF1F0]">Delete Token</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete {tokenToDelete?.name} ({tokenToDelete?.symbol})? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-gray-700 text-[#ECF1F0] hover:bg-gray-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="gradient-green" onClick={handleDeleteToken}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
