"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PathBreadcrumb } from "@/components/path-breadcrumb"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw, Zap, Trash2, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CreateTurboBoostDialog } from "@/components/turbo-boost/create-turbo-boost-dialog"
import { TagWalletsDialog } from "@/components/turbo-boost/tag-wallets-dialog"
import { ActivityLogger } from "@/components/turbo-boost/activity-logger"
import { WalletDistributionChart } from "@/components/turbo-boost/wallet-distribution-chart"
import { WalletEfficiencyMetrics } from "@/components/turbo-boost/wallet-efficiency-metrics"
import { WalletBatchManager } from "@/components/turbo-boost/wallet-batch-manager"
import { WalletFundingStrategies } from "@/components/turbo-boost/wallet-funding-strategies"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function TurboBoostBotPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [activeBots, setActiveBots] = useState<any[]>([])
  const [selectedBot, setSelectedBot] = useState<any | null>(null)
  const [isGeneratingWallets, setIsGeneratingWallets] = useState(false)
  const [isFundingWallets, setIsFundingWallets] = useState(false)
  const [isRecoveringSol, setIsRecoveringSol] = useState(false)
  const [isTaggingWallets, setIsTaggingWallets] = useState(false)
  const [isDeletingWallets, setIsDeletingWallets] = useState(false)
  const [isApplyingStrategy, setIsApplyingStrategy] = useState(false)
  const [selectedWalletsTab, setSelectedWalletsTab] = useState("overview")

  const { toast } = useToast()

  const handleCreateBot = (botConfig: any) => {
    const newBot = {
      id: Date.now().toString(),
      name: `TurboBoost Bot ${activeBots.length + 1}`,
      tokenSymbol: botConfig.tokenSymbol || "TOKEN",
      tokenAddress: botConfig.tokenAddress,
      budget: botConfig.budget,
      targetVolume: botConfig.targetVolume,
      wallets: botConfig.wallets || 40,
      trades: botConfig.trades || 160,
      progress: 0,
      status: "ready", // ready, active, paused, completed
      createdAt: new Date().toISOString(),
      stats: {
        tokensTraded: 0,
        volumeGenerated: 0,
        tradesCompleted: 0,
        walletsUsed: 0,
        feesSpent: 0,
        walletsGenerated: 0,
        walletsFunded: 0,
      },
      // Mock wallet data for demonstration
      walletData: Array(40)
        .fill(0)
        .map((_, i) => ({
          id: `wallet-${i}`,
          address: `${i}xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosg`,
          status: i < 10 ? "used" : i < 25 ? "funded" : "generated",
          solBalance: i < 10 ? 0.001 : i < 25 ? 0.006 : 0,
          tokenBalance: i < 10 ? 1 : 0,
          tradesCount: i < 10 ? Math.floor(Math.random() * 5) + 1 : 0,
          lastTrade: i < 10 ? new Date().toISOString() : null,
          tag: i < 5 ? "turboboost" : null,
        })),
    }

    setActiveBots((prev) => [...prev, newBot])
    setSelectedBot(newBot)
  }

  const startBot = (botId: string) => {
    setActiveBots((prev) => prev.map((bot) => (bot.id === botId ? { ...bot, status: "active", progress: 0 } : bot)))

    if (selectedBot?.id === botId) {
      setSelectedBot((prev) => (prev ? { ...prev, status: "active", progress: 0 } : null))
    }
  }

  const pauseBot = (botId: string) => {
    setActiveBots((prev) => prev.map((bot) => (bot.id === botId ? { ...bot, status: "paused" } : bot)))

    if (selectedBot?.id === botId) {
      setSelectedBot((prev) => (prev ? { ...prev, status: "paused" } : null))
    }
  }

  const deleteBot = (botId: string) => {
    setActiveBots((prev) => prev.filter((bot) => bot.id !== botId))

    if (selectedBot?.id === botId) {
      setSelectedBot(null)
    }

    setIsDeleteDialogOpen(false)

    toast({
      title: "Bot Deleted",
      description: "The TurboBoost bot has been deleted successfully.",
    })
  }

  const handleGenerateWallets = async (count = 10) => {
    if (!selectedBot) return

    setIsGeneratingWallets(true)

    // Simulate API call with delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update the bot with generated wallets
    const newWallets = Array(count)
      .fill(0)
      .map((_, i) => {
        const index = selectedBot.walletData.length + i
        return {
          id: `wallet-${Date.now()}-${i}`,
          address: `${index}xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosg`,
          status: "generated",
          solBalance: 0,
          tokenBalance: 0,
          tradesCount: 0,
          lastTrade: null,
          tag: null,
        }
      })

    const updatedBot = {
      ...selectedBot,
      walletData: [...selectedBot.walletData, ...newWallets],
      stats: {
        ...selectedBot.stats,
        walletsGenerated: selectedBot.stats.walletsGenerated + count,
      },
    }

    setActiveBots((prev) => prev.map((bot) => (bot.id === selectedBot.id ? updatedBot : bot)))

    setSelectedBot(updatedBot)
    setIsGeneratingWallets(false)

    toast({
      title: "Wallets Generated",
      description: `Successfully generated ${count} wallets.`,
    })
  }

  const handleTagWallets = async (wallets: string[], tag: string) => {
    if (!selectedBot) return

    setIsTaggingWallets(true)

    // Simulate API call with delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update the bot with tagged wallets
    const updatedWalletData = selectedBot.walletData.map((wallet: any) => {
      if (wallets.includes(wallet.address)) {
        return {
          ...wallet,
          tag,
        }
      }
      return wallet
    })

    const updatedBot = {
      ...selectedBot,
      walletData: updatedWalletData,
    }

    setActiveBots((prev) => prev.map((bot) => (bot.id === selectedBot.id ? updatedBot : bot)))

    setSelectedBot(updatedBot)
    setIsTaggingWallets(false)

    toast({
      title: "Wallets Tagged",
      description: `Successfully tagged ${wallets.length} wallets with "${tag}".`,
    })
  }

  const handleFundWallets = async (wallets: string[], amount = 0.006) => {
    if (!selectedBot) return

    setIsFundingWallets(true)

    // Simulate API call with delay
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Update the bot with funded wallets
    const updatedWalletData = selectedBot.walletData.map((wallet: any) => {
      if (wallets.includes(wallet.address) && wallet.status === "generated") {
        return {
          ...wallet,
          status: "funded",
          solBalance: amount,
        }
      }
      return wallet
    })

    const fundedCount = updatedWalletData.filter(
      (w: any) => wallets.includes(w.address) && w.status === "funded",
    ).length

    const updatedBot = {
      ...selectedBot,
      walletData: updatedWalletData,
      stats: {
        ...selectedBot.stats,
        walletsFunded: selectedBot.stats.walletsFunded + fundedCount,
      },
    }

    setActiveBots((prev) => prev.map((bot) => (bot.id === selectedBot.id ? updatedBot : bot)))

    setSelectedBot(updatedBot)
    setIsFundingWallets(false)

    toast({
      title: "Wallets Funded",
      description: `Successfully funded ${fundedCount} wallets with ${amount} SOL each.`,
    })
  }

  const handleDeleteWallets = async (wallets: string[]) => {
    if (!selectedBot) return

    setIsDeletingWallets(true)

    // Simulate API call with delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update the bot by removing the wallets
    const updatedWalletData = selectedBot.walletData.filter((wallet: any) => !wallets.includes(wallet.address))

    const deletedCount = selectedBot.walletData.length - updatedWalletData.length

    // Update stats based on deleted wallets
    const deletedGenerated = selectedBot.walletData.filter(
      (w: any) => wallets.includes(w.address) && w.status === "generated",
    ).length
    const deletedFunded = selectedBot.walletData.filter(
      (w: any) => wallets.includes(w.address) && w.status === "funded",
    ).length
    const deletedUsed = selectedBot.walletData.filter(
      (w: any) => wallets.includes(w.address) && w.status === "used",
    ).length

    const updatedBot = {
      ...selectedBot,
      walletData: updatedWalletData,
      stats: {
        ...selectedBot.stats,
        walletsGenerated: selectedBot.stats.walletsGenerated - deletedGenerated,
        walletsFunded: selectedBot.stats.walletsFunded - deletedFunded,
        walletsUsed: selectedBot.stats.walletsUsed - deletedUsed,
      },
    }

    setActiveBots((prev) => prev.map((bot) => (bot.id === selectedBot.id ? updatedBot : bot)))

    setSelectedBot(updatedBot)
    setIsDeletingWallets(false)

    toast({
      title: "Wallets Deleted",
      description: `Successfully deleted ${deletedCount} wallets.`,
    })
  }

  const handleRecoverSol = async () => {
    if (!selectedBot) return

    setIsRecoveringSol(true)

    // Simulate API call with delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Update the bot with recovered SOL
    const updatedWalletData = selectedBot.walletData.map((wallet: any) => {
      if (wallet.status === "funded" || wallet.status === "used") {
        return {
          ...wallet,
          status: wallet.status === "used" ? "used" : "generated",
          solBalance: 0,
        }
      }
      return wallet
    })

    const updatedBot = {
      ...selectedBot,
      walletData: updatedWalletData,
      stats: {
        ...selectedBot.stats,
        walletsFunded: 0,
      },
    }

    setActiveBots((prev) => prev.map((bot) => (bot.id === selectedBot.id ? updatedBot : bot)))

    setSelectedBot(updatedBot)
    setIsRecoveringSol(false)

    const recoveredAmount = (selectedBot.stats.walletsFunded * 0.006).toFixed(3)

    toast({
      title: "SOL Recovered",
      description: `Successfully recovered ${recoveredAmount} SOL from wallets.`,
    })
  }

  const handleApplyFundingStrategy = async (strategy: any) => {
    if (!selectedBot) return

    setIsApplyingStrategy(true)

    // Simulate API call with delay
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Get unfunded wallets
    const unfundedWallets = selectedBot.walletData
      .filter((w: any) => w.status === "generated")
      .map((w: any) => w.address)

    // Apply funding strategy
    let fundingAmount = 0.006 // Default

    if (strategy.type === "even") {
      fundingAmount = strategy.amount
      await handleFundWallets(unfundedWallets, fundingAmount)
    } else if (strategy.type === "random") {
      // For random, we'll use the average for the simulation
      fundingAmount = (strategy.minAmount + strategy.maxAmount) / 2
      await handleFundWallets(unfundedWallets, fundingAmount)
    } else if (strategy.type === "weighted") {
      // For weighted, we'll use a base amount for the simulation
      fundingAmount = 0.006
      await handleFundWallets(unfundedWallets, fundingAmount)
    }

    setIsApplyingStrategy(false)

    toast({
      title: "Funding Strategy Applied",
      description: `Successfully applied ${strategy.type} funding strategy to ${unfundedWallets.length} wallets.`,
    })
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(num)
  }

  // Check if any bot is created
  const isBotCreated = activeBots.length > 0

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <PathBreadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "TurboBoost Bot", href: "/turbo-boost-bot" },
          ]}
        />
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white"
          disabled={isBotCreated} // Disable if a bot is already created
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Bot
        </Button>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        {activeBots.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="bg-gray-800/30 rounded-full p-6 mb-4">
              <Zap className="h-12 w-12 text-amber-500 opacity-70" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No TurboBoost Bots Created</h2>
            <p className="text-gray-400 text-center max-w-md mb-6">
              Create your first TurboBoost bot to accelerate trading volume with optimized wallet management.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Create TurboBoost Bot
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Bot List and Activity Logger */}
            <div className="lg:col-span-1 space-y-4">
              {activeBots.map((bot) => (
                <Card
                  key={bot.id}
                  className={`border-gray-800 bg-gray-950 hover:bg-gray-900/50 transition-colors cursor-pointer ${
                    selectedBot?.id === bot.id ? "ring-1 ring-amber-500/50" : ""
                  }`}
                  onClick={() => setSelectedBot(bot)}
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-md flex items-center">
                          {bot.tokenSymbol}
                          <Badge
                            className={`ml-2 ${
                              bot.status === "active"
                                ? "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                                : bot.status === "paused"
                                  ? "bg-amber-600/20 text-amber-400 hover:bg-amber-600/30"
                                  : bot.status === "completed"
                                    ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
                                    : "bg-gray-600/20 text-gray-400 hover:bg-gray-600/30"
                            }`}
                          >
                            {bot.status === "active"
                              ? "Active"
                              : bot.status === "paused"
                                ? "Paused"
                                : bot.status === "completed"
                                  ? "Completed"
                                  : "Ready"}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-gray-400 text-xs">
                          Created {new Date(bot.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                      <div>
                        <span className="text-gray-500">Budget:</span>{" "}
                        <span className="text-gray-300">{bot.budget} SOL</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Target:</span>{" "}
                        <span className="text-gray-300">${formatNumber(bot.targetVolume)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Wallets:</span>{" "}
                        <span className="text-gray-300">{bot.wallets}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Trades:</span>{" "}
                        <span className="text-gray-300">{bot.trades}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-amber-400">{bot.progress}%</span>
                      </div>
                      <Progress value={bot.progress} className="h-1 bg-gray-800" indicatorClassName="bg-amber-500" />
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Activity Logger in Left Column */}
              {selectedBot && (
                <ActivityLogger botId={selectedBot.id} isActive={selectedBot.status === "active"} maxHeight="300px" />
              )}
            </div>

            {/* Right Column - Selected Bot Details */}
            {selectedBot && (
              <div className="lg:col-span-2">
                <Card className="border-gray-800 bg-gray-950">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl flex items-center">
                          {selectedBot.tokenSymbol} TurboBoost
                          <Badge
                            className={`ml-2 ${
                              selectedBot.status === "active"
                                ? "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                                : selectedBot.status === "paused"
                                  ? "bg-amber-600/20 text-amber-400 hover:bg-amber-600/30"
                                  : selectedBot.status === "completed"
                                    ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
                                    : "bg-gray-600/20 text-gray-400 hover:bg-gray-600/30"
                            }`}
                          >
                            {selectedBot.status === "active"
                              ? "Active"
                              : selectedBot.status === "paused"
                                ? "Paused"
                                : selectedBot.status === "completed"
                                  ? "Completed"
                                  : "Ready"}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          TurboBoost trading bot for {selectedBot.tokenSymbol}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        {selectedBot.status === "ready" || selectedBot.status === "paused" ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30 hover:text-green-300"
                              onClick={() => startBot(selectedBot.id)}
                            >
                              <RefreshCw className="h-4 w-4 mr-1" />
                              {selectedBot.status === "ready" ? "Start" : "Resume"}
                            </Button>
                            {/* Add Delete Bot button */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30 hover:text-red-300"
                              onClick={() => setIsDeleteDialogOpen(true)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </>
                        ) : selectedBot.status === "active" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-amber-600/20 text-amber-400 border-amber-600/30 hover:bg-amber-600/30 hover:text-amber-300"
                            onClick={() => pauseBot(selectedBot.id)}
                          >
                            Pause
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="statistics" className="w-full">
                      <TabsList className="bg-gray-800/50 mb-4">
                        <TabsTrigger value="statistics" className="data-[state=active]:bg-gray-700">
                          Live Statistics
                        </TabsTrigger>
                        <TabsTrigger value="wallets" className="data-[state=active]:bg-gray-700">
                          Wallets
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="data-[state=active]:bg-gray-700">
                          Settings
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="statistics" className="mt-0">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <StatCard
                            title="Tokens Traded"
                            value={formatNumber(selectedBot.stats.tokensTraded)}
                            suffix={selectedBot.tokenSymbol}
                          />
                          <StatCard
                            title="Volume Generated"
                            value={formatNumber(selectedBot.stats.volumeGenerated)}
                            prefix="$"
                          />
                          <StatCard
                            title="Trades Completed"
                            value={`${selectedBot.stats.tradesCompleted}/${selectedBot.trades}`}
                          />
                          <StatCard
                            title="Wallets Used"
                            value={`${selectedBot.stats.walletsUsed}/${selectedBot.wallets}`}
                          />
                        </div>

                        <Card className="border-gray-800 bg-gray-900/30">
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Trading Progress</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-lg font-semibold text-amber-400">{selectedBot.progress}%</div>
                              <div className="text-xs text-gray-400">
                                {Math.floor((selectedBot.progress * selectedBot.trades) / 100)} / {selectedBot.trades}{" "}
                                trades
                              </div>
                            </div>
                            <Progress
                              value={selectedBot.progress}
                              className="h-2 bg-gray-800"
                              indicatorClassName="bg-amber-500"
                            />

                            <div className="mt-4 grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-xs font-medium text-gray-400 mb-2">Trading Wallet</h4>
                                <div className="bg-gray-800/50 p-2 rounded text-xs font-mono text-gray-300 truncate">
                                  4xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosg
                                </div>
                                <div className="mt-1 text-xs text-gray-400">Balance: 2.45 SOL</div>
                              </div>
                              <div>
                                <h4 className="text-xs font-medium text-gray-400 mb-2">Token Details</h4>
                                <div className="bg-gray-800/50 p-2 rounded text-xs font-mono text-gray-300 truncate">
                                  {selectedBot.tokenAddress || "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosg"}
                                </div>
                                <div className="mt-1 text-xs text-gray-400">Current Price: $0.00000123</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="wallets" className="mt-0">
                        <Tabs value={selectedWalletsTab} onValueChange={setSelectedWalletsTab} className="w-full">
                          <TabsList className="bg-gray-800/50 mb-4">
                            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">
                              Overview
                            </TabsTrigger>
                            <TabsTrigger value="management" className="data-[state=active]:bg-gray-700">
                              Batch Management
                            </TabsTrigger>
                            <TabsTrigger value="funding" className="data-[state=active]:bg-gray-700">
                              Funding Strategies
                            </TabsTrigger>
                            <TabsTrigger value="analytics" className="data-[state=active]:bg-gray-700">
                              Analytics
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="overview" className="mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <StatCard title="Total Wallets" value={selectedBot.walletData.length} suffix="wallets" />
                              <StatCard
                                title="Wallets Used"
                                value={`${selectedBot.stats.walletsUsed}/${selectedBot.wallets}`}
                              />
                              <StatCard title="Average SOL per Wallet" value="0.006" suffix="SOL" />
                              <StatCard
                                title="Total SOL in Wallets"
                                value={(selectedBot.stats.walletsFunded * 0.006).toFixed(3)}
                                suffix="SOL"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <Card className="border-gray-800 bg-gray-900/30">
                                <CardHeader className="p-4 pb-2">
                                  <CardTitle className="text-sm font-medium text-gray-400">Wallet Generation</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                  <div className="space-y-4">
                                    <div className="flex flex-col space-y-2">
                                      <div className="text-xs text-gray-400">
                                        Generate new wallets for your TurboBoost operations. This will create the
                                        specified number of wallets ready for funding.
                                      </div>
                                      <div className="flex items-center justify-between text-xs text-gray-300 bg-gray-800/50 p-2 rounded">
                                        <span>Current wallet batch:</span>
                                        <span className="font-medium">
                                          {selectedBot.stats.walletsGenerated} of {selectedBot.wallets}
                                        </span>
                                      </div>
                                    </div>
                                    <Button
                                      className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                                      disabled={
                                        selectedBot.stats.walletsGenerated >= selectedBot.wallets || isGeneratingWallets
                                      }
                                      onClick={() => handleGenerateWallets()}
                                    >
                                      {isGeneratingWallets ? (
                                        <>
                                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                          Generating...
                                        </>
                                      ) : (
                                        "Generate Wallets"
                                      )}
                                    </Button>
                                    <Button
                                      variant="outline"
                                      className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                                      disabled={selectedBot.stats.walletsGenerated === 0}
                                      onClick={() => setIsTagDialogOpen(true)}
                                    >
                                      Tag Wallets
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card className="border-gray-800 bg-gray-900/30">
                                <CardHeader className="p-4 pb-2">
                                  <CardTitle className="text-sm font-medium text-gray-400">Wallet Management</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                  <div className="space-y-4">
                                    <div className="flex flex-col space-y-2">
                                      <div className="text-xs text-gray-400">
                                        Fund your wallets with SOL or recover SOL from unused wallets to optimize your
                                        resources.
                                      </div>
                                      <div className="flex items-center justify-between text-xs text-gray-300 bg-gray-800/50 p-2 rounded">
                                        <span>Recoverable SOL:</span>
                                        <span className="font-medium">
                                          {(selectedBot.stats.walletsFunded * 0.006).toFixed(3)} SOL
                                        </span>
                                      </div>
                                    </div>
                                    <Button
                                      className="w-full bg-green-600/80 hover:bg-green-700/80 text-white"
                                      disabled={
                                        selectedBot.stats.walletsGenerated === 0 ||
                                        selectedBot.stats.walletsFunded >= selectedBot.stats.walletsGenerated ||
                                        isFundingWallets
                                      }
                                      onClick={() =>
                                        handleFundWallets(
                                          selectedBot.walletData
                                            .filter((w: any) => w.status === "generated")
                                            .map((w: any) => w.address),
                                        )
                                      }
                                    >
                                      {isFundingWallets ? (
                                        <>
                                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                          Funding...
                                        </>
                                      ) : (
                                        "Fund Wallets"
                                      )}
                                    </Button>
                                    <Button
                                      variant="outline"
                                      className="w-full border-red-700/50 text-red-400 hover:bg-red-900/20 hover:border-red-700"
                                      disabled={selectedBot.stats.walletsFunded === 0 || isRecoveringSol}
                                      onClick={handleRecoverSol}
                                    >
                                      {isRecoveringSol ? (
                                        <>
                                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                          Recovering...
                                        </>
                                      ) : (
                                        "Recover SOL"
                                      )}
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            <Card className="border-gray-800 bg-gray-900/30 mt-4">
                              <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-sm font-medium text-gray-400">
                                    Wallet Batch Status
                                  </CardTitle>
                                  <div className="text-xs text-gray-400">
                                    {selectedBot.stats.walletsGenerated} / {selectedBot.wallets} wallets generated
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="text-sm font-semibold text-amber-400">
                                      {Math.round((selectedBot.stats.walletsGenerated / selectedBot.wallets) * 100)}%
                                    </div>
                                    <div className="text-xs text-gray-400">Wallet generation</div>
                                  </div>
                                  <Progress
                                    value={(selectedBot.stats.walletsGenerated / selectedBot.wallets) * 100}
                                    className="h-2 bg-gray-800"
                                    indicatorClassName="bg-amber-500"
                                  />

                                  <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="bg-gray-800/50 p-3 rounded">
                                      <div className="text-xs font-medium text-gray-400 mb-1">Generated Wallets</div>
                                      <div className="text-lg font-semibold text-white">
                                        {selectedBot.stats.walletsGenerated}
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">Total capacity</div>
                                    </div>
                                    <div className="bg-gray-800/50 p-3 rounded">
                                      <div className="text-xs font-medium text-gray-400 mb-1">Funded Wallets</div>
                                      <div className="text-lg font-semibold text-green-400">
                                        {selectedBot.stats.walletsFunded}
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">Ready for trading</div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </TabsContent>

                          <TabsContent value="management" className="mt-0">
                            <WalletBatchManager
                              wallets={selectedBot.walletData}
                              onGenerateWallets={handleGenerateWallets}
                              onFundWallets={handleFundWallets}
                              onTagWallets={handleTagWallets}
                              onDeleteWallets={handleDeleteWallets}
                              isGenerating={isGeneratingWallets}
                              isFunding={isFundingWallets}
                              isTagging={isTaggingWallets}
                              isDeleting={isDeletingWallets}
                            />
                          </TabsContent>

                          <TabsContent value="funding" className="mt-0">
                            <WalletFundingStrategies
                              wallets={selectedBot.walletData}
                              budget={selectedBot.budget}
                              onApplyStrategy={handleApplyFundingStrategy}
                              isApplying={isApplyingStrategy}
                            />
                          </TabsContent>

                          <TabsContent value="analytics" className="mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <WalletDistributionChart
                                wallets={selectedBot.walletData}
                                totalWallets={selectedBot.walletData.length}
                                maxWallets={selectedBot.wallets}
                              />
                              <WalletEfficiencyMetrics
                                wallets={selectedBot.walletData}
                                totalTrades={selectedBot.trades}
                                completedTrades={selectedBot.stats.tradesCompleted}
                                volumeGenerated={selectedBot.stats.volumeGenerated}
                                targetVolume={selectedBot.targetVolume}
                              />
                            </div>
                          </TabsContent>
                        </Tabs>
                      </TabsContent>

                      <TabsContent value="settings" className="mt-0">
                        <Card className="border-gray-800 bg-gray-900/30">
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Bot Configuration</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                              <div>
                                <span className="text-gray-500">Budget:</span>{" "}
                                <span className="text-gray-300">{selectedBot.budget} SOL</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Target Volume:</span>{" "}
                                <span className="text-gray-300">${formatNumber(selectedBot.targetVolume)}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Faker Wallets:</span>{" "}
                                <span className="text-gray-300">{selectedBot.wallets}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Total Trades:</span>{" "}
                                <span className="text-gray-300">{selectedBot.trades}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Trade Interval:</span>{" "}
                                <span className="text-gray-300">15 seconds</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Trades per Interval:</span>{" "}
                                <span className="text-gray-300">4</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Fee per Trade:</span>{" "}
                                <span className="text-gray-300">0.000052 SOL</span>
                              </div>
                              <div>
                                <span className="text-gray-500">AutoSwitch Migration:</span>{" "}
                                <span className="text-green-400">Enabled</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Tokens per Trade:</span>{" "}
                                <span className="text-gray-300">Random (Max 2.5M)</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Bot Dialog */}
      <CreateTurboBoostDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onCreateBot={handleCreateBot} />

      {/* Tag Wallets Dialog */}
      {selectedBot && (
        <TagWalletsDialog
          open={isTagDialogOpen}
          onOpenChange={setIsTagDialogOpen}
          onTagWallets={handleTagWallets}
          walletCount={selectedBot.stats.walletsGenerated}
        />
      )}

      {/* Delete Bot Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#1e2133] border-gray-800 text-stone-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-400" />
              Delete TurboBoost Bot
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this TurboBoost bot? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => selectedBot && deleteBot(selectedBot.id)}
            >
              Delete Bot
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Helper component for statistics cards
function StatCard({ title, value, prefix = "", suffix = "" }) {
  return (
    <Card className="bg-gray-900/30 border-gray-800">
      <CardContent className="p-4">
        <div className="text-xs text-gray-400 mb-1">{title}</div>
        <div className="text-lg font-semibold text-white">
          {prefix}
          {value}
          {suffix ? ` ${suffix}` : ""}
        </div>
      </CardContent>
    </Card>
  )
}
