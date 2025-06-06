"use client"

import { useEffect, useState, useCallback } from "react"
import {
  bundlerSDK,
  type BundleConfig,
  type Token,
  type WalletBalance,
  type ActivityLog,
  type VolumeBoostConfig,
  type SellTokensConfig,
} from "@/lib/bundler-sdk"

// Hook for bundle operations
export function useBundlerSDK() {
  const [isConnected, setIsConnected] = useState(false)
  const [bundles, setBundles] = useState<BundleConfig[]>([])
  const [tokens, setTokens] = useState<Token[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])

  useEffect(() => {
    // System events
    const handleConnected = () => setIsConnected(true)
    const handleDisconnected = () => setIsConnected(false)

    // Bundle events
    const handleBundleCreated = (bundle: BundleConfig) => {
      setBundles((prev) => [...prev, bundle])
    }

    const handleBundleLaunched = (bundle: BundleConfig) => {
      setBundles((prev) => prev.map((b) => (b.id === bundle.id ? bundle : b)))
    }

    // Token events
    const handleTokenPriceChanged = (token: Token) => {
      setTokens((prev) => prev.map((t) => (t.address === token.address ? token : t)))
    }

    // Activity logs
    const handleActivityLog = (log: ActivityLog) => {
      setActivityLogs((prev) => [...prev, log].slice(-1000)) // Keep last 1000 logs
    }

    // Subscribe to events
    bundlerSDK.on("system:connected", handleConnected)
    bundlerSDK.on("system:disconnected", handleDisconnected)
    bundlerSDK.on("bundle:created", handleBundleCreated)
    bundlerSDK.on("bundle:launched", handleBundleLaunched)
    bundlerSDK.on("token:price-changed", handleTokenPriceChanged)
    bundlerSDK.on("activity:log", handleActivityLog)

    // Initial state
    setIsConnected(bundlerSDK.isSystemConnected())
    setTokens(bundlerSDK.getTokens())

    return () => {
      bundlerSDK.off("system:connected", handleConnected)
      bundlerSDK.off("system:disconnected", handleDisconnected)
      bundlerSDK.off("bundle:created", handleBundleCreated)
      bundlerSDK.off("bundle:launched", handleBundleLaunched)
      bundlerSDK.off("token:price-changed", handleTokenPriceChanged)
      bundlerSDK.off("activity:log", handleActivityLog)
    }
  }, [])

  const createBundle = useCallback(async (config: Omit<BundleConfig, "id" | "createdAt" | "updatedAt">) => {
    return await bundlerSDK.createBundle(config)
  }, [])

  const launchBundle = useCallback(async (bundleId: string) => {
    return await bundlerSDK.launchBundle(bundleId)
  }, [])

  const getBundleForToken = useCallback((tokenAddress: string) => {
    return bundlerSDK.getBundleForToken(tokenAddress)
  }, [])

  const startVolumeBoost = useCallback(async (config: VolumeBoostConfig) => {
    return await bundlerSDK.startVolumeBoost(config)
  }, [])

  const stopVolumeBoost = useCallback(async (tokenAddress: string) => {
    return await bundlerSDK.stopVolumeBoost(tokenAddress)
  }, [])

  const sellTokens = useCallback(async (config: SellTokensConfig) => {
    return await bundlerSDK.sellTokens(config)
  }, [])

  return {
    isConnected,
    bundles,
    tokens,
    activityLogs,
    createBundle,
    launchBundle,
    getBundleForToken,
    startVolumeBoost,
    stopVolumeBoost,
    sellTokens,
  }
}

// Hook for wallet balance tracking
export function useWalletBalances(tokenAddress?: string) {
  const [balances, setBalances] = useState<WalletBalance[]>([])

  useEffect(() => {
    const handleBalanceChanged = (balance: WalletBalance) => {
      if (!tokenAddress || balance.tokenAddress === tokenAddress) {
        setBalances((prev) => {
          const index = prev.findIndex(
            (b) => b.walletId === balance.walletId && b.tokenAddress === balance.tokenAddress,
          )
          if (index >= 0) {
            const newBalances = [...prev]
            newBalances[index] = balance
            return newBalances
          } else {
            return [...prev, balance]
          }
        })
      }
    }

    const handleTokenBalanceChanged = handleBalanceChanged

    bundlerSDK.on("wallet:balance-changed", handleBalanceChanged)
    bundlerSDK.on("wallet:token-balance-changed", handleTokenBalanceChanged)

    // Initial load
    setBalances(bundlerSDK.getAllWalletBalances(tokenAddress))

    return () => {
      bundlerSDK.off("wallet:balance-changed", handleBalanceChanged)
      bundlerSDK.off("wallet:token-balance-changed", handleTokenBalanceChanged)
    }
  }, [tokenAddress])

  return balances
}

// Hook for token price tracking
export function useTokenPrice(tokenAddress: string) {
  const [token, setToken] = useState<Token | null>(null)

  useEffect(() => {
    const handlePriceChanged = (updatedToken: Token) => {
      if (updatedToken.address === tokenAddress) {
        setToken(updatedToken)
      }
    }

    bundlerSDK.on("token:price-changed", handlePriceChanged)

    // Initial load
    setToken(bundlerSDK.getToken(tokenAddress))

    return () => {
      bundlerSDK.off("token:price-changed", handlePriceChanged)
    }
  }, [tokenAddress])

  return token
}

// Hook for activity logs with filtering
export function useActivityLogs(filter?: {
  category?: ActivityLog["category"]
  type?: ActivityLog["type"]
  limit?: number
}) {
  const [logs, setLogs] = useState<ActivityLog[]>([])

  useEffect(() => {
    const handleActivityLog = (log: ActivityLog) => {
      // Apply filters
      if (filter?.category && log.category !== filter.category) return
      if (filter?.type && log.type !== filter.type) return

      setLogs((prev) => {
        const newLogs = [...prev, log]
        const limit = filter?.limit || 1000
        return newLogs.slice(-limit)
      })
    }

    bundlerSDK.on("activity:log", handleActivityLog)

    return () => {
      bundlerSDK.off("activity:log", handleActivityLog)
    }
  }, [filter])

  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  return { logs, clearLogs }
}
