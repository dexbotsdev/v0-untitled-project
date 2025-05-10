export interface Bot {
  id: string
  name: string
  tokenAddress: string
  symbol: string
  platform: string
  strategy: string
  tradesPerMinute: number
  minTradeAmount: number
  maxTradeAmount: number
  duration: number
  antiMev: boolean
  fakeSigners: boolean
  status: "active" | "paused" | "stopped"
  progress: number
  createdAt: Date
  updatedAt: Date
}

export interface BotConfigRequest {
  name: string
  tokenAddress: string
  symbol: string
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
  botId?: string
  message?: string
}

export interface BotActionResponse {
  success: boolean
  status?: string
  message?: string
}
