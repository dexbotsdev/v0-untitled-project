import type { Bot, StorageData, Wallet } from "../types"
import fs from "fs"
import path from "path"

class StorageService {
  private data: StorageData
  private persistPath?: string

  constructor(persistPath?: string) {
    this.data = {
      bots: new Map<string, Bot>(),
      wallets: new Map<string, Wallet>(),
    }
    this.persistPath = persistPath

    // Load data from disk if persist path is provided
    if (this.persistPath) {
      this.loadFromDisk()
    }
  }

  // Bot operations
  getBots(): Bot[] {
    return Array.from(this.data.bots.values())
  }

  getBot(id: string): Bot | undefined {
    return this.data.bots.get(id)
  }

  createBot(bot: Bot): Bot {
    this.data.bots.set(bot.id, bot)
    this.persist()
    return bot
  }

  updateBot(id: string, updates: Partial<Bot>): Bot | undefined {
    const bot = this.data.bots.get(id)
    if (!bot) return undefined

    const updatedBot = { ...bot, ...updates, updatedAt: new Date() }
    this.data.bots.set(id, updatedBot)
    this.persist()
    return updatedBot
  }

  deleteBot(id: string): boolean {
    const deleted = this.data.bots.delete(id)
    if (deleted) {
      // Delete all wallets associated with this bot
      for (const [walletId, wallet] of this.data.wallets.entries()) {
        if (wallet.botId === id) {
          this.data.wallets.delete(walletId)
        }
      }
      this.persist()
    }
    return deleted
  }

  // Wallet operations
  getWallets(): Wallet[] {
    return Array.from(this.data.wallets.values())
  }

  getWalletsByBotId(botId: string): Wallet[] {
    return this.getWallets().filter((wallet) => wallet.botId === botId)
  }

  getWallet(id: string): Wallet | undefined {
    return this.data.wallets.get(id)
  }

  getWalletByAddress(address: string): Wallet | undefined {
    return this.getWallets().find((wallet) => wallet.address === address)
  }

  createWallet(wallet: Wallet): Wallet {
    this.data.wallets.set(wallet.id, wallet)
    this.persist()
    return wallet
  }

  createWallets(wallets: Wallet[]): Wallet[] {
    wallets.forEach((wallet) => {
      this.data.wallets.set(wallet.id, wallet)
    })
    this.persist()
    return wallets
  }

  updateWallet(id: string, updates: Partial<Wallet>): Wallet | undefined {
    const wallet = this.data.wallets.get(id)
    if (!wallet) return undefined

    const updatedWallet = { ...wallet, ...updates }
    this.data.wallets.set(id, updatedWallet)
    this.persist()
    return updatedWallet
  }

  deleteWallet(id: string): boolean {
    const deleted = this.data.wallets.delete(id)
    if (deleted) {
      this.persist()
    }
    return deleted
  }

  // Persistence methods
  private persist(): void {
    if (!this.persistPath) return

    try {
      // Create directory if it doesn't exist
      const dir = path.dirname(this.persistPath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      // Convert Maps to arrays for serialization
      const serializedData = {
        bots: Array.from(this.data.bots.entries()),
        wallets: Array.from(this.data.wallets.entries()),
      }

      fs.writeFileSync(this.persistPath, JSON.stringify(serializedData, null, 2))
    } catch (error) {
      console.error("Failed to persist data:", error)
    }
  }

  private loadFromDisk(): void {
    try {
      if (!fs.existsSync(this.persistPath!)) return

      const fileData = fs.readFileSync(this.persistPath!, "utf-8")
      const parsedData = JSON.parse(fileData)

      // Convert arrays back to Maps
      this.data.bots = new Map(parsedData.bots)
      this.data.wallets = new Map(parsedData.wallets)

      // Convert date strings back to Date objects
      for (const [id, bot] of this.data.bots.entries()) {
        this.data.bots.set(id, {
          ...bot,
          createdAt: new Date(bot.createdAt),
          updatedAt: new Date(bot.updatedAt),
        })
      }

      for (const [id, wallet] of this.data.wallets.entries()) {
        this.data.wallets.set(id, {
          ...wallet,
          createdAt: new Date(wallet.createdAt),
          lastUsed: wallet.lastUsed ? new Date(wallet.lastUsed) : undefined,
        })
      }
    } catch (error) {
      console.error("Failed to load data from disk:", error)
      // Initialize with empty data
      this.data = {
        bots: new Map<string, Bot>(),
        wallets: new Map<string, Wallet>(),
      }
    }
  }
}

// Create a singleton instance
const storage = new StorageService(process.env.PERSIST_PATH || "./data/storage.json")

export default storage
