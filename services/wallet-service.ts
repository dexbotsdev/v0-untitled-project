import { type ApiClient, apiClient } from "./api-client"
import { simulateNetworkDelay } from "@/utils/mockData"

export interface Wallet {
  id: number
  address: string
  privateKey: string
  nativeBalance: number
  name?: string
  walletType?: string
}

export interface WalletAccount {
  id: number
  name: string
  numberOfWallets: number
  isActive: boolean
  walletType: string
}

export interface FundWalletRequest {
  walletId: number
  amount: number
}

export interface FundWalletsRequest {
  walletIds: number[]
  amount: number
}

export interface WalletTransactionRequest {
  walletIds: number[]
  transactionCount: number
  amount: number
}

export class WalletService {
  private client: ApiClient

  constructor(client: ApiClient = apiClient) {
    this.client = client
  }

  /**
   * Get all wallet accounts
   */
  async getWalletAccounts(): Promise<WalletAccount[]> {
    await simulateNetworkDelay()
    return this.client.get<WalletAccount[]>("/wallets/accounts")
  }

  /**
   * Create a new wallet account
   */
  async createWalletAccount(account: Omit<WalletAccount, "id">): Promise<WalletAccount> {
    await simulateNetworkDelay()
    return this.client.post<WalletAccount>("/wallets/accounts", account)
  }

  /**
   * Generate wallets for an account
   */
  async generateWallets(accountId: number, count: number): Promise<Wallet[]> {
    await simulateNetworkDelay()
    return this.client.post<Wallet[]>("/wallets/generate", { accountId, count })
  }

  /**
   * Get wallets for an account
   */
  async getWallets(accountId: number): Promise<Wallet[]> {
    await simulateNetworkDelay()
    return this.client.get<Wallet[]>("/wallets", { accountId })
  }

  /**
   * Fund a single wallet
   */
  async fundWallet(request: FundWalletRequest): Promise<Wallet> {
    await simulateNetworkDelay()
    return this.client.post<Wallet>("/wallets/fund", request)
  }

  /**
   * Fund multiple wallets
   */
  async fundWallets(request: FundWalletsRequest): Promise<Wallet[]> {
    await simulateNetworkDelay()
    return this.client.post<Wallet[]>("/wallets/fund-multiple", request)
  }

  /**
   * Recover funds from a wallet
   */
  async recoverFunds(walletId: number): Promise<Wallet> {
    await simulateNetworkDelay()
    return this.client.post<Wallet>(`/wallets/${walletId}/recover`, {})
  }

  /**
   * Recover funds from multiple wallets
   */
  async recoverFundsMultiple(walletIds: number[]): Promise<Wallet[]> {
    await simulateNetworkDelay()
    return this.client.post<Wallet[]>("/wallets/recover-multiple", { walletIds })
  }

  /**
   * Delete a wallet
   */
  async deleteWallet(walletId: number): Promise<{ success: boolean }> {
    await simulateNetworkDelay()
    return this.client.delete<{ success: boolean }>(`/wallets/${walletId}`)
  }

  /**
   * Delete multiple wallets
   */
  async deleteWallets(walletIds: number[]): Promise<{ success: boolean; count: number }> {
    await simulateNetworkDelay()
    return this.client.post<{ success: boolean; count: number }>("/wallets/delete-multiple", { walletIds })
  }

  /**
   * Execute warmup transactions
   */
  async executeWarmup(request: WalletTransactionRequest): Promise<{
    success: boolean
    transactionsExecuted: number
    walletsAffected: number
  }> {
    await simulateNetworkDelay(1000, 3000) // Longer delay for complex operation
    return this.client.post<{
      success: boolean
      transactionsExecuted: number
      walletsAffected: number
    }>("/wallets/warmup", request)
  }

  /**
   * Execute crunch transactions
   */
  async executeCrunch(request: WalletTransactionRequest): Promise<{
    success: boolean
    transactionsExecuted: number
    walletsAffected: number
  }> {
    await simulateNetworkDelay(1000, 3000) // Longer delay for complex operation
    return this.client.post<{
      success: boolean
      transactionsExecuted: number
      walletsAffected: number
    }>("/wallets/crunch", request)
  }
}

// Create a singleton instance
export const walletService = new WalletService()
