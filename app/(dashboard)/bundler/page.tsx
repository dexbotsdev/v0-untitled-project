"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PathBreadcrumb } from "@/components/path-breadcrumb"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw, Package, Trash2, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
      wallets: botConfig.wallets || 40,
      progress: 0,
      status: "ready", // ready, active, paused, completed
      createdAt: new Date().toISOString(),
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
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-blue-400">{bot.progress}%</span>
                      </div>
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
                      </TabsList>

                      <TabsContent value="statistics" className="mt-0">
                        <DevTradingSettingsSection devTradingSettings={selectedBot.devTradingSettings} />
                      </TabsContent>

                      <TabsContent value="dev-trading" className="mt-0">
                        <DevTradingSettingsSection devTradingSettings={selectedBot.devTradingSettings} />
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
