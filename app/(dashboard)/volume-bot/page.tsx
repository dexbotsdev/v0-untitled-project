"use client"

import { useState, useEffect } from "react"
import { Header2 } from "@/components/header2"
import { VolumeTokenList } from "@/components/volume-bot/token-list"
import { CreateBotDialog } from "@/components/volume-bot/create-bot-dialog"
import { WalletTable } from "@/components/volume-bot/wallet-table"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { StopCircle, RefreshCw, Download, Send, Plus, Trash2, Play, Ban, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function VolumeBotPage() {
  // Add a new state variable to track if any bot is running
  const [tokens, setTokens] = useState<any[]>([])
  const [selectedToken, setSelectedToken] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [wallets, setWallets] = useState<any[]>([])
  const [isBotActive, setIsBotActive] = useState(false)
  const [anyBotRunning, setAnyBotRunning] = useState(false)
  const { toast } = useToast()
  const [selectAll, setSelectAll] = useState(false)
  const [fundAllAmount, setFundAllAmount] = useState("")
  const [isWsolMode, setIsWsolMode] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Update the useEffect that loads mock data to check if any bot is active
  useEffect(() => {
    const loadMockData = async () => {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockTokens = [
        {
          id: "1",
          symbol: "PEPE",
          name: "Pepe Token",
          address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
          logo: "/stylized-green-frog.png",
          price: 0.00000123,
          priceChange: 5.2,
          volumeTarget: "50,000 USDC",
          progress: 68,
          status: "active",
          settings: {
            minTradeAmount: 0.01,
            maxTradeAmount: 0.05,
            duration: 24,
            strategy: "bump",
            tradesPerMinute: 16,
            numberOfWallets: 20,
          },
        },
        {
          id: "2",
          symbol: "DOGE",
          name: "Doge Token",
          address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
          logo: "/doge-meme.png",
          price: 0.00000456,
          priceChange: -2.1,
          volumeTarget: "25,000 USDC",
          progress: 42,
          status: "paused",
          settings: {
            minTradeAmount: 0.02,
            maxTradeAmount: 0.08,
            duration: 12,
            strategy: "turbo",
            tradesPerMinute: 4,
            numberOfWallets: 15,
          },
        },
      ]

      // Check if any bot is active
      const hasActiveBots = mockTokens.some((token) => token.status === "active")
      setAnyBotRunning(hasActiveBots)

      setTokens(mockTokens)
      setIsLoading(false)
    }

    loadMockData()
  }, [])

  // Load wallets when a token is selected
  useEffect(() => {
    if (selectedToken) {
      loadWallets(selectedToken.id)
    }
  }, [selectedToken])

  const loadWallets = async (tokenId: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Generate mock wallets - only for existing tokens, not for newly created ones
    const existingToken = tokens.find((token) => token.id === tokenId)
    if (existingToken) {
      // Use the number of wallets from the token settings if available
      const numberOfWallets = existingToken.settings?.numberOfWallets || 20

      const mockWallets = Array.from({ length: numberOfWallets }, (_, i) => ({
        id: `wallet-${i}`,
        address: `${i}xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosg${i}sU`.substring(0, 44),
        tokenBalance: Math.floor(Math.random() * 10000) / 100,
        solBalance: Math.floor(Math.random() * 100) / 100,
        tradesCount: Math.floor(Math.random() * 50),
        lastTrade: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
        selected: false,
      }))
      setWallets(mockWallets)
    } else {
      // For newly created tokens, start with an empty wallet list
      setWallets([])
    }

    setIsBotActive(selectedToken.status === "active")
    setIsLoading(false)
    setSelectAll(false)
  }

  // Update the handleAddToken function to ensure new tokens are created in paused state
  const handleAddToken = (newToken: any) => {
    // Ensure the newToken has all required properties including settings
    const tokenWithDefaults = {
      ...newToken,
      id: Date.now().toString(),
      progress: 0,
      status: "paused", // Always create in paused state
      // Make sure settings is properly structured
      settings: {
        minTradeAmount: newToken.settings?.minTradeAmount || 0.01,
        maxTradeAmount: newToken.settings?.maxTradeAmount || 0.05,
        duration: newToken.settings?.duration || 24,
        strategy: newToken.settings?.strategy || "bump",
        tradesPerMinute: newToken.settings?.tradesPerMinute || 16,
        numberOfWallets: newToken.settings?.numberOfWallets || 10,
      },
    }

    setTokens((prev) => [...prev, tokenWithDefaults])
    setSelectedToken(tokenWithDefaults)
    setIsBotActive(false)

    // Start with empty wallets for new tokens
    setWallets([])

    toast({
      title: "Volume Bot Created",
      description: `Volume bot for ${newToken.symbol} has been created in paused state.`,
    })
  }

  const handleSelectToken = (token: any) => {
    setSelectedToken(token)
  }

  // Update the handleStartBot function to check if any bot is already running
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
    if (anyBotRunning) {
      toast({
        title: "Cannot Start Bot",
        description: "Only one bot can run at a time. Please stop the currently running bot first.",
        variant: "destructive",
      })
      return
    }

    setIsBotActive(true)
    setAnyBotRunning(true)
    setTokens((prev) => prev.map((t) => (t.id === selectedToken.id ? { ...t, status: "active" } : t)))
    setSelectedToken((prev) => (prev ? { ...prev, status: "active" } : null))

    toast({
      title: "Volume Bot Started",
      description: `Volume bot for ${selectedToken.symbol} has been started.`,
    })
  }

  // Update the handleStopBot function to update the anyBotRunning state
  const handleStopBot = () => {
    if (!selectedToken) return

    setIsBotActive(false)
    setAnyBotRunning(false)
    setTokens((prev) => prev.map((t) => (t.id === selectedToken.id ? { ...t, status: "stopped" } : t)))
    setSelectedToken((prev) => (prev ? { ...prev, status: "stopped" } : null))

    toast({
      title: "Volume Bot Stopped",
      description: `Volume bot for ${selectedToken.symbol} has been stopped and cannot be restarted.`,
    })
  }

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

  const handleExportData = () => {
    toast({
      title: "Data Export",
      description: "Wallet data has been exported to CSV.",
    })
  }

  const handleDuplicateToken = (token: any) => {
    // Create a duplicate token with a new ID
    const duplicatedToken = {
      ...token,
      id: Date.now().toString(),
      name: `${token.name} (Copy)`,
      symbol: `${token.symbol}-C`,
      progress: 0,
      status: "paused",
    }

    setTokens((prev) => [...prev, duplicatedToken])

    toast({
      title: "Token Duplicated",
      description: `A copy of ${token.symbol} has been created.`,
    })
  }

  const handleDeleteToken = (token: any) => {
    // Remove the token from the list
    setTokens((prev) => prev.filter((t) => t.id !== token.id))

    // If the deleted token was selected, clear the selection
    if (selectedToken?.id === token.id) {
      setSelectedToken(null)
    }

    toast({
      title: "Token Deleted",
      description: `${token.symbol} has been deleted.`,
    })
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

    // Update the wallet balances
    setWallets((wallets) =>
      wallets.map((wallet) => {
        if (walletsToFund.some((w) => w.id === wallet.id)) {
          return {
            ...wallet,
            solBalance: wallet.solBalance + amount,
          }
        }
        return wallet
      }),
    )

    setFundAllAmount("")

    toast({
      title: "Wallets Funded",
      description: `Successfully funded ${walletsToFund.length} wallets with ${amount} SOL each`,
    })
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

    // Get the configured number of wallets from the token settings
    const configuredWalletCount = selectedToken.settings?.numberOfWallets || 10

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

    // Simulate API call
    setTimeout(() => {
      // Generate the exact number of wallets needed to reach the configured count
      const newWallets = Array.from({ length: walletsToGenerate }, (_, i) => {
        const id = `wallet-${wallets.length + i}`
        return {
          id,
          address: `${wallets.length + i}xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosg${i}sU`.substring(0, 44),
          tokenBalance: 0,
          solBalance: 0.01,
          tradesCount: 0,
          lastTrade: new Date().toISOString(),
          selected: false,
        }
      })

      // Add new wallets to the list
      setWallets((prev) => [...prev, ...newWallets])
      setIsGenerating(false)

      toast({
        title: "Wallets Generated",
        description: `Successfully generated ${walletsToGenerate} wallets for ${selectedToken?.symbol}`,
      })
    }, 1500)
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

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header2 title="Token Volume Booster" subtitle="Create and manage volume bots for your tokens" />

      <div className="flex flex-1 overflow-hidden">
        {/* Left side - Token list */}
        <div className="w-80 border-r bg-black border-gray-800 overflow-y-auto">
          {/* Update the VolumeTokenList component to pass the anyBotRunning state */}
          <VolumeTokenList
            tokens={tokens}
            selectedTokenId={selectedToken?.id}
            onSelectToken={handleSelectToken}
            onAddToken={() => setIsDialogOpen(true)}
            onDuplicateToken={handleDuplicateToken}
            onDeleteToken={handleDeleteToken}
            isLoading={isLoading}
            anyBotRunning={anyBotRunning}
          />
        </div>

        {/* Right side - Bot details and wallet table */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedToken ? (
            <>
              <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <img
                    src={selectedToken.logo || "/placeholder.svg"}
                    alt={selectedToken.symbol}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-medium">
                      {selectedToken.name} ({selectedToken.symbol})
                    </h3>
                    <p className="text-sm text-gray-400">
                      Target: {selectedToken.volumeTarget} • Progress: {selectedToken.progress}% • Strategy:{" "}
                      {selectedToken.settings?.strategy || "default"} • Wallets: {wallets.length}/
                      {selectedToken.settings?.numberOfWallets || 0}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {selectedToken.status === "paused" && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={handleStartBot}
                      disabled={anyBotRunning && selectedToken.status !== "active"}
                      title={anyBotRunning ? "Only one bot can run at a time" : "Start Bot"}
                    >
                      <Play className="mr-1 h-4 w-4" />
                      Start Bot
                    </Button>
                  )}
                  {selectedToken.status === "active" && (
                    <Button variant="destructive" size="sm" onClick={handleStopBot}>
                      <StopCircle className="mr-1 h-4 w-4" />
                      Stop Bot
                    </Button>
                  )}
                  {selectedToken.status === "stopped" && (
                    <Button variant="outline" size="sm" disabled>
                      <Ban className="mr-1 h-4 w-4" />
                      Bot Stopped
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={handleRecoverSols}>
                    Recover SOLs
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleExportData} title="Export Data">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDeleteWallets}
                    title="Delete Selected Wallets"
                    className="text-red-500 hover:text-red-400 hover:bg-red-900/20"
                    disabled={wallets.filter((w) => w.selected).length === 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {selectedToken.status === "paused" && anyBotRunning && (
                <div className="mt-2 text-xs text-amber-500 flex items-center p-4">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Only one bot can run at a time. Please stop the currently running bot first.
                </div>
              )}

              <div className="flex-1 overflow-auto">
                {/* Wallet Action Bar */}
                <div className="bg-[#191929] rounded-lg border border-gray-800 p-2 m-2">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#ECF1F0]">Fund All Wallets:</span>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          placeholder="Amount"
                          value={fundAllAmount}
                          onChange={(e) => setFundAllAmount(e.target.value)}
                          className="h-7 text-xs bg-[#11111D] border-gray-800 text-[#ECF1F0] w-24"
                          min="0"
                          step="0.01"
                        />
                        <span className="text-xs text-gray-400">{isWsolMode ? "WSOL" : "SOL"}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">
                        {wallets.filter((w) => w.selected).length} of {wallets.length} wallets selected
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-3 text-xs border-gray-700 text-[#ECF1F0] bg-transparent hover:bg-gray-800"
                        onClick={handleFundAllWallets}
                      >
                        <Send className="mr-1 h-3.5 w-3.5" /> Fund{" "}
                        {wallets.filter((w) => w.selected).length > 0 ? "Selected" : "All"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-3 text-xs border-gray-700 text-green-400 bg-transparent hover:bg-green-900/20"
                        onClick={handleGenerateWallets}
                        disabled={isGenerating}
                      >
                        <Plus className="mr-1 h-3.5 w-3.5" />
                        {isGenerating ? "Generating..." : "Generate Wallets"}
                      </Button>
                    </div>
                  </div>
                </div>

                <WalletTable
                  wallets={wallets}
                  isLoading={isLoading}
                  isBotActive={isBotActive}
                  selectAll={selectAll}
                  onSelectAll={handleSelectAll}
                  onSelectWallet={handleSelectWallet}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <RefreshCw className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-lg">Select a token or create a new volume bot</p>
              <Button variant="outline" className="mt-4" onClick={() => setIsDialogOpen(true)}>
                Create Volume Bot
              </Button>
            </div>
          )}
        </div>
      </div>

      <CreateBotDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onCreateBot={handleAddToken} />
    </div>
  )
}
