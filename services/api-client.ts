/**
 * Base API client for making HTTP requests with encryption
 */
import CryptoJS from "crypto-js"

// Define types for request and response objects
export interface WalletGenerationRequest {
  botId: string
  count: number
}

export interface WalletGenerationResponse {
  success: boolean
  wallets: string[]
  message?: string
}

export interface WalletFundingRequest {
  botId: string
  walletAddresses: string[]
  fundingType: "fixed" | "range"
  fixedAmount?: number
  minAmount?: number
  maxAmount?: number
}

export interface WalletFundingResponse {
  success: boolean
  transactions: string[]
  totalFunded: number
  message?: string
}

export interface WalletImportRequest {
  botId: string
  walletAddresses: string[]
}

export interface WalletImportResponse {
  success: boolean
  imported: number
  invalid: number
  message?: string
}

export interface WalletTaggingRequest {
  botId: string
  walletAddresses: string[]
  tag: string
}

export interface WalletTaggingResponse {
  success: boolean
  tagged: number
  message?: string
}

export interface BotConfigRequest {
  name: string
  tokenAddress: string
  platform: string
  strategy: string
  tradesPerMinute: number
  minTradeAmount: number
  maxTradeAmount: number
  duration: number
  antiMev: boolean
  fakeSigners: boolean
}

export interface BotConfigResponse {
  success: boolean
  botId: string
  message?: string
}

export interface BotActionResponse {
  success: boolean
  status: string
  message?: string
}

export interface WalletRecoveryRequest {
  botId: string
  destinationWallet: string
}

export interface WalletRecoveryResponse {
  success: boolean
  recovered: number
  totalAmount: number
  transactions: string[]
  message?: string
}

export interface WalletDeletionRequest {
  botId: string
  walletAddresses: string[]
}

export interface WalletDeletionResponse {
  success: boolean
  deleted: number
  message?: string
}

export interface WsolConversionRequest {
  botId: string
  walletAddresses: string[]
}

export interface WsolConversionResponse {
  success: boolean
  converted: number
  totalAmount: number
  transactions: string[]
  message?: string
}

