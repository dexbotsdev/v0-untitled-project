"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Play,
  Pause,
  StopCircle,
  Trash2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  RefreshCw,
  Download,
  Settings,
  AlertCircle,
  CheckCircle,
  RotateCw,
  Coins,
  DollarSign,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tag } from "lucide-react"

// SOL to USD conversion rate
const SOL_USD_RATE = 145

interface TokenBotInfoCardProps {
  token: any
  onStartBot: (tokenId: string) => void
  onPauseBot: (tokenId: string) => void
  onStopBot: (tokenId: string) => void
  onDeleteBot: (tokenId: string) => void
  onCloneBot: (tokenId: string) => void
}

export function TokenBotInfoCard({
  token,
  onStartBot,
  onPauseBot,
  onStopBot,
  onDeleteBot,
  onCloneBot,
}: TokenBotInfoCardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [tradesPerMinute, setTradesPerMinute] = useState(token.tradesPerMinute?.toString() || "16")
  const [durationMinutes, setDurationMinutes] = useState((token.duration * 60).toString())
  const [tipAmount, setTipAmount] = useState(token.tipAmount?.toString() || "10000")

  // Fund wallets dialog state
  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false)
  const [fundingType, setFundingType] = useState("fixed")
  const [fixedAmount, setFixedAmount] = useState("0.1")
  const [minAmount, setMinAmount] = useState("0.05")
  const [maxAmount, setMaxAmount] = useState("0.15")
  const [isFunding, setIsFunding] = useState(false)

  // Tag wallets dialog state
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState("")
  const [isTagging, setIsTagging] = useState(false)

  // Wallet management state
  const [isGenerateWalletsDialogOpen, setIsGenerateWalletsDialogOpen] = useState(false)
  const [isImportWalletsDialogOpen, setIsImportWalletsDialogOpen] = useState(false)
  const [isGeneratingWallets, setIsGeneratingWallets] = useState(false)
  const [isImportingWallets, setIsImportingWallets] = useState(false)
  const [walletsGenerated, setWalletsGenerated] = useState(false)
  const [importWalletsText, setImportWalletsText] = useState("")

  const { toast } = useToast()

  // Format date helper
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  // Generate mock activity logs
  const generateActivityLogs = () => {
    const logs = []
    const now = new Date()

    // Add some initial setup logs
    logs.push({
      action: "Created",
      details: `Bot created with ${token.strategy} strategy`,
      timestamp: new Date(now.getTime() - 120 * 60000),
    })

    logs.push({
      action: "Config",
      details: `Set trades per minute to ${token.tradesPerMinute}`,
      timestamp: new Date(now.getTime() - 119 * 60000),
    })

    // Add trade logs
    for (let i = 0; i < 20; i++) {
      const isBuy = i % 3 !== 2
      logs.push({
        action: isBuy ? "Buy" : "Sell",
        details: `${isBuy ? "Bought" : "Sold"} ${(Math.random() * (token.maxTradeAmount - token.minTradeAmount) + token.minTradeAmount).toFixed(4)} SOL of ${token.symbol}`,
        timestamp: new Date(now.getTime() - (100 - i * 5) * 60000),
      })
    }

    // Add some status change logs
    logs.push({
      action: "Started",
      details: "Bot execution started",
      timestamp: new Date(now.getTime() - 100 * 60000),
    })

    logs.push({
      action: "Paused",
      details: "Bot execution paused by user",
      timestamp: new Date(now.getTime() - 50 * 60000),
    })

    logs.push({
      action: "Resumed",
      details: "Bot execution resumed",
      timestamp: new Date(now.getTime() - 45 * 60000),
    })

    // Sort by timestamp (newest first)
    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  const activityLogs = generateActivityLogs()

  // Calculate estimated volume based on trades per minute and duration
  const calculateEstimatedVolume = () => {
    const tpm = Number.parseInt(tradesPerMinute || "16")
    const minutes = Number.parseInt(durationMinutes || (token.duration * 60).toString())
    const maxTrade = token.maxTradeAmount || 0.05

    // Total Volume = Duration in Minutes * Trades Per Minute * Max Trade * 2 in USD
    return minutes * tpm * maxTrade * 2 * SOL_USD_RATE
  }

  // Calculate total trades
  const calculateTotalTrades = () => {
    const tpm = Number.parseInt(tradesPerMinute || "16")
    const minutes = Number.parseInt(durationMinutes || (token.duration * 60).toString())
    return tpm * minutes
  }

  // Handle trades per minute change
  const handleTradesPerMinuteChange = (e) => {
    setTradesPerMinute(e.target.value)
  }

  // Handle duration change
  const handleDurationChange = (e) => {
    setDurationMinutes(e.target.value)
  }

  // Handle tip amount change
  const handleTipAmountChange = (e) => {
    setTipAmount(e.target.value)
  }

  // Handle fund wallets
  const handleFundWallets = async () => {
    // Validate inputs
    if (fundingType === "fixed") {
      const amount = Number.parseFloat(fixedAmount)
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid positive amount",
          variant: "destructive",
        })
        return
      }
    } else {
      const min = Number.parseFloat(minAmount)
      const max = Number.parseFloat(maxAmount)
      if (isNaN(min) || min <= 0 || isNaN(max) || max <= 0 || min >= max) {
        toast({
          title: "Invalid Range",
          description: "Please enter a valid range with min less than max",
          variant: "destructive",
        })
        return
      }
    }

    setIsFunding(true)

    try {
      // Get funding wallet from localStorage
      const fundingWalletData = localStorage.getItem("fundingWallet")
      if (!fundingWalletData) {
        throw new Error("No funding wallet found. Please set up a funding wallet in Settings.")
      }

      const fundingWallet = JSON.parse(fundingWalletData)

      // Calculate total wallets to fund
      const totalWallets = calculateTotalTrades()

      // Calculate total amount needed
      let totalAmount
      if (fundingType === "fixed") {
        totalAmount = Number.parseFloat(fixedAmount) * totalWallets
      } else {
        // For range, use average for estimation
        const avgAmount = (Number.parseFloat(minAmount) + Number.parseFloat(maxAmount)) / 2
        totalAmount = avgAmount * totalWallets
      }

      // Simulate funding process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Close dialog and show success message
      setIsFundDialogOpen(false)
      setIsFunding(false)

      toast({
        title: "Wallets Funded Successfully",
        description: `Funded ${totalWallets.toLocaleString()} wallets with ${fundingType === "fixed" ? fixedAmount : `${minAmount}-${maxAmount}`} SOL each (Total: ~${totalAmount.toFixed(2)} SOL)`,
      })

      // Add to activity logs
      activityLogs.unshift({
        action: "Funded",
        details: `Funded ${totalWallets.toLocaleString()} wallets with ${fundingType === "fixed" ? fixedAmount : `${minAmount}-${maxAmount}`} SOL each`,
        timestamp: new Date(),
      })
    } catch (error) {
      setIsFunding(false)
      toast({
        title: "Funding Failed",
        description: error.message || "Failed to fund wallets. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle tag wallets
  const handleTagWallets = async () => {
    // Validate selection
    if (!selectedTag) {
      toast({
        title: "No Tag Selected",
        description: "Please select a tag to continue",
        variant: "destructive",
      })
      return
    }

    setIsTagging(true)

    try {
      // Calculate total wallets to tag
      const totalWallets = calculateTotalTrades()

      // Simulate tagging process
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Close dialog and show success message
      setIsTagDialogOpen(false)
      setIsTagging(false)

      toast({
        title: "Wallets Tagged Successfully",
        description: `Tagged ${totalWallets.toLocaleString()} wallets with "${selectedTag}"`,
      })

      // Add to activity logs
      activityLogs.unshift({
        action: "Tagged",
        details: `Tagged ${totalWallets.toLocaleString()} wallets with "${selectedTag}"`,
        timestamp: new Date(),
      })
    } catch (error) {
      setIsTagging(false)
      toast({
        title: "Tagging Failed",
        description: error.message || "Failed to tag wallets. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle generate wallets
  const handleGenerateWallets = async () => {
    setIsGeneratingWallets(true)

    try {
      // Calculate total wallets to generate
      const totalWallets = calculateTotalTrades()

      // Simulate wallet generation process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Close dialog and show success message
      setIsGenerateWalletsDialogOpen(false)
      setIsGeneratingWallets(false)
      setWalletsGenerated(true)

      toast({
        title: "Wallets Generated Successfully",
        description: `Generated ${totalWallets.toLocaleString()} wallets for ${token.symbol}`,
      })

      // Add to activity logs
      activityLogs.unshift({
        action: "Generated",
        details: `Generated ${totalWallets.toLocaleString()} wallets for trading`,
        timestamp: new Date(),
      })
    } catch (error) {
      setIsGeneratingWallets(false)
      toast({
        title: "Wallet Generation Failed",
        description: error.message || "Failed to generate wallets. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle import wallets
  const handleImportWallets = async () => {
    // Validate input
    if (!importWalletsText.trim()) {
      toast({
        title: "No Wallets Provided",
        description: "Please enter wallet addresses to import",
        variant: "destructive",
      })
      return
    }

    setIsImportingWallets(true)

    try {
      // Parse wallet addresses (one per line)
      const walletAddresses = importWalletsText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)

      if (walletAddresses.length === 0) {
        throw new Error("No valid wallet addresses found")
      }

      // Simulate import process
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Close dialog and show success message
      setIsImportWalletsDialogOpen(false)
      setIsImportingWallets(false)
      setWalletsGenerated(true)

      toast({
        title: "Wallets Imported Successfully",
        description: `Imported ${walletAddresses.length.toLocaleString()} wallets for ${token.symbol}`,
      })

      // Add to activity logs
      activityLogs.unshift({
        action: "Imported",
        details: `Imported ${walletAddresses.length.toLocaleString()} wallets for trading`,
        timestamp: new Date(),
      })
    } catch (error) {
      setIsImportingWallets(false)
      toast({
        title: "Wallet Import Failed",
        description: error.message || "Failed to import wallets. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "paused":
        return "bg-amber-500"
      case "stopped":
      default:
        return "bg-red-500"
    }
  }

  // Get action color
  const getActionColor = (action) => {
    switch (action) {
      case "Buy":
        return "text-green-400"
      case "Sell":
        return "text-red-400"
      case "Started":
      case "Resumed":
        return "text-green-400"
      case "Paused":
        return "text-amber-400"
      case "Stopped":
        return "text-red-400"
      case "Error":
        return "text-red-400"
      case "Funded":
        return "text-amber-400"
      case "Created":
      case "Config":
      case "Tagged":
        return "text-purple-400"
      case "Generated":
        return "text-green-400"
      case "Imported":
        return "text-blue-400"
      default:
        return "text-blue-400"
    }
  }

  // Get action icon
  const getActionIcon = (action) => {
    switch (action) {
      case "Buy":
        return <ArrowUpRight className="h-4 w-4 text-green-400" />
      case "Sell":
        return <ArrowDownRight className="h-4 w-4 text-red-400" />
      case "Started":
      case "Resumed":
        return <Play className="h-4 w-4 text-green-400" />
      case "Paused":
        return <Pause className="h-4 w-4 text-amber-400" />
      case "Stopped":
        return <StopCircle className="h-4 w-4 text-red-400" />
      case "Error":
        return <AlertCircle className="h-4 w-4 text-red-400" />
      case "Funded":
        return <DollarSign className="h-4 w-4 text-amber-400" />
      case "Created":
        return <CheckCircle className="h-4 w-4 text-blue-400" />
      case "Config":
        return <Settings className="h-4 w-4 text-blue-400" />
      case "Tagged":
        return <Tag className="h-4 w-4 text-purple-400" />
      case "Generated":
        return <RefreshCw className="h-4 w-4 text-green-400" />
      case "Imported":
        return <ArrowUpRight className="h-4 w-4 text-blue-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <>
      <Card className="border-gray-800 bg-[#1e2133] text-stone-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-xl font-bold">{token.symbol}</CardTitle>
            <Badge
              variant="outline"
              className={`${getStatusColor(token.status)} text-white border-0 uppercase text-xs font-semibold`}
            >
              {token.status === "active" ? "Active" : token.status === "paused" ? "Paused" : "Stopped"}
            </Badge>
          </div>
          <div className="flex space-x-2">
            {token.status === "active" ? (
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
                onClick={() => onPauseBot(token.id)}
              >
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
                onClick={() => onStartBot(token.id)}
              >
                <Play className="h-4 w-4 mr-1" />
                Start
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
              onClick={() => onStopBot(token.id)}
            >
              <StopCircle className="h-4 w-4 mr-1" />
              Stop
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-900/50 border-b border-gray-800 w-full rounded-none h-10">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gray-800/50 rounded-none h-10">
                Overview
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-gray-800/50 rounded-none h-10">
                Activity
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-gray-800/50 rounded-none h-10">
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Card */}
                <Card className="bg-gray-900/30 border-gray-800">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm font-medium text-gray-400">Status</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 px-4">
                    <div className="flex items-center space-x-2">
                      <div className={`h-3 w-3 rounded-full ${getStatusColor(token.status)}`}></div>
                      <span className="text-lg font-semibold">
                        {token.status === "active" ? "Running" : token.status === "paused" ? "Paused" : "Stopped"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress Card */}
                <Card className="bg-gray-900/30 border-gray-800">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm font-medium text-gray-400">Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 px-4">
                    <div className="space-y-2">
                      <Progress value={token.progress} className="h-2 bg-gray-800" />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{token.progress}% Complete</span>
                        <span>
                          <Clock className="h-3 w-3 inline mr-1" />
                          {Math.round(((100 - token.progress) / 100) * token.duration)} hours left
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Volume Card */}
                <Card className="bg-gray-900/30 border-gray-800">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm font-medium text-gray-400">Estimated Volume</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 px-4">
                    <div className="text-lg font-semibold text-amber-400">
                      ${calculateEstimatedVolume().toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Based on {calculateTotalTrades().toLocaleString()} total trades
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bot Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bot Settings */}
                <Card className="bg-gray-900/30 border-gray-800">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm font-medium text-gray-400">Bot Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 px-4">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Strategy: </span>
                        <span className="capitalize">{token.strategy}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Platform: </span>
                        <span className="capitalize">{token.platform}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Duration: </span>
                        <span>{token.duration} hours</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Trade Range: </span>
                        <span>
                          {token.minTradeAmount} - {token.maxTradeAmount} SOL
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">AntiMEV: </span>
                        <span>{token.useAntiMev ? "Enabled" : "Disabled"}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Fake Signers: </span>
                        <span>{token.useFakeSigners ? "Enabled" : "Disabled"}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Slippage: </span>
                        <span>{token.slippage}%</span>
                      </div>
                    </div>

                    {/* Trades Per Minute Input */}
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="tradesPerMinute" className="text-xs text-gray-400">
                        Trades Per Minute
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id="tradesPerMinute"
                          type="number"
                          min="1"
                          value={tradesPerMinute}
                          onChange={handleTradesPerMinuteChange}
                          className="bg-gray-900/50 border-gray-800 h-8 text-sm"
                        />
                      </div>
                    </div>

                    {/* Duration Input */}
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="durationMinutes" className="text-xs text-gray-400">
                        Duration to Run (minutes)
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id="durationMinutes"
                          type="number"
                          min="1"
                          value={durationMinutes}
                          onChange={handleDurationChange}
                          className="bg-gray-900/50 border-gray-800 h-8 text-sm"
                        />
                      </div>
                    </div>

                    {/* Update Button */}
                    <Button className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-black h-8 text-xs">
                      <RefreshCw className="h-3 w-3 mr-1.5" />
                      Update Configuration
                    </Button>
                  </CardContent>
                </Card>

                {/* Token Details */}
                <Card className="bg-gray-900/30 border-gray-800">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm font-medium text-gray-400">Token Details</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 px-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <Coins className="h-6 w-6 text-amber-500" />
                      </div>
                      <div>
                        <div className="font-medium">{token.name}</div>
                        <div className="text-xs text-gray-400">{token.symbol}</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Token Address:</span>
                        <span className="font-mono text-xs bg-gray-800 px-2 py-0.5 rounded">
                          {token.address.substring(0, 6)}...{token.address.substring(token.address.length - 4)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Total Trades:</span>
                        <span>{calculateTotalTrades().toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Estimated Volume:</span>
                        <span className="text-amber-400">
                          ${calculateEstimatedVolume().toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Created:</span>
                        <span>{formatDate(new Date())}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <div className="text-xs text-gray-400 mb-2">Token Explorer Links:</div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
                        >
                          Solscan
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
                        >
                          Explorer
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
                        >
                          DexScreener
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Activity Logs</h3>
                <Button variant="outline" size="sm" className="h-8 border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                  <Download className="h-4 w-4 mr-1.5" />
                  Export Logs
                </Button>
              </div>

              <Card className="bg-gray-900/30 border-gray-800">
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader className="bg-gray-900/50">
                      <TableRow className="border-gray-800 hover:bg-transparent">
                        <TableHead className="text-gray-400 w-[100px]">Action</TableHead>
                        <TableHead className="text-gray-400">Details</TableHead>
                        <TableHead className="text-gray-400 text-right w-[150px]">Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activityLogs.map((log, index) => (
                        <TableRow key={index} className="border-gray-800 hover:bg-gray-800/30">
                          <TableCell className="py-2">
                            <div className="flex items-center space-x-2">
                              {getActionIcon(log.action)}
                              <span className={getActionColor(log.action)}>{log.action}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-2 text-sm">{log.details}</TableCell>
                          <TableCell className="py-2 text-right text-xs text-gray-400">
                            {formatDate(log.timestamp)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gray-900/30 border-gray-800">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm font-medium text-gray-400">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 px-4 space-y-3">
                    {!walletsGenerated ? (
                      <>
                        <div className="bg-amber-500/10 rounded-md p-3 border border-amber-500/30 mb-3">
                          <div className="flex items-start space-x-2">
                            <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-amber-400">
                              <p className="font-medium mb-1">Wallets Required</p>
                              <p>
                                This bot needs {calculateTotalTrades().toLocaleString()} wallets to operate. Please
                                generate new wallets or import existing ones.
                              </p>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full justify-start border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
                          onClick={() => setIsGenerateWalletsDialogOpen(true)}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Generate Wallets
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
                          onClick={() => setIsImportWalletsDialogOpen(true)}
                        >
                          <ArrowUpRight className="h-4 w-4 mr-2" />
                          Import Wallets
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          className="w-full justify-start border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
                          onClick={() => setIsFundDialogOpen(true)}
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Fund Wallets
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
                          onClick={() => setIsTagDialogOpen(true)}
                        >
                          <Tag className="h-4 w-4 mr-2" />
                          Tag Wallets
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
                        >
                          <Wallet className="h-4 w-4 mr-2" />
                          Recover SOL from Wallets
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
                        >
                          <RotateCw className="h-4 w-4 mr-2" />
                          Convert SOL to WSOL
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      className="w-full justify-start border-red-900/30 bg-red-900/10 hover:bg-red-900/20 text-red-400"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Bot
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/30 border-gray-800">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm font-medium text-gray-400">Advanced Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 px-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="priorityFees" className="text-xs text-gray-400">
                          Priority Fees (LAMPs)
                        </Label>
                        <Input
                          id="priorityFees"
                          type="number"
                          min="0"
                          defaultValue={token.priorityFees || 10000}
                          className="bg-gray-900/50 border-gray-800 h-8 text-sm"
                        />
                        <p className="text-xs text-gray-500">
                          {((token.priorityFees || 10000) / 1000000000).toFixed(7)} SOL per transaction
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tipAmount" className="text-xs text-gray-400">
                          Jito Tips (LAMPs)
                        </Label>
                        <Input
                          id="tipAmount"
                          type="number"
                          min="0"
                          value={tipAmount}
                          onChange={handleTipAmountChange}
                          className="bg-gray-900/50 border-gray-800 h-8 text-sm"
                        />
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>{(Number.parseInt(tipAmount || "10000") / 1000000000).toFixed(7)} SOL per transaction</p>
                          <p className="text-amber-400">
                            Total Jito Fees:{" "}
                            {((Number.parseInt(tipAmount || "10000") / 1000000000) * calculateTotalTrades()).toFixed(4)}{" "}
                            SOL
                            <span className="text-gray-500 ml-1">
                              (for {calculateTotalTrades().toLocaleString()} trades)
                            </span>
                          </p>
                        </div>
                      </div>

                      <Button className="w-full bg-amber-600 hover:bg-amber-700 text-black h-8 text-xs mt-2">
                        Save Advanced Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Fund Wallets Dialog */}
      <Dialog open={isFundDialogOpen} onOpenChange={setIsFundDialogOpen}>
        <DialogContent className="bg-[#1e2133] border-gray-800 text-stone-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-amber-500" />
              Fund Wallets
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Fund all wallets for {token.symbol} using your funding wallet.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm">Funding Method</Label>
              <RadioGroup value={fundingType} onValueChange={setFundingType} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="fixed" className="border-gray-600" />
                  <Label htmlFor="fixed" className="text-sm font-normal">
                    Fixed Amount
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="range" id="range" className="border-gray-600" />
                  <Label htmlFor="range" className="text-sm font-normal">
                    Range of Amounts
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {fundingType === "fixed" ? (
              <div className="space-y-2">
                <Label htmlFor="fixedAmount" className="text-sm">
                  Amount (SOL)
                </Label>
                <Input
                  id="fixedAmount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={fixedAmount}
                  onChange={(e) => setFixedAmount(e.target.value)}
                  className="bg-gray-900/50 border-gray-800"
                />
                <p className="text-xs text-gray-500">Each wallet will receive exactly {fixedAmount} SOL.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="minAmount" className="text-sm">
                    Minimum Amount (SOL)
                  </Label>
                  <Input
                    id="minAmount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    className="bg-gray-900/50 border-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAmount" className="text-sm">
                    Maximum Amount (SOL)
                  </Label>
                  <Input
                    id="maxAmount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    className="bg-gray-900/50 border-gray-800"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Each wallet will receive a random amount between {minAmount} and {maxAmount} SOL.
                </p>
              </div>
            )}

            <div className="bg-amber-500/10 rounded-md p-3 border border-amber-500/30">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-400">
                  <p className="font-medium mb-1">Funding {calculateTotalTrades().toLocaleString()} wallets</p>
                  <p>
                    Estimated total:{" "}
                    {fundingType === "fixed"
                      ? (Number.parseFloat(fixedAmount) * calculateTotalTrades()).toFixed(2)
                      : (
                          ((Number.parseFloat(minAmount) + Number.parseFloat(maxAmount)) / 2) *
                          calculateTotalTrades()
                        ).toFixed(2)}{" "}
                    SOL
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex space-x-2 sm:space-x-0">
            <Button
              variant="outline"
              onClick={() => setIsFundDialogOpen(false)}
              className="border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleFundWallets}
              disabled={isFunding}
              className="bg-amber-600 hover:bg-amber-700 text-black"
            >
              {isFunding ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Funding...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Fund Wallets
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tag Wallets Dialog */}
      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent className="bg-[#1e2133] border-gray-800 text-stone-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <Tag className="h-5 w-5 mr-2 text-purple-400" />
              Tag Wallets
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Apply a tag to all wallets for {token.symbol}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm">Select Tag</Label>
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="bg-gray-900/50 border-gray-800">
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800 text-stone-200">
                  <SelectItem value="Bullx">Bullx</SelectItem>
                  <SelectItem value="Photon">Photon</SelectItem>
                  <SelectItem value="Axiom">Axiom</SelectItem>
                  <SelectItem value="Raydium">Raydium</SelectItem>
                  <SelectItem value="Orca">Orca</SelectItem>
                  <SelectItem value="Jupiter">Jupiter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-purple-500/10 rounded-md p-3 border border-purple-500/30">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-purple-400">
                  <p className="font-medium mb-1">Tagging {calculateTotalTrades().toLocaleString()} wallets</p>
                  <p>
                    This will apply the "{selectedTag || "..."}" tag to all wallets used by this bot. Tagged wallets can
                    be filtered and managed in the wallet management section.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex space-x-2 sm:space-x-0">
            <Button
              variant="outline"
              onClick={() => setIsTagDialogOpen(false)}
              className="border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleTagWallets}
              disabled={isTagging || !selectedTag}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isTagging ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Tagging...
                </>
              ) : (
                <>
                  <Tag className="h-4 w-4 mr-2" />
                  Apply Tag
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Wallets Dialog */}
      <Dialog open={isGenerateWalletsDialogOpen} onOpenChange={setIsGenerateWalletsDialogOpen}>
        <DialogContent className="bg-[#1e2133] border-gray-800 text-stone-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <RefreshCw className="h-5 w-5 mr-2 text-green-500" />
              Generate Wallets
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Generate new wallets for {token.symbol} trading bot.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-green-500/10 rounded-md p-3 border border-green-500/30">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-green-400">
                  <p className="font-medium mb-1">Generating {calculateTotalTrades().toLocaleString()} wallets</p>
                  <p>
                    This will create {calculateTotalTrades().toLocaleString()} new wallets for this bot. Each wallet
                    will be used for trading operations based on your configuration.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Next Steps</Label>
              <p className="text-xs text-gray-400">After generating wallets, you'll need to:</p>
              <ul className="text-xs text-gray-400 list-disc pl-5 space-y-1">
                <li>Fund the wallets with SOL</li>
                <li>Optionally tag wallets for better organization</li>
                <li>Start the bot to begin trading</li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex space-x-2 sm:space-x-0">
            <Button
              variant="outline"
              onClick={() => setIsGenerateWalletsDialogOpen(false)}
              className="border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateWallets}
              disabled={isGeneratingWallets}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isGeneratingWallets ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate Wallets
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Wallets Dialog */}
      <Dialog open={isImportWalletsDialogOpen} onOpenChange={setIsImportWalletsDialogOpen}>
        <DialogContent className="bg-[#1e2133] border-gray-800 text-stone-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <ArrowUpRight className="h-5 w-5 mr-2 text-blue-500" />
              Import Wallets
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Import existing wallets for {token.symbol} trading bot.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="importWallets" className="text-sm">
                Wallet Addresses (one per line)
              </Label>
              <textarea
                id="importWallets"
                value={importWalletsText}
                onChange={(e) => setImportWalletsText(e.target.value)}
                className="w-full h-32 bg-gray-900/50 border-gray-800 rounded-md p-2 text-sm font-mono"
                placeholder="Enter wallet addresses, one per line"
              />
              <p className="text-xs text-gray-500">
                Enter each wallet address on a new line. You need approximately{" "}
                {calculateTotalTrades().toLocaleString()} wallets.
              </p>
            </div>

            <div className="bg-blue-500/10 rounded-md p-3 border border-blue-500/30">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-400">
                  <p className="font-medium mb-1">Important</p>
                  <p>Ensure you have the private keys for these wallets. The bot will need to sign transactions.</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex space-x-2 sm:space-x-0">
            <Button
              variant="outline"
              onClick={() => setIsImportWalletsDialogOpen(false)}
              className="border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleImportWallets}
              disabled={isImportingWallets}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isImportingWallets ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Import Wallets
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
