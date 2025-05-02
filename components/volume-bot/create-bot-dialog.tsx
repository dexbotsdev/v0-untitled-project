"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Search, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

interface CreateBotDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateBot: (token: any) => void
}

// Wallet account interface
interface WalletAccount {
  id: number
  name: string
  numberOfWallets: number
  isActive: boolean
  walletType: string
}

export function CreateBotDialog({ open, onOpenChange, onCreateBot }: CreateBotDialogProps) {
  const [tokenAddress, setTokenAddress] = useState("")
  const [minTradeAmount, setMinTradeAmount] = useState("0.1")
  const [maxTradeAmount, setMaxTradeAmount] = useState("1.0")
  const [duration, setDuration] = useState("24")
  const [volumeTarget, setVolumeTarget] = useState("10000")
  const [selectedWalletAccount, setSelectedWalletAccount] = useState<string>("")

  // Mock wallet accounts data
  const [walletAccounts, setWalletAccounts] = useState<WalletAccount[]>([
    {
      id: 1,
      name: "Main Bank",
      numberOfWallets: 24,
      isActive: true,
      walletType: "bundler",
    },
    {
      id: 2,
      name: "Trading Account",
      numberOfWallets: 12,
      isActive: true,
      walletType: "volume",
    },
    {
      id: 3,
      name: "Reserve Fund",
      numberOfWallets: 8,
      isActive: false,
      walletType: "sniper",
    },
  ])

  const [isSearching, setIsSearching] = useState(false)
  const [tokenDetails, setTokenDetails] = useState<any | null>(null)
  const [isEstimating, setIsEstimating] = useState(false)
  const [estimateDetails, setEstimateDetails] = useState<any | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const { toast } = useToast()

  // Get the selected wallet account details
  const getSelectedWalletAccount = () => {
    return walletAccounts.find((account) => account.id.toString() === selectedWalletAccount)
  }

  const handleSearch = async () => {
    if (!tokenAddress || tokenAddress.length < 10) {
      toast({
        title: "Invalid Token Address",
        description: "Please enter a valid token address",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)
    setTokenDetails(null)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock token details
    const mockToken = {
      symbol: "MOON",
      name: "Moon Token",
      address: tokenAddress,
      logo: "/moon.png",
      price: 0.00000789,
      priceChange: 12.5,
      marketCap: "$1.2M",
      holders: 1250,
      liquidity: "$45K",
    }

    setTokenDetails(mockToken)
    setIsSearching(false)
  }

  const handleEstimate = async () => {
    if (!tokenDetails || !selectedWalletAccount) {
      toast({
        title: "Missing Information",
        description: selectedWalletAccount ? "Please search for a token first" : "Please select a wallet account",
        variant: "destructive",
      })
      return
    }

    const walletAccount = getSelectedWalletAccount()
    if (!walletAccount) return

    setIsEstimating(true)
    setEstimateDetails(null)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock estimate details
    const mockEstimate = {
      estimatedFee: "0.25 SOL",
      estimatedDuration: `${duration} hours`,
      estimatedTrades: Math.floor(
        (Number.parseInt(volumeTarget) / (Number.parseFloat(minTradeAmount) + Number.parseFloat(maxTradeAmount))) * 0.5,
      ),
      estimatedImpact: "Medium",
      walletCount: walletAccount.numberOfWallets,
      walletAccountName: walletAccount.name,
    }

    setEstimateDetails(mockEstimate)
    setIsEstimating(false)
  }

  const handleCreateBot = async () => {
    if (!tokenDetails || !estimateDetails || !selectedWalletAccount) return

    const walletAccount = getSelectedWalletAccount()
    if (!walletAccount) return

    setIsCreating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create new token with volume bot
    const newToken = {
      id: Date.now().toString(),
      symbol: tokenDetails.symbol,
      name: tokenDetails.name,
      address: tokenDetails.address,
      logo: tokenDetails.logo,
      price: tokenDetails.price,
      priceChange: tokenDetails.priceChange,
      volumeTarget: `${volumeTarget} USDC`,
      progress: 0,
      status: "active",
      settings: {
        minTradeAmount: Number.parseFloat(minTradeAmount),
        maxTradeAmount: Number.parseFloat(maxTradeAmount),
        duration: Number.parseInt(duration),
        walletAccount: {
          id: walletAccount.id,
          name: walletAccount.name,
          numberOfWallets: walletAccount.numberOfWallets,
        },
      },
    }

    onCreateBot(newToken)
    setIsCreating(false)
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setTokenAddress("")
    setMinTradeAmount("0.1")
    setMaxTradeAmount("1.0")
    setDuration("24")
    setVolumeTarget("10000")
    setSelectedWalletAccount("")
    setTokenDetails(null)
    setEstimateDetails(null)
  }

  // Fetch wallet accounts (mock implementation)
  useEffect(() => {
    // In a real app, this would be an API call to fetch wallet accounts
    // For now, we're using the mock data initialized in state
  }, [])

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) resetForm()
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className="sm:max-w-[500px] bg-[#1e2133] border-gray-800 text-stone-200 p-0 gap-0 max-h-[85vh]">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="text-lg font-semibold text-stone-200">Create Volume Bot</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-120px)] px-4 pb-2">
          <div className="space-y-3 py-2">
            {/* Token Address */}
            <div className="space-y-1">
              <Label htmlFor="tokenAddress" className="text-xs">
                Token Address
              </Label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Input
                    id="tokenAddress"
                    placeholder="Enter token address"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    className="pr-10 bg-gray-900/50 border-gray-800 h-8 text-sm"
                  />
                  {isSearching && <Loader2 className="absolute right-3 top-1.5 h-5 w-5 animate-spin text-gray-500" />}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSearch}
                  disabled={isSearching || !tokenAddress}
                  className="h-8 w-8 p-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Token Details */}
            {tokenDetails && (
              <div className="p-3 bg-gray-900/30 rounded-md border border-gray-800">
                <div className="flex items-center space-x-3">
                  <img
                    src={tokenDetails.logo || "/placeholder.svg"}
                    alt={tokenDetails.symbol}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <h3 className="text-sm font-medium">
                      {tokenDetails.name} ({tokenDetails.symbol})
                    </h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 mt-1">
                      <div className="text-xs">
                        <span className="text-gray-400">Price: </span>
                        <span>${tokenDetails.price.toFixed(8)}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-400">Market Cap: </span>
                        <span>{tokenDetails.marketCap}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-400">Holders: </span>
                        <span>{tokenDetails.holders}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-400">Liquidity: </span>
                        <span>{tokenDetails.liquidity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bot Settings */}
            {tokenDetails && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="minTradeAmount" className="text-xs">
                      Min Trade (USDC)
                    </Label>
                    <Input
                      id="minTradeAmount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={minTradeAmount}
                      onChange={(e) => setMinTradeAmount(e.target.value)}
                      className="bg-gray-900/50 border-gray-800 h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="maxTradeAmount" className="text-xs">
                      Max Trade (USDC)
                    </Label>
                    <Input
                      id="maxTradeAmount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={maxTradeAmount}
                      onChange={(e) => setMaxTradeAmount(e.target.value)}
                      className="bg-gray-900/50 border-gray-800 h-8 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="duration" className="text-xs">
                      Duration (hours)
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      max="168"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="bg-gray-900/50 border-gray-800 h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="volumeTarget" className="text-xs">
                      Volume Target (USDC)
                    </Label>
                    <Input
                      id="volumeTarget"
                      type="number"
                      min="1000"
                      step="1000"
                      value={volumeTarget}
                      onChange={(e) => setVolumeTarget(e.target.value)}
                      className="bg-gray-900/50 border-gray-800 h-8 text-sm"
                    />
                  </div>
                </div>

                {/* Wallet Account Dropdown - Replacing the slider */}
                <div className="space-y-1">
                  <Label htmlFor="walletAccount" className="text-xs">
                    Wallet Account
                  </Label>
                  <Select value={selectedWalletAccount} onValueChange={setSelectedWalletAccount}>
                    <SelectTrigger id="walletAccount" className="bg-gray-900/50 border-gray-800 h-8 text-sm">
                      <SelectValue placeholder="Select wallet account" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1e2133] border-gray-800 text-stone-200">
                      {walletAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id.toString()} className="text-sm">
                          {account.name} ({account.numberOfWallets} wallets)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedWalletAccount && (
                    <p className="text-xs text-gray-400 mt-1">
                      {getSelectedWalletAccount()?.numberOfWallets} wallets will be used for this volume bot
                    </p>
                  )}
                </div>

                <Button
                  variant="secondary"
                  onClick={handleEstimate}
                  disabled={isEstimating || !selectedWalletAccount}
                  className="w-full h-8 text-sm"
                >
                  {isEstimating ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Estimating...
                    </>
                  ) : (
                    "Calculate Estimate"
                  )}
                </Button>
              </>
            )}

            {/* Estimate Details */}
            {estimateDetails && (
              <div className="p-3 bg-amber-500/10 rounded-md border border-amber-500/20">
                <h4 className="font-medium text-amber-400 text-xs mb-1.5">Estimate Details</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div className="text-xs">
                    <span className="text-gray-400">Estimated Fee: </span>
                    <span>{estimateDetails.estimatedFee}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-400">Duration: </span>
                    <span>{estimateDetails.estimatedDuration}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-400">Estimated Trades: </span>
                    <span>{estimateDetails.estimatedTrades}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-400">Market Impact: </span>
                    <span>{estimateDetails.estimatedImpact}</span>
                  </div>
                  <div className="text-xs col-span-2">
                    <span className="text-gray-400">Wallet Account: </span>
                    <span>
                      {estimateDetails.walletAccountName} ({estimateDetails.walletCount} wallets)
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex items-start space-x-2">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-300">
                    Volume bots require sufficient SOL in each wallet to cover transaction fees.
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-3 pt-2 border-t border-gray-800">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
            className="h-8 text-xs"
          >
            Cancel
          </Button>
          {estimateDetails && (
            <Button
              onClick={handleCreateBot}
              disabled={isCreating}
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-black h-8 text-xs"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-1.5 h-3 w-3" />
                  Create Bot
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
