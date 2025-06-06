import { NextResponse } from "next/server"
import { BundlerSDK } from "@/lib/bundler-sdk"

// Initialize the SDK
const bundlerSDK = new BundlerSDK()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

  try {
    // Use the SDK to get tokens instead of Sequelize
    const tokens = await bundlerSDK.getTokens({ page, limit })

    return NextResponse.json(
      {
        tokens: tokens.data,
        pagination: {
          page,
          limit,
          totalPages: tokens.pagination.totalPages,
          totalCount: tokens.pagination.totalCount,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching tokens:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, symbol, address, description, twitter, telegram, discord, website, image } = body

    // Use the SDK to create a token instead of direct SQL
    const newToken = await bundlerSDK.createToken({
      name,
      symbol,
      address,
      description,
      twitter,
      telegram,
      discord,
      website,
      image,
    })

    return NextResponse.json(newToken, { status: 201 })
  } catch (error) {
    console.error("Error creating token:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
