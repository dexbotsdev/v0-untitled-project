"use client"

import { useState, useEffect } from "react"
import { Header2 } from "@/components/header2"
import { VolumeTokenList } from "@/components/volume-bot/token-list"
import { CreateBotDialog } from "@/components/volume-bot/create-bot-dialog"
import { WalletTable } from "@/components/volume-bot/wallet-table"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { StopCircle, RefreshCw, Download } from "lucide-react"

export default function VolumeBotPage() {
  const [tokens, setTokens] = useState<any[]>([])
  const [selectedToken, setSelectedToken] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [wallets, setWallets] = useState<any[]>([])
  const [isBotActive, setIsBotActive] = useState(false)
  const { toast } = useToast()

  // Mock data loading
  useEffect(() => {
    const loadMockData = async () => {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setTokens([
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
        },
      ])
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

    // Generate mock wallets
    const mockWallets = Array.from({ length: 20 }, (_, i) => ({
      id: `wallet-${i}`,
      address: `${i}xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosg${i}sU`.substring(0, 44),
      tokenBalance: Math.floor(Math.random() * 10000) / 100,
      solBalance: Math.floor(Math.random() * 100) / 100,
      tradesCount: Math.floor(Math.random() * 50),
      lastTrade: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
    }))

    setWallets(mockWallets)
    setIsBotActive(selectedToken.status === "active")
    setIsLoading(false)
  }

  const handleAddToken = (newToken: any) => {
    setTokens((prev) => [...prev, newToken])
    setSelectedToken(newToken)
    setIsBotActive(true)

    toast({
      title: "Volume Bot Created",
      description: `Volume bot for ${newToken.symbol} has been successfully created and started.`,
    })
  }

  const handleSelectToken = (token: any) => {
    setSelectedToken(token)
  }

  const handleStopBot = () => {
    if (!selectedToken) return

    setIsBotActive(false)
    setTokens((prev) => prev.map((t) => (t.id === selectedToken.id ? { ...t, status: "paused" } : t)))

    toast({
      title: "Volume Bot Stopped",
      description: `Volume bot for ${selectedToken.symbol} has been stopped.`,
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

  return (
    <div className="flex h-full flex-col">
      <Header2 title="Token Volume Booster" subtitle="Create and manage volume bots for your tokens" />

      <div className="flex flex-1 overflow-hidden">
        {/* Left side - Token list */}
        <div className="w-80 border-r bg-black border-gray-800 overflow-y-auto">
          <VolumeTokenList
            tokens={tokens}
            selectedTokenId={selectedToken?.id}
            onSelectToken={handleSelectToken}
            onAddToken={() => setIsDialogOpen(true)}
            isLoading={isLoading}
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
                      Target: {selectedToken.volumeTarget} • Progress: {selectedToken.progress}%
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="destructive" size="sm" onClick={handleStopBot} disabled={!isBotActive}>
                    <StopCircle className="mr-1 h-4 w-4" />
                    Stop Bot
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRecoverSols}>
                    Recover SOLs
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleExportData} title="Export Data">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                <WalletTable wallets={wallets} isLoading={isLoading} isBotActive={isBotActive} />
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
