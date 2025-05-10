"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, DollarSign, RefreshCw, Tag } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface WalletStatusCardProps {
  totalWallets: number
  generatedWallets: number
  onGenerateWallets?: () => void
  onImportWallets?: (wallets: string[]) => void
  onTagWallets?: (tag: string) => void
  onFundWallets?: (amount: number, isRange: boolean, minAmount?: number, maxAmount?: number) => void
}

export function WalletStatusCard({
  totalWallets,
  generatedWallets,
  onGenerateWallets,
  onImportWallets,
  onTagWallets,
  onFundWallets,
}: WalletStatusCardProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false)
  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false)
  const [importWalletsText, setImportWalletsText] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [selectedTag, setSelectedTag] = useState("")
  const [isTagging, setIsTagging] = useState(false)
  const [fundingType, setFundingType] = useState("fixed")
  const [fixedAmount, setFixedAmount] = useState("0.1")
  const [minAmount, setMinAmount] = useState("0.05")
  const [maxAmount, setMaxAmount] = useState("0.15")
  const [isFunding, setIsFunding] = useState(false)

  const { toast } = useToast()

  const handleGenerateWallets = async () => {
    setIsGenerating(true)
    try {
      // Call the provided callback if available
      if (onGenerateWallets) {
        await onGenerateWallets()
      } else {
        // Default implementation with a simulated delay
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      toast({
        title: "Wallets Generated",
        description: `Successfully generated ${totalWallets - generatedWallets} wallets.`,
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate wallets",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleImportWallets = async () => {
    // Validate the input
    if (!importWalletsText.trim()) {
      toast({
        title: "No Wallets Provided",
        description: "Please enter wallet addresses to import",
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)
    try {
      // Parse wallet addresses (one per line)
      const walletAddresses = importWalletsText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)

      if (walletAddresses.length === 0) {
        throw new Error("No valid wallet addresses found")
      }

      // Call the provided callback if available
      if (onImportWallets) {
        await onImportWallets(walletAddresses)
      } else {
        // Default implementation with a simulated delay
        await new Promise((resolve) => setTimeout(resolve, 1500))
      }

      // Close dialog and show success message
      setIsImportDialogOpen(false)
      setImportWalletsText("")

      toast({
        title: "Wallets Imported",
        description: `Successfully imported ${walletAddresses.length} wallets.`,
      })
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import wallets",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleTagWallets = async () => {
    // Validate selection
    if (!selectedTag) {
      toast({
        title: "No Tag Selected",
        description: "Please select a tag to continue",
        variant: "destructive",
      })
      return
    }

    setIsTagging(true)
    try {
      // Call the provided callback if available
      if (onTagWallets) {
        await onTagWallets(selectedTag)
      } else {
        // Default implementation with a simulated delay
        await new Promise((resolve) => setTimeout(resolve, 1500))
      }

      // Close dialog and show success message
      setIsTagDialogOpen(false)
      setSelectedTag("")

      toast({
        title: "Wallets Tagged",
        description: `Successfully tagged ${generatedWallets} wallets with "${selectedTag}".`,
      })
    } catch (error) {
      toast({
        title: "Tagging Failed",
        description: error instanceof Error ? error.message : "Failed to tag wallets",
        variant: "destructive",
      })
    } finally {
      setIsTagging(false)
    }
  }

  const handleFundWallets = async () => {
    // Validate inputs
    if (fundingType === "fixed") {
      const amount = Number.parseFloat(fixedAmount)
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid positive amount",
          variant: "destructive",
        })
        return
      }
    } else {
      const min = Number.parseFloat(minAmount)
      const max = Number.parseFloat(maxAmount)
      if (isNaN(min) || min <= 0 || isNaN(max) || max <= 0 || min >= max) {
        toast({
          title: "Invalid Range",
          description: "Please enter valid positive amounts with min less than max",
          variant: "destructive",
        })
        return
      }
    }

    setIsFunding(true)
    try {
      // Call the provided callback if available
      if (onFundWallets) {
        if (fundingType === "fixed") {
          await onFundWallets(Number.parseFloat(fixedAmount), false)
        } else {
          await onFundWallets(0, true, Number.parseFloat(minAmount), Number.parseFloat(maxAmount))
        }
      } else {
        // Default implementation with a simulated delay
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      // Close dialog and show success message
      setIsFundDialogOpen(false)

      toast({
        title: "Wallets Funded",
        description:
          fundingType === "fixed"
            ? `Successfully funded ${generatedWallets} wallets with ${fixedAmount} SOL each.`
            : `Successfully funded ${generatedWallets} wallets with ${minAmount}-${maxAmount} SOL each.`,
      })
    } catch (error) {
      toast({
        title: "Funding Failed",
        description: error instanceof Error ? error.message : "Failed to fund wallets",
        variant: "destructive",
      })
    } finally {
      setIsFunding(false)
    }
  }

  // Calculate estimated total funding amount
  const calculateEstimatedFunding = () => {
    if (fundingType === "fixed") {
      const amount = Number.parseFloat(fixedAmount) || 0
      return (amount * generatedWallets).toFixed(2)
    } else {
      const min = Number.parseFloat(minAmount) || 0
      const max = Number.parseFloat(maxAmount) || 0
      // Average of min and max multiplied by number of wallets
      return (((min + max) / 2) * generatedWallets).toFixed(2)
    }
  }

  return (
    <>
      <Card className="border-gray-800 bg-[#1e2133] text-stone-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Wallets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">
                {generatedWallets} / {totalWallets}
              </span>
              <div className={`text-xs ${generatedWallets === totalWallets ? "text-green-400" : "text-amber-400"}`}>
                {generatedWallets === totalWallets
                  ? "All wallets have been generated"
                  : `${totalWallets - generatedWallets} wallets needed`}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
                onClick={() => setIsImportDialogOpen(true)}
              >
                <ArrowUpRight className="h-3.5 w-3.5 mr-1.5" />
                Import
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
                onClick={handleGenerateWallets}
                disabled={isGenerating || generatedWallets === totalWallets}
              >
                <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isGenerating ? "animate-spin" : ""}`} />
                Generate
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
                onClick={() => setIsTagDialogOpen(true)}
                disabled={generatedWallets === 0}
              >
                <Tag className="h-3.5 w-3.5 mr-1.5" />
                Tag
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
                onClick={() => setIsFundDialogOpen(true)}
                disabled={generatedWallets === 0}
              >
                <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                Fund
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import Wallets Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="bg-[#1e2133] border-gray-800 text-stone-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <ArrowUpRight className="h-5 w-5 mr-2 text-blue-500" />
              Import Wallets
            </DialogTitle>
            <DialogDescription className="text-gray-400">Import existing wallets for trading.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="importWallets" className="text-sm">
                Wallet Addresses (one per line)
              </Label>
              <textarea
                id="importWallets"
                value={importWalletsText}
                onChange={(e) => setImportWalletsText(e.target.value)}
                className="w-full h-32 bg-gray-900/50 border-gray-800 rounded-md p-2 text-sm font-mono"
                placeholder="Enter wallet addresses, one per line"
              />
              <p className="text-xs text-gray-500">
                Enter each wallet address on a new line. You need approximately {totalWallets - generatedWallets} more
                wallets.
              </p>
            </div>

            <div className="bg-blue-500/10 rounded-md p-3 border border-blue-500/30">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-400">
                  <p className="font-medium mb-1">Important</p>
                  <p>Ensure you have the private keys for these wallets. The bot will need to sign transactions.</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex space-x-2 sm:space-x-0">
            <Button
              variant="outline"
              onClick={() => setIsImportDialogOpen(false)}
              className="border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleImportWallets}
              disabled={isImporting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isImporting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Import Wallets
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tag Wallets Dialog */}
      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent className="bg-[#1e2133] border-gray-800 text-stone-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <Tag className="h-5 w-5 mr-2 text-purple-400" />
              Tag Wallets
            </DialogTitle>
            <DialogDescription className="text-gray-400">Apply a tag to all wallets.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm">Select Tag</Label>
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="bg-gray-900/50 border-gray-800">
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800 text-stone-200">
                  <SelectItem value="Bullx">Bullx</SelectItem>
                  <SelectItem value="Photon">Photon</SelectItem>
                  <SelectItem value="Axiom">Axiom</SelectItem>
                  <SelectItem value="Raydium">Raydium</SelectItem>
                  <SelectItem value="Orca">Orca</SelectItem>
                  <SelectItem value="Jupiter">Jupiter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-purple-500/10 rounded-md p-3 border border-purple-500/30">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-purple-400">
                  <p className="font-medium mb-1">Tagging {generatedWallets} wallets</p>
                  <p>
                    This will apply the "{selectedTag || "..."}" tag to all wallets used by this bot. Tagged wallets can
                    be filtered and managed in the wallet management section.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex space-x-2 sm:space-x-0">
            <Button
              variant="outline"
              onClick={() => setIsTagDialogOpen(false)}
              className="border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleTagWallets}
              disabled={isTagging || !selectedTag}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isTagging ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Tagging...
                </>
              ) : (
                <>
                  <Tag className="h-4 w-4 mr-2" />
                  Apply Tag
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fund Wallets Dialog */}
      <Dialog open={isFundDialogOpen} onOpenChange={setIsFundDialogOpen}>
        <DialogContent className="bg-[#1e2133] border-gray-800 text-stone-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-amber-400" />
              Fund Wallets
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Fund all wallets with SOL from your funding wallet.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <RadioGroup value={fundingType} onValueChange={setFundingType} className="space-y-3">
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="fixed" id="fixed" className="mt-1" />
                <div className="grid gap-1.5 w-full">
                  <Label htmlFor="fixed" className="font-medium">
                    Fixed Amount
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      id="fixedAmount"
                      value={fixedAmount}
                      onChange={(e) => setFixedAmount(e.target.value)}
                      className="bg-gray-900/50 border-gray-800"
                      placeholder="0.1"
                      step="0.01"
                      min="0.001"
                      disabled={fundingType !== "fixed"}
                    />
                    <span className="text-sm text-gray-400">SOL</span>
                  </div>
                  <p className="text-xs text-gray-500">All wallets will receive exactly the same amount.</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <RadioGroupItem value="range" id="range" className="mt-1" />
                <div className="grid gap-1.5 w-full">
                  <Label htmlFor="range" className="font-medium">
                    Range of Amounts
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        id="minAmount"
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                        className="bg-gray-900/50 border-gray-800"
                        placeholder="0.05"
                        step="0.01"
                        min="0.001"
                        disabled={fundingType !== "range"}
                      />
                      <span className="text-sm text-gray-400">Min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        id="maxAmount"
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                        className="bg-gray-900/50 border-gray-800"
                        placeholder="0.15"
                        step="0.01"
                        min="0.001"
                        disabled={fundingType !== "range"}
                      />
                      <span className="text-sm text-gray-400">Max</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Each wallet will receive a random amount between min and max.</p>
                </div>
              </div>
            </RadioGroup>

            <div className="bg-amber-500/10 rounded-md p-3 border border-amber-500/30">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-400">
                  <p className="font-medium mb-1">Funding {generatedWallets} wallets</p>
                  <p>
                    Estimated total: <span className="font-bold">{calculateEstimatedFunding()} SOL</span>
                  </p>
                  <p className="mt-1">Funds will be sent from your funding wallet configured in settings.</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex space-x-2 sm:space-x-0">
            <Button
              variant="outline"
              onClick={() => setIsFundDialogOpen(false)}
              className="border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleFundWallets}
              disabled={isFunding}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isFunding ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Funding...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Fund Wallets
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
