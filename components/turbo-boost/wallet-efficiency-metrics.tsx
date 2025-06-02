"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface WalletEfficiencyMetricsProps {
  wallets: any[]
  totalTrades: number
  completedTrades: number
  volumeGenerated: number
  targetVolume: number
}

export function WalletEfficiencyMetrics({
  wallets,
  totalTrades,
  completedTrades,
  volumeGenerated,
  targetVolume,
}: WalletEfficiencyMetricsProps) {
  // Calculate metrics
  const activeWallets = wallets.filter((w) => w.status === "funded" || w.status === "used").length
  const totalWallets = wallets.length
  const walletUtilization = totalWallets > 0 ? (activeWallets / totalWallets) * 100 : 0

  const tradesPerWallet = activeWallets > 0 ? completedTrades / activeWallets : 0
  const volumePerWallet = activeWallets > 0 ? volumeGenerated / activeWallets : 0
  const tradeProgress = totalTrades > 0 ? (completedTrades / totalTrades) * 100 : 0
  const volumeProgress = targetVolume > 0 ? (volumeGenerated / targetVolume) * 100 : 0

  // Format numbers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(num)
  }

  return (
    <Card className="border-gray-800 bg-gray-900/30">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">Wallet Efficiency Metrics</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">Wallet Utilization</span>
              <span className="text-xs font-medium text-amber-400">{walletUtilization.toFixed(1)}%</span>
            </div>
            <Progress value={walletUtilization} className="h-1.5 bg-gray-800" indicatorClassName="bg-amber-500" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{activeWallets} active wallets</span>
              <span>{totalWallets} total wallets</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">Trade Completion</span>
              <span className="text-xs font-medium text-green-400">{tradeProgress.toFixed(1)}%</span>
            </div>
            <Progress value={tradeProgress} className="h-1.5 bg-gray-800" indicatorClassName="bg-green-500" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{completedTrades} completed</span>
              <span>{totalTrades} total trades</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">Volume Progress</span>
              <span className="text-xs font-medium text-blue-400">{volumeProgress.toFixed(1)}%</span>
            </div>
            <Progress value={volumeProgress} className="h-1.5 bg-gray-800" indicatorClassName="bg-blue-500" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>${formatNumber(volumeGenerated)} generated</span>
              <span>${formatNumber(targetVolume)} target</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-gray-800/50 p-3 rounded">
              <div className="text-xs font-medium text-gray-400 mb-1">Trades per Wallet</div>
              <div className="text-lg font-semibold text-white">{tradesPerWallet.toFixed(1)}</div>
              <div className="text-xs text-gray-500 mt-1">Efficiency ratio</div>
            </div>
            <div className="bg-gray-800/50 p-3 rounded">
              <div className="text-xs font-medium text-gray-400 mb-1">Volume per Wallet</div>
              <div className="text-lg font-semibold text-white">${formatNumber(volumePerWallet)}</div>
              <div className="text-xs text-gray-500 mt-1">Performance metric</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
