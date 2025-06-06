import { NextResponse } from "next/server"
import { simulateNetworkDelay } from "@/utils/mockData"

// Mock data for wallet accounts
const mockWalletAccounts = [
  {
    id: 1,
    name: "Main Bundler Account",
    numberOfWallets: 10,
    isActive: true,
    walletType: "bundler",
  },
  {
    id: 2,
    name: "Volume Boost Account",
    numberOfWallets: 5,
    isActive: true,
    walletType: "volume",
  },
  {
    id: 3,
    name: "Sniper Account",
    numberOfWallets: 3,
    isActive: false,
    walletType: "sniper",
  },
]

export async function GET() {
  try {
    await simulateNetworkDelay()
    return NextResponse.json(mockWalletAccounts, { status: 200 })
  } catch (error) {
    console.error("Error fetching wallet accounts:", error)
    return NextResponse.json({ error: "Failed to fetch wallet accounts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await simulateNetworkDelay()

    // Create a new wallet account with a generated ID
    const newAccount = {
      id: Math.max(0, ...mockWalletAccounts.map((account) => account.id)) + 1,
      name: body.name,
      numberOfWallets: body.numberOfWallets,
      isActive: body.isActive ?? true,
      walletType: body.walletType,
    }

    // In a real app, this would be saved to a database
    mockWalletAccounts.push(newAccount)

    return NextResponse.json(newAccount, { status: 201 })
  } catch (error) {
    console.error("Error creating wallet account:", error)
    return NextResponse.json({ error: "Failed to create wallet account" }, { status: 500 })
  }
}
