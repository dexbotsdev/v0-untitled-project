"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"

interface AddWalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (name: string, numberOfWallets: number, walletType: string) => void
}

export function AddWalletDialog({ open, onOpenChange, onSave }: AddWalletDialogProps) {
  const [accountName, setAccountName] = useState("")
  const [numberOfWallets, setNumberOfWallets] = useState<number>(1)
  const [walletType, setWalletType] = useState("bundler")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!accountName.trim()) {
      toast({
        title: "Account Name Required",
        description: "Please enter an account name",
        variant: "destructive",
      })
      return
    }

    if (numberOfWallets < 1) {
      toast({
        title: "Invalid Number of Wallets",
        description: "Number of wallets must be at least 1",
        variant: "destructive",
      })
      return
    }

    onSave(accountName, numberOfWallets, walletType)

    // Reset form
    setAccountName("")
    setNumberOfWallets(1)
    setWalletType("bundler")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#11111D] border-gray-800 text-[#ECF1F0]">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-[#ECF1F0]">Add New Account</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="accountName" className="text-xs text-[#ECF1F0]">
                Account Name
              </Label>
              <Input
                id="accountName"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="h-8 text-xs bg-[#1A1A1A] border-gray-800 text-[#ECF1F0]"
                placeholder="Enter account name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfWallets" className="text-xs text-[#ECF1F0]">
                Number of Wallets
              </Label>
              <Input
                id="numberOfWallets"
                type="number"
                min={1}
                value={numberOfWallets}
                onChange={(e) => setNumberOfWallets(Number.parseInt(e.target.value) || 0)}
                className="h-8 text-xs bg-[#1A1A1A] border-gray-800 text-[#ECF1F0]"
                placeholder="Enter number of wallets"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-[#ECF1F0]">Wallet Group Type</Label>
              <RadioGroup
                value={walletType}
                onValueChange={setWalletType}
                className="border border-gray-800 rounded-md p-2 bg-[#1A1A1A]"
              >
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="bundler" value="bundler" className="border-gray-600 text-amber-600" />
                    <Label htmlFor="bundler" className="text-xs text-[#ECF1F0]">
                      Bundler
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="volume" value="volume" className="border-gray-600 text-amber-600" />
                    <Label htmlFor="volume" className="text-xs text-[#ECF1F0]">
                      Volume Boost
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="sniper" value="sniper" className="border-gray-600 text-amber-600" />
                    <Label htmlFor="sniper" className="text-xs text-[#ECF1F0]">
                      Sniper
                    </Label>
                  </div>
                </div>
              </RadioGroup>
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
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
