"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { TrendingUp, Zap, BarChart3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Wallet {
  id: string
  address: string
  solBalance: number
  tokenBalance: number
  status: "active" | "ready" | "empty"
  lastUsed?: string | null
}

interface WalletsTableProps {
  wallets: Wallet[]
  onUpdateWallet: (walletId: string, updates: { solBalance?: number; tokenBalance?: number }) => void
  tokenSymbol: string
}

export function WalletsTable({ wallets, onUpdateWallet, tokenSymbol }: WalletsTableProps) {
  const [selectedWallets, setSelectedWallets] = useState<string[]>([])
  const [walletInputs, setWalletInputs] = useState<Record<string, { solInput: string; percentageInput: string }>>({})
  const [globalSellPercentage, setGlobalSellPercentage] = useState("")
  const { toast } = useToast()

  const updateWalletInput = (walletId: string, field: "solInput" | "percentageInput", value: string) => {
    setWalletInputs((prev) => ({
      ...prev,
      [walletId]: {
        ...prev[walletId],
        [field]: value,
      },
    }))
  }

  const handleSelectWallet = (walletId: string, checked: boolean) => {
    if (checked) {
      setSelectedWallets((prev) => [...prev, walletId])
    } else {
      setSelectedWallets((prev) => prev.filter((id) => id !== walletId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedWallets(wallets.map((wallet) => wallet.id))
    } else {
      setSelectedWallets([])
    }
  }

  const handleSellPercentage = () => {
    if (selectedWallets.length === 0) {
      toast({
        title: "No Wallets Selected",
        description: "Please select wallets to perform the sell action.",
        variant: "destructive",
      })
      return
    }

    const percentage = Number.parseFloat(globalSellPercentage)
    if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
      toast({
        title: "Invalid Percentage",
        description: "Please enter a valid percentage between 1 and 100.",
        variant: "destructive",
      })
      return
    }

    selectedWallets.forEach((walletId) => {
      const wallet = wallets.find((w) => w.id === walletId)
      if (wallet && wallet.tokenBalance > 0) {
        const tokensToSell = (wallet.tokenBalance * percentage) / 100
        const newTokenBalance = wallet.tokenBalance - tokensToSell
        const solReceived = tokensToSell * 0.00001 // Mock conversion rate
        const newSolBalance = wallet.solBalance + solReceived

        onUpdateWallet(walletId, {
          tokenBalance: newTokenBalance,
          solBalance: newSolBalance,
        })
      }
    })

    toast({
      title: "Sell Order Executed",
      description: `Sold ${percentage}% tokens from ${selectedWallets.length} selected wallets.`,
    })

    setGlobalSellPercentage("")
    setSelectedWallets([])
  }

  const handleBump = () => {
    if (selectedWallets.length === 0) {
      toast({
        title: "No Wallets Selected",
        description: "Please select wallets to perform the bump action.",
        variant: "destructive",
      })
      return
    }

    selectedWallets.forEach((walletId) => {
      const wallet = wallets.find((w) => w.id === walletId)
      if (wallet && wallet.solBalance > 0.001) {
        const bumpAmount = 0.001 // Small SOL amount for bump
        const tokensReceived = bumpAmount * 100000 // Mock conversion rate
        const newSolBalance = wallet.solBalance - bumpAmount
        const newTokenBalance = wallet.tokenBalance + tokensReceived

        onUpdateWallet(walletId, {
          solBalance: newSolBalance,
          tokenBalance: newTokenBalance,
        })
      }
    })

    toast({
      title: "Bump Executed",
      description: `Bumped ${selectedWallets.length} selected wallets.`,
    })

    setSelectedWallets([])
  }

  const handleBoost = () => {
    if (selectedWallets.length === 0) {
      toast({
        title: "No Wallets Selected",
        description: "Please select wallets to perform the boost action.",
        variant: "destructive",
      })
      return
    }

    selectedWallets.forEach((walletId) => {
      const wallet = wallets.find((w) => w.id === walletId)
      if (wallet && wallet.solBalance > 0.005) {
        const boostAmount = 0.005 // Larger SOL amount for boost
        const tokensReceived = boostAmount * 100000 // Mock conversion rate
        const newSolBalance = wallet.solBalance - boostAmount
        const newTokenBalance = wallet.tokenBalance + tokensReceived

        onUpdateWallet(walletId, {
          solBalance: newSolBalance,
          tokenBalance: newTokenBalance,
        })
      }
    })

    toast({
      title: "Boost Executed",
      description: `Boosted ${selectedWallets.length} selected wallets.`,
    })

    setSelectedWallets([])
  }

  const handleIndividualBuy = (walletId: string) => {
    const solInput = Number.parseFloat(walletInputs[walletId]?.solInput || "0")
    if (isNaN(solInput) || solInput <= 0) {
      toast({
        title: "Invalid SOL Amount",
        description: "Please enter a valid SOL amount.",
        variant: "destructive",
      })
      return
    }

    const wallet = wallets.find((w) => w.id === walletId)
    if (wallet && wallet.solBalance >= solInput) {
      const tokensReceived = solInput * 100000 // Mock conversion rate
      const newSolBalance = wallet.solBalance - solInput
      const newTokenBalance = wallet.tokenBalance + tokensReceived

      onUpdateWallet(walletId, {
        solBalance: newSolBalance,
        tokenBalance: newTokenBalance,
      })

      toast({
        title: "Buy Order Executed",
        description: `Bought ${tokensReceived.toFixed(0)} ${tokenSymbol} tokens.`,
      })

      // Clear the input
      updateWalletInput(walletId, "solInput", "")
    } else {
      toast({
        title: "Insufficient Balance",
        description: "Wallet doesn't have enough SOL for this transaction.",
        variant: "destructive",
      })
    }
  }

  const handleIndividualSell = (walletId: string) => {
    const percentage = Number.parseFloat(walletInputs[walletId]?.percentageInput || "0")
    if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
      toast({
        title: "Invalid Percentage",
        description: "Please enter a valid percentage between 1 and 100.",
        variant: "destructive",
      })
      return
    }

    const wallet = wallets.find((w) => w.id === walletId)
    if (wallet && wallet.tokenBalance > 0) {
      const tokensToSell = (wallet.tokenBalance * percentage) / 100
      const newTokenBalance = wallet.tokenBalance - tokensToSell
      const solReceived = tokensToSell * 0.00001 // Mock conversion rate
      const newSolBalance = wallet.solBalance + solReceived

      onUpdateWallet(walletId, {
        tokenBalance: newTokenBalance,
        solBalance: newSolBalance,
      })

      toast({
        title: "Sell Order Executed",
        description: `Sold ${percentage}% of ${tokenSymbol} tokens.`,
      })

      // Clear the input
      updateWalletInput(walletId, "percentageInput", "")
    } else {
      toast({
        title: "No Tokens to Sell",
        description: "Wallet doesn't have any tokens to sell.",
        variant: "destructive",
      })
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 4,
    }).format(num)
  }

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <Card className="border-gray-800 bg-gray-900/30">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Wallet Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min="1"
                max="100"
                step="1"
                placeholder="Sell %"
                value={globalSellPercentage}
                onChange={(e) => setGlobalSellPercentage(e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white w-20"
              />
              <Button
                onClick={handleSellPercentage}
                className="bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30 hover:text-red-300"
                size="sm"
                disabled={selectedWallets.length === 0}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Sell %
              </Button>
            </div>

            <Button
              onClick={handleBump}
              className="bg-blue-600/20 text-blue-400 border-blue-600/30 hover:bg-blue-600/30 hover:text-blue-300"
              size="sm"
              disabled={selectedWallets.length === 0}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Bump
            </Button>

            <Button
              onClick={handleBoost}
              className="bg-purple-600/20 text-purple-400 border-purple-600/30 hover:bg-purple-600/30 hover:text-purple-300"
              size="sm"
              disabled={selectedWallets.length === 0}
            >
              <Zap className="h-4 w-4 mr-1" />
              Boost
            </Button>

            <div className="text-xs text-gray-400">
              {selectedWallets.length} of {wallets.length} wallets selected
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallets Table */}
      <Card className="border-gray-800 bg-gray-900/30">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Wallets ({wallets.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="border border-gray-800 rounded-md overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-900">
                <TableRow className="hover:bg-transparent border-gray-800">
                  <TableHead className="text-gray-400 w-12">
                    <Checkbox
                      checked={selectedWallets.length === wallets.length && wallets.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="text-gray-400">Wallet Address</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">SOL Balance</TableHead>
                  <TableHead className="text-gray-400">Token Balance</TableHead>
                  <TableHead className="text-gray-400">SOL Input</TableHead>
                  <TableHead className="text-gray-400">% Input</TableHead>
                  <TableHead className="text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wallets.map((wallet) => (
                  <TableRow key={wallet.id} className="hover:bg-gray-900/50 border-gray-800">
                    <TableCell>
                      <Checkbox
                        checked={selectedWallets.includes(wallet.id)}
                        onCheckedChange={(checked) => handleSelectWallet(wallet.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs text-gray-300 truncate max-w-32">
                      {wallet.address}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-xs ${
                          wallet.status === "active"
                            ? "bg-green-600/20 text-green-400"
                            : wallet.status === "ready"
                              ? "bg-blue-600/20 text-blue-400"
                              : "bg-gray-600/20 text-gray-400"
                        }`}
                      >
                        {wallet.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">{formatNumber(wallet.solBalance)} SOL</TableCell>
                    <TableCell className="text-gray-300">
                      {formatNumber(wallet.tokenBalance)} {tokenSymbol}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0.001"
                        step="0.001"
                        placeholder="0.01"
                        value={walletInputs[wallet.id]?.solInput || ""}
                        onChange={(e) => updateWalletInput(wallet.id, "solInput", e.target.value)}
                        className="bg-gray-800/50 border-gray-700 text-white h-8 w-20 text-xs"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        step="1"
                        placeholder="100"
                        value={walletInputs[wallet.id]?.percentageInput || ""}
                        onChange={(e) => updateWalletInput(wallet.id, "percentageInput", e.target.value)}
                        className="bg-gray-800/50 border-gray-700 text-white h-8 w-16 text-xs"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          className="bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30 hover:text-green-300 h-7 px-2 text-xs"
                          onClick={() => handleIndividualBuy(wallet.id)}
                        >
                          Buy
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30 hover:text-red-300 h-7 px-2 text-xs"
                          onClick={() => handleIndividualSell(wallet.id)}
                        >
                          Sell
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
