import { EventEmitter } from "./event-emitter"
import type { BotConfig, EventListener, LogEntry, SDKConfig, Trade, Wallet } from "./types"

/**
 * Volume Bot SDK
 *
 * This SDK provides an interface to interact with volume bots.
 * It runs in the same thread as the UI and emits events that the UI can listen to.
 */
export class VolumeBotSDK {
  private emitter: EventEmitter
  private bots: Map<string, BotConfig> = new Map()
  private wallets: Map<string, Wallet[]> = new Map()
  private trades: Map<string, Trade[]> = new Map()
  private logs: Map<string, LogEntry[]> = new Map()
  private intervals: Map<string, NodeJS.Timeout> = new Map()
  private config: SDKConfig

  constructor(config: SDKConfig = {}) {
    this.emitter = new EventEmitter()
    this.config = {
      debug: false,
      ...config,
    }

    // Load settings from localStorage if available
    if (typeof window !== "undefined") {
      this.loadSettings()
    }

    this.log("SDK initialized with config:", this.config)
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): void {
    try {
      // Load dev wallet
      const devWalletData = localStorage.getItem("devWallet")
      if (devWalletData) {
        const devWallet = JSON.parse(devWalletData)
        this.config.devWalletPrivateKey = devWallet.privateKey
      }

      // Load funding wallet
      const fundingWalletData = localStorage.getItem("fundingWallet")
      if (fundingWalletData) {
        const fundingWallet = JSON.parse(fundingWalletData)
        this.config.fundingWalletPrivateKey = fundingWallet.privateKey
      }

      // Load RPC URL
      const rpcUrl = localStorage.getItem("rpcUrl")
      if (rpcUrl) {
        this.config.rpcUrl = rpcUrl
      }

      // Load Jito region
      const jitoRegion = localStorage.getItem("jitoRegion")
      if (jitoRegion) {
        this.config.jitoRegion = jitoRegion
      }

      this.log("Settings loaded from localStorage")
    } catch (error) {
      this.log("Error loading settings:", error)
    }
  }

