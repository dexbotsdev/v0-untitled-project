export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface RouteOptions {
  encryptionKey?: string
}

export interface StorageData {
  bots: Map<string, import("./bot").Bot>
  wallets: Map<string, import("./wallet").Wallet>
}
