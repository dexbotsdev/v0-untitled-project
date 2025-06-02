"use client"

import { useState } from "react"
import { Header2 } from "@/components/header2"
import { CreateBotDialog } from "@/components/volume-bot/create-bot-dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  RefreshCw,
  Plus,
  Activity,
  Settings,
  BarChart3,
  Clock,
  Play,
  Pause,
  StopCircle,
  Download,
  Trash2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { WalletStatusCard } from "@/components/volume-bot/wallet-status-card"
import { useVolumeBotSDK } from "@/utils/volume-bot-sdk/use-volume-bot-sdk"
import { ActivityLogger } from "@/components/turbo-boost/activity-logger"
import { setWallets } from "@/utils/setWallets" // Declare the variable before using it

// Add a new function to format dates in a readable way
function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date)
}

export default function VolumeBotPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const [fundAllAmount, setFundAllAmount] = useState("")
  const [isWsolMode, setIsWsolMode] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  // Use the Volume Bot SDK
  const {
    bots,
    selectedBotId,
    wallets,
    logs,
    isLoading,
    createBot,
    selectBot,
    startBot,
    pauseBot,
    stopBot,
    deleteBot,
    generateWallets,
    fundWallets,
  } = useVolumeBotSDK({ debug: true })

  // Get the selected token
  const selectedToken = selectedBotId ? bots.find((bot) => bot.id === selectedBotId) : null
  const isBotActive = selectedToken?.status === "active"
  const anyBotRunning = bots.some((bot) => bot.status === "active")

  // Handle add token
  const handleAddToken = (newToken: any) => {
    const botId = createBot({
      ...newToken,
      progress: 0,
      status: "paused",
    })

    selectBot(botId)

    toast({
      title: "Volume Bot Created",
      description: `Volume bot for ${newToken.symbol} has been created in paused state.`,
    })
  }

  // Handle select token
  const handleSelectToken = (token: any) => {
    selectBot(token.id)
  }

  // Handle start bot
  const handleStartBot = () => {
    if (!selectedToken) return

    // Only allow starting if the bot is in paused state
    if (selectedToken.status !== "paused") {
      toast({
        title: "Cannot Start Bot",
        description: "Only bots in paused state can be started.",
        variant: "destructive",
      })
      return
    }

    // Check if any other bot is already running
    if (anyBotRunning && selectedToken.status !== "active") {
      toast({
        title: "Cannot Start Bot",
        description: "Only one bot can run at a time. Please stop the currently running bot first.",
        variant: "destructive",
      })
      return
    }

    const success = startBot(selectedToken.id)

    if (success) {
      toast({
        title: "Volume Bot Started",
        description: `Volume bot for ${selectedToken.symbol} has been started.`,
      })
    }
  }

  // Handle pause bot
  const handlePauseBot = () => {
    if (!selectedToken) return

    const success = pauseBot(selectedToken.id)

    if (success) {
      toast({
        title: "Volume Bot Paused",
        description: `Volume bot for ${selectedToken.symbol} has been paused.`,
      })
    }
  }

  // Handle stop bot
  const handleStopBot = () => {
    if (!selectedToken) return

    const success = stopBot(selectedToken.id)

    if (success) {
      toast({
        title: "Volume Bot Stopped",
        description: `Volume bot for ${selectedToken.symbol} has been stopped and cannot be restarted.`,
      })
    }
  }

  // Handle recover SOLs
  const handleRecoverSols = () => {
    if (!selectedToken) return

    toast({
      title: "SOL Recovery Initiated",
      description: `Recovering SOL from all wallets for ${selectedToken.symbol}. This may take a few minutes.`,
    })

    // Simulate recovery process
    setTimeout(() => {
      toast({
        title: "SOL Recovery Complete",
        description: `Successfully recovered 2.45 SOL from all wallets.`,
      })
    }, 3000)
  }

  // Handle export data
  const handleExportData = () => {
    toast({
      title: "Data Export",
      description: "Bot configuration data has been exported to CSV.",
    })
  }

  // Handle duplicate token
  const handleDuplicateToken = (token: any) => {
    // Create a duplicate token with a new ID
    const duplicatedToken = {
      ...token,
      name: `${token.name} (Copy)`,
      symbol: `${token.symbol}-C`,
      progress: 0,
      status: "paused",
    }

    const botId = createBot(duplicatedToken)

    toast({
      title: "Token Duplicated",
      description: `A copy of ${token.symbol} has been created.`,
    })
  }

  // Handle delete token
  const handleDeleteToken = (token: any) => {
    const success = deleteBot(token.id)

    if (success) {
      toast({
        title: "Token Deleted",
        description: `${token.symbol} has been deleted.`,
      })
    }
  }

  // Handle select all wallets
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    setWallets((wallets) => wallets.map((wallet) => ({ ...wallet, selected: checked })))
  }

  // Handle select individual wallet
  const handleSelectWallet = (id: string, checked: boolean) => {
    setWallets((wallets) => {
      const updatedWallets = wallets.map((wallet) => (wallet.id === id ? { ...wallet, selected: checked } : wallet))

      // Update selectAll state based on whether all wallets are selected
      const allSelected = updatedWallets.every((wallet) => wallet.selected)
      setSelectAll(allSelected)

      return updatedWallets
    })
  }

  // Handle fund all wallets
  const handleFundAllWallets = () => {
    if (!fundAllAmount) {
      toast({
        title: "Fund Amount Required",
        description: "Please enter an amount to fund all wallets",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(fundAllAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive number",
        variant: "destructive",
      })
      return
    }

    // Get selected wallets or all wallets if none selected
    const selectedWallets = wallets.filter((wallet) => wallet.selected)
    const walletsToFund = selectedWallets.length > 0 ? selectedWallets : wallets

    if (walletsToFund.length === 0) {
      toast({
        title: "No Wallets Selected",
        description: "Please select at least one wallet to fund",
        variant: "destructive",
      })
      return
    }

    // Fund wallets using SDK
    const success = fundWallets(
      selectedToken.id,
      walletsToFund.map((w) => w.id),
      amount,
    )

    if (success) {
      setFundAllAmount("")

      toast({
        title: "Wallets Funded",
        description: `Successfully funded ${walletsToFund.length} wallets with ${amount} SOL each`,
      })
    }
  }

  // Handle generate wallets
  const handleGenerateWallets = () => {
    if (!selectedToken) {
      toast({
        title: "No Token Selected",
        description: "Please select a token first",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    // Get the configured number of wallets from the token
    const configuredWalletCount = selectedToken.numberOfWallets || 10

    // Calculate how many wallets to generate (configured count - current count)
    const walletsToGenerate = Math.max(0, configuredWalletCount - wallets.length)

    if (walletsToGenerate <= 0) {
      setIsGenerating(false)
      toast({
        title: "No Wallets to Generate",
        description: `You already have ${wallets.length} wallets, which matches or exceeds the configured count of ${configuredWalletCount}.`,
      })
      return
    }

    // Generate wallets using SDK
    const newWallets = generateWallets(selectedToken.id, walletsToGenerate)

    setIsGenerating(false)

    toast({
      title: "Wallets Generated",
      description: `Successfully generated ${walletsToGenerate} wallets for ${selectedToken?.symbol}`,
    })
  }

  // Handle WSOL/SOL conversion
  const handleWsolConversion = () => {
    // Get selected wallets or all wallets if none selected
    const selectedWallets = wallets.filter((wallet) => wallet.selected)
    const walletsToConvert = selectedWallets.length > 0 ? selectedWallets : wallets

    if (walletsToConvert.length === 0) {
      toast({
        title: "No Wallets Selected",
        description: "Please select at least one wallet to convert",
        variant: "destructive",
      })
      return
    }

    setIsConverting(true)

    // Simulate a brief delay for the conversion process
    setTimeout(() => {
      // Toggle the WSOL mode
      setIsWsolMode((prev) => !prev)
      setIsConverting(false)

      toast({
        title: `Conversion to ${!isWsolMode ? "WSOL" : "SOL"} Complete`,
        description: `Successfully converted ${walletsToConvert.length} wallets from ${!isWsolMode ? "SOL to WSOL" : "WSOL to SOL"}`,
      })
    }, 800)
  }

  // Handle delete wallets
  const handleDeleteWallets = () => {
    // Get selected wallets
    const selectedWallets = wallets.filter((wallet) => wallet.selected)

    if (selectedWallets.length === 0) {
      toast({
        title: "No Wallets Selected",
        description: "Please select at least one wallet to delete",
        variant: "destructive",
      })
      return
    }

    // Delete the wallets
    setWallets((wallets) => wallets.filter((wallet) => !selectedWallets.some((w) => w.id === wallet.id)))
    setSelectAll(false)

    toast({
      title: "Wallets Deleted",
      description: `Successfully deleted ${selectedWallets.length} wallets`,
    })
  }

  // Replace the return statement with the updated UI that includes the token bot info card
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header2 title="Token Volume Booster" subtitle="Create and manage volume bots for your tokens" />

      {/* Action Bar - Simplified */}
      <div className="p-2 border-b border-gray-800 bg-[#191929] mb-2">
        <div className="flex justify-between items-center">
          <h2 className="text-md font-medium">VolumeBot</h2>
          <Button
            variant="default"
            size="sm"
            className="bg-amber-600 hover:bg-green-700 text-white"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Bot
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Empty State */}
        {bots.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-12 p-8 bg-[#191929] rounded-lg border border-gray-800">
            <RefreshCw className="h-16 w-16 mb-4 opacity-20" />
            <h3 className="text-xl font-medium mb-2">No Volume Bots Created</h3>
            <p className="text-gray-400 text-center max-w-md mb-6">
              Get started by creating your first volume bot. Volume bots help increase trading activity for your tokens.
            </p>
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Bot
            </Button>
          </div>
        )}

        {/* Token Bot Info Card - Show when a token is selected */}
        {selectedToken && (
          <div className="mb-6">
            <Card className="bg-[#191929] border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl flex items-center">
                      {selectedToken.symbol}
                      <Badge
                        className={`ml-2 ${
                          selectedToken.status === "active"
                            ? "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                            : selectedToken.status === "paused"
                              ? "bg-amber-600/20 text-amber-400 hover:bg-amber-600/30"
                              : "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                        }`}
                      >
                        {selectedToken.status === "active"
                          ? "Active"
                          : selectedToken.status === "paused"
                            ? "Paused"
                            : "Stopped"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-400">{selectedToken.name}</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {selectedToken.status === "paused" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30 hover:text-green-300"
                        onClick={handleStartBot}
                        disabled={anyBotRunning && selectedToken.status !== "active"}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    )}
                    {selectedToken.status === "active" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-amber-600/20 text-amber-400 border-amber-600/30 hover:bg-amber-600/30 hover:text-amber-300"
                          onClick={handlePauseBot}
                        >
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30 hover:text-red-300"
                          onClick={handleStopBot}
                        >
                          <StopCircle className="h-4 w-4 mr-1" />
                          Stop
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30 hover:text-red-300"
                      onClick={() => handleDeleteToken(selectedToken)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="bg-gray-800/50 mb-4">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="data-[state=active]:bg-gray-700">
                      <Activity className="h-4 w-4 mr-2" />
                      Activity
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="data-[state=active]:bg-gray-700">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <Card className="bg-gray-800/30 border-gray-700">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm font-medium text-gray-400">Bot Status</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="flex items-center justify-between">
                            <div
                              className={`text-lg font-semibold ${
                                selectedToken.status === "active"
                                  ? "text-green-400"
                                  : selectedToken.status === "paused"
                                    ? "text-amber-400"
                                    : "text-red-400"
                              }`}
                            >
                              {selectedToken.status === "active"
                                ? "Running"
                                : selectedToken.status === "paused"
                                  ? "Paused"
                                  : "Stopped"}
                            </div>
                            <Clock className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="mt-2 text-xs text-gray-400">
                            {selectedToken.status === "active"
                              ? "Bot is actively trading"
                              : selectedToken.status === "paused"
                                ? "Bot is paused and can be resumed"
                                : "Bot is stopped and cannot be restarted"}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-800/30 border-gray-700">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm font-medium text-gray-400">Progress</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-semibold text-amber-400">{selectedToken.progress || 0}%</div>
                            <div className="text-xs text-gray-400">
                              {Math.floor(((selectedToken.progress || 0) * selectedToken.duration) / 100)} /{" "}
                              {selectedToken.duration} hours
                            </div>
                          </div>
                          <Progress
                            value={selectedToken.progress || 0}
                            className="h-2 mt-2 bg-gray-700"
                            indicatorClassName="bg-amber-500"
                          />
                        </CardContent>
                      </Card>

                      <WalletStatusCard
                        totalWallets={selectedToken.numberOfWallets}
                        generatedWallets={wallets.length}
                        onGenerateWallets={handleGenerateWallets}
                        onImportWallets={() => {}}
                        onTagWallets={() => {}}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-gray-800/30 border-gray-700">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm font-medium text-gray-400">Bot Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                            <div>
                              <span className="text-gray-500">Strategy:</span>{" "}
                              <span className="text-gray-300 capitalize">{selectedToken.strategy || "bump"}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Platform:</span>{" "}
                              <span className="text-gray-300 capitalize">{selectedToken.platform || "raydium"}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Duration:</span>{" "}
                              <span className="text-gray-300">{selectedToken.duration || 24} hours</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Trades/Min:</span>{" "}
                              <span className="text-gray-300">{selectedToken.tradesPerMinute || 16}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Min Trade:</span>{" "}
                              <span className="text-gray-300">{selectedToken.minTradeAmount || 0.01} SOL</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Max Trade:</span>{" "}
                              <span className="text-gray-300">{selectedToken.maxTradeAmount || 0.05} SOL</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Slippage:</span>{" "}
                              <span className="text-gray-300">{selectedToken.slippage || 5}%</span>
                            </div>
                            <div>
                              <span className="text-gray-500">AntiMEV:</span>{" "}
                              <span className={selectedToken.useAntiMev ? "text-green-400" : "text-gray-300"}>
                                {selectedToken.useAntiMev ? "Enabled" : "Disabled"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-800/30 border-gray-700">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm font-medium text-gray-400">Token Details</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="grid grid-cols-1 gap-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Token Address:</span>
                              <span className="text-gray-300 font-mono">
                                {selectedToken.address.substring(0, 8)}...
                                {selectedToken.address.substring(selectedToken.address.length - 8)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Total Trades:</span>
                              <span className="text-gray-300">
                                {(selectedToken.tradesPerMinute || 16) * (selectedToken.duration || 24) * 60}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Estimated Volume:</span>
                              <span className="text-amber-400">
                                $
                                {(
                                  (selectedToken.maxTradeAmount || 0.05) *
                                  (selectedToken.tradesPerMinute || 16) *
                                  (selectedToken.duration || 24) *
                                  60 *
                                  2 *
                                  145
                                ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Created:</span>
                              <span className="text-gray-300">
                                {formatDate(new Date(Number.parseInt(selectedToken.id)))}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="activity" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <Card className="bg-gray-800/30 border-gray-700">
                          <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-sm font-medium text-gray-400">Activity Logs</CardTitle>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 bg-transparent border-gray-700 hover:bg-gray-700 text-xs"
                                onClick={handleExportData}
                              >
                                <Download className="h-3.5 w-3.5 mr-1" />
                                Export
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="p-0">
                            <div className="max-h-[400px] overflow-y-auto">
                              <table className="w-full">
                                <thead className="bg-gray-800/50 sticky top-0">
                                  <tr>
                                    <th className="text-left p-3 text-xs font-medium text-gray-400">Action</th>
                                    <th className="text-left p-3 text-xs font-medium text-gray-400">Details</th>
                                    <th className="text-right p-3 text-xs font-medium text-gray-400">Time</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/50">
                                  {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-800/30">
                                      <td className="p-3 text-xs">
                                        <div
                                          className={`font-medium ${
                                            log.type === "success"
                                              ? "text-green-400"
                                              : log.type === "warning"
                                                ? "text-amber-400"
                                                : log.type === "error"
                                                  ? "text-red-400"
                                                  : "text-gray-300"
                                          }`}
                                        >
                                          {log.message.split(":")[0]}
                                        </div>
                                      </td>
                                      <td className="p-3 text-xs text-gray-400">
                                        {log.message.includes(":") ? log.message.split(":")[1] : ""}
                                      </td>
                                      <td className="p-3 text-xs text-gray-500 text-right">
                                        {formatDate(log.timestamp)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="md:col-span-1">
                        <ActivityLogger
                          botId={selectedToken.id}
                          isActive={selectedToken.status === "active"}
                          maxHeight="400px"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="mt-0">
                    <Card className="bg-gray-800/30 border-gray-700">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Bot Settings</CardTitle>
                        <CardDescription className="text-xs text-gray-500">
                          Adjust settings for your volume bot
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button
                              variant="outline"
                              className="w-full justify-start bg-transparent border-gray-700 hover:bg-gray-700"
                              onClick={handleRecoverSols}
                            >
                              <div className="flex items-center">
                                <div className="bg-amber-500/20 p-2 rounded-md mr-3">
                                  <RefreshCw className="h-5 w-5 text-amber-500" />
                                </div>
                                <div className="text-left">
                                  <div className="font-medium">Recover SOL</div>
                                  <div className="text-xs text-gray-400">Recover SOL from all wallets</div>
                                </div>
                              </div>
                            </Button>

                            <Button
                              variant="outline"
                              className="w-full justify-start bg-transparent border-gray-700 hover:bg-gray-700"
                              onClick={handleWsolConversion}
                              disabled={isConverting}
                            >
                              <div className="flex items-center">
                                <div className="bg-blue-500/20 p-2 rounded-md mr-3">
                                  <RefreshCw className="h-5 w-5 text-blue-500" />
                                </div>
                                <div className="text-left">
                                  <div className="font-medium">{isWsolMode ? "Convert to WSOL" : "Convert to SOL"}</div>
                                  <div className="text-xs text-gray-400">
                                    {isConverting
                                      ? "Converting..."
                                      : `Convert all wallets to ${isWsolMode ? "SOL" : "WSOL"}`}
                                  </div>
                                </div>
                              </div>
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button
                              variant="outline"
                              className="w-full justify-start bg-transparent border-gray-700 hover:bg-gray-700"
                              onClick={handleDeleteWallets}
                            >
                              <div className="flex items-center">
                                <div className="bg-green-500/20 p-2 rounded-md mr-3">
                                  <Settings className="h-5 w-5 text-green-500" />
                                </div>
                                <div className="text-left">
                                  <div className="font-medium">Delete Wallets</div>
                                  <div className="text-xs text-gray-400">
                                    Modify bot configuration and Delete Wallets
                                  </div>
                                </div>
                              </div>
                            </Button>

                            <Button
                              variant="outline"
                              className="w-full justify-start bg-transparent border-gray-700 hover:bg-red-900/30"
                              onClick={() => handleDeleteToken(selectedToken)}
                            >
                              <div className="flex items-center">
                                <div className="bg-red-500/20 p-2 rounded-md mr-3">
                                  <Trash2 className="h-5 w-5 text-red-500" />
                                </div>
                                <div className="text-left">
                                  <div className="font-medium">Delete Bot</div>
                                  <div className="text-xs text-gray-400">Permanently delete this bot</div>
                                </div>
                              </div>
                            </Button>
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

      <CreateBotDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onCreateBot={handleAddToken} />
    </div>
  )
}
