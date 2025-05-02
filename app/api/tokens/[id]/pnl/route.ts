import { NextResponse } from "next/server"
import { simulateNetworkDelay } from "@/utils/mockData"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const tokenId = Number.parseInt(params.id, 10)

    // Validate input
    if (isNaN(tokenId)) {
      return NextResponse.json({ error: "Invalid token ID" }, { status: 400 })
    }

    await simulateNetworkDelay()

    // Generate random PnL data
    const initialInvestment = Number.parseFloat((Math.random() * 10 + 1).toFixed(2))
    const profitLossPercentage = Number.parseFloat((Math.random() * 200 - 50).toFixed(2))
    const currentValue = initialInvestment * (1 + profitLossPercentage / 100)
    const profitLoss = currentValue - initialInvestment
    const buyPrice = Number.parseFloat((Math.random() * 0.01).toFixed(6))
    const currentPrice = buyPrice * (1 + profitLossPercentage / 100)
    const tokenAmount = Math.floor(initialInvestment / buyPrice)

    // Mock PnL data
    const pnlData = {
      tokenId,
      tokenSymbol: `TOKEN${tokenId}`,
      initialInvestment,
      currentValue: Number.parseFloat(currentValue.toFixed(2)),
      profitLoss: Number.parseFloat(profitLoss.toFixed(2)),
      profitLossPercentage,
      buyPrice,
      currentPrice: Number.parseFloat(currentPrice.toFixed(6)),
      tokenAmount,
    }

    return NextResponse.json(pnlData, { status: 200 })
  } catch (error) {
    console.error("Error fetching token PnL data:", error)
    return NextResponse.json({ error: "Failed to fetch token PnL data" }, { status: 500 })
  }
}
