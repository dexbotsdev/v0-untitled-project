"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Search, AlertCircle, CheckCircle2, Loader2, Coins, Zap, AlertTriangle, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CreateTurboBoostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateBot: (botConfig: any) => void
}

// SOL to USD conversion rate
const SOL_USD_RATE = 165

export function CreateTurboBoostDialog({ open, onOpenChange, onCreateBot }: CreateTurboBoostDialogProps) {
  // Mode switch
  const [isAutoMode, setIsAutoMode] = useState(true)

  // Token search
  const [tokenAddress, setTokenAddress] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [tokenDetails, setTokenDetails] = useState<any | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)

  // Auto mode inputs
  const [budget, setBudget] = useState("")
  const [targetVolume, setTargetVolume] = useState("")
  const [hasCalculatedStrategy, setHasCalculatedStrategy] = useState(false)

  // Bot configuration
  const [autoSwitchMigration, setAutoSwitchMigration] = useState(true)
  const [calculatedWallets, setCalculatedWallets] = useState(40)
  const [calculatedTrades, setCalculatedTrades] = useState(160)
  const [calculatedFees, setCalculatedFees] = useState(0)
  const [tradesPerInterval, setTradesPerInterval] = useState(4)
  const [minTokenAmount, setMinTokenAmount] = useState(500000)
  const [maxTokenAmount, setMaxTokenAmount] = useState(2500000)
  const [minTradeAmountSOL, setMinTradeAmountSOL] = useState(0.01)
  const [maxTradeAmountSOL, setMaxTradeAmountSOL] = useState(0.05)
  const [walletsExceedLimit, setWalletsExceedLimit] = useState(false)
  const [rawWalletCount, setRawWalletCount] = useState(0)

  // Budget validation
  const [budgetError, setBudgetError] = useState<string | null>(null)
  const [walletFundingCost, setWalletFundingCost] = useState(0)

  // Process states
  const [isCalculating, setIsCalculating] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const { toast } = useToast()

  // Calculate fees and other metrics when budget or target volume changes
  useEffect(() => {
    if (isAutoMode && budget && targetVolume) {
      const budgetSOL = Number.parseFloat(budget)
      const volumeUSD = Number.parseFloat(targetVolume)

      if (!isNaN(budgetSOL) && !isNaN(volumeUSD) && budgetSOL > 0 && volumeUSD > 0) {
        // Calculate number of trades using the formula:
        // Number of Trades = Volume in USD / (0.13 * Budget * 165)
        const calculatedTradesCount = Math.ceil(volumeUSD / (0.13 * budgetSOL * SOL_USD_RATE))

        // Calculate number of wallets using the formula:
        // Total Number of Wallets = Volume in USD / (0.49 * Budget * 165)
        const calculatedWalletsCount = Math.ceil(volumeUSD / (0.49 * budgetSOL * SOL_USD_RATE))

        // Store the raw wallet count for informational purposes
        setRawWalletCount(calculatedWalletsCount)

        // Check if wallets exceed the 1000 limit
        setWalletsExceedLimit(calculatedWalletsCount > 1000)

        // Apply wallet limit of 1000
        const recommendedWallets = Math.min(calculatedWalletsCount, 1000)

        // Calculate wallet funding cost (0.006 SOL per wallet)
        const fundingCost = recommendedWallets * 0.006

        // Check if wallet funding cost exceeds half of the budget
        // If 0.5 * Budget < No Of Faker Wallets Calculated * 0.006
        if (0.5 * budgetSOL < fundingCost) {
          setBudgetError("Not Enough Budget for Generating Volume")
        } else {
          setBudgetError(null)
        }

        // Store wallet funding cost for display
        setWalletFundingCost(fundingCost)

        // Calculate number of trades based on trades per interval
        // 4 intervals per minute, assuming 15 seconds per interval
        const tradesPerMinute = tradesPerInterval * 4
        const trades = calculatedTradesCount

        // Calculate fees (0.000052 SOL per trade)
        const totalFees = trades * 0.000052

        // Calculate suggested trade amounts based on budget
        // Min Trade Amount = 0.12 * Budget
        const minAmount = budgetSOL * 0.12

        // Max Trade Amount = 0.3 * Budget
        const maxAmount = budgetSOL * 0.3

        setCalculatedWallets(recommendedWallets)
        setCalculatedTrades(trades)
        setCalculatedFees(totalFees)
        setMinTradeAmountSOL(Number.parseFloat(minAmount.toFixed(4)))
        setMaxTradeAmountSOL(Number.parseFloat(maxAmount.toFixed(4)))
      }
    }
  }, [budget, targetVolume, isAutoMode, tradesPerInterval])

  const handleCalculate = () => {
    if (!budget || !targetVolume) {
      toast({
        title: "Missing Information",
        description: "Please enter both Budget and Target Volume",
        variant: "destructive",
      })
      return
    }

    const budgetSOL = Number.parseFloat(budget)
    const volumeUSD = Number.parseFloat(targetVolume)

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
        title: "Invalid Target Volume",
        description: "Please enter a valid target volume amount",
        variant: "destructive",
      })
      return
    }

    setIsCalculating(true)

    // Simulate calculation delay
    setTimeout(() => {
      setHasCalculatedStrategy(true)
      setIsCalculating(false)

      // Show budget error toast if applicable
      if (budgetError) {
        toast({
          title: "Budget Warning",
          description: budgetError,
          variant: "destructive",
        })
      } else {
        toast({
          title: "TurboBoost Strategy Calculated",
          description: `Strategy optimized for $${volumeUSD.toLocaleString()} volume with ${calculatedWallets} wallets`,
        })
      }
    }, 1000)
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

    // Simulate API call
    setTimeout(() => {
      // Mock token details
      const mockToken = {
        symbol: "TURBO",
        name: "TurboToken",
        address: tokenAddress,
        decimals: 9,
        totalSupply: "1000000000000",
        price: 0.00000123,
      }

      setTokenDetails(mockToken)
      setIsSearching(false)

      toast({
        title: "Token Found",
        description: `Found ${mockToken.name} (${mockToken.symbol})`,
        variant: "default",
      })
    }, 1000)
  }

  const handleCreateBot = () => {
    if (!tokenDetails) {
      toast({
        title: "Missing Token",
        description: "Please search for a token first",
        variant: "destructive",
      })
      return
    }

    if (!hasCalculatedStrategy && isAutoMode) {
      toast({
        title: "Missing Strategy",
        description: "Please calculate a strategy first",
        variant: "destructive",
      })
      return
    }

    // Prevent bot creation if budget is insufficient
    if (budgetError) {
      toast({
        title: "Insufficient Budget",
        description: "Please increase your budget or decrease your target volume",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)

    // Simulate API call
    setTimeout(() => {
      const botConfig = {
        tokenSymbol: tokenDetails.symbol,
        tokenAddress: tokenDetails.address,
        budget: Number.parseFloat(budget),
        targetVolume: Number.parseFloat(targetVolume),
        wallets: calculatedWallets,
        trades: calculatedTrades,
        fees: calculatedFees,
        tradesPerInterval: tradesPerInterval,
        minTradeAmountSOL: minTradeAmountSOL,
        maxTradeAmountSOL: maxTradeAmountSOL,
        autoSwitchMigration: autoSwitchMigration,
        minTokenAmount: minTokenAmount,
        maxTokenAmount: maxTokenAmount,
        walletsExceedLimit: walletsExceedLimit,
      }

      onCreateBot(botConfig)
      setIsCreating(false)
      resetForm()
      onOpenChange(false)

      toast({
        title: "TurboBoost Bot Created",
        description: `Successfully created TurboBoost bot for ${tokenDetails.symbol}`,
      })
    }, 1500)
  }

  const resetForm = () => {
    setIsAutoMode(true)
    setBudget("")
    setTargetVolume("")
    setTokenAddress("")
    setTokenDetails(null)
    setSearchError(null)
    setHasCalculatedStrategy(false)
    setAutoSwitchMigration(true)
    setCalculatedWallets(40)
    setCalculatedTrades(160)
    setCalculatedFees(0)
    setTradesPerInterval(4)
    setMinTradeAmountSOL(0.01)
    setMaxTradeAmountSOL(0.05)
    setMinTokenAmount(500000)
    setMaxTokenAmount(2500000)
    setBudgetError(null)
    setWalletFundingCost(0)
    setWalletsExceedLimit(false)
    setRawWalletCount(0)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(num)
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
          <DialogTitle className="text-lg font-semibold text-stone-200 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-amber-500" />
            Create TurboBoost Bot
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-120px)] px-4 pb-2">
          <div className="space-y-4 py-2">
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
                    <Zap className="h-3 w-3 mr-1 text-amber-400" />
                    <span>AI-powered configuration</span>
                  </div>
                ) : (
                  <span>Custom configuration</span>
                )}
              </div>
            </div>

            {/* AUTO MODE SECTION */}
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
                <Label htmlFor="targetVolume" className="text-xs">
                  Target Volume (USD)
                </Label>
                <Input
                  id="targetVolume"
                  type="number"
                  min="100"
                  step="100"
                  value={targetVolume}
                  onChange={(e) => setTargetVolume(e.target.value)}
                  className="bg-gray-900/50 border-gray-800 h-8 text-sm"
                />
              </div>
            </div>

            {/* Budget Error Alert */}
            {budgetError && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-800 text-red-300">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-xs">
                  {budgetError} - Wallet funding cost ({walletFundingCost.toFixed(3)} SOL) exceeds half your budget (
                  {(Number.parseFloat(budget) * 0.5).toFixed(3)} SOL)
                </AlertDescription>
              </Alert>
            )}

            {isAutoMode && (
              <Button
                variant="secondary"
                onClick={handleCalculate}
                disabled={isCalculating || !budget || !targetVolume}
                className="w-full h-8 text-sm"
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Calculating Strategy...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-3 w-3" />
                    Calculate TurboBoost Strategy
                  </>
                )}
              </Button>
            )}

            {hasCalculatedStrategy && !budgetError && (
              <div className="bg-amber-500/10 rounded-md p-2 text-xs border border-amber-500/30">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-400">
                    TurboBoost strategy calculated! We've configured the optimal settings based on your budget and
                    volume requirements.
                  </p>
                </div>
              </div>
            )}

            {/* Strategy Summary */}
            {(hasCalculatedStrategy || !isAutoMode) && (
              <Card className="border-gray-800 bg-gray-900/20">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium mb-2">TurboBoost Configuration</h3>

                  {/* Add Trades Per Interval input */}
                  <div className="mb-3">
                    <Label htmlFor="tradesPerInterval" className="text-xs">
                      Trades Per Interval (15 sec intervals, 4 intervals/min)
                    </Label>
                    <Input
                      id="tradesPerInterval"
                      type="number"
                      min="1"
                      max="20"
                      value={tradesPerInterval}
                      onChange={(e) => setTradesPerInterval(Number.parseInt(e.target.value) || 4)}
                      className="bg-gray-900/50 border-gray-800 h-8 text-sm mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div>
                      <span className="text-gray-400">Faker Wallets: </span>
                      <span className={budgetError ? "text-red-400" : "text-amber-400"}>{calculatedWallets}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Wallet Funding: </span>
                      <span className={budgetError ? "text-red-400" : "text-amber-400"}>
                        {walletFundingCost.toFixed(3)} SOL
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Trades: </span>
                      <span className="text-amber-400">{calculatedTrades}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Fees: </span>
                      <span className="text-amber-400">{calculatedFees.toFixed(6)} SOL</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Min Trade Amount: </span>
                      <span className="text-gray-300">{minTradeAmountSOL} SOL</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Max Trade Amount: </span>
                      <span className="text-gray-300">{maxTradeAmountSOL} SOL</span>
                    </div>
                    <div className="col-span-2 mt-1">
                      <span className="text-xs text-gray-400">
                        Trade amounts are set to 12% and 30% of your budget.
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Min Token Amount: </span>
                      <span className="text-gray-300">{formatNumber(minTokenAmount)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Max Token Amount: </span>
                      <span className="text-gray-300">{formatNumber(maxTokenAmount)}</span>
                    </div>
                  </div>

                  {/* Wallet Info Alert */}
                  {walletsExceedLimit && (
                    <Alert className="mt-3 bg-blue-900/20 border-blue-800 text-blue-300">
                      <Info className="h-4 w-4 text-blue-400" />
                      <AlertDescription className="text-xs">
                        Calculated wallets ({formatNumber(rawWalletCount)}) exceed the limit of 1,000. Wallets will be
                        repeated for additional trades.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="autoSwitchMigration"
                        checked={autoSwitchMigration}
                        onCheckedChange={(checked) => setAutoSwitchMigration(checked === true)}
                        className="data-[state=checked]:bg-amber-600"
                      />
                      <Label htmlFor="autoSwitchMigration" className="text-xs cursor-pointer">
                        Enable AutoSwitch On Migration
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                  {/* Token image */}
                  <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center overflow-hidden">
                    <Coins className="h-6 w-6 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">
                      {tokenDetails.name} ({tokenDetails.symbol})
                    </h3>
                    <div className="text-xs text-gray-400 mt-1">
                      <span>Token Address: </span>
                      <span className="text-gray-300 font-mono">
                        {tokenDetails.address.substring(0, 8)}...
                        {tokenDetails.address.substring(tokenDetails.address.length - 8)}
                      </span>
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
          {tokenDetails && ((isAutoMode && hasCalculatedStrategy) || !isAutoMode) && (
            <Button
              onClick={handleCreateBot}
              disabled={isCreating || budgetError !== null}
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
                  Create TurboBoost Bot
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
