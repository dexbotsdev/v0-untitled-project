import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import type {
  WalletGenerationRequest,
  WalletGenerationResponse,
  WalletFundingRequest,
  WalletFundingResponse,
  WalletImportRequest,
  WalletImportResponse,
  WalletTaggingRequest,
  WalletTaggingResponse,
  WalletRecoveryRequest,
  WalletRecoveryResponse,
  WalletDeletionRequest,
  WalletDeletionResponse,
  WsolConversionRequest,
  WsolConversionResponse,
  Wallet,
  RouteOptions,
} from "../types"
import storage from "../utils/storage"
import EncryptionService from "../utils/encryption"

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

export default async function walletRoutes(fastify: FastifyInstance, options: RouteOptions): Promise<void> {
  const encryptionService = new EncryptionService(options.encryptionKey)

  // Generate wallets for a bot
  fastify.post<{ Body: string | WalletGenerationRequest }>(
    "/wallets/generate",
    async (request: FastifyRequest<{ Body: string | WalletGenerationRequest }>, reply: FastifyReply) => {
      try {
        const data = encryptionService.processRequestData<WalletGenerationRequest>(request.body)

        // Validate request
        if (!data.botId || !data.count || data.count <= 0) {
          return reply.code(400).send(
            encryptionService.processResponseData({
              success: false,
              message: "Invalid request. botId and count are required.",
            }),
          )
        }

        // Check if bot exists
        const bot = storage.getBot(data.botId)
        if (!bot) {
          return reply.code(404).send(
            encryptionService.processResponseData({
              success: false,
              message: `Bot with ID ${data.botId} not found.`,
            }),
          )
        }

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
        storage.createWallets(wallets)

        // Return success response
        const response: WalletGenerationResponse = {
          success: true,
          wallets: walletAddresses,
          message: `Successfully generated ${data.count} wallets for bot ${data.botId}.`,
        }

        return reply.code(200).send(encryptionService.processResponseData(response))
      } catch (error) {
        console.error("Error generating wallets:", error)
        return reply.code(500).send(
          encryptionService.processResponseData({
            success: false,
            message: "Failed to generate wallets.",
          }),
        )
      }
    },
  )

  // Fund wallets with SOL
  fastify.post<{ Body: string | WalletFundingRequest }>(
    "/wallets/fund",
    async (request: FastifyRequest<{ Body: string | WalletFundingRequest }>, reply: FastifyReply) => {
      try {
        const data = encryptionService.processRequestData<WalletFundingRequest>(request.body)

        // Validate request
        if (!data.botId || !data.walletAddresses || data.walletAddresses.length === 0) {
          return reply.code(400).send(
            encryptionService.processResponseData({
              success: false,
              message: "Invalid request. botId and walletAddresses are required.",
            }),
          )
        }

        if (data.fundingType === "fixed" && (data.fixedAmount === undefined || data.fixedAmount <= 0)) {
          return reply.code(400).send(
            encryptionService.processResponseData({
              success: false,
              message: "Invalid request. fixedAmount is required for fixed funding type.",
            }),
          )
        }

        if (
          data.fundingType === "range" &&
          (data.minAmount === undefined ||
            data.minAmount <= 0 ||
            data.maxAmount === undefined ||
            data.maxAmount <= 0 ||
            data.minAmount >= data.maxAmount)
        ) {
          return reply.code(400).send(
            encryptionService.processResponseData({
              success: false,
              message: "Invalid request. minAmount and maxAmount are required for range funding type.",
            }),
          )
        }

        // Check if bot exists
        const bot = storage.getBot(data.botId)
        if (!bot) {
          return reply.code(404).send(
            encryptionService.processResponseData({
              success: false,
              message: `Bot with ID ${data.botId} not found.`,
            }),
          )
        }

        // Get wallets by addresses
        const wallets = storage
          .getWallets()
          .filter((wallet) => data.walletAddresses.includes(wallet.address) && wallet.botId === data.botId)

        if (wallets.length === 0) {
          return reply.code(404).send(
            encryptionService.processResponseData({
              success: false,
              message: "No matching wallets found for the provided addresses.",
            }),
          )
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
          storage.updateWallet(wallet.id, {
            solBalance: wallet.solBalance + fundAmount,
            lastUsed: new Date(),
          })

          // Generate a mock transaction hash
          const txHash = generateRandomTxHash()
          transactions.push(txHash)

          totalFunded += fundAmount
        }

        // Return success response
        const response: WalletFundingResponse = {
          success: true,
          transactions,
          totalFunded,
          message: `Successfully funded ${wallets.length} wallets with a total of ${totalFunded.toFixed(4)} SOL.`,
        }

        return reply.code(200).send(encryptionService.processResponseData(response))
      } catch (error) {
        console.error("Error funding wallets:", error)
        return reply.code(500).send(
          encryptionService.processResponseData({
            success: false,
            message: "Failed to fund wallets.",
          }),
        )
      }
    },
  )

  // Import existing wallets
  fastify.post<{ Body: string | WalletImportRequest }>(
    "/wallets/import",
    async (request: FastifyRequest<{ Body: string | WalletImportRequest }>, reply: FastifyReply) => {
      try {
        const data = encryptionService.processRequestData<WalletImportRequest>(request.body)

        // Validate request
        if (!data.botId || !data.walletAddresses || data.walletAddresses.length === 0) {
          return reply.code(400).send(
            encryptionService.processResponseData({
              success: false,
              message: "Invalid request. botId and walletAddresses are required.",
            }),
          )
        }

        // Check if bot exists
        const bot = storage.getBot(data.botId)
        if (!bot) {
          return reply.code(404).send(
            encryptionService.processResponseData({
              success: false,
              message: `Bot with ID ${data.botId} not found.`,
            }),
          )
        }

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
          const existingWallet = storage.getWalletByAddress(address)
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
          storage.createWallets(wallets)
        }

        // Return success response
        const response: WalletImportResponse = {
          success: true,
          imported,
          invalid,
          message: `Successfully imported ${imported} wallets. ${invalid} addresses were invalid or already in use.`,
        }

        return reply.code(200).send(encryptionService.processResponseData(response))
      } catch (error) {
        console.error("Error importing wallets:", error)
        return reply.code(500).send(
          encryptionService.processResponseData({
            success: false,
            message: "Failed to import wallets.",
          }),
        )
      }
    },
  )

  // Tag wallets
  fastify.post<{ Body: string | WalletTaggingRequest }>(
    "/wallets/tag",
    async (request: FastifyRequest<{ Body: string | WalletTaggingRequest }>, reply: FastifyReply) => {
      try {
        const data = encryptionService.processRequestData<WalletTaggingRequest>(request.body)

        // Validate request
        if (!data.botId || !data.walletAddresses || data.walletAddresses.length === 0 || !data.tag) {
          return reply.code(400).send(
            encryptionService.processResponseData({
              success: false,
              message: "Invalid request. botId, walletAddresses, and tag are required.",
            }),
          )
        }

        // Check if bot exists
        const bot = storage.getBot(data.botId)
        if (!bot) {
          return reply.code(404).send(
            encryptionService.processResponseData({
              success: false,
              message: `Bot with ID ${data.botId} not found.`,
            }),
          )
        }

        // Get wallets by addresses
        const wallets = storage
          .getWallets()
          .filter((wallet) => data.walletAddresses.includes(wallet.address) && wallet.botId === data.botId)

        if (wallets.length === 0) {
          return reply.code(404).send(
            encryptionService.processResponseData({
              success: false,
              message: "No matching wallets found for the provided addresses.",
            }),
          )
        }

        // Tag wallets
        let tagged = 0

        for (const wallet of wallets) {
          // Add tag if it doesn't already exist
          if (!wallet.tags.includes(data.tag)) {
            const updatedTags = [...wallet.tags, data.tag]
            storage.updateWallet(wallet.id, { tags: updatedTags })
            tagged++
          }
        }

        // Return success response
        const response: WalletTaggingResponse = {
          success: true,
          tagged,
          message: `Successfully tagged ${tagged} wallets with "${data.tag}".`,
        }

        return reply.code(200).send(encryptionService.processResponseData(response))
      } catch (error) {
        console.error("Error tagging wallets:", error)
        return reply.code(500).send(
          encryptionService.processResponseData({
            success: false,
            message: "Failed to tag wallets.",
          }),
        )
      }
    },
  )

  // Recover funds from wallets
  fastify.post<{ Body: string | WalletRecoveryRequest }>(
    "/wallets/recover",
    async (request: FastifyRequest<{ Body: string | WalletRecoveryRequest }>, reply: FastifyReply) => {
      try {
        const data = encryptionService.processRequestData<WalletRecoveryRequest>(request.body)

        // Validate request
        if (!data.botId || !data.destinationWallet) {
          return reply.code(400).send(
            encryptionService.processResponseData({
              success: false,
              message: "Invalid request. botId and destinationWallet are required.",
            }),
          )
        }

        // Check if bot exists
        const bot = storage.getBot(data.botId)
        if (!bot) {
          return reply.code(404).send(
            encryptionService.processResponseData({
              success: false,
              message: `Bot with ID ${data.botId} not found.`,
            }),
          )
        }

        // Get all wallets for this bot
        const wallets = storage.getWalletsByBotId(data.botId)

        if (wallets.length === 0) {
          return reply.code(404).send(
            encryptionService.processResponseData({
              success: false,
              message: `No wallets found for bot ${data.botId}.`,
            }),
          )
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
            storage.updateWallet(wallet.id, {
              solBalance: 0,
              lastUsed: new Date(),
            })
          }
        }

        // Return success response
        const response: WalletRecoveryResponse = {
          success: true,
          recovered,
          totalAmount,
          transactions,
          message: `Successfully recovered ${totalAmount.toFixed(4)} SOL from ${recovered} wallets.`,
        }

        return reply.code(200).send(encryptionService.processResponseData(response))
      } catch (error) {
        console.error("Error recovering funds:", error)
        return reply.code(500).send(
          encryptionService.processResponseData({
            success: false,
            message: "Failed to recover funds.",
          }),
        )
      }
    },
  )

  // Delete wallets
  fastify.post<{ Body: string | WalletDeletionRequest }>(
    "/wallets/delete",
    async (request: FastifyRequest<{ Body: string | WalletDeletionRequest }>, reply: FastifyReply) => {
      try {
        const data = encryptionService.processRequestData<WalletDeletionRequest>(request.body)

        // Validate request
        if (!data.botId || !data.walletAddresses || data.walletAddresses.length === 0) {
          return reply.code(400).send(
            encryptionService.processResponseData({
              success: false,
              message: "Invalid request. botId and walletAddresses are required.",
            }),
          )
        }

        // Check if bot exists
        const bot = storage.getBot(data.botId)
        if (!bot) {
          return reply.code(404).send(
            encryptionService.processResponseData({
              success: false,
              message: `Bot with ID ${data.botId} not found.`,
            }),
          )
        }

        // Get wallets by addresses
        const wallets = storage
          .getWallets()
          .filter((wallet) => data.walletAddresses.includes(wallet.address) && wallet.botId === data.botId)

        if (wallets.length === 0) {
          return reply.code(404).send(
            encryptionService.processResponseData({
              success: false,
              message: "No matching wallets found for the provided addresses.",
            }),
          )
        }

        // Delete wallets
        let deleted = 0

        for (const wallet of wallets) {
          if (storage.deleteWallet(wallet.id)) {
            deleted++
          }
        }

        // Return success response
        const response: WalletDeletionResponse = {
          success: true,
          deleted,
          message: `Successfully deleted ${deleted} wallets.`,
        }

        return reply.code(200).send(encryptionService.processResponseData(response))
      } catch (error) {
        console.error("Error deleting wallets:", error)
        return reply.code(500).send(
          encryptionService.processResponseData({
            success: false,
            message: "Failed to delete wallets.",
          }),
        )
      }
    },
  )

  // Convert WSOL to SOL
  fastify.post<{ Body: string | WsolConversionRequest }>(
    "/wallets/convert-wsol",
    async (request: FastifyRequest<{ Body: string | WsolConversionRequest }>, reply: FastifyReply) => {
      try {
        const data = encryptionService.processRequestData<WsolConversionRequest>(request.body)

        // Validate request
        if (!data.botId || !data.walletAddresses || data.walletAddresses.length === 0) {
          return reply.code(400).send(
            encryptionService.processResponseData({
              success: false,
              message: "Invalid request. botId and walletAddresses are required.",
            }),
          )
        }

        // Check if bot exists
        const bot = storage.getBot(data.botId)
        if (!bot) {
          return reply.code(404).send(
            encryptionService.processResponseData({
              success: false,
              message: `Bot with ID ${data.botId} not found.`,
            }),
          )
        }

        // Get wallets by addresses
        const wallets = storage
          .getWallets()
          .filter((wallet) => data.walletAddresses.includes(wallet.address) && wallet.botId === data.botId)

        if (wallets.length === 0) {
          return reply.code(404).send(
            encryptionService.processResponseData({
              success: false,
              message: "No matching wallets found for the provided addresses.",
            }),
          )
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
          storage.updateWallet(wallet.id, {
            solBalance: wallet.solBalance + wsolAmount,
            lastUsed: new Date(),
          })
        }

        // Return success response
        const response: WsolConversionResponse = {
          success: true,
          converted,
          totalAmount,
          transactions,
          message: `Successfully converted WSOL to SOL for ${converted} wallets, total amount: ${totalAmount.toFixed(4)} SOL.`,
        }

        return reply.code(200).send(encryptionService.processResponseData(response))
      } catch (error) {
        console.error("Error converting WSOL:", error)
        return reply.code(500).send(
          encryptionService.processResponseData({
            success: false,
            message: "Failed to convert WSOL to SOL.",
          }),
        )
      }
    },
  )
}
