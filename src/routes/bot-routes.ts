import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import type { BotConfigRequest, BotConfigResponse, BotActionResponse, Bot, RouteOptions } from "../types"
import storage from "../utils/storage"
import EncryptionService from "../utils/encryption"

export default async function botRoutes(fastify: FastifyInstance, options: RouteOptions): Promise<void> {
  const encryptionService = new EncryptionService(options.encryptionKey)

  // Create a new bot
  fastify.post<{ Body: string | BotConfigRequest }>(
    "/bots/create",
    async (request: FastifyRequest<{ Body: string | BotConfigRequest }>, reply: FastifyReply) => {
      try {
        const data = encryptionService.processRequestData<BotConfigRequest>(request.body)

        // Validate request
        if (!data.name || !data.tokenAddress || !data.platform || !data.strategy) {
          return reply.code(400).send(
            encryptionService.processResponseData({
              success: false,
              message: "Invalid request. name, tokenAddress, platform, and strategy are required.",
            }),
          )
        }

        // Create new bot
        const botId = `bot-${Date.now()}`
        const bot: Bot = {
          id: botId,
          name: data.name,
          tokenAddress: data.tokenAddress,
          symbol: data.symbol || "UNKNOWN",
          platform: data.platform,
          strategy: data.strategy,
          tradesPerMinute: data.tradesPerMinute || 16,
          minTradeAmount: data.minTradeAmount || 0.01,
          maxTradeAmount: data.maxTradeAmount || 0.05,
          duration: data.duration || 24,
          antiMev: data.antiMev || false,
          fakeSigners: data.fakeSigners || false,
          status: "paused",
          progress: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        // Save bot to storage
        storage.createBot(bot)

        // Return success response
        const response: BotConfigResponse = {
          success: true,
          botId,
          message: `Successfully created bot "${data.name}".`,
        }

        return reply.code(200).send(encryptionService.processResponseData(response))
      } catch (error) {
        console.error("Error creating bot:", error)
        return reply.code(500).send(
          encryptionService.processResponseData({
            success: false,
            message: "Failed to create bot.",
          }),
        )
      }
    },
  )

  // Get all bots
  fastify.get("/bots", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const bots = storage.getBots()

      return reply.code(200).send(
        encryptionService.processResponseData({
          success: true,
          bots,
        }),
      )
    } catch (error) {
      console.error("Error fetching bots:", error)
      return reply.code(500).send(
        encryptionService.processResponseData({
          success: false,
          message: "Failed to fetch bots.",
        }),
      )
    }
  })

  // Get a specific bot
  fastify.get<{ Params: { id: string } }>(
    "/bots/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params
        const bot = storage.getBot(id)

        if (!bot) {
          return reply.code(404).send(
            encryptionService.processResponseData({
              success: false,
              message: `Bot with ID ${id} not found.`,
            }),
          )
        }

        return reply.code(200).send(
          encryptionService.processResponseData({
            success: true,
            bot,
          }),
        )
      } catch (error) {
        console.error("Error fetching bot:", error)
        return reply.code(500).send(
          encryptionService.processResponseData({
            success: false,
            message: "Failed to fetch bot.",
          }),
        )
      }
    },
  )

  // Delete a bot
  fastify.delete<{ Params: { id: string } }>(
    "/bots/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params
        const bot = storage.getBot(id)

        if (!bot) {
          return reply.code(404).send(
            encryptionService.processResponseData({
              success: false,
              message: `Bot with ID ${id} not found.`,
            }),
          )
        }

        // Delete bot
        storage.deleteBot(id)

        // Return success response
        const response: BotActionResponse = {
          success: true,
          message: `Successfully deleted bot "${bot.name}".`,
        }

        return reply.code(200).send(encryptionService.processResponseData(response))
      } catch (error) {
        console.error("Error deleting bot:", error)
        return reply.code(500).send(
          encryptionService.processResponseData({
            success: false,
            message: "Failed to delete bot.",
          }),
        )
      }
    },
  )

  // Start a bot
  fastify.post<{ Params: { id: string } }>(
    "/bots/:id/start",
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params
        const bot = storage.getBot(id)

        if (!bot) {
          return reply.code(404).send(
            encryptionService.processResponseData({
              success: false,
              message: `Bot with ID ${id} not found.`,
            }),
          )
        }

        // Check if bot is already active
        if (bot.status === "active") {
          return reply.code(400).send(
            encryptionService.processResponseData({
              success: false,
              message: `Bot "${bot.name}" is already active.`,
            }),
          )
        }

        // Check if bot is stopped (cannot restart a stopped bot)
        if (bot.status === "stopped") {
          return reply.code(400).send(
            encryptionService.processResponseData({
              success: false,
              message: `Bot "${bot.name}" is stopped and cannot be restarted.`,
            }),
          )
        }

        // Update bot status
        storage.updateBot(id, { status: "active" })

        // Return success response
        const response: BotActionResponse = {
          success: true,
          status: "active",
          message: `Successfully started bot "${bot.name}".`,
        }

        return reply.code(200).send(encryptionService.processResponseData(response))
      } catch (error) {
        console.error("Error starting bot:", error)
        return reply.code(500).send(
          encryptionService.processResponseData({
            success: false,
            message: "Failed to start bot.",
          }),
        )
      }
    },
  )

  // Pause a bot
  fastify.post<{ Params: { id: string } }>(
    "/bots/:id/pause",
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params
        const bot = storage.getBot(id)

        if (!bot) {
          return reply.code(404).send(
            encryptionService.processResponseData({
              success: false,
              message: `Bot with ID ${id} not found.`,
            }),
          )
        }

        // Check if bot is already paused
        if (bot.status === "paused") {
          return reply.code(400).send(
            encryptionService.processResponseData({
              success: false,
              message: `Bot "${bot.name}" is already paused.`,
            }),
          )
        }

        // Check if bot is stopped (cannot pause a stopped bot)
        if (bot.status === "stopped") {
          return reply.code(400).send(
            encryptionService.processResponseData({
              success: false,
              message: `Bot "${bot.name}" is stopped and cannot be paused.`,
            }),
          )
        }

        // Update bot status
        storage.updateBot(id, { status: "paused" })

        // Return success response
        const response: BotActionResponse = {
          success: true,
          status: "paused",
          message: `Successfully paused bot "${bot.name}".`,
        }

        return reply.code(200).send(encryptionService.processResponseData(response))
      } catch (error) {
        console.error("Error pausing bot:", error)
        return reply.code(500).send(
          encryptionService.processResponseData({
            success: false,
            message: "Failed to pause bot.",
          }),
        )
      }
    },
  )

  // Stop a bot
  fastify.post<{ Params: { id: string } }>(
    "/bots/:id/stop",
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params
        const bot = storage.getBot(id)

        if (!bot) {
          return reply.code(404).send(
            encryptionService.processResponseData({
              success: false,
              message: `Bot with ID ${id} not found.`,
            }),
          )
        }

        // Check if bot is already stopped
        if (bot.status === "stopped") {
          return reply.code(400).send(
            encryptionService.processResponseData({
              success: false,
              message: `Bot "${bot.name}" is already stopped.`,
            }),
          )
        }

        // Update bot status
        storage.updateBot(id, { status: "stopped" })

        // Return success response
        const response: BotActionResponse = {
          success: true,
          status: "stopped",
          message: `Successfully stopped bot "${bot.name}".`,
        }

        return reply.code(200).send(encryptionService.processResponseData(response))
      } catch (error) {
        console.error("Error stopping bot:", error)
        return reply.code(500).send(
          encryptionService.processResponseData({
            success: false,
            message: "Failed to stop bot.",
          }),
        )
      }
    },
  )

  // Update bot progress (for simulation)
  fastify.post<{ Params: { id: string }; Body: { progress: number } }>(
    "/bots/:id/progress",
    async (request: FastifyRequest<{ Params: { id: string }; Body: { progress: number } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params
        const { progress } = request.body

        const bot = storage.getBot(id)

        if (!bot) {
          return reply.code(404).send(
            encryptionService.processResponseData({
              success: false,
              message: `Bot with ID ${id} not found.`,
            }),
          )
        }

        // Validate progress
        if (progress < 0 || progress > 100) {
          return reply.code(400).send(
            encryptionService.processResponseData({
              success: false,
              message: "Progress must be between 0 and 100.",
            }),
          )
        }

        // Update bot progress
        storage.updateBot(id, { progress })

        // Return success response
        return reply.code(200).send(
          encryptionService.processResponseData({
            success: true,
            message: `Successfully updated progress for bot "${bot.name}" to ${progress}%.`,
          }),
        )
      } catch (error) {
        console.error("Error updating bot progress:", error)
        return reply.code(500).send(
          encryptionService.processResponseData({
            success: false,
            message: "Failed to update bot progress.",
          }),
        )
      }
    },
  )
}
