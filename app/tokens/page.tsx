"use client"

import { useState } from "react"
import { TokenList } from "@/components/tokens/token-list"
import { TokenManagementWidget } from "@/components/tokens/token-management-widget"
import { Button } from "@/components/ui/button"
import { AddTokenDialog, type TokenFormData } from "@/components/tokens/add-token-dialog"

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

export default function TokensPage() {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [tokens, setTokens] = useState<Token[]>([])

  const handleSelectToken = (token: Token) => {
    setSelectedToken(token)
  }

  const handleAddToken = (tokenData: TokenFormData) => {
    const newToken: Token = {
      id: Math.floor(Math.random() * 10000), // Generate a random ID
      name: tokenData.name,
      symbol: tokenData.symbol,
      address: tokenData.hasAddress ? tokenData.address || "" : "",
      isActive: true,
      tokenType: tokenData.tokenType,
      description: tokenData.description,
      telegramUrl: tokenData.telegramUrl,
      twitterUrl: tokenData.twitterUrl,
      websiteUrl: tokenData.websiteUrl,
      image: tokenData.image,
    }

    // Update tokens list
    const updatedTokens = [...tokens, newToken]
    setTokens(updatedTokens)

    // Close dialog
    setIsAddDialogOpen(false)

    // Select the newly created token
    setSelectedToken(newToken)
  }

  return (
    <>
      <div className="bg-[#1e2133] flex flex-1 flex-col md:flex-row overflow-hidden h-[calc(100vh-3rem)]">
        {/* Token List - full width on mobile, 25% on desktop */}
        <TokenList onSelectToken={handleSelectToken} className="w-full md:w-1/4 h-auto md:h-full" />

        {/* Main content area - full width on mobile, 75% on desktop */}
        <div className="flex-1 h-full overflow-hidden">
          {selectedToken ? (
            <TokenManagementWidget selectedToken={selectedToken} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-4 sm:p-8">
                <h3 className="text-xl font-medium text-[#ECF1F0] mb-4">No Token Selected</h3>
                <p className="text-gray-400 mb-6">Select a token from the list or create a new one to get started.</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-3 text-xs border-gray-700 text-[#ECF1F0] bg-transparent hover:bg-gray-800"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  Create Token
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Token Dialog */}
      <AddTokenDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSave={handleAddToken} />
    </>
  )
}
