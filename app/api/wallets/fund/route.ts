import { NextResponse } from "next/server"
import { simulateNetworkDelay } from "@/utils/mockData"

export async function POST(request: Request) {
  try {
    const { walletId, amount } = await request.json()

    // Validate input
    if (!walletId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid input. walletId and amount are required." }, { status: 400 })
    }

    await simulateNetworkDelay()

    // In a real app, this would update the wallet in a database
    // For mock purposes, we'll just return a success response with updated wallet
    const updatedWallet = {
      id: walletId,
      address: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      privateKey: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      nativeBalance: amount,
      name: `Wallet ${walletId}`,
      walletType: "standard",
    }

    return NextResponse.json(updatedWallet, { status: 200 })
  } catch (error) {
    console.error("Error funding wallet:", error)
    return NextResponse.json({ error: "Failed to fund wallet" }, { status: 500 })
  }
}
