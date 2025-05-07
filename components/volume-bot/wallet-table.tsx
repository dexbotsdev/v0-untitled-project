"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowUpDown, RefreshCw, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface WalletTableProps {
  wallets: any[]
  isLoading: boolean
  isBotActive: boolean
  selectAll: boolean
  onSelectAll: (checked: boolean) => void
  onSelectWallet: (id: string, checked: boolean) => void
  onDeleteWallets: () => void
}

export function WalletTable({
  wallets,
  isLoading,
  isBotActive,
  selectAll,
  onSelectAll,
  onSelectWallet,
  onDeleteWallets,
}: WalletTableProps) {
  const [sortField, setSortField] = useState<string>("tradesCount")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const sortedWallets = [...wallets].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1
    } else {
      return a[sortField] < b[sortField] ? 1 : -1
    }
  })

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-800 flex justify-between items-center">
        <h3 className="font-medium">Bot Wallets</h3>
        <div className="flex items-center space-x-2">
          <Badge
            variant={isBotActive ? "default" : "secondary"}
            className={isBotActive ? "bg-green-500/20 text-green-400" : "bg-gray-700"}
          >
            {isBotActive ? "Active" : "Paused"}
          </Badge>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <RefreshCw className="h-4 w-4" />
          </Button> 
        </div>
      </div>

      <ScrollArea className="flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px] text-center">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={(checked) => onSelectAll(checked === true)}
                  className="data-[state=checked]:bg-amber-700 data-[state=checked]:border-amber-800"
                />
              </TableHead>
              <TableHead className="w-[180px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("address")}
                  className="h-8 font-medium flex items-center"
                >
                  Wallet Address
                  {sortField === "address" && <ArrowUpDown className="ml-2 h-3 w-3" />}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("tokenBalance")}
                  className="h-8 font-medium flex items-center"
                >
                  Token Balance
                  {sortField === "tokenBalance" && <ArrowUpDown className="ml-2 h-3 w-3" />}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("solBalance")}
                  className="h-8 font-medium flex items-center"
                >
                  SOL Balance
                  {sortField === "solBalance" && <ArrowUpDown className="ml-2 h-3 w-3" />}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("tradesCount")}
                  className="h-8 font-medium flex items-center"
                >
                  Trades
                  {sortField === "tradesCount" && <ArrowUpDown className="ml-2 h-3 w-3" />}
                </Button>
              </TableHead>
              <TableHead>Last Trade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-10" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                </TableRow>
              ))
            ) : sortedWallets.length > 0 ? (
              sortedWallets.map((wallet) => (
                <TableRow key={wallet.id} className={wallet.selected ? "bg-[#2A2A40]" : ""}>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={wallet.selected}
                      onCheckedChange={(checked) => onSelectWallet(wallet.id, checked === true)}
                      className="data-[state=checked]:bg-amber-700 data-[state=checked]:border-amber-800"
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs">{formatAddress(wallet.address)}</TableCell>
                  <TableCell>{wallet.tokenBalance.toFixed(2)}</TableCell>
                  <TableCell>{wallet.solBalance.toFixed(2)} SOL</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-gray-800/50">
                      {wallet.tradesCount}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-400 text-sm">{formatTime(wallet.lastTrade)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No wallets found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}
