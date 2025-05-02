import { NextResponse } from "next/server"
import { simulateNetworkDelay } from "@/utils/mockData"

// Mock data for bundle templates
const mockBundleTemplates = [
  {
    id: "standard",
    name: "Standard Bundle",
    description: "A balanced bundle configuration for most tokens",
    config: {
      mode: "bundleBlock0",
      walletsCount: 10,
      devWalletBuyAmount: 5,
      delaySeconds: 30,
      minDelay: 10,
      maxDelay: 60,
    },
  },
  {
    id: "aggressive",
    name: "Aggressive Bundle",
    description: "High volume bundle for maximum impact",
    config: {
      mode: "justLaunch",
      walletsCount: 20,
      devWalletBuyAmount: 10,
      delaySeconds: 15,
      minDelay: 5,
      maxDelay: 30,
    },
  },
  {
    id: "conservative",
    name: "Conservative Bundle",
    description: "Slower, more natural bundle pattern",
    config: {
      mode: "delayedLaunch",
      walletsCount: 5,
      devWalletBuyAmount: 2,
      delaySeconds: 60,
      minDelay: 30,
      maxDelay: 120,
    },
  },
  {
    id: "staggered",
    name: "Staggered Launch",
    description: "Gradual wallet deployment over time",
    config: {
      mode: "stagLaunch",
      walletsCount: 15,
      devWalletBuyAmount: 3,
      delaySeconds: 45,
      minDelay: 20,
      maxDelay: 90,
    },
  },
]

export async function GET() {
  try {
    await simulateNetworkDelay()
    return NextResponse.json(mockBundleTemplates, { status: 200 })
  } catch (error) {
    console.error("Error fetching bundle templates:", error)
    return NextResponse.json({ error: "Failed to fetch bundle templates" }, { status: 500 })
  }
}
