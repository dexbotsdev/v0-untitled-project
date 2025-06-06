import { EventEmitter } from "events"

// Types for the SDK
export interface BundleConfig {
  id?: string
  tokenAddress: string
  tokenSymbol: string
  tokenName: string
  platform: string
  mode: string
  walletsCount: number
  devWalletBuyAmount: number
  delaySeconds?: number
  minDelay?: number
  maxDelay?: number
  walletBuyAmounts?: number[]
  wallets?: WalletConfig[]
  status?: "pending" | "launching" | "launched" | "failed"
  createdAt?: string
  updatedAt?: string
  tokenTax?: number
  revokeFreeze?: boolean
  revokeMint?: boolean
}

export interface WalletConfig {
  id: number
  address: string
  privateKey: string
  tokenAddress: string
  tradeAmount: number
  buyPrice?: number
  tokenAmount?: number
  solAmount?: number
  tokenSupply?: number
}

export interface Token {
  id: string
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
  marketCap?: number
  volume24h?: number
  priceChange24h?: number
  bundleReady?: boolean
  bundleStatus?: string
  devAddress?: string
  launchedDate?: string
  isPumpSwapMigrated?: boolean
}

export interface WalletBalance {
  walletId: number
  address: string
  solBalance: number
  tokenBalance: number
  tokenAddress?: string
}

export interface ActivityLog {
  id: string
  timestamp: string
  message: string
  type: "info" | "success" | "warning" | "error"
  category: "bundle" | "wallet" | "token" | "volume" | "system"
  data?: any
}

export interface VolumeBoostConfig {
  tokenAddress: string
  walletIds: number[]
  volumeTarget: number
  duration: number
  intervalMs: number
}

export interface SellTokensConfig {
  tokenAddress: string
  walletIds: number[]
  percentage: number
  slippage?: number
}

// Event types
export interface BundlerSDKEvents {
  // Bundle events
  "bundle:created": (bundle: BundleConfig) => void
  "bundle:launched": (bundle: BundleConfig) => void
  "bundle:failed": (bundle: BundleConfig, error: Error) => void
  "bundle:status-changed": (bundleId: string, status: string) => void

  // Wallet events
  "wallet:balance-changed": (balance: WalletBalance) => void
  "wallet:token-balance-changed": (balance: WalletBalance) => void

  // Token events
  "token:price-changed": (token: Token) => void
  "token:created": (token: Token) => void
  "token:updated": (token: Token) => void

  // Volume events
  "volume:boost-started": (config: VolumeBoostConfig) => void
  "volume:boost-stopped": (tokenAddress: string) => void
  "volume:trade-executed": (tokenAddress: string, volume: number) => void

  // Sell events
  "tokens:sold": (config: SellTokensConfig, result: any) => void

  // Activity logs
  "activity:log": (log: ActivityLog) => void

  // System events
  "system:connected": () => void
  "system:disconnected": () => void
  "system:error": (error: Error) => void
}

export class BundlerSDK extends EventEmitter {
  private bundles: Map<string, BundleConfig> = new Map()
  private tokens: Map<string, Token> = new Map()
  private walletBalances: Map<string, WalletBalance> = new Map()
  private volumeBoosts: Map<string, VolumeBoostConfig> = new Map()
  private priceUpdateIntervals: Map<string, NodeJS.Timeout> = new Map()
  private balanceUpdateIntervals: Map<string, NodeJS.Timeout> = new Map()
  private isConnected = false

  constructor() {
    super()
    this.setMaxListeners(100) // Increase max listeners for multiple components
    this.initialize()
  }

  private initialize() {
    // Simulate connection
    setTimeout(() => {
      this.isConnected = true
      this.emit("system:connected")
      this.addLog("System connected successfully", "success", "system")
    }, 1000)
  }

