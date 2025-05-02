import { NextResponse } from "next/server"
import { sequelize } from "@/models"
import { QueryTypes } from "sequelize"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
  const offset = (page - 1) * limit

  try {
    const query = `
      SELECT 
        tm.id AS token_id,
        tm.name AS token_name,
        tm.symbol,
        tm.address,
        tm.description,
        tm.twitter,
        tm.telegram,
        tm.discord,
        tm.website,
        tm.image,
        bs.mode AS bundle_mode,
        bs.walletsCount,
        bs.devWalletBuyAmount,
        bs.delaySeconds,
        bs.minDelay,
        bs.maxDelay
      FROM 
        TokenMeta tm
      LEFT JOIN 
        BundleStatus bs ON tm.address = bs.tokenAddress
      ORDER BY 
        tm.id
      LIMIT :limit OFFSET :offset
    `

    const tokens = await sequelize.query(query, {
      replacements: { limit, offset },
      type: QueryTypes.SELECT,
    })

    const totalCountQuery = "SELECT COUNT(*) as count FROM TokenMeta"
    const [{ count }] = (await sequelize.query(totalCountQuery, {
      type: QueryTypes.SELECT,
    })) as [{ count: number }]

    return NextResponse.json(
      {
        tokens,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(count / limit),
          totalCount: count,
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

    const query = `
      INSERT INTO TokenMeta (name, symbol, address, description, twitter, telegram, discord, website, image)
      VALUES (:name, :symbol, :address, :description, :twitter, :telegram, :discord, :website, :image)
      RETURNING *
    `

    const [newToken] = await sequelize.query(query, {
      replacements: { name, symbol, address, description, twitter, telegram, discord, website, image },
      type: QueryTypes.INSERT,
    })

    return NextResponse.json(newToken, { status: 201 })
  } catch (error) {
    console.error("Error creating token:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
