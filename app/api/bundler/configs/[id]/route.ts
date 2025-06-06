import { NextResponse } from "next/server"
import { simulateNetworkDelay } from "@/utils/mockData"
import { generateMockBundlerConfig } from "@/utils/mockData"
import { Keypair } from "@solana/web3.js"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const bundleId = Number.parseInt(params.id, 10)

    // Validate input
    if (isNaN(bundleId)) {
      return NextResponse.json({ error: "Invalid bundle ID" }, { status: 400 })
    }

    await simulateNetworkDelay()

    // In a real app, this would fetch the bundle from a database
    // For mock purposes, we'll generate a mock bundle
    const tokenAddress = Keypair.generate().publicKey.toString()
    const mockBundle = generateMockBundlerConfig(tokenAddress, Math.floor(Math.random() * 10) + 5)
    mockBundle.id = bundleId

    return NextResponse.json(mockBundle, { status: 200 })
  } catch (error) {
    console.error("Error fetching bundle configuration:", error)
    return NextResponse.json({ error: "Failed to fetch bundle configuration" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const bundleId = Number.parseInt(params.id, 10)

    // Validate input
    if (isNaN(bundleId)) {
      return NextResponse.json({ error: "Invalid bundle ID" }, { status: 400 })
    }

    const updates = await request.json()

    await simulateNetworkDelay()

    // In a real app, this would update the bundle in a database
    // For mock purposes, we'll generate a mock updated bundle
    const tokenAddress = updates.tokenAddress || Keypair.generate().publicKey.toString()
    const mockBundle = {
      ...generateMockBundlerConfig(tokenAddress, updates.walletsCount || 5),
      ...updates,
      id: bundleId,
    }

    return NextResponse.json(mockBundle, { status: 200 })
  } catch (error) {
    console.error("Error updating bundle configuration:", error)
    return NextResponse.json({ error: "Failed to update bundle configuration" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const bundleId = Number.parseInt(params.id, 10)

    // Validate input
    if (isNaN(bundleId)) {
      return NextResponse.json({ error: "Invalid bundle ID" }, { status: 400 })
    }

    await simulateNetworkDelay()

    // In a real app, this would delete the bundle from a database
    // For mock purposes, we'll just return a success response

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting bundle configuration:", error)
    return NextResponse.json({ error: "Failed to delete bundle configuration" }, { status: 500 })
  }
}
