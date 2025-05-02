"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TokenList } from "@/components/comment-bot/token-list"
import { CommentsLog } from "@/components/comment-bot/comments-log"
import { WizardDialog } from "@/components/comment-bot/wizard-dialog"
import { Header2 } from "@/components/header2"
import { Input } from "@/components/ui/input"

// Mock token data
const mockTokens = [
  {
    id: "1",
    name: "PEPE",
    symbol: "PEPE",
    address: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
    botType: "random",
    status: "active",
    commentCount: 156,
    lastActive: new Date().getTime() - 1000 * 60 * 5,
  },
  {
    id: "2",
    name: "DOGE",
    symbol: "DOGE",
    address: "0x4206931337deadbeef8badf00d5432a",
    botType: "shill",
    status: "paused",
    commentCount: 89,
    lastActive: new Date().getTime() - 1000 * 60 * 60 * 2,
  },
]

// Mock comments data
const generateMockComments = (tokenId: string) => {
  const comments = []
  const commentTypes = [
    "This token is going to the moon! 🚀",
    "Just bought a bag, LFG! 💰",
    "Solid team, great project! 👍",
    "This is the next 100x gem! 💎",
    "Bullish AF on this one! 🐂",
    "Dev team is based, I'm all in! 💯",
    "Chart looking juicy right now! 📈",
    "Easiest 10x of my life! 🤑",
    "Sleeping giant, get in now! 😴",
    "This project has real utility! ⚙️",
  ]

  const targetTokens = [
    "0x1234567890abcdef1234567890abcdef12345678",
    "0xabcdef1234567890abcdef1234567890abcdef12",
    "0x7890abcdef1234567890abcdef1234567890abcd",
    "0xdef1234567890abcdef1234567890abcdef12345",
  ]

  for (let i = 0; i < 20; i++) {
    const randomTime = new Date().getTime() - Math.floor(Math.random() * 1000 * 60 * 60 * 24)
    comments.push({
      id: `${tokenId}-${i}`,
      tokenId,
      targetToken: targetTokens[Math.floor(Math.random() * targetTokens.length)],
      text: commentTypes[Math.floor(Math.random() * commentTypes.length)],
      timestamp: randomTime,
      status: Math.random() > 0.2 ? "posted" : "failed",
    })
  }

  return comments.sort((a, b) => b.timestamp - a.timestamp)
}

export default function CommentBotPage() {
  const [tokens, setTokens] = useState<any[]>([])
  const [selectedToken, setSelectedToken] = useState<any | null>(null)
  const [comments, setComments] = useState<any[]>([])
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  // Load mock data
  useEffect(() => {
    setTokens(mockTokens)
    if (mockTokens.length > 0) {
      setSelectedToken(mockTokens[0])
      setComments(generateMockComments(mockTokens[0].id))
    }
  }, [])

  // Handle token selection
  const handleSelectToken = (token: any) => {
    setSelectedToken(token)
    setComments(generateMockComments(token.id))
  }

  // Handle adding a new token bot
  const handleAddToken = (tokenData: any) => {
    const newToken = {
      id: `${tokens.length + 1}`,
      name: tokenData.name || "Unknown",
      symbol: tokenData.symbol || "???",
      address: tokenData.tokenAddress,
      botType: tokenData.botType,
      status: "active",
      commentCount: 0,
      lastActive: new Date().getTime(),
    }

    const updatedTokens = [...tokens, newToken]
    setTokens(updatedTokens)
    setSelectedToken(newToken)
    setComments([])
    setIsWizardOpen(false)

    toast({
      title: "Comment Bot Created",
      description: `Your ${getBotTypeName(tokenData.botType)} bot has been created and started.`,
    })

    // Simulate comments being added over time
    setTimeout(() => {
      setComments(generateMockComments(newToken.id))
    }, 2000)
  }

  // Get readable bot type name
  const getBotTypeName = (type: string) => {
    switch (type) {
      case "random":
        return "Random Comments"
      case "shill":
        return "Shill on Launches"
      case "koth":
        return "KOTH Shill"
      case "spam":
        return "Spam Bomb"
      default:
        return "Comment Bot"
    }
  }

  // Handle bot status toggle
  const handleToggleBotStatus = (tokenId: string) => {
    const updatedTokens = tokens.map((token) => {
      if (token.id === tokenId) {
        const newStatus = token.status === "active" ? "paused" : "active"
        return { ...token, status: newStatus }
      }
      return token
    })

    setTokens(updatedTokens)

    if (selectedToken && selectedToken.id === tokenId) {
      const updatedToken = updatedTokens.find((t) => t.id === tokenId)
      setSelectedToken(updatedToken)

      toast({
        title: updatedToken.status === "active" ? "Bot Started" : "Bot Paused",
        description: `Your comment bot for ${updatedToken.symbol} has been ${updatedToken.status === "active" ? "started" : "paused"}.`,
      })
    }
  }

  return (
  <>
       <Header2 title="Comment Shillers" subtitle="Create and manage volume bots for your tokens" />

    <div className="flex h-full">
      {/* Left sidebar with token list */}
      <div className="w-80 bg-black border-r border-gray-800 h-full overflow-hidden flex flex-col">
        <div className="flex flex-col space-y-3 p-3">
          <div className="flex items-center justify-between p-2 rounded-lg text-[10px] bg-[#11111D]">
            <h2 className="text-sm font-medium text-[#ECF1F0]">Comment Bots</h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 bg-amber-700 hover:bg-amber-600 rounded-full"
              onClick={() => setIsWizardOpen(true)}
            >
              <Plus className="h-3.5 w-3.5 text-white" />
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search bots..."
              className="pl-8 bg-gray-900 border-gray-700 h-8 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {tokens.length > 0 ? (
          <TokenList
            tokens={tokens}
            selectedTokenId={selectedToken?.id}
            onSelectToken={handleSelectToken}
            onToggleStatus={handleToggleBotStatus}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <p className="text-gray-500 mb-4">No comment bots created yet</p>
            <Button onClick={() => setIsWizardOpen(true)}>Create Comment Bot</Button>
          </div>
        )}
      </div>

      {/* Main content area */}
      <div className="flex-1 h-full overflow-hidden flex flex-col">
        {selectedToken ? (
          <>
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center">
                  {selectedToken.symbol}
                  <span
                    className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                      selectedToken.status === "active"
                        ? "bg-green-900/30 text-green-400"
                        : "bg-yellow-900/30 text-yellow-400"
                    }`}
                  >
                    {selectedToken.status === "active" ? "Active" : "Paused"}
                  </span>
                </h2>
                <p className="text-sm text-gray-400">
                  {getBotTypeName(selectedToken.botType)} • {selectedToken.commentCount} comments
                </p>
              </div>

              <Button
                variant={selectedToken.status === "active" ? "destructive" : "default"}
                size="sm"
                onClick={() => handleToggleBotStatus(selectedToken.id)}
              >
                {selectedToken.status === "active" ? "Stop Bot" : "Start Bot"}
              </Button>
            </div>

            <CommentsLog comments={comments} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <p className="text-gray-500 mb-4">Select a comment bot or create a new one</p>
            <Button onClick={() => setIsWizardOpen(true)}>Create Comment Bot</Button>
          </div>
        )}
      </div>

      {/* Wizard dialog */}
      <WizardDialog isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} onCreateBot={handleAddToken} />
    </div>
    </>
  )
}
