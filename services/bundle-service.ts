import { type ApiClient, apiClient } from "./api-client"
import { simulateNetworkDelay } from "@/utils/mockData"

export interface BundlerConfig {
  id?: number
  tokenAddress: string
  tokenSymbol?: string
  tokenName?: string
  platform?: string
  platformType?: "managed" | "manual"
  mode: string
  walletsCount: number
  devWalletBuyAmount: number
  delaySeconds?: number
  minDelay?: number
  maxDelay?: number
  walletBuyAmounts?: number[]
  wallets?: WalletConfig[]
  status?: string
  createdAt?: string
  updatedAt?: string
}

export interface WalletConfig {
  id: number
  address: string
  privateKey: string
  tokenAddress: string
  tradeAmount: number
  buyPrice?: number
  tokenAmount?: number
  solAmount?: number
  tokenSupply?: number
}

export interface BundleTemplate {
  id: string
  name: string
  description: string
  config: Partial<BundlerConfig>
}

export class BundleService {
  private client: ApiClient

  constructor(client: ApiClient = apiClient) {
    this.client = client
  }

  /**
   * Get all bundle configurations
   */
  async getBundleConfigs(): Promise<BundlerConfig[]> {
    await simulateNetworkDelay()
    return this.client.get<BundlerConfig[]>("/bundler/configs")
  }

  /**
   * Get a bundle configuration by ID
   */
  async getBundleConfig(id: number): Promise<BundlerConfig> {
    await simulateNetworkDelay()
    return this.client.get<BundlerConfig>(`/bundler/configs/${id}`)
  }

  /**
   * Get a bundle configuration by token address
   */
  async getBundleConfigByToken(tokenAddress: string): Promise<BundlerConfig> {
    await simulateNetworkDelay()
    return this.client.get<BundlerConfig>("/bundler/config-by-token", { tokenAddress })
  }

  /**
   * Save a bundle configuration
   */
  async saveBundleConfig(config: BundlerConfig): Promise<BundlerConfig> {
    await simulateNetworkDelay(1000, 2000)
    return this.client.post<BundlerConfig>("/bundler/save", config)
  }

  /**
   * Update a bundle configuration
   */
  async updateBundleConfig(id: number, config: Partial<BundlerConfig>): Promise<BundlerConfig> {
    await simulateNetworkDelay()
    return this.client.put<BundlerConfig>(`/bundler/configs/${id}`, config)
  }

  /**
   * Delete a bundle configuration
   */
  async deleteBundleConfig(id: number): Promise<{ success: boolean }> {
    await simulateNetworkDelay()
    return this.client.delete<{ success: boolean }>(`/bundler/configs/${id}`)
  }

  /**
   * Refresh bundle status
   */
  async refreshBundleStatus(id: number): Promise<BundlerConfig> {
    await simulateNetworkDelay()
    return this.client.post<BundlerConfig>("/bundler/refresh", { id })
  }

  /**
   * Get bundle templates
   */
  async getBundleTemplates(): Promise<BundleTemplate[]> {
    await simulateNetworkDelay()
    return this.client.get<BundleTemplate[]>("/bundler/templates")
  }

  /**
   * Apply a bundle template
   */
  async applyBundleTemplate(templateId: string, tokenAddress: string): Promise<BundlerConfig> {
    await simulateNetworkDelay()
    return this.client.post<BundlerConfig>("/bundler/apply-template", { templateId, tokenAddress })
  }
}

// Create a singleton instance
export const bundleService = new BundleService()
