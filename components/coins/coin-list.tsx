"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Plus, Edit2, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { AddCoinDialog, type CoinFormData } from "@/components/coins/add-coin-dialog"
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

interface CoinListProps {
  onSelectCoin: (coin: Coin) => void
  className?: string
  externalCoins?: Coin[]
}

// Update the Coin interface to use coinType instead of platform
export interface Coin {
  id: number
  name: string
  symbol: string
  address: string
  isActive: boolean
  coinType: string
  description?: string
  telegramUrl?: string
  twitterUrl?: string
  websiteUrl?: string
  image?: string | null
  hasRunningTasks?: boolean
}

export function CoinList({ onSelectCoin, className, externalCoins }: CoinListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCoinId, setSelectedCoinId] = useState<number | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [coinToEdit, setCoinToEdit] = useState<Coin | null>(null)
  const [coinToDelete, setCoinToDelete] = useState<Coin | null>(null)
  // Update the mock coins data to use coinType instead of platform
  const [coins, setCoins] = useState<Coin[]>([
    {
      id: 1,
      name: "Solana",
      symbol: "SOL",
      address: "0x1234567890123456789012345678901234567890",
      isActive: true,
      coinType: "spl",
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
      coinType: "token-2022",
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
      coinType: "spl",
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
      coinType: "token-2022",
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
      coinType: "spl",
      description: "Polkadot is a sharded heterogeneous multi-chain architecture.",
      telegramUrl: "https://t.me/polkadot",
      twitterUrl: "https://twitter.com/polkadot",
      websiteUrl: "https://polkadot.network",
      image: null,
      hasRunningTasks: false,
    },
  ])

  // Update coins if external coins are provided
  useEffect(() => {
    if (externalCoins && externalCoins.length > 0) {
      // Replace the coins state with external coins
      setCoins(externalCoins)
    }
  }, [externalCoins])

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectCoin = (coin: Coin) => {
    setSelectedCoinId(coin.id)
    onSelectCoin(coin)
  }

  // Update the handleAddCoin function to use coinType
  const handleAddCoin = (coinData: CoinFormData) => {
    const newCoin: Coin = {
      id: coins.length + 1,
      name: coinData.name,
      symbol: coinData.symbol,
      address: coinData.hasAddress ? coinData.address || "" : "",
      isActive: true,
      coinType: coinData.coinType,
      description: coinData.description,
      telegramUrl: coinData.telegramUrl,
      twitterUrl: coinData.twitterUrl,
      websiteUrl: coinData.websiteUrl,
      image: coinData.image,
      hasRunningTasks: false,
    }

    setCoins([...coins, newCoin])
    setIsAddDialogOpen(false)
  }

  // Update the handleEditCoin function to use coinType
  const handleEditCoin = (coinData: CoinFormData) => {
    if (!coinToEdit) return

    const updatedCoins = coins.map((coin) => {
      if (coin.id === coinToEdit.id) {
        return {
          ...coin,
          name: coinData.name,
          symbol: coinData.symbol,
          address: coinData.hasAddress ? coinData.address || "" : "",
          coinType: coinData.coinType,
          description: coinData.description,
          telegramUrl: coinData.telegramUrl,
          twitterUrl: coinData.twitterUrl,
          websiteUrl: coinData.websiteUrl,
          image: coinData.image,
        }
      }
      return coin
    })

    setCoins(updatedCoins)
    setIsEditDialogOpen(false)
    setCoinToEdit(null)

    // If the edited coin was selected, update the selected coin
    if (selectedCoinId === coinToEdit.id) {
      const updatedCoin = updatedCoins.find((t) => t.id === coinToEdit.id)
      if (updatedCoin) {
        onSelectCoin(updatedCoin)
      }
    }
  }

  const handleDeleteCoin = () => {
    if (!coinToDelete) return

    const updatedCoins = coins.filter((coin) => coin.id !== coinToDelete.id)
    setCoins(updatedCoins)
    setIsDeleteDialogOpen(false)
    setCoinToDelete(null)

    // If the deleted coin was selected, clear the selection
    if (selectedCoinId === coinToDelete.id) {
      setSelectedCoinId(null)
    }
  }

  const openEditDialog = (coin: Coin, e: React.MouseEvent) => {
    e.stopPropagation()
    setCoinToEdit(coin)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (coin: Coin, e: React.MouseEvent) => {
    e.stopPropagation()
    setCoinToDelete(coin)
    setIsDeleteDialogOpen(true)
  }

  // Check if a coin can be edited or deleted
  const canModifyCoin = (coin: Coin) => {
    return !coin.address || !coin.hasRunningTasks
  }

  // Update the coinToFormData function to use coinType
  const coinToFormData = (coin: Coin): CoinFormData => {
    return {
      name: coin.name,
      symbol: coin.symbol,
      address: coin.address,
      hasAddress: !!coin.address,
      coinType: coin.coinType,
      description: coin.description || "",
      telegramUrl: coin.telegramUrl || "",
      twitterUrl: coin.twitterUrl || "",
      websiteUrl: coin.websiteUrl || "",
      image: coin.image,
    }
  }

  // Update the getCoinTypeLabel function (previously getPlatformLabel)
  const getCoinTypeLabel = (coinTypeId: string): string => {
    const coinTypeMap: Record<string, string> = {
      spl: "SPL Coin",
      "token-2022": "Coin 2022",
    }
    return coinTypeMap[coinTypeId] || coinTypeId
  }

  return (
    <div className={cn("flex flex-col h-full bg-black w-full md:w-1/4", className)}>
      <div className="flex items-center justify-between p-2 m-3 rounded-lg text-[10px] bg-[#11111D]">
        <h2 className="text-sm font-medium text-[#ECF1F0]">My Coins</h2>
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
            placeholder="Search coins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8  bg-[#11111D] border-gray-800 text-[#ECF1F0] text-sm"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 max-h-screen">
        <div className="p-1">
          {filteredCoins.length === 0 ? (
            <div className="text-center py-4 text-gray-400 text-sm">No coins found. Add a new coin to get started.</div>
          ) : (
            filteredCoins.map((coin) => (
              <div
                key={coin.id}
                className={cn(
                  "flex items-center p-3 rounded-md cursor-pointer mb-1 hover:bg-gray-800/30 group",
                  selectedCoinId === coin.id ? "bg-gray-800/50" : "",
                )}
                onClick={() => handleSelectCoin(coin)}
              >
                <Checkbox
                  checked={selectedCoinId === coin.id}
                  className="mr-3 data-[state=checked]:bg-amber-700 data-[state=checked]:border-amber-800"
                  onCheckedChange={() => handleSelectCoin(coin)}
                />
                {coin.image ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-3 border border-gray-700">
                    <img
                      src={coin.image || "/placeholder.svg"}
                      alt={coin.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-green flex items-center justify-center mr-3">
                    <span className="text-xs font-bold text-white">{coin.symbol.substring(0, 2)}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#ECF1F0] truncate">{coin.name}</p>
                    <div className="flex items-center space-x-1">
                      <div className={cn("w-2 h-2 rounded-full", coin.isActive ? "bg-amber-700" : "bg-red-500")} />
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "h-6 w-6 p-0",
                                  canModifyCoin(coin)
                                    ? "text-amber-500 hover:text-amber-400 hover:bg-amber-900/20"
                                    : "text-gray-600 cursor-not-allowed",
                                )}
                                onClick={(e) => canModifyCoin(coin) && openEditDialog(coin, e)}
                                disabled={!canModifyCoin(coin)}
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-stone-800 text-stone-200 border-stone-700 text-xs">
                              {canModifyCoin(coin) ? "Edit coin" : "Cannot edit coin with address and running tasks"}
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
                                  canModifyCoin(coin)
                                    ? "text-red-500 hover:text-red-400 hover:bg-red-900/20"
                                    : "text-gray-600 cursor-not-allowed",
                                )}
                                onClick={(e) => canModifyCoin(coin) && openDeleteDialog(coin, e)}
                                disabled={!canModifyCoin(coin)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-stone-800 text-stone-200 border-stone-700 text-xs">
                              {canModifyCoin(coin)
                                ? "Delete coin"
                                : "Cannot delete coin with address and running tasks"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 truncate">
                      {coin.symbol}
                      {coin.address && (
                        <span className="ml-1 text-amber-400 text-[10px]">
                          ({coin.address.substring(0, 4)}...{coin.address.substring(coin.address.length - 4)})
                        </span>
                      )}
                    </p>
                    {/* Update the coin list display to show coin type */}
                    <span className="text-[8px] px-1.5 py-0.5 bg-gray-600 rounded text-gray-300">
                      {getCoinTypeLabel(coin.coinType)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Add Coin Dialog */}
      <AddCoinDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSave={handleAddCoin} />

      {/* Edit Coin Dialog */}
      {coinToEdit && (
        <AddCoinDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleEditCoin}
          initialData={coinToFormData(coinToEdit)}
          isEditing={true}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#11111D] border-gray-800 text-[#ECF1F0]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#ECF1F0]">Delete Coin</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete {coinToDelete?.name} ({coinToDelete?.symbol})? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-gray-700 text-[#ECF1F0] hover:bg-gray-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="gradient-green" onClick={handleDeleteCoin}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
