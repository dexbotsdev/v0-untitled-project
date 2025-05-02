"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { PnlCard } from "@/components/coins/pnl-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletTable } from "@/components/coins/wallet-table"
import { Play, Square, Percent, RefreshCw } from "lucide-react"
import { BundleWizardDialog } from "@/components/coins/bundle-wizard-dialog"
// Add the SellCoinsDialog import
import { SellCoinsDialog } from "@/components/coins/sell-coins-dialog"

interface Task {
  id: string
  title: string
  type: "meta" | "bundle" | "volume" | "trade"
  isRunning?: boolean
  logs?: Array<{ timestamp: string; message: string }>
  completed?: boolean
}

interface CoinData {
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
}

// Update the PumpFunCoinData interface to include pump_swap_pool
interface PumpFunCoinData {
  name: string
  symbol: string
  mint: string // This is the coin address
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

interface CoinManagementWidgetProps {
  isVolumeBoost?: boolean
  selectedCoin?: any
}

interface Wallet {
  id: number
  address: string
  solBalance: number
  tokenBalance: number
  tradeAmount?: number
}

// Interface for candlestick chart data
interface CandlestickData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export function CoinManagementWidget({ isVolumeBoost = false, selectedCoin }: CoinManagementWidgetProps) {
  // Store coin data
  const [coinData, setCoinData] = useState<CoinData | null>(null)
  const [isLoadingCoinData, setIsLoadingCoinData] = useState(false)
  const [pumpFunData, setPumpFunData] = useState<PumpFunCoinData | null>(null)

  // Store real-time price data from DexScreener
  const [dexScreenerData, setDexScreenerData] = useState<{
    price: number
    priceUsd: number
    priceChange: number
    lastUpdated: string
  } | null>(null)
  const [isDexScreenerLoading, setIsDexScreenerLoading] = useState(false)

  // Map to store tasks for each coin (by coin address)
  const [coinTasks, setCoinTasks] = useState<Record<string, Task[]>>({})

  // Current coin's tasks
  const [currentTasks, setCurrentTasks] = useState<Task[]>([])

  // Track if any task is running for the current coin
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

  // Add these state variables inside the CoinManagementWidget component
  const [selectedWallets, setSelectedWallets] = useState<Record<string, number[]>>({})
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false)
  const [currentSellTabId, setCurrentSellTabId] = useState<string>("")

