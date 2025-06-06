import { NextResponse } from "next/server"
import { simulateNetworkDelay } from "@/utils/mockData"
import { Keypair } from "@solana/web3.js"

export async function POST(request: Request) {
  try {
    const { accountId, count } = await request.json()

    // Validate input
    if (!accountId || !count || count <= 0) {
      return NextResponse.json({ error: "Invalid input. accountId and count are required." }, { status: 400 })
    }

    await simulateNetworkDelay()

    // Generate the requested number of wallets
    const wallets = Array.from({ length: count }, (_, index) => {
      const keypair = Keypair.generate()
      return {
        id: index + 1,
        address: keypair.publicKey.toString(),
        privateKey: Buffer.from(keypair.secretKey).toString("hex"),
        nativeBalance: Number.parseFloat((Math.random() * 0.5).toFixed(4)),
        name: `Wallet ${index + 1}`,
        walletType: "standard",
      }
    })

    return NextResponse.json(wallets, { status: 200 })
  } catch (error) {
    console.error("Error generating wallets:", error)
    return NextResponse.json({ error: "Failed to generate wallets" }, { status: 500 })
  }
}
