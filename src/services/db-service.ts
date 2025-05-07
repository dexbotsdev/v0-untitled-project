import { Database } from "@tauri-apps/plugin-sql"
import { v4 as uuidv4 } from "uuid"
import type { Token, BotSettings, Wallet, Transaction, License, SystemSettings } from "../types/database"
import { encrypt, decrypt } from "./crypto-service"

// Database connection instance
let db: Database | null = null

/**
 * Initialize the database connection and create tables if they don't exist
 */
export async function initDatabase(): Promise<void> {
  try {
    // Connect to SQLite database
    db = await Database.load("sqlite:bossbundler.db")

    // Create tables if they don't exist
    await createTables()

    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Failed to initialize database:", error)
    throw error
  }
}

/**
 * Create database tables if they don't exist
 */
async function createTables(): Promise<void> {
  if (!db) throw new Error("Database not initialized")

  // Create tokens table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tokens (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      symbol TEXT NOT NULL,
      address TEXT UNIQUE NOT NULL,
      description TEXT,
      logo TEXT,
      price REAL,
      priceChange REAL,
      marketCap REAL,
      holders INTEGER,
      liquidity REAL,
      status TEXT NOT NULL DEFAULT 'paused',
      progress REAL NOT NULL DEFAULT 0,
      volumeTarget REAL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `)

  // Create bot_settings table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS bot_settings (
      id TEXT PRIMARY KEY,
      tokenId TEXT UNIQUE NOT NULL,
      minTradeAmount REAL NOT NULL,
      maxTradeAmount REAL NOT NULL,
      duration INTEGER NOT NULL,
      strategy TEXT NOT NULL,
      tradesPerMinute INTEGER NOT NULL,
      numberOfWallets INTEGER NOT NULL,
      useAntiMev INTEGER NOT NULL DEFAULT 0,
      tipAmount INTEGER NOT NULL DEFAULT 10000,
      priorityFees INTEGER NOT NULL DEFAULT 10000,
      slippage REAL NOT NULL DEFAULT 5,
      startTime TEXT,
      endTime TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (tokenId) REFERENCES tokens(id) ON DELETE CASCADE
    )
  `)

  // Create wallets table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS wallets (
      id TEXT PRIMARY KEY,
      address TEXT UNIQUE NOT NULL,
      privateKey TEXT,
      solBalance REAL NOT NULL DEFAULT 0,
      tokenBalance REAL NOT NULL DEFAULT 0,
      tradesCount INTEGER NOT NULL DEFAULT 0,
      lastTrade TEXT,
      isDevWallet INTEGER NOT NULL DEFAULT 0,
      isFundingWallet INTEGER NOT NULL DEFAULT 0,
      tokenId TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (tokenId) REFERENCES tokens(id) ON DELETE SET NULL
    )
  `)

  // Create transactions table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      tokenAmount REAL NOT NULL,
      price REAL NOT NULL,
      txHash TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      fee REAL,
      priorityFee INTEGER,
      walletId TEXT NOT NULL,
      tokenId TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      completedAt TEXT,
      FOREIGN KEY (walletId) REFERENCES wallets(id) ON DELETE CASCADE,
      FOREIGN KEY (tokenId) REFERENCES tokens(id) ON DELETE CASCADE
    )
  `)

  // Create licenses table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS licenses (
      id TEXT PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      isActive INTEGER NOT NULL DEFAULT 1,
      activatedAt TEXT,
      expiresAt TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `)

  // Create system_settings table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS system_settings (
      id TEXT PRIMARY KEY,
      antiBubblemap INTEGER NOT NULL DEFAULT 0,
      defaultPriorityFee REAL NOT NULL DEFAULT 1.5,
      updatedAt TEXT NOT NULL
    )
  `)

  // Create indexes for better performance
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_wallets_tokenId ON wallets(tokenId)`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_transactions_walletId ON transactions(walletId)`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_transactions_tokenId ON transactions(tokenId)`)
}

// Helper function to get current ISO timestamp
function getCurrentTimestamp(): string {
  return new Date().toISOString()
}

/**
 * Token CRUD operations
 */
export const TokenService = {
  async getAll(): Promise<Token[]> {
    if (!db) throw new Error("Database not initialized")

    const result = await db.select<Token[]>("SELECT * FROM tokens ORDER BY updatedAt DESC")
    return result
  },

  async getById(id: string): Promise<Token | null> {
    if (!db) throw new Error("Database not initialized")

    const result = await db.select<Token[]>("SELECT * FROM tokens WHERE id = ?", [id])
    return result.length > 0 ? result[0] : null
  },

  async getByAddress(address: string): Promise<Token | null> {
    if (!db) throw new Error("Database not initialized")

    const result = await db.select<Token[]>("SELECT * FROM tokens WHERE address = ?", [address])
    return result.length > 0 ? result[0] : null
  },

  async create(token: Omit<Token, "id" | "createdAt" | "updatedAt">): Promise<Token> {
    if (!db) throw new Error("Database not initialized")

    const now = getCurrentTimestamp()
    const id = uuidv4()

    await db.execute(
      `INSERT INTO tokens (
        id, name, symbol, address, description, logo, price, priceChange, 
        marketCap, holders, liquidity, status, progress, volumeTarget, 
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        token.name,
        token.symbol,
        token.address,
        token.description || null,
        token.logo || null,
        token.price || null,
        token.priceChange || null,
        token.marketCap || null,
        token.holders || null,
        token.liquidity || null,
        token.status,
        token.progress,
        token.volumeTarget || null,
        now,
        now,
      ],
    )

    return {
      ...token,
      id,
      createdAt: now,
      updatedAt: now,
    } as Token
  },

  async update(id: string, token: Partial<Token>): Promise<void> {
    if (!db) throw new Error("Database not initialized")

    const now = getCurrentTimestamp()
    const currentToken = await this.getById(id)

    if (!currentToken) {
      throw new Error(`Token with id ${id} not found`)
    }

    // Build update query dynamically based on provided fields
    const updateFields: string[] = []
    const values: any[] = []

    Object.entries(token).forEach(([key, value]) => {
      if (key !== "id" && key !== "createdAt" && key !== "updatedAt") {
        updateFields.push(`${key} = ?`)
        values.push(value)
      }
    })

    updateFields.push("updatedAt = ?")
    values.push(now)
    values.push(id)

    await db.execute(`UPDATE tokens SET ${updateFields.join(", ")} WHERE id = ?`, values)
  },

  async delete(id: string): Promise<void> {
    if (!db) throw new Error("Database not initialized")

    await db.execute("DELETE FROM tokens WHERE id = ?", [id])
  },
}

