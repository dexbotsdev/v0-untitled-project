import { NextResponse } from "next/server"
import { simulateNetworkDelay } from "@/utils/mockData"
import { generateMockBundlerConfig } from "@/utils/mockData"
import { Keypair } from "@solana/web3.js"

// Mock data for bundle configurations
const mockBundleConfigs = Array.from({ length: 5 }, (_, index) => {
  const tokenAddress = Keypair.generate().publicKey.toString()
  return generateMockBundlerConfig(tokenAddress, Math.floor(Math.random() * 10) + 5)
})

export async function GET() {
  try {
    await simulateNetworkDelay()
    return NextResponse.json(mockBundleConfigs, { status: 200 })
  } catch (error) {
    console.error("Error fetching bundle configurations:", error)
    return NextResponse.json({ error: "Failed to fetch bundle configurations" }, { status: 500 })
  }
}
