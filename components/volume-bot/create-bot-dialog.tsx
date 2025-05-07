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
import { Checkbox } from "@/components/ui/checkbox"

interface CreateBotDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateBot: (token: any) => void
}

// SOL to USD conversion rate
const SOL_USD_RATE = 145

export function CreateBotDialog({ open, onOpenChange, onCreateBot }: CreateBotDialogProps) {
  const [tokenAddress, setTokenAddress] = useState("")
  const [minTradeAmount, setMinTradeAmount] = useState("0.01")
  const [maxTradeAmount, setMaxTradeAmount] = useState("0.05")
  const [duration, setDuration] = useState("24")
  const [volumeTarget, setVolumeTarget] = useState("10000")
  const [numberOfWallets, setNumberOfWallets] = useState("10")
  const [selectedStrategy, setSelectedStrategy] = useState<string>("bump")
  const [tradesPerMinute, setTradesPerMinute] = useState(2)
  const [useAntiMev, setUseAntiMev] = useState(false)
  const [tipAmount, setTipAmount] = useState("10000")
  const [priorityFees, setPriorityFees] = useState("10000")
  const [slippage, setSlippage] = useState("5")

  const [isSearching, setIsSearching] = useState(false)
  const [tokenDetails, setTokenDetails] = useState<any | null>(null)
  const [isEstimating, setIsEstimating] = useState(false)
  const [estimateDetails, setEstimateDetails] = useState<any | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const { toast } = useToast()

  // Update trades per minute based on selected strategy
  useEffect(() => {
    switch (selectedStrategy) {
      case "bump":
        setTradesPerMinute(16)
        break
      case "turbo":
        setTradesPerMinute(4)
        break
      case "microbuys":
        setTradesPerMinute(30)
        break
      case "pattern":
        setTradesPerMinute(4)
        break
      default:
        setTradesPerMinute(2)
    }
  }, [selectedStrategy])

  // Calculate estimated volume based on inputs
  const calculateEstimatedVolume = () => {
    const minInUsd = Number.parseFloat(minTradeAmount) * SOL_USD_RATE
    const maxInUsd = Number.parseFloat(maxTradeAmount) * SOL_USD_RATE
    const avgTradeSize = (minInUsd + maxInUsd) / 2
    const durationMinutes = Number.parseInt(duration) * 60

    return avgTradeSize * tradesPerMinute * durationMinutes
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
    if (!tokenDetails) {
      toast({
        title: "Missing Information",
        description: "Please search for a token first",
        variant: "destructive",
      })
      return
    }

    if (!numberOfWallets || Number.parseInt(numberOfWallets) <= 0) {
      toast({
        title: "Invalid Number of Wallets",
        description: "Please enter a valid number of wallets to generate",
        variant: "destructive",
      })
      return
    }

    setIsEstimating(true)
    setEstimateDetails(null)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Calculate estimated volume
    const estimatedVolume = calculateEstimatedVolume()

    // Calculate estimated trades
    const totalMinutes = Number.parseInt(duration) * 60
    const estimatedTrades = totalMinutes * tradesPerMinute

    // Calculate transaction fees
    const transactionFees = estimatedTrades * 0.0005

    // Calculate JitoBundle tips
    const jitoBundleTips = estimatedTrades * 0.25 * 0.001

    // Token account creation fees (fixed)
    const tokenAccountCreationFees = 2 * 0.0023098

    // Calculate total estimated fee
    const walletCount = Number.parseInt(numberOfWallets)
    const walletFee = estimatedTrades * 0.000005 * walletCount
    const totalEstimatedFee = walletFee + transactionFees + jitoBundleTips + tokenAccountCreationFees

    // Mock estimate details
    const mockEstimate = {
      estimatedFee: `${totalEstimatedFee.toFixed(4)} SOL`,
      transactionFees: `${transactionFees.toFixed(4)} SOL`,
      jitoBundleTips: `${jitoBundleTips.toFixed(4)} SOL`,
      tokenAccountCreationFees: `${tokenAccountCreationFees.toFixed(7)} SOL`,
      walletFee: `${walletFee.toFixed(4)} SOL`,
      estimatedDuration: `${duration} hours`,
      estimatedTrades: estimatedTrades,
      estimatedVolume: `$${estimatedVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      estimatedImpact: estimatedVolume > 50000 ? "High" : estimatedVolume > 20000 ? "Medium" : "Low",
      walletCount: walletCount,
    }

    setEstimateDetails(mockEstimate)
    setIsEstimating(false)

    // Update volume target based on calculation
    setVolumeTarget(estimatedVolume.toFixed(0))
  }

  const handleCreateBot = async () => {
    if (!tokenDetails || !estimateDetails) return

    if (!numberOfWallets || Number.parseInt(numberOfWallets) <= 0) {
      toast({
        title: "Invalid Number of Wallets",
        description: "Please enter a valid number of wallets to generate",
        variant: "destructive",
      })
      return
    }

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
      volumeTarget: `$${volumeTarget}`,
      progress: 0,
      status: "active",
      settings: {
        minTradeAmount: Number.parseFloat(minTradeAmount),
        maxTradeAmount: Number.parseFloat(maxTradeAmount),
        duration: Number.parseInt(duration),
        strategy: selectedStrategy,
        tradesPerMinute: tradesPerMinute,
        numberOfWallets: Math.min(Number.parseInt(numberOfWallets), 25),
        useAntiMev: useAntiMev,
        tipAmount: Number.parseInt(tipAmount),
        priorityFees: Number.parseInt(priorityFees),
        slippage: Number.parseFloat(slippage),
      },
    }

    onCreateBot(newToken)
    setIsCreating(false)
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setTokenAddress("")
    setMinTradeAmount("0.01")
    setMaxTradeAmount("0.05")
    setDuration("24")
    setVolumeTarget("10000")
    setNumberOfWallets("10")
    setTokenDetails(null)
    setEstimateDetails(null)
    setSelectedStrategy("bump")
    setUseAntiMev(false)
    setTipAmount("10000")
    setPriorityFees("10000")
    setSlippage("5")
  }

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
                      Min Trade (SOL)
                    </Label>
                    <Input
                      id="minTradeAmount"
                      type="number"
                      min="0.001"
                      step="0.001"
                      value={minTradeAmount}
                      onChange={(e) => setMinTradeAmount(e.target.value)}
                      className="bg-gray-900/50 border-gray-800 h-8 text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      ≈ ${(Number.parseFloat(minTradeAmount || "0") * SOL_USD_RATE).toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="maxTradeAmount" className="text-xs">
                      Max Trade (SOL)
                    </Label>
                    <Input
                      id="maxTradeAmount"
                      type="number"
                      min="0.001"
                      step="0.001"
                      value={maxTradeAmount}
                      onChange={(e) => setMaxTradeAmount(e.target.value)}
                      className="bg-gray-900/50 border-gray-800 h-8 text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      ≈ ${(Number.parseFloat(maxTradeAmount || "0") * SOL_USD_RATE).toFixed(2)}
                    </p>
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
                    <p className="text-xs text-gray-400 mt-1">{Number.parseInt(duration || "0") * 60} minutes total</p>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="strategy" className="text-xs">
                      Bot Strategy
                    </Label>
                    <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                      <SelectTrigger id="strategy" className="bg-gray-900/50 border-gray-800 h-8 text-sm">
                        <SelectValue placeholder="Select strategy" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1e2133] border-gray-800 text-stone-200">
                        <SelectItem value="bump" className="text-sm">
                          Bump (1 Buy + 1 Sell each tnx)
                        </SelectItem>
                        <SelectItem value="turbo" className="text-sm">
                          Turbo (High Volume Reverse Trader)
                        </SelectItem>
                        <SelectItem value="microbuys" className="text-sm">
                          MicroBuys (0.0001 sol Buys)
                        </SelectItem>
                        <SelectItem value="pattern" className="text-sm">
                          Pattern (2 Buys 1 Sell each Tnx)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-400 mt-1">{tradesPerMinute} trades per minute</p>
                  </div>
                </div>

                {/* Number of Wallets Input */}
                <div className="space-y-1">
                  <Label htmlFor="numberOfWallets" className="text-xs">
                    Number of Wallets to Generate
                  </Label>
                  <Input
                    id="numberOfWallets"
                    type="number"
                    min="1"
                    max="25"
                    value={numberOfWallets}
                    onChange={(e) => setNumberOfWallets(e.target.value)}
                    className="bg-gray-900/50 border-gray-800 h-8 text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {Number.parseInt(numberOfWallets) > 0
                      ? `${numberOfWallets} wallets will be used for this volume bot (max 25)`
                      : "Please enter a valid number of wallets"}
                  </p>
                </div>

                {/* AntiMev Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="antiMev"
                    checked={useAntiMev}
                    onCheckedChange={(checked) => setUseAntiMev(checked === true)}
                    className="data-[state=checked]:bg-amber-600"
                  />
                  <Label htmlFor="antiMev" className="text-xs cursor-pointer">
                    Use AntiMev with bundles
                  </Label>
                </div>

                {/* Advanced Settings Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Tip Amount */}
                  <div className="space-y-1">
                    <Label htmlFor="tipAmount" className="text-xs">
                      Tip Amount (LAMPORTS)
                    </Label>
                    <Input
                      id="tipAmount"
                      type="number"
                      min="0"
                      value={tipAmount}
                      onChange={(e) => setTipAmount(e.target.value)}
                      className="bg-gray-900/50 border-gray-800 h-8 text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {Number.parseInt(tipAmount) > 0
                        ? `${(Number.parseInt(tipAmount) / 1000000000).toFixed(7)} SOL`
                        : "0 SOL"}
                    </p>
                  </div>

                  {/* Priority Fees */}
                  <div className="space-y-1">
                    <Label htmlFor="priorityFees" className="text-xs">
                      Priority Fees (LAMPORTS)
                    </Label>
                    <Input
                      id="priorityFees"
                      type="number"
                      min="0"
                      value={priorityFees}
                      onChange={(e) => setPriorityFees(e.target.value)}
                      className="bg-gray-900/50 border-gray-800 h-8 text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {Number.parseInt(priorityFees) > 0
                        ? `${(Number.parseInt(priorityFees) / 1000000000).toFixed(7)} SOL`
                        : "0 SOL"}
                    </p>
                  </div>

                  {/* Slippage */}
                  <div className="space-y-1">
                    <Label htmlFor="slippage" className="text-xs">
                      Slippage (%)
                    </Label>
                    <Input
                      id="slippage"
                      type="number"
                      min="0.1"
                      max="100"
                      value={slippage}
                      onChange={(e) => setSlippage(e.target.value)}
                      className="bg-gray-900/50 border-gray-800 h-8 text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">Max price impact allowed</p>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  onClick={handleEstimate}
                  disabled={isEstimating || !numberOfWallets || Number.parseInt(numberOfWallets) <= 0}
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
                    <span className="text-gray-400">Total Fee: </span>
                    <span className="font-medium text-amber-400">{estimateDetails.estimatedFee}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-400">Duration: </span>
                    <span>{estimateDetails.estimatedDuration}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-400">Estimated Trades: </span>
                    <span>{estimateDetails.estimatedTrades.toLocaleString()}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-400">Market Impact: </span>
                    <span>{estimateDetails.estimatedImpact}</span>
                  </div>
                  <div className="text-xs col-span-2">
                    <span className="text-gray-400">Estimated Volume: </span>
                    <span className="font-medium text-amber-400">{estimateDetails.estimatedVolume}</span>
                  </div>
                  <div className="text-xs col-span-2">
                    <span className="text-gray-400">Number of Wallets: </span>
                    <span>{estimateDetails.walletCount}</span>
                  </div>

                  {/* Fee Breakdown */}
                  <div className="text-xs col-span-2 mt-2">
                    <h5 className="font-medium text-gray-300 mb-1">Fee Breakdown:</h5>
                    <div className="pl-2 space-y-1">
                      <div>
                        <span className="text-gray-400">Transaction Fees: </span>
                        <span>{estimateDetails.transactionFees}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">JitoBundle Tips: </span>
                        <span>{estimateDetails.jitoBundleTips}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Token Account Creation: </span>
                        <span>{estimateDetails.tokenAccountCreationFees}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Wallet Fee: </span>
                        <span>{estimateDetails.walletFee}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-2 space-y-1.5">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-300">
                      Volume bots require sufficient SOL in each wallet to cover transaction fees.
                    </p>
                  </div>
                  <div className="flex items-start space-x-2 pl-5">
                    <p className="text-xs text-amber-400 font-medium">Fund each wallet with 0.01 SOL min</p>
                  </div>
                  <div className="flex items-start space-x-2 pl-5">
                    <p className="text-xs text-amber-400 font-medium">
                      Fund Main wallet with {tradesPerMinute}x{maxTradeAmount} SOL min
                    </p>
                  </div>
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
