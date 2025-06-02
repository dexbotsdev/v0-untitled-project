"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, RefreshCw, Tag } from "lucide-react"

interface TagWalletsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTagWallets: (tag: string) => void
  walletCount: number
}

export function TagWalletsDialog({ open, onOpenChange, onTagWallets, walletCount }: TagWalletsDialogProps) {
  const [selectedTag, setSelectedTag] = useState("")
  const [isTagging, setIsTagging] = useState(false)
  const { toast } = useToast()

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
      // Call the provided callback
      await onTagWallets(selectedTag)

      // Close dialog and show success message
      onOpenChange(false)
      setSelectedTag("")

      toast({
        title: "Wallets Tagged",
        description: `Successfully tagged ${walletCount} wallets with "${selectedTag}".`,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1e2133] border-gray-800 text-stone-200 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <Tag className="h-5 w-5 mr-2 text-purple-400" />
            Tag Wallets
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm">Select Tag</Label>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="bg-gray-900/50 border-gray-800">
                <SelectValue placeholder="Select a tag" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800 text-stone-200">
                <SelectItem value="TurboBoost">TurboBoost</SelectItem>
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
                <p className="font-medium mb-1">Tagging {walletCount} wallets</p>
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
            onClick={() => onOpenChange(false)}
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
  )
}
