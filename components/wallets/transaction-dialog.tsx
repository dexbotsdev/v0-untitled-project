"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExecute: (transactionCount: number, amount: number) => void
  title: string
  description: string
  actionLabel: string
}

export function TransactionDialog({
  open,
  onOpenChange,
  onExecute,
  title,
  description,
  actionLabel,
}: TransactionDialogProps) {
  const [transactionCount, setTransactionCount] = useState<number>(10)
  const [amount, setAmount] = useState<number>(0.01)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (transactionCount < 1) {
      toast({
        title: "Invalid Transaction Count",
        description: "Number of transactions must be at least 1",
        variant: "destructive",
      })
      return
    }

    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Amount must be greater than 0",
        variant: "destructive",
      })
      return
    }

    onExecute(transactionCount, amount)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#11111D] border-gray-800 text-[#ECF1F0]">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-[#ECF1F0]">{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs text-gray-400">
                {description}
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactionCount" className="text-xs text-[#ECF1F0]">
                Number of Transactions
              </Label>
              <Input
                id="transactionCount"
                type="number"
                min={1}
                value={transactionCount}
                onChange={(e) => setTransactionCount(Number.parseInt(e.target.value) || 0)}
                className="h-8 text-xs bg-[#1A1A1A] border-gray-800 text-[#ECF1F0]"
                placeholder="Enter number of transactions"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-xs text-[#ECF1F0]">
                Amount per Transaction (SOL)
              </Label>
              <Input
                id="amount"
                type="number"
                min={0.001}
                step={0.001}
                value={amount}
                onChange={(e) => setAmount(Number.parseFloat(e.target.value) || 0)}
                className="h-8 text-xs bg-[#1A1A1A] border-gray-800 text-[#ECF1F0]"
                placeholder="Enter amount per transaction"
              />
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
              {actionLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
