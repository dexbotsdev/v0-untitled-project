import EventEmitter from "events"
import { v4 as uuidv4 } from "uuid"

// Types
export type LogType = "info" | "success" | "warning" | "error"
export type LogCategory = "bundle" | "wallet" | "token" | "volume" | "system"

export interface ActivityLog {
  id: string
  message: string
  timestamp: Date
  type: LogType
  category: LogCategory
  tokenAddress?: string
  walletAddress?: string
  details?: any
}

export interface Token {
  id?: string
  token_id?: string
  name: string
  symbol: string
  address: string
  description?: string
  twitter?: string
  telegram?: string
  discord?: string
  website?: string
  image?: string
  price?: number
  priceChangePercent?: number
  marketCap?: number
  volume?: number
  bundle_mode?: string
  walletsCount?: number
  devWalletBuyAmount?: number
  delaySeconds?: number
  minDelay?: number
  maxDelay?: number
  createdAt?: Date
  launchedAt?: Date
}

export interface Wallet {
  id: string
  address: string
  privateKey: string
  balance: number
  tokenBalances: Record<string, number>
}

export interface Bundle {
  id?: string
  tokenAddress: string
  mode: string
  walletsCount: number
  devWalletBuyAmount: number
  delaySeconds?: number
  minDelay?: number
  maxDelay?: number
  status?: "pending" | "running" | "completed" | "failed"
  progress?: number
  createdAt?: Date
  completedAt?: Date
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    totalPages: number
    totalCount: number
  }
}

// Mock data storage
const mockTokens: Token[] = []
const mockWallets: Wallet[] = []
const mockBundles: Bundle[] = []
const activityLogs: ActivityLog[] = []

// Generate some initial mock data
for (let i = 1; i <= 20; i++) {
  mockTokens.push({
    id: `token-${i}`,
    token_id: `token-${i}`,
    name: `Token ${i}`,
    symbol: `TKN${i}`,
    address: `0x${i.toString().padStart(40, "0")}`,
    description: `Description for Token ${i}`,
    twitter: `https://twitter.com/token${i}`,
    telegram: `https://t.me/token${i}`,
    discord: `https://discord.gg/token${i}`,
    website: `https://token${i}.com`,
    image: `https://picsum.photos/200/200?random=${i}`,
    price: Math.random() * 10,
    priceChangePercent: Math.random() * 20 - 10,
    marketCap: Math.random() * 1000000,
    volume: Math.random() * 100000,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
  })
}

for (let i = 1; i <= 50; i++) {
  mockWallets.push({
    id: `wallet-${i}`,
    address: `0x${i.toString().padStart(40, "0")}`,
    privateKey: `0x${Math.random().toString(16).substring(2, 42)}`,
    balance: Math.random() * 10,
    tokenBalances: {},
  })
}

export class BundlerSDK extends EventEmitter {
  private connected = true
  private priceUpdateIntervals: Record<string, NodeJS.Timeout> = {}
  private walletUpdateInterval: NodeJS.Timeout | null = null

  constructor() {
    super()
    this.setupInitialLogs()
  }

  private setupInitialLogs() {
    this.addLog("System initialized", "info", "system")
    this.addLog("Connected to network", "success", "system")
    this.addLog("Wallet provider ready", "info", "wallet")
  }

  // Connection management
  public isConnected(): boolean {
    return this.connected
  }

