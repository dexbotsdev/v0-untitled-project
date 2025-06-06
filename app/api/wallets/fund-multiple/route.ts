import { NextResponse } from "next/server"
import { simulateNetworkDelay } from "@/utils/mockData"

export async function POST(request: Request) {
  try {
    const { walletIds, amount } = await request.json()

    // Validate input
    if (!walletIds || !Array.isArray(walletIds) || walletIds.length === 0 || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid input. walletIds array and amount are required." }, { status: 400 })
    }

    await simulateNetworkDelay()

    // In a real app, this would update the wallets in a database
    // For mock purposes, we'll just return a success response with updated wallets
    const updatedWallets = walletIds.map((id) => ({
      id,
      address: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      privateKey: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      nativeBalance: amount,
      name: `Wallet ${id}`,
      walletType: "standard",
    }))

    return NextResponse.json(updatedWallets, { status: 200 })
  } catch (error) {
    console.error("Error funding multiple wallets:", error)
    return NextResponse.json({ error: "Failed to fund wallets" }, { status: 500 })
  }
}
