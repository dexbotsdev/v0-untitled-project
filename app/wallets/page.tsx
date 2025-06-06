"use client"

import { useState } from "react"
import { WalletList } from "@/components/wallets/wallet-list"
import { Button } from "@/components/ui/button"
import { Zap, Plus, Trash2, RefreshCw, Send, Cpu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { TransactionDialog } from "@/components/wallets/transaction-dialog"
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

// Update the WalletAccount interface to include walletType
interface WalletAccount {
  id: number
  name: string
  numberOfWallets: number
  isActive: boolean
  walletType: string
}

interface GeneratedWallet {
  id: number
  address: string
  nativeBalance: number
  fundAmount: string
  selected: boolean // Add this property
}

export default function WalletsPage() {
  const [selectedAccount, setSelectedAccount] = useState<WalletAccount | null>(null)
  const [accounts, setAccounts] = useState<WalletAccount[]>([])
  const [showWalletTable, setShowWalletTable] = useState(false)
  const [generatedWallets, setGeneratedWallets] = useState<GeneratedWallet[]>([])

  const [fundAllAmount, setFundAllAmount] = useState("")
  const [selectAll, setSelectAll] = useState(false)

  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false)
  const [isRecoverAllDialogOpen, setIsRecoverAllDialogOpen] = useState(false)

  // Add state for the new dialogs
  const [isWarmupDialogOpen, setIsWarmupDialogOpen] = useState(false)
  const [isCrunchDialogOpen, setIsCrunchDialogOpen] = useState(false)

  const handleSelectAccount = (account: WalletAccount) => {
    setSelectedAccount(account)
    setShowWalletTable(false)
  }

  const handleAddAccount = (account: WalletAccount) => {
    const updatedAccounts = [...accounts, account]
    setAccounts(updatedAccounts)
  }

  // Function to get wallet type label
  const getWalletTypeLabel = (type: string) => {
    switch (type) {
      case "bundler":
        return "Bundler"
      case "volume":
        return "Volume Boost"
      case "sniper":
        return "Sniper"
      default:
        return type
    }
  }

  // Generate random wallet address
  const generateRandomAddress = () => {
    return `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`
  }

  // Handle select all wallets
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    setGeneratedWallets((wallets) => wallets.map((wallet) => ({ ...wallet, selected: checked })))
  }

  // Handle select individual wallet
  const handleSelectWallet = (id: number, checked: boolean) => {
    setGeneratedWallets((wallets) => {
      const updatedWallets = wallets.map((wallet) => (wallet.id === id ? { ...wallet, selected: checked } : wallet))

      // Update selectAll state based on whether all wallets are selected
      const allSelected = updatedWallets.every((wallet) => wallet.selected)
      setSelectAll(allSelected)

      return updatedWallets
    })
  }

  // Handle fund all wallets
  const handleFundAllWallets = () => {
    if (!fundAllAmount) {
      toast({
        title: "Fund Amount Required",
        description: "Please enter an amount to fund all wallets",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(fundAllAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive number",
        variant: "destructive",
      })
      return
    }

    // Get selected wallets or all wallets if none selected
    const selectedWallets = generatedWallets.filter((wallet) => wallet.selected)
    const walletsToFund = selectedWallets.length > 0 ? selectedWallets : generatedWallets

    if (walletsToFund.length === 0) {
      toast({
        title: "No Wallets Selected",
        description: "Please select at least one wallet to fund",
        variant: "destructive",
      })
      return
    }

    // Update the wallet balances
    setGeneratedWallets((wallets) =>
      wallets.map((wallet) => {
        if (walletsToFund.some((w) => w.id === wallet.id)) {
          return {
            ...wallet,
            nativeBalance: wallet.nativeBalance + amount,
          }
        }
        return wallet
      }),
    )

    setFundAllAmount("")

    toast({
      title: "Wallets Funded",
      description: `Successfully funded ${walletsToFund.length} wallets with ${amount} SOL each`,
    })
  }

  // Generate wallets based on selected account
  const handleGenerateWallets = () => {
    if (!selectedAccount) return

    const wallets: GeneratedWallet[] = Array.from({ length: selectedAccount.numberOfWallets }, (_, index) => ({
      id: index + 1,
      address: generateRandomAddress(),
      nativeBalance: Number.parseFloat((Math.random() * 0.5).toFixed(4)),
      fundAmount: "",
      selected: false,
    }))

    setGeneratedWallets(wallets)
    setShowWalletTable(true)
    setSelectAll(false)

    toast({
      title: "Wallets Generated",
      description: `${selectedAccount.numberOfWallets} wallets have been generated for ${selectedAccount.name}`,
    })
  }

  // Handle fund amount change
  const handleFundAmountChange = (id: number, value: string) => {
    setGeneratedWallets((wallets) =>
      wallets.map((wallet) => (wallet.id === id ? { ...wallet, fundAmount: value } : wallet)),
    )
  }

  // Handle fund wallet
  const handleFundWallet = (id: number) => {
    const wallet = generatedWallets.find((w) => w.id === id)
    if (!wallet || !wallet.fundAmount) {
      toast({
        title: "Fund Amount Required",
        description: "Please enter an amount to fund this wallet",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(wallet.fundAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive number",
        variant: "destructive",
      })
      return
    }

    // Update the wallet balance (in a real app, this would be an API call)
    setGeneratedWallets((wallets) =>
      wallets.map((w) =>
        w.id === id
          ? {
              ...w,
              nativeBalance: w.nativeBalance + amount,
              fundAmount: "",
            }
          : w,
      ),
    )

    toast({
      title: "Wallet Funded",
      description: `Successfully funded wallet #${id} with ${amount} SOL`,
    })
  }

  // Handle recover funds
  const handleRecoverFunds = (id: number) => {
    const wallet = generatedWallets.find((w) => w.id === id)
    if (!wallet) return

    if (wallet.nativeBalance <= 0) {
      toast({
        title: "No Funds to Recover",
        description: "This wallet has no funds to recover",
        variant: "destructive",
      })
      return
    }

    // Update the wallet balance (in a real app, this would be an API call)
    setGeneratedWallets((wallets) => wallets.map((w) => (w.id === id ? { ...w, nativeBalance: 0 } : w)))

    toast({
      title: "Funds Recovered",
      description: `Successfully recovered ${wallet.nativeBalance} SOL from wallet #${id}`,
    })
  }

  // Handle delete wallet
  const handleDeleteWallet = (id: number) => {
    setGeneratedWallets((wallets) => wallets.filter((w) => w.id !== id))

    toast({
      title: "Wallet Deleted",
      description: `Wallet #${id} has been deleted`,
    })
  }

  // Handle recover all funds
  const handleRecoverAllFunds = () => {
    // Get selected wallets or all wallets if none selected
    const selectedWallets = generatedWallets.filter((wallet) => wallet.selected)
    const walletsToRecover = selectedWallets.length > 0 ? selectedWallets : generatedWallets

    if (walletsToRecover.length === 0) {
      toast({
        title: "No Wallets Selected",
        description: "Please select at least one wallet to recover funds from",
        variant: "destructive",
      })
      return
    }

    // Check if any wallets have funds to recover
    const walletsWithFunds = walletsToRecover.filter((wallet) => wallet.nativeBalance > 0)
    if (walletsWithFunds.length === 0) {
      toast({
        title: "No Funds to Recover",
        description: "None of the selected wallets have funds to recover",
        variant: "destructive",
      })
      return
    }

    // Calculate total funds recovered
    const totalRecovered = walletsWithFunds.reduce((sum, wallet) => sum + wallet.nativeBalance, 0)

    // Update the wallet balances
    setGeneratedWallets((wallets) =>
      wallets.map((wallet) => {
        if (walletsToRecover.some((w) => w.id === wallet.id)) {
          return {
            ...wallet,
            nativeBalance: 0,
          }
        }
        return wallet
      }),
    )

    setIsRecoverAllDialogOpen(false)

    toast({
      title: "Funds Recovered",
      description: `Successfully recovered ${totalRecovered.toFixed(4)} SOL from ${walletsWithFunds.length} wallets`,
    })
  }

  // Handle delete all wallets
  const handleDeleteAllWallets = () => {
    // Get selected wallets or all wallets if none selected
    const selectedWallets = generatedWallets.filter((wallet) => wallet.selected)
    const walletsToDelete = selectedWallets.length > 0 ? selectedWallets : generatedWallets

    if (walletsToDelete.length === 0) {
      toast({
        title: "No Wallets Selected",
        description: "Please select at least one wallet to delete",
        variant: "destructive",
      })
      return
    }

    // Delete the wallets
    setGeneratedWallets((wallets) => wallets.filter((wallet) => !walletsToDelete.some((w) => w.id === wallet.id)))

    setIsDeleteAllDialogOpen(false)
    setSelectAll(false)

    toast({
      title: "Wallets Deleted",
      description: `Successfully deleted ${walletsToDelete.length} wallets`,
    })
  }

  // Handle warmup execution
  const handleWarmupExecution = (transactionCount: number, amount: number) => {
    // Get selected wallets or all wallets if none selected
    const selectedWallets = generatedWallets.filter((wallet) => wallet.selected)
    const walletsToWarmup = selectedWallets.length > 0 ? selectedWallets : generatedWallets

    if (walletsToWarmup.length === 0) {
      toast({
        title: "No Wallets Selected",
        description: "Please select at least one wallet to warm up",
        variant: "destructive",
      })
      return
    }

    // Check if wallets have enough balance
    const totalAmountNeeded = transactionCount * amount
    const walletsWithInsufficientFunds = walletsToWarmup.filter((wallet) => wallet.nativeBalance < totalAmountNeeded)

    if (walletsWithInsufficientFunds.length > 0) {
      toast({
        title: "Insufficient Funds",
        description: `${walletsWithInsufficientFunds.length} wallets have insufficient funds for ${transactionCount} transactions of ${amount} SOL each`,
        variant: "destructive",
      })
      return
    }

    // Simulate warmup by reducing balance (in a real app, this would be an API call)
    setGeneratedWallets((wallets) =>
      wallets.map((wallet) => {
        if (walletsToWarmup.some((w) => w.id === wallet.id)) {
          return {
            ...wallet,
            nativeBalance: Math.max(0, wallet.nativeBalance - totalAmountNeeded),
          }
        }
        return wallet
      }),
    )

    setIsWarmupDialogOpen(false)

    toast({
      title: "Warmup Executed",
      description: `Successfully executed ${transactionCount} warmup transactions of ${amount} SOL each for ${walletsToWarmup.length} wallets`,
    })
  }

  // Handle crunch execution
  const handleCrunchExecution = (transactionCount: number, amount: number) => {
    // Get selected wallets or all wallets if none selected
    const selectedWallets = generatedWallets.filter((wallet) => wallet.selected)
    const walletsToCrunch = selectedWallets.length > 0 ? selectedWallets : generatedWallets

    if (walletsToCrunch.length === 0) {
      toast({
        title: "No Wallets Selected",
        description: "Please select at least one wallet to crunch",
        variant: "destructive",
      })
      return
    }

    // Check if wallets have enough balance
    const totalAmountNeeded = transactionCount * amount
    const walletsWithInsufficientFunds = walletsToCrunch.filter((wallet) => wallet.nativeBalance < totalAmountNeeded)

    if (walletsWithInsufficientFunds.length > 0) {
      toast({
        title: "Insufficient Funds",
        description: `${walletsWithInsufficientFunds.length} wallets have insufficient funds for ${transactionCount} transactions of ${amount} SOL each`,
        variant: "destructive",
      })
      return
    }

    // Simulate crunch by reducing balance (in a real app, this would be an API call)
    setGeneratedWallets((wallets) =>
      wallets.map((wallet) => {
        if (walletsToCrunch.some((w) => w.id === wallet.id)) {
          return {
            ...wallet,
            nativeBalance: Math.max(0, wallet.nativeBalance - totalAmountNeeded),
          }
        }
        return wallet
      }),
    )

    setIsCrunchDialogOpen(false)

    toast({
      title: "Crunch Executed",
      description: `Successfully executed ${transactionCount} crunch transactions of ${amount} SOL each for ${walletsToCrunch.length} wallets`,
    })
  }

  return (
    <div className="bg-[#1e2133] flex flex-1 flex-col md:flex-row overflow-hidden h-[calc(100vh-3rem)]">
      {/* Wallet List - full width on mobile, 25% on desktop */}
      <WalletList
        onSelectAccount={handleSelectAccount}
        onAddAccount={handleAddAccount}
        className="w-full md:w-1/4 h-auto md:h-full"
      />

      {/* Main content area - full width on mobile, 75% on desktop */}
      <div className="flex-1 h-full overflow-hidden flex flex-col">
        {selectedAccount ? (
          <>
            {/* Header bar */}
            <div className="bg-[#191929] text-xs rounded-xl overflow-hidden shadow-sm border border-gray-800 m-2">
              <div className="flex flex-col sm:flex-row items-center justify-between bg-[#11111D] p-2 gap-2">
                <div className="flex items-center space-x-4">
                  <h2 className="text-sm font-medium text-[#ECF1F0]">{selectedAccount.name}</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">
                      {getWalletTypeLabel(selectedAccount.walletType)}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">
                      {selectedAccount.numberOfWallets} {selectedAccount.numberOfWallets === 1 ? "Wallet" : "Wallets"}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-3 text-xs border-gray-700 text-[#ECF1F0] bg-transparent hover:bg-gray-800"
                    onClick={handleGenerateWallets}
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" /> Generate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-3 text-xs border-gray-700 text-[#ECF1F0] bg-transparent hover:bg-gray-800"
                    onClick={() => setIsWarmupDialogOpen(true)}
                  >
                    <Zap className="mr-1 h-3.5 w-3.5" /> Warmup
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-3 text-xs border-gray-700 text-[#ECF1F0] bg-transparent hover:bg-gray-800"
                    onClick={() => setIsCrunchDialogOpen(true)}
                  >
                    <Cpu className="mr-1 h-3.5 w-3.5" /> Crunch It
                  </Button>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 p-2 overflow-auto">
              {showWalletTable ? (
                <div className="flex flex-col space-y-2">
                  {/* Fund All Wallets Bar */}
                  <div className="bg-[#191929] rounded-lg border border-gray-800 p-2">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-[#ECF1F0]">Fund All Wallets:</span>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            placeholder="Amount"
                            value={fundAllAmount}
                            onChange={(e) => setFundAllAmount(e.target.value)}
                            className="h-7 text-xs bg-[#11111D] border-gray-800 text-[#ECF1F0] w-24"
                            min="0"
                            step="0.01"
                          />
                          <span className="text-xs text-gray-400">SOL</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">
                          {generatedWallets.filter((w) => w.selected).length} of {generatedWallets.length} wallets
                          selected
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-3 text-xs border-gray-700 text-[#ECF1F0] bg-transparent hover:bg-gray-800"
                          onClick={handleFundAllWallets}
                        >
                          <Send className="mr-1 h-3.5 w-3.5" /> Fund{" "}
                          {generatedWallets.filter((w) => w.selected).length > 0 ? "Selected" : "All"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-3 text-xs border-gray-700 text-amber-400 bg-transparent hover:bg-amber-900/20"
                          onClick={() => setIsRecoverAllDialogOpen(true)}
                        >
                          <RefreshCw className="mr-1 h-3.5 w-3.5" /> Recover{" "}
                          {generatedWallets.filter((w) => w.selected).length > 0 ? "Selected" : "All"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-3 text-xs border-gray-700 text-red-400 bg-transparent hover:bg-red-900/20"
                          onClick={() => setIsDeleteAllDialogOpen(true)}
                        >
                          <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete{" "}
                          {generatedWallets.filter((w) => w.selected).length > 0 ? "Selected" : "All"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Wallets Table */}
                  <div className="rounded-lg border border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-[#11111D] text-[#ECF1F0] text-xs">
                          <tr>
                            <th className="px-2 py-2 text-center">
                              <Checkbox
                                checked={selectAll}
                                onCheckedChange={handleSelectAll}
                                className="data-[state=checked]:bg-amber-700 data-[state=checked]:border-amber-800"
                              />
                            </th>
                            <th className="px-4 py-2 text-left">Wallet ID</th>
                            <th className="px-4 py-2 text-left">Wallet Address</th>
                            <th className="px-4 py-2 text-right">Native Balance</th>
                            <th className="px-4 py-2 text-left">Fund Amount</th>
                            <th className="px-4 py-2 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-[#1A1A1A] divide-y divide-gray-800">
                          {generatedWallets.map((wallet) => (
                            <tr
                              key={wallet.id}
                              className={`hover:bg-[#222233] ${wallet.selected ? "bg-[#2A2A40]" : ""}`}
                            >
                              <td className="px-2 py-2 text-center">
                                <Checkbox
                                  checked={wallet.selected}
                                  onCheckedChange={(checked) => handleSelectWallet(wallet.id, checked === true)}
                                  className="data-[state=checked]:bg-amber-700 data-[state=checked]:border-amber-800"
                                />
                              </td>
                              <td className="px-4 py-2 text-[#ECF1F0]">#{wallet.id}</td>
                              <td className="px-4 py-2">
                                <span className="font-mono text-xs text-amber-400">
                                  {wallet.address.substring(0, 6)}...
                                  {wallet.address.substring(wallet.address.length - 4)}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-right text-[#ECF1F0]">
                                {wallet.nativeBalance.toFixed(4)} SOL
                              </td>
                              <td className="px-4 py-2">
                                <div className="flex items-center space-x-2">
                                  <Input
                                    type="number"
                                    placeholder="Amount"
                                    value={wallet.fundAmount}
                                    onChange={(e) => handleFundAmountChange(wallet.id, e.target.value)}
                                    className="h-7 text-xs bg-[#11111D] border-gray-800 text-[#ECF1F0] w-24"
                                    min="0"
                                    step="0.01"
                                  />
                                  <span className="text-xs text-gray-400">SOL</span>
                                </div>
                              </td>
                              <td className="px-4 py-2">
                                <div className="flex items-center justify-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0 text-green-500 hover:text-green-400 hover:bg-green-900/20"
                                    onClick={() => handleFundWallet(wallet.id)}
                                    title="Fund Wallet"
                                  >
                                    <Send className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0 text-amber-500 hover:text-amber-400 hover:bg-amber-900/20"
                                    onClick={() => handleRecoverFunds(wallet.id)}
                                    title="Recover Funds"
                                  >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0 text-red-500 hover:text-red-400 hover:bg-red-900/20"
                                    onClick={() => handleDeleteWallet(wallet.id)}
                                    title="Delete Wallet"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-4 sm:p-8">
                    <h3 className="text-xl font-medium text-[#ECF1F0] mb-4">Account Selected</h3>
                    <p className="text-gray-400 mb-2">Account: {selectedAccount.name}</p>
                    <p className="text-gray-400 mb-2">Number of Wallets: {selectedAccount.numberOfWallets}</p>
                    <p className="text-gray-400 mb-6">Type: {getWalletTypeLabel(selectedAccount.walletType)}</p>
                    <Button onClick={handleGenerateWallets} className="gradient-green">
                      <Plus className="mr-2 h-4 w-4" /> Generate Wallets
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4 sm:p-8">
              <h3 className="text-xl font-medium text-[#ECF1F0] mb-4">No Account Selected</h3>
              <p className="text-gray-400 mb-6">Select an account from the list or create a new one to get started.</p>
            </div>
          </div>
        )}
      </div>

      {/* Delete All Confirmation Dialog */}
      <AlertDialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
        <AlertDialogContent className="bg-[#11111D] border-gray-800 text-[#ECF1F0]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#ECF1F0]">Delete Wallets</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete{" "}
              {generatedWallets.filter((w) => w.selected).length > 0
                ? `${generatedWallets.filter((w) => w.selected).length} selected`
                : "all"}{" "}
              wallets? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-gray-700 text-[#ECF1F0] hover:bg-gray-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-700 hover:bg-red-600 text-white border-none"
              onClick={handleDeleteAllWallets}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Recover All Confirmation Dialog */}
      <AlertDialog open={isRecoverAllDialogOpen} onOpenChange={setIsRecoverAllDialogOpen}>
        <AlertDialogContent className="bg-[#11111D] border-gray-800 text-[#ECF1F0]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#ECF1F0]">Recover Funds</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to recover funds from{" "}
              {generatedWallets.filter((w) => w.selected).length > 0
                ? `${generatedWallets.filter((w) => w.selected).length} selected`
                : "all"}{" "}
              wallets?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-gray-700 text-[#ECF1F0] hover:bg-gray-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-amber-700 hover:bg-amber-600 text-white border-none"
              onClick={handleRecoverAllFunds}
            >
              Recover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Warmup Dialog */}
      <TransactionDialog
        open={isWarmupDialogOpen}
        onOpenChange={setIsWarmupDialogOpen}
        onExecute={handleWarmupExecution}
        title="Wallet Warmup"
        description="Execute transactions to warm up wallets. This will simulate normal wallet activity."
        actionLabel="Execute Warmup"
      />

      {/* Crunch Dialog */}
      <TransactionDialog
        open={isCrunchDialogOpen}
        onOpenChange={setIsCrunchDialogOpen}
        onExecute={handleCrunchExecution}
        title="Crunch Transactions"
        description="Execute high-volume transactions to crunch wallet data. This will simulate intensive wallet activity."
        actionLabel="Execute Crunch"
      />
    </div>
  )
}
