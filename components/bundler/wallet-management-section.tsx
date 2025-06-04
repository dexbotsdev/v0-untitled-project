"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  const [fixedAmount, setFixedAmount] = useState(0.5)
  const [amountMode, setAmountMode] = useState("fixed")

  // Generate wallets based on selected group
  const generateWallets = (group: string) => {
    const walletCount = group === "group-1" ? 10 : group === "group-2" ? 25 : group === "group-3" ? 50 : 0
    const wallets = []

    for (let i = 0; i < walletCount; i++) {
      const randomSuffix = Math.random().toString(36).substring(2, 15)
      wallets.push({
        address: `${i + 1}xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRu${randomSuffix}`,
        amount: 0.5,
      })
    }
    return wallets
  }

  const [wallets, setWallets] = useState<Array<{ address: string; amount: number }>>(
    selectedGroup === "custom" ? walletManagement.customWallets || [] : generateWallets(selectedGroup),
  )

  const handleGroupChange = (group: string) => {
    setSelectedGroup(group)
    if (group !== "custom") {
      setWallets(generateWallets(group))
    } else {
      setWallets(walletManagement.customWallets || [])
    }
  }

  const applyFixedAmount = () => {
    setWallets(wallets.map((wallet) => ({ ...wallet, amount: fixedAmount })))
  }

  const updateWalletAmount = (index: number, amount: number) => {
    setWallets(wallets.map((wallet, i) => (i === index ? { ...wallet, amount } : wallet)))
  }

  const saveToLocalStorage = () => {
    const settings = {
      selectedGroup,
      customWallets: wallets,
      amountMode,
      fixedAmount,
    }
    localStorage.setItem("walletManagement", JSON.stringify(settings))
    alert("Wallet management settings saved to local storage")
  }

  // Calculate total SOL needed
  const totalSol = wallets.reduce((sum, wallet) => sum + wallet.amount, 0)

  return (
    <div className="space-y-6">
      <Card className="border-gray-800 bg-gray-900/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-400">Wallet Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="wallet-group" className="text-sm font-medium">
                Select Wallet Group
              </Label>
              <Select value={selectedGroup} onValueChange={handleGroupChange}>
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

            {wallets.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-300">Wallet Configuration</h3>
                  <Badge variant="outline" className="text-xs">
                    Total: {totalSol.toFixed(2)} SOL ({wallets.length} wallets)
                  </Badge>
                </div>

                <Tabs value={amountMode} onValueChange={setAmountMode} className="w-full">
                  <TabsList className="bg-gray-800/50 mb-4">
                    <TabsTrigger value="fixed" className="data-[state=active]:bg-gray-700">
                      Fixed Amount
                    </TabsTrigger>
                    <TabsTrigger value="custom" className="data-[state=active]:bg-gray-700">
                      Custom Amounts
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="fixed" className="mt-0">
                    <div className="flex items-center space-x-2 mb-4">
                      <Label htmlFor="fixed-amount" className="text-sm font-medium whitespace-nowrap">
                        Amount per wallet:
                      </Label>
                      <Input
                        id="fixed-amount"
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={fixedAmount}
                        onChange={(e) => setFixedAmount(Number.parseFloat(e.target.value) || 0)}
                        className="bg-gray-800/50 border-gray-700 text-white w-24"
                      />
                      <span className="text-sm text-gray-400">SOL</span>
                      <Button
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                        onClick={applyFixedAmount}
                      >
                        Apply
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="custom" className="mt-0">
                    <p className="text-xs text-gray-400 mb-4">Set individual amounts for each wallet below</p>
                  </TabsContent>
                </Tabs>

                <div className="border border-gray-800 rounded-md overflow-hidden max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader className="bg-gray-900 sticky top-0">
                      <TableRow className="hover:bg-transparent border-gray-800">
                        <TableHead className="text-gray-400 w-[10%]">#</TableHead>
                        <TableHead className="text-gray-400 w-[60%]">Wallet Address</TableHead>
                        <TableHead className="text-gray-400 w-[30%]">SOL Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wallets.map((wallet, index) => (
                        <TableRow key={index} className="hover:bg-gray-900/50 border-gray-800">
                          <TableCell className="text-gray-400 text-sm">{index + 1}</TableCell>
                          <TableCell className="font-mono text-xs text-gray-300">
                            <div className="truncate max-w-[300px]" title={wallet.address}>
                              {wallet.address}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                min="0.1"
                                step="0.1"
                                value={wallet.amount}
                                onChange={(e) => updateWalletAmount(index, Number.parseFloat(e.target.value) || 0)}
                                className="bg-gray-800/50 border-gray-700 text-white h-8 w-20"
                                disabled={amountMode === "fixed"}
                              />
                              <span className="text-xs text-gray-400">SOL</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
