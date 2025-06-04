"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PathBreadcrumb } from "@/components/path-breadcrumb"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw, Package, Trash2, AlertCircle, DollarSign, ToggleLeft, ToggleRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CreateBundlerDialog } from "@/components/bundler/create-bundler-dialog"
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
import { WalletsTable } from "@/components/bundler/wallets-table"

export default function BundlerPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRugpullDialogOpen, setIsRugpullDialogOpen] = useState(false)
  const [activeBots, setActiveBots] = useState<any[]>([])
  const [selectedBot, setSelectedBot] = useState<any | null>(null)
  const [showUSD, setShowUSD] = useState(false) // Toggle between SOL and USD

  const { toast } = useToast()

  const generateWalletsFromGroup = (selectedGroup: string, customWallets: any[] = []) => {
    if (selectedGroup === "custom") {
      return customWallets.map((wallet, index) => ({
        id: `custom-wallet-${index}`,
        address: wallet.address,
        solBalance: Math.random() * 0.1 + 0.001, // Random SOL balance
        tokenBalance: Math.random() * 1000, // Random token balance
        status: Math.random() > 0.7 ? "active" : Math.random() > 0.4 ? "ready" : "empty",
        lastUsed: Math.random() > 0.5 ? new Date().toISOString() : null,
      }))
    }

    const walletCount =
      selectedGroup === "group-1" ? 10 : selectedGroup === "group-2" ? 25 : selectedGroup === "group-3" ? 50 : 10

    return Array(walletCount)
      .fill(0)
      .map((_, i) => ({
        id: `wallet-${selectedGroup}-${i}`,
        address: `${selectedGroup.toUpperCase()}${i}xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosg`,
        solBalance: Math.random() * 0.1 + 0.001,
        tokenBalance: Math.random() * 1000,
        status: Math.random() > 0.7 ? "active" : Math.random() > 0.4 ? "ready" : "empty",
        lastUsed: Math.random() > 0.5 ? new Date().toISOString() : null,
      }))
  }

  const handleCreateBot = (botConfig: any) => {
    const wallets = generateWalletsFromGroup(
      botConfig.walletManagement?.selectedGroup || "group-1",
      botConfig.walletManagement?.customWallets || [],
    )

    const newBot = {
      id: Date.now().toString(),
      name: `Bundler Bot ${activeBots.length + 1}`,
      tokenSymbol: botConfig.tokenSymbol || "TOKEN",
      tokenAddress: botConfig.tokenAddress,
      walletCount: wallets.length,
      progress: 0,
      status: "ready", // ready, active, paused, completed
      createdAt: new Date().toISOString(),
      wallets: wallets,
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
      // Market data for the token
      marketData: {
        totalBuys: Math.floor(Math.random() * 500) + 50,
        currentMcap: Math.floor(Math.random() * 1000000) + 100000,
        currentValueSOL: Math.random() * 10 + 1,
        currentValueUSD: (Math.random() * 10 + 1) * 180, // Assuming 1 SOL = ~$180
        solToUsdRate: 180,
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

  const handleRugpull = () => {
    if (!selectedBot) return

    setIsRugpullDialogOpen(false)

    // Simulate rugpull action
    toast({
      title: "Book Profits Executed",
      description: `Successfully executed rugpull for ${selectedBot.tokenSymbol}. All profits have been booked.`,
      variant: "destructive",
    })

    // Update bot status to completed
    const updatedBot = { ...selectedBot, status: "completed" }
    setActiveBots((prev) => prev.map((bot) => (bot.id === selectedBot.id ? updatedBot : bot)))
    setSelectedBot(updatedBot)
  }

  const updateWalletBalances = (walletId: string, updates: { solBalance?: number; tokenBalance?: number }) => {
    if (!selectedBot) return

    const updatedWallets = selectedBot.wallets.map((wallet: any) =>
      wallet.id === walletId ? { ...wallet, ...updates } : wallet,
    )

    const updatedBot = { ...selectedBot, wallets: updatedWallets }

    setActiveBots((prev) => prev.map((bot) => (bot.id === selectedBot.id ? updatedBot : bot)))
    setSelectedBot(updatedBot)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(num)
  }

  const formatCurrency = (value: number, isUSD = false) => {
    if (isUSD) {
      return `$${formatNumber(value)}`
    }
    return `${formatNumber(value)} SOL`
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
        <div className="flex space-x-2">
          {selectedBot && selectedBot.status !== "completed" && (
            <Button
              onClick={() => setIsRugpullDialogOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white"
              size="sm"
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Book Profits (Rugpull)
            </Button>
          )}
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isBotCreated} // Disable if a bot is already created
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Bot
          </Button>
        </div>
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
                        <div className="text-xs text-gray-400">{bot.tokenMetadata?.name || "Token Name"}</div>
                      </div>
                    </div>

                    {/* Token Configuration Info */}
                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                      <div>
                        <span className="text-gray-500">Platform:</span>{" "}
                        <span className="text-gray-300">{bot.tokenConfig?.platform || "raydium-amm"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Type:</span>{" "}
                        <span className="text-gray-300">{bot.tokenConfig?.tokenType || "spl"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Dev Buy:</span>{" "}
                        <span className="text-gray-300">{bot.devTradingSettings?.devBuyAmount || 0} SOL</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Wallets:</span>{" "}
                        <span className="text-gray-300">{bot.walletCount || 0}</span>
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
                    <Tabs defaultValue="token-info" className="w-full">
                      <TabsList className="bg-gray-800/50 mb-4">
                        <TabsTrigger value="token-info" className="data-[state=active]:bg-gray-700">
                          Token Information
                        </TabsTrigger>
                        <TabsTrigger value="dev-trading" className="data-[state=active]:bg-gray-700">
                          Dev Trading Settings
                        </TabsTrigger>
                        <TabsTrigger value="wallets" className="data-[state=active]:bg-gray-700">
                          Wallets
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="token-info" className="mt-0">
                        <div className="space-y-4">
                          {/* Token Metadata Card */}
                          <Card className="border-gray-800 bg-gray-900/30">
                            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                              <CardTitle className="text-sm font-medium text-gray-400">Token Metadata</CardTitle>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowUSD(!showUSD)}
                                className="text-gray-400 hover:text-gray-300"
                              >
                                {showUSD ? (
                                  <>
                                    <ToggleRight className="h-4 w-4 mr-1" />
                                    USD
                                  </>
                                ) : (
                                  <>
                                    <ToggleLeft className="h-4 w-4 mr-1" />
                                    SOL
                                  </>
                                )}
                              </Button>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Total Buys</div>
                                  <div className="text-sm text-gray-300 font-semibold">
                                    {formatNumber(selectedBot.marketData?.totalBuys || 0)}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Current Mcap</div>
                                  <div className="text-sm text-gray-300 font-semibold">
                                    ${formatNumber(selectedBot.marketData?.currentMcap || 0)}
                                  </div>
                                </div>
                                <div className="col-span-2">
                                  <div className="text-xs text-gray-500 mb-1">Current Value</div>
                                  <div className="text-lg text-green-400 font-bold">
                                    {showUSD
                                      ? formatCurrency(selectedBot.marketData?.currentValueUSD || 0, true)
                                      : formatCurrency(selectedBot.marketData?.currentValueSOL || 0, false)}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Token Configuration Card */}
                          <Card className="border-gray-800 bg-gray-900/30">
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-sm font-medium text-gray-400">Token Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Revoke Authority</div>
                                  <div className="text-sm text-gray-300">
                                    {selectedBot.tokenConfig?.revokeAuthority ? "Yes" : "No"}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Token Address</div>
                                  <div className="text-sm text-gray-300 font-mono truncate">
                                    {selectedBot.tokenAddress || "Generated on creation"}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="dev-trading" className="mt-0">
                        <DevTradingSettingsSection devTradingSettings={selectedBot.devTradingSettings} />
                      </TabsContent>

                      <TabsContent value="wallets" className="mt-0">
                        <WalletsTable
                          wallets={selectedBot.wallets || []}
                          onUpdateWallet={updateWalletBalances}
                          tokenSymbol={selectedBot.tokenSymbol}
                        />
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

      {/* Rugpull Confirmation Dialog */}
      <AlertDialog open={isRugpullDialogOpen} onOpenChange={setIsRugpullDialogOpen}>
        <AlertDialogContent className="bg-[#1e2133] border-gray-800 text-stone-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-red-400" />
              Book Profits (Rugpull)
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to execute a rugpull for {selectedBot?.tokenSymbol}? This will sell all tokens and
              book profits. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={handleRugpull}>
              Execute Rugpull
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