  public connect(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.connected = true
        this.emit("connected")
        this.addLog("Connected to bundler service", "success", "system")
        resolve(true)
      }, 500)
    })
  }

  public disconnect(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.connected = false
        this.emit("disconnected")
        this.addLog("Disconnected from bundler service", "info", "system")
        resolve(true)
      }, 500)
    })
  }

  // Token methods
  public async getTokens(
    options: { page: number; limit: number } = { page: 1, limit: 10 },
  ): Promise<PaginatedResult<Token>> {
    const { page, limit } = options
    const start = (page - 1) * limit
    const end = start + limit
    const data = mockTokens.slice(start, end)

    return {
      data,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(mockTokens.length / limit),
        totalCount: mockTokens.length,
      },
    }
  }

  public async getToken(tokenAddress: string): Promise<Token | null> {
    const token = mockTokens.find((t) => t.address === tokenAddress)
    return token || null
  }

  public async createToken(tokenData: Partial<Token>): Promise<Token> {
    const newToken: Token = {
      id: uuidv4(),
      token_id: uuidv4(),
      name: tokenData.name || "Unknown Token",
      symbol: tokenData.symbol || "UNK",
      address: tokenData.address || `0x${Math.random().toString(16).substring(2, 42)}`,
      description: tokenData.description,
      twitter: tokenData.twitter,
      telegram: tokenData.telegram,
      discord: tokenData.discord,
      website: tokenData.website,
      image: tokenData.image,
      price: 0,
      priceChangePercent: 0,
      marketCap: 0,
      volume: 0,
      createdAt: new Date(),
    }

    mockTokens.push(newToken)
    this.addLog(`Token ${newToken.symbol} created`, "success", "token", { tokenAddress: newToken.address })
    this.emit("tokenCreated", newToken)

    return newToken
  }

  // Bundle methods
  public async createBundle(bundleData: Partial<Bundle>): Promise<Bundle> {
    if (!bundleData.tokenAddress) {
      throw new Error("Token address is required")
    }

    const newBundle: Bundle = {
      id: uuidv4(),
      tokenAddress: bundleData.tokenAddress,
      mode: bundleData.mode || "standard",
      walletsCount: bundleData.walletsCount || 10,
      devWalletBuyAmount: bundleData.devWalletBuyAmount || 1,
      delaySeconds: bundleData.delaySeconds,
      minDelay: bundleData.minDelay,
      maxDelay: bundleData.maxDelay,
      status: "pending",
      progress: 0,
      createdAt: new Date(),
    }

    mockBundles.push(newBundle)
    this.addLog(`Bundle created for token ${bundleData.tokenAddress}`, "info", "bundle", {
      tokenAddress: bundleData.tokenAddress,
    })
    this.emit("bundleCreated", newBundle)

    return newBundle
  }

  public async launchBundle(bundleId: string): Promise<Bundle> {
    const bundle = mockBundles.find((b) => b.id === bundleId)
    if (!bundle) {
      throw new Error("Bundle not found")
    }

    bundle.status = "running"
    this.addLog(`Bundle ${bundleId} launching`, "info", "bundle", { tokenAddress: bundle.tokenAddress })
    this.emit("bundleLaunching", bundle)

    // Simulate progress updates
    let progress = 0
    const progressInterval = setInterval(() => {
      progress += Math.random() * 10
      if (progress >= 100) {
        progress = 100
        clearInterval(progressInterval)

        bundle.status = "completed"
        bundle.progress = 100
        bundle.completedAt = new Date()

        this.addLog(`Bundle ${bundleId} launched successfully`, "success", "bundle", {
          tokenAddress: bundle.tokenAddress,
        })
        this.emit("bundleLaunched", bundle)

        // Start price updates for this token
        this.startPriceUpdates(bundle.tokenAddress)

        // Initialize wallet balances for this token
        this.initializeWalletBalances(bundle.tokenAddress, bundle.walletsCount)
      } else {
        bundle.progress = Math.floor(progress)
        this.emit("bundleProgress", { bundleId, progress: bundle.progress })
      }
    }, 500)

    return bundle
  }

  public async getBundleForToken(tokenAddress: string): Promise<Bundle | null> {
    const bundle = mockBundles.find((b) => b.tokenAddress === tokenAddress)
    return bundle || null
  }

  // Wallet methods
  public async getWallets(
    options: { page: number; limit: number } = { page: 1, limit: 10 },
  ): Promise<PaginatedResult<Wallet>> {
    const { page, limit } = options
    const start = (page - 1) * limit
    const end = start + limit
    const data = mockWallets.slice(start, end)

    return {
      data,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(mockWallets.length / limit),
        totalCount: mockWallets.length,
      },
    }
  }

  public async getWalletsWithToken(tokenAddress: string): Promise<Wallet[]> {
    return mockWallets.filter((w) => w.tokenBalances[tokenAddress] && w.tokenBalances[tokenAddress] > 0)
  }

  // Token operations
  public async sellTokens(tokenAddress: string, walletAddresses: string[], percentage: number): Promise<boolean> {
    const token = await this.getToken(tokenAddress)
    if (!token) {
      throw new Error("Token not found")
    }

    const wallets = mockWallets.filter((w) => walletAddresses.includes(w.address))
    if (wallets.length === 0) {
      throw new Error("No valid wallets found")
    }

    // Process each wallet
    for (const wallet of wallets) {
      const tokenBalance = wallet.tokenBalances[tokenAddress] || 0
      if (tokenBalance <= 0) continue

      const amountToSell = tokenBalance * (percentage / 100)
      const solReceived = amountToSell * (token.price || 0)

      // Update balances
      wallet.tokenBalances[tokenAddress] -= amountToSell
      wallet.balance += solReceived

      this.addLog(
        `Sold ${amountToSell.toFixed(2)} ${token.symbol} for ${solReceived.toFixed(4)} SOL from wallet ${wallet.address.substring(0, 6)}...`,
        "success",
        "token",
        { tokenAddress, walletAddress: wallet.address },
      )

      this.emit("walletTokenBalanceChanged", {
        walletAddress: wallet.address,
        tokenAddress,
        previousBalance: tokenBalance,
        newBalance: wallet.tokenBalances[tokenAddress],
        change: -amountToSell,
      })

      this.emit("walletBalanceChanged", {
        walletAddress: wallet.address,
        previousBalance: wallet.balance - solReceived,
        newBalance: wallet.balance,
        change: solReceived,
      })
    }

    // Emit sell event
    this.emit("sellTokens", {
      tokenAddress,
      walletAddresses,
      percentage,
    })

    return true
  }

  public async boostVolume(tokenAddress: string, amount: number): Promise<boolean> {
    const token = await this.getToken(tokenAddress)
    if (!token) {
      throw new Error("Token not found")
    }

    // Update token volume
    token.volume = (token.volume || 0) + amount

    this.addLog(`Volume boosted for ${token.symbol} by ${amount.toFixed(2)} SOL`, "info", "volume", { tokenAddress })

    this.emit("boostVolume", {
      tokenAddress,
      amount,
      newVolume: token.volume,
    })

    return true
  }

  // Price updates
  private startPriceUpdates(tokenAddress: string): void {
    if (this.priceUpdateIntervals[tokenAddress]) {
      clearInterval(this.priceUpdateIntervals[tokenAddress])
    }

    const token = mockTokens.find((t) => t.address === tokenAddress)
    if (!token) return

    // Initialize price if not set
    if (!token.price) {
      token.price = 0.001 + Math.random() * 0.01
      token.marketCap = token.price * 1000000
      token.volume = token.price * 50000 * Math.random()
    }

    this.priceUpdateIntervals[tokenAddress] = setInterval(
      () => {
        if (!token) return

        const previousPrice = token.price || 0
        // Random price change between -5% and +8%
        const changePercent = Math.random() * 13 - 5
        const newPrice = previousPrice * (1 + changePercent / 100)

        token.price = newPrice
        token.priceChangePercent = (newPrice / previousPrice - 1) * 100
        token.marketCap = newPrice * 1000000
        token.volume = (token.volume || 0) * (1 + (Math.random() * 10 - 5) / 100)

        this.emit("tokenPriceChanged", {
          tokenAddress,
          previousPrice,
          newPrice,
          changePercent: token.priceChangePercent,
        })

        // Log significant price changes
        if (Math.abs(changePercent) > 3) {
          const direction = changePercent > 0 ? "increased" : "decreased"
          const logType: LogType = changePercent > 0 ? "success" : "warning"

          this.addLog(
            `${token.symbol} price ${direction} by ${Math.abs(changePercent).toFixed(2)}%`,
            logType,
            "token",
            { tokenAddress, previousPrice, newPrice },
          )
        }
      },
      3000 + Math.random() * 5000,
    ) // Random interval between 3-8 seconds
  }

  // Initialize wallet balances for a token
  private initializeWalletBalances(tokenAddress: string, count: number): void {
    const token = mockTokens.find((t) => t.address === tokenAddress)
    if (!token) return

    // Select random wallets
    const selectedWallets = [...mockWallets]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(count, mockWallets.length))

    // Distribute tokens
    for (const wallet of selectedWallets) {
      const tokenAmount = 1000 + Math.random() * 9000
      wallet.tokenBalances[tokenAddress] = tokenAmount

      this.addLog(
        `Wallet ${wallet.address.substring(0, 6)}... received ${tokenAmount.toFixed(2)} ${token.symbol}`,
        "info",
        "wallet",
        { walletAddress: wallet.address, tokenAddress },
      )

      this.emit("walletTokenBalanceChanged", {
        walletAddress: wallet.address,
        tokenAddress,
        previousBalance: 0,
        newBalance: tokenAmount,
        change: tokenAmount,
      })
    }

    // Start wallet balance updates
    if (!this.walletUpdateInterval) {
      this.startWalletBalanceUpdates()
    }
  }

  // Start wallet balance updates
  private startWalletBalanceUpdates(): void {
    if (this.walletUpdateInterval) {
      clearInterval(this.walletUpdateInterval)
    }

    this.walletUpdateInterval = setInterval(
      () => {
        // Get all tokens with price
        const activeTokens = mockTokens.filter((t) => t.price && t.price > 0)
        if (activeTokens.length === 0) return

        // Select a random token
        const randomToken = activeTokens[Math.floor(Math.random() * activeTokens.length)]

        // Find wallets with this token
        const walletsWithToken = mockWallets.filter(
          (w) => w.tokenBalances[randomToken.address] && w.tokenBalances[randomToken.address] > 0,
        )

        if (walletsWithToken.length === 0) return

        // Select a random wallet
        const randomWallet = walletsWithToken[Math.floor(Math.random() * walletsWithToken.length)]

        // Random balance change between -2% and +5%
        const changePercent = Math.random() * 7 - 2
        const previousBalance = randomWallet.tokenBalances[randomToken.address]
        const change = previousBalance * (changePercent / 100)
        const newBalance = previousBalance + change

        randomWallet.tokenBalances[randomToken.address] = newBalance

        this.emit("walletTokenBalanceChanged", {
          walletAddress: randomWallet.address,
          tokenAddress: randomToken.address,
          previousBalance,
          newBalance,
          change,
        })

        // Log significant changes
        if (Math.abs(changePercent) > 3) {
          const direction = changePercent > 0 ? "increased" : "decreased"
          const logType: LogType = changePercent > 0 ? "success" : "warning"

          this.addLog(
            `Wallet ${randomWallet.address.substring(0, 6)}... ${direction} ${randomToken.symbol} balance by ${Math.abs(changePercent).toFixed(2)}%`,
            logType,
            "wallet",
            { walletAddress: randomWallet.address, tokenAddress: randomToken.address },
          )
        }
      },
      5000 + Math.random() * 10000,
    ) // Random interval between 5-15 seconds
  }

  // Activity logs
  public addLog(message: string, type: LogType = "info", category: LogCategory = "system", details?: any): ActivityLog {
    const log: ActivityLog = {
      id: uuidv4(),
      message,
      timestamp: new Date(),
      type,
      category,
      ...details,
    }

    activityLogs.push(log)

    // Keep logs under a reasonable limit
    if (activityLogs.length > 1000) {
      activityLogs.shift()
    }

    this.emit("newLog", log)
    return log
  }

  public getLogs(
    options: {
      limit?: number
      types?: LogType[]
      categories?: LogCategory[]
      tokenAddress?: string
      walletAddress?: string
    } = {},
  ): ActivityLog[] {
    let filteredLogs = [...activityLogs]

    if (options.types && options.types.length > 0) {
      filteredLogs = filteredLogs.filter((log) => options.types!.includes(log.type))
    }

    if (options.categories && options.categories.length > 0) {
      filteredLogs = filteredLogs.filter((log) => options.categories!.includes(log.category))
    }

    if (options.tokenAddress) {
      filteredLogs = filteredLogs.filter((log) => log.tokenAddress === options.tokenAddress)
    }

    if (options.walletAddress) {
      filteredLogs = filteredLogs.filter((log) => log.walletAddress === options.walletAddress)
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    if (options.limit && options.limit > 0) {
      filteredLogs = filteredLogs.slice(0, options.limit)
    }

    return filteredLogs
  }

  public clearLogs(): void {
    activityLogs.length = 0
    this.emit("logsCleared")
  }
}

// Export a singleton instance
export const bundlerSDK = new BundlerSDK()
