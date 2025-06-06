"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowUp, ArrowDown, DollarSign, Calendar, User, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface PnlCardProps {
  isTaskRunning: boolean
  tokenSymbol: string
  tokenData?: {
    name: string
    symbol: string
    address: string
    launchedDate?: string
    devAddress?: string
    image?: string | null
    marketCap?: number
    usdMarketCap?: number
    price?: number
    priceChange?: number
    isLoading?: boolean
    isPumpSwapMigrated?: boolean
    lastUpdated?: string
    platform?: string // Add platform property
  }
  hasBundleCompleted?: boolean
}

export function PnlCard({ isTaskRunning, tokenSymbol, tokenData, hasBundleCompleted = false }: PnlCardProps) {
  const [marketCap, setMarketCap] = useState<number>(0)
  const [change, setChange] = useState<number>(0)
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [displayCurrency, setDisplayCurrency] = useState<"sol" | "usd">("sol")

  // Add PNL calculation after market cap initialization
  const [pnlData, setPnlData] = useState<{
    initialInvestment: number
    currentValue: number
    profitLoss: number
    profitLossPercentage: number
  }>({
    initialInvestment: 0,
    currentValue: 0,
    profitLoss: 0,
    profitLossPercentage: 0,
  })

  // Use a ref to track the current market cap without causing re-renders
  const marketCapRef = useRef<number>(0)

  // Initialize market cap when task starts running or when tokenData.marketCap changes
  useEffect(() => {
    // If we have real market cap data from the API, use it
    if (tokenData?.marketCap) {
      setMarketCap(tokenData.marketCap)
      marketCapRef.current = tokenData.marketCap

      // Calculate mock PNL data
      const initialInvestment = 10 // Mock initial investment of 10 SOL
      const currentValue = initialInvestment * (1 + (tokenData.priceChange || 0) / 100)
      const profitLoss = currentValue - initialInvestment
      const profitLossPercentage = ((currentValue - initialInvestment) / initialInvestment) * 100

      setPnlData({
        initialInvestment,
        currentValue,
        profitLoss,
        profitLossPercentage,
      })

      // If we have real price change data, use it
      if (tokenData.priceChange !== undefined) {
        setChange(tokenData.priceChange)
      }

      // If we have a lastUpdated timestamp, use it
      if (tokenData.lastUpdated) {
        setLastUpdate(tokenData.lastUpdated)
      } else {
        setLastUpdate(new Date().toLocaleTimeString())
      }
    }
  }, [tokenData?.marketCap, tokenData?.priceChange, tokenData?.lastUpdated])

  // Format market cap with commas and 2 decimal places
  const formattedMarketCap = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(marketCap)

  // Also add USD market cap if available
  const formattedUsdMarketCap = tokenData?.usdMarketCap
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 6,
        maximumFractionDigits: 6,
      }).format(tokenData.usdMarketCap)
    : null

  // Default values for token data if not provided
  const tokenName = tokenData?.name || "Unknown Token"
  const symbol = tokenData?.symbol || tokenSymbol || "???"
  const launchedDate = tokenData?.launchedDate || "Not available"
  const devAddress = tokenData?.devAddress || "Not available"
  const tokenAddress = tokenData?.address || ""
  const tokenImage = tokenData?.image || null
  const isLoading = tokenData?.isLoading || false

  // Check if token has an address
  const hasAddress = tokenAddress && tokenAddress.trim() !== ""

  // Abbreviate addresses for display
  const abbreviateAddress = (address: string) => {
    if (address === "Not available" || !address) return address
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-sm border border-gray-800 bg-[#11111D] mb-1">
      <div className="p-3">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          {/* Token Icon */}
          <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
            {tokenImage ? (
              <img src={tokenImage || "/placeholder.svg"} alt={symbol} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-green flex items-center justify-center">
                <span className="text-lg font-bold text-white">{symbol.substring(0, 2)}</span>
              </div>
            )}
          </div>

          {/* Token Details */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1">
            <div>
              <p className="text-xs text-gray-400">Token Name</p>
              <p className="text-sm font-medium text-[#ECF1F0] truncate">
                {tokenName}
                {tokenData?.isPumpSwapMigrated && (
                  <span className="ml-1 text-xs text-green-400">[Migrated to PumpSwap]</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Symbol</p>
              <p className="text-sm font-medium text-[#ECF1F0]">{symbol}</p>
            </div>

            {/* Only show launched date for tokens with address */}
            {hasAddress ? (
              <div>
                <p className="text-xs text-gray-400 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" /> Launched
                </p>
                <p className="text-xs text-[#ECF1F0]">{launchedDate}</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-gray-400">Status</p>
                <p className="text-xs text-amber-400">{hasBundleCompleted ? "Bundle Completed" : "Pending Bundle"}</p>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-400 flex items-center">
                <User className="h-3 w-3 mr-1" /> Dev
              </p>
              <p className="text-xs text-amber-400 truncate">
                {hasAddress ? abbreviateAddress(devAddress) : "Not assigned yet"}
              </p>
            </div>

            {/* Display platform if available */}
            {tokenData?.platform && (
              <div className="sm:col-span-2">
                <p className="text-xs text-gray-400">Platform</p>
                <p className="text-xs text-green-400">{tokenData.platform}</p>
              </div>
            )}
          </div>
        </div>

        {/* Add this section after the token details and before the divider */}
        {(hasAddress || hasBundleCompleted) && (
          <div className="flex justify-end mt-2">
            <div className="flex items-center space-x-2 bg-[#1A1A1A] rounded-md p-1">
              <button
                onClick={() => setDisplayCurrency("sol")}
                className={cn(
                  "px-2 py-1 text-xs rounded transition-colors",
                  displayCurrency === "sol" ? "bg-amber-600 text-white" : "text-gray-400 hover:text-gray-300",
                )}
              >
                SOL
              </button>
              <button
                onClick={() => setDisplayCurrency("usd")}
                className={cn(
                  "px-2 py-1 text-xs rounded transition-colors",
                  displayCurrency === "usd" ? "bg-amber-600 text-white" : "text-gray-400 hover:text-gray-300",
                )}
              >
                USD
              </button>
            </div>
          </div>
        )}

        {/* Divider - only show if we have market data to display */}
        {(hasAddress || hasBundleCompleted) && <div className="h-px bg-gray-800 my-3"></div>}

        {/* Market Performance - only show for tokens with address or completed bundle */}
        {hasAddress || hasBundleCompleted ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
            <div className="space-y-1">
              <p className="text-xs text-gray-400">Market Cap</p>
              {isLoading ? (
                <div className="flex items-center h-5">
                  <div className="animate-pulse h-3 w-20 bg-gray-700 rounded"></div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <DollarSign className="h-3.5 w-3.5 mr-1 text-[#0FAE96]" />
                    <p className="text-sm font-medium text-[#ECF1F0]">
                      {displayCurrency === "sol" ? `${(marketCap / 103).toFixed(0)} SOL` : formattedMarketCap}
                    </p>
                  </div>
                  {displayCurrency === "usd" && formattedUsdMarketCap && (
                    <p className="text-xs text-gray-400 mt-0.5">{formattedUsdMarketCap} USD</p>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-400">PNL</p>
              {isLoading ? (
                <div className="flex items-center h-5">
                  <div className="animate-pulse h-3 w-16 bg-gray-700 rounded"></div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="flex items-center">
                    {pnlData.profitLoss >= 0 ? (
                      <ArrowUp className="h-3.5 w-3.5 mr-1 text-green-500" />
                    ) : (
                      <ArrowDown className="h-3.5 w-3.5 mr-1 text-red-500" />
                    )}
                    <p
                      className={cn("text-sm font-medium", pnlData.profitLoss >= 0 ? "text-green-500" : "text-red-500")}
                    >
                      {pnlData.profitLoss >= 0 ? "+" : ""}
                      {pnlData.profitLoss.toFixed(3)} SOL
                    </p>
                  </div>
                  <p className={cn("text-xs", pnlData.profitLossPercentage >= 0 ? "text-green-400" : "text-red-400")}>
                    {pnlData.profitLossPercentage >= 0 ? "+" : ""}
                    {pnlData.profitLossPercentage.toFixed(2)}%
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">Price</p>
                <div className="flex items-center text-[10px] text-gray-400">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{lastUpdate || tokenData?.lastUpdated || "N/A"}</span>
                </div>
              </div>
              <p className="text-xs text-amber-400 truncate">{tokenData?.price || "N/A"}</p>
            </div>
          </div>
        ) : (
          <div className="mt-2 flex items-center justify-center p-2 bg-[#1A1A1A] rounded-md">
            <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
            <p className="text-xs text-gray-300">Complete the Bundle task to view market performance data</p>
          </div>
        )}
      </div>
    </div>
  )
}
