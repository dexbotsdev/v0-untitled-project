"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Settings, AlertCircle, Loader2, Key, Server, Copy, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  const { toast } = useToast()

  // State for wallet configuration
  const [fundingWalletPrivateKey, setFundingWalletPrivateKey] = useState("")
  const [fundingWalletAddress, setFundingWalletAddress] = useState("")
  const [devWalletPrivateKey, setDevWalletPrivateKey] = useState("")
  const [devWalletAddress, setDevWalletAddress] = useState("")
  const [isSavingWallets, setIsSavingWallets] = useState(false)
  const [walletStatus, setWalletStatus] = useState<"idle" | "success" | "error">("idle")

  // State for RPC configuration
  const [rpcUrl, setRpcUrl] = useState("https://api.mainnet-beta.solana.com")
  const [jitoRegion, setJitoRegion] = useState("us-east-1")
  const [isSavingRpc, setIsSavingRpc] = useState(false)
  const [rpcStatus, setRpcStatus] = useState<"idle" | "success" | "error">("idle")

  // Load settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        // Load wallet settings
        const savedFundingWalletPrivateKey = localStorage.getItem("fundingWalletPrivateKey")
        const savedFundingWalletAddress = localStorage.getItem("fundingWalletAddress")
        const savedDevWalletPrivateKey = localStorage.getItem("devWalletPrivateKey")
        const savedDevWalletAddress = localStorage.getItem("devWalletAddress")

        if (savedFundingWalletPrivateKey) {
          setFundingWalletPrivateKey(savedFundingWalletPrivateKey)
        }
        if (savedFundingWalletAddress) {
          setFundingWalletAddress(savedFundingWalletAddress)
        }
        if (savedDevWalletPrivateKey) {
          setDevWalletPrivateKey(savedDevWalletPrivateKey)
        }
        if (savedDevWalletAddress) {
          setDevWalletAddress(savedDevWalletAddress)
        }

        // Load RPC settings
        const savedRpcUrl = localStorage.getItem("rpcUrl")
        const savedJitoRegion = localStorage.getItem("jitoRegion")

        if (savedRpcUrl) {
          setRpcUrl(savedRpcUrl)
        }
        if (savedJitoRegion) {
          setJitoRegion(savedJitoRegion)
        }

        console.log("Settings loaded from localStorage")
      } catch (error) {
        console.error("Error loading settings from localStorage:", error)
      }
    }

    loadSettings()
  }, [])

  // Handle saving wallet configuration
  const handleSaveWallets = async () => {
    if (!fundingWalletPrivateKey || !devWalletPrivateKey) {
      toast({
        title: "Error",
        description: "Please enter both wallet private keys",
        variant: "destructive",
      })
      return
    }

    setIsSavingWallets(true)

    try {
      // Save to localStorage
      localStorage.setItem("fundingWalletPrivateKey", fundingWalletPrivateKey)
      localStorage.setItem("fundingWalletAddress", fundingWalletAddress)
      localStorage.setItem("devWalletPrivateKey", devWalletPrivateKey)
      localStorage.setItem("devWalletAddress", devWalletAddress)

      console.log("Wallet settings saved to localStorage")

      toast({
        title: "Success",
        description: "Wallet settings saved successfully",
      })

      setWalletStatus("success")
    } catch (error) {
      console.error("Error saving wallet settings:", error)
      toast({
        title: "Error",
        description: "Failed to save wallet settings",
        variant: "destructive",
      })
      setWalletStatus("error")
    } finally {
      setIsSavingWallets(false)
    }
  }

  // Handle saving RPC configuration
  const handleSaveRpc = async () => {
    if (!rpcUrl) {
      toast({
        title: "Error",
        description: "Please enter an RPC URL",
        variant: "destructive",
      })
      return
    }

    setIsSavingRpc(true)

    try {
      // Save to localStorage
      localStorage.setItem("rpcUrl", rpcUrl)
      localStorage.setItem("jitoRegion", jitoRegion)

      console.log("RPC settings saved to localStorage")

      toast({
        title: "Success",
        description: "RPC settings saved successfully",
      })

      setRpcStatus("success")
    } catch (error) {
      console.error("Error saving RPC settings:", error)
      toast({
        title: "Error",
        description: "Failed to save RPC settings",
        variant: "destructive",
      })
      setRpcStatus("error")
    } finally {
      setIsSavingRpc(false)
    }
  }

  // Generate a new wallet (this is a mock function - in a real app, you would use a proper crypto library)
  const generateWallet = (type: "funding" | "dev") => {
    // Mock wallet generation - in a real app, you would use a proper crypto library
    const mockPrivateKey = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    const mockAddress = `${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 10)}`

    if (type === "funding") {
      setFundingWalletPrivateKey(mockPrivateKey)
      setFundingWalletAddress(mockAddress)
    } else {
      setDevWalletPrivateKey(mockPrivateKey)
      setDevWalletAddress(mockAddress)
    }

    toast({
      title: "Wallet Generated",
      description: `New ${type === "funding" ? "Funding" : "Dev"} wallet has been generated. Remember to save your changes.`,
    })
  }

  // Copy to clipboard function
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied",
          description: `${label} copied to clipboard`,
        })
      },
      (err) => {
        console.error("Could not copy text: ", err)
        toast({
          title: "Error",
          description: "Failed to copy to clipboard",
          variant: "destructive",
        })
      },
    )
  }

  // Test RPC connection
  const testRpcConnection = async () => {
    setRpcStatus("idle")

    try {
      // Simulate testing the connection
      // In a real app, you would make an actual API call to test the connection
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, we'll randomly succeed or fail
      const isSuccess = Math.random() > 0.3 // 70% chance of success

      if (isSuccess) {
        toast({
          title: "Connection Successful",
          description: `Connected to RPC at ${rpcUrl}`,
        })
        setRpcStatus("success")
      } else {
        throw new Error("Connection failed")
      }
    } catch (error) {
      console.error("Error testing RPC connection:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect to the RPC. Please check the URL and try again.",
        variant: "destructive",
      })
      setRpcStatus("error")
    }
  }

  return (
    <div className="w-full px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-col gap-2 mb-8 px-1">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-amber-500" />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <p className="text-muted-foreground">Manage your application settings</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Wallet Configuration Card */}
        <Card className="bg-black border-gray-800">
          <CardHeader className="px-6 pt-6 pb-2">
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-amber-500" />
              Wallet Configuration
            </CardTitle>
            <CardDescription>Configure your funding and development wallets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {walletStatus === "error" && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Failed to save wallet configuration. Please try again.</AlertDescription>
              </Alert>
            )}

            {walletStatus === "success" && (
              <Alert className="bg-green-900/20 border-green-900 text-green-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Wallet configuration saved successfully.</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="funding-wallet-key">Funding Wallet Private Key</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateWallet("funding")}
                    className="h-7 px-2 text-xs"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Generate New
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="funding-wallet-key"
                    type="password"
                    placeholder="Enter private key"
                    value={fundingWalletPrivateKey}
                    onChange={(e) => setFundingWalletPrivateKey(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(fundingWalletPrivateKey, "Private key")}
                    disabled={!fundingWalletPrivateKey}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="funding-wallet-address">Funding Wallet Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="funding-wallet-address"
                    type="text"
                    placeholder="Wallet address will appear here"
                    value={fundingWalletAddress}
                    onChange={(e) => setFundingWalletAddress(e.target.value)}
                    className="flex-1"
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(fundingWalletAddress, "Wallet address")}
                    disabled={!fundingWalletAddress}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="dev-wallet-key">Dev Wallet Private Key</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateWallet("dev")}
                    className="h-7 px-2 text-xs"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Generate New
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="dev-wallet-key"
                    type="password"
                    placeholder="Enter private key"
                    value={devWalletPrivateKey}
                    onChange={(e) => setDevWalletPrivateKey(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(devWalletPrivateKey, "Private key")}
                    disabled={!devWalletPrivateKey}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dev-wallet-address">Dev Wallet Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="dev-wallet-address"
                    type="text"
                    placeholder="Wallet address will appear here"
                    value={devWalletAddress}
                    onChange={(e) => setDevWalletAddress(e.target.value)}
                    className="flex-1"
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(devWalletAddress, "Wallet address")}
                    disabled={!devWalletAddress}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSaveWallets}
              disabled={isSavingWallets || (!fundingWalletPrivateKey && !devWalletPrivateKey)}
              className="w-full mt-4"
            >
              {isSavingWallets && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSavingWallets ? "Saving..." : "Save Wallet Configuration"}
            </Button>
          </CardContent>
          <CardFooter className="px-6 py-4 bg-black/30">
            <p className="text-xs text-gray-500">
              These wallets will be used for funding operations and fee payments. Keep your private keys secure.
            </p>
          </CardFooter>
        </Card>

        {/* RPC Configuration Card */}
        <Card className="bg-black border-gray-800">
          <CardHeader className="px-6 pt-6 pb-2">
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-amber-500" />
              RPC Configuration
            </CardTitle>
            <CardDescription>Configure RPC endpoints and Jito settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {rpcStatus === "error" && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Failed to connect to the RPC. Please check the URL and try again.</AlertDescription>
              </Alert>
            )}

            {rpcStatus === "success" && (
              <Alert className="bg-green-900/20 border-green-900 text-green-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Successfully connected to the RPC.</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rpc-url">RPC URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="rpc-url"
                    type="text"
                    placeholder="https://api.mainnet-beta.solana.com"
                    value={rpcUrl}
                    onChange={(e) => setRpcUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={testRpcConnection} disabled={!rpcUrl}>
                    Test
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jito-region">Jito Region</Label>
                <Select value={jitoRegion} onValueChange={setJitoRegion}>
                  <SelectTrigger id="jito-region">
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                    <SelectItem value="us-west-1">US West (N. California)</SelectItem>
                    <SelectItem value="eu-central-1">EU (Frankfurt)</SelectItem>
                    <SelectItem value="ap-northeast-1">Asia Pacific (Tokyo)</SelectItem>
                    <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleSaveRpc} disabled={isSavingRpc || !rpcUrl} className="w-full mt-4">
              {isSavingRpc && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSavingRpc ? "Saving..." : "Save RPC Configuration"}
            </Button>
          </CardContent>
          <CardFooter className="px-6 py-4 bg-black/30">
            <p className="text-xs text-gray-500">
              Configure your RPC endpoints for optimal performance. Jito regions affect MEV protection and bundle
              submission.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