  /**
   * Internal logging function
   */
  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log("[VolumeBotSDK]", ...args)
    }
  }

  /**
   * Add a bot configuration
   */
  addBot(config: BotConfig): string {
    // Ensure the bot has an ID
    if (!config.id) {
      config.id = Date.now().toString()
    }

    // Set default status and progress
    config.status = config.status || "paused"
    config.progress = config.progress || 0

    // Store the bot configuration
    this.bots.set(config.id, config)

    // Initialize empty arrays for this bot
    this.wallets.set(config.id, [])
    this.trades.set(config.id, [])
    this.logs.set(config.id, [])

    // Add a log entry
    this.addLogEntry(config.id, `Bot created for ${config.symbol}`, "info")

    this.log(`Bot added: ${config.id} (${config.symbol})`)
    return config.id
  }

  /**
   * Get a bot configuration
   */
  getBot(botId: string): BotConfig | undefined {
    return this.bots.get(botId)
  }

  /**
   * Get all bot configurations
   */
  getAllBots(): BotConfig[] {
    return Array.from(this.bots.values())
  }

  /**
   * Start a bot
   */
  startBot(botId: string): boolean {
    const bot = this.bots.get(botId)
    if (!bot) {
      this.log(`Bot not found: ${botId}`)
      return false
    }

    // Check if any other bot is already running
    const anyBotRunning = Array.from(this.bots.values()).some((b) => b.id !== botId && b.status === "active")
    if (anyBotRunning) {
      this.addLogEntry(botId, "Cannot start bot: Another bot is already running", "error")
      this.emitter.emit({
        type: "bot:error",
        botId,
        error: "Cannot start bot: Another bot is already running",
      })
      return false
    }

    // Check if we have the required wallets
    const botWallets = this.wallets.get(botId) || []
    if (botWallets.length === 0) {
      // Generate wallets if none exist
      this.generateWallets(botId, bot.numberOfWallets)
    }

    // Update bot status
    bot.status = "active"
    this.bots.set(botId, bot)

    // Add a log entry
    this.addLogEntry(botId, `Bot started for ${bot.symbol}`, "success")

    // Emit event
    this.emitter.emit({
      type: "bot:started",
      botId,
      config: bot,
    })

    // Start the simulation interval
    this.startBotSimulation(botId)

    this.log(`Bot started: ${botId} (${bot.symbol})`)
    return true
  }

  /**
   * Pause a bot
   */
  pauseBot(botId: string): boolean {
    const bot = this.bots.get(botId)
    if (!bot) {
      this.log(`Bot not found: ${botId}`)
      return false
    }

    // Update bot status
    bot.status = "paused"
    this.bots.set(botId, bot)

    // Stop the simulation interval
    this.stopBotSimulation(botId)

    // Add a log entry
    this.addLogEntry(botId, `Bot paused for ${bot.symbol}`, "warning")

    // Emit event
    this.emitter.emit({
      type: "bot:paused",
      botId,
    })

    this.log(`Bot paused: ${botId} (${bot.symbol})`)
    return true
  }

  /**
   * Stop a bot
   */
  stopBot(botId: string): boolean {
    const bot = this.bots.get(botId)
    if (!bot) {
      this.log(`Bot not found: ${botId}`)
      return false
    }

    // Update bot status
    bot.status = "stopped"
    this.bots.set(botId, bot)

    // Stop the simulation interval
    this.stopBotSimulation(botId)

    // Add a log entry
    this.addLogEntry(botId, `Bot stopped for ${bot.symbol}`, "warning")

    // Emit event
    this.emitter.emit({
      type: "bot:stopped",
      botId,
    })

    this.log(`Bot stopped: ${botId} (${bot.symbol})`)
    return true
  }

  /**
   * Delete a bot
   */
  deleteBot(botId: string): boolean {
    const bot = this.bots.get(botId)
    if (!bot) {
      this.log(`Bot not found: ${botId}`)
      return false
    }

    // Stop the simulation interval
    this.stopBotSimulation(botId)

    // Remove all data for this bot
    this.bots.delete(botId)
    this.wallets.delete(botId)
    this.trades.delete(botId)
    this.logs.delete(botId)

    // Emit event
    this.emitter.emit({
      type: "bot:deleted",
      botId,
    })

    this.log(`Bot deleted: ${botId}`)
    return true
  }

  /**
   * Generate wallets for a bot
   */
  generateWallets(botId: string, count: number): Wallet[] {
    const bot = this.bots.get(botId)
    if (!bot) {
      this.log(`Bot not found: ${botId}`)
      return []
    }

    // Get existing wallets or initialize empty array
    const existingWallets = this.wallets.get(botId) || []

    // Generate new wallets
    const newWallets: Wallet[] = []
    for (let i = 0; i < count; i++) {
      const wallet: Wallet = {
        id: `${botId}-wallet-${existingWallets.length + i}`,
        address: this.generateRandomAddress(),
        privateKey: this.generateRandomPrivateKey(),
        solBalance: 0.01, // Initial balance
        tokenBalance: 0,
        tradesCount: 0,
        selected: false,
      }

      newWallets.push(wallet)

      // Emit wallet created event
      this.emitter.emit({
        type: "wallet:created",
        botId,
        wallet,
      })

      // Add a log entry
      this.addLogEntry(botId, `Wallet created: ${wallet.address.substring(0, 8)}...`, "info")
    }

    // Update wallets for this bot
    const updatedWallets = [...existingWallets, ...newWallets]
    this.wallets.set(botId, updatedWallets)

    this.log(`Generated ${count} wallets for bot: ${botId}`)
    return newWallets
  }

  /**
   * Fund wallets for a bot
   */
  fundWallets(botId: string, walletIds: string[], amount: number): boolean {
    const bot = this.bots.get(botId)
    if (!bot) {
      this.log(`Bot not found: ${botId}`)
      return false
    }

    // Get wallets for this bot
    const botWallets = this.wallets.get(botId) || []

    // Fund each wallet
    for (const walletId of walletIds) {
      const walletIndex = botWallets.findIndex((w) => w.id === walletId)
      if (walletIndex >= 0) {
        const wallet = botWallets[walletIndex]
        wallet.solBalance += amount
        botWallets[walletIndex] = wallet

        // Emit wallet funded event
        this.emitter.emit({
          type: "wallet:funded",
          botId,
          wallet,
          amount,
        })

        // Add a log entry
        this.addLogEntry(botId, `Wallet funded: ${wallet.address.substring(0, 8)}... with ${amount} SOL`, "success")
      }
    }

    // Update wallets for this bot
    this.wallets.set(botId, botWallets)

    this.log(`Funded ${walletIds.length} wallets for bot: ${botId}`)
    return true
  }

  /**
   * Get wallets for a bot
   */
  getWallets(botId: string): Wallet[] {
    return this.wallets.get(botId) || []
  }

  /**
   * Get trades for a bot
   */
  getTrades(botId: string): Trade[] {
    return this.trades.get(botId) || []
  }

  /**
   * Get logs for a bot
   */
  getLogs(botId: string): LogEntry[] {
    return this.logs.get(botId) || []
  }

  /**
   * Add a log entry
   */
  private addLogEntry(botId: string, message: string, type: LogEntry["type"], data?: any): LogEntry {
    const log: LogEntry = {
      id: Date.now().toString(),
      botId,
      timestamp: new Date(),
      message,
      type,
      data,
    }

    // Get existing logs or initialize empty array
    const botLogs = this.logs.get(botId) || []

    // Add new log to the beginning of the array
    this.logs.set(botId, [log, ...botLogs])

    // Emit log event
    this.emitter.emit({
      type: "log:new",
      botId,
      log,
    })

    return log
  }

  /**
   * Start bot simulation
   */
  private startBotSimulation(botId: string): void {
    const bot = this.bots.get(botId)
    if (!bot) return

    // Stop any existing interval
    this.stopBotSimulation(botId)

    // Calculate interval based on trades per minute
    const intervalMs = Math.floor(60000 / bot.tradesPerMinute)

    // Start a new interval
    const interval = setInterval(() => {
      this.simulateTrade(botId)
      this.updateBotProgress(botId)
    }, intervalMs)

    this.intervals.set(botId, interval)

    this.log(`Bot simulation started for: ${botId} with interval: ${intervalMs}ms`)
  }

  /**
   * Stop bot simulation
   */
  private stopBotSimulation(botId: string): void {
    const interval = this.intervals.get(botId)
    if (interval) {
      clearInterval(interval)
      this.intervals.delete(botId)
      this.log(`Bot simulation stopped for: ${botId}`)
    }
  }

  /**
   * Simulate a trade
   */
  private simulateTrade(botId: string): void {
    const bot = this.bots.get(botId)
    if (!bot || bot.status !== "active") return

    // Get wallets for this bot
    const botWallets = this.wallets.get(botId) || []
    if (botWallets.length === 0) return

    // Select a random wallet
    const walletIndex = Math.floor(Math.random() * botWallets.length)
    const wallet = botWallets[walletIndex]

    // Determine trade type (buy or sell)
    const tradeType = Math.random() > 0.5 ? "buy" : "sell"

    // Determine trade amount
    const minAmount = bot.minTradeAmount
    const maxAmount = bot.maxTradeAmount
    const amount = minAmount + Math.random() * (maxAmount - minAmount)

    // Create a trade
    const trade: Trade = {
      id: Date.now().toString(),
      botId,
      walletAddress: wallet.address,
      amount,
      type: tradeType,
      timestamp: new Date(),
      status: "pending",
      price: Math.random() * 0.0000001, // Random price
    }

    // Get existing trades or initialize empty array
    const botTrades = this.trades.get(botId) || []

    // Add new trade
    this.trades.set(botId, [trade, ...botTrades])

    // Update wallet
    wallet.tradesCount++
    wallet.lastTrade = new Date()
    if (tradeType === "buy") {
      wallet.tokenBalance += amount
      wallet.solBalance -= amount
    } else {
      wallet.tokenBalance -= amount
      wallet.solBalance += amount
    }
    botWallets[walletIndex] = wallet
    this.wallets.set(botId, botWallets)

    // Simulate transaction confirmation
    setTimeout(
      () => {
        // 95% chance of success
        const success = Math.random() > 0.05

        if (success) {
          trade.status = "confirmed"
          trade.txHash = this.generateRandomTxHash()

          // Emit trade executed event
          this.emitter.emit({
            type: "trade:executed",
            botId,
            trade,
          })

          // Add a log entry
          this.addLogEntry(
            botId,
            `${tradeType === "buy" ? "Bought" : "Sold"} ${amount.toFixed(4)} SOL of ${bot.symbol}`,
            "success",
            { trade },
          )
        } else {
          trade.status = "failed"

          // Emit trade failed event
          this.emitter.emit({
            type: "trade:failed",
            botId,
            trade,
            error: "Transaction failed",
          })

          // Add a log entry
          this.addLogEntry(botId, `Trade failed: ${amount.toFixed(4)} SOL of ${bot.symbol}`, "error", { trade })
        }

        // Update trades
        const updatedTrades = this.trades.get(botId) || []
        const tradeIndex = updatedTrades.findIndex((t) => t.id === trade.id)
        if (tradeIndex >= 0) {
          updatedTrades[tradeIndex] = trade
          this.trades.set(botId, updatedTrades)
        }
      },
      1000 + Math.random() * 2000,
    ) // Random delay between 1-3 seconds
  }

  /**
   * Update bot progress
   */
  private updateBotProgress(botId: string): void {
    const bot = this.bots.get(botId)
    if (!bot || bot.status !== "active") return

    // Calculate progress based on duration
    const durationMs = bot.duration * 60 * 60 * 1000 // Convert hours to ms
    const progressIncrement = (100 / durationMs) * 1000 // Progress per second

    // Update progress
    bot.progress = Math.min(100, (bot.progress || 0) + progressIncrement)
    this.bots.set(botId, bot)

    // Emit progress event
    this.emitter.emit({
      type: "bot:progress",
      botId,
      progress: bot.progress,
    })

    // If progress reaches 100%, stop the bot
    if (bot.progress >= 100) {
      this.stopBot(botId)
      this.addLogEntry(botId, `Bot completed for ${bot.symbol}`, "success")
    }
  }

  /**
   * Generate a random address
   */
  private generateRandomAddress(): string {
    return Array.from(
      { length: 44 },
      () => "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 62)],
    ).join("")
  }

  /**
   * Generate a random private key
   */
  private generateRandomPrivateKey(): string {
    return Array.from({ length: 64 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")
  }

  /**
   * Generate a random transaction hash
   */
  private generateRandomTxHash(): string {
    return Array.from({ length: 64 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")
  }

  /**
   * Add an event listener
   */
  on(eventType: string, listener: EventListener): () => void {
    return this.emitter.on(eventType, listener)
  }

  /**
   * Add a one-time event listener
   */
  once(eventType: string, listener: EventListener): () => void {
    return this.emitter.once(eventType, listener)
  }

  /**
   * Remove an event listener
   */
  off(eventType: string, listener: EventListener): void {
    this.emitter.off(eventType, listener)
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    // Stop all bot simulations
    for (const botId of this.intervals.keys()) {
      this.stopBotSimulation(botId)
    }

    // Remove all event listeners
    this.emitter.removeAllListeners()

    this.log("SDK destroyed")
  }
}

// Create a singleton instance
let sdkInstance: VolumeBotSDK | null = null

/**
 * Get the SDK instance
 */
export function getVolumeBotSDK(config?: SDKConfig): VolumeBotSDK {
  if (!sdkInstance) {
    sdkInstance = new VolumeBotSDK(config)
  }
  return sdkInstance
}
