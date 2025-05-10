export interface Wallet {
  id: string
  address: string
  privateKey: string
  botId?: string
  solBalance: number
  tokenBalance: number
  tags: string[]
  createdAt: Date
  lastUsed?: Date
}

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
