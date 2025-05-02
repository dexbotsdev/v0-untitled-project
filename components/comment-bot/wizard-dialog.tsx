"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Search, ArrowRight } from "lucide-react"

interface WizardDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreateBot: (data: any) => void
}

export function WizardDialog({ isOpen, onClose, onCreateBot }: WizardDialogProps) {
  const [step, setStep] = useState(1)
  const [botType, setBotType] = useState<string | null>(null)
  const [tokenAddress, setTokenAddress] = useState("")
  const [tokenDetails, setTokenDetails] = useState<any | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  // Reset state when dialog closes
  const handleClose = () => {
    setStep(1)
    setBotType(null)
    setTokenAddress("")
    setTokenDetails(null)
    onClose()
  }

  // Handle bot type selection
  const handleSelectBotType = (type: string) => {
    setBotType(type)
    setStep(2)
  }

  // Handle token search
  const handleSearchToken = () => {
    if (!tokenAddress) return

    setIsSearching(true)

    // Simulate API call
    setTimeout(() => {
      // Mock token details
      const mockDetails = {
        name: botType === "spam" ? "Enemy Token" : "My Token",
        symbol: botType === "spam" ? "ENEMY" : "MINE",
        price: "$0.00012",
        marketCap: "$120,000",
        holders: 230,
      }

      setTokenDetails(mockDetails)
      setIsSearching(false)
    }, 1000)
  }

  // Handle create bot
  const handleCreateBot = () => {
    onCreateBot({
      tokenAddress,
      botType,
      name: tokenDetails?.name,
      symbol: tokenDetails?.symbol,
    })
  }

  // Get bot type description
  const getBotTypeDescription = (type: string) => {
    switch (type) {
      case "random":
        return "Post random positive comments on your token to create engagement and activity."
      case "shill":
        return "Automatically promote your token on all new token launches to attract investors."
      case "koth":
        return "Target King of the Hill tokens to redirect attention to your project."
      case "spam":
        return "Flood a competitor's token with comments to disrupt their community."
      default:
        return ""
    }
  }

  // Get bot type title
  const getBotTypeTitle = (type: string) => {
    switch (type) {
      case "random":
        return "Random Comments on My Token"
      case "shill":
        return "Shill My Coin on all Launches"
      case "koth":
        return "Shill on new KOTH"
      case "spam":
        return "Spam Bomb my Enemy"
      default:
        return ""
    }
  }

  // Get example comments for the selected bot type
  const getExampleComments = () => {
    if (!botType) return []

    switch (botType) {
      case "random":
        return [
          "This token is going to the moon! 🚀",
          "Just bought a bag, LFG! 💰",
          "Solid team, great project! 👍",
          "Holding strong, diamond hands! 💎",
          "Best community in crypto! ❤️",
        ]
      case "shill":
        return [
          "Check out $MINE instead, real gem! 💎",
          "Forget this launch, $MINE is the real deal! 🚀",
          "Why launch this when $MINE exists? Much better tokenomics!",
          "$MINE is pumping right now! Don't miss out!",
          "Just sold this to buy more $MINE! Best decision ever!",
        ]
      case "koth":
        return [
          "KOTH is cool but have you seen $MINE? 👀",
          "Congrats on KOTH! Now check out $MINE for the next pump! 🚀",
          "$MINE will be the next KOTH, mark my words!",
          "KOTH holders should diversify into $MINE! Great opportunity!",
          "From one KOTH to another - $MINE is next up!",
        ]
      case "spam":
        return [
          "This token is a scam! Avoid at all costs! ⚠️",
          "Dev just rugged their last project! Be careful!",
          "Liquidity is too low, will dump soon!",
          "Contract has backdoor, check function at line 420!",
          "Team is anonymous for a reason! DYOR!",
        ]
      default:
        return []
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] bg-gray-950 border-gray-800">
        <DialogHeader>
          <DialogTitle>{step === 1 ? "Create Comment Bot" : getBotTypeTitle(botType || "")}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          {step === 1 ? (
            <div className="space-y-4 py-2">
              <p className="text-sm text-gray-400 mb-4">Select a comment bot strategy:</p>

              <div className="grid grid-cols-1 gap-3">
                {["random", "shill", "koth", "spam"].map((type) => (
                  <button
                    key={type}
                    className="flex items-start p-3 rounded-md border border-gray-800 hover:border-amber-600/50 hover:bg-amber-900/10 transition-all duration-200"
                    onClick={() => handleSelectBotType(type)}
                  >
                    <div className="mr-3 mt-1">
                      <div className="w-8 h-8 rounded-full bg-amber-900/30 flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-amber-500" />
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-medium text-white">{getBotTypeTitle(type)}</h3>
                      <p className="text-xs text-gray-400 mt-1">{getBotTypeDescription(type)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="space-y-3">
                <Label htmlFor="tokenAddress">
                  {botType === "spam" ? "Enemy Token Address" : "Your Token Address"}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="tokenAddress"
                    placeholder="Enter token address"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={!tokenAddress || isSearching}
                    onClick={handleSearchToken}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {tokenDetails && (
                <>
                  <div className="rounded-md border border-gray-800 p-3 mt-4">
                    <h3 className="text-sm font-medium text-white mb-2">Token Details</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-gray-400">Name:</div>
                      <div className="text-white">{tokenDetails.name}</div>

                      <div className="text-gray-400">Symbol:</div>
                      <div className="text-white">{tokenDetails.symbol}</div>

                      <div className="text-gray-400">Price:</div>
                      <div className="text-white">{tokenDetails.price}</div>

                      <div className="text-gray-400">Market Cap:</div>
                      <div className="text-white">{tokenDetails.marketCap}</div>

                      <div className="text-gray-400">Holders:</div>
                      <div className="text-white">{tokenDetails.holders}</div>
                    </div>
                  </div>

                  <div className="rounded-md border border-gray-800 p-3 mt-4">
                    <h3 className="text-sm font-medium text-white mb-2">Example Comments</h3>
                    <div className="space-y-2">
                      {getExampleComments().map((comment, index) => (
                        <div key={index} className="text-xs p-2 rounded bg-gray-900 text-gray-300">
                          {comment}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-md border border-amber-800/30 bg-amber-900/10 p-3 mt-4">
                    <h3 className="text-sm font-medium text-amber-400 mb-1">Bot Summary</h3>
                    <p className="text-xs text-gray-300">
                      This bot will{" "}
                      {botType === "random"
                        ? "post random positive comments on your token"
                        : botType === "shill"
                          ? "promote your token on all new launches"
                          : botType === "koth"
                            ? "target King of the Hill tokens to promote your token"
                            : "post disruptive comments on the enemy token"}
                      .
                    </p>
                    <p className="text-xs text-gray-300 mt-1">Estimated comments: 50-100 per day</p>
                  </div>
                </>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-end gap-2 mt-4">
          {step === 1 ? (
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button disabled={!tokenDetails} onClick={handleCreateBot}>
                Create Bot
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
