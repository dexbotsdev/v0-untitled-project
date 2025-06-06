import { NextResponse } from "next/server"
import { simulateNetworkDelay } from "@/utils/mockData"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const walletId = Number.parseInt(params.id, 10)

    // Validate input
    if (isNaN(walletId)) {
      return NextResponse.json({ error: "Invalid wallet ID" }, { status: 400 })
    }

    await simulateNetworkDelay()

    // In a real app, this would delete the wallet from a database
    // For mock purposes, we'll just return a success response

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting wallet:", error)
    return NextResponse.json({ error: "Failed to delete wallet" }, { status: 500 })
  }
}