/**
 * BotSettings CRUD operations
 */
export const BotSettingsService = {
  async getByTokenId(tokenId: string): Promise<BotSettings | null> {
    if (!db) throw new Error("Database not initialized")

    const result = await db.select<BotSettings[]>("SELECT * FROM bot_settings WHERE tokenId = ?", [tokenId])

    return result.length > 0 ? result[0] : null
  },

  async create(settings: Omit<BotSettings, "id" | "createdAt" | "updatedAt">): Promise<BotSettings> {
    if (!db) throw new Error("Database not initialized")

    const now = getCurrentTimestamp()
    const id = uuidv4()

    await db.execute(
      `INSERT INTO bot_settings (
        id, tokenId, minTradeAmount, maxTradeAmount, duration, strategy,
        tradesPerMinute, numberOfWallets, useAntiMev, tipAmount, priorityFees,
        slippage, startTime, endTime, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        settings.tokenId,
        settings.minTradeAmount,
        settings.maxTradeAmount,
        settings.duration,
        settings.strategy,
        settings.tradesPerMinute,
        settings.numberOfWallets,
        settings.useAntiMev ? 1 : 0,
        settings.tipAmount,
        settings.priorityFees,
        settings.slippage,
        settings.startTime || null,
        settings.endTime || null,
        now,
        now,
      ],
    )

    return {
      ...settings,
      id,
      createdAt: now,
      updatedAt: now,
    } as BotSettings
  },

  async update(id: string, settings: Partial<BotSettings>): Promise<void> {
    if (!db) throw new Error("Database not initialized")

    const now = getCurrentTimestamp()

    // Build update query dynamically based on provided fields
    const updateFields: string[] = []
    const values: any[] = []

    Object.entries(settings).forEach(([key, value]) => {
      if (key !== "id" && key !== "createdAt" && key !== "updatedAt") {
        if (key === "useAntiMev") {
          updateFields.push(`${key} = ?`)
          values.push(value ? 1 : 0)
        } else {
          updateFields.push(`${key} = ?`)
          values.push(value)
        }
      }
    })

    updateFields.push("updatedAt = ?")
    values.push(now)
    values.push(id)

    await db.execute(`UPDATE bot_settings SET ${updateFields.join(", ")} WHERE id = ?`, values)
  },

  async delete(id: string): Promise<void> {
    if (!db) throw new Error("Database not initialized")

    await db.execute("DELETE FROM bot_settings WHERE id = ?", [id])
  },
}

/**
 * Wallet CRUD operations
 */
export const WalletService = {
  async getAll(): Promise<Wallet[]> {
    if (!db) throw new Error("Database not initialized")

    const result = await db.select<Wallet[]>("SELECT * FROM wallets ORDER BY updatedAt DESC")

    // Decrypt private keys if they exist
    return result.map((wallet) => {
      if (wallet.privateKey) {
        try {
          wallet.privateKey = decrypt(wallet.privateKey)
        } catch (error) {
          console.error("Failed to decrypt wallet private key:", error)
          wallet.privateKey = undefined
        }
      }
      return wallet
    })
  },

  async getById(id: string): Promise<Wallet | null> {
    if (!db) throw new Error("Database not initialized")

    const result = await db.select<Wallet[]>("SELECT * FROM wallets WHERE id = ?", [id])

    if (result.length === 0) return null

    const wallet = result[0]

    // Decrypt private key if it exists
    if (wallet.privateKey) {
      try {
        wallet.privateKey = decrypt(wallet.privateKey)
      } catch (error) {
        console.error("Failed to decrypt wallet private key:", error)
        wallet.privateKey = undefined
      }
    }

    return wallet
  },

  async getByAddress(address: string): Promise<Wallet | null> {
    if (!db) throw new Error("Database not initialized")

    const result = await db.select<Wallet[]>("SELECT * FROM wallets WHERE address = ?", [address])

    if (result.length === 0) return null

    const wallet = result[0]

    // Decrypt private key if it exists
    if (wallet.privateKey) {
      try {
        wallet.privateKey = decrypt(wallet.privateKey)
      } catch (error) {
        console.error("Failed to decrypt wallet private key:", error)
        wallet.privateKey = undefined
      }
    }

    return wallet
  },

  async getByTokenId(tokenId: string): Promise<Wallet[]> {
    if (!db) throw new Error("Database not initialized")

    const result = await db.select<Wallet[]>("SELECT * FROM wallets WHERE tokenId = ? ORDER BY updatedAt DESC", [
      tokenId,
    ])

    // Decrypt private keys if they exist
    return result.map((wallet) => {
      if (wallet.privateKey) {
        try {
          wallet.privateKey = decrypt(wallet.privateKey)
        } catch (error) {
          console.error("Failed to decrypt wallet private key:", error)
          wallet.privateKey = undefined
        }
      }
      return wallet
    })
  },

  async create(wallet: Omit<Wallet, "id" | "createdAt" | "updatedAt">): Promise<Wallet> {
    if (!db) throw new Error("Database not initialized")

    const now = getCurrentTimestamp()
    const id = uuidv4()

    // Encrypt private key if it exists
    let encryptedPrivateKey = null
    if (wallet.privateKey) {
      encryptedPrivateKey = encrypt(wallet.privateKey)
    }

    await db.execute(
      `INSERT INTO wallets (
        id, address, privateKey, solBalance, tokenBalance, tradesCount,
        lastTrade, isDevWallet, isFundingWallet, tokenId, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        wallet.address,
        encryptedPrivateKey,
        wallet.solBalance,
        wallet.tokenBalance,
        wallet.tradesCount,
        wallet.lastTrade || null,
        wallet.isDevWallet ? 1 : 0,
        wallet.isFundingWallet ? 1 : 0,
        wallet.tokenId || null,
        now,
        now,
      ],
    )

    return {
      ...wallet,
      id,
      createdAt: now,
      updatedAt: now,
    } as Wallet
  },

  async update(id: string, wallet: Partial<Wallet>): Promise<void> {
    if (!db) throw new Error("Database not initialized")

    const now = getCurrentTimestamp()

    // Build update query dynamically based on provided fields
    const updateFields: string[] = []
    const values: any[] = []

    Object.entries(wallet).forEach(([key, value]) => {
      if (key !== "id" && key !== "createdAt" && key !== "updatedAt") {
        if (key === "privateKey" && value) {
          updateFields.push(`${key} = ?`)
          values.push(encrypt(value))
        } else if (key === "isDevWallet" || key === "isFundingWallet") {
          updateFields.push(`${key} = ?`)
          values.push(value ? 1 : 0)
        } else {
          updateFields.push(`${key} = ?`)
          values.push(value)
        }
      }
    })

    updateFields.push("updatedAt = ?")
    values.push(now)
    values.push(id)

    await db.execute(`UPDATE wallets SET ${updateFields.join(", ")} WHERE id = ?`, values)
  },

  async delete(id: string): Promise<void> {
    if (!db) throw new Error("Database not initialized")

    await db.execute("DELETE FROM wallets WHERE id = ?", [id])
  },

  async deleteByTokenId(tokenId: string): Promise<void> {
    if (!db) throw new Error("Database not initialized")

    await db.execute("DELETE FROM wallets WHERE tokenId = ?", [tokenId])
  },
}

