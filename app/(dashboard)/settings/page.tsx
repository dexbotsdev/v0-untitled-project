"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { ArrowRightLeft, Settings, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SettingsPage() {
  const { toast } = useToast()

  // State for transaction server management
  const [transactionServerIp, setTransactionServerIp] = useState("127.0.0.1")
  const [transactionServerPort, setTransactionServerPort] = useState("8080")
  const [isSavingTransactionServer, setIsSavingTransactionServer] = useState(false)
  const [isTestingTransactionServer, setIsTestingTransactionServer] = useState(false)
  const [transactionServerStatus, setTransactionServerStatus] = useState<"idle" | "success" | "error">("idle")

  // Load Transaction Server settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        // Load Transaction Server settings
        const savedTransactionServerIp = localStorage.getItem("transactionServerIp")
        const savedTransactionServerPort = localStorage.getItem("transactionServerPort")
        if (savedTransactionServerIp) {
          setTransactionServerIp(savedTransactionServerIp)
        }
        if (savedTransactionServerPort) {
          setTransactionServerPort(savedTransactionServerPort)
        }

        console.log("Transaction Server settings loaded from localStorage:", {
          ip: savedTransactionServerIp || "default: 127.0.0.1",
          port: savedTransactionServerPort || "default: 8080",
        })
      } catch (error) {
        console.error("Error loading settings from localStorage:", error)
      }
    }

    loadSettings()
  }, [])

  // Handle saving Transaction Server settings
  const handleSaveTransactionServer = async () => {
    if (!transactionServerIp || !transactionServerPort) {
      toast({
        title: "Error",
        description: "Please enter both IP and Port",
        variant: "destructive",
      })
      return
    }

    // Validate IP address format
    const ipRegex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    if (!ipRegex.test(transactionServerIp)) {
      toast({
        title: "Error",
        description: "Please enter a valid IP address",
        variant: "destructive",
      })
      return
    }

    // Validate port number
    const portNumber = Number.parseInt(transactionServerPort)
    if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
      toast({
        title: "Error",
        description: "Please enter a valid port number (1-65535)",
        variant: "destructive",
      })
      return
    }

    setIsSavingTransactionServer(true)

    try {
      // Save to localStorage
      localStorage.setItem("transactionServerIp", transactionServerIp)
      localStorage.setItem("transactionServerPort", transactionServerPort)

      console.log("Transaction Server settings saved to localStorage:", {
        ip: transactionServerIp,
        port: transactionServerPort,
      })

      toast({
        title: "Success",
        description: "Transaction Server settings saved successfully",
      })

      setTransactionServerStatus("success")
    } catch (error) {
      console.error("Error saving Transaction Server settings:", error)
      toast({
        title: "Error",
        description: "Failed to save Transaction Server settings",
        variant: "destructive",
      })
      setTransactionServerStatus("error")
    } finally {
      setIsSavingTransactionServer(false)
    }
  }

  // Handle testing Transaction Server connection
  const handleTestTransactionServer = async () => {
    if (!transactionServerIp || !transactionServerPort) {
      toast({
        title: "Error",
        description: "Please enter both IP and Port",
        variant: "destructive",
      })
      return
    }

    setIsTestingTransactionServer(true)
    setTransactionServerStatus("idle")

    try {
      // Simulate testing the connection
      // In a real app, you would make an actual API call to test the connection
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, we'll randomly succeed or fail
      const isSuccess = Math.random() > 0.3 // 70% chance of success

      if (isSuccess) {
        toast({
          title: "Connection Successful",
          description: `Connected to Transaction Server at ${transactionServerIp}:${transactionServerPort}`,
        })
        setTransactionServerStatus("success")
      } else {
        throw new Error("Connection failed")
      }
    } catch (error) {
      console.error("Error testing Transaction Server connection:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect to the Transaction Server. Please check the IP and Port and try again.",
        variant: "destructive",
      })
      setTransactionServerStatus("error")
    } finally {
      setIsTestingTransactionServer(false)
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-col gap-2 mb-8 px-1">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-amber-500" />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <p className="text-muted-foreground">Manage your application settings</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Transaction Server Configuration Card */}
        <Card className="bg-black border-gray-800">
          <CardHeader className="px-6 pt-6 pb-2">
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-amber-500" />
              Transaction Server Configuration
            </CardTitle>
            <CardDescription>Configure the Transaction Server for processing trades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {transactionServerStatus === "error" && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to connect to the Transaction Server. Please check the IP and Port and try again.
                </AlertDescription>
              </Alert>
            )}

            {transactionServerStatus === "success" && (
              <Alert className="bg-green-900/20 border-green-900 text-green-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Successfully connected to the Transaction Server.</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transaction-server-ip">Server IP Address</Label>
                <Input
                  id="transaction-server-ip"
                  type="text"
                  placeholder="127.0.0.1"
                  value={transactionServerIp}
                  onChange={(e) => setTransactionServerIp(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transaction-server-port">Server Port</Label>
                <Input
                  id="transaction-server-port"
                  type="text"
                  placeholder="8080"
                  value={transactionServerPort}
                  onChange={(e) => setTransactionServerPort(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleTestTransactionServer}
                disabled={isTestingTransactionServer || !transactionServerIp || !transactionServerPort}
                variant="outline"
                className="flex-1"
              >
                {isTestingTransactionServer && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isTestingTransactionServer ? "Testing..." : "Test Connection"}
              </Button>
              <Button
                onClick={handleSaveTransactionServer}
                disabled={isSavingTransactionServer || !transactionServerIp || !transactionServerPort}
                className="flex-1"
              >
                {isSavingTransactionServer && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSavingTransactionServer ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="px-6 py-4 bg-black/30">
            <p className="text-xs text-gray-500">
              The Transaction Server processes all trading operations. Ensure the server is running and accessible from
              this machine.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
