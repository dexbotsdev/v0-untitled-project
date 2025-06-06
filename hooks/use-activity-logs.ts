"use client"

import { bundlerSDK, type ActivityLog } from "@/lib/bundler-sdk"

/**
 * Helper function to add a global log entry
 * @param category The log category (bundle, wallet, token, volume, system)
 * @param type The log type (info, success, warning, error)
 * @param message The log message
 * @param data Optional data to attach to the log
 */
export function addGlobalLog(
  category: ActivityLog["category"],
  type: ActivityLog["type"],
  message: string,
  data?: Record<string, any>,
) {
  bundlerSDK.log(category, type, message, data)
}

/**
 * Helper function to add a token-specific log entry
 * @param tokenAddress The token address
 * @param category The log category (bundle, wallet, token, volume, system)
 * @param type The log type (info, success, warning, error)
 * @param message The log message
 * @param data Optional additional data
 */
export function addTokenLog(
  tokenAddress: string,
  category: ActivityLog["category"],
  type: ActivityLog["type"],
  message: string,
  data?: Record<string, any>,
) {
  bundlerSDK.log(category, type, message, {
    ...(data || {}),
    tokenAddress,
  })
}

/**
 * Helper function to add a wallet-specific log entry
 * @param walletAddress The wallet address
 * @param category The log category (bundle, wallet, token, volume, system)
 * @param type The log type (info, success, warning, error)
 * @param message The log message
 * @param data Optional additional data
 */
export function addWalletLog(
  walletAddress: string,
  category: ActivityLog["category"],
  type: ActivityLog["type"],
  message: string,
  data?: Record<string, any>,
) {
  bundlerSDK.log(category, type, message, {
    ...(data || {}),
    walletAddress,
  })
}