export class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>
  private encKey: string

  constructor(encKey = "", licenseKey = "", machineId = "", basePathPrefix = "/api") {
    // Get IP and port from localStorage or use defaults
    let ip = "127.0.0.1"
    let port = "3000"

    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      const savedIp = localStorage.getItem("transactionServerIp")
      const savedPort = localStorage.getItem("transactionServerPort")

      if (savedIp) ip = savedIp
      if (savedPort) port = savedPort
    }

    // Construct base URL from IP and port
    this.baseUrl = `http://${ip}:${port}${basePathPrefix}`

    console.log(`ApiClient initialized with endpoint: ${this.baseUrl}`)

    // Add license key and machine ID to headers
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-License-Key": licenseKey,
      "X-Machine-ID": machineId,
    }

    // Store encryption key
    this.encKey = encKey
  }

  /**
   * Encrypt data using AES256
   */
  private encrypt(data: any): string {
    if (!this.encKey) return JSON.stringify(data)

    const jsonString = JSON.stringify(data)
    return CryptoJS.AES.encrypt(jsonString, this.encKey).toString()
  }

  /**
   * Decrypt data using AES256
   */
  private decrypt(encryptedData: string): any {
    if (!this.encKey) return JSON.parse(encryptedData)

    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.encKey).toString(CryptoJS.enc.Utf8)
      return JSON.parse(decrypted)
    } catch (error) {
      console.error("Failed to decrypt response:", error)
      throw new Error("Failed to decrypt response")
    }
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint, params ? this.encrypt(params) : undefined)

    const response = await fetch(url, {
      method: "GET",
      headers: this.defaultHeaders,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const responseText = await response.text()
    return this.decrypt(responseText) as T
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const url = this.buildUrl(endpoint)
    const encryptedData = data ? this.encrypt(data) : undefined

    const response = await fetch(url, {
      method: "POST",
      headers: this.defaultHeaders,
      body: encryptedData,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const responseText = await response.text()
    return this.decrypt(responseText) as T
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const url = this.buildUrl(endpoint)
    const encryptedData = data ? this.encrypt(data) : undefined

    const response = await fetch(url, {
      method: "PUT",
      headers: this.defaultHeaders,
      body: encryptedData,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const responseText = await response.text()
    return this.decrypt(responseText) as T
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    const url = this.buildUrl(endpoint)

    const response = await fetch(url, {
      method: "DELETE",
      headers: this.defaultHeaders,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const responseText = await response.text()
    return this.decrypt(responseText) as T
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(endpoint: string, encryptedParams?: string): string {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin)

    if (encryptedParams) {
      url.searchParams.append("data", encryptedParams)
    }

    return url.toString()
  }

  /**
   * Update the base URL with new IP and port
   * This can be called when the settings are updated without needing to create a new client
   */
  updateBaseUrl(): void {
    if (typeof window !== "undefined") {
      const savedIp = localStorage.getItem("transactionServerIp") || "127.0.0.1"
      const savedPort = localStorage.getItem("transactionServerPort") || "3000"

      this.baseUrl = `http://${savedIp}:${savedPort}/api`
      console.log(`ApiClient updated with new endpoint: ${this.baseUrl}`)
    }
  }

  // ===== WALLET MANAGEMENT ENDPOINTS =====

  /**
   * Generate wallets for a bot
   */
  async generateWallets(request: WalletGenerationRequest): Promise<WalletGenerationResponse> {
    return this.post<WalletGenerationResponse>("/wallets/generate", request)
  }

  /**
   * Fund wallets with SOL
   */
  async fundWallets(request: WalletFundingRequest): Promise<WalletFundingResponse> {
    return this.post<WalletFundingResponse>("/wallets/fund", request)
  }

  /**
   * Import existing wallets
   */
  async importWallets(request: WalletImportRequest): Promise<WalletImportResponse> {
    return this.post<WalletImportResponse>("/wallets/import", request)
  }

  /**
   * Tag wallets for organization
   */
  async tagWallets(request: WalletTaggingRequest): Promise<WalletTaggingResponse> {
    return this.post<WalletTaggingResponse>("/wallets/tag", request)
  }

  /**
   * Recover funds from wallets
   */
  async recoverWallets(request: WalletRecoveryRequest): Promise<WalletRecoveryResponse> {
    return this.post<WalletRecoveryResponse>("/wallets/recover", request)
  }

  /**
   * Delete wallets
   */
  async deleteWallets(request: WalletDeletionRequest): Promise<WalletDeletionResponse> {
    return this.post<WalletDeletionResponse>("/wallets/delete", request)
  }

  /**
   * Convert WSOL to SOL in wallets
   */
  async convertWalletWsolsToSols(request: WsolConversionRequest): Promise<WsolConversionResponse> {
    return this.post<WsolConversionResponse>("/wallets/convert-wsol", request)
  }

  // ===== BOT MANAGEMENT ENDPOINTS =====

  /**
   * Create a new bot configuration
   */
  async createBotConfig(request: BotConfigRequest): Promise<BotConfigResponse> {
    return this.post<BotConfigResponse>("/bots/create", request)
  }

  /**
   * Delete a bot configuration
   */
  async deleteBotConfig(botId: string): Promise<BotActionResponse> {
    return this.delete<BotActionResponse>(`/bots/${botId}`)
  }

  /**
   * Fetch a bot configuration
   */
  async fetchBotConfig(botId: string): Promise<BotConfigResponse> {
    return this.get<BotConfigResponse>(`/bots/${botId}`)
  }

  /**
   * Start a bot
   */
  async startBot(botId: string): Promise<BotActionResponse> {
    return this.post<BotActionResponse>(`/bots/${botId}/start`)
  }

  /**
   * Stop a bot
   */
  async stopBot(botId: string): Promise<BotActionResponse> {
    return this.post<BotActionResponse>(`/bots/${botId}/stop`)
  }

  /**
   * Pause a bot
   */
  async pauseBot(botId: string): Promise<BotActionResponse> {
    return this.post<BotActionResponse>(`/bots/${botId}/pause`)
  }
}

/**
 * Create a singleton instance that reads from localStorage
 */
export const apiClient = new ApiClient()

/**
 * Hook to ensure the API client is using the latest settings
 * Call this in components that use the API client
 */
export function useApiClient() {
  // Update the API client with the latest settings
  if (typeof window !== "undefined") {
    apiClient.updateBaseUrl()
  }

  return apiClient
}
