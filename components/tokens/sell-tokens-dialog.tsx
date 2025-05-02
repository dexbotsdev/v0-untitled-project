"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Percent } from "lucide-react"

interface SellTokensDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (percentage: number) => void
  selectedWallets: number[]
  totalTokens: number
}

export function SellTokensDialog({
  open,
  onOpenChange,
  onConfirm,
  selectedWallets,
  totalTokens,
}: SellTokensDialogProps) {
  const [percentage, setPercentage] = useState<number>(10)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (percentage <= 0 || percentage > 100) {
      toast({
        title: "Invalid Percentage",
        description: "Please enter a percentage between 1 and 100",
        variant: "destructive",
      })
      return
    }

    onConfirm(percentage)
  }

  const estimatedTokensToSell = Math.floor(totalTokens * (percentage / 100))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#11111D] border-gray-800 text-[#ECF1F0]">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-[#ECF1F0]">Sell Tokens</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="percentage" className="text-xs text-[#ECF1F0] flex items-center">
                <Percent className="h-3.5 w-3.5 mr-1.5" /> Percentage of Tokens to Sell
              </Label>
              <Input
                id="percentage"
                type="number"
                min={1}
                max={100}
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                className="h-8 text-xs bg-[#1A1A1A] border-gray-800 text-[#ECF1F0]"
                placeholder="Enter percentage (1-100)"
              />
            </div>

            <div className="space-y-2 bg-amber-900/10 p-3 rounded-md border border-amber-800/30">
              <div className="text-xs text-gray-400">
                Selected Wallets: <span className="text-amber-400">{selectedWallets.length}</span>
              </div>
              <div className="text-xs text-gray-400">
                Total Tokens Available: <span className="text-amber-400">{totalTokens.toLocaleString()}</span>
              </div>
              <div className="text-xs text-gray-400">
                Estimated Tokens to Sell:{" "}
                <span className="text-amber-400">{estimatedTokensToSell.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs bg-transparent border-gray-700 text-[#ECF1F0] hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button type="submit" className="h-8 text-xs gradient-green">
              Confirm Sale
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
