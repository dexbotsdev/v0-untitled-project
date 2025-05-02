"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Header2 } from "@/components/header2"

interface Token {
  id: number
  name: string
  symbol: string
  address: string
  isActive: boolean
  tokenType: string
  description?: string
  telegramUrl?: string
  twitterUrl?: string
  websiteUrl?: string
  image?: string | null
}

export default function DashboardPage() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch tokens or use mock data
  useEffect(() => {
    // In a real app, you would fetch from an API
    // For now, we'll use mock data
    const mockTokens: Token[] = [
      {
        id: 1,
        name: "Solana",
        symbol: "SOL",
        address: "0x1234567890123456789012345678901234567890",
        isActive: true,
        tokenType: "spl",
        description: "Solana is a high-performance blockchain supporting builders around the world.",
        telegramUrl: "https://t.me/solana",
        twitterUrl: "https://twitter.com/solana",
        websiteUrl: "https://solana.com",
        image: null,
      },
      {
        id: 2,
        name: "Ethereum",
        symbol: "ETH",
        address: "0xABCDEF1234567890ABCDEF1234567890ABCDEF12",
        isActive: false,
        tokenType: "token-2022",
        description: "Ethereum is a decentralized, open-source blockchain with smart contract functionality.",
        telegramUrl: "https://t.me/ethereum",
        twitterUrl: "https://twitter.com/ethereum",
        websiteUrl: "https://ethereum.org",
        image: null,
      },
      {
        id: 3,
        name: "Binance Coin",
        symbol: "BNB",
        address: "0x7890ABCDEF1234567890ABCDEF1234567890ABCD",
        isActive: true,
        tokenType: "spl",
        description: "Binance Coin is the cryptocurrency issued by the Binance exchange.",
        telegramUrl: "https://t.me/binance",
        twitterUrl: "https://twitter.com/binance",
        websiteUrl: "https://binance.com",
        image: null,
      },
      {
        id: 4,
        name: "Cardano",
        symbol: "ADA",
        address: "0xDEF1234567890ABCDEF1234567890ABCDEF12345",
        isActive: true,
        tokenType: "token-2022",
        description: "Cardano is a proof-of-stake blockchain platform.",
        telegramUrl: "https://t.me/cardano",
        twitterUrl: "https://twitter.com/cardano",
        websiteUrl: "https://cardano.org",
        image: null,
      },
      {
        id: 5,
        name: "Polkadot",
        symbol: "DOT",
        address: "0x567890ABCDEF1234567890ABCDEF1234567890AB",
        isActive: false,
        tokenType: "spl",
        description: "Polkadot is a sharded heterogeneous multi-chain architecture.",
        telegramUrl: "https://t.me/polkadot",
        twitterUrl: "https://twitter.com/polkadot",
        websiteUrl: "https://polkadot.network",
        image: null,
      },
      {
        id: 6,
        name: "Dogecoin",
        symbol: "DOGE",
        address: "0x90ABCDEF1234567890ABCDEF1234567890ABCDEF",
        isActive: true,
        tokenType: "spl",
        description: "Dogecoin is a cryptocurrency created as a joke.",
        telegramUrl: "https://t.me/dogecoin",
        twitterUrl: "https://twitter.com/dogecoin",
        websiteUrl: "https://dogecoin.com",
        image: "/doge-meme.png",
      },
      {
        id: 7,
        name: "Pepe",
        symbol: "PEPE",
        address: "0xCDEF1234567890ABCDEF1234567890ABCDEF1234",
        isActive: true,
        tokenType: "token-2022",
        description: "Pepe is a meme cryptocurrency.",
        telegramUrl: "https://t.me/pepe",
        twitterUrl: "https://twitter.com/pepe",
        websiteUrl: "https://pepe.io",
        image: "/stylized-green-frog.png",
      },
      {
        id: 8,
        name: "Moonshot",
        symbol: "MOON",
        address: "0xEF1234567890ABCDEF1234567890ABCDEF123456",
        isActive: true,
        tokenType: "spl",
        description: "Moonshot is a speculative cryptocurrency.",
        telegramUrl: "https://t.me/moonshot",
        twitterUrl: "https://twitter.com/moonshot",
        websiteUrl: "https://moonshot.io",
        image: "/moon.png",
      },
    ]

    // Simulate loading
    setTimeout(() => {
      setTokens(mockTokens)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Function to shorten address
  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  // Function to get token type label
  const getTokenTypeLabel = (tokenTypeId: string): string => {
    const tokenTypeMap: Record<string, string> = {
      spl: "SPL Token",
      "token-2022": "Token 2022",
    }
    return tokenTypeMap[tokenTypeId] || tokenTypeId
  }

  return (
    <>
      <Header2 title="Dashboard" subtitle="Overview of all tokens and coins" />

      <div className="p-6 bg-[#1e2133] min-h-[calc(100vh-3rem)]">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="bg-[#11111D] border-gray-800 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="p-4 h-40 flex flex-col animate-pulse">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-700 mr-3"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-2/3 mb-4"></div>
                    <div className="mt-auto flex justify-between items-center">
                      <div className="h-5 bg-gray-700 rounded w-1/3"></div>
                      <div className="h-8 w-8 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tokens.map((token) => (
              <Card
                key={token.id}
                className="bg-[#11111D] border-gray-800 shadow-lg hover:shadow-xl transition-shadow hover:border-amber-700/50"
              >
                <CardContent className="p-0">
                  <div className="p-4 h-40 flex flex-col">
                    <div className="flex items-center mb-3">
                      {token.image ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-3 border border-gray-700">
                          <img
                            src={token.image || "/placeholder.svg"}
                            alt={token.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-700 to-amber-500 flex items-center justify-center mr-3">
                          <span className="text-lg font-bold text-white">{token.symbol.substring(0, 2)}</span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-[#ECF1F0] font-medium">{token.name}</h3>
                        <p className="text-gray-400 text-sm">{token.symbol}</p>
                      </div>
                    </div>

                    <p className="text-amber-400 text-xs mb-1">{shortenAddress(token.address)}</p>

                    <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                      {token.description || "No description available"}
                    </p>

                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-300">
                        {getTokenTypeLabel(token.tokenType)}
                      </span>

                      <Link
                        href={`/tokens?address=${token.address}`}
                        className="text-amber-500 hover:text-amber-400 transition-colors"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
