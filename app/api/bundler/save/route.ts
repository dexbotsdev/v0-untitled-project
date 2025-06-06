import { NextResponse } from "next/server"
import { simulateNetworkDelay } from "@/utils/mockData"
import { generateMockBundlerConfig } from "@/utils/mockData"

export async function POST(request: Request) {
  try {
    const bundlerData = await request.json()

    // Simulate network delay
    await simulateNetworkDelay()

    // Simulate processing and saving data
    console.log("Received bundler data:", bundlerData)

    // Generate a mock bundler configuration with the received data
    const mockBundlerConfig = generateMockBundlerConfig(bundlerData.tokenAddress, bundlerData.walletsCount)

    // Merge the received data with the mock data
    const savedBundlerConfig = {
      ...mockBundlerConfig,
      ...bundlerData,
      wallets: mockBundlerConfig.wallets.map((wallet, index) => ({
        ...wallet,
        tradeAmount: bundlerData.walletBuyAmounts[index] || wallet.tradeAmount,
      })),
    }

    // Simulate a successful save and return the saved data
    return NextResponse.json(
      { message: "Bundler configuration saved successfully", bundlerConfig: savedBundlerConfig },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error saving bundler configuration:", error)
    return NextResponse.json({ error: "Failed to save bundler configuration" }, { status: 500 })
  }
}
