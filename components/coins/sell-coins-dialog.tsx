"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface SellCoinsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (percentage: number) => void
  selectedWallets: number[]
  totalCoins: number
}

export function SellCoinsDialog({ open, onOpenChange, onConfirm, selectedWallets, totalCoins }: SellCoinsDialogProps) {
  const [percentage, setPercentage] = useState(50)

  const handleConfirm = () => {
    onConfirm(percentage)
  }

  // Calculate coins to sell based on percentage
  const coinsToSell = Math.floor(totalCoins * (percentage / 100))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#11111D] border-gray-800 text-[#ECF1F0]">
        <DialogHeader>
          <DialogTitle className="text-[#ECF1F0]">Sell Coins</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {selectedWallets.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-amber-400 mb-2">No Wallets Selected</p>
              <p className="text-gray-400 text-sm">Please select at least one wallet to sell coins from.</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">
                  Selling from <span className="text-amber-400">{selectedWallets.length}</span> wallets with a total of{" "}
                  <span className="text-amber-400">{totalCoins.toLocaleString()}</span> coins.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="percentage" className="text-sm">
                      Percentage to Sell
                    </Label>
                    <span className="text-amber-400 font-medium">{percentage}%</span>
                  </div>
                  <Slider
                    id="percentage"
                    min={1}
                    max={100}
                    step={1}
                    value={[percentage]}
                    onValueChange={(value) => setPercentage(value[0])}
                    className="[&_[role=slider]]:bg-amber-600"
                  />
                </div>

                <div className="bg-[#1A1A1A] rounded-md p-3 border border-gray-800">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Coins to Sell:</span>
                    <span className="text-[#ECF1F0]">{coinsToSell.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Estimated SOL Return:</span>
                    <span className="text-amber-400">{(coinsToSell * 0.0000025).toFixed(3)} SOL</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-gray-700 text-[#ECF1F0] hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-amber-700 hover:bg-amber-600 text-white"
            disabled={selectedWallets.length === 0}
          >
            Sell Coins
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
