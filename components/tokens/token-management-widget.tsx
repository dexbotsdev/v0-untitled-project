"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { PnlCard } from "@/components/tokens/pnl-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletTable } from "@/components/tokens/wallet-table"
import { Play, Square, Percent } from "lucide-react"
import { ActivityLogs } from "@/components/tokens/activity-logs"
import { BundleWizardDialog } from "@/components/tokens/bundle-wizard-dialog"
// Add the SellTokensDialog import
import { SellTokensDialog } from "@/components/tokens/sell-tokens-dialog"

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
  // Store token data
  const [tokenData, setTokenData] = useState<TokenData | null>(null)
  const [isLoadingTokenData, setIsLoadingTokenData] = useState(false)
  const [pumpFunData, setPumpFunData] = useState<PumpFunTokenData | null>(null)

  // Store real-time price data from DexScreener
  const [dexScreenerData, setDexScreenerData] = useState<{
    price: number
    priceUsd: number
    priceChange: number
    lastUpdated: string
  } | null>(null)
  const [isDexScreenerLoading, setIsDexScreenerLoading] = useState(false)

  // Map to store tasks for each token (by token address)
  const [tokenTasks, setTokenTasks] = useState<Record<string, Task[]>>({})

  // Current token's tasks
  const [currentTasks, setCurrentTasks] = useState<Task[]>([])

  // Track if any task is running for the current token
  const [isAnyTaskRunning, setIsAnyTaskRunning] = useState(false)

  // Track active tabs
  const [activeTabs, setActiveTabs] = useState<string[]>([])

  // Track the currently selected tab
  const [selectedTab, setSelectedTab] = useState<string>("")

  // Track running state for each tab
  const [tabRunningState, setTabRunningState] = useState<Record<string, boolean>>({})

  // Mock wallets data for each tab
  const [tabWallets, setTabWallets] = useState<Record<string, Wallet[]>>({})

  // Track tab counters for Volume and Trade
  const [tabCounters, setTabCounters] = useState<Record<string, number>>({
    volume: 0,
    trade: 0,
  })

  // Track if Meta task is completed
  const [isMetaCompleted, setIsMetaCompleted] = useState(false)

  // Reference to the current Meta task
  const metaTaskRef = useRef<Task | null>(null)

  // Reference to store the interval ID for DexScreener updates
  const dexScreenerIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // All logs from all tasks
  const [allLogs, setAllLogs] = useState<
    Array<{ timestamp: string; message: string; taskId: string; taskType: string }>
  >([])

  // Add this to the component's state
  const [isBundleWizardOpen, setIsBundleWizardOpen] = useState(false)

  // Update the tabBundleModes state to include platform information
  const [tabBundleModes, setTabBundleModes] = useState<
    Record<
      string,
      {
        mode: string
        platform: string
        tokenTax?: number
        revokeFreeze?: boolean
        revokeMint?: boolean
      }
    >
  >({})

  // Add these state variables inside the TokenManagementWidget component
  const [selectedWallets, setSelectedWallets] = useState<Record<string, number[]>>({})
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false)
  const [currentSellTabId, setCurrentSellTabId] = useState<string>("")

  // Function to fetch data from DexScreener API
  const fetchDexScreenerData = async (tokenAddress: string) => {
    if (!tokenAddress) return

    setIsDexScreenerLoading(true)

    try {
      // Set a timeout for the fetch request
      const fetchWithTimeout = async (url: string, options = {}, timeout = 5000) => {
        const controller = new AbortController()
        const { signal } = controller

        const timeoutId = setTimeout(() => controller.abort(), timeout)

        try {
          const response = await fetch(url, { ...options, signal })
          clearTimeout(timeoutId)
          return response
        } catch (error) {
          clearTimeout(timeoutId)
          throw error
        }
      }

      const response = await fetchWithTimeout(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch DexScreener data: ${response.status}`)
      }

      const data: DexScreenerData = await response.json()

      // Check if we have any pairs data
      if (data.pairs && data.pairs.length > 0) {
        // Get the first pair (usually the most relevant one)
        const pair = data.pairs[0]

        // Extract price and price change data
        const price = Number.parseFloat(pair.priceNative)
        const priceUsd = Number.parseFloat(pair.priceUsd)
        const priceChange = pair.priceChange.h24 // 24-hour price change

        // Update the state with the new data
        setDexScreenerData({
          price,
          priceUsd,
          priceChange,
          lastUpdated: new Date().toLocaleTimeString(),
        })

        // Add a log entry for the price update
        addGlobalLog(
          "system",
          "system",
          `Price updated: ${price.toFixed(8)} SOL ($${priceUsd.toFixed(6)}) | Change: ${priceChange.toFixed(2)}%`,
        )
      } else {
        console.log("No pairs found in DexScreener response")
        // Generate mock price data if no pairs found
        generateMockPriceData()
      }
    } catch (error) {
      console.error("Error fetching DexScreener data:", error)
      addGlobalLog(
        "system",
        "system",
        `Error fetching price data: ${error instanceof Error ? error.message : "Unknown error"}`,
      )

      // Generate mock price data on error
      generateMockPriceData()
    } finally {
      setIsDexScreenerLoading(false)
    }
  }

  // Add a function to generate mock price data
  const generateMockPriceData = () => {
    const price = Math.random() * 0.01 // Random price between 0 and 0.01 SOL
    const priceUsd = price * 103 // Assuming 1 SOL = $103
    const priceChange = Math.random() * 20 - 10 // Between -10% and +10%

    setDexScreenerData({
      price,
      priceUsd,
      priceChange,
      lastUpdated: new Date().toLocaleTimeString(),
    })

    addGlobalLog(
      "system",
      "system",
      `Using mock price data: ${price.toFixed(8)} SOL ($${priceUsd.toFixed(6)}) | Change: ${priceChange.toFixed(2)}%`,
    )
  }

  // Add this function after the fetchDexScreenerData function
  const checkIfTokenIsLaunched = async (tokenAddress: string): Promise<boolean> => {
    try {
      // Use the same DexScreener API to check if the token has a price
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch DexScreener data: ${response.status}`)
      }

      const data: DexScreenerData = await response.json()

      // If the token has pairs and at least one pair has a price, it's considered launched
      return (
        data.pairs &&
        data.pairs.length > 0 &&
        data.pairs.some((pair) => Number.parseFloat(pair.priceUsd) > 0 || Number.parseFloat(pair.priceNative) > 0)
      )
    } catch (error) {
      console.error("Error checking if token is launched:", error)
      return false // Assume not launched if there's an error
    }
  }

  // Set up interval to fetch DexScreener data every 5 seconds
  useEffect(() => {
    // Only set up the interval if we have a token address
    if (selectedToken?.address) {
      // Fetch immediately on mount
      fetchDexScreenerData(selectedToken.address)

      // Set up interval for subsequent fetches
      dexScreenerIntervalRef.current = setInterval(() => {
        fetchDexScreenerData(selectedToken.address)
      }, 5000) // 5 seconds interval

      // Clean up interval on unmount
      return () => {
        if (dexScreenerIntervalRef.current) {
          clearInterval(dexScreenerIntervalRef.current)
          dexScreenerIntervalRef.current = null
        }
      }
    }
  }, [selectedToken?.address])

  // Update the fetchPumpFunTokenData function to handle the new API response format
  // In the fetchPumpFunTokenData function, make sure to include pump_swap_pool in the returned data
  const fetchPumpFunTokenData = async (address: string) => {
    if (!address) return null

    setIsLoadingTokenData(true)
    addGlobalLog("system", "system", `Fetching token data for ${address}...`)

    try {
      // Set a timeout for the fetch request
      const fetchWithTimeout = async (url: string, options = {}, timeout = 5000) => {
        const controller = new AbortController()
        const { signal } = controller

        const timeoutId = setTimeout(() => controller.abort(), timeout)

        try {
          const response = await fetch(url, { ...options, signal })
          clearTimeout(timeoutId)
          return response
        } catch (error) {
          clearTimeout(timeoutId)
          throw error
        }
      }

      // Try to fetch from the API with a timeout
      const response = await fetchWithTimeout(`https://virgoserver.onrender.com/coin/${address}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch token data: ${response.status}`)
      }

      const data = await response.json()
      addGlobalLog("system", "system", `Token data fetched successfully`)

      // Calculate price change (placeholder - in a real app you might fetch historical data)
      // For now we'll use a random value between -10% and +10%
      const randomPriceChange = Math.random() * 20 - 10

      return {
        name: data.name || "Unknown Token",
        symbol: data.symbol || "???",
        mint: data.mint || address,
        description: data.description || "",
        image_uri: data.image_uri || null,
        twitter: data.twitter || "",
        telegram: data.telegram || "",
        website: data.website || "",
        created_timestamp: data.created_timestamp || Date.now(),
        market_cap: data.market_cap || 0,
        total_supply: data.total_supply || 0,
        virtual_sol_reserves: data.virtual_sol_reserves || 0,
        virtual_token_reserves: data.virtual_token_reserves || 0,
        real_sol_reserves: data.real_sol_reserves || 0,
        real_token_reserves: data.real_token_reserves || 0,
        last_trade_timestamp: data.last_trade_timestamp || 0,
        usd_market_cap: data.usd_market_cap || 0,
        creator: data.creator,
        pump_swap_pool: data.pump_swap_pool, // Include this field
        // Add calculated or placeholder fields
        priceChange24h: randomPriceChange,
      }
    } catch (error) {
      console.error("Error fetching PumpFun token data:", error)
      addGlobalLog(
        "system",
        "system",
        `Error fetching token data: ${error instanceof Error ? error.message : "Unknown error"}`,
      )

      // Instead of showing an error toast, we'll generate mock data as a fallback
      const mockData = generateMockTokenData(address)
      addGlobalLog("system", "system", "Using generated mock data instead")

      return mockData
    } finally {
      setIsLoadingTokenData(false)
    }
  }

  // Add a new function to generate mock token data when the API fails
  const generateMockTokenData = (address: string) => {
    // Generate random values for the mock data
    const marketCap = Math.floor(Math.random() * 10000000) + 1000000
    const totalSupply = Math.floor(Math.random() * 1000000000) + 10000000
    const priceChange = Math.random() * 20 - 10 // Between -10% and +10%
    const createdTimestamp = Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date in the last 30 days

    // If we have the token data from the selected token, use that
    const tokenName = selectedToken?.name || "Unknown Token"
    const tokenSymbol = selectedToken?.symbol || address.substring(0, 4).toUpperCase()

    return {
      name: tokenName,
      symbol: tokenSymbol,
      mint: address,
      description: `${tokenName} is a Solana token.`,
      image_uri: selectedToken?.image || null,
      twitter: selectedToken?.twitterUrl || "",
      telegram: selectedToken?.telegramUrl || "",
      website: selectedToken?.websiteUrl || "",
      created_timestamp: createdTimestamp,
      market_cap: marketCap,
      total_supply: totalSupply,
      virtual_sol_reserves: marketCap * 0.01,
      virtual_token_reserves: totalSupply * 0.5,
      real_sol_reserves: marketCap * 0.005,
      real_token_reserves: totalSupply * 0.25,
      last_trade_timestamp: Date.now() - Math.floor(Math.random() * 60 * 60 * 1000), // Random time in the last hour
      usd_market_cap: marketCap * 0.8, // Slightly lower USD market cap
      creator: selectedToken?.devAddress || generateRandomAddress(),
      pump_swap_pool: Math.random() > 0.5 ? generateRandomAddress() : null, // 50% chance of having a pump swap pool
      priceChange24h: priceChange,
    }
  }

  // Use selectedToken if provided
  useEffect(() => {
    if (selectedToken) {
      console.log("Selected token changed:", selectedToken)

      // Clear any existing DexScreener interval
      if (dexScreenerIntervalRef.current) {
        clearInterval(dexScreenerIntervalRef.current)
        dexScreenerIntervalRef.current = null
      }

      // Reset DexScreener data
      setDexScreenerData(null)

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
      })

      // Reset tabs when switching tokens
      setActiveTabs([])
      setSelectedTab("")
      setTabRunningState({})
      setTabWallets({})
      setTabCounters({ volume: 0, trade: 0 })
      setAllLogs([]) // Clear logs when switching tokens
      setPumpFunData(null) // Clear previous PumpFun data

      // If token has an address, try to fetch PumpFun data
      if (selectedToken.address) {
        fetchPumpFunTokenData(selectedToken.address).then((data) => {
          if (data) {
            setPumpFunData(data)

            // Update token data with fetched information
            setTokenData((prev) => {
              if (!prev) return null
              return {
                ...prev,
                name: data.name || prev.name,
                symbol: data.symbol || prev.symbol,
                twitter: data.twitter || prev.twitter,
                telegram: data.telegram || prev.telegram,
                website: data.website || prev.website,
                image: data.image_uri || prev.image,
                marketCap: data.market_cap,
                usdMarketCap: data.usd_market_cap,
                priceChange: data.priceChange24h,
                price: data.price,
                devAddress: data.creator,
                launchedDate: new Date(data.created_timestamp).toLocaleString(),
                lastUpdated: new Date().toLocaleString(),
              }
            })
          }
        })
      }

      // Load tasks for this token if they exist
      if (tokenTasks[selectedToken.id]) {
        setCurrentTasks(tokenTasks[selectedToken.id])

        // Check if any task is running
        const anyRunning = tokenTasks[selectedToken.id].some((task) => task.isRunning)
        setIsAnyTaskRunning(anyRunning)

        // Check if Meta task is completed
        const metaCompleted = tokenTasks[selectedToken.id].some((task) => task.type === "meta" && task.completed)
        setIsMetaCompleted(metaCompleted)
        console.log("Meta completed state loaded:", metaCompleted)
      } else {
        setCurrentTasks([])
        setIsAnyTaskRunning(false)
        setIsMetaCompleted(false)
      }
    }

    // Clean up on unmount
    return () => {
      if (dexScreenerIntervalRef.current) {
        clearInterval(dexScreenerIntervalRef.current)
        dexScreenerIntervalRef.current = null
      }
    }
  }, [selectedToken])

  // Check if a task type already exists for the current token
  const hasTaskType = (type: string) => {
    return currentTasks.some((task) => task.type === type)
  }

  // Check if Meta task exists
  const hasMetaTask = () => {
    return hasTaskType("meta")
  }

  // Check if token has an address
  const hasTokenAddress = () => {
    console.log("HasTokenAddress???", tokenData?.address && tokenData.address.trim() !== "")

    return tokenData?.address && tokenData.address.trim() !== ""
  }

  // Generate a random address
  const generateRandomAddress = () => {
    return `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`
  }

  // Generate mock wallets
  const generateMockWallets = (count: number): Wallet[] => {
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      address: generateRandomAddress(),
      solBalance: Number.parseFloat((Math.random() * 10).toFixed(3)),
      tokenBalance: Math.floor(Math.random() * 1000000),
      tradeAmount: Number.parseFloat((Math.random() * 5).toFixed(2)),
    }))
  }

  // Add a log to the global logs array
  const addGlobalLog = (taskId: string, taskType: string, message: string) => {
    const now = new Date()
    const timestamp = now.toLocaleTimeString()

    setAllLogs((prev) => [
      ...prev,
      {
        timestamp,
        message,
        taskId,
        taskType,
      },
    ])
  }

  // Update the handleTaskComplete function to enable Bundle button when Meta completes
  const handleTaskComplete = (taskType: string) => {
    if (taskType === "meta" && tokenData) {
      console.log("Meta task completed, updating token address...")

      // Generate a random address for the token when Meta task completes
      const newAddress = generateRandomAddress()
      const newDevAddress = generateRandomAddress()

      // Update token data with the new address
      setTokenData((prev) => {
        if (!prev) return null
        return {
          ...prev,
          address: newAddress,
          devAddress: newDevAddress,
        }
      })

      // Update the selected token in the parent component if needed
      if (selectedToken) {
        selectedToken.address = newAddress
        selectedToken.devAddress = newDevAddress
      }

      // Mark Meta as completed
      setIsMetaCompleted(true)
      console.log("Meta completed state set to true")

      // Add a global log for meta completion
      addGlobalLog("meta", "meta", "Token address has been generated successfully.")

      toast({
        title: "Metadata Task Completed",
        description: "Token address has been generated successfully.",
      })
    }
  }

  // Determine if Volume button should be disabled
  const isVolumeDisabled = () => {
    return !hasTokenAddress() // Volume is disabled if token doesn't have an address
  }

  // Determine if Trade button should be disabled
  const isTradeDisabled = () => {
    return !hasTokenAddress() // Trade is disabled if token doesn't have an address
  }

  // Update the createTab function to handle creating the first tab
  const createTab = async (type: "meta" | "bundle" | "volume" | "trade") => {
    if (!tokenData) return

    console.log(`Creating ${type} tab/task...`)
    console.log("Current state - Meta completed:", isMetaCompleted)
    console.log("Current state - Has address:", hasTokenAddress())
    console.log("Current state - Active tabs:", activeTabs)

    // For Bundle tab, add validation
    if (type === "bundle") {
      // Check if Bundle tab already exists (only one Bundle tab allowed)
      const bundleExists = activeTabs.some((tab) => tab.startsWith("bundle"))
      if (bundleExists) {
        toast({
          title: "Bundle Tab Already Exists",
          description: "Only one Bundle tab can be created per token.",
          variant: "destructive",
        })
        return
      }

      // Open the bundle wizard instead of directly creating a tab
      handleOpenBundleWizard()
      return
    }

    // For Meta task, we don't create a tab but a task
    if (type === "meta") {
      if (hasTokenAddress()) {
        toast({
          title: "Cannot Add Meta Task",
          description: "Meta tasks cannot be added to tokens that already have an address.",
          variant: "destructive",
        })
        return
      }

      if (hasMetaTask()) {
        toast({
          title: "Task Already Exists",
          description: "A Metadata task already exists for this token.",
          variant: "destructive",
        })
        return
      }

      // Create a Meta task
      const taskId = `meta-${Date.now().toString(36)}`
      const newTask: Task = {
        id: taskId,
        title: `Metadata Task for ${tokenData.symbol}`,
        type: "meta",
        isRunning: true, // Auto-start the Meta task
        logs: [
          {
            timestamp: new Date().toLocaleTimeString(),
            message: `Starting Metadata task for ${tokenData.symbol}...`,
          },
          {
            timestamp: new Date().toLocaleTimeString(),
            message: "Fetching token metadata...",
          },
        ],
        completed: false,
      }

      // Add logs to global logs
      newTask.logs?.forEach((log) => {
        addGlobalLog(taskId, "meta", log.message)
      })

      // Store the Meta task in the ref for later access
      metaTaskRef.current = newTask

      // Add the new task to the current tasks
      const updatedTasks = [...currentTasks, newTask]
      setCurrentTasks(updatedTasks)

      // Update the token tasks map
      setTokenTasks((prev) => ({
        ...prev,
        [selectedToken.id]: updatedTasks,
      }))

      // Set any task running to true
      setIsAnyTaskRunning(true)

      // Simulate Meta task completion after 3 seconds
      setTimeout(() => {
        console.log("Meta task completing...")

        if (!metaTaskRef.current) return

        const finalLogs = [
          ...metaTaskRef.current.logs,
          { timestamp: new Date().toLocaleTimeString(), message: "Analyzing token properties..." },
          { timestamp: new Date().toLocaleTimeString(), message: "Token address generated successfully." },
          { timestamp: new Date().toLocaleTimeString(), message: "Developer wallet assigned." },
          { timestamp: new Date().toLocaleTimeString(), message: "Metadata task completed." },
        ]

        // Add these logs to global logs
        finalLogs.slice(metaTaskRef.current.logs.length).forEach((log) => {
          addGlobalLog(taskId, "meta", log.message)
        })

        // Create a completed version of the task
        const completedMetaTask = {
          ...metaTaskRef.current,
          isRunning: false,
          logs: finalLogs,
          completed: true,
        }

        // Update the task with completed status and logs
        const completedTasks = currentTasks.map((task) => (task.id === completedMetaTask.id ? completedMetaTask : task))

        setCurrentTasks(completedTasks)

        // Update the token tasks map
        setTokenTasks((prev) => ({
          ...prev,
          [selectedToken.id]: completedTasks,
        }))

        // Set any task running to false
        setIsAnyTaskRunning(false)

        // Complete the Meta task
        handleTaskComplete("meta")

        console.log("Meta task completed, Bundle should be enabled now")
      }, 3000)

      toast({
        title: "Meta Task Created",
        description: "Metadata task has been created and started automatically.",
      })

      return
    }

    // Apply conditional rules for tab creation
    if (type === "volume" || type === "trade") {
      setTabCounters((prev) => ({
        ...prev,
        [type]: prev[type] + 1,
      }))
    }

    // For Volume and Trade, increment the counter
    if (type === "volume" || type === "trade") {
      setTabCounters((prev) => ({
        ...prev,
        [type]: prev[type] + 1,
      }))
    }

    // Create a unique tab ID
    const tabId = `${type}-${Date.now().toString(36)}`

    // Generate mock wallets for this tab
    const wallets = generateMockWallets(type === "bundle" ? 24 : 50)

    console.log("Creating new tab:", tabId)

    // Add the tab - using a callback to ensure we have the latest state
    setActiveTabs((currentTabs) => {
      const newTabs = [...currentTabs, tabId]
      console.log("Updated active tabs:", newTabs)
      return newTabs
    })

    // Set the tab wallets
    setTabWallets((prev) => {
      const newWallets = {
        ...prev,
        [tabId]: wallets,
      }
      return newWallets
    })

    // Set the tab running state
    setTabRunningState((prev) => {
      const newRunningState = {
        ...prev,
        [tabId]: false,
      }
      return newRunningState
    })

    // Select the new tab
    setSelectedTab(tabId)

    // Create a task for this tab (for compatibility with existing code)
    const typeLabels = {
      meta: "Metadata",
      bundle: "Bundle",
      volume: "Volume",
      trade: "Trade",
    }

    const newTask: Task = {
      id: tabId,
      title: `${typeLabels[type]} Task for ${tokenData.symbol}`,
      type,
      isRunning: false,
      logs: [],
      completed: false,
    }

    // Add the new task to the current tasks
    const updatedTasks = [...currentTasks, newTask]
    setCurrentTasks(updatedTasks)

    // Update the token tasks map - use token ID as the key
    setTokenTasks((prev) => ({
      ...prev,
      [selectedToken.id]: updatedTasks,
    }))

    // Add a log for tab creation
    addGlobalLog(tabId, type, `${typeLabels[type]} Bot created for ${tokenData.symbol}`)

    toast({
      title: "Bot Created",
      description: `${typeLabels[type]} tab has been created successfully.`,
    })
  }

  // Add this function inside the TokenManagementWidget component
  const handleSelectWallet = (tabId: string, walletId: number, selected: boolean) => {
    setSelectedWallets((prev) => {
      const currentSelected = prev[tabId] || []

      if (selected) {
        return {
          ...prev,
          [tabId]: [...currentSelected, walletId],
        }
      } else {
        return {
          ...prev,
          [tabId]: currentSelected.filter((id) => id !== walletId),
        }
      }
    })
  }

  // Add this function inside the TokenManagementWidget component
  const handleOpenSellDialog = (tabId: string) => {
    setCurrentSellTabId(tabId)
    setIsSellDialogOpen(true)
  }

  // Add this function inside the TokenManagementWidget component
  const handleSellTokens = (percentage: number) => {
    if (!currentSellTabId) return

    const tabWalletsData = tabWallets[currentSellTabId] || []
    const selectedWalletIds = selectedWallets[currentSellTabId] || []

    if (selectedWalletIds.length === 0) {
      toast({
        title: "No Wallets Selected",
        description: "Please select at least one wallet to sell tokens from",
        variant: "destructive",
      })
      return
    }

    // Calculate total tokens before sale for logging
    const totalTokensBefore = tabWalletsData
      .filter((wallet) => selectedWalletIds.includes(wallet.id))
      .reduce((sum, wallet) => sum + wallet.tokenBalance, 0)

    // Update the wallet token balances
    setTabWallets((prev) => {
      const updatedWallets = [...prev[currentSellTabId]].map((wallet) => {
        if (selectedWalletIds.includes(wallet.id)) {
          const tokensToSell = Math.floor(wallet.tokenBalance * (percentage / 100))
          const solReceived = tokensToSell * 0.0000025 // Mock conversion rate

          return {
            ...wallet,
            tokenBalance: wallet.tokenBalance - tokensToSell,
            solBalance: wallet.solBalance + solReceived,
          }
        }
        return wallet
      })

      return {
        ...prev,
        [currentSellTabId]: updatedWallets,
      }
    })

    // Calculate tokens sold for logging
    const tokensSold = Math.floor(totalTokensBefore * (percentage / 100))

    // Add log entry
    addGlobalLog(
      currentSellTabId,
      getTabType(currentSellTabId),
      `Sold ${tokensSold.toLocaleString()} tokens (${percentage}%) from ${selectedWalletIds.length} wallets`,
    )

    // Close dialog
    setIsSellDialogOpen(false)

    // Show success toast
    toast({
      title: "Tokens Sold",
      description: `Successfully sold ${percentage}% of tokens from ${selectedWalletIds.length} wallets`,
    })
  }

  // Calculate total tokens for the current sell tab
  const getTotalTokensForCurrentSellTab = () => {
    if (!currentSellTabId) return 0

    const tabWalletsData = tabWallets[currentSellTabId] || []
    const selectedWalletIds = selectedWallets[currentSellTabId] || []

    return tabWalletsData
      .filter((wallet) => selectedWalletIds.includes(wallet.id))
      .reduce((sum, wallet) => sum + wallet.tokenBalance, 0)
  }

  // Add this after the existing createTab function
  const handleOpenBundleWizard = () => {
    setIsBundleWizardOpen(true)
  }

  // Update the handleSaveBundleData function to update token data and wallet balances

  // Find the handleSaveBundleData function and replace it with this updated version:
  const handleSaveBundleData = (bundleData: any) => {
    console.log("Bundle data saved:", bundleData)
    console.log("tokenData data is:", tokenData)

    // Update the current token to show it has a bundle
    if (tokenData) {
      toast({
        title: "Bundle Created",
        description: `Bundle created for ${tokenData.symbol} with ${bundleData.wallets.length} wallets`,
      })

      // Create a bundle tab
      const bundleTabId = `bundle-${Date.now().toString(36)}`

      // Store the bundling mode, platform and token settings for this tab
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

      // Add the tab
      setActiveTabs((currentTabs) => [...currentTabs, bundleTabId])

      // Generate mock token balances for wallets
      const walletsWithTokens = bundleData.wallets.map((wallet: any, index: number) => {
        const tokenBalance = Math.floor(Math.random() * 1000000) + 100000 // Random token balance
        return {
          id: index + 1,
          address: wallet.address,
          solBalance: Math.max(0, wallet.amount - Math.random() * 0.1), // Slightly less SOL after bundle
          tokenBalance: tokenBalance, // Add token balance
          tradeAmount: wallet.amount,
        }
      })

      // Set the tab wallets with token balances
      setTabWallets((prev) => ({
        ...prev,
        [bundleTabId]: walletsWithTokens,
      }))

      // Set the tab running state
      setTabRunningState((prev) => ({
        ...prev,
        [bundleTabId]: false,
      }))

      // Select the new tab
      setSelectedTab(bundleTabId)

      // Create a task for this tab
      const newTask: Task = {
        id: bundleTabId,
        title: `Bundle Task for ${tokenData.symbol}`,
        type: "bundle",
        isRunning: false,
        logs: [],
        completed: true, // Mark as completed immediately
      }

      // Add the new task to the current tasks
      const updatedTasks = [...currentTasks, newTask]
      setCurrentTasks(updatedTasks)

      // Update the token tasks map
      setTokenTasks((prev) => ({
        ...prev,
        [selectedToken.id]: updatedTasks,
      }))

      // Generate mock market data for the token
      const mockMarketCap = Math.floor(Math.random() * 5000000) + 1000000
      const mockUsdMarketCap = mockMarketCap * 0.8
      const mockPrice = (mockUsdMarketCap / 1000000000).toFixed(8)

      // Update token data with market information
      setTokenData((prev) => {
        if (!prev) return null
        return {
          ...prev,
          marketCap: mockMarketCap,
          usdMarketCap: mockUsdMarketCap,
          price: mockPrice,
          launchedDate: new Date().toLocaleString(),
          lastUpdated: new Date().toLocaleTimeString(),
        }
      })

      // Add a log for tab creation with platform information and token settings
      let logMessage = `Bundle created for ${tokenData.symbol} on ${getPlatformLabel(bundleData.platform)} with mode: ${getBundleModeLabel(bundleData.mode)}`

      // Add token settings to log if applicable
      if (bundleData.platform !== "pump-fun" && bundleData.platform !== "moonshot") {
        logMessage += `, Tax: ${bundleData.tokenTax}%`
      }

      if (bundleData.revokeFreeze || bundleData.revokeMint) {
        logMessage += `, Authorities: ${bundleData.revokeFreeze ? "Freeze " : ""}${bundleData.revokeMint ? "Mint" : ""} revoked`
      }

      addGlobalLog(bundleTabId, "bundle", logMessage)

      // Add logs about token creation and market data
      addGlobalLog(
        bundleTabId,
        "bundle",
        `Token ${tokenData.symbol} created successfully with initial market cap of ${(mockMarketCap / 1000000).toFixed(2)}M`,
      )
      addGlobalLog(bundleTabId, "bundle", `Initial price: ${mockPrice} USD`)

      // Start periodic market updates
      startMarketUpdates(bundleTabId)
    }
  }

  // Add this new function after handleSaveBundleData
  const startMarketUpdates = (bundleTabId: string) => {
    // Initial update
    updateMarketData()

    // Set interval for periodic updates
    const intervalId = setInterval(() => {
      if (!document.hidden) {
        // Only update when tab is visible
        updateMarketData()
        updateWalletBalances(bundleTabId)
      }
    }, 5000) // Update every 5 seconds

    // Store interval ID for cleanup
    const key = `market-updates-${bundleTabId}`

    // Clean up previous interval if it exists
    if (window[key as any]) {
      clearInterval(window[key as any])
    }

    // Store new interval ID
    window[key as any] = intervalId
  }

  // Add this new function after startMarketUpdates
  const updateMarketData = () => {
    if (!tokenData) return

    // Get current market cap
    const currentMarketCap = tokenData.marketCap || 1000000

    // Generate random change (-5% to +8%)
    const changePercent = Math.random() * 13 - 5
    const changeAmount = currentMarketCap * (changePercent / 100)

    // Calculate new market cap
    const newMarketCap = Math.max(500000, currentMarketCap + changeAmount)
    const newUsdMarketCap = newMarketCap * 0.8
    const newPrice = (newUsdMarketCap / 1000000000).toFixed(8)

    // Update token data
    setTokenData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        marketCap: newMarketCap,
        usdMarketCap: newUsdMarketCap,
        price: newPrice,
        priceChange: changePercent,
        lastUpdated: new Date().toLocaleTimeString(),
      }
    })

    // Add log if change is significant
    if (Math.abs(changePercent) > 3) {
      const direction = changePercent > 0 ? "up" : "down"
      addGlobalLog(
        "system",
        "system",
        `Market update: ${tokenData.symbol} price moved ${direction} by ${Math.abs(changePercent).toFixed(2)}% to ${newPrice} USD`,
      )
    }
  }

  // Add this new function after updateMarketData
  const updateWalletBalances = (tabId: string) => {
    if (!tabWallets[tabId]) return

    setTabWallets((prev) => {
      const wallets = [...prev[tabId]]

      // Update each wallet's token balance
      const updatedWallets = wallets.map((wallet) => {
        // Random change between -2% and +5%
        const changePercent = Math.random() * 7 - 2
        const newBalance = Math.floor(wallet.tokenBalance * (1 + changePercent / 100))

        return {
          ...wallet,
          tokenBalance: newBalance,
        }
      })

      return {
        ...prev,
        [tabId]: updatedWallets,
      }
    })
  }

  // Handle starting a tab's task
  const handleStartTab = (tabId: string) => {
    // Get the task type from the tab ID
    const taskType = getTabType(tabId)

    // Update running state
    setTabRunningState((prev) => ({
      ...prev,
      [tabId]: true,
    }))

    // Update any task running state
    setIsAnyTaskRunning(true)

    // Add a log for starting the task
    addGlobalLog(tabId, taskType, `Started ${getTabTitle(tabId)} task`)

    // Generate some mock logs for the task
    setTimeout(() => {
      if (taskType === "bundle") {
        addGlobalLog(tabId, taskType, "Initializing bundle configuration...")
        setTimeout(() => addGlobalLog(tabId, taskType, "Setting up wallet connections..."), 1000)
        setTimeout(() => addGlobalLog(tabId, taskType, "Preparing bundle parameters..."), 2000)
      } else if (taskType === "volume") {
        addGlobalLog(tabId, taskType, "Starting volume bot...")
        setTimeout(() => addGlobalLog(tabId, taskType, "Connecting to liquidity pools..."), 1000)
        setTimeout(() => addGlobalLog(tabId, taskType, "Monitoring trading volume..."), 2000)
      } else if (taskType === "trade") {
        addGlobalLog(tabId, taskType, "Initializing trading module...")
        setTimeout(() => addGlobalLog(tabId, taskType, "Analyzing market conditions..."), 1000)
        setTimeout(() => addGlobalLog(tabId, taskType, "Setting up trading parameters..."), 2000)
      }
    }, 500)

    toast({
      title: "Task Started",
      description: "The task has been started successfully.",
    })
  }

  // Handle stopping a tab's task
  const handleStopTab = (tabId: string) => {
    // Get the task type from the tab ID
    const taskType = getTabType(tabId)

    // Update running state
    setTabRunningState((prev) => ({
      ...prev,
      [tabId]: false,
    }))

    // Check if any tasks are still running
    const anyRunning = Object.entries(tabRunningState)
      .filter(([id]) => id !== tabId) // Exclude the current tab
      .some(([, running]) => running)

    setIsAnyTaskRunning(anyRunning)

    // Add a log for stopping the task
    addGlobalLog(tabId, taskType, `Stopped ${getTabTitle(tabId)} task`)

    toast({
      title: "Task Stopped",
      description: "The task has been stopped successfully.",
    })
  }

  // Determine if Meta button should be disabled
  const isMetaDisabled = () => {
    return hasMetaTask() || hasTokenAddress()
  }

  // Update the isBundleDisabled function to check for Meta completion
  const isBundleDisabled = () => {
    // If a bundle tab already exists, disable the button
    const bundleExists = activeTabs.some((tab) => tab.startsWith("bundle"))

    // If the token doesn't have an address, enable the button regardless of Meta completion
    if (!hasTokenAddress()) {
      return bundleExists
    }

    // If the token has an address, require Meta completion
    return bundleExists || !isMetaCompleted
  }

  // Generate mock launch date for demo purposes
  const getLaunchDate = () => {
    if (pumpFunData?.created_timestamp) {
      return new Date(pumpFunData.created_timestamp).toLocaleString()
    }

    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Get tab type from tab ID
  const getTabType = (tabId: string) => {
    return tabId.split("-")[0]
  }

  // Add a helper function to get a readable platform label
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

  // Add a helper function to get a readable bundle mode label
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

  // Update the getTabTitle function to include token settings information when relevant
  const getTabTitle = (tabId: string) => {
    const type = getTabType(tabId)

    if (tabId === "activity-logs") {
      return "Activity Logs"
    }

    // For Volume and Trade, add the counter number
    if (type === "volume" || type === "trade") {
      // Find the index of this tab among tabs of the same type
      const sameTypeTabs = activeTabs.filter((tab) => tab.startsWith(type))
      const index = sameTypeTabs.indexOf(tabId)

      if (index !== -1) {
        return type === "volume" ? `Volume Bot #${index + 1}` : `Trade Bot #${index + 1}`
      }
    }

    // For bundle tabs, include the mode and platform
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

  // Check if Bundle task is completed
  const hasBundleCompleted = () => {
    return currentTasks.some((task) => task.type === "bundle" && task.completed)
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
                  marketCap: pumpFunData?.market_cap || tokenData.marketCap,
                  priceChange: dexScreenerData?.priceChange || pumpFunData?.priceChange24h || tokenData.priceChange,
                  price: dexScreenerData?.priceUsd,
                  usdMarketCap: pumpFunData?.usd_market_cap,
                  isLoading: isLoadingTokenData || isDexScreenerLoading,
                  isPumpSwapMigrated: pumpFunData?.pump_swap_pool !== null,
                  lastUpdated: dexScreenerData?.lastUpdated || new Date().toLocaleTimeString(),
                  // Add platform information if available
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
                <ActivityLogs logs={allLogs} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
