import { NextResponse } from "next/server"
import { generateMockToken, generateMockBundlerConfig, simulateNetworkDelay } from "@/utils/mockData"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tokenSymbol = searchParams.get("symbol")

    if (!tokenSymbol) {
      return NextResponse.json({ error: "Token symbol is required" }, { status: 400 })
    }

    // Simulate network delay
    await simulateNetworkDelay()

    const mockToken = generateMockToken(tokenSymbol)
    const mockBundlerConfig = generateMockBundlerConfig(mockToken.address, 5)

    const responseData = {
      token: mockToken,
      bundler: mockBundlerConfig,
    }

    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error("Error loading token data:", error)
    return NextResponse.json({ error: "Failed to load token data" }, { status: 500 })
  }
}
