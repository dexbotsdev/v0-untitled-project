import type { FastifyInstance } from "fastify"
import botController from "../controllers/bot.controller"

export default async function botRoutes(fastify: FastifyInstance): Promise<void> {
  // Create a new bot
  fastify.post("/bots/create", botController.createBot.bind(botController))

  // Get all bots
  fastify.get("/bots", botController.getAllBots.bind(botController))

  // Get a specific bot
  fastify.get("/bots/:id", botController.getBot.bind(botController))

  // Delete a bot
  fastify.delete("/bots/:id", botController.deleteBot.bind(botController))

  // Start a bot
  fastify.post("/bots/:id/start", botController.startBot.bind(botController))

  // Pause a bot
  fastify.post("/bots/:id/pause", botController.pauseBot.bind(botController))

  // Stop a bot
  fastify.post("/bots/:id/stop", botController.stopBot.bind(botController))

  // Update bot progress
  fastify.post("/bots/:id/progress", botController.updateBotProgress.bind(botController))
}