  // Add state for candlestick chart data
  const [candlestickData, setCandlestickData] = useState<CandlestickData[]>([])
  const [showChart, setShowChart] = useState<boolean>(false)
  const candlestickIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Function to fetch data from DexScreener API
  const fetchDexScreenerData = async (coinAddress: string) => {
    if (!coinAddress) return

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

      const response = await fetchWithTimeout(`https://api.dexscreener.com/latest/dex/tokens/${coinAddress}`)

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
  const checkIfCoinIsLaunched = async (coinAddress: string): Promise<boolean> => {
    try {
      // Use the same DexScreener API to check if the coin has a price
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${coinAddress}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch DexScreener data: ${response.status}`)
      }

      const data: DexScreenerData = await response.json()

      // If the coin has pairs and at least one pair has a price, it's considered launched
      return (
        data.pairs &&
        data.pairs.length > 0 &&
        data.pairs.some((pair) => Number.parseFloat(pair.priceUsd) > 0 || Number.parseFloat(pair.priceNative) > 0)
      )
    } catch (error) {
      console.error("Error checking if coin is launched:", error)
      return false // Assume not launched if there's an error
    }
  }

  // Set up interval to fetch DexScreener data every 5 seconds
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    const fetchData = () => {
      if (selectedCoin?.address) {
        fetchDexScreenerData(selectedCoin.address)
      }
    }

    if (selectedCoin?.address) {
      fetchData()
      intervalId = setInterval(fetchData, 5000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [selectedCoin?.address])

  // Update the fetchPumpFunCoinData function to handle the new API response format
  // In the fetchPumpFunCoinData function, make sure to include pump_swap_pool in the returned data
  const fetchPumpFunCoinData = async (address: string) => {
    if (!address) return null

    setIsLoadingCoinData(true)
    addGlobalLog("system", "system", `Fetching coin data for ${address}...`)

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
        throw new Error(`Failed to fetch coin data: ${response.status}`)
      }

      const data = await response.json()
      addGlobalLog("system", "system", `Coin data fetched successfully`)

      // Calculate price change (placeholder - in a real app you might fetch historical data)
      // For now we'll use a random value between -10% and +10%
      const randomPriceChange = Math.random() * 20 - 10

      return {
        name: data.name || "Unknown Coin",
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
      console.error("Error fetching PumpFun coin data:", error)
      addGlobalLog(
        "system",
        "system",
        `Error fetching coin data: ${error instanceof Error ? error.message : "Unknown error"}`,
      )

      // Instead of showing an error toast, we'll generate mock data as a fallback
      const mockData = generateMockCoinData(address)
      addGlobalLog("system", "system", "Using generated mock data instead")

      return mockData
    } finally {
      setIsLoadingCoinData(false)
    }
  }

  // Add a new function to generate mock coin data when the API fails
  const generateMockCoinData = (address: string) => {
    // Generate random values for the mock data
    const marketCap = Math.floor(Math.random() * 10000000) + 1000000
    const totalSupply = Math.floor(Math.random() * 1000000000) + 10000000
    const priceChange = Math.random() * 20 - 10 // Between -10% and +10%
    const createdTimestamp = Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date in the last 30 days

    // If we have the coin data from the selected coin, use that
    const coinName = selectedCoin?.name || "Unknown Coin"
    const coinSymbol = selectedCoin?.symbol || address.substring(0, 4).toUpperCase()

    return {
      name: coinName,
      symbol: coinSymbol,
      mint: address,
      description: `${coinName} is a Solana coin.`,
      image_uri: selectedCoin?.image || null,
      twitter: selectedCoin?.twitterUrl || "",
      telegram: selectedCoin?.telegramUrl || "",
      website: selectedCoin?.websiteUrl || "",
      created_timestamp: createdTimestamp,
      market_cap: marketCap,
      total_supply: totalSupply,
      virtual_sol_reserves: marketCap * 0.01,
      virtual_token_reserves: totalSupply * 0.5,
      real_sol_reserves: marketCap * 0.005,
      real_token_reserves: totalSupply * 0.25,
      last_trade_timestamp: Date.now() - Math.floor(Math.random() * 60 * 60 * 1000), // Random time in the last hour
      usd_market_cap: marketCap * 0.8, // Slightly lower USD market cap
      creator: selectedCoin?.devAddress || generateRandomAddress(),
      pump_swap_pool: Math.random() > 0.5 ? generateRandomAddress() : null, // 50% chance of having a pump swap pool
      priceChange24h: priceChange,
    }
  }

  // Function to generate mock candlestick data
  const generateMockCandlestickData = (basePrice: number, count = 30) => {
    const data: CandlestickData[] = []
    let currentPrice = basePrice
    const now = new Date()

    for (let i = count; i > 0; i--) {
      const time = new Date(now.getTime() - i * 60000) // One minute intervals
      const volatility = basePrice * 0.02 // 2% volatility

      // Generate realistic price movements
      const open = currentPrice
      const change = (Math.random() - 0.5) * volatility
      const close = Math.max(0.000001, open + change)
      const high = Math.max(open, close) + Math.random() * volatility * 0.5
      const low = Math.min(open, close) - Math.random() * volatility * 0.5
      const volume = Math.floor(Math.random() * 10000) + 1000

      data.push({
        time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        open,
        high,
        low,
        close,
        volume,
      })

      currentPrice = close
    }

    return data
  }

  // Function to update candlestick data with a new candle
  const updateCandlestickData = () => {
    setCandlestickData((prevData) => {
      if (prevData.length === 0) return prevData

      const lastCandle = prevData[prevData.length - 1]
      const volatility = lastCandle.close * 0.01 // 1% volatility

      // Generate a new candle based on the last close price
      const open = lastCandle.close
      const change = (Math.random() - 0.5) * volatility
      const close = Math.max(0.000001, open + change)
      const high = Math.max(open, close) + Math.random() * volatility * 0.5
      const low = Math.min(open, close) - Math.random() * volatility * 0.5
      const volume = Math.floor(Math.random() * 10000) + 1000

      const now = new Date()
      const newCandle: CandlestickData = {
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        open,
        high,
        low,
        close,
        volume,
      }

      // Keep only the last 30 candles
      const newData = [...prevData.slice(-29), newCandle]
      return newData
    })
  }

  // Use selectedCoin if provided
  useEffect(() => {
    if (selectedCoin) {
      console.log("Selected coin changed:", selectedCoin)

      // Clear any existing DexScreener interval
      if (dexScreenerIntervalRef.current) {
        clearInterval(dexScreenerIntervalRef.current)
        dexScreenerIntervalRef.current = null
      }

      // Reset DexScreener data
      setDexScreenerData(null)

      // Set initial coin data
      setCoinData({
        name: selectedCoin.name,
        symbol: selectedCoin.symbol,
        description: selectedCoin.description || "",
        twitter: selectedCoin.twitterUrl || "",
        telegram: selectedCoin.telegramUrl || "",
        discord: selectedCoin.discord || "",
        website: selectedCoin.websiteUrl || "",
        image: selectedCoin.image,
        address: selectedCoin.address || "",
        devAddress: selectedCoin.devAddress || "",
        bundleMode: "",
        isPumpSwapMigrated: false,
      })

      // Reset tabs when switching coins
      setActiveTabs([])
      setSelectedTab("")
      setTabRunningState({})
      setTabWallets({})
      setTabCounters({ volume: 0, trade: 0 })
      setAllLogs([]) // Clear logs when switching coins
      setPumpFunData(null) // Clear previous PumpFun data

      // If coin has an address, try to fetch PumpFun data
      if (selectedCoin.address) {
        fetchPumpFunCoinData(selectedCoin.address).then((data) => {
          if (data) {
            setPumpFunData(data)

            // Update coin data with fetched information
            setCoinData((prev) => {
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
                priceChange: data.priceChange24h,
                devAddress: data.creator,
                launchedDate: new Date(data.created_timestamp).toLocaleString(),
                lastUpdated: new Date().toLocaleString(),
                isPumpSwapMigrated: data.pump_swap_pool !== null,
              }
            })
          }
        })
      }

      // Load tasks for this coin if they exist
      if (coinTasks[selectedCoin.id]) {
        setCurrentTasks(coinTasks[selectedCoin.id])

        // Check if any task is running
        const anyRunning = coinTasks[selectedCoin.id].some((task) => task.isRunning)
        setIsAnyTaskRunning(anyRunning)

        // Check if Meta task is completed
        const metaCompleted = coinTasks[selectedCoin.id].some((task) => task.type === "meta" && task.completed)
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
  }, [selectedCoin])

  // Check if a task type already exists for the current coin
  const hasTaskType = (type: string) => {
    return currentTasks.some((task) => task.type === type)
  }

  // Check if Meta task exists
  const hasMetaTask = () => {
    return hasTaskType("meta")
  }

  // Check if coin has an address
  const hasCoinAddress = () => {
    console.log("HasCoinAddress???", coinData?.address && coinData.address.trim() !== "")

    return coinData?.address && coinData.address.trim() !== ""
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
    if (taskType === "meta" && coinData) {
      console.log("Meta task completed, updating coin address...")

      // Generate a random address for the coin when Meta task completes
      const newAddress = generateRandomAddress()
      const newDevAddress = generateRandomAddress()

      // Update coin data with the new address
      setCoinData((prev) => {
        if (!prev) return null
        return {
          ...prev,
          address: newAddress,
          devAddress: newDevAddress,
        }
      })

      // Update the selected coin in the parent component if needed
      if (selectedCoin) {
        selectedCoin.address = newAddress
        selectedCoin.devAddress = newDevAddress
      }

      // Mark Meta as completed
      setIsMetaCompleted(true)
      console.log("Meta completed state set to true")

      // Add a global log for meta completion
      addGlobalLog("meta", "meta", "Coin address has been generated successfully.")

      toast({
        title: "Metadata Task Completed",
        description: "Coin address has been generated successfully.",
      })
    }
  }

  // Determine if Volume button should be disabled
  const isVolumeDisabled = () => {
    return !hasCoinAddress() // Volume is disabled if coin doesn't have an address
  }

  // Determine if Trade button should be disabled
  const isTradeDisabled = () => {
    return !hasCoinAddress() // Trade is disabled if coin doesn't have an address
  }

  // Update the createTab function to handle creating the first tab
  const createTab = async (type: "meta" | "bundle" | "volume" | "trade") => {
    if (!coinData) return

    console.log(`Creating ${type} tab/task...`)
    console.log("Current state - Meta completed:", isMetaCompleted)
    console.log("Current state - Has address:", hasCoinAddress())
    console.log("Current state - Active tabs:", activeTabs)

    // For Bundle tab, add validation
    if (type === "bundle") {
      // Check if Bundle tab already exists (only one Bundle tab allowed)
      const bundleExists = activeTabs.some((tab) => tab.startsWith("bundle"))
      if (bundleExists) {
        toast({
          title: "Bundle Tab Already Exists",
          description: "Only one Bundle tab can be created per coin.",
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
      if (hasCoinAddress()) {
        toast({
          title: "Cannot Add Meta Task",
          description: "Meta tasks cannot be added to coins that already have an address.",
          variant: "destructive",
        })
        return
      }

      if (hasMetaTask()) {
        toast({
          title: "Task Already Exists",
          description: "A Metadata task already exists for this coin.",
          variant: "destructive",
        })
        return
      }

      // Create a Meta task
      const taskId = `meta-${Date.now().toString(36)}`
      const newTask: Task = {
        id: taskId,
        title: `Metadata Task for ${coinData.symbol}`,
        type: "meta",
        isRunning: true, // Auto-start the Meta task
        logs: [
          {
            timestamp: new Date().toLocaleTimeString(),
            message: `Starting Metadata task for ${coinData.symbol}...`,
          },
          {
            timestamp: new Date().toLocaleTimeString(),
            message: "Fetching coin metadata...",
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

      // Update the coin tasks map
      setCoinTasks((prev) => ({
        ...prev,
        [selectedCoin.id]: updatedTasks,
      }))

      // Set any task running to true
      setIsAnyTaskRunning(true)

      // Simulate Meta task completion after 3 seconds
      setTimeout(() => {
        console.log("Meta task completing...")

        if (!metaTaskRef.current) return

        const finalLogs = [
          ...metaTaskRef.current.logs,
          { timestamp: new Date().toLocaleTimeString(), message: "Analyzing coin properties..." },
          { timestamp: new Date().toLocaleTimeString(), message: "Coin address generated successfully." },
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

        // Update the coin tasks map
        setCoinTasks((prev) => ({
          ...prev,
          [selectedCoin.id]: completedTasks,
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
      title: `${typeLabels[type]} Task for ${coinData.symbol}`,
      type,
      isRunning: false,
      logs: [],
      completed: false,
    }

    // Add the new task to the current tasks
    const updatedTasks = [...currentTasks, newTask]
    setCurrentTasks(updatedTasks)

    // Update the coin tasks map - use coin ID as the key
    setCoinTasks((prev) => ({
      ...prev,
      [selectedCoin.id]: updatedTasks,
    }))

    // Add a log for tab creation
    addGlobalLog(tabId, type, `${typeLabels[type]} Bot created for ${coinData.symbol}`)

    toast({
      title: "Bot Created",
      description: `${typeLabels[type]} tab has been created successfully.`,
    })
  }

  // Add this function inside the CoinManagementWidget component
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

  // Add this function inside the CoinManagementWidget component
  const handleOpenSellDialog = (tabId: string) => {
    setCurrentSellTabId(tabId)
    setIsSellDialogOpen(true)
  }

  // Add this function inside the CoinManagementWidget component
  const handleSellCoins = (percentage: number) => {
    if (!currentSellTabId) return

    const tabWalletsData = tabWallets[currentSellTabId] || []
    const selectedWalletIds = selectedWallets[currentSellTabId] || []

    if (selectedWalletIds.length === 0) {
      toast({
        title: "No Wallets Selected",
        description: "Please select at least one wallet to sell coins from",
        variant: "destructive",
      })
      return
    }

    // Calculate total coins before sale for logging
    const totalCoinsBefore = tabWalletsData
      .filter((wallet) => selectedWalletIds.includes(wallet.id))
      .reduce((sum, wallet) => sum + wallet.tokenBalance, 0)

    // Update the wallet token balances
    setTabWallets((prev) => {
      const updatedWallets = [...prev[currentSellTabId]].map((wallet) => {
        if (selectedWalletIds.includes(wallet.id)) {
          const coinsToSell = Math.floor(wallet.tokenBalance * (percentage / 100))
          const solReceived = coinsToSell * 0.0000025 // Mock conversion rate

          return {
            ...wallet,
            tokenBalance: wallet.tokenBalance - coinsToSell,
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

    // Calculate coins sold for logging
    const coinsSold = Math.floor(totalCoinsBefore * (percentage / 100))

    // Add log entry
    addGlobalLog(
      currentSellTabId,
      getTabType(currentSellTabId),
      `Sold ${coinsSold.toLocaleString()} coins (${percentage}%) from ${selectedWalletIds.length} wallets`,
    )

    // Close dialog
    setIsSellDialogOpen(false)

    // Show success toast
    toast({
      title: "Coins Sold",
      description: `Successfully sold ${percentage}% of coins from ${selectedWalletIds.length} wallets`,
    })
  }

  // Calculate total coins for the current sell tab
  const getTotalCoinsForCurrentSellTab = () => {
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

  // Update the handleSaveBundleData function to store coin settings
  const handleSaveBundleData = (bundleData: any) => {
    console.log("Bundle data saved:", bundleData)
    console.log("coinData data is:", coinData)

    // Update the current coin to show it has a bundle
    if (coinData) {
      toast({
        title: "Bundle Created",
        description: `Bundle created for ${coinData.symbol} with ${bundleData.wallets.length} wallets`,
      })

      // Create a bundle tab
      const bundleTabId = `bundle-${Date.now().toString(36)}`

      // Store the bundling mode, platform and coin settings for this tab
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

      // Set the tab wallets
      setTabWallets((prev) => ({
        ...prev,
        [bundleTabId]: bundleData.wallets.map((wallet: any, index: number) => ({
          id: index + 1,
          address: wallet.address,
          solBalance: Math.random() * 5, // Mock balance
          tokenBalance: 0, // No coins yet
          tradeAmount: wallet.amount,
        })),
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
        title: `Bundle Task for ${coinData.symbol}`,
        type: "bundle",
        isRunning: false,
        logs: [],
        completed: false,
      }

      // Add the new task to the current tasks
      const updatedTasks = [...currentTasks, newTask]
      setCurrentTasks(updatedTasks)

      // Update the coin tasks map
      setCoinTasks((prev) => ({
        ...prev,
        [selectedCoin.id]: updatedTasks,
      }))

      // Add a log for tab creation with platform information and coin settings
      let logMessage = `Bundle created for ${coinData.symbol} on ${getPlatformLabel(bundleData.platform)} with mode: ${getBundleModeLabel(bundleData.mode)}`

      // Add coin settings to log if applicable
      if (bundleData.platform !== "pump-fun" && bundleData.platform !== "moonshot") {
        logMessage += `, Tax: ${bundleData.tokenTax}%`
      }

      if (bundleData.revokeFreeze || bundleData.revokeMint) {
        logMessage += `, Authorities: ${bundleData.revokeFreeze ? "Freeze " : ""}${bundleData.revokeMint ? "Mint" : ""} revoked`
      }

      addGlobalLog(bundleTabId, "bundle", logMessage)
    }
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

    // Start the chart if it's a bundle or volume task
    if (taskType === "bundle" || taskType === "volume") {
      // Initialize chart data if not already showing
      if (!showChart) {
        const basePrice = dexScreenerData?.price || 0.001
        setCandlestickData(generateMockCandlestickData(basePrice))
        setShowChart(true)

        // Set up interval to update chart data
        if (candlestickIntervalRef.current) {
          clearInterval(candlestickIntervalRef.current)
        }

        candlestickIntervalRef.current = setInterval(() => {
          updateCandlestickData()
        }, 5000) // Update every 5 seconds

        addGlobalLog(tabId, taskType, "Price chart activated")
      }
    }

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

    // Check if any bundle or volume tasks are still running
    const anyBundleOrVolumeRunning = Object.entries(tabRunningState)
      .filter(([id]) => {
        const type = getTabType(id)
        return (type === "bundle" || type === "volume") && id !== tabId
      })
      .some(([, running]) => running)

    // If no bundle or volume tasks are running, stop the chart
    if (!anyBundleOrVolumeRunning && (taskType === "bundle" || taskType === "volume")) {
      if (candlestickIntervalRef.current) {
        clearInterval(candlestickIntervalRef.current)
        candlestickIntervalRef.current = null
      }
      setShowChart(false)
      addGlobalLog(tabId, taskType, "Price chart deactivated")
    }

    // Add a log for stopping the task
    addGlobalLog(tabId, taskType, `Stopped ${getTabTitle(tabId)} task`)

    toast({
      title: "Task Stopped",
      description: "The task has been stopped successfully.",
    })
  }

  // Determine if Meta button should be disabled
  const isMetaDisabled = () => {
    return hasMetaTask() || hasCoinAddress()
  }

  // Update the isBundleDisabled function to check for Meta completion
  const isBundleDisabled = () => {
    // If a bundle tab already exists, disable the button
    const bundleExists = activeTabs.some((tab) => tab.startsWith("bundle"))

    // If the coin doesn't have an address, enable the button regardless of Meta completion
    if (!hasCoinAddress()) {
      return bundleExists
    }

    // If the coin has an address, require Meta completion
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

  // Update the getTabTitle function to include coin settings information when relevant
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

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (dexScreenerIntervalRef.current) {
        clearInterval(dexScreenerIntervalRef.current)
        dexScreenerIntervalRef.current = null
      }
      if (candlestickIntervalRef.current) {
        clearInterval(candlestickIntervalRef.current)
        candlestickIntervalRef.current = null
      }
    }
  }, [])

  // Candlestick Chart Component
  const CandlestickChart = ({ data }: { data: CandlestickData[] }) => {
    if (data.length === 0) return null

    // Calculate chart dimensions
    const chartHeight = 200
    const chartWidth = 100 // Will be set to 100% via CSS
    const candleWidth = 8
    const padding = 20

    // Calculate price range for scaling
    const prices = data.flatMap((candle) => [candle.high, candle.low])
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice

    // Scale function to convert price to y-coordinate
    const scaleY = (price: number) => {
      return chartHeight - padding - ((price - minPrice) / priceRange) * (chartHeight - padding * 2)
    }

    return (
      <div className="w-full h-[220px] bg-[#0D0D17] rounded-lg p-2 border border-gray-800 relative">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs text-gray-400">
            Price: <span className="text-amber-400">${data[data.length - 1].close.toFixed(6)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-400">
              H: <span className="text-green-400">${data[data.length - 1].high.toFixed(6)}</span>
            </div>
            <div className="text-xs text-gray-400">
              L: <span className="text-red-400">${data[data.length - 1].low.toFixed(6)}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-300"
              onClick={updateCandlestickData}
              title="Refresh Chart"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <svg width="100%" height={chartHeight} className="overflow-visible">
          {/* Price grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const price = minPrice + priceRange * ratio
            const y = scaleY(price)
            return (
              <g key={`grid-${ratio}`}>
                <line x1="0" y1={y} x2="100%" y2={y} stroke="#333" strokeWidth="1" strokeDasharray="2,2" />
                <text x="5" y={y - 5} fontSize="10" fill="#888">
                  ${price.toFixed(6)}
                </text>
              </g>
            )
          })}

          {/* Candles */}
          {data.map((candle, i) => {
            const x = (i / data.length) * 100 + "%"
            const candleX = `calc(${x} - ${candleWidth / 2}px)`
            const isUp = candle.close >= candle.open
            const color = isUp ? "#16a34a" : "#dc2626"
            const bodyTop = scaleY(Math.max(candle.open, candle.close))
            const bodyBottom = scaleY(Math.min(candle.open, candle.close))
            const bodyHeight = Math.max(1, bodyBottom - bodyTop)

            return (
              <g key={`candle-${i}`}>
                {/* Wick */}
                <line
                  x1={`calc(${x})`}
                  y1={scaleY(candle.high)}
                  x2={`calc(${x})`}
                  y2={scaleY(candle.low)}
                  stroke={color}
                  strokeWidth="1"
                />

                {/* Body */}
                <rect x={candleX} y={bodyTop} width={candleWidth} height={bodyHeight} fill={color} />

                {/* Time labels (show every 5th candle) */}
                {i % 5 === 0 && (
                  <text x={`calc(${x})`} y={chartHeight - 5} fontSize="8" fill="#888" textAnchor="middle">
                    {candle.time}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>
    )
  }

  // Update the PnlCard props to include the pump_swap_pool information and real-time price data
  return (
    <div className="flex h-full w-full grid-cols-2">
      <div className="flex flex-col h-full w-[50%] col-span-1">
        {coinData && (
          <>
            {/* Header bar with action buttons - fixed at the top */}
            <div className="bg-[#191929] text-xs rounded-xl overflow-hidden shadow-sm border border-gray-800 m-2">
              <div className="flex flex-col sm:flex-row items-center justify-between bg-[#11111D] p-2 gap-2">
                <div className="flex-col">
                  <h2 className="text-sm font-medium text-[#ECF1F0]">
                    {coinData.name} ({coinData.symbol})
                  </h2>{" "}
                  {hasCoinAddress() && (
                    <span className="ml-2 text-xs text-amber-400">
                      Address: {coinData.address.substring(0, 6)}...
                      {coinData.address.substring(coinData.address.length - 4)}
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
                coinSymbol={coinData.symbol}
                coinData={{
                  name: coinData.name,
                  symbol: coinData.symbol,
                  address: coinData.address,
                  launchedDate: getLaunchDate(),
                  devAddress: coinData.devAddress || "",
                  image: coinData.image,
                  marketCap: pumpFunData?.market_cap || coinData.marketCap,
                  priceChange: dexScreenerData?.priceChange || pumpFunData?.priceChange24h || coinData.priceChange,
                  price: dexScreenerData?.priceUsd,
                  usdMarketCap: pumpFunData?.usd_market_cap,
                  isLoading: isLoadingCoinData || isDexScreenerLoading,
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
                            {getTabTitle(tabId)} - {coinData.symbol}
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
                              title="Sell Coins"
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
        <SellCoinsDialog
          open={isSellDialogOpen}
          onOpenChange={setIsSellDialogOpen}
          onConfirm={handleSellCoins}
          selectedWallets={selectedWallets[currentSellTabId] || []}
          totalCoins={getTotalCoinsForCurrentSellTab()}
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
        {coinData && (
          <>
            {/* Header bar for Activity Logs */}
            <div className="bg-[#191929] text-xs rounded-xl overflow-hidden shadow-sm border border-gray-800 m-2">
              <div className="flex flex-col sm:flex-row items-center justify-between bg-[#11111D] p-2 gap-2">
                <div className="flex-col">
                  <h2 className="text-sm font-medium text-[#ECF1F0]">Activity Logs</h2>
                </div>
              </div>
            </div>

            {/* Activity Logs section */}
            <div className="rounded-lg bg-[#11111D] overflow-hidden shadow-sm border border-gray-800 m-2 flex-1 flex flex-col">
              <div className="p-2 overflow-auto h-full">
                {allLogs.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400 text-sm">No activity logs yet. Start a task to see logs here.</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {allLogs.map((log, index) => (
                      <div key={index} className="text-xs border-b border-gray-800 pb-1 mb-1">
                        <span className="text-gray-400">[{log.timestamp}]</span>{" "}
                        <span className="text-amber-400">[{log.taskType}]</span> {log.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Price Chart section */}
            {showChart && (
              <div className="m-2">
                <CandlestickChart data={candlestickData} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
