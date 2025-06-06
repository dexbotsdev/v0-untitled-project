"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { PnlCard } from "@/components/tokens/pnl-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletTable } from "@/components/tokens/wallet-table"
import { Play, Square, Percent } from "lucide-react"
import { ActivityLogs } from "@/components/tokens/activity-logs"
import { BundleWizardDialog } from "@/components/tokens/bundle-wizard-dialog"
import { SellTokensDialog } from "@/components/tokens/sell-tokens-dialog"
import { useBundlerSDK, useWalletBalances, useTokenPrice } from "@/hooks/use-bundler-sdk"
import { bundlerSDK, type BundleConfig } from "@/lib/bundler-sdk"
import { addGlobalLog } from "@/hooks/use-activity-logs" // Declare the variable here

interface Task {
  id: string
  title: string
  type: "meta" | "bundle" | "volume" | "trade"
  isRunning?: boolean
  logs?: Array<{ timestamp: string; message: string }>
  completed?: boolean
}

interface TokenData {
  name: string
  symbol: string
  description: string
  twitter: string
  telegram: string
  discord: string
  website: string
  image: any
  bundleMode: string
  address: string
  devAddress?: string
  marketCap?: number
  priceChange?: number
  launchedDate?: string
  lastUpdated?: string
  isPumpSwapMigrated: boolean
  usdMarketCap?: number
  price?: string
}

// Update the PumpFunTokenData interface to include pump_swap_pool
interface PumpFunTokenData {
  name: string
  symbol: string
  mint: string // This is the token address
  description: string
  image_uri: string
  twitter: string | null
  telegram: string | null
  website: string | null
  created_timestamp: number
  market_cap: number
  total_supply: number
  virtual_sol_reserves: number
  virtual_token_reserves: number
  real_sol_reserves: number
  real_token_reserves: number
  last_trade_timestamp: number
  usd_market_cap: number
  pump_swap_pool: string | null // Add this field
}

// Interface for DexScreener API response
interface DexScreenerData {
  schemaVersion: string
  pairs: Array<{
    chainId: string
    dexId: string
    url: string
    pairAddress: string
    baseToken: {
      address: string
      name: string
      symbol: string
    }
    quoteToken: {
      symbol: string
    }
    priceNative: string
    priceUsd: string
    txns: {
      h24: {
        buys: number
        sells: number
      }
      h6: {
        buys: number
        sells: number
      }
      h1: {
        buys: number
        sells: number
      }
      m5: {
        buys: number
        sells: number
      }
    }
    volume: {
      h24: number
      h6: number
      h1: number
      m5: number
    }
    priceChange: {
      h24: number
      h6: number
      h1: number
      m5: number
    }
    liquidity: {
      usd: number
    }
    fdv: number
    pairCreatedAt: number
  }>
}

interface TokenManagementWidgetProps {
  isVolumeBoost?: boolean
  selectedToken?: any
}

interface Wallet {
  id: number
  address: string
  solBalance: number
  tokenBalance: number
  tradeAmount?: number
}

