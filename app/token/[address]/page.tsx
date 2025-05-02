"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Header2 } from "@/components/header2"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUp, ArrowDown, Rocket, TrendingUp, Target, Clock, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Token interface
interface Token {
  id: number
  name: string
  symbol: string
  address: string
  description: string
  image: string | null
  platform: string
  price: number
  priceChange24h: number
  marketCap: number
  volume24h: number
  launchDate: string
  holders: number
  liquidity: number
  website?: string
  twitter?: string
  telegram?: string
}

// Trade interface
interface Trade {
  id: string
  type: "buy" | "sell"
  amount: number
  price: number
  value: number
  timestamp: Date
  wallet: string
  txHash: string
}

export default function TokenPage() {
  const params = useParams()
  const address = params.address as string

  const [token, setToken] = useState<Token | null>(null)
  const [trades, setTrades] = useState<Trade[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSnipeLoading, setIsSnipeLoading] = useState(false)
  const [isBumpLoading, setIsBumpLoading] = useState(false)
  const [isBoostLoading, setIsBoostLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("trades")

  // Fetch token data
  useEffect(() => {
    const fetchToken = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate a delay and return mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setToken({
          id: 1,
          name: "Solana Frog",
          symbol: "FROG",
          address: address || "0x1234567890abcdef1234567890abcdef12345678",
          description:
            "Solana Frog is a community-driven meme coin on the Solana blockchain, inspired by the popular frog meme culture.",
          image: "/stylized-green-frog.png",
          platform: "Solana",
          price: 0.00000425,
          priceChange24h: 12.5,
          marketCap: 2500000,
          volume24h: 350000,
          launchDate: "2023-04-15",
          holders: 3250,
          liquidity: 125000,
          website: "https://solanafrog.io",
          twitter: "https://twitter.com/solanafrog",
          telegram: "https://t.me/solanafrog",
        })

        // Generate initial trades
        generateMockTrades()
      } catch (error) {
        console.error("Error fetching token:", error)
        toast({
          title: "Error",
          description: "Failed to load token data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchToken()

    // Set up interval to add new trades periodically
    const interval = setInterval(() => {
      addNewTrade()
    }, 5000) // Add a new trade every 5 seconds

    return () => clearInterval(interval)
  }, [address])

  // Generate mock trades
  const generateMockTrades = () => {
    const mockTrades: Trade[] = []
    const now = new Date()

    // Generate 20 random trades
    for (let i = 0; i < 20; i++) {
      const type = Math.random() > 0.5 ? "buy" : "sell"
      const amount = Math.floor(Math.random() * 10000000) + 100000
      const price = 0.00000425 * (1 + (Math.random() * 0.1 - 0.05))
      const value = amount * price

      // Random time in the last 24 hours
      const timestamp = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000)

      mockTrades.push({
        id: `trade-${i}`,
        type,
        amount,
        price,
        value,
        timestamp,
        wallet: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
        txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      })
    }

    // Sort by timestamp (newest first)
    mockTrades.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    setTrades(mockTrades)
  }

  // Add a new trade
  const addNewTrade = () => {
    const type = Math.random() > 0.5 ? "buy" : "sell"
    const amount = Math.floor(Math.random() * 10000000) + 100000
    const price = token?.price ? token.price * (1 + (Math.random() * 0.02 - 0.01)) : 0.00000425
    const value = amount * price

    const newTrade: Trade = {
      id: `trade-${Date.now()}`,
      type,
      amount,
      price,
      value,
      timestamp: new Date(),
      wallet: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
    }

    // Add to beginning of array and limit to 50 trades
    setTrades((prev) => [newTrade, ...prev].slice(0, 50))

    // Update token price based on the new trade
    if (token) {
      setToken({
        ...token,
        price: price,
        priceChange24h: token.priceChange24h + (type === "buy" ? 0.05 : -0.05),
      })
    }
  }

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  // Format currency
  const formatCurrency = (num: number) => {
    if (num < 0.000001) {
      return `$${num.toExponential(2)}`
    }
    return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`
  }

  // Format percentage
  const formatPercentage = (num: number) => {
    return `${num > 0 ? "+" : ""}${num.toFixed(2)}%`
  }

  // Handle snipe button click
  const handleSnipe = async () => {
    setIsSnipeLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "Snipe Successful",
        description: `Successfully sniped ${token?.symbol} token.`,
      })
    } catch (error) {
      toast({
        title: "Snipe Failed",
        description: "Failed to snipe token. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSnipeLoading(false)
    }
  }

  // Handle bump button click
  const handleBump = async () => {
    setIsBumpLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "Bump Successful",
        description: `Successfully bumped ${token?.symbol} token.`,
      })
    } catch (error) {
      toast({
        title: "Bump Failed",
        description: "Failed to bump token. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsBumpLoading(false)
    }
  }

  // Handle boost button click
  const handleBoost = async () => {
    setIsBoostLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "Boost Successful",
        description: `Successfully boosted ${token?.symbol} token.`,
      })
    } catch (error) {
      toast({
        title: "Boost Failed",
        description: "Failed to boost token. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsBoostLoading(false)
    }
  }

  // Refresh trades
  const refreshTrades = () => {
    generateMockTrades()
    toast({
      title: "Trades Refreshed",
      description: "Trade list has been refreshed.",
    })
  }

  return (
    <>
      <Header2
        title={token ? `${token.name} (${token.symbol})` : "Token Details"}
        subtitle={token ? `${formatAddress(token.address)}` : "Loading token information..."}
      />

      <div className="bg-[#1e2133] flex flex-1 flex-col md:flex-row overflow-hidden h-[calc(100vh-3rem)]">
        {/* Left Column - Token Card and Trades */}
        <div className="w-full md:w-1/4 h-full overflow-auto p-4">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-64 bg-gray-800 rounded-lg mb-4 w-[220px]"></div>
              <div className="h-96 bg-gray-800 rounded-lg"></div>
            </div>
          ) : token ? (
            <>
              {/* Token Card - Smaller size */}
              <Card className="bg-[#191929] border-gray-800 shadow-md mb-4 w-[220px]">
                <div className="p-4">
                  {/* Token Image */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-amber-900/20 flex items-center justify-center mx-auto mb-3">
                    {token.image ? (
                      <img
                        src={token.image || "/placeholder.svg"}
                        alt={token.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-amber-500">{token.symbol.substring(0, 2)}</span>
                    )}
                  </div>

                  {/* Token Info */}
                  <div className="text-center mb-3">
                    <h2 className="text-lg font-bold text-white">{token.name}</h2>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="text-gray-400">{token.symbol}</span>
                      <Badge variant="outline" className="bg-amber-900/20 text-amber-400 border-amber-800">
                        {token.platform}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <div className="text-lg font-bold text-white">{formatCurrency(token.price)}</div>
                      <div
                        className={`flex items-center justify-center ${
                          token.priceChange24h >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {token.priceChange24h >= 0 ? (
                          <ArrowUp className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowDown className="w-3 h-3 mr-1" />
                        )}
                        {formatPercentage(token.priceChange24h)}
                      </div>
                    </div>
                  </div>

                  {/* Token Address */}
                  <div className="bg-gray-800/50 p-2 rounded-md text-center mb-3">
                    <div className="text-gray-400 text-xs mb-1">Address</div>
                    <div className="text-amber-400 text-sm font-mono">{formatAddress(token.address)}</div>
                  </div>

                  {/* Token Stats - Compact */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-800/50 p-2 rounded-lg">
                      <div className="text-gray-400 text-xs">Market Cap</div>
                      <div className="text-white text-sm">{formatCurrency(token.marketCap)}</div>
                    </div>
                    <div className="bg-gray-800/50 p-2 rounded-lg">
                      <div className="text-gray-400 text-xs">24h Volume</div>
                      <div className="text-white text-sm">{formatCurrency(token.volume24h)}</div>
                    </div>
                    <div className="bg-gray-800/50 p-2 rounded-lg">
                      <div className="text-gray-400 text-xs">Holders</div>
                      <div className="text-white text-sm">{formatNumber(token.holders)}</div>
                    </div>
                    <div className="bg-gray-800/50 p-2 rounded-lg">
                      <div className="text-gray-400 text-xs">Liquidity</div>
                      <div className="text-white text-sm">{formatCurrency(token.liquidity)}</div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center gap-3 mt-3">
                    {token.website && (
                      <a
                        href={token.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:text-amber-300 text-sm"
                      >
                        Website
                      </a>
                    )}
                    {token.twitter && (
                      <a
                        href={token.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:text-amber-300 text-sm"
                      >
                        Twitter
                      </a>
                    )}
                    {token.telegram && (
                      <a
                        href={token.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:text-amber-300 text-sm"
                      >
                        Telegram
                      </a>
                    )}
                  </div>
                </div>
              </Card>

              {/* Trades List */}
              <Card className="bg-[#191929] border-gray-800 shadow-md">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Live Trades</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={refreshTrades}
                      className="h-8 text-amber-400 hover:text-amber-300"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-gray-800/50 mb-4">
                      <TabsTrigger
                        value="trades"
                        className="data-[state=active]:bg-amber-900/30 data-[state=active]:text-amber-400"
                      >
                        All Trades
                      </TabsTrigger>
                      <TabsTrigger
                        value="buys"
                        className="data-[state=active]:bg-amber-900/30 data-[state=active]:text-amber-400"
                      >
                        Buys
                      </TabsTrigger>
                      <TabsTrigger
                        value="sells"
                        className="data-[state=active]:bg-amber-900/30 data-[state=active]:text-amber-400"
                      >
                        Sells
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="trades" className="m-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-gray-400 text-xs border-b border-gray-800">
                              <th className="pb-2 font-medium">Type</th>
                              <th className="pb-2 font-medium">Amount</th>
                              <th className="pb-2 font-medium">Price</th>
                              <th className="pb-2 font-medium">Value</th>
                              <th className="pb-2 font-medium">Wallet</th>
                              <th className="pb-2 font-medium">Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {trades.map((trade) => (
                              <tr key={trade.id} className="border-b border-gray-800/50 hover:bg-gray-800/20">
                                <td className={`py-3 ${trade.type === "buy" ? "text-green-500" : "text-red-500"}`}>
                                  {trade.type === "buy" ? "Buy" : "Sell"}
                                </td>
                                <td className="py-3 text-white">
                                  {formatNumber(trade.amount)} {token.symbol}
                                </td>
                                <td className="py-3 text-white">{formatCurrency(trade.price)}</td>
                                <td className="py-3 text-white">{formatCurrency(trade.value)}</td>
                                <td className="py-3 text-gray-400">
                                  <a
                                    href={`https://solscan.io/account/${trade.wallet}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-amber-400"
                                  >
                                    {formatAddress(trade.wallet)}
                                  </a>
                                </td>
                                <td className="py-3 text-gray-400">
                                  <div className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {trade.timestamp.toLocaleTimeString()}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>

                    <TabsContent value="buys" className="m-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-gray-400 text-xs border-b border-gray-800">
                              <th className="pb-2 font-medium">Type</th>
                              <th className="pb-2 font-medium">Amount</th>
                              <th className="pb-2 font-medium">Price</th>
                              <th className="pb-2 font-medium">Value</th>
                              <th className="pb-2 font-medium">Wallet</th>
                              <th className="pb-2 font-medium">Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {trades
                              .filter((trade) => trade.type === "buy")
                              .map((trade) => (
                                <tr key={trade.id} className="border-b border-gray-800/50 hover:bg-gray-800/20">
                                  <td className="py-3 text-green-500">Buy</td>
                                  <td className="py-3 text-white">
                                    {formatNumber(trade.amount)} {token.symbol}
                                  </td>
                                  <td className="py-3 text-white">{formatCurrency(trade.price)}</td>
                                  <td className="py-3 text-white">{formatCurrency(trade.value)}</td>
                                  <td className="py-3 text-gray-400">
                                    <a
                                      href={`https://solscan.io/account/${trade.wallet}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="hover:text-amber-400"
                                    >
                                      {formatAddress(trade.wallet)}
                                    </a>
                                  </td>
                                  <td className="py-3 text-gray-400">
                                    <div className="flex items-center">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {trade.timestamp.toLocaleTimeString()}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>

                    <TabsContent value="sells" className="m-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-gray-400 text-xs border-b border-gray-800">
                              <th className="pb-2 font-medium">Type</th>
                              <th className="pb-2 font-medium">Amount</th>
                              <th className="pb-2 font-medium">Price</th>
                              <th className="pb-2 font-medium">Value</th>
                              <th className="pb-2 font-medium">Wallet</th>
                              <th className="pb-2 font-medium">Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {trades
                              .filter((trade) => trade.type === "sell")
                              .map((trade) => (
                                <tr key={trade.id} className="border-b border-gray-800/50 hover:bg-gray-800/20">
                                  <td className="py-3 text-red-500">Sell</td>
                                  <td className="py-3 text-white">
                                    {formatNumber(trade.amount)} {token.symbol}
                                  </td>
                                  <td className="py-3 text-white">{formatCurrency(trade.price)}</td>
                                  <td className="py-3 text-white">{formatCurrency(trade.value)}</td>
                                  <td className="py-3 text-gray-400">
                                    <a
                                      href={`https://solscan.io/account/${trade.wallet}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="hover:text-amber-400"
                                    >
                                      {formatAddress(trade.wallet)}
                                    </a>
                                  </td>
                                  <td className="py-3 text-gray-400">
                                    <div className="flex items-center">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {trade.timestamp.toLocaleTimeString()}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </Card>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-xl font-medium text-white mb-2">Token Not Found</h3>
                <p className="text-gray-400">The requested token could not be found.</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Action Bar and Content */}
        <div className="w-full md:w-2/3 h-full overflow-auto bg-[#191929] border-l border-gray-800">
          {/* Action Bar */}
          <div className="bg-[#1a1b25] border-b border-gray-800 p-3 flex items-center justify-between">
            <div className="flex items-center">
              <h3 className="text-lg font-medium text-white mr-4">Token Actions</h3>
              <div className="flex space-x-2">
                <Button
                  className="bg-amber-600 hover:bg-amber-700 text-white h-10"
                  onClick={handleSnipe}
                  disabled={isSnipeLoading || !token}
                >
                  {isSnipeLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Target className="w-4 h-4 mr-2" />
                  )}
                  Snipe
                </Button>

                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white h-10"
                  onClick={handleBump}
                  disabled={isBumpLoading || !token}
                >
                  {isBumpLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <TrendingUp className="w-4 h-4 mr-2" />
                  )}
                  Bump
                </Button>

                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white h-10"
                  onClick={handleBoost}
                  disabled={isBoostLoading || !token}
                >
                  {isBoostLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Rocket className="w-4 h-4 mr-2" />
                  )}
                  Boost
                </Button>
              </div>
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshTrades}
                className="h-9 text-amber-400 hover:text-amber-300 border-gray-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4">
            
            
          </div>
        </div>
      </div>
    </>
  )
}
