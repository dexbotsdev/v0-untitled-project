import { NextResponse } from "next/server"
import { simulateNetworkDelay } from "@/utils/mockData"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const tokenId = Number.parseInt(params.id, 10)
    const { amount } = await request.json()

    // Validate input
    if (isNaN(tokenId) || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid input. Valid tokenId and amount are required." }, { status: 400 })
    }

    // Simulate a longer delay for selling tokens
    await simulateNetworkDelay(1000, 3000)

    // Generate a mock transaction hash
    const transactionHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`

    // Calculate a random received value
    const receivedValue = Number.parseFloat((amount * Math.random() * 0.01).toFixed(4))

    // Mock sell response
    const sellResponse = {
      success: true,
      soldAmount: amount,
      receivedValue,
      transactionHash,
    }

    return NextResponse.json(sellResponse, { status: 200 })
  } catch (error) {
    console.error("Error selling tokens:", error)
    return NextResponse.json({ error: "Failed to sell tokens" }, { status: 500 })
  }
}