/**
 * Transaction CRUD operations
 */
export const TransactionService = {
  async getAll(): Promise<Transaction[]> {
    if (!db) throw new Error("Database not initialized")

    const result = await db.select<Transaction[]>("SELECT * FROM transactions ORDER BY createdAt DESC")

    return result
  },

  async getById(id: string): Promise<Transaction | null> {
    if (!db) throw new Error("Database not initialized")

    const result = await db.select<Transaction[]>("SELECT * FROM transactions WHERE id = ?", [id])

    return result.length > 0 ? result[0] : null
  },

  async getByWalletId(walletId: string): Promise<Transaction[]> {
    if (!db) throw new Error("Database not initialized")

    const result = await db.select<Transaction[]>(
      "SELECT * FROM transactions WHERE walletId = ? ORDER BY createdAt DESC",
      [walletId],
    )

    return result
  },

  async getByTokenId(tokenId: string): Promise<Transaction[]> {
    if (!db) throw new Error("Database not initialized")

    const result = await db.select<Transaction[]>(
      "SELECT * FROM transactions WHERE tokenId = ? ORDER BY createdAt DESC",
      [tokenId],
    )

    return result
  },

  async create(transaction: Omit<Transaction, "id" | "createdAt">): Promise<Transaction> {
    if (!db) throw new Error("Database not initialized")

    const now = getCurrentTimestamp()
    const id = uuidv4()

    await db.execute(
      `INSERT INTO transactions (
        id, type, amount, tokenAmount, price, txHash, status, fee,
        priorityFee, walletId, tokenId, createdAt, completedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        transaction.type,
        transaction.amount,
        transaction.tokenAmount,
        transaction.price,
        transaction.txHash || null,
        transaction.status,
        transaction.fee || null,
        transaction.priorityFee || null,
        transaction.walletId,
        transaction.tokenId,
        now,
        transaction.completedAt || null,
      ],
    )

    return {
      ...transaction,
      id,
      createdAt: now,
    } as Transaction
  },

  async update(id: string, transaction: Partial<Transaction>): Promise<void> {
    if (!db) throw new Error("Database not initialized")

    // Build update query dynamically based on provided fields
    const updateFields: string[] = []
    const values: any[] = []

    Object.entries(transaction).forEach(([key, value]) => {
      if (key !== "id" && key !== "createdAt") {
        updateFields.push(`${key} = ?`)
        values.push(value)
      }
    })

    values.push(id)

    await db.execute(`UPDATE transactions SET ${updateFields.join(", ")} WHERE id = ?`, values)
  },

  async delete(id: string): Promise<void> {
    if (!db) throw new Error("Database not initialized")

    await db.execute("DELETE FROM transactions WHERE id = ?", [id])
  },

  async deleteByWalletId(walletId: string): Promise<void> {
    if (!db) throw new Error("Database not initialized")

    await db.execute("DELETE FROM transactions WHERE walletId = ?", [walletId])
  },

  async deleteByTokenId(tokenId: string): Promise<void> {
    if (!db) throw new Error("Database not initialized")

    await db.execute("DELETE FROM transactions WHERE tokenId = ?", [tokenId])
  },
}

/**
 * License CRUD operations
 */
export const LicenseService = {
  async getAll(): Promise<License[]> {
    if (!db) throw new Error("Database not initialized")

    const result = await db.select<License[]>("SELECT * FROM licenses")
    return result
  },

  async getById(id: string): Promise<License | null> {
    if (!db) throw new Error("Database not initialized")

    const result = await db.select<License[]>("SELECT * FROM licenses WHERE id = ?", [id])
    return result.length > 0 ? result[0] : null
  },

  async getByKey(key: string): Promise<License | null> {
    if (!db) throw new Error("Database not initialized")

    const result = await db.select<License[]>("SELECT * FROM licenses WHERE key = ?", [key])
    return result.length > 0 ? result[0] : null
  },

  async create(license: Omit<License, "id" | "createdAt" | "updatedAt">): Promise<License> {
    if (!db) throw new Error("Database not initialized")

    const now = getCurrentTimestamp()
    const id = uuidv4()

    await db.execute(
      `INSERT INTO licenses (
        id, key, isActive, activatedAt, expiresAt, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, license.key, license.isActive ? 1 : 0, license.activatedAt || null, license.expiresAt || null, now, now],
    )

    return {
      ...license,
      id,
      createdAt: now,
      updatedAt: now,
    } as License
  },

  async update(id: string, license: Partial<License>): Promise<void> {
    if (!db) throw new Error("Database not initialized")

    const now = getCurrentTimestamp()

    // Build update query dynamically based on provided fields
    const updateFields: string[] = []
    const values: any[] = []

    Object.entries(license).forEach(([key, value]) => {
      if (key !== "id" && key !== "createdAt" && key !== "updatedAt") {
        if (key === "isActive") {
          updateFields.push(`${key} = ?`)
          values.push(value ? 1 : 0)
        } else {
          updateFields.push(`${key} = ?`)
          values.push(value)
        }
      }
    })

    updateFields.push("updatedAt = ?")
    values.push(now)
    values.push(id)

    await db.execute(`UPDATE licenses SET ${updateFields.join(", ")} WHERE id = ?`, values)
  },

  async delete(id: string): Promise<void> {
    if (!db) throw new Error("Database not initialized")

    await db.execute("DELETE FROM licenses WHERE id = ?", [id])
  },

  async validateLicense(key: string): Promise<boolean> {
    if (!db) throw new Error("Database not initialized")

    const license = await this.getByKey(key)

    if (!license) return false

    // Check if license is active
    if (!license.isActive) return false

    // Check if license has expired
    if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
      // Update license to inactive
      await this.update(license.id, { isActive: false })
      return false
    }

    // If license hasn't been activated yet, activate it now
    if (!license.activatedAt) {
      const now = getCurrentTimestamp()
      await this.update(license.id, { activatedAt: now })
    }

    return true
  },
}

