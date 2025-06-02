"use client"

import { useEffect, useState } from "react"
import { getVolumeBotSDK } from "./volume-bot-sdk"
import type { BotConfig, BotEvent, LogEntry, SDKConfig, Trade, Wallet } from "./types"

/**
 * Hook to use the Volume Bot SDK
 */
export function useVolumeBotSDK(config?: SDKConfig) {
  const sdk = getVolumeBotSDK(config)
  const [bots, setBots] = useState<BotConfig[]>([])
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null)
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Initialize data
  useEffect(() => {
    // Load bots
    const allBots = sdk.getAllBots()
    setBots(allBots)

    // Set selected bot if available
    if (allBots.length > 0 && !selectedBotId) {
      setSelectedBotId(allBots[0].id)
    }

    setIsLoading(false)

    // Set up event listeners
    const unsubscribe = sdk.on("*", handleEvent)

    return () => {
      unsubscribe()
    }
  }, [])

  // Load data for selected bot
  useEffect(() => {
    if (selectedBotId) {
      setWallets(sdk.getWallets(selectedBotId))
      setTrades(sdk.getTrades(selectedBotId))
      setLogs(sdk.getLogs(selectedBotId))
    } else {
      setWallets([])
      setTrades([])
      setLogs([])
    }
  }, [selectedBotId])

  // Handle SDK events
  const handleEvent = (event: BotEvent) => {
    // Update bots
    setBots(sdk.getAllBots())

    // Update data for selected bot
    if (selectedBotId && "botId" in event && event.botId === selectedBotId) {
      setWallets(sdk.getWallets(selectedBotId))
      setTrades(sdk.getTrades(selectedBotId))
      setLogs(sdk.getLogs(selectedBotId))
    }
  }

  // Create a bot
  const createBot = (config: BotConfig) => {
    const botId = sdk.addBot(config)
    setBots(sdk.getAllBots())
    return botId
  }

  // Select a bot
  const selectBot = (botId: string) => {
    setSelectedBotId(botId)
  }

  // Start a bot
  const startBot = (botId: string) => {
    return sdk.startBot(botId)
  }

  // Pause a bot
  const pauseBot = (botId: string) => {
    return sdk.pauseBot(botId)
  }

  // Stop a bot
  const stopBot = (botId: string) => {
    return sdk.stopBot(botId)
  }

  // Delete a bot
  const deleteBot = (botId: string) => {
    const result = sdk.deleteBot(botId)
    if (result && selectedBotId === botId) {
      const remainingBots = sdk.getAllBots()
      setSelectedBotId(remainingBots.length > 0 ? remainingBots[0].id : null)
    }
    return result
  }

  // Generate wallets
  const generateWallets = (botId: string, count: number) => {
    return sdk.generateWallets(botId, count)
  }

  // Fund wallets
  const fundWallets = (botId: string, walletIds: string[], amount: number) => {
    return sdk.fundWallets(botId, walletIds, amount)
  }

  return {
    sdk,
    bots,
    selectedBotId,
    wallets,
    trades,
    logs,
    isLoading,
    createBot,
    selectBot,
    startBot,
    pauseBot,
    stopBot,
    deleteBot,
    generateWallets,
    fundWallets,
  }
}
