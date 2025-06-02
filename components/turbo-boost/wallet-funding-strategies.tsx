"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WalletFundingStrategiesProps {
  wallets: any[]
  budget: number
  onApplyStrategy: (strategy: any) => Promise<void>
  isApplying: boolean
}

export function WalletFundingStrategies({
  wallets,
  budget,
  onApplyStrategy,
  isApplying,
}: WalletFundingStrategiesProps) {
  const [selectedTab, setSelectedTab] = useState("even")
  const [evenAmount, setEvenAmount] = useState("0.006")
  const [minAmount, setMinAmount] = useState("0.004")
  const [maxAmount, setMaxAmount] = useState("0.008")
  const [weightedRatio, setWeightedRatio] = useState([30, 70])
  const [optimizeForTrades, setOptimizeForTrades] = useState(true)
  const { toast } = useToast()

  // Handle apply strategy
  const handleApplyStrategy = async () => {
    const strategy: any = {
      type: selectedTab,
    }

    if (selectedTab === "even") {
      const amount = Number.parseFloat(evenAmount)
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid funding amount",
          variant: "destructive",
        })
        return
      }
      strategy.amount = amount
    } else if (selectedTab === "random") {
      const min = Number.parseFloat(minAmount)
      const max = Number.parseFloat(maxAmount)
      if (isNaN(min) || isNaN(max) || min <= 0 || max <= 0 || min >= max) {
        toast({
          title: "Invalid Range",
          description: "Please enter a valid min/max range",
          variant: "destructive",
        })
        return
      }
      strategy.minAmount = min
      strategy.maxAmount = max
    } else if (selectedTab === "weighted") {
      strategy.ratio = weightedRatio
      strategy.optimizeForTrades = optimizeForTrades
    }

    await onApplyStrategy(strategy)
  }

  // Calculate total funding required
  const calculateTotalFunding = (): number => {
    const unfundedWallets = wallets.filter((w) => w.status === "generated").length

    if (selectedTab === "even") {
      return unfundedWallets * Number.parseFloat(evenAmount || "0")
    } else if (selectedTab === "random") {
      const min = Number.parseFloat(minAmount || "0")
      const max = Number.parseFloat(maxAmount || "0")
      return unfundedWallets * ((min + max) / 2) // Average
    } else if (selectedTab === "weighted") {
      // Simplified calculation for UI purposes
      const baseAmount = 0.006
      return unfundedWallets * baseAmount
    }

    return 0
  }

  // Format SOL amount
  const formatSol = (amount: number): string => {
    return amount.toFixed(4) + " SOL"
  }

  // Check if budget is sufficient
  const isBudgetSufficient = (): boolean => {
    return calculateTotalFunding() <= budget
  }

  return (
    <Card className="border-gray-800 bg-gray-900/30">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">Funding Strategies</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="bg-gray-800/50 w-full grid grid-cols-3">
            <TabsTrigger value="even" className="data-[state=active]:bg-gray-700 text-xs">
              Even Distribution
            </TabsTrigger>
            <TabsTrigger value="random" className="data-[state=active]:bg-gray-700 text-xs">
              Random Range
            </TabsTrigger>
            <TabsTrigger value="weighted" className="data-[state=active]:bg-gray-700 text-xs">
              Weighted
            </TabsTrigger>
          </TabsList>

          <TabsContent value="even" className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="evenAmount" className="text-xs">
                  SOL Amount per Wallet
                </Label>
                <Input
                  id="evenAmount"
                  type="number"
                  min="0.001"
                  step="0.001"
                  value={evenAmount}
                  onChange={(e) => setEvenAmount(e.target.value)}
                  className="bg-gray-900/50 border-gray-800 h-8 text-sm"
                />
                <p className="text-xs text-gray-500">Recommended: 0.006 SOL per wallet</p>
              </div>

              <div className="bg-gray-800/50 p-3 rounded-md text-xs">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Unfunded Wallets:</span>
                  <span className="text-gray-300">{wallets.filter((w) => w.status === "generated").length}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Amount per Wallet:</span>
                  <span className="text-gray-300">{formatSol(Number.parseFloat(evenAmount || "0"))}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-400">Total Required:</span>
                  <span className={isBudgetSufficient() ? "text-green-400" : "text-red-400"}>
                    {formatSol(calculateTotalFunding())}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="random" className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="minAmount" className="text-xs">
                    Minimum SOL
                  </Label>
                  <Input
                    id="minAmount"
                    type="number"
                    min="0.001"
                    step="0.001"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    className="bg-gray-900/50 border-gray-800 h-8 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAmount" className="text-xs">
                    Maximum SOL
                  </Label>
                  <Input
                    id="maxAmount"
                    type="number"
                    min="0.001"
                    step="0.001"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    className="bg-gray-900/50 border-gray-800 h-8 text-sm"
                  />
                </div>
              </div>

              <div className="bg-gray-800/50 p-3 rounded-md text-xs">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Unfunded Wallets:</span>
                  <span className="text-gray-300">{wallets.filter((w) => w.status === "generated").length}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Amount Range:</span>
                  <span className="text-gray-300">
                    {formatSol(Number.parseFloat(minAmount || "0"))} - {formatSol(Number.parseFloat(maxAmount || "0"))}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-400">Estimated Total:</span>
                  <span className={isBudgetSufficient() ? "text-green-400" : "text-red-400"}>
                    {formatSol(calculateTotalFunding())}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="weighted" className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Distribution Ratio</Label>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Low</span>
                  <Slider
                    value={[weightedRatio[0]]}
                    min={10}
                    max={90}
                    step={5}
                    onValueChange={(value) => setWeightedRatio([value[0], 100 - value[0]])}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-500">High</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{weightedRatio[0]}% Low Volume</span>
                  <span>{weightedRatio[1]}% High Volume</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="optimizeForTrades"
                  checked={optimizeForTrades}
                  onCheckedChange={setOptimizeForTrades}
                  className="data-[state=checked]:bg-amber-600"
                />
                <Label htmlFor="optimizeForTrades" className="text-xs cursor-pointer">
                  Optimize for maximum trades
                </Label>
              </div>

              <div className="bg-gray-800/50 p-3 rounded-md text-xs">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Unfunded Wallets:</span>
                  <span className="text-gray-300">{wallets.filter((w) => w.status === "generated").length}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Distribution:</span>
                  <span className="text-gray-300">
                    {weightedRatio[0]}% / {weightedRatio[1]}%
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-400">Estimated Total:</span>
                  <span className={isBudgetSufficient() ? "text-green-400" : "text-red-400"}>
                    {formatSol(calculateTotalFunding())}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="p-4 pt-0">
          <Button
            onClick={handleApplyStrategy}
            disabled={isApplying || !isBudgetSufficient()}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
          >
            {isApplying ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Applying Strategy...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Apply {selectedTab === "even" ? "Even" : selectedTab === "random" ? "Random" : "Weighted"} Strategy
              </>
            )}
          </Button>

          {!isBudgetSufficient() && (
            <p className="text-xs text-red-400 mt-2 text-center">
              Insufficient budget for this strategy. Please adjust parameters or increase budget.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
