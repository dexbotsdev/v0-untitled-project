"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Search, AlertCircle, CheckCircle2, Loader2, Coins, Wand2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"

interface CreateBotDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateBot: (token: any) => void
}

// SOL to USD conversion rate
const SOL_USD_RATE = 145

export function CreateBotDialog({ open, onOpenChange, onCreateBot }: CreateBotDialogProps) {
  // Mode switch
  const [isAutoMode, setIsAutoMode] = useState(true)

  // Token search
  const [tokenAddress, setTokenAddress] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [tokenDetails, setTokenDetails] = useState<any | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)

  // Auto mode inputs
  const [budget, setBudget] = useState("")
  const [expectedVolume, setExpectedVolume] = useState("")
  const [hasCalculatedStrategy, setHasCalculatedStrategy] = useState(false)

  // Bot configuration
  const [minTradeAmount, setMinTradeAmount] = useState("0.01")
  const [maxTradeAmount, setMaxTradeAmount] = useState("0.05")
  const [duration, setDuration] = useState("24")
  const [selectedStrategy, setSelectedStrategy] = useState<string>("bump")
  const [selectedPlatform, setSelectedPlatform] = useState<string>("raydium")
  const [tradesPerMinute, setTradesPerMinute] = useState("16")
  const [useAntiMev, setUseAntiMev] = useState(false)
  const [useFakeSigners, setUseFakeSigners] = useState(false)
  const [tipAmount, setTipAmount] = useState("10000")
  const [priorityFees, setPriorityFees] = useState("10000")
  const [slippage, setSlippage] = useState("5")

  // Process states
  const [isEstimating, setIsEstimating] = useState(false)
  const [estimateDetails, setEstimateDetails] = useState<any | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // Track if trades per minute was manually changed
  const tradesPerMinuteManuallySet = useRef(false)

  const { toast } = useToast()

  // Calculate number of wallets based on trades per minute * duration in minutes
  const calculatedWallets = useMemo(() => {
    const tpm = Number.parseInt(tradesPerMinute || "16")
    const durationHours = Number.parseInt(duration || "24")
    const durationMinutes = durationHours * 60

    // Number of wallets equals total number of trades (trades per minute * duration in minutes)
    return tpm * durationMinutes
  }, [tradesPerMinute, duration])

  // Update trades per minute based on selected strategy only if not manually set
  useEffect(() => {
    if (tradesPerMinuteManuallySet.current || isAutoMode) return

    let newTradesPerMinute
    switch (selectedStrategy) {
      case "bump":
        newTradesPerMinute = "16"
        break
      case "turbo":
        newTradesPerMinute = "4"
        break
      case "microbuys":
        newTradesPerMinute = "30"
        break
      case "pattern":
        newTradesPerMinute = "4"
        break
      case "human":
        newTradesPerMinute = "1"
        break
      case "auto":
        newTradesPerMinute = "10"
        break
      default:
        newTradesPerMinute = "2"
    }
    setTradesPerMinute(newTradesPerMinute)
  }, [selectedStrategy, isAutoMode])

  // Calculate estimated volume based on inputs
  const calculateEstimatedVolume = () => {
    // Total Volume = Duration in Minutes * Trades Per Minute * Max Trade * 2 in USD
    const durationMinutes = Number.parseInt(duration) * 60
    const tradesPerMin = Number.parseInt(tradesPerMinute)
    const maxTrade = Number.parseFloat(maxTradeAmount)

    return durationMinutes * tradesPerMin * maxTrade * 2 * SOL_USD_RATE
  }

  // Helper function to format numbers with commas
  const formatNumber = (value) => {
    const num = Number.parseFloat(value)
    return num.toLocaleString(undefined, {
      maximumFractionDigits: num > 1000000 ? 0 : 2,
    })
  }

  const calculateStrategy = () => {
    if (!budget || !expectedVolume) {
      toast({
        title: "Missing Information",
        description: "Please enter both Budget and Expected Volume",
        variant: "destructive",
      })
      return
    }

    const budgetSOL = Number.parseFloat(budget)
    const volumeUSD = Number.parseFloat(expectedVolume)

    if (isNaN(budgetSOL) || budgetSOL <= 0) {
      toast({
        title: "Invalid Budget",
        description: "Please enter a valid budget amount",
        variant: "destructive",
      })
      return
    }

    if (isNaN(volumeUSD) || volumeUSD <= 0) {
      toast({
        title: "Invalid Volume",
        description: "Please enter a valid expected volume amount",
        variant: "destructive",
      })
      return
    }

    // Calculate optimal strategy based on budget and expected volume
    setIsEstimating(true)

    // Simulate API call
    setTimeout(() => {
      // Convert budget to USD for calculations
      const budgetUSD = budgetSOL * SOL_USD_RATE

      // Determine optimal strategy based on volume to budget ratio
      const volumeToBudgetRatio = volumeUSD / budgetUSD

      let suggestedStrategy
      let suggestedDuration
      let suggestedTradesPerMinute
      let suggestedMinTradeAmount
      let suggestedMaxTradeAmount
      let suggestedAntiMev = false
      const suggestedFakeSigners = true

      // Strategy selection logic
      if (volumeToBudgetRatio > 100) {
        // High volume with limited budget - use microbuys
        suggestedStrategy = "microbuys"
        suggestedTradesPerMinute = "30"
        suggestedDuration = Math.min(Math.ceil(volumeUSD / (30 * 60 * 0.001 * SOL_USD_RATE * 2)), 168).toString()
        suggestedMinTradeAmount = "0.001"
        suggestedMaxTradeAmount = "0.005"
      } else if (volumeToBudgetRatio > 50) {
        // Medium-high volume - use bump strategy
        suggestedStrategy = "bump"
        suggestedTradesPerMinute = "16"
        suggestedDuration = Math.min(Math.ceil(volumeUSD / (16 * 60 * 0.01 * SOL_USD_RATE * 2)), 168).toString()
        suggestedMinTradeAmount = "0.01"
        suggestedMaxTradeAmount = "0.05"
      } else if (volumeToBudgetRatio > 20) {
        // Medium volume - use turbo strategy
        suggestedStrategy = "turbo"
        suggestedTradesPerMinute = "4"
        suggestedDuration = Math.min(Math.ceil(volumeUSD / (4 * 60 * 0.05 * SOL_USD_RATE * 2)), 168).toString()
        suggestedMinTradeAmount = "0.05"
        suggestedMaxTradeAmount = "0.1"
      } else {
        // Low volume or high budget - use pattern strategy
        suggestedStrategy = "pattern"
        suggestedTradesPerMinute = "4"
        suggestedDuration = Math.min(Math.ceil(volumeUSD / (4 * 60 * 0.1 * SOL_USD_RATE * 2)), 168).toString()
        suggestedMinTradeAmount = "0.1"
        suggestedMaxTradeAmount = "0.2"
        suggestedAntiMev = true
      }

      // Ensure duration is at least 1 hour
      if (Number.parseInt(suggestedDuration) < 1) suggestedDuration = "1"

      // Update state with suggested values
      setSelectedStrategy(suggestedStrategy)
      setDuration(suggestedDuration)
      setTradesPerMinute(suggestedTradesPerMinute)
      setMinTradeAmount(suggestedMinTradeAmount)
      setMaxTradeAmount(suggestedMaxTradeAmount)
      setUseAntiMev(suggestedAntiMev)
      setUseFakeSigners(suggestedFakeSigners)

      // Calculate estimated volume based on suggested settings
      const estimatedVolume =
        Number.parseInt(suggestedDuration) *
        60 *
        Number.parseInt(suggestedTradesPerMinute) *
        Number.parseFloat(suggestedMaxTradeAmount) *
        2 *
        SOL_USD_RATE

      // Show success message with strategy info
      toast({
        title: "Strategy Calculated",
        description: `Suggested ${suggestedStrategy} strategy for $${volumeUSD.toLocaleString()} volume`,
        variant: "default",
      })

      setHasCalculatedStrategy(true)
      setIsEstimating(false)

      // Auto-run estimate calculation
      handleEstimate()
    }, 1500)
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
    setSearchError(null)

    try {
      // Call DexScreener API
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.pairs || data.pairs.length === 0) {
        toast({
          title: "Token Not Found",
          description: "No trading pairs found for this token address",
          variant: "destructive",
        })
        setIsSearching(false)
        return
      }

      // Find the Solana pair with the highest liquidity
      const solanaPairs = data.pairs.filter((pair) => pair.chainId === "solana")
      if (solanaPairs.length === 0) {
        toast({
          title: "Token Not Found on Solana",
          description: "This token doesn't have any Solana trading pairs",
          variant: "destructive",
        })
        setIsSearching(false)
        return
      }

      // Sort by liquidity (USD) and get the highest
      const bestPair = solanaPairs.sort(
        (a, b) => Number.parseFloat(b.liquidity?.usd || "0") - Number.parseFloat(a.liquidity?.usd || "0"),
      )[0]

      // Format token details from the API response
      const formattedToken = {
        symbol: bestPair.baseToken.symbol,
        name: bestPair.baseToken.name,
        address: tokenAddress,
        marketCap: bestPair.fdv ? `$${formatNumber(bestPair.fdv)}` : "Unknown",
        holders: "N/A", // DexScreener doesn't provide holder count
        liquidity: bestPair.liquidity?.usd ? `$${formatNumber(bestPair.liquidity.usd)}` : "Unknown",
        price: bestPair.priceUsd ? `$${Number.parseFloat(bestPair.priceUsd).toFixed(6)}` : "Unknown",
        priceChange: bestPair.priceChange?.h24 ? `${bestPair.priceChange.h24}%` : "N/A",
        volume24h: bestPair.volume?.h24 ? `$${formatNumber(bestPair.volume.h24)}` : "N/A",
        pairAddress: bestPair.pairAddress,
        dexId: bestPair.dexId,
        isPriceUp: bestPair.priceChange?.h24 ? Number.parseFloat(bestPair.priceChange.h24) >= 0 : null,
      }

      setTokenDetails(formattedToken)
    } catch (error) {
      console.error("Error fetching token details:", error)
      toast({
        title: "Error Fetching Token",
        description: "Failed to fetch token details. Please try again.",
        variant: "destructive",
      })
      setSearchError("Failed to fetch token details. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleEstimate = async () => {
    setIsEstimating(true)
    setEstimateDetails(null)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Calculate estimated volume
    const estimatedVolume = calculateEstimatedVolume()

    // Calculate estimated trades
    const totalMinutes = Number.parseInt(duration) * 60
    const tradesPerMin = Number.parseInt(tradesPerMinute)
    const estimatedTrades = totalMinutes * tradesPerMin

    // Dev Wallet Amount Required = No Of Trades Per Minute * Max Trade Amount
    const devWalletRequired = tradesPerMin * Number.parseFloat(maxTradeAmount)

    // Token Account Fees calculation
    // TokenAccountFees = 0.0023098 * 2 (If Fake signers enabled)
    // Token Account Fees = 0.0023098 * Total Number of Wallets * 2 (If Fake Signers are disabled)
    const walletCount = calculatedWallets
    const tokenAccountCreationFees = useFakeSigners ? 0.0023098 * 2 : 0.0023098 * walletCount * 2

    // Total Jito Tip = Number of Wallets / 4 * 0.00001 sol
    const jitoBundleTips = useAntiMev ? (walletCount / 4) * 0.00001 * estimatedTrades : 0

    // Total Priority Fee = Number of Wallets / 4 * 0.0001 sol
    const priorityFeeTotal = (walletCount / 4) * 0.0001 * estimatedTrades

    // Calculate transaction fees (standard Solana fee)
    const transactionFees = estimatedTrades * 0.000005

    // Calculate total estimated fee (excluding Priority Fees which are automatic)
    const totalEstimatedFee = tokenAccountCreationFees + jitoBundleTips + transactionFees

    // Mock estimate details
    const mockEstimate = {
      estimatedFee: `${totalEstimatedFee.toFixed(4)} SOL`,
      transactionFees: `${transactionFees.toFixed(4)} SOL`,
      jitoBundleTips: useAntiMev ? `${jitoBundleTips.toFixed(4)} SOL` : "0 SOL",
      tokenAccountCreationFees: `${tokenAccountCreationFees.toFixed(7)} SOL`,
      priorityFees: `${priorityFeeTotal.toFixed(4)} SOL (Auto)`,
      estimatedDuration: `${duration} hours`,
      estimatedTrades: estimatedTrades,
      estimatedVolume: `$${estimatedVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      estimatedImpact: estimatedVolume > 50000 ? "High" : estimatedVolume > 20000 ? "Medium" : "Low",
      walletCount: walletCount,
      devWalletRequired: `${devWalletRequired.toFixed(4)} SOL`,
      fakeSignersEnabled: useFakeSigners,
      antiMevEnabled: useAntiMev,
      priorityFeesAutomatic: true,
    }

    setEstimateDetails(mockEstimate)
    setIsEstimating(false)
  }

  const handleCreateBot = async () => {
    if (!tokenDetails) {
      toast({
        title: "Missing Token",
        description: "Please search for a token first",
        variant: "destructive",
      })
      return
    }

    if (!estimateDetails && !isAutoMode) {
      toast({
        title: "Missing Estimate",
        description: "Please calculate an estimate first",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create new token with integrated bot settings
    const newToken = {
      id: Date.now().toString(),
      symbol: tokenDetails.symbol,
      name: tokenDetails.name,
      address: tokenDetails.address,
      // Use a simple icon instead of trying to load an external image
      logo: "/moon.png", // Use a local image that we know exists
      progress: 0,
      status: "paused",
      // Bot settings directly in token
      minTradeAmount: Number.parseFloat(minTradeAmount),
      maxTradeAmount: Number.parseFloat(maxTradeAmount),
      duration: Number.parseInt(duration),
      strategy: selectedStrategy,
      platform: selectedPlatform, // Add the selected platform
      tradesPerMinute: Number.parseInt(tradesPerMinute),
      numberOfWallets: calculatedWallets,
      useAntiMev: useAntiMev,
      useFakeSigners: useFakeSigners,
      tipAmount: Number.parseInt(tipAmount),
      priorityFees: Number.parseInt(priorityFees),
      slippage: Number.parseFloat(slippage),
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
    setTokenDetails(null)
    setEstimateDetails(null)
    setSelectedStrategy("bump")
    setSelectedPlatform("raydium") // Reset platform selection
    setTradesPerMinute("16") // Reset to default
    tradesPerMinuteManuallySet.current = false // Reset manual flag
    setUseAntiMev(false)
    setUseFakeSigners(false)
    setTipAmount("10000")
    setPriorityFees("10000")
    setSlippage("5")
    setSearchError(null)
    setBudget("")
    setExpectedVolume("")
    setHasCalculatedStrategy(false)
    setIsAutoMode(true)
  }

  const handleTradesPerMinuteChange = (e) => {
    setTradesPerMinute(e.target.value)
    tradesPerMinuteManuallySet.current = true
  }

  // Format large numbers with abbreviations
  const formatLargeNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
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
            {/* Mode Switch */}
            <div className="flex items-center justify-between bg-gray-900/30 rounded-md p-3 border border-gray-800">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isAutoMode}
                  onCheckedChange={setIsAutoMode}
                  className="data-[state=checked]:bg-amber-600"
                />
                <Label className="text-sm font-medium">{isAutoMode ? "Auto Mode" : "Manual Mode"}</Label>
              </div>
              <div className="text-xs text-gray-400">
                {isAutoMode ? (
                  <div className="flex items-center">
                    <Wand2 className="h-3 w-3 mr-1 text-amber-400" />
                    <span>AI-powered configuration</span>
                  </div>
                ) : (
                  <span>Custom configuration</span>
                )}
              </div>
            </div>

            {/* AUTO MODE SECTION */}
            {isAutoMode && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="budget" className="text-xs">
                      Budget (SOL)
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="bg-gray-900/50 border-gray-800 h-8 text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      ≈ ${(Number.parseFloat(budget || "0") * SOL_USD_RATE).toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="expectedVolume" className="text-xs">
                      Expected Volume (USD)
                    </Label>
                    <Input
                      id="expectedVolume"
                      type="number"
                      min="100"
                      step="100"
                      value={expectedVolume}
                      onChange={(e) => setExpectedVolume(e.target.value)}
                      className="bg-gray-900/50 border-gray-800 h-8 text-sm"
                    />
                  </div>
                </div>

                {/* Calculate Strategy Button */}
                <Button
                  variant="secondary"
                  onClick={calculateStrategy}
                  disabled={isEstimating || !budget || !expectedVolume}
                  className="w-full h-8 text-sm"
                >
                  {isEstimating ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Calculating Strategy...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-3 w-3" />
                      Calculate Optimal Strategy
                    </>
                  )}
                </Button>

                {hasCalculatedStrategy && (
                  <div className="bg-amber-500/10 rounded-md p-2 text-xs border border-amber-500/30">
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-amber-400">
                        Strategy calculated! We've configured the optimal settings based on your budget and volume
                        requirements.
                      </p>
                    </div>
                  </div>
                )}

                {/* Show configuration summary if strategy has been calculated */}
                {hasCalculatedStrategy && (
                  <div className="p-3 bg-gray-900/30 rounded-md border border-gray-800">
                    <h4 className="text-xs font-medium mb-2">Configuration Summary</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <div>
                        <span className="text-gray-400">Strategy: </span>
                        <span className="capitalize">{selectedStrategy}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Platform: </span>
                        <span className="capitalize">{selectedPlatform}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Duration: </span>
                        <span>{duration} hours</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Trades/min: </span>
                        <span>{tradesPerMinute}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Trade Range: </span>
                        <span>
                          {minTradeAmount} - {maxTradeAmount} SOL
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Wallets: </span>
                        <span>{formatLargeNumber(calculatedWallets)}</span>
                      </div>
                      <div className="col-span-2 mt-1">
                        <span className="text-gray-400">Features: </span>
                        <span>
                          {useAntiMev ? "AntiMEV, " : ""}
                          {useFakeSigners ? "Fake Signers" : ""}
                          {!useAntiMev && !useFakeSigners ? "None" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* MANUAL MODE SECTION */}
            {!isAutoMode && (
              <>
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
                </div>

                <div className="space-y-1">
                  <Label htmlFor="platform" className="text-xs">
                    Platform
                  </Label>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger id="platform" className="bg-gray-900/50 border-gray-800 h-8 text-sm">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1e2133] border-gray-800 text-stone-200">
                      <SelectItem value="raydium" className="text-sm">
                        Raydium AMM
                      </SelectItem>
                      <SelectItem value="pumpfun" className="text-sm">
                        PumpFun
                      </SelectItem>
                      <SelectItem value="pumpswap" className="text-sm">
                        Pumpswap
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-400 mt-1">Trading platform to use</p>
                </div>

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
                    <Label htmlFor="tradesPerMinute" className="text-xs">
                      Trades Per Minute
                    </Label>
                    <Input
                      id="tradesPerMinute"
                      type="number"
                      min="1"
                      max="100"
                      value={tradesPerMinute}
                      onChange={handleTradesPerMinuteChange}
                      className="bg-gray-900/50 border-gray-800 h-8 text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {Number.parseInt(tradesPerMinute || "0") * Number.parseInt(duration || "0") * 60} total trades
                    </p>
                  </div>
                </div>

                {/* Wallets Info */}
                <div className="bg-gray-900/30 rounded-md p-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Number of Wallets:</span>
                    <span className="font-medium text-amber-400">{formatLargeNumber(calculatedWallets)}</span>
                  </div>
                  <p className="text-gray-400 mt-1">
                    Calculated as: Trades Per Minute ({tradesPerMinute}) × Total Minutes (
                    {Number.parseInt(duration) * 60})
                  </p>
                </div>

                {/* Checkboxes for AntiMev and Fake Signers */}
                <div className="flex flex-col space-y-2">
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

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fakeSigners"
                      checked={useFakeSigners}
                      onCheckedChange={(checked) => setUseFakeSigners(checked === true)}
                      className="data-[state=checked]:bg-amber-600"
                    />
                    <Label htmlFor="fakeSigners" className="text-xs cursor-pointer">
                      Use Fake Signers (Save on Fees)
                    </Label>
                  </div>
                </div>

                {/* Advanced Settings Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Tip Amount */}
                  <div className="space-y-1">
                    <Label htmlFor="tipAmount" className="text-xs">
                      Tip (LAMPs)
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

                {/* Priority Fees Info */}
                <div className="bg-gray-900/30 rounded-md p-2 text-xs text-gray-400">
                  <span className="font-medium text-gray-300">Note:</span> Priority Fees are automatically calculated
                  and not included in the fee estimate
                </div>

                {/* Warning for large wallet counts */}
                {calculatedWallets > 10000 && (
                  <div className="bg-amber-500/10 rounded-md p-2 text-xs border border-amber-500/30">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-amber-400">
                        Warning: You are creating a very large number of wallets ({formatLargeNumber(calculatedWallets)}
                        ). This may require significant resources and time to set up.
                      </p>
                    </div>
                  </div>
                )}

                <Button
                  variant="secondary"
                  onClick={handleEstimate}
                  disabled={isEstimating}
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

            {/* Estimate Details - Show in both modes if available */}
            {estimateDetails && !isAutoMode && (
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
                    <span>{formatLargeNumber(estimateDetails.walletCount)}</span>
                  </div>
                  <div className="text-xs col-span-2">
                    <span className="text-gray-400">Dev Wallet Required: </span>
                    <span className="font-medium text-amber-400">{estimateDetails.devWalletRequired}</span>
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
                        {estimateDetails.antiMevEnabled ? (
                          <span className="text-xs text-amber-400 ml-1">(AntiMev enabled)</span>
                        ) : (
                          <span className="text-xs text-gray-400 ml-1">(AntiMev disabled)</span>
                        )}
                      </div>
                      <div>
                        <span className="text-gray-400">Token Account Creation: </span>
                        <span>{estimateDetails.tokenAccountCreationFees}</span>
                        {estimateDetails.fakeSignersEnabled ? (
                          <span className="text-xs text-green-400 ml-1">(Fake signers enabled)</span>
                        ) : (
                          <span className="text-xs text-gray-400 ml-1">(Per wallet)</span>
                        )}
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
                      Fund Main wallet with {estimateDetails.devWalletRequired} SOL min
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Token Address - Always shown as the last step */}
            <div className="mt-4 border-t border-gray-800 pt-4">
              <h4 className="text-sm font-medium mb-2">Final Step: Select Token</h4>
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
              {searchError && (
                <div className="text-xs text-red-400 mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {searchError}
                </div>
              )}
            </div>

            {/* Token Details - Only show when tokenDetails exists */}
            {tokenDetails && (
              <div className="p-3 bg-gray-900/30 rounded-md border border-gray-800">
                <div className="flex items-center space-x-3">
                  {/* Replace dynamic image with icon */}
                  <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Coins className="h-6 w-6 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">
                      {tokenDetails.name} ({tokenDetails.symbol})
                    </h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 mt-1">
                      <div className="text-xs">
                        <span className="text-gray-400">Price: </span>
                        <span
                          className={
                            tokenDetails.isPriceUp !== null
                              ? tokenDetails.isPriceUp
                                ? "text-green-400"
                                : "text-red-400"
                              : ""
                          }
                        >
                          {tokenDetails.price}
                        </span>
                        {tokenDetails.isPriceUp !== null && (
                          <span className={`ml-1 ${tokenDetails.isPriceUp ? "text-green-400" : "text-red-400"}`}>
                            ({tokenDetails.priceChange})
                          </span>
                        )}
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-400">24h Volume: </span>
                        <span>{tokenDetails.volume24h}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-400">Market Cap: </span>
                        <span>{tokenDetails.marketCap}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-400">Liquidity: </span>
                        <span>{tokenDetails.liquidity}</span>
                      </div>
                      <div className="text-xs col-span-2 mt-1">
                        <span className="text-gray-400">DEX: </span>
                        <span className="capitalize">{tokenDetails.dexId || "Unknown"}</span>
                      </div>
                    </div>
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
          {tokenDetails && (isAutoMode ? hasCalculatedStrategy : estimateDetails || hasCalculatedStrategy) && (
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
