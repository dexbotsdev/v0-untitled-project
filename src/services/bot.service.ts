import type { Bot, BotConfigRequest } from "../types/bot"
import storageService from "./storage.service"
import logger from "../utils/logger"
import { BadRequestError } from "../utils/errors"

export class BotService {
  /**
   * Create a new bot
   */
  createBot(data: BotConfigRequest) {
    // Validate request
    if (!data.name || !data.tokenAddress || !data.platform || !data.strategy) {
      throw new BadRequestError("Invalid request. name, tokenAddress, platform, and strategy are required.")
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
    storageService.createBot(bot)

    logger.info(`Created new bot ${botId} for token ${data.tokenAddress}`)

    return {
      success: true,
      botId,
      message: `Successfully created bot "${data.name}".`,
    }
  }

  /**
   * Get all bots
   */
  getAllBots() {
    const bots = storageService.getBots()
    return {
      success: true,
      bots,
    }
  }

  /**
   * Get a specific bot
   */
  getBot(id: string) {
    const bot = storageService.getBotOrThrow(id)
    return {
      success: true,
      bot,
    }
  }

  /**
   * Delete a bot
   */
  deleteBot(id: string) {
    const bot = storageService.getBotOrThrow(id)

    // Delete bot
    storageService.deleteBot(id)

    logger.info(`Deleted bot ${id}`)

    return {
      success: true,
      message: `Successfully deleted bot "${bot.name}".`,
    }
  }

  /**
   * Start a bot
   */
  startBot(id: string) {
    const bot = storageService.getBotOrThrow(id)

    // Check if bot is already active
    if (bot.status === "active") {
      throw new BadRequestError(`Bot "${bot.name}" is already active.`)
    }

    // Check if bot is stopped (cannot restart a stopped bot)
    if (bot.status === "stopped") {
      throw new BadRequestError(`Bot "${bot.name}" is stopped and cannot be restarted.`)
    }

    // Update bot status
    storageService.updateBot(id, { status: "active" })

    logger.info(`Started bot ${id}`)

    return {
      success: true,
      status: "active",
      message: `Successfully started bot "${bot.name}".`,
    }
  }

  /**
   * Pause a bot
   */
  pauseBot(id: string) {
    const bot = storageService.getBotOrThrow(id)

    // Check if bot is already paused
    if (bot.status === "paused") {
      throw new BadRequestError(`Bot "${bot.name}" is already paused.`)
    }

    // Check if bot is stopped (cannot pause a stopped bot)
    if (bot.status === "stopped") {
      throw new BadRequestError(`Bot "${bot.name}" is stopped and cannot be paused.`)
    }

    // Update bot status
    storageService.updateBot(id, { status: "paused" })

    logger.info(`Paused bot ${id}`)

    return {
      success: true,
      status: "paused",
      message: `Successfully paused bot "${bot.name}".`,
    }
  }

  /**
   * Stop a bot
   */
  stopBot(id: string) {
    const bot = storageService.getBotOrThrow(id)

    // Check if bot is already stopped
    if (bot.status === "stopped") {
      throw new BadRequestError(`Bot "${bot.name}" is already stopped.`)
    }

    // Update bot status
    storageService.updateBot(id, { status: "stopped" })

    logger.info(`Stopped bot ${id}`)

    return {
      success: true,
      status: "stopped",
      message: `Successfully stopped bot "${bot.name}".`,
    }
  }

  /**
   * Update bot progress
   */
  updateBotProgress(id: string, progress: number) {
    const bot = storageService.getBotOrThrow(id)

    // Validate progress
    if (progress < 0 || progress > 100) {
      throw new BadRequestError("Progress must be between 0 and 100.")
    }

    // Update bot progress
    storageService.updateBot(id, { progress })

    logger.debug(`Updated progress for bot ${id} to ${progress}%`)

    return {
      success: true,
      message: `Successfully updated progress for bot "${bot.name}" to ${progress}%.`,
    }
  }
}

// Create a singleton instance
export const botService = new BotService()

export default botService
