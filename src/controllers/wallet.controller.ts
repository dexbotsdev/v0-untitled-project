import type { FastifyRequest, FastifyReply } from "fastify"
import type {
  WalletGenerationRequest,
  WalletFundingRequest,
  WalletImportRequest,
  WalletTaggingRequest,
  WalletRecoveryRequest,
  WalletDeletionRequest,
  WsolConversionRequest,
} from "../types/wallet"
import walletService from "../services/wallet.service"
import encryptionService from "../services/encryption.service"
import logger from "../utils/logger"

export class WalletController {
  async generateWallets(request: FastifyRequest<{ Body: string | WalletGenerationRequest }>, reply: FastifyReply) {
    try {
      const data = encryptionService.processRequestData<WalletGenerationRequest>(request.body)
      const result = walletService.generateWallets(data)
      return reply.code(200).send(encryptionService.processResponseData(result))
    } catch (error: any) {
      logger.error("Error generating wallets:", error)
      return reply.code(error.statusCode || 500).send(
        encryptionService.processResponseData({
          success: false,
          message: error.message || "Failed to generate wallets.",
        }),
      )
    }
  }

  async fundWallets(request: FastifyRequest<{ Body: string | WalletFundingRequest }>, reply: FastifyReply) {
    try {
      const data = encryptionService.processRequestData<WalletFundingRequest>(request.body)
      const result = walletService.fundWallets(data)
      return reply.code(200).send(encryptionService.processResponseData(result))
    } catch (error: any) {
      logger.error("Error funding wallets:", error)
      return reply.code(error.statusCode || 500).send(
        encryptionService.processResponseData({
          success: false,
          message: error.message || "Failed to fund wallets.",
        }),
      )
    }
  }

  async importWallets(request: FastifyRequest<{ Body: string | WalletImportRequest }>, reply: FastifyReply) {
    try {
      const data = encryptionService.processRequestData<WalletImportRequest>(request.body)
      const result = walletService.importWallets(data)
      return reply.code(200).send(encryptionService.processResponseData(result))
    } catch (error: any) {
      logger.error("Error importing wallets:", error)
      return reply.code(error.statusCode || 500).send(
        encryptionService.processResponseData({
          success: false,
          message: error.message || "Failed to import wallets.",
        }),
      )
    }
  }

  async tagWallets(request: FastifyRequest<{ Body: string | WalletTaggingRequest }>, reply: FastifyReply) {
    try {
      const data = encryptionService.processRequestData<WalletTaggingRequest>(request.body)
      const result = walletService.tagWallets(data)
      return reply.code(200).send(encryptionService.processResponseData(result))
    } catch (error: any) {
      logger.error("Error tagging wallets:", error)
      return reply.code(error.statusCode || 500).send(
        encryptionService.processResponseData({
          success: false,
          message: error.message || "Failed to tag wallets.",
        }),
      )
    }
  }

  async recoverFunds(request: FastifyRequest<{ Body: string | WalletRecoveryRequest }>, reply: FastifyReply) {
    try {
      const data = encryptionService.processRequestData<WalletRecoveryRequest>(request.body)
      const result = walletService.recoverFunds(data)
      return reply.code(200).send(encryptionService.processResponseData(result))
    } catch (error: any) {
      logger.error("Error recovering funds:", error)
      return reply.code(error.statusCode || 500).send(
        encryptionService.processResponseData({
          success: false,
          message: error.message || "Failed to recover funds.",
        }),
      )
    }
  }

  async deleteWallets(request: FastifyRequest<{ Body: string | WalletDeletionRequest }>, reply: FastifyReply) {
    try {
      const data = encryptionService.processRequestData<WalletDeletionRequest>(request.body)
      const result = walletService.deleteWallets(data)
      return reply.code(200).send(encryptionService.processResponseData(result))
    } catch (error: any) {
      logger.error("Error deleting wallets:", error)
      return reply.code(error.statusCode || 500).send(
        encryptionService.processResponseData({
          success: false,
          message: error.message || "Failed to delete wallets.",
        }),
      )
    }
  }

  async convertWsol(request: FastifyRequest<{ Body: string | WsolConversionRequest }>, reply: FastifyReply) {
    try {
      const data = encryptionService.processRequestData<WsolConversionRequest>(request.body)
      const result = walletService.convertWsol(data)
      return reply.code(200).send(encryptionService.processResponseData(result))
    } catch (error: any) {
      logger.error("Error converting WSOL:", error)
      return reply.code(error.statusCode || 500).send(
        encryptionService.processResponseData({
          success: false,
          message: error.message || "Failed to convert WSOL to SOL.",
        }),
      )
    }
  }
}

// Create a singleton instance
export const walletController = new WalletController()

export default walletController
