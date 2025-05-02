import { NextResponse } from "next/server"
import { simulateNetworkDelay } from "@/utils/mockData"

export async function POST(request: Request) {
  try {
    const { walletIds } = await request.json()

    // Validate input
    if (!walletIds || !Array.isArray(walletIds) || walletIds.length === 0) {
      return NextResponse.json({ error: "Invalid input. walletIds array is required." }, { status: 400 })
    }

    await simulateNetworkDelay()

    // In a real app, this would delete the wallets from a database
    // For mock purposes, we'll just return a success response

    return NextResponse.json(
      {
        success: true,
        count: walletIds.length,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error deleting multiple wallets:", error)
    return NextResponse.json({ error: "Failed to delete wallets" }, { status: 500 })
  }
}
