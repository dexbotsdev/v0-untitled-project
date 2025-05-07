// Database model interfaces

export interface Token {
  id: string
  name: string
  symbol: string
  address: string
  description?: string
  logo?: string
  price?: number
  priceChange?: number
  marketCap?: number
  holders?: number
  liquidity?: number
  status: "active" | "paused"
  progress: number
  volumeTarget?: number
  createdAt: string
  updatedAt: string
}

export interface BotSettings {
  id: string
  tokenId: string
  minTradeAmount: number
  maxTradeAmount: number
  duration: number
  strategy: "bump" | "turbo" | "microbuys" | "pattern"
  tradesPerMinute: number
  numberOfWallets: number
  useAntiMev: boolean
  tipAmount: number
  priorityFees: number
  slippage: number
  startTime?: string
  endTime?: string
  createdAt: string
  updatedAt: string
}

export interface Wallet {
  id: string
  address: string
  privateKey?: string
  solBalance: number
  tokenBalance: number
  tradesCount: number
  lastTrade?: string
  isDevWallet: boolean
  isFundingWallet: boolean
  tokenId?: string
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  type: "buy" | "sell"
  amount: number
  tokenAmount: number
  price: number
  txHash?: string
  status: "pending" | "completed" | "failed"
  fee?: number
  priorityFee?: number
  walletId: string
  tokenId: string
  createdAt: string
  completedAt?: string
}

export interface License {
  id: string
  key: string
  isActive: boolean
  activatedAt?: string
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

export interface SystemSettings {
  id: string
  antiBubblemap: boolean
  defaultPriorityFee: number
  updatedAt: string
}
