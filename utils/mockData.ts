import { Keypair } from "@solana/web3.js"
import type { WalletAttributes } from "@/models/bundlerConfig"

export function generateMockToken(symbol: string) {
  return {
    id: Math.floor(Math.random() * 1000),
    name: `${symbol.toUpperCase()} Token`,
    symbol: symbol.toUpperCase(),
    description: `This is a mock token for ${symbol.toUpperCase()}`,
    twitter: `https://twitter.com/${symbol.toLowerCase()}`,
    telegram: `https://t.me/${symbol.toLowerCase()}group`,
    discord: `https://discord.gg/${symbol.toLowerCase()}`,
    website: `https://${symbol.toLowerCase()}.com`,
    image: `https://example.com/${symbol.toLowerCase()}.png`,
    address: Keypair.generate().publicKey.toString(),
  }
}

export function generateMockWallet(): WalletAttributes {
  const keypair = Keypair.generate()
  return {
    id: Math.floor(Math.random() * 1000),
    address: keypair.publicKey.toString(),
    privateKey: Buffer.from(keypair.secretKey).toString("hex"),
    tokenAddress: Keypair.generate().publicKey.toString(),
    tradeAmount: Number.parseFloat((Math.random() * 10).toFixed(2)),
    buyPrice: Number.parseFloat((Math.random() * 100).toFixed(4)),
    tokenAmount: Math.floor(Math.random() * 1000000),
    solAmount: Number.parseFloat((Math.random() * 10).toFixed(2)),
    tokenSupply: Math.floor(Math.random() * 1000000000),
  }
}

export function generateMockBundlerConfig(tokenAddress: string, walletsCount: number) {
  return {
    id: Math.floor(Math.random() * 1000),
    tokenAddress: tokenAddress,
    mode: ["justLaunch", "bundleBlock0", "delayedLaunch", "stagLaunch"][Math.floor(Math.random() * 4)],
    walletsCount: walletsCount,
    devWalletBuyAmount: Number.parseFloat((Math.random() * 50).toFixed(2)),
    delaySeconds: Math.floor(Math.random() * 60),
    minDelay: Math.floor(Math.random() * 30),
    maxDelay: Math.floor(Math.random() * 30) + 30,
    wallets: Array.from({ length: walletsCount }, () => generateMockWallet()),
  }
}

export async function simulateNetworkDelay(minDelay = 200, maxDelay = 1000) {
  const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay)
  await new Promise((resolve) => setTimeout(resolve, delay))
}
