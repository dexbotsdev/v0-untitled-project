import { type ApiClient, apiClient } from "./api-client"
import { simulateNetworkDelay } from "@/utils/mockData"

export interface Token {
  id: number
  name: string
  symbol: string
  address: string
  description?: string
  twitter?: string
  telegram?: string
  discord?: string
  website?: string
  image?: string
  price?: number
  marketCap?: number
  volume24h?: number
  priceChange24h?: number
  bundleReady?: boolean
  bundleStatus?: string
}

export interface TokenPagination {
  tokens: Token[]
  pagination: {
    page: number
    limit: number
    totalPages: number
    totalCount: number
  }
}

export interface CreateTokenRequest {
  name: string
  symbol: string
  address: string
  description?: string
  twitter?: string
  telegram?: string
  discord?: string
  website?: string
  image?: string
}

export interface TokenPnlData {
  tokenId: number
  tokenSymbol: string
  initialInvestment: number
  currentValue: number
  profitLoss: number
  profitLossPercentage: number
  buyPrice: number
  currentPrice: number
  tokenAmount: number
}

export class TokenService {
  private client: ApiClient

  constructor(client: ApiClient = apiClient) {
    this.client = client
  }

  /**
   * Get tokens with pagination
   */
  async getTokens(page = 1, limit = 10): Promise<TokenPagination> {
    await simulateNetworkDelay()
    return this.client.get<TokenPagination>("/tokens", { page, limit })
  }

  /**
   * Get a single token by ID
   */
  async getToken(id: number): Promise<Token> {
    await simulateNetworkDelay()
    return this.client.get<Token>(`/tokens/${id}`)
  }

  /**
   * Get a single token by address
   */
  async getTokenByAddress(address: string): Promise<Token> {
    await simulateNetworkDelay()
    return this.client.get<Token>("/token/load", { address })
  }

  /**
   * Create a new token
   */
  async createToken(token: CreateTokenRequest): Promise<Token> {
    await simulateNetworkDelay()
    return this.client.post<Token>("/tokens", token)
  }

  /**
   * Update a token
   */
  async updateToken(id: number, token: Partial<Token>): Promise<Token> {
    await simulateNetworkDelay()
    return this.client.put<Token>(`/tokens/${id}`, token)
  }

  /**
   * Delete a token
   */
  async deleteToken(id: number): Promise<{ success: boolean }> {
    await simulateNetworkDelay()
    return this.client.delete<{ success: boolean }>(`/tokens/${id}`)
  }

  /**
   * Get token PnL data
   */
  async getTokenPnl(tokenId: number): Promise<TokenPnlData> {
    await simulateNetworkDelay()
    return this.client.get<TokenPnlData>(`/tokens/${tokenId}/pnl`)
  }

  /**
   * Sell tokens
   */
  async sellTokens(
    tokenId: number,
    amount: number,
  ): Promise<{
    success: boolean
    soldAmount: number
    receivedValue: number
    transactionHash: string
  }> {
    await simulateNetworkDelay(1000, 3000) // Longer delay for complex operation
    return this.client.post<{
      success: boolean
      soldAmount: number
      receivedValue: number
      transactionHash: string
    }>(`/tokens/${tokenId}/sell`, { amount })
  }
}

// Create a singleton instance
export const tokenService = new TokenService()
