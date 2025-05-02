"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpRight, ArrowDownRight, ExternalLink, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CoinDataProps {
  name: string
  symbol: string
  address: string
  launchedDate: string
  devAddress: string
  image?: string | null
  marketCap?: number
  priceChange?: number
  price?: number
  usdMarketCap?: number
  isLoading?: boolean
  isPumpSwapMigrated?: boolean
  lastUpdated?: string
  platform?: string
}

interface PnlCardProps {
  isTaskRunning: boolean
  coinSymbol: string
  coinData: CoinDataProps
  hasBundleCompleted?: boolean
}

export function PnlCard({ isTaskRunning, coinSymbol, coinData, hasBundleCompleted = false }: PnlCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const formatMarketCap = (value?: number) => {
    if (value === undefined) return "N/A"
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`
    }
    return `$${value.toFixed(2)}`
  }

  const formatPrice = (price?: number) => {
    if (price === undefined) return "N/A"
    if (price < 0.000001) {
      return `$${price.toExponential(2)}`
    }
    return `$${price.toFixed(6)}`
  }

  return (
    <Card className="bg-[#11111D] border-gray-800 text-[#ECF1F0] shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
              {coinData.image ? (
                <img
                  src={coinData.image || "/placeholder.svg"}
                  alt={coinData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-white">{coinData.symbol.substring(0, 2)}</span>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#ECF1F0]">{coinData.name}</h3>
              <div className="flex items-center">
                <span className="text-xs text-gray-400">{coinData.symbol}</span>
                {coinData.platform && (
                  <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-amber-700/30 rounded text-amber-300">
                    {coinData.platform}
                  </span>
                )}
                {coinData.isPumpSwapMigrated && (
                  <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-green-700/30 rounded text-green-300">
                    PumpSwap
                  </span>
                )}
              </div>
            </div>
          </div>
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

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[#1A1A1A] rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Price</p>
            {coinData.isLoading ? (
              <Skeleton className="h-6 w-24 bg-gray-700" />
            ) : (
              <div className="flex items-center">
                <p className="text-lg font-semibold text-[#ECF1F0]">{formatPrice(coinData.price)}</p>
                {coinData.priceChange !== undefined && (
                  <div
                    className={`flex items-center ml-2 ${
                      coinData.priceChange >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {coinData.priceChange >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    <span className="text-xs">{Math.abs(coinData.priceChange).toFixed(2)}%</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-[#1A1A1A] rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Market Cap</p>
            {coinData.isLoading ? (
              <Skeleton className="h-6 w-24 bg-gray-700" />
            ) : (
              <p className="text-lg font-semibold text-[#ECF1F0]">
                {formatMarketCap(coinData.usdMarketCap || coinData.marketCap)}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Launched</p>
            <p className="text-sm text-[#ECF1F0]">{coinData.launchedDate || "Not launched yet"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Last Updated</p>
            <p className="text-sm text-[#ECF1F0]">{coinData.lastUpdated || "Never"}</p>
          </div>
        </div>

        {coinData.address && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400 mb-1">Coin Address</p>
                <div className="flex items-center">
                  <p className="text-sm text-amber-400">
                    {coinData.address.substring(0, 8)}...{coinData.address.substring(coinData.address.length - 8)}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-1 text-gray-400 hover:text-gray-300"
                    onClick={() => {
                      navigator.clipboard.writeText(coinData.address)
                    }}
                    title="Copy address"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">Dev Wallet</p>
                {coinData.devAddress ? (
                  <p className="text-sm text-amber-400">
                    {coinData.devAddress.substring(0, 6)}...
                    {coinData.devAddress.substring(coinData.devAddress.length - 4)}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">Not set</p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
