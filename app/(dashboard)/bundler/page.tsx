"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PathBreadcrumb } from "@/components/path-breadcrumb"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw, Package, Trash2, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CreateBundlerDialog } from "@/components/bundler/create-bundler-dialog"
import { TagBundlesDialog } from "@/components/bundler/tag-bundles-dialog"
import { ActivityLogger } from "@/components/bundler/activity-logger"
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
import { DevTradingSettingsSection } from "@/components/bundler/dev-trading-settings-section"
import { Input } from "@/components/ui/input"

export default function BundlerPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [activeBots, setActiveBots] = useState<any[]>([])
  const [selectedBot, setSelectedBot] = useState<any | null>(null)
  const [isGeneratingBundles, setIsGeneratingBundles] = useState(false)
  const [isFundingWallets, setIsFundingWallets] = useState(false)
  const [isRecoveringSol, setIsRecoveringSol] = useState(false)
  const [isTaggingBundles, setIsTaggingBundles] = useState(false)
  const [isDeletingBundles, setIsDeletingBundles] = useState(false)

  const { toast } = useToast()

  const handleCreateBot = (botConfig: any) => {
    const newBot = {
      id: Date.now().toString(),
      name: `Bundler Bot ${activeBots.length + 1}`,
      tokenSymbol: botConfig.tokenSymbol || "TOKEN",
      tokenAddress: botConfig.tokenAddress,
      budget: botConfig.budget,
      targetVolume: botConfig.targetVolume,
      wallets: botConfig.wallets || 40,
      bundleSize: botConfig.bundleSize || 5,
      bundles: botConfig.trades || 200,
      progress: 0,
      status: "ready", // ready, active, paused, completed
      createdAt: new Date().toISOString(),
      stats: {
        tokensTraded: 0,
        volumeGenerated: 0,
        bundlesCompleted: 0,
        walletsUsed: 0,
        feesSpent: 0,
        bundlesGenerated: 0,
        walletsFunded: 0,
      },
      // Mock bundle data for demonstration
      bundleData: Array(40)
        .fill(0)
        .map((_, i) => ({
          id: `bundle-${i}`,
          wallets: Array(botConfig.bundleSize || 5)
            .fill(0)
            .map((_, j) => `${i}-${j}xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosg`),
          status: i < 10 ? "executed" : i < 25 ? "prepared" : "pending",
          solBalance: i < 10 ? 0.001 : i < 25 ? 0.006 : 0,
          tokenBalance: i < 10 ? 1 : 0,
          transactionCount: botConfig.bundleSize || 5,
          lastExecution: i < 10 ? new Date().toISOString() : null,
          tag: i < 5 ? "bundler" : null,
        })),
      tokenMetadata: botConfig.tokenMetadata || {
        name: botConfig.tokenSymbol || "Token",
        symbol: botConfig.tokenSymbol || "TOKEN",
        description: "A new token created with the Bundler Bot",
        image: null,
      },
      tokenConfig: botConfig.tokenConfig || {
        tokenType: "spl",
        platform: "raydium-amm",
        revokeAuthority: false,
      },
      devTradingSettings: botConfig.devTradingSettings || {
        devBuyAmount: 5,
        sellOnMarketcap: false,
        marketcapSellPercentage: 50,
        sellOnReserve: false,
        reserveSellPercentage: 50,
        sellOnTimeout: false,
        timeoutSellPercentage: 50,
        timeoutMinutes: 60,
      },
      walletManagement: botConfig.walletManagement || {
        selectedGroup: "group-1",
        customWallets: [],
      },
      // Additional token market data
      marketData: {
        currentPrice: 0.00000123,
        marketCap: 123000,
        bondingCurvePercentage: 5.5,
        startTime: null,
        endTime: null,
      },
      // Bundle wallets data
      bundleWallets: Array(20)
        .fill(0)
        .map((_, i) => ({
          id: `bundle-wallet-${i}`,
          address: `BW${i}xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosg`,
          solBalance: Math.random() * 0.1,
          tokenBalance: Math.random() * 1000,
          status: i < 5 ? "active" : i < 15 ? "ready" : "empty",
          lastUsed: i < 5 ? new Date().toISOString() : null,
        })),
      // Bump wallets data
      bumpWallets: Array(10)
        .fill(0)
        .map((_, i) => ({
          id: `bump-wallet-${i}`,
          address: `BP${i}xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosg`,
          solBalance: Math.random() * 0.05,
          tokenBalance: Math.random() * 500,
          status: i < 3 ? "active" : i < 8 ? "ready" : "empty",
          lastBump: i < 3 ? new Date().toISOString() : null,
          bumpCount: Math.floor(Math.random() * 10),
        })),
    }

    setActiveBots((prev) => [...prev, newBot])
    setSelectedBot(newBot)
  }

  const startBot = (botId: string) => {
    setActiveBots((prev) =>
      prev.map((bot) =>
        bot.id === botId
          ? {
              ...bot,
              status: "active",
              progress: 0,
              marketData: {
                ...bot.marketData,
                startTime: new Date().toISOString(),
                endTime: null,
              },
            }
          : bot,
      ),
    )

    if (selectedBot?.id === botId) {
      setSelectedBot((prev) =>
        prev
          ? {
              ...prev,
              status: "active",
              progress: 0,
              marketData: {
                ...prev.marketData,
                startTime: new Date().toISOString(),
                endTime: null,
              },
            }
          : null,
      )
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
      description: "The Bundler bot has been deleted successfully.",
    })
  }

  const handleGenerateBundles = async (count = 10) => {
    if (!selectedBot) return

    setIsGeneratingBundles(true)

    // Simulate API call with delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update the bot with generated bundles
    const newBundles = Array(count)
      .fill(0)
      .map((_, i) => {
        const index = selectedBot.bundleData.length + i
        return {
          id: `bundle-${Date.now()}-${i}`,
          wallets: Array(selectedBot.bundleSize)
            .fill(0)
            .map((_, j) => `${index}-${j}xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosg`),
          status: "pending",
          solBalance: 0,
          tokenBalance: 0,
          transactionCount: selectedBot.bundleSize,
          lastExecution: null,
          tag: null,
        }
      })

    const updatedBot = {
      ...selectedBot,
      bundleData: [...selectedBot.bundleData, ...newBundles],
      stats: {
        ...selectedBot.stats,
        bundlesGenerated: selectedBot.stats.bundlesGenerated + count,
      },
    }

    setActiveBots((prev) => prev.map((bot) => (bot.id === selectedBot.id ? updatedBot : bot)))

    setSelectedBot(updatedBot)
    setIsGeneratingBundles(false)

    toast({
      title: "Bundles Generated",
      description: `Successfully generated ${count} bundle groups.`,
    })
  }

  const handleTagBundles = async (bundles: string[], tag: string) => {
    if (!selectedBot) return

    setIsTaggingBundles(true)

    // Simulate API call with delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update the bot with tagged bundles
    const updatedBundleData = selectedBot.bundleData.map((bundle: any) => {
      if (bundles.includes(bundle.id)) {
        return {
          ...bundle,
          tag,
        }
      }
      return bundle
    })

    const updatedBot = {
      ...selectedBot,
      bundleData: updatedBundleData,
    }

    setActiveBots((prev) => prev.map((bot) => (bot.id === selectedBot.id ? updatedBot : bot)))

    setSelectedBot(updatedBot)
    setIsTaggingBundles(false)

    toast({
      title: "Bundles Tagged",
      description: `Successfully tagged ${bundles.length} bundle groups with "${tag}".`,
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
            { label: "Bundler Bot", href: "/bundler" },
          ]}
        />
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
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
              <Package className="h-12 w-12 text-blue-500 opacity-70" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Bundler Bots Created</h2>
            <p className="text-gray-400 text-center max-w-md mb-6">
              Create your first Bundler bot to execute coordinated transaction bundles with maximum efficiency and MEV
              protection.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Create Bundler Bot
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
                    selectedBot?.id === bot.id ? "ring-1 ring-blue-500/50" : ""
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
                    {/* Token Symbol and Image */}
                    <div className="flex items-center mb-3">
                      <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden mr-2">
                        {bot.tokenMetadata?.image ? (
                          <img
                            src={bot.tokenMetadata.image || "/placeholder.svg"}
                            alt={bot.tokenSymbol}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold text-blue-400">{bot.tokenSymbol.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{bot.tokenSymbol}</div>
                        <Badge
                          className={`text-xs ${
                            bot.marketData?.startTime
                              ? bot.marketData?.endTime
                                ? "bg-blue-600/20 text-blue-400"
                                : "bg-green-600/20 text-green-400"
                              : "bg-gray-600/20 text-gray-400"
                          }`}
                        >
                          {bot.marketData?.startTime ? (bot.marketData?.endTime ? "Ended" : "Started") : "Ready"}
                        </Badge>
                      </div>
                    </div>

                    {/* Token Information Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                      <div>
                        <span className="text-gray-500">Dev Buy:</span>{" "}
                        <span className="text-gray-300">{bot.devTradingSettings?.devBuyAmount || 0} SOL</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Mcap:</span>{" "}
                        <span className="text-gray-300">${formatNumber(bot.marketData?.marketCap || 0)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Price:</span>{" "}
                        <span className="text-gray-300 font-mono">
                          ${(bot.marketData?.currentPrice || 0).toFixed(6)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Curve:</span>{" "}
                        <span className="text-gray-300">{bot.marketData?.bondingCurvePercentage || 0}%</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-blue-400">{bot.progress}%</span>
                      </div>
                      <Progress value={bot.progress} className="h-1 bg-gray-800" indicatorClassName="bg-blue-500" />
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
                          {selectedBot.tokenSymbol} Bundler
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
                          Bundle execution bot for {selectedBot.tokenSymbol}
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
                        <TabsTrigger value="dev-trading" className="data-[state=active]:bg-gray-700">
                          Dev Trading Settings
                        </TabsTrigger>
                        <TabsTrigger value="bundle-wallets" className="data-[state=active]:bg-gray-700">
                          Bundle Wallets
                        </TabsTrigger>
                        <TabsTrigger value="bump-wallets" className="data-[state=active]:bg-gray-700">
                          Bump Wallets
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="statistics" className="mt-0">
                        {/* Stats Cards - Removed Token Info Card */}
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
                            title="Bundles Completed"
                            value={`${selectedBot.stats.bundlesCompleted}/${selectedBot.bundles}`}
                          />
                          <StatCard
                            title="Wallets Used"
                            value={`${selectedBot.stats.walletsUsed}/${selectedBot.wallets}`}
                          />
                        </div>

                        <Card className="border-gray-800 bg-gray-900/30">
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">
                              Bundle Execution Progress
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-lg font-semibold text-blue-400">{selectedBot.progress}%</div>
                              <div className="text-xs text-gray-400">
                                {Math.floor((selectedBot.progress * selectedBot.bundles) / 100)} / {selectedBot.bundles}{" "}
                                bundles
                              </div>
                            </div>
                            <Progress
                              value={selectedBot.progress}
                              className="h-2 bg-gray-800"
                              indicatorClassName="bg-blue-500"
                            />

                            <div className="mt-4 grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-xs font-medium text-gray-400 mb-2">Bundle Wallet</h4>
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

                      <TabsContent value="dev-trading" className="mt-0">
                        <DevTradingSettingsSection devTradingSettings={selectedBot.devTradingSettings} />
                      </TabsContent>

                      <TabsContent value="bundle-wallets" className="mt-0">
                        <BundleWalletsSection bundleWallets={selectedBot.bundleWallets} />
                      </TabsContent>

                      <TabsContent value="bump-wallets" className="mt-0">
                        <BumpWalletsSection bumpWallets={selectedBot.bumpWallets} />
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
      <CreateBundlerDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onCreateBot={handleCreateBot} />

      {/* Tag Bundles Dialog */}
      {selectedBot && (
        <TagBundlesDialog
          open={isTagDialogOpen}
          onOpenChange={setIsTagDialogOpen}
          onTagBundles={handleTagBundles}
          bundleCount={selectedBot.stats.bundlesGenerated}
        />
      )}

      {/* Delete Bot Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#1e2133] border-gray-800 text-stone-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-400" />
              Delete Bundler Bot
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this Bundler bot? This action cannot be undone.
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

// Bundle Wallets Section Component
function BundleWalletsSection({ bundleWallets }: { bundleWallets: any[] }) {
  const [walletInputs, setWalletInputs] = useState<Record<string, { buyAmount: number; sellPercentage: number }>>({})

  const updateWalletInput = (walletId: string, field: "buyAmount" | "sellPercentage", value: number) => {
    setWalletInputs((prev) => ({
      ...prev,
      [walletId]: {
        ...prev[walletId],
        [field]: value,
      },
    }))
  }

  const handleBuy = (walletId: string, amount: number) => {
    // Handle buy logic here
    console.log(`Buy ${amount} SOL for wallet ${walletId}`)
  }

  const handleSell = (walletId: string, percentage: number) => {
    // Handle sell logic here
    console.log(`Sell ${percentage}% tokens for wallet ${walletId}`)
  }

  const handleSellAll = () => {
    // Handle sell all logic here
    console.log("Selling all tokens from all bundle wallets")
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Bundle Wallets" value={bundleWallets.length} suffix="wallets" />
        <StatCard
          title="Active Wallets"
          value={bundleWallets.filter((w) => w.status === "active").length}
          suffix="active"
        />
        <StatCard
          title="Total SOL Balance"
          value={bundleWallets.reduce((sum, w) => sum + w.solBalance, 0).toFixed(3)}
          suffix="SOL"
        />
      </div>

      <Card className="border-gray-800 bg-gray-900/30">
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-400">Bundle Wallets Overview</CardTitle>
          <Button
            onClick={handleSellAll}
            className="bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30 hover:text-red-300"
            size="sm"
          >
            Sell All Tokens
          </Button>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {bundleWallets.map((wallet) => (
              <div
                key={wallet.id}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      wallet.status === "active"
                        ? "bg-green-500"
                        : wallet.status === "ready"
                          ? "bg-blue-500"
                          : "bg-gray-500"
                    }`}
                  />
                  <div>
                    <div className="text-xs font-mono text-gray-300 truncate w-32">{wallet.address}</div>
                    <div className="text-xs text-gray-500">
                      {wallet.status === "active" ? "Active" : wallet.status === "ready" ? "Ready" : "Empty"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* SOL Balance and Buy Input */}
                  <div className="text-right">
                    <div className="text-xs text-gray-300">{wallet.solBalance.toFixed(4)} SOL</div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Input
                        type="number"
                        min="0.001"
                        step="0.001"
                        placeholder="0.01"
                        value={walletInputs[wallet.id]?.buyAmount || ""}
                        onChange={(e) =>
                          updateWalletInput(wallet.id, "buyAmount", Number.parseFloat(e.target.value) || 0)
                        }
                        className="bg-gray-800/50 border-gray-700 text-white h-6 w-16 text-xs"
                      />
                      <Button
                        size="sm"
                        className="bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30 hover:text-green-300 h-6 px-2 text-xs"
                        onClick={() => handleBuy(wallet.id, walletInputs[wallet.id]?.buyAmount || 0)}
                      >
                        Buy
                      </Button>
                    </div>
                  </div>

                  {/* Token Balance and Sell Input */}
                  <div className="text-right">
                    <div className="text-xs text-gray-300">{wallet.tokenBalance.toFixed(0)} tokens</div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        step="1"
                        placeholder="100"
                        value={walletInputs[wallet.id]?.sellPercentage || ""}
                        onChange={(e) =>
                          updateWalletInput(wallet.id, "sellPercentage", Number.parseFloat(e.target.value) || 0)
                        }
                        className="bg-gray-800/50 border-gray-700 text-white h-6 w-12 text-xs"
                      />
                      <span className="text-xs text-gray-400">%</span>
                      <Button
                        size="sm"
                        className="bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30 hover:text-red-300 h-6 px-2 text-xs"
                        onClick={() => handleSell(wallet.id, walletInputs[wallet.id]?.sellPercentage || 0)}
                      >
                        Sell
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Bump Wallets Section Component
function BumpWalletsSection({ bumpWallets }: { bumpWallets: any[] }) {
  const [walletInputs, setWalletInputs] = useState<Record<string, { buyAmount: number; sellPercentage: number }>>({})

  const updateWalletInput = (walletId: string, field: "buyAmount" | "sellPercentage", value: number) => {
    setWalletInputs((prev) => ({
      ...prev,
      [walletId]: {
        ...prev[walletId],
        [field]: value,
      },
    }))
  }

  const handleBuy = (walletId: string, amount: number) => {
    // Handle buy logic here
    console.log(`Buy ${amount} SOL for wallet ${walletId}`)
  }

  const handleSell = (walletId: string, percentage: number) => {
    // Handle sell logic here
    console.log(`Sell ${percentage}% tokens for wallet ${walletId}`)
  }

  const handleSellAll = () => {
    // Handle sell all logic here
    console.log("Selling all tokens from all bump wallets")
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Bump Wallets" value={bumpWallets.length} suffix="wallets" />
        <StatCard
          title="Active Bumpers"
          value={bumpWallets.filter((w) => w.status === "active").length}
          suffix="active"
        />
        <StatCard title="Total Bumps" value={bumpWallets.reduce((sum, w) => sum + w.bumpCount, 0)} suffix="bumps" />
      </div>

      <Card className="border-gray-800 bg-gray-900/30">
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-400">Bump Wallets Overview</CardTitle>
          <Button
            onClick={handleSellAll}
            className="bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30 hover:text-red-300"
            size="sm"
          >
            Sell All Tokens
          </Button>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {bumpWallets.map((wallet) => (
              <div
                key={wallet.id}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      wallet.status === "active"
                        ? "bg-green-500"
                        : wallet.status === "ready"
                          ? "bg-blue-500"
                          : "bg-gray-500"
                    }`}
                  />
                  <div>
                    <div className="text-xs font-mono text-gray-300 truncate w-32">{wallet.address}</div>
                    <div className="text-xs text-gray-500">
                      {wallet.status === "active" ? "Active" : wallet.status === "ready" ? "Ready" : "Empty"} •{" "}
                      {wallet.bumpCount} bumps
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* SOL Balance and Buy Input */}
                  <div className="text-right">
                    <div className="text-xs text-gray-300">{wallet.solBalance.toFixed(4)} SOL</div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Input
                        type="number"
                        min="0.001"
                        step="0.001"
                        placeholder="0.01"
                        value={walletInputs[wallet.id]?.buyAmount || ""}
                        onChange={(e) =>
                          updateWalletInput(wallet.id, "buyAmount", Number.parseFloat(e.target.value) || 0)
                        }
                        className="bg-gray-800/50 border-gray-700 text-white h-6 w-16 text-xs"
                      />
                      <Button
                        size="sm"
                        className="bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30 hover:text-green-300 h-6 px-2 text-xs"
                        onClick={() => handleBuy(wallet.id, walletInputs[wallet.id]?.buyAmount || 0)}
                      >
                        Buy
                      </Button>
                    </div>
                  </div>

                  {/* Token Balance and Sell Input */}
                  <div className="text-right">
                    <div className="text-xs text-gray-300">{wallet.tokenBalance.toFixed(0)} tokens</div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        step="1"
                        placeholder="100"
                        value={walletInputs[wallet.id]?.sellPercentage || ""}
                        onChange={(e) =>
                          updateWalletInput(wallet.id, "sellPercentage", Number.parseFloat(e.target.value) || 0)
                        }
                        className="bg-gray-800/50 border-gray-700 text-white h-6 w-12 text-xs"
                      />
                      <span className="text-xs text-gray-400">%</span>
                      <Button
                        size="sm"
                        className="bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30 hover:text-red-300 h-6 px-2 text-xs"
                        onClick={() => handleSell(wallet.id, walletInputs[wallet.id]?.sellPercentage || 0)}
                      >
                        Sell
                      </Button>
                    </div>
                  </div>

                  {/* Last Bump Time */}
                  <div className="text-right w-20">
                    <div className="text-xs text-gray-500">
                      {wallet.lastBump ? `${new Date(wallet.lastBump).toLocaleTimeString()}` : "Never"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
