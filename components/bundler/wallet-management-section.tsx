"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Save, Plus, Trash2 } from "lucide-react"

interface WalletManagementProps {
  walletManagement?: {
    selectedGroup: string
    customWallets: Array<{
      address: string
      amount: number
    }>
  }
}

export function WalletManagementSection({ walletManagement = {} }: WalletManagementProps) {
  const [selectedGroup, setSelectedGroup] = useState(walletManagement.selectedGroup || "group-1")
  const [customWallets, setCustomWallets] = useState<Array<{ address: string; amount: number; editing?: boolean }>>(
    walletManagement.customWallets || [
      { address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosg", amount: 0.5 },
      { address: "8xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosg", amount: 0.75 },
      { address: "9xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosg", amount: 1.0 },
    ],
  )

  const [newWalletAddress, setNewWalletAddress] = useState("")
  const [newWalletAmount, setNewWalletAmount] = useState(0.5)

  const toggleEditWallet = (index: number) => {
    setCustomWallets(customWallets.map((wallet, i) => (i === index ? { ...wallet, editing: !wallet.editing } : wallet)))
  }

  const updateWalletAmount = (index: number, amount: number) => {
    setCustomWallets(customWallets.map((wallet, i) => (i === index ? { ...wallet, amount } : wallet)))
  }

  const addNewWallet = () => {
    if (newWalletAddress.trim() === "") return

    setCustomWallets([...customWallets, { address: newWalletAddress, amount: newWalletAmount }])

    setNewWalletAddress("")
    setNewWalletAmount(0.5)
  }

  const removeWallet = (index: number) => {
    setCustomWallets(customWallets.filter((_, i) => i !== index))
  }

  const saveToLocalStorage = () => {
    const settings = {
      selectedGroup,
      customWallets: customWallets.map(({ address, amount }) => ({ address, amount })),
    }
    localStorage.setItem("walletManagement", JSON.stringify(settings))
    alert("Wallet management settings saved to local storage")
  }

  // Calculate total SOL needed
  const totalSol = customWallets.reduce((sum, wallet) => sum + wallet.amount, 0)

  return (
    <div className="space-y-6">
      <Card className="border-gray-800 bg-gray-900/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-400">Wallet Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="wallet-group" className="text-sm font-medium">
                Select Wallet Group
              </Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="Select wallet group" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="group-1">Group 1 (10 wallets)</SelectItem>
                  <SelectItem value="group-2">Group 2 (25 wallets)</SelectItem>
                  <SelectItem value="group-3">Group 3 (50 wallets)</SelectItem>
                  <SelectItem value="custom">Custom Wallets</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">Select a predefined wallet group or use custom wallets</p>
            </div>

            {selectedGroup === "custom" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-300">Custom Wallet Configuration</h3>
                  <Badge variant="outline" className="text-xs">
                    Total: {totalSol.toFixed(2)} SOL
                  </Badge>
                </div>

                <div className="border border-gray-800 rounded-md overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-900">
                      <TableRow className="hover:bg-transparent border-gray-800">
                        <TableHead className="text-gray-400 w-[60%]">Wallet Address</TableHead>
                        <TableHead className="text-gray-400 w-[20%]">Amount (SOL)</TableHead>
                        <TableHead className="text-gray-400 w-[20%] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customWallets.map((wallet, index) => (
                        <TableRow key={index} className="hover:bg-gray-900/50 border-gray-800">
                          <TableCell className="font-mono text-xs text-gray-300 truncate">{wallet.address}</TableCell>
                          <TableCell>
                            {wallet.editing ? (
                              <Input
                                type="number"
                                min="0.1"
                                step="0.1"
                                value={wallet.amount}
                                onChange={(e) => updateWalletAmount(index, Number.parseFloat(e.target.value) || 0)}
                                className="bg-gray-800/50 border-gray-700 text-white h-8 w-20"
                              />
                            ) : (
                              <span className="text-gray-300">{wallet.amount} SOL</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-gray-400 hover:text-white hover:bg-gray-800"
                              onClick={() => toggleEditWallet(index)}
                            >
                              {wallet.editing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                              onClick={() => removeWallet(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex space-x-2">
                  <Input
                    placeholder="Wallet address"
                    value={newWalletAddress}
                    onChange={(e) => setNewWalletAddress(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white flex-grow"
                  />
                  <Input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={newWalletAmount}
                    onChange={(e) => setNewWalletAmount(Number.parseFloat(e.target.value) || 0)}
                    className="bg-gray-800/50 border-gray-700 text-white w-24"
                  />
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={addNewWallet}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={saveToLocalStorage}>
                Save Wallet Configuration
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