  // Bundle Functions
  async createBundle(config: Omit<BundleConfig, "id" | "createdAt" | "updatedAt">): Promise<BundleConfig> {
    try {
      const bundleId = `bundle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const bundle: BundleConfig = {
        ...config,
        id: bundleId,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      this.bundles.set(bundleId, bundle)

      this.addLog(
        `Bundle created for ${config.tokenSymbol} on ${config.platform} with ${config.walletsCount} wallets`,
        "success",
        "bundle",
        { bundleId, config },
      )

      this.emit("bundle:created", bundle)

      return bundle
    } catch (error) {
      this.addLog(`Failed to create bundle: ${error.message}`, "error", "bundle")
      throw error
    }
  }

  async launchBundle(bundleId: string): Promise<BundleConfig> {
    try {
      const bundle = this.bundles.get(bundleId)
      if (!bundle) {
        throw new Error(`Bundle ${bundleId} not found`)
      }

      // Update bundle status
      bundle.status = "launching"
      bundle.updatedAt = new Date().toISOString()
      this.bundles.set(bundleId, bundle)

      this.addLog(`Launching bundle ${bundleId}...`, "info", "bundle", { bundleId })
      this.emit("bundle:status-changed", bundleId, "launching")

      // Simulate launch process
      await this.simulateLaunchProcess(bundle)

      // Update to launched status
      bundle.status = "launched"
      bundle.updatedAt = new Date().toISOString()
      this.bundles.set(bundleId, bundle)

      this.addLog(`Bundle ${bundleId} launched successfully`, "success", "bundle", { bundleId })
      this.emit("bundle:launched", bundle)
      this.emit("bundle:status-changed", bundleId, "launched")

      // Start real-time updates for this token
      this.startTokenUpdates(bundle.tokenAddress)
      this.startWalletUpdates(bundle.wallets || [])

      return bundle
    } catch (error) {
      const bundle = this.bundles.get(bundleId)
      if (bundle) {
        bundle.status = "failed"
        bundle.updatedAt = new Date().toISOString()
        this.bundles.set(bundleId, bundle)
        this.emit("bundle:failed", bundle, error)
      }

      this.addLog(`Bundle launch failed: ${error.message}`, "error", "bundle")
      throw error
    }
  }

  private async simulateLaunchProcess(bundle: BundleConfig): Promise<void> {
    const steps = [
      "Initializing wallet connections...",
      "Setting up token parameters...",
      "Deploying smart contract...",
      "Configuring liquidity pools...",
      "Executing bundle transactions...",
      "Verifying token creation...",
      "Finalizing launch process...",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))
      this.addLog(steps[i], "info", "bundle", { bundleId: bundle.id, step: i + 1, total: steps.length })
    }
  }

  getBundleForToken(tokenAddress: string): BundleConfig | null {
    for (const bundle of this.bundles.values()) {
      if (bundle.tokenAddress === tokenAddress) {
        return bundle
      }
    }
    return null
  }

  getTokens(): Token[] {
    return Array.from(this.tokens.values())
  }

  getToken(address: string): Token | null {
    return this.tokens.get(address) || null
  }

  // Token price updates
  private startTokenUpdates(tokenAddress: string): void {
    // Clear existing interval if any
    const existingInterval = this.priceUpdateIntervals.get(tokenAddress)
    if (existingInterval) {
      clearInterval(existingInterval)
    }

    // Create mock token if it doesn't exist
    if (!this.tokens.has(tokenAddress)) {
      const bundle = this.getBundleForToken(tokenAddress)
      const token: Token = {
        id: tokenAddress,
        address: tokenAddress,
        name: bundle?.tokenName || "Unknown Token",
        symbol: bundle?.tokenSymbol || "UNK",
        price: Math.random() * 0.01,
        marketCap: Math.random() * 10000000 + 1000000,
        priceChange24h: Math.random() * 20 - 10,
        bundleReady: true,
        bundleStatus: "launched",
        launchedDate: new Date().toISOString(),
      }
      this.tokens.set(tokenAddress, token)
    }

    // Start price updates every 3-8 seconds
    const interval = setInterval(
      () => {
        this.updateTokenPrice(tokenAddress)
      },
      3000 + Math.random() * 5000,
    )

    this.priceUpdateIntervals.set(tokenAddress, interval)
  }

  private updateTokenPrice(tokenAddress: string): void {
    const token = this.tokens.get(tokenAddress)
    if (!token) return

    // Generate realistic price movement
    const changePercent = (Math.random() - 0.5) * 0.1 // -5% to +5%
    const newPrice = Math.max(0.000001, token.price! * (1 + changePercent))
    const newMarketCap = token.marketCap! * (1 + changePercent)

    const updatedToken: Token = {
      ...token,
      price: newPrice,
      marketCap: newMarketCap,
      priceChange24h: (token.priceChange24h || 0) + changePercent * 100,
    }

    this.tokens.set(tokenAddress, updatedToken)

    // Emit price change event
    this.emit("token:price-changed", updatedToken)

    // Log significant price movements
    if (Math.abs(changePercent * 100) > 2) {
      const direction = changePercent > 0 ? "increased" : "decreased"
      this.addLog(
        `${token.symbol} price ${direction} by ${Math.abs(changePercent * 100).toFixed(2)}% to $${newPrice.toFixed(8)}`,
        changePercent > 0 ? "success" : "warning",
        "token",
        { tokenAddress, priceChange: changePercent * 100, newPrice },
      )
    }
  }

  // Wallet balance updates
  private startWalletUpdates(wallets: WalletConfig[]): void {
    wallets.forEach((wallet) => {
      // Initialize wallet balance if not exists
      const balanceKey = `${wallet.address}_${wallet.tokenAddress}`
      if (!this.walletBalances.has(balanceKey)) {
        const balance: WalletBalance = {
          walletId: wallet.id,
          address: wallet.address,
          solBalance: wallet.solAmount || Math.random() * 10,
          tokenBalance: wallet.tokenAmount || Math.floor(Math.random() * 1000000),
          tokenAddress: wallet.tokenAddress,
        }
        this.walletBalances.set(balanceKey, balance)
      }

      // Start balance updates
      const interval = setInterval(
        () => {
          this.updateWalletBalance(balanceKey)
        },
        5000 + Math.random() * 10000,
      )

      this.balanceUpdateIntervals.set(balanceKey, interval)
    })
  }

  private updateWalletBalance(balanceKey: string): void {
    const balance = this.walletBalances.get(balanceKey)
    if (!balance) return

    // Update SOL balance (small changes)
    const solChange = (Math.random() - 0.5) * 0.1
    const newSolBalance = Math.max(0, balance.solBalance + solChange)

    // Update token balance (trading activity)
    const tokenChangePercent = (Math.random() - 0.5) * 0.05 // -2.5% to +2.5%
    const newTokenBalance = Math.floor(balance.tokenBalance * (1 + tokenChangePercent))

    const updatedBalance: WalletBalance = {
      ...balance,
      solBalance: newSolBalance,
      tokenBalance: newTokenBalance,
    }

    this.walletBalances.set(balanceKey, updatedBalance)

    // Emit balance change events
    if (Math.abs(solChange) > 0.01) {
      this.emit("wallet:balance-changed", updatedBalance)
    }

    if (Math.abs(tokenChangePercent) > 0.01) {
      this.emit("wallet:token-balance-changed", updatedBalance)
    }
  }

  // Volume boost functions
  async startVolumeBoost(config: VolumeBoostConfig): Promise<void> {
    try {
      this.volumeBoosts.set(config.tokenAddress, config)

      this.addLog(
        `Volume boost started for ${config.tokenAddress} with ${config.walletIds.length} wallets`,
        "info",
        "volume",
        config,
      )

      this.emit("volume:boost-started", config)

      // Simulate volume trading
      this.simulateVolumeTrading(config)
    } catch (error) {
      this.addLog(`Failed to start volume boost: ${error.message}`, "error", "volume")
      throw error
    }
  }

  async stopVolumeBoost(tokenAddress: string): Promise<void> {
    this.volumeBoosts.delete(tokenAddress)
    this.addLog(`Volume boost stopped for ${tokenAddress}`, "info", "volume")
    this.emit("volume:boost-stopped", tokenAddress)
  }

  private simulateVolumeTrading(config: VolumeBoostConfig): void {
    const interval = setInterval(() => {
      if (!this.volumeBoosts.has(config.tokenAddress)) {
        clearInterval(interval)
        return
      }

      const volume = Math.random() * 1000 + 100
      this.addLog(`Volume trade executed: ${volume.toFixed(2)} SOL`, "info", "volume", {
        tokenAddress: config.tokenAddress,
        volume,
      })

      this.emit("volume:trade-executed", config.tokenAddress, volume)
    }, config.intervalMs || 5000)
  }

  // Sell tokens function
  async sellTokens(config: SellTokensConfig): Promise<any> {
    try {
      const result = {
        tokenAddress: config.tokenAddress,
        walletIds: config.walletIds,
        percentage: config.percentage,
        totalTokensSold: 0,
        totalSolReceived: 0,
        transactionHashes: [],
      }

      // Simulate selling process
      for (const walletId of config.walletIds) {
        const balanceKey = Object.keys(this.walletBalances).find(
          (key) =>
            this.walletBalances.get(key)?.walletId === walletId &&
            this.walletBalances.get(key)?.tokenAddress === config.tokenAddress,
        )

        if (balanceKey) {
          const balance = this.walletBalances.get(balanceKey)!
          const tokensToSell = Math.floor(balance.tokenBalance * (config.percentage / 100))
          const solReceived = tokensToSell * 0.0000025 // Mock conversion rate

          // Update balance
          const updatedBalance: WalletBalance = {
            ...balance,
            tokenBalance: balance.tokenBalance - tokensToSell,
            solBalance: balance.solBalance + solReceived,
          }

          this.walletBalances.set(balanceKey, updatedBalance)

          result.totalTokensSold += tokensToSell
          result.totalSolReceived += solReceived
          result.transactionHashes.push(`0x${Math.random().toString(16).substr(2, 64)}`)

          this.emit("wallet:token-balance-changed", updatedBalance)
          this.emit("wallet:balance-changed", updatedBalance)
        }
      }

      this.addLog(
        `Sold ${result.totalTokensSold.toLocaleString()} tokens (${config.percentage}%) from ${config.walletIds.length} wallets`,
        "success",
        "bundle",
        result,
      )

      this.emit("tokens:sold", config, result)
      return result
    } catch (error) {
      this.addLog(`Failed to sell tokens: ${error.message}`, "error", "bundle")
      throw error
    }
  }

  // Activity logging
  private addLog(message: string, type: ActivityLog["type"], category: ActivityLog["category"], data?: any): void {
    const log: ActivityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
      category,
      data,
    }

    this.emit("activity:log", log)
  }

  // Utility methods
  getWalletBalance(walletId: number, tokenAddress?: string): WalletBalance | null {
    for (const balance of this.walletBalances.values()) {
      if (balance.walletId === walletId && (!tokenAddress || balance.tokenAddress === tokenAddress)) {
        return balance
      }
    }
    return null
  }

  getAllWalletBalances(tokenAddress?: string): WalletBalance[] {
    const balances = Array.from(this.walletBalances.values())
    return tokenAddress ? balances.filter((b) => b.tokenAddress === tokenAddress) : balances
  }

  // Cleanup
  disconnect(): void {
    // Clear all intervals
    this.priceUpdateIntervals.forEach((interval) => clearInterval(interval))
    this.balanceUpdateIntervals.forEach((interval) => clearInterval(interval))

    this.priceUpdateIntervals.clear()
    this.balanceUpdateIntervals.clear()
    this.volumeBoosts.clear()

    this.isConnected = false
    this.addLog("System disconnected", "info", "system")
    this.emit("system:disconnected")
  }

  // Connection status
  isSystemConnected(): boolean {
    return this.isConnected
  }
}

// Create singleton instance
export const bundlerSDK = new BundlerSDK()

// Type-safe event emitter
export interface TypedEventEmitter<T> {
  on<K extends keyof T>(event: K, listener: T[K]): this
  off<K extends keyof T>(event: K, listener: T[K]): this
  emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): boolean
  once<K extends keyof T>(event: K, listener: T[K]): this
}

// Export typed SDK
export const typedBundlerSDK = bundlerSDK as TypedEventEmitter<BundlerSDKEvents> & BundlerSDK