export function TokenManagementWidget({ isVolumeBoost = false, selectedToken }: TokenManagementWidgetProps) {
  // Use SDK hooks
  const {
    createBundle,
    launchBundle,
    getBundleForToken,
    startVolumeBoost,
    stopVolumeBoost,
    sellTokens,
    isConnected,
    bundles,
    tokens,
  } = useBundlerSDK()

  // Token-specific hooks
  const tokenPrice = useTokenPrice(selectedToken?.address || "")
  const walletBalances = useWalletBalances(selectedToken?.address)

  // Store token data
  const [tokenData, setTokenData] = useState<TokenData | null>(null)
  const [isLoadingTokenData, setIsLoadingTokenData] = useState(false)

  // Track active tabs
  const [activeTabs, setActiveTabs] = useState<string[]>([])
  const [selectedTab, setSelectedTab] = useState<string>("")
  const [tabRunningState, setTabRunningState] = useState<Record<string, boolean>>({})
  const [tabWallets, setTabWallets] = useState<Record<string, Wallet[]>>({})
  const [tabCounters, setTabCounters] = useState<Record<string, number>>({
    volume: 0,
    trade: 0,
  })

  // Bundle and task state
  const [currentBundle, setCurrentBundle] = useState<BundleConfig | null>(null)
  const [isMetaCompleted, setIsMetaCompleted] = useState(false)
  const [isAnyTaskRunning, setIsAnyTaskRunning] = useState(false)

  // Dialog states
  const [isBundleWizardOpen, setIsBundleWizardOpen] = useState(false)
  const [selectedWallets, setSelectedWallets] = useState<Record<string, number[]>>({})
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false)
  const [currentSellTabId, setCurrentSellTabId] = useState<string>("")

  // Bundle modes for tabs
  const [tabBundleModes, setTabBundleModes] = useState<
    Record<string, { mode: string; platform: string; tokenTax?: number; revokeFreeze?: boolean; revokeMint?: boolean }>
  >({})

  // Initialize token data when selectedToken changes
  useEffect(() => {
    if (selectedToken) {
      console.log("Selected token changed:", selectedToken)

      // Set initial token data
      setTokenData({
        name: selectedToken.name,
        symbol: selectedToken.symbol,
        description: selectedToken.description || "",
        twitter: selectedToken.twitterUrl || "",
        telegram: selectedToken.telegramUrl || "",
        discord: selectedToken.discord || "",
        website: selectedToken.websiteUrl || "",
        image: selectedToken.image,
        address: selectedToken.address || "",
        devAddress: selectedToken.devAddress || "",
        bundleMode: "",
        isPumpSwapMigrated: false,
      })

      // Check if bundle exists for this token
      if (selectedToken.address) {
        const bundle = getBundleForToken(selectedToken.address)
        setCurrentBundle(bundle)
        setIsMetaCompleted(!!bundle && bundle.status === "launched")
      }

      // Reset tabs when switching tokens
      setActiveTabs([])
      setSelectedTab("")
      setTabRunningState({})
      setTabWallets({})
      setTabCounters({ volume: 0, trade: 0 })
    }
  }, [selectedToken, getBundleForToken])

  // Update token data when price changes
  useEffect(() => {
    if (tokenPrice && tokenData) {
      setTokenData((prev) => ({
        ...prev!,
        marketCap: tokenPrice.marketCap,
        usdMarketCap: tokenPrice.marketCap,
        price: tokenPrice.price?.toString(),
        priceChange: tokenPrice.priceChange24h,
        lastUpdated: new Date().toLocaleTimeString(),
      }))
    }
  }, [tokenPrice, tokenData])

  // Update wallet balances in tabs
  useEffect(() => {
    if (walletBalances.length > 0) {
      // Group balances by tab (you might need to track which wallets belong to which tab)
      const updatedTabWallets = { ...tabWallets }

      Object.keys(updatedTabWallets).forEach((tabId) => {
        updatedTabWallets[tabId] = updatedTabWallets[tabId].map((wallet) => {
          const balance = walletBalances.find((b) => b.address === wallet.address)
          if (balance) {
            return {
              ...wallet,
              solBalance: balance.solBalance,
              tokenBalance: balance.tokenBalance,
            }
          }
          return wallet
        })
      })

      setTabWallets(updatedTabWallets)
    }
  }, [walletBalances])

  // Listen for bundle events
  useEffect(() => {
    const handleBundleLaunched = (bundle: BundleConfig) => {
      if (bundle.tokenAddress === selectedToken?.address) {
        setCurrentBundle(bundle)
        setIsMetaCompleted(true)

        // Update token data with bundle information
        setTokenData((prev) => ({
          ...prev!,
          address: bundle.tokenAddress,
          launchedDate: new Date().toLocaleString(),
        }))

        toast({
          title: "Bundle Launched",
          description: `Bundle for ${bundle.tokenSymbol} has been launched successfully!`,
        })
      }
    }

    const handleBundleCreated = (bundle: BundleConfig) => {
      if (bundle.tokenAddress === selectedToken?.address) {
        setCurrentBundle(bundle)
      }
    }

    bundlerSDK.on("bundle:launched", handleBundleLaunched)
    bundlerSDK.on("bundle:created", handleBundleCreated)

    return () => {
      bundlerSDK.off("bundle:launched", handleBundleLaunched)
      bundlerSDK.off("bundle:created", handleBundleCreated)
    }
  }, [selectedToken?.address])

  // Helper functions
  const hasTokenAddress = () => {
    return tokenData?.address && tokenData.address.trim() !== ""
  }

  const generateRandomAddress = () => {
    return `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`
  }

  const generateMockWallets = (count: number): Wallet[] => {
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      address: generateRandomAddress(),
      solBalance: Number.parseFloat((Math.random() * 10).toFixed(3)),
      tokenBalance: Math.floor(Math.random() * 1000000),
      tradeAmount: Number.parseFloat((Math.random() * 5).toFixed(2)),
    }))
  }

  // Create tab function updated to use SDK
  const createTab = async (type: "meta" | "bundle" | "volume" | "trade") => {
    if (!tokenData) return

    console.log(`Creating ${type} tab/task...`)

    // For Bundle tab, open the bundle wizard
    if (type === "bundle") {
      const bundleExists = activeTabs.some((tab) => tab.startsWith("bundle"))
      if (bundleExists) {
        toast({
          title: "Bundle Tab Already Exists",
          description: "Only one Bundle tab can be created per token.",
          variant: "destructive",
        })
        return
      }
      handleOpenBundleWizard()
      return
    }

    // For Meta task, simulate completion and generate address
    if (type === "meta") {
      if (hasTokenAddress()) {
        toast({
          title: "Cannot Add Meta Task",
          description: "Meta tasks cannot be added to tokens that already have an address.",
          variant: "destructive",
        })
        return
      }

      // Generate address and mark as completed
      const newAddress = generateRandomAddress()
      const newDevAddress = generateRandomAddress()

      setTokenData((prev) => ({
        ...prev!,
        address: newAddress,
        devAddress: newDevAddress,
      }))

      if (selectedToken) {
        selectedToken.address = newAddress
        selectedToken.devAddress = newDevAddress
      }

      setIsMetaCompleted(true)

      toast({
        title: "Meta Task Completed",
        description: "Token address has been generated successfully.",
      })
      return
    }

    // For Volume and Trade tabs
    if (type === "volume" || type === "trade") {
      setTabCounters((prev) => ({
        ...prev,
        [type]: prev[type] + 1,
      }))
    }

    const tabId = `${type}-${Date.now().toString(36)}`
    const wallets = generateMockWallets(type === "bundle" ? 24 : 50)

    setActiveTabs((currentTabs) => [...currentTabs, tabId])
    setTabWallets((prev) => ({ ...prev, [tabId]: wallets }))
    setTabRunningState((prev) => ({ ...prev, [tabId]: false }))
    setSelectedTab(tabId)

    const typeLabels = { meta: "Metadata", bundle: "Bundle", volume: "Volume", trade: "Trade" }

    toast({
      title: "Bot Created",
      description: `${typeLabels[type]} tab has been created successfully.`,
    })
  }

  // Handle bundle wizard save with SDK integration
  const handleSaveBundleData = async (bundleData: any) => {
    if (!tokenData) return

    try {
      // Create bundle using SDK
      const bundleConfig = {
        tokenAddress: tokenData.address || generateRandomAddress(),
        tokenSymbol: tokenData.symbol,
        tokenName: tokenData.name,
        platform: bundleData.platform,
        mode: bundleData.mode,
        walletsCount: bundleData.wallets.length,
        devWalletBuyAmount: bundleData.devWalletBuyAmount || 5,
        wallets: bundleData.wallets.map((wallet: any, index: number) => ({
          id: index + 1,
          address: wallet.address,
          privateKey: `pk_${Math.random().toString(36)}`, // Mock private key
          tokenAddress: tokenData.address || generateRandomAddress(),
          tradeAmount: wallet.amount,
          solAmount: wallet.amount,
          tokenAmount: 0,
        })),
        tokenTax: bundleData.tokenTax,
        revokeFreeze: bundleData.revokeFreeze,
        revokeMint: bundleData.revokeMint,
      }

      const bundle = await createBundle(bundleConfig)

      // Create bundle tab
      const bundleTabId = `bundle-${Date.now().toString(36)}`

      setTabBundleModes((prev) => ({
        ...prev,
        [bundleTabId]: {
          mode: bundleData.mode,
          platform: bundleData.platform,
          tokenTax: bundleData.tokenTax,
          revokeFreeze: bundleData.revokeFreeze,
          revokeMint: bundleData.revokeMint,
        },
      }))

      setActiveTabs((currentTabs) => [...currentTabs, bundleTabId])

      // Convert SDK wallets to component wallets
      const walletsWithTokens = bundleData.wallets.map((wallet: any, index: number) => ({
        id: index + 1,
        address: wallet.address,
        solBalance: wallet.amount,
        tokenBalance: 0, // Will be updated after launch
        tradeAmount: wallet.amount,
      }))

      setTabWallets((prev) => ({ ...prev, [bundleTabId]: walletsWithTokens }))
      setTabRunningState((prev) => ({ ...prev, [bundleTabId]: false }))
      setSelectedTab(bundleTabId)

      // Launch the bundle automatically
      await launchBundle(bundle.id!)

      toast({
        title: "Bundle Created & Launched",
        description: `Bundle created for ${tokenData.symbol} with ${bundleData.wallets.length} wallets`,
      })
    } catch (error) {
      console.error("Failed to create bundle:", error)
      toast({
        title: "Bundle Creation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    }
  }

  // Handle starting volume boost
  const handleStartTab = async (tabId: string) => {
    const taskType = getTabType(tabId)

    setTabRunningState((prev) => ({ ...prev, [tabId]: true }))
    setIsAnyTaskRunning(true)

    if (taskType === "volume" && tokenData?.address) {
      try {
        const walletIds = tabWallets[tabId]?.map((w) => w.id) || []
        await startVolumeBoost({
          tokenAddress: tokenData.address,
          walletIds,
          volumeTarget: 10000,
          duration: 3600000, // 1 hour
          intervalMs: 5000,
        })
      } catch (error) {
        console.error("Failed to start volume boost:", error)
      }
    }

    toast({
      title: "Task Started",
      description: "The task has been started successfully.",
    })
  }

  // Handle stopping volume boost
  const handleStopTab = async (tabId: string) => {
    const taskType = getTabType(tabId)

    setTabRunningState((prev) => ({ ...prev, [tabId]: false }))

    const anyRunning = Object.entries(tabRunningState)
      .filter(([id]) => id !== tabId)
      .some(([, running]) => running)

    setIsAnyTaskRunning(anyRunning)

    if (taskType === "volume" && tokenData?.address) {
      try {
        await stopVolumeBoost(tokenData.address)
      } catch (error) {
        console.error("Failed to stop volume boost:", error)
      }
    }

    toast({
      title: "Task Stopped",
      description: "The task has been stopped successfully.",
    })
  }

  // Handle selling tokens with SDK
  const handleSellTokens = async (percentage: number) => {
    if (!currentSellTabId || !tokenData?.address) return

    const selectedWalletIds = selectedWallets[currentSellTabId] || []

    if (selectedWalletIds.length === 0) {
      toast({
        title: "No Wallets Selected",
        description: "Please select at least one wallet to sell tokens from",
        variant: "destructive",
      })
      return
    }

    try {
      await sellTokens({
        tokenAddress: tokenData.address,
        walletIds: selectedWalletIds,
        percentage,
        slippage: 5,
      })

      setIsSellDialogOpen(false)

      toast({
        title: "Tokens Sold",
        description: `Successfully sold ${percentage}% of tokens from ${selectedWalletIds.length} wallets`,
      })
    } catch (error) {
      console.error("Failed to sell tokens:", error)
      toast({
        title: "Sell Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    }
  }

  // Rest of the helper functions remain the same...
  const handleSelectWallet = (tabId: string, walletId: number, selected: boolean) => {
    setSelectedWallets((prev) => {
      const currentSelected = prev[tabId] || []
      if (selected) {
        return { ...prev, [tabId]: [...currentSelected, walletId] }
      } else {
        return { ...prev, [tabId]: currentSelected.filter((id) => id !== walletId) }
      }
    })
  }

  const handleOpenSellDialog = (tabId: string) => {
    setCurrentSellTabId(tabId)
    setIsSellDialogOpen(true)
  }

  const getTotalTokensForCurrentSellTab = () => {
    if (!currentSellTabId) return 0
    const tabWalletsData = tabWallets[currentSellTabId] || []
    const selectedWalletIds = selectedWallets[currentSellTabId] || []
    return tabWalletsData
      .filter((wallet) => selectedWalletIds.includes(wallet.id))
      .reduce((sum, wallet) => sum + wallet.tokenBalance, 0)
  }

  const handleOpenBundleWizard = () => {
    setIsBundleWizardOpen(true)
  }

  const isMetaDisabled = () => {
    return hasTokenAddress()
  }

  const isBundleDisabled = () => {
    const bundleExists = activeTabs.some((tab) => tab.startsWith("bundle"))
    if (!hasTokenAddress()) {
      return bundleExists
    }
    return bundleExists || !isMetaCompleted
  }

  const getLaunchDate = () => {
    if (currentBundle?.createdAt) {
      return new Date(currentBundle.createdAt).toLocaleString()
    }
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getTabType = (tabId: string) => {
    return tabId.split("-")[0]
  }

  const getPlatformLabel = (platformId: string) => {
    switch (platformId) {
      case "raydium-amm":
        return "Raydium AMM"
      case "raydium-cpmm":
        return "Raydium CPMM"
      case "raydium-clmm":
        return "Raydium CLMM"
      case "pump-fun":
        return "Pump.Fun"
      case "pump-swap":
        return "PumpSwap"
      case "moonshot":
        return "MoonShot"
      case "meteora-dyn":
        return "Meteora DYN"
      default:
        return platformId || "Unknown"
    }
  }

  const getBundleModeLabel = (mode: string) => {
    switch (mode) {
      case "justLaunch":
        return "Just Launch"
      case "bundleBlock0":
        return "Bundle Block 0"
      case "delayedLaunch":
        return "Delayed Launch"
      case "stagLaunch":
        return "Staggered Launch"
      default:
        return mode
    }
  }

  const getTabTitle = (tabId: string) => {
    const type = getTabType(tabId)

    if (tabId === "activity-logs") {
      return "Activity Logs"
    }

    if (type === "volume" || type === "trade") {
      const sameTypeTabs = activeTabs.filter((tab) => tab.startsWith(type))
      const index = sameTypeTabs.indexOf(tabId)
      if (index !== -1) {
        return type === "volume" ? `Volume Bot #${index + 1}` : `Trade Bot #${index + 1}`
      }
    }

    if (type === "bundle") {
      const bundleInfo = tabBundleModes[tabId]
      if (bundleInfo) {
        const platformLabel = getPlatformLabel(bundleInfo.platform)
        const modeLabel = getBundleModeLabel(bundleInfo.mode)
        return `${platformLabel} (${modeLabel})`
      }
      return "Bundler Wallets"
    }

    switch (type) {
      case "volume":
        return "Volume Bot"
      case "trade":
        return "Trade Bot"
      default:
        return "Unknown"
    }
  }

  const hasBundleCompleted = () => {
    return currentBundle?.status === "launched"
  }

  // Handle clicking the logger icon
  const handleLoggerClick = () => {
    setSelectedTab("activity-logs")
  }

  // Debug output for active tabs
  useEffect(() => {
    console.log("Active tabs updated:", activeTabs)
  }, [activeTabs])

  // Update the PnlCard props to include the pump_swap_pool information and real-time price data
  return (
    <div className="flex h-full w-full grid-cols-2">
      <div className="flex flex-col h-full w-[50%]   col-span-1">
        {tokenData && (
          <>
            {/* Header bar with action buttons - fixed at the top */}
            <div className="bg-[#191929] text-xs rounded-xl overflow-hidden shadow-sm border border-gray-800 m-2">
              <div className="flex flex-col sm:flex-row items-center justify-between bg-[#11111D] p-2 gap-2">
                <div className="flex-col">
                  <h2 className="text-sm font-medium text-[#ECF1F0]">
                    {tokenData.name} ({tokenData.symbol})
                  </h2>{" "}
                  {hasTokenAddress() && (
                    <span className="ml-2 text-xs text-amber-400">
                      Address: {tokenData.address.substring(0, 6)}...
                      {tokenData.address.substring(tokenData.address.length - 4)}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-3 text-xs border-gray-700 text-[#ECF1F0] bg-transparent hover:bg-gray-800"
                    onClick={handleOpenBundleWizard}
                    disabled={isBundleDisabled()}
                  >
                    + Bundle
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-3 text-xs border-gray-700 text-[#ECF1F0] bg-transparent hover:bg-gray-800"
                    onClick={() => createTab("volume")}
                  >
                    + Volume
                  </Button>
                </div>
              </div>
            </div>

            {/* PNL Card - fixed, not scrollable */}
            <div className="mx-2 my-2">
              <PnlCard
                isTaskRunning={isAnyTaskRunning}
                tokenSymbol={tokenData.symbol}
                tokenData={{
                  name: tokenData.name,
                  symbol: tokenData.symbol,
                  address: tokenData.address,
                  launchedDate: getLaunchDate(),
                  devAddress: tokenData.devAddress || "",
                  image: tokenData.image,
                  marketCap: tokenPrice?.marketCap || tokenData.marketCap,
                  priceChange: tokenPrice?.priceChange24h || tokenData.priceChange,
                  price: tokenPrice?.price,
                  usdMarketCap: tokenPrice?.marketCap,
                  isLoading: isLoadingTokenData,
                  isPumpSwapMigrated: false,
                  lastUpdated: tokenData.lastUpdated || new Date().toLocaleTimeString(),
                  platform:
                    selectedTab && selectedTab.startsWith("bundle")
                      ? getPlatformLabel(tabBundleModes[selectedTab]?.platform)
                      : undefined,
                }}
                hasBundleCompleted={hasBundleCompleted()}
              />
            </div>

            {/* Tabbed interface - replaces the task list */}
            <div className="rounded-lg bg-[#11111D] overflow-hidden shadow-sm border border-gray-800 m-2 flex-1 flex flex-col">
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex flex-col h-full">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between bg-[#11111D] border-b border-gray-800">
                    <TabsList className="bg-[#11111D] justify-start gap-2">
                      {activeTabs.map((tabId) => (
                        <TabsTrigger
                          key={tabId}
                          value={tabId}
                          className="text-xs mr-2 bg-amber-700/20 data-[state=active]:bg-amber-700 data-[state=active]:text-white"
                        >
                          {getTabTitle(tabId)}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>

                  {/* Content container with proper height and overflow handling */}
                  <div className="flex-1 h-[calc(100vh-350px)]">
                    {/* Other Tabs */}
                    {activeTabs.map((tabId) => (
                      <TabsContent
                        key={tabId}
                        value={tabId}
                        className="h-full data-[state=active]:block data-[state=inactive]:hidden"
                      >
                        <div className="flex items-center justify-between mb-2 bg-[#11111D] p-2 rounded-md">
                          <h3 className="text-sm font-medium text-[#ECF1F0]">
                            {getTabTitle(tabId)} - {tokenData.symbol}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className={`h-7 w-7 p-0 ${
                                tabRunningState[tabId]
                                  ? "text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                  : "text-green-400 hover:text-green-300 hover:bg-green-900/20"
                              }`}
                              onClick={() => (tabRunningState[tabId] ? handleStopTab(tabId) : handleStartTab(tabId))}
                            >
                              {tabRunningState[tabId] ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-amber-400 hover:text-amber-300 hover:bg-amber-900/20"
                              onClick={() => handleOpenSellDialog(tabId)}
                              title="Sell Tokens"
                            >
                              <Percent className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Table container with fixed height and proper overflow */}
                        <div className="h-[calc(100%-40px)]">
                          <WalletTable
                            wallets={tabWallets[tabId] || []}
                            type={getTabType(tabId)}
                            selectedWallets={selectedWallets[tabId] || []}
                            onSelectWallet={(walletId, selected) => handleSelectWallet(tabId, walletId, selected)}
                          />
                        </div>
                      </TabsContent>
                    ))}
                  </div>
                </div>
              </Tabs>
            </div>
          </>
        )}
        <SellTokensDialog
          open={isSellDialogOpen}
          onOpenChange={setIsSellDialogOpen}
          onConfirm={handleSellTokens}
          selectedWallets={selectedWallets[currentSellTabId] || []}
          totalTokens={getTotalTokensForCurrentSellTab()}
        />
        <BundleWizardDialog
          open={isBundleWizardOpen}
          onOpenChange={setIsBundleWizardOpen}
          onSave={handleSaveBundleData}
          availableWalletAccounts={[
            // Mock data, in a real app you would fetch this from your state or API
            { id: 1, name: "Main Bundler", numberOfWallets: 24, isActive: true, walletType: "bundler" },
            { id: 2, name: "Volume Boost", numberOfWallets: 12, isActive: true, walletType: "volume" },
            { id: 3, name: "Sniper Pack", numberOfWallets: 8, isActive: true, walletType: "sniper" },
          ]}
        />
      </div>
      <div className="flex flex-col h-full w-[50%] col-span-1">
        {tokenData && (
          <>
            {/* Header bar for Activity Logs */}
            <div className="bg-[#191929] text-xs rounded-xl overflow-hidden shadow-sm border border-gray-800 m-2">
              <div className="flex flex-col sm:flex-row items-center justify-between bg-[#11111D] p-2 gap-2">
                <h2 className="text-sm font-medium text-[#ECF1F0]">Activity Logs - {tokenData.symbol}</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-3 text-xs border-gray-700 text-[#ECF1F0] bg-transparent hover:bg-gray-800"
                    onClick={() => addGlobalLog("system", "system", "Refreshed activity logs")}
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            </div>

            {/* Activity Logs Container */}
            <div className="rounded-lg bg-[#11111D] overflow-hidden shadow-sm border border-gray-800 m-2 flex-1 flex flex-col">
              <div className="flex-1 h-[calc(100vh-120px)] p-2">
                <ActivityLogs tokenAddress={tokenData.address} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
