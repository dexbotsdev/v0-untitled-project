"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Server, Wallet, Loader2, ArrowRightLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function SettingsPage() {
  const { toast } = useToast()

  // State for wallet management
  const [devWalletAddress, setDevWalletAddress] = useState("")
  const [fundingWalletAddress, setFundingWalletAddress] = useState("")
  const [importingDevWallet, setImportingDevWallet] = useState(false)
  const [importingFundingWallet, setImportingFundingWallet] = useState(false)
  const [generatingDevWallet, setGeneratingDevWallet] = useState(false)
  const [generatingFundingWallet, setGeneratingFundingWallet] = useState(false)
  const [privateKey, setPrivateKey] = useState("")

  // Add these after the existing state variables
  const [recoveringDevWallet, setRecoveringDevWallet] = useState(false)
  const [recoveringFundingWallet, setRecoveringFundingWallet] = useState(false)
  const [convertingDevWallet, setConvertingDevWallet] = useState(false)
  const [convertingFundingWallet, setConvertingFundingWallet] = useState(false)

  // Add these state variables after the other state declarations
  const [transactionServerIp, setTransactionServerIp] = useState("127.0.0.1")
  const [transactionServerPort, setTransactionServerPort] = useState("8080")
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")

  // Add state for conversion dialog
  const [isConversionDialogOpen, setIsConversionDialogOpen] = useState(false)
  const [conversionAmount, setConversionAmount] = useState("")
  const [currentWsolBalance, setCurrentWsolBalance] = useState(0.75) // Mock balance
  const [currentSolBalance, setCurrentSolBalance] = useState(1.25) // Mock balance

  // Handle wallet import
  const handleImportWallet = async (type: "dev" | "funding") => {
    if (!privateKey) {
      toast({
        title: "Error",
        description: "Please enter a private key",
        variant: "destructive",
      })
      return
    }

    if (type === "dev") {
      setImportingDevWallet(true)
    } else {
      setImportingFundingWallet(true)
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockAddress = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`

    if (type === "dev") {
      setDevWalletAddress(mockAddress)
      setImportingDevWallet(false)
    } else {
      setFundingWalletAddress(mockAddress)
      setImportingFundingWallet(false)
    }

    setPrivateKey("")

    toast({
      title: "Success",
      description: `${type === "dev" ? "Development" : "Funding"} wallet imported successfully`,
    })
  }

  // Handle wallet generation
  const handleGenerateWallet = async (type: "dev" | "funding") => {
    if (type === "dev") {
      setGeneratingDevWallet(true)
    } else {
      setGeneratingFundingWallet(true)
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockAddress = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`

    if (type === "dev") {
      setDevWalletAddress(mockAddress)
      setGeneratingDevWallet(false)
    } else {
      setFundingWalletAddress(mockAddress)
      setGeneratingFundingWallet(false)
    }

    toast({
      title: "Success",
      description: `New ${type === "dev" ? "development" : "funding"} wallet generated`,
    })
  }

  // Handle wallet recovery
  const handleRecoverWallet = async (type: "dev" | "funding") => {
    if (type === "dev" && !devWalletAddress) {
      toast({
        title: "Error",
        description: "No development wallet address found",
        variant: "destructive",
      })
      return
    }

    if (type === "funding" && !fundingWalletAddress) {
      toast({
        title: "Error",
        description: "No funding wallet address found",
        variant: "destructive",
      })
      return
    }

    if (type === "dev") {
      setRecoveringDevWallet(true)
    } else {
      setRecoveringFundingWallet(true)
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (type === "dev") {
      setRecoveringDevWallet(false)
    } else {
      setRecoveringFundingWallet(false)
    }

    toast({
      title: "Recovery Successful",
      description: `Successfully recovered funds from ${type === "dev" ? "development" : "funding"} wallet`,
    })
  }

  // Handle opening the conversion dialog
  const handleOpenConversionDialog = () => {
    if (!devWalletAddress) {
      toast({
        title: "Error",
        description: "No development wallet address found",
        variant: "destructive",
      })
      return
    }

    // Fetch current balances (mock for now)
    setCurrentWsolBalance(0.75)
    setCurrentSolBalance(1.25)
    setConversionAmount("")
    setIsConversionDialogOpen(true)
  }

  // Handle SOL-WSOL conversion
  const handleSolWsolConversion = async () => {
    if (!devWalletAddress) {
      toast({
        title: "Error",
        description: "No development wallet address found",
        variant: "destructive",
      })
      return
    }

    if (!conversionAmount || isNaN(Number.parseFloat(conversionAmount)) || Number.parseFloat(conversionAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount to convert",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(conversionAmount)
    if (amount > currentWsolBalance) {
      toast({
        title: "Error",
        description: "Conversion amount exceeds available WSOL balance",
        variant: "destructive",
      })
      return
    }

    setConvertingDevWallet(true)
    setIsConversionDialogOpen(false)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update balances (mock)
    setCurrentWsolBalance((prev) => prev - amount)
    setCurrentSolBalance((prev) => prev + amount)

    setConvertingDevWallet(false)

    toast({
      title: "Conversion Successful",
      description: `Successfully converted ${amount} WSOL to SOL for development wallet`,
    })
  }

  // Add this function after the other handler functions
  const handleTestConnection = async () => {
    // Validate inputs
    if (!transactionServerIp || !transactionServerPort) {
      toast({
        title: "Validation Error",
        description: "Please enter both IP address and port",
        variant: "destructive",
      })
      return
    }

    setIsTestingConnection(true)
    setConnectionStatus("idle")

    // Simulate API call to test connection
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, we'll randomly succeed or fail
      const isSuccess = Math.random() > 0.3

      if (isSuccess) {
        setConnectionStatus("success")
        toast({
          title: "Connection Successful",
          description: `Successfully connected to ${transactionServerIp}:${transactionServerPort}`,
        })
      } else {
        setConnectionStatus("error")
        toast({
          title: "Connection Failed",
          description: "Could not connect to the transaction server",
          variant: "destructive",
        })
      }
    } catch (error) {
      setConnectionStatus("error")
      toast({
        title: "Connection Error",
        description: "An error occurred while testing the connection",
        variant: "destructive",
      })
    } finally {
      setIsTestingConnection(false)
    }
  }

  const handleSaveServerSettings = () => {
    // Validate inputs
    if (!transactionServerIp || !transactionServerPort) {
      toast({
        title: "Validation Error",
        description: "Please enter both IP address and port",
        variant: "destructive",
      })
      return
    }

    // Save settings
    toast({
      title: "Settings Saved",
      description: "Transaction server settings have been saved",
    })
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings and database</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wallet Management Card - Keep this from the original */}
        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-amber-500" />
              Wallet Management
            </CardTitle>
            <CardDescription>Configure your development and funding wallets</CardDescription>
          </CardHeader>
          {/* Keep the existing CardContent for wallet management */}
          <CardContent className="space-y-6">
            {/* Existing wallet management content */}
            <div className="space-y-2">
              <Label htmlFor="dev-wallet">Development Wallet Address</Label>
              <Input
                id="dev-wallet"
                type="text"
                placeholder="0x..."
                value={devWalletAddress}
                onChange={(e) => setDevWalletAddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="funding-wallet">Funding Wallet Address</Label>
              <Input
                id="funding-wallet"
                type="text"
                placeholder="0x..."
                value={fundingWalletAddress}
                onChange={(e) => setFundingWalletAddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="private-key">Private Key</Label>
              <Input
                id="private-key"
                type="password"
                placeholder="Enter private key"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => handleImportWallet("dev")}
                disabled={importingDevWallet}
                variant="outline"
                className="flex-1"
              >
                {importingDevWallet && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {importingDevWallet ? "Importing..." : "Import Dev Wallet"}
              </Button>
              <Button onClick={() => handleGenerateWallet("dev")} disabled={generatingDevWallet} className="flex-1">
                {generatingDevWallet && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {generatingDevWallet ? "Generating..." : "Generate Dev Wallet"}
              </Button>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => handleImportWallet("funding")}
                disabled={importingFundingWallet}
                variant="outline"
                className="flex-1"
              >
                {importingFundingWallet && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {importingFundingWallet ? "Importing..." : "Import Funding Wallet"}
              </Button>
              <Button
                onClick={() => handleGenerateWallet("funding")}
                disabled={generatingFundingWallet}
                className="flex-1"
              >
                {generatingFundingWallet && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {generatingFundingWallet ? "Generating..." : "Generate Funding Wallet"}
              </Button>
            </div>

            <div className="flex">
              <Button
                onClick={() => handleRecoverWallet("dev")}
                disabled={recoveringDevWallet}
                variant="secondary"
                className="w-full"
              >
                {recoveringDevWallet && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {recoveringDevWallet ? "Recovering..." : "Recover Dev Wallet"}
              </Button>
            </div>

            <div className="flex">
              <Button
                onClick={handleOpenConversionDialog}
                disabled={convertingDevWallet || !devWalletAddress}
                variant="secondary"
                className="w-full"
              >
                {convertingDevWallet && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {convertingDevWallet ? "Converting..." : "Convert Dev WSOL ↔ SOL"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Server Card */}
        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-amber-500" />
              Transaction Server
            </CardTitle>
            <CardDescription>Configure connection to the transaction server</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {connectionStatus === "error" && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to connect to the transaction server. Please check your settings and try again.
                </AlertDescription>
              </Alert>
            )}

            {connectionStatus === "success" && (
              <Alert className="bg-green-900/20 border-green-900 text-green-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Successfully connected to the transaction server.</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="server-ip">Server IP Address</Label>
                <Input
                  id="server-ip"
                  type="text"
                  placeholder="e.g. 192.168.1.100"
                  value={transactionServerIp}
                  onChange={(e) => setTransactionServerIp(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="server-port">Server Port</Label>
                <Input
                  id="server-port"
                  type="text"
                  placeholder="e.g. 8080"
                  value={transactionServerPort}
                  onChange={(e) => setTransactionServerPort(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleTestConnection}
                  disabled={isTestingConnection || !transactionServerIp || !transactionServerPort}
                  variant="outline"
                  className="flex-1"
                >
                  {isTestingConnection && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isTestingConnection ? "Testing..." : "Test Connection"}
                </Button>
                <Button
                  onClick={handleSaveServerSettings}
                  disabled={!transactionServerIp || !transactionServerPort}
                  className="flex-1"
                >
                  Save Settings
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-gray-500">
              The transaction server handles all trading operations and must be running for bots to function.
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Conversion Dialog */}
      <Dialog open={isConversionDialogOpen} onOpenChange={setIsConversionDialogOpen}>
        <DialogContent className="bg-black border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-amber-500" />
              Convert WSOL to SOL
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Convert wrapped SOL (WSOL) to native SOL in your development wallet.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 p-3 rounded-md">
                <p className="text-sm text-gray-400 mb-1">Current WSOL Balance</p>
                <p className="font-mono text-lg">{currentWsolBalance.toFixed(4)} WSOL</p>
              </div>
              <div className="bg-gray-900 p-3 rounded-md">
                <p className="text-sm text-gray-400 mb-1">Current SOL Balance</p>
                <p className="font-mono text-lg">{currentSolBalance.toFixed(4)} SOL</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="conversion-amount">Amount to Convert (WSOL)</Label>
              <Input
                id="conversion-amount"
                type="number"
                step="0.0001"
                min="0.0001"
                max={currentWsolBalance}
                placeholder="Enter amount to convert"
                value={conversionAmount}
                onChange={(e) => setConversionAmount(e.target.value)}
                className="bg-gray-900 border-gray-700"
              />
              <p className="text-xs text-gray-500">Maximum: {currentWsolBalance.toFixed(4)} WSOL</p>
            </div>
          </div>

          <DialogFooter className="flex gap-3">
            <Button variant="outline" onClick={() => setIsConversionDialogOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSolWsolConversion}
              disabled={
                !conversionAmount ||
                isNaN(Number.parseFloat(conversionAmount)) ||
                Number.parseFloat(conversionAmount) <= 0 ||
                Number.parseFloat(conversionAmount) > currentWsolBalance
              }
              className="flex-1"
            >
              Convert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
