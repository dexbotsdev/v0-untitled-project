import type {
  Wallet,
  WalletGenerationRequest,
  WalletFundingRequest,
  WalletImportRequest,
  WalletTaggingRequest,
  WalletRecoveryRequest,
  WalletDeletionRequest,
  WsolConversionRequest,
} from "../types/wallet"
import storageService from "./storage.service"
import logger from "../utils/logger"
import { BadRequestError, NotFoundError } from "../utils/errors"

// Helper function to generate a random Solana-like address
function generateRandomAddress(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Helper function to generate a random private key (for mock purposes)
function generateRandomPrivateKey(): string {
  const chars = "0123456789abcdef"
  let result = ""
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Helper function to generate a random transaction hash
function generateRandomTxHash(): string {
  const chars = "0123456789abcdef"
  let result = ""
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Helper function to validate a Solana address format
function isValidSolanaAddress(address: string): boolean {
  // This is a simplified validation - in a real app, you'd use a proper Solana library
  return /^[A-Za-z0-9]{32,44}$/.test(address)
}

export class WalletService {
  /**
   * Generate wallets for a bot
   */
  generateWallets(data: WalletGenerationRequest) {
    // Validate request
    if (!data.botId || !data.count || data.count <= 0) {
      throw new BadRequestError("Invalid request. botId and count are required.")
    }

    // Check if bot exists
    const bot = storageService.getBotOrThrow(data.botId)

    // Generate wallets
    const wallets: Wallet[] = []
    const walletAddresses: string[] = []

    for (let i = 0; i < data.count; i++) {
      const walletId = `wallet-${Date.now()}-${i}`
      const address = generateRandomAddress()
      const privateKey = generateRandomPrivateKey()

      const wallet: Wallet = {
        id: walletId,
        address,
        privateKey,
        botId: data.botId,
        solBalance: 0,
        tokenBalance: 0,
        tags: [],
        createdAt: new Date(),
      }

      wallets.push(wallet)
      walletAddresses.push(address)
    }

    // Save wallets to storage
    storageService.createWallets(wallets)

    logger.info(`Generated ${data.count} wallets for bot ${data.botId}`)

    return {
      success: true,
      wallets: walletAddresses,
      message: `Successfully generated ${data.count} wallets for bot ${data.botId}.`,
    }
  }

  /**
   * Fund wallets with SOL
   */
  fundWallets(data: WalletFundingRequest) {
    // Validate request
    if (!data.botId || !data.walletAddresses || data.walletAddresses.length === 0) {
      throw new BadRequestError("Invalid request. botId and walletAddresses are required.")
    }

    if (data.fundingType === "fixed" && (data.fixedAmount === undefined || data.fixedAmount <= 0)) {
      throw new BadRequestError("Invalid request. fixedAmount is required for fixed funding type.")
    }

    if (
      data.fundingType === "range" &&
      (data.minAmount === undefined ||
        data.minAmount <= 0 ||
        data.maxAmount === undefined ||
        data.maxAmount <= 0 ||
        data.minAmount >= data.maxAmount)
    ) {
      throw new BadRequestError("Invalid request. minAmount and maxAmount are required for range funding type.")
    }

    // Check if bot exists
    const bot = storageService.getBotOrThrow(data.botId)

    // Get wallets by addresses
    const wallets = storageService.getWalletsByBotIdAndAddresses(data.botId, data.walletAddresses)

    if (wallets.length === 0) {
      throw new NotFoundError("No matching wallets found for the provided addresses.")
    }

    // Fund wallets
    const transactions: string[] = []
    let totalFunded = 0

    for (const wallet of wallets) {
      let fundAmount: number

      if (data.fundingType === "fixed") {
        fundAmount = data.fixedAmount!
      } else {
        // Random amount between min and max
        fundAmount = data.minAmount! + Math.random() * (data.maxAmount! - data.minAmount!)
        // Round to 4 decimal places
        fundAmount = Math.round(fundAmount * 10000) / 10000
      }

      // Update wallet balance
      storageService.updateWallet(wallet.id, {
        solBalance: wallet.solBalance + fundAmount,
        lastUsed: new Date(),
      })

      // Generate a mock transaction hash
      const txHash = generateRandomTxHash()
      transactions.push(txHash)

      totalFunded += fundAmount
    }

    logger.info(`Funded ${wallets.length} wallets with a total of ${totalFunded.toFixed(4)} SOL`)

    return {
      success: true,
      transactions,
      totalFunded,
      message: `Successfully funded ${wallets.length} wallets with a total of ${totalFunded.toFixed(4)} SOL.`,
    }
  }

  /**
   * Import existing wallets
   */
  importWallets(data: WalletImportRequest) {
    // Validate request
    if (!data.botId || !data.walletAddresses || data.walletAddresses.length === 0) {
      throw new BadRequestError("Invalid request. botId and walletAddresses are required.")
    }

    // Check if bot exists
    const bot = storageService.getBotOrThrow(data.botId)

    // Import wallets
    const wallets: Wallet[] = []
    let imported = 0
    let invalid = 0

    for (const address of data.walletAddresses) {
      // Validate address format
      if (!isValidSolanaAddress(address)) {
        invalid++
        continue
      }

      // Check if wallet already exists
      const existingWallet = storageService.getWalletByAddress(address)
      if (existingWallet) {
        // If wallet exists but belongs to a different bot, skip it
        if (existingWallet.botId !== data.botId) {
          invalid++
          continue
        }
        // If wallet already belongs to this bot, count it as imported
        imported++
        continue
      }

      // Create new wallet
      const walletId = `wallet-${Date.now()}-${imported}`
      const privateKey = generateRandomPrivateKey()

      const wallet: Wallet = {
        id: walletId,
        address,
        privateKey,
        botId: data.botId,
        solBalance: 0,
        tokenBalance: 0,
        tags: [],
        createdAt: new Date(),
      }

      wallets.push(wallet)
      imported++
    }

    // Save wallets to storage
    if (wallets.length > 0) {
      storageService.createWallets(wallets)
    }

    logger.info(`Imported ${imported} wallets, ${invalid} addresses were invalid or already in use`)

    return {
      success: true,
      imported,
      invalid,
      message: `Successfully imported ${imported} wallets. ${invalid} addresses were invalid or already in use.`,
    }
  }

  /**
   * Tag wallets
   */
  tagWallets(data: WalletTaggingRequest) {
    // Validate request
    if (!data.botId || !data.walletAddresses || data.walletAddresses.length === 0 || !data.tag) {
      throw new BadRequestError("Invalid request. botId, walletAddresses, and tag are required.")
    }

    // Check if bot exists
    const bot = storageService.getBotOrThrow(data.botId)

    // Get wallets by addresses
    const wallets = storageService.getWalletsByBotIdAndAddresses(data.botId, data.walletAddresses)

    if (wallets.length === 0) {
      throw new NotFoundError("No matching wallets found for the provided addresses.")
    }

    // Tag wallets
    let tagged = 0

    for (const wallet of wallets) {
      // Add tag if it doesn't already exist
      if (!wallet.tags.includes(data.tag)) {
        const updatedTags = [...wallet.tags, data.tag]
        storageService.updateWallet(wallet.id, { tags: updatedTags })
        tagged++
      }
    }

    logger.info(`Tagged ${tagged} wallets with "${data.tag}"`)

    return {
      success: true,
      tagged,
      message: `Successfully tagged ${tagged} wallets with "${data.tag}".`,
    }
  }

  /**
   * Recover funds from wallets
   */
  recoverFunds(data: WalletRecoveryRequest) {
    // Validate request
    if (!data.botId || !data.destinationWallet) {
      throw new BadRequestError("Invalid request. botId and destinationWallet are required.")
    }

    // Check if bot exists
    const bot = storageService.getBotOrThrow(data.botId)

    // Get all wallets for this bot
    const wallets = storageService.getWalletsByBotId(data.botId)

    if (wallets.length === 0) {
      throw new NotFoundError(`No wallets found for bot ${data.botId}.`)
    }

    // Recover funds
    let recovered = 0
    let totalAmount = 0
    const transactions: string[] = []

    for (const wallet of wallets) {
      if (wallet.solBalance > 0) {
        // Generate a mock transaction hash
        const txHash = generateRandomTxHash()
        transactions.push(txHash)

        totalAmount += wallet.solBalance
        recovered++

        // Update wallet balance
        storageService.updateWallet(wallet.id, {
          solBalance: 0,
          lastUsed: new Date(),
        })
      }
    }

    logger.info(`Recovered ${totalAmount.toFixed(4)} SOL from ${recovered} wallets`)

    return {
      success: true,
      recovered,
      totalAmount,
      transactions,
      message: `Successfully recovered ${totalAmount.toFixed(4)} SOL from ${recovered} wallets.`,
    }
  }

  /**
   * Delete wallets
   */
  deleteWallets(data: WalletDeletionRequest) {
    // Validate request
    if (!data.botId || !data.walletAddresses || data.walletAddresses.length === 0) {
      throw new BadRequestError("Invalid request. botId and walletAddresses are required.")
    }

    // Check if bot exists
    const bot = storageService.getBotOrThrow(data.botId)

    // Get wallets by addresses
    const wallets = storageService.getWalletsByBotIdAndAddresses(data.botId, data.walletAddresses)

    if (wallets.length === 0) {
      throw new NotFoundError("No matching wallets found for the provided addresses.")
    }

    // Delete wallets
    let deleted = 0

    for (const wallet of wallets) {
      if (storageService.deleteWallet(wallet.id)) {
        deleted++
      }
    }

    logger.info(`Deleted ${deleted} wallets`)

    return {
      success: true,
      deleted,
      message: `Successfully deleted ${deleted} wallets.`,
    }
  }

  /**
   * Convert WSOL to SOL
   */
  convertWsol(data: WsolConversionRequest) {
    // Validate request
    if (!data.botId || !data.walletAddresses || data.walletAddresses.length === 0) {
      throw new BadRequestError("Invalid request. botId and walletAddresses are required.")
    }

    // Check if bot exists
    const bot = storageService.getBotOrThrow(data.botId)

    // Get wallets by addresses
    const wallets = storageService.getWalletsByBotIdAndAddresses(data.botId, data.walletAddresses)

    if (wallets.length === 0) {
      throw new NotFoundError("No matching wallets found for the provided addresses.")
    }

    // Convert WSOL to SOL (mock operation)
    let converted = 0
    let totalAmount = 0
    const transactions: string[] = []

    for (const wallet of wallets) {
      // In a real implementation, you would check if the wallet has WSOL tokens
      // For this mock, we'll assume all wallets have some WSOL to convert
      const wsolAmount = Math.random() * 0.1 // Random amount between 0 and 0.1

      // Generate a mock transaction hash
      const txHash = generateRandomTxHash()
      transactions.push(txHash)

      totalAmount += wsolAmount
      converted++

      // Update wallet balance - add the converted amount to SOL balance
      storageService.updateWallet(wallet.id, {
        solBalance: wallet.solBalance + wsolAmount,
        lastUsed: new Date(),
      })
    }

    logger.info(`Converted WSOL to SOL for ${converted} wallets, total amount: ${totalAmount.toFixed(4)} SOL`)

    return {
      success: true,
      converted,
      totalAmount,
      transactions,
      message: `Successfully converted WSOL to SOL for ${converted} wallets, total amount: ${totalAmount.toFixed(4)} SOL.`,
    }
  }
}

// Create a singleton instance
export const walletService = new WalletService()

export default walletService