/**
 * SystemSettings CRUD operations
 */
export const SystemSettingsService = {
  async get(): Promise<SystemSettings | null> {
    if (!db) throw new Error("Database not initialized")

    const result = await db.select<SystemSettings[]>("SELECT * FROM system_settings LIMIT 1")
    return result.length > 0 ? result[0] : null
  },

  async create(settings: Omit<SystemSettings, "id" | "updatedAt">): Promise<SystemSettings> {
    if (!db) throw new Error("Database not initialized")

    const now = getCurrentTimestamp()
    const id = uuidv4()

    await db.execute(
      `INSERT INTO system_settings (
        id, antiBubblemap, defaultPriorityFee, updatedAt
      ) VALUES (?, ?, ?, ?)`,
      [id, settings.antiBubblemap ? 1 : 0, settings.defaultPriorityFee, now],
    )

    return {
      ...settings,
      id,
      updatedAt: now,
    } as SystemSettings
  },

  async update(id: string, settings: Partial<SystemSettings>): Promise<void> {
    if (!db) throw new Error("Database not initialized")

    const now = getCurrentTimestamp()

    // Build update query dynamically based on provided fields
    const updateFields: string[] = []
    const values: any[] = []

    Object.entries(settings).forEach(([key, value]) => {
      if (key !== "id" && key !== "updatedAt") {
        if (key === "antiBubblemap") {
          updateFields.push(`${key} = ?`)
          values.push(value ? 1 : 0)
        } else {
          updateFields.push(`${key} = ?`)
          values.push(value)
        }
      }
    })

    updateFields.push("updatedAt = ?")
    values.push(now)
    values.push(id)

    await db.execute(`UPDATE system_settings SET ${updateFields.join(", ")} WHERE id = ?`, values)
  },

  async getOrCreate(): Promise<SystemSettings> {
    const settings = await this.get()

    if (settings) return settings

    // Create default settings
    return await this.create({
      antiBubblemap: false,
      defaultPriorityFee: 1.5,
    })
  },
}

