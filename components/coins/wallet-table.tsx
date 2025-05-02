"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, ArrowUpDown, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface Wallet {
  id: number
  address: string
  solBalance: number
  tokenBalance: number
  tradeAmount?: number
}

interface WalletTableProps {
  wallets: Wallet[]
  type: string
  selectedWallets: number[]
  onSelectWallet: (walletId: number, selected: boolean) => void
}

export function WalletTable({ wallets, type, selectedWallets, onSelectWallet }: WalletTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Wallet
    direction: "ascending" | "descending"
  } | null>(null)
  const [selectAll, setSelectAll] = useState(false)
  const [filteredWallets, setFilteredWallets] = useState<Wallet[]>(wallets)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Update filtered wallets when wallets or search query changes
  useEffect(() => {
    const filtered = wallets.filter(
      (wallet) =>
        wallet.address.toLowerCase().includes(searchQuery.toLowerCase()) || wallet.id.toString().includes(searchQuery),
    )
    setFilteredWallets(filtered)
  }, [wallets, searchQuery])

  // Handle sort
  const handleSort = (key: keyof Wallet) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Sort wallets
  const sortedWallets = [...filteredWallets].sort((a, b) => {
    if (!sortConfig) return 0

    const { key, direction } = sortConfig
    if (a[key] < b[key]) {
      return direction === "ascending" ? -1 : 1
    }
    if (a[key] > b[key]) {
      return direction === "ascending" ? 1 : -1
    }
    return 0
  })

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    filteredWallets.forEach((wallet) => {
      onSelectWallet(wallet.id, checked)
    })
  }

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  // Get column label based on type
  const getAmountLabel = () => {
    switch (type) {
      case "bundle":
        return "Bundle Amount"
      case "volume":
        return "Volume Amount"
      case "trade":
        return "Trade Amount"
      default:
        return "Amount"
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 bg-[#11111D] border-b border-gray-800">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search wallets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 bg-[#1A1A1A] border-gray-800 text-[#ECF1F0] text-xs"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-gray-400 hover:text-gray-300"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <Table>
          <TableHeader className="bg-[#11111D] sticky top-0 z-10">
            <TableRow>
              <TableHead className="w-[40px] text-[#ECF1F0]">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  className="data-[state=checked]:bg-amber-700 data-[state=checked]:border-amber-800"
                />
              </TableHead>
              <TableHead className="text-[#ECF1F0]">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("id")}>
                  ID
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-[#ECF1F0]">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("address")}>
                  Wallet Address
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-[#ECF1F0]">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("solBalance")}>
                  SOL Balance
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-[#ECF1F0]">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("tokenBalance")}>
                  Coin Balance
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              {type !== "meta" && (
                <TableHead className="text-[#ECF1F0]">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort("tradeAmount")}>
                    {getAmountLabel()}
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedWallets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={type !== "meta" ? 6 : 5} className="text-center text-gray-400 py-8">
                  No wallets found
                </TableCell>
              </TableRow>
            ) : (
              sortedWallets.map((wallet) => (
                <TableRow key={wallet.id} className="hover:bg-gray-800/30">
                  <TableCell>
                    <Checkbox
                      checked={selectedWallets.includes(wallet.id)}
                      onCheckedChange={(checked) => onSelectWallet(wallet.id, !!checked)}
                      className="data-[state=checked]:bg-amber-700 data-[state=checked]:border-amber-800"
                    />
                  </TableCell>
                  <TableCell className="text-[#ECF1F0] text-xs">{wallet.id}</TableCell>
                  <TableCell className="text-amber-400 text-xs">
                    {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
                  </TableCell>
                  <TableCell className="text-[#ECF1F0] text-xs">{wallet.solBalance.toFixed(3)} SOL</TableCell>
                  <TableCell className="text-[#ECF1F0] text-xs">{wallet.tokenBalance.toLocaleString()} coins</TableCell>
                  {type !== "meta" && wallet.tradeAmount !== undefined && (
                    <TableCell className="text-[#ECF1F0] text-xs">{wallet.tradeAmount.toFixed(2)} SOL</TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}
