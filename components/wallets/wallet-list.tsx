"use client"

import type React from "react"

import { useState } from "react"
import { Search, Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { AddWalletDialog } from "@/components/wallets/add-wallet-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface WalletListProps {
  onSelectAccount: (account: WalletAccount) => void
  onAddAccount: (account: WalletAccount) => void
  className?: string
}

// Update the WalletAccount interface to include walletType
export interface WalletAccount {
  id: number
  name: string
  numberOfWallets: number
  isActive: boolean
  walletType: string
}

export function WalletList({ onSelectAccount, onAddAccount, className }: WalletListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [accountToDelete, setAccountToDelete] = useState<WalletAccount | null>(null)

  // Update the initial mock data to include walletType
  const [accounts, setAccounts] = useState<WalletAccount[]>([
    {
      id: 1,
      name: "Main Bank",
      numberOfWallets: 24,
      isActive: true,
      walletType: "bundler",
    },
    {
      id: 2,
      name: "Trading Account",
      numberOfWallets: 12,
      isActive: true,
      walletType: "volume",
    },
    {
      id: 3,
      name: "Reserve Fund",
      numberOfWallets: 8,
      isActive: false,
      walletType: "sniper",
    },
  ])

  const filteredAccounts = accounts.filter((account) => account.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSelectAccount = (account: WalletAccount) => {
    setSelectedAccountId(account.id)
    onSelectAccount(account)
  }

  // Update the handleAddAccount function to accept walletType
  const handleAddAccount = (name: string, numberOfWallets: number, walletType: string) => {
    const newAccount: WalletAccount = {
      id: accounts.length + 1,
      name,
      numberOfWallets,
      isActive: true,
      walletType,
    }

    setAccounts([...accounts, newAccount])
    setIsAddDialogOpen(false)
    onAddAccount(newAccount)
  }

  const openDeleteDialog = (account: WalletAccount, e: React.MouseEvent) => {
    e.stopPropagation()
    setAccountToDelete(account)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteAccount = () => {
    if (!accountToDelete) return

    const updatedAccounts = accounts.filter((account) => account.id !== accountToDelete.id)
    setAccounts(updatedAccounts)
    setIsDeleteDialogOpen(false)
    setAccountToDelete(null)

    // If the deleted account was selected, clear the selection
    if (selectedAccountId === accountToDelete.id) {
      setSelectedAccountId(null)
    }
  }

  return (
    <div className={cn("flex flex-col h-full bg-black w-full md:w-1/4", className)}>
      <div className="flex items-center justify-between p-2 m-3 rounded-lg text-[10px] bg-[#11111D]">
        <h2 className="text-sm font-medium text-[#ECF1F0]">Bank</h2>
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 bg-amber-700 hover:bg-amber-600 rounded-full"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-3.5 w-3.5 text-white" />
        </Button>
      </div>

      <div className="p-3 border-b border-gray-800">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 bg-[#11111D] border-gray-800 text-[#ECF1F0] text-sm"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 max-h-screen">
        <div className="p-1">
          {filteredAccounts.length === 0 ? (
            <div className="text-center py-4 text-gray-400 text-sm">
              No accounts found. Add a new account to get started.
            </div>
          ) : (
            filteredAccounts.map((account) => (
              <div
                key={account.id}
                className={cn(
                  "flex items-center p-3 rounded-md cursor-pointer mb-1 hover:bg-gray-800/30 group",
                  selectedAccountId === account.id ? "bg-gray-800/50" : "",
                )}
                onClick={() => handleSelectAccount(account)}
              >
                <Checkbox
                  checked={selectedAccountId === account.id}
                  className="mr-3 data-[state=checked]:bg-amber-700 data-[state=checked]:border-amber-800"
                  onCheckedChange={() => handleSelectAccount(account)}
                />
                <div className="w-8 h-8 rounded-full bg-gradient-green flex items-center justify-center mr-3">
                  <span className="text-xs font-bold text-white">{account.name.substring(0, 2)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#ECF1F0] truncate">{account.name}</p>
                    <div className="flex items-center space-x-1">
                      <div className={cn("w-2 h-2 rounded-full", account.isActive ? "bg-amber-700" : "bg-red-500")} />
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-400 hover:bg-red-900/20"
                                onClick={(e) => openDeleteDialog(account, e)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-stone-800 text-stone-200 border-stone-700 text-xs">
                              Delete account
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 truncate">
                      {account.numberOfWallets} {account.numberOfWallets === 1 ? "Wallet" : "Wallets"}
                    </p>
                    <span
                      className={cn(
                        "text-[8px] px-1.5 py-0.5 rounded text-gray-300",
                        account.walletType === "bundler"
                          ? "bg-amber-700/50"
                          : account.walletType === "volume"
                            ? "bg-green-700/50"
                            : "bg-purple-700/50",
                      )}
                    >
                      {account.walletType === "bundler"
                        ? "Bundler"
                        : account.walletType === "volume"
                          ? "Volume Boost"
                          : "Sniper"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Add Wallet Dialog */}
      <AddWalletDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSave={handleAddAccount} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#11111D] border-gray-800 text-[#ECF1F0]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#ECF1F0]">Delete Account</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete {accountToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-gray-700 text-[#ECF1F0] hover:bg-gray-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="gradient-green" onClick={handleDeleteAccount}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
