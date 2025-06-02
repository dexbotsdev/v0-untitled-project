"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package } from "lucide-react"
import { TokenMetadataSection } from "./token-metadata-section"
import { TokenConfigurationSection } from "./token-configuration-section"
import { DevTradingSettingsSection } from "./dev-trading-settings-section"
import { WalletManagementSection } from "./wallet-management-section"

interface CreateBundlerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateBot: (config: any) => void
}

export function CreateBundlerDialog({ open, onOpenChange, onCreateBot }: CreateBundlerDialogProps) {
  const [activeTab, setActiveTab] = useState("token-metadata")

  // Token Metadata
  const [tokenMetadata, setTokenMetadata] = useState({
    name: "",
    symbol: "",
    description: "",
    image: null,
    telegram: "",
    twitter: "",
    website: "",
  })

  // Token Configuration
  const [tokenConfig, setTokenConfig] = useState({
    tokenType: "spl",
    platform: "raydium-amm",
    revokeAuthority: false,
  })

  // Dev Trading Settings
  const [devTradingSettings, setDevTradingSettings] = useState({
    devBuyAmount: 1,
    sellOnMarketcap: false,
    marketcapSellPercentage: 50,
    sellOnReserve: false,
    reserveSellPercentage: 50,
    sellOnTimeout: false,
    timeoutSellPercentage: 50,
    timeoutMinutes: 60,
  })

  // Wallet Management
  const [walletManagement, setWalletManagement] = useState({
    selectedGroup: "group-1",
    customWallets: [
      { address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosg", amount: 0.5 },
      { address: "8xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosg", amount: 0.75 },
      { address: "9xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosg", amount: 1.0 },
    ],
  })

  const handleCreate = () => {
    // Save all settings to localStorage
    localStorage.setItem("tokenMetadata", JSON.stringify(tokenMetadata))
    localStorage.setItem("tokenConfig", JSON.stringify(tokenConfig))
    localStorage.setItem("devTradingSettings", JSON.stringify(devTradingSettings))
    localStorage.setItem("walletManagement", JSON.stringify(walletManagement))

    // Create the bot with all configurations
    onCreateBot({
      tokenSymbol: tokenMetadata.symbol || "TOKEN",
      tokenAddress: "Generated on creation",
      budget: walletManagement.customWallets.reduce((sum, wallet) => sum + wallet.amount, 0),
      targetVolume: 50000,
      wallets:
        walletManagement.selectedGroup === "custom"
          ? walletManagement.customWallets.length
          : walletManagement.selectedGroup === "group-1"
            ? 10
            : walletManagement.selectedGroup === "group-2"
              ? 25
              : 50,
      bundleSize: 5,
      trades: 200,
      tokenMetadata,
      tokenConfig,
      devTradingSettings,
      walletManagement,
    })

    onOpenChange(false)
  }

  const isValid = tokenMetadata.symbol.trim() !== "" && tokenMetadata.name.trim() !== ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-[#1e2133] border-gray-800 text-stone-200">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Package className="mr-2 h-5 w-5 text-blue-500" />
            Create Bundler Bot
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure your bundler bot to execute coordinated transaction bundles for maximum efficiency.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-800/50 mb-4 w-full justify-start">
            <TabsTrigger value="token-metadata" className="data-[state=active]:bg-gray-700">
              Token Metadata
            </TabsTrigger>
            <TabsTrigger value="token-config" className="data-[state=active]:bg-gray-700">
              Token Configuration
            </TabsTrigger>
            <TabsTrigger value="dev-trading" className="data-[state=active]:bg-gray-700">
              Dev Trading
            </TabsTrigger>
            <TabsTrigger value="wallet-management" className="data-[state=active]:bg-gray-700">
              Wallet Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="token-metadata" className="mt-0">
            <TokenMetadataSection tokenMetadata={tokenMetadata} />
          </TabsContent>

          <TabsContent value="token-config" className="mt-0">
            <TokenConfigurationSection tokenConfig={tokenConfig} />
          </TabsContent>

          <TabsContent value="dev-trading" className="mt-0">
            <DevTradingSettingsSection devTradingSettings={devTradingSettings} />
          </TabsContent>

          <TabsContent value="wallet-management" className="mt-0">
            <WalletManagementSection walletManagement={walletManagement} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => {
              const prevTab =
                activeTab === "token-metadata"
                  ? "token-metadata"
                  : activeTab === "token-config"
                    ? "token-metadata"
                    : activeTab === "dev-trading"
                      ? "token-config"
                      : "dev-trading"
              setActiveTab(prevTab)
            }}
            className="border-gray-700 text-gray-300"
            disabled={activeTab === "token-metadata"}
          >
            Previous
          </Button>

          <div className="space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-700 text-gray-300">
              Cancel
            </Button>

            {activeTab === "wallet-management" ? (
              <Button onClick={handleCreate}   className="bg-blue-600 hover:bg-blue-700 text-white">
                Create Bundler Bot
              </Button>
            ) : (
              <Button
                onClick={() => {
                  const nextTab =
                    activeTab === "token-metadata"
                      ? "token-config"
                      : activeTab === "token-config"
                        ? "dev-trading"
                        : "wallet-management"
                  setActiveTab(nextTab)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
