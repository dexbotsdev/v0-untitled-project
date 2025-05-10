import type { FastifyRequest, FastifyReply } from "fastify"
import type { BotConfigRequest } from "../types/bot"
import botService from "../services/bot.service"
import encryptionService from "../services/encryption.service"
import logger from "../utils/logger"

export class BotController {
  async createBot(request: FastifyRequest<{ Body: string | BotConfigRequest }>, reply: FastifyReply) {
    try {
      const data = encryptionService.processRequestData<BotConfigRequest>(request.body)
      const result = botService.createBot(data)
      return reply.code(200).send(encryptionService.processResponseData(result))
    } catch (error: any) {
      logger.error("Error creating bot:", error)
      return reply.code(error.statusCode || 500).send(
        encryptionService.processResponseData({
          success: false,
          message: error.message || "Failed to create bot.",
        }),
      )
    }
  }

  async getAllBots(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = botService.getAllBots()
      return reply.code(200).send(encryptionService.processResponseData(result))
    } catch (error: any) {
      logger.error("Error fetching bots:", error)
      return reply.code(error.statusCode || 500).send(
        encryptionService.processResponseData({
          success: false,
          message: error.message || "Failed to fetch bots.",
        }),
      )
    }
  }

  async getBot(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      const result = botService.getBot(id)
      return reply.code(200).send(encryptionService.processResponseData(result))
    } catch (error: any) {
      logger.error("Error fetching bot:", error)
      return reply.code(error.statusCode || 500).send(
        encryptionService.processResponseData({
          success: false,
          message: error.message || "Failed to fetch bot.",
        }),
      )
    }
  }

  async deleteBot(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      const result = botService.deleteBot(id)
      return reply.code(200).send(encryptionService.processResponseData(result))
    } catch (error: any) {
      logger.error("Error deleting bot:", error)
      return reply.code(error.statusCode || 500).send(
        encryptionService.processResponseData({
          success: false,
          message: error.message || "Failed to delete bot.",
        }),
      )
    }
  }

  async startBot(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      const result = botService.startBot(id)
      return reply.code(200).send(encryptionService.processResponseData(result))
    } catch (error: any) {
      logger.error("Error starting bot:", error)
      return reply.code(error.statusCode || 500).send(
        encryptionService.processResponseData({
          success: false,
          message: error.message || "Failed to start bot.",
        }),
      )
    }
  }

  async pauseBot(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      const result = botService.pauseBot(id)
      return reply.code(200).send(encryptionService.processResponseData(result))
    } catch (error: any) {
      logger.error("Error pausing bot:", error)
      return reply.code(error.statusCode || 500).send(
        encryptionService.processResponseData({
          success: false,
          message: error.message || "Failed to pause bot.",
        }),
      )
    }
  }

  async stopBot(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      const result = botService.stopBot(id)
      return reply.code(200).send(encryptionService.processResponseData(result))
    } catch (error: any) {
      logger.error("Error stopping bot:", error)
      return reply.code(error.statusCode || 500).send(
        encryptionService.processResponseData({
          success: false,
          message: error.message || "Failed to stop bot.",
        }),
      )
    }
  }

  async updateBotProgress(
    request: FastifyRequest<{ Params: { id: string }; Body: { progress: number } }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params
      const { progress } = request.body
      const result = botService.updateBotProgress(id, progress)
      return reply.code(200).send(encryptionService.processResponseData(result))
    } catch (error: any) {
      logger.error("Error updating bot progress:", error)
      return reply.code(error.statusCode || 500).send(
        encryptionService.processResponseData({
          success: false,
          message: error.message || "Failed to update bot progress.",
        }),
      )
    }
  }
}

// Create a singleton instance
export const botController = new BotController()

export default botController
