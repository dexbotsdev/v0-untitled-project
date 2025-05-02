// Enhanced mock data for the application

// Function to simulate network delay
export const simulateNetworkDelay = (min = 500, max = 1500) =>
  new Promise((resolve) => {
    const delay = min + Math.random() * (max - min)
    setTimeout(resolve, delay)
  })

// Function to generate a mock token
export const generateMockToken = (tokenSymbol: string) => ({
  id: Math.floor(Math.random() * 1000),
  name: `Mock Token ${tokenSymbol}`,
  symbol: tokenSymbol,
  address: `0x${Math.random().toString(16).substring(2, 42)}`,
  description: `This is a mock token with symbol ${tokenSymbol}`,
  twitter: `https://twitter.com/mocktoken`,
  telegram: `https://t.me/mocktoken`,
  discord: `https://discord.gg/mocktoken`,
  website: `https://mocktoken.com`,
  image: `/placeholder.svg`,
})

// Function to generate a mock bundler configuration
export const generateMockBundlerConfig = (tokenAddress: string, walletsCount: number) => ({
  id: Math.floor(Math.random() * 1000),
  tokenAddress: tokenAddress,
  mode: "standard",
  walletsCount: walletsCount,
  devWalletBuyAmount: 0.5,
  delaySeconds: 30,
  minDelay: 10,
  maxDelay: 60,
  wallets: Array.from({ length: walletsCount }, (_, index) => ({
    id: index + 1,
    address: `wallet_${index + 1}`,
    solAmount: Math.random() * 10,
    tokenAmount: Math.floor(Math.random() * 1000000),
    tradeAmount: Math.random() * 5,
    buyPrice: Math.random() * 0.1,
    tokenSupply: Math.floor(Math.random() * 10000000),
  })),
  status: "active",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})
