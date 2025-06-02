"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Plus, Trash2, Download, Upload, Tag, Coins } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WalletBatchManagerProps {
  wallets: any[]
  onGenerateWallets: (count: number) => Promise<void>
  onFundWallets: (wallets: string[], amount: number) => Promise<void>
  onTagWallets: (wallets: string[], tag: string) => Promise<void>
  onDeleteWallets: (wallets: string[]) => Promise<void>
  isGenerating: boolean
  isFunding: boolean
  isTagging: boolean
  isDeleting: boolean
}

export function WalletBatchManager({
  wallets,
  onGenerateWallets,
  onFundWallets,
  onTagWallets,
  onDeleteWallets,
  isGenerating,
  isFunding,
  isTagging,
  isDeleting,
}: WalletBatchManagerProps) {
  const [selectedTab, setSelectedTab] = useState("generate")
  const [walletCount, setWalletCount] = useState("10")
  const [fundingAmount, setFundingAmount] = useState("0.006")
  const [selectedTag, setSelectedTag] = useState("")
  const [batchSelection, setBatchSelection] = useState("all")
  const [selectedWallets, setSelectedWallets] = useState<string[]>([])
  const { toast } = useToast()

  // Handle generate wallets
  const handleGenerateWallets = async () => {
    const count = Number.parseInt(walletCount)
    if (isNaN(count) || count <= 0) {
      toast({
        title: "Invalid Count",
        description: "Please enter a valid wallet count",
        variant: "destructive",
      })
      return
    }

    await onGenerateWallets(count)
  }

  // Handle fund wallets
  const handleFundWallets = async () => {
    const amount = Number.parseFloat(fundingAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid funding amount",
        variant: "destructive",
      })
      return
    }

    const walletsToFund = getSelectedWalletAddresses()
    if (walletsToFund.length === 0) {
      toast({
        title: "No Wallets Selected",
        description: "Please select wallets to fund",
        variant: "destructive",
      })
      return
    }

    await onFundWallets(walletsToFund, amount)
  }

  // Handle tag wallets
  const handleTagWallets = async () => {
    if (!selectedTag) {
      toast({
        title: "No Tag Selected",
        description: "Please select a tag to apply",
        variant: "destructive",
      })
      return
    }

    const walletsToTag = getSelectedWalletAddresses()
    if (walletsToTag.length === 0) {
      toast({
        title: "No Wallets Selected",
        description: "Please select wallets to tag",
        variant: "destructive",
      })
      return
    }

    await onTagWallets(walletsToTag, selectedTag)
  }

  // Handle delete wallets
  const handleDeleteWallets = async () => {
    const walletsToDelete = getSelectedWalletAddresses()
    if (walletsToDelete.length === 0) {
      toast({
        title: "No Wallets Selected",
        description: "Please select wallets to delete",
        variant: "destructive",
      })
      return
    }

    await onDeleteWallets(walletsToDelete)
  }

  // Get selected wallet addresses based on batch selection
  const getSelectedWalletAddresses = (): string[] => {
    if (batchSelection === "all") {
      return wallets.map((wallet) => wallet.address)
    } else if (batchSelection === "unfunded") {
      return wallets.filter((wallet) => wallet.status === "generated").map((wallet) => wallet.address)
    } else if (batchSelection === "funded") {
      return wallets.filter((wallet) => wallet.status === "funded").map((wallet) => wallet.address)
    } else if (batchSelection === "used") {
      return wallets.filter((wallet) => wallet.status === "used").map((wallet) => wallet.address)
    } else if (batchSelection === "custom") {
      return selectedWallets
    }
    return []
  }

  // Get count of selected wallets
  const getSelectedCount = (): number => {
    return getSelectedWalletAddresses().length
  }

  return (
    <Card className="border-gray-800 bg-gray-900/30">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">Batch Wallet Management</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="bg-gray-800/50 w-full grid grid-cols-4">
            <TabsTrigger value="generate" className="data-[state=active]:bg-gray-700 text-xs">
              Generate
            </TabsTrigger>
            <TabsTrigger value="fund" className="data-[state=active]:bg-gray-700 text-xs">
              Fund
            </TabsTrigger>
            <TabsTrigger value="tag" className="data-[state=active]:bg-gray-700 text-xs">
              Tag
            </TabsTrigger>
            <TabsTrigger value="delete" className="data-[state=active]:bg-gray-700 text-xs">
              Delete
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="walletCount" className="text-xs">
                  Number of Wallets to Generate
                </Label>
                <Input
                  id="walletCount"
                  type="number"
                  min="1"
                  max="1000"
                  value={walletCount}
                  onChange={(e) => setWalletCount(e.target.value)}
                  className="bg-gray-900/50 border-gray-800 h-8 text-sm"
                />
                <p className="text-xs text-gray-500">Maximum 1,000 wallets per batch</p>
              </div>

              <Button
                onClick={handleGenerateWallets}
                disabled={isGenerating}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Generate Wallets
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="fund" className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="batchSelection" className="text-xs">
                  Select Wallets to Fund
                </Label>
                <Select value={batchSelection} onValueChange={setBatchSelection}>
                  <SelectTrigger className="bg-gray-900/50 border-gray-800 h-8 text-sm">
                    <SelectValue placeholder="Select wallets" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800 text-stone-200">
                    <SelectItem value="all">All Wallets</SelectItem>
                    <SelectItem value="unfunded">Unfunded Wallets</SelectItem>
                    <SelectItem value="custom">Custom Selection</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Selected wallets:</span>
                  <Badge variant="outline" className="bg-gray-800/50">
                    {getSelectedCount()}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fundingAmount" className="text-xs">
                  SOL Amount per Wallet
                </Label>
                <Input
                  id="fundingAmount"
                  type="number"
                  min="0.001"
                  step="0.001"
                  value={fundingAmount}
                  onChange={(e) => setFundingAmount(e.target.value)}
                  className="bg-gray-900/50 border-gray-800 h-8 text-sm"
                />
                <p className="text-xs text-gray-500">Recommended: 0.006 SOL per wallet</p>
              </div>

              <Button
                onClick={handleFundWallets}
                disabled={isFunding || getSelectedCount() === 0}
                className="w-full bg-green-600/80 hover:bg-green-700/80 text-white"
              >
                {isFunding ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Funding...
                  </>
                ) : (
                  <>
                    <Coins className="mr-2 h-4 w-4" />
                    Fund {getSelectedCount()} Wallets
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="tag" className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="batchSelectionTag" className="text-xs">
                  Select Wallets to Tag
                </Label>
                <Select value={batchSelection} onValueChange={setBatchSelection}>
                  <SelectTrigger className="bg-gray-900/50 border-gray-800 h-8 text-sm">
                    <SelectValue placeholder="Select wallets" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800 text-stone-200">
                    <SelectItem value="all">All Wallets</SelectItem>
                    <SelectItem value="funded">Funded Wallets</SelectItem>
                    <SelectItem value="used">Used Wallets</SelectItem>
                    <SelectItem value="custom">Custom Selection</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Selected wallets:</span>
                  <Badge variant="outline" className="bg-gray-800/50">
                    {getSelectedCount()}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagSelection" className="text-xs">
                  Select Tag
                </Label>
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger className="bg-gray-900/50 border-gray-800 h-8 text-sm">
                    <SelectValue placeholder="Select tag" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800 text-stone-200">
                    <SelectItem value="turboboost">TurboBoost</SelectItem>
                    <SelectItem value="highvolume">High Volume</SelectItem>
                    <SelectItem value="lowvolume">Low Volume</SelectItem>
                    <SelectItem value="test">Test</SelectItem>
                    <SelectItem value="archive">Archive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleTagWallets}
                disabled={isTagging || getSelectedCount() === 0 || !selectedTag}
                className="w-full bg-purple-600/80 hover:bg-purple-700/80 text-white"
              >
                {isTagging ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Tagging...
                  </>
                ) : (
                  <>
                    <Tag className="mr-2 h-4 w-4" />
                    Tag {getSelectedCount()} Wallets
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="delete" className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="batchSelectionDelete" className="text-xs">
                  Select Wallets to Delete
                </Label>
                <Select value={batchSelection} onValueChange={setBatchSelection}>
                  <SelectTrigger className="bg-gray-900/50 border-gray-800 h-8 text-sm">
                    <SelectValue placeholder="Select wallets" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800 text-stone-200">
                    <SelectItem value="all">All Wallets</SelectItem>
                    <SelectItem value="unfunded">Unfunded Wallets</SelectItem>
                    <SelectItem value="used">Used Wallets</SelectItem>
                    <SelectItem value="custom">Custom Selection</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Selected wallets:</span>
                  <Badge variant="outline" className="bg-gray-800/50">
                    {getSelectedCount()}
                  </Badge>
                </div>
              </div>

              <div className="bg-red-900/20 p-3 rounded-md border border-red-800/50 text-xs text-red-300">
                <p className="font-medium mb-1">Warning</p>
                <p>
                  Deleting wallets will permanently remove them from the system. This action cannot be undone. Make sure
                  to recover any SOL before deleting.
                </p>
              </div>

              <Button
                onClick={handleDeleteWallets}
                disabled={isDeleting || getSelectedCount() === 0}
                variant="destructive"
                className="w-full"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete {getSelectedCount()} Wallets
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="p-4 pt-0 flex justify-between">
          <Button variant="outline" size="sm" className="text-xs border-gray-700 bg-gray-800/50">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="text-xs border-gray-700 bg-gray-800/50">
            <Upload className="h-3.5 w-3.5 mr-1.5" />
            Import
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