/**
 * Database backup utility
 */
export async function backupDatabase(): Promise<string> {
  // In a Tauri app, we can use the Tauri API to create a backup
  // This is a simplified version that would need to be implemented with Tauri's fs API

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const backupPath = `bossbundler-backup-${timestamp}.db`

  // In a real implementation, you would use Tauri's fs API to copy the database file
  console.log(`Database backup created at: ${backupPath}`)

  // This is a placeholder for the actual backup implementation
  // In a real Tauri app, you would use something like:
  // await invoke('create_backup', { sourcePath: 'bossbundler.db', targetPath: backupPath });

  return backupPath
}

/**
 * Initialize the database with seed data
 */
export async function seedDatabase(): Promise<void> {
  if (!db) throw new Error("Database not initialized")

  // Check if we already have data
  const tokens = await TokenService.getAll()
  if (tokens.length > 0) {
    console.log("Database already seeded, skipping...")
    return
  }

  console.log("Seeding database with initial data...")

  // Create a license
  const license = await LicenseService.create({
    key: "FONEI-YZTWR-JWKAA-MUSPT",
    isActive: true,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  })

  console.log("Created license:", license)

  // Create system settings
  const settings = await SystemSettingsService.create({
    antiBubblemap: false,
    defaultPriorityFee: 1.5,
  })

  console.log("Created system settings:", settings)

  // Create sample tokens
  const token1 = await TokenService.create({
    name: "Pepe Token",
    symbol: "PEPE",
    address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    logo: "/stylized-green-frog.png",
    price: 0.00000123,
    priceChange: 5.2,
    status: "active",
    progress: 68,
    volumeTarget: 50000,
  })

  const token2 = await TokenService.create({
    name: "Doge Token",
    symbol: "DOGE",
    address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    logo: "/doge-meme.png",
    price: 0.00000456,
    priceChange: -2.1,
    status: "paused",
    progress: 42,
    volumeTarget: 25000,
  })

  console.log("Created tokens:", token1, token2)

  // Create bot settings for tokens
  await BotSettingsService.create({
    tokenId: token1.id,
    minTradeAmount: 0.01,
    maxTradeAmount: 0.05,
    duration: 24,
    strategy: "bump",
    tradesPerMinute: 16,
    numberOfWallets: 20,
    useAntiMev: false,
    tipAmount: 10000,
    priorityFees: 10000,
    slippage: 5,
  })

  await BotSettingsService.create({
    tokenId: token2.id,
    minTradeAmount: 0.02,
    maxTradeAmount: 0.08,
    duration: 12,
    strategy: "turbo",
    tradesPerMinute: 4,
    numberOfWallets: 15,
    useAntiMev: true,
    tipAmount: 15000,
    priorityFees: 12000,
    slippage: 3,
  })

  // Create sample wallets for each token
  for (let i = 0; i < 20; i++) {
    await WalletService.create({
      address: `${i}xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosg${i}sU`.substring(0, 44),
      privateKey: `sample_private_key_${i}`,
      solBalance: Math.floor(Math.random() * 100) / 100,
      tokenBalance: Math.floor(Math.random() * 10000) / 100,
      tradesCount: Math.floor(Math.random() * 50),
      lastTrade: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
      isDevWallet: i === 0,
      isFundingWallet: i === 1,
      tokenId: token1.id,
    })
  }

  for (let i = 0; i < 15; i++) {
    await WalletService.create({
      address: `${i}xDOGE2CW87d97TXJSDpbD5jBkheTqA83TZRuJosg${i}sU`.substring(0, 44),
      privateKey: `doge_private_key_${i}`,
      solBalance: Math.floor(Math.random() * 100) / 100,
      tokenBalance: Math.floor(Math.random() * 10000) / 100,
      tradesCount: Math.floor(Math.random() * 50),
      lastTrade: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
      isDevWallet: false,
      isFundingWallet: false,
      tokenId: token2.id,
    })
  }

  console.log("Database seeded successfully")
}
