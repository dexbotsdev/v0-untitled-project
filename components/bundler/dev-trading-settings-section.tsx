"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"

interface DevTradingSettingsProps {
  devTradingSettings?: {
    sellOnMarketcap: boolean
    marketcapSellPercentage: number
    sellOnReserve: boolean
    reserveSellPercentage: number
    sellOnTimeout: boolean
    timeoutSellPercentage: number
    timeoutMinutes: number
  }
}

export function DevTradingSettingsSection({ devTradingSettings = {} }: DevTradingSettingsProps) {
  const [sellOnMarketcap, setSellOnMarketcap] = useState(devTradingSettings.sellOnMarketcap || false)
  const [marketcapSellPercentage, setMarketcapSellPercentage] = useState([
    devTradingSettings.marketcapSellPercentage || 50,
  ])

  const [sellOnReserve, setSellOnReserve] = useState(devTradingSettings.sellOnReserve || false)
  const [reserveSellPercentage, setReserveSellPercentage] = useState([devTradingSettings.reserveSellPercentage || 50])

  const [sellOnTimeout, setSellOnTimeout] = useState(devTradingSettings.sellOnTimeout || false)
  const [timeoutSellPercentage, setTimeoutSellPercentage] = useState([devTradingSettings.timeoutSellPercentage || 50])
  const [timeoutMinutes, setTimeoutMinutes] = useState(devTradingSettings.timeoutMinutes || 60)

  const saveToLocalStorage = () => {
    const settings = {
      sellOnMarketcap,
      marketcapSellPercentage: marketcapSellPercentage[0],
      sellOnReserve,
      reserveSellPercentage: reserveSellPercentage[0],
      sellOnTimeout,
      timeoutSellPercentage: timeoutSellPercentage[0],
      timeoutMinutes,
    }
    localStorage.setItem("devTradingSettings", JSON.stringify(settings))
    alert("Dev trading settings saved to local storage")
  }

  return (
    <div className="space-y-6">
      <Card className="border-gray-800 bg-gray-900/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-400">Dev Trading Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="pt-4 border-t border-gray-800">
              <h3 className="text-sm font-medium text-gray-300 mb-4">Dev Sell Strategies</h3>

              {/* Sell on Marketcap */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sell-on-marketcap" className="text-sm font-medium">
                      Sell Dev on Marketcap
                    </Label>
                    <p className="text-xs text-gray-400">Automatically sell when token reaches a specific marketcap</p>
                  </div>
                  <Switch id="sell-on-marketcap" checked={sellOnMarketcap} onCheckedChange={setSellOnMarketcap} />
                </div>

                {sellOnMarketcap && (
                  <div className="space-y-3 pl-4 border-l-2 border-blue-800/30">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium">Sell Percentage</Label>
                      <Badge variant="outline" className="text-xs">
                        {marketcapSellPercentage[0]}%
                      </Badge>
                    </div>
                    <Slider
                      value={marketcapSellPercentage}
                      onValueChange={setMarketcapSellPercentage}
                      max={100}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1%</span>
                      <span>100%</span>
                    </div>
                    <div className="mt-3">
                      <Label htmlFor="marketcap-target" className="text-sm font-medium">
                        Target Marketcap ($)
                      </Label>
                      <Input
                        id="marketcap-target"
                        type="number"
                        min="1000"
                        step="1000"
                        placeholder="e.g., 1000000"
                        className="bg-gray-800/50 border-gray-700 text-white mt-1"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Sell on Reserve */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sell-on-reserve" className="text-sm font-medium">
                      Sell Dev on Reserve
                    </Label>
                    <p className="text-xs text-gray-400">
                      Automatically sell when token reaches a specific reserve amount
                    </p>
                  </div>
                  <Switch id="sell-on-reserve" checked={sellOnReserve} onCheckedChange={setSellOnReserve} />
                </div>

                {sellOnReserve && (
                  <div className="space-y-3 pl-4 border-l-2 border-blue-800/30">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium">Sell Percentage</Label>
                      <Badge variant="outline" className="text-xs">
                        {reserveSellPercentage[0]}%
                      </Badge>
                    </div>
                    <Slider
                      value={reserveSellPercentage}
                      onValueChange={setReserveSellPercentage}
                      max={100}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1%</span>
                      <span>100%</span>
                    </div>
                    <div className="mt-3">
                      <Label htmlFor="reserve-target" className="text-sm font-medium">
                        Target SOL Reserve
                      </Label>
                      <Input
                        id="reserve-target"
                        type="number"
                        min="1"
                        step="0.1"
                        placeholder="e.g., 100"
                        className="bg-gray-800/50 border-gray-700 text-white mt-1"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Sell on Timeout */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sell-on-timeout" className="text-sm font-medium">
                      Sell Dev on Timeout
                    </Label>
                    <p className="text-xs text-gray-400">Automatically sell after a specific time period</p>
                  </div>
                  <Switch id="sell-on-timeout" checked={sellOnTimeout} onCheckedChange={setSellOnTimeout} />
                </div>

                {sellOnTimeout && (
                  <div className="space-y-3 pl-4 border-l-2 border-blue-800/30">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium">Sell Percentage</Label>
                      <Badge variant="outline" className="text-xs">
                        {timeoutSellPercentage[0]}%
                      </Badge>
                    </div>
                    <Slider
                      value={timeoutSellPercentage}
                      onValueChange={setTimeoutSellPercentage}
                      max={100}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1%</span>
                      <span>100%</span>
                    </div>

                    <div className="mt-3">
                      <Label htmlFor="timeout-minutes" className="text-sm font-medium">
                        Timeout (minutes)
                      </Label>
                      <Input
                        id="timeout-minutes"
                        type="number"
                        min="1"
                        step="1"
                        value={timeoutMinutes}
                        onChange={(e) => setTimeoutMinutes(Number.parseInt(e.target.value) || 60)}
                        className="bg-gray-800/50 border-gray-700 text-white mt-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start p-3 bg-amber-900/20 border border-amber-800/30 rounded-md">
              <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-xs text-amber-300">
                Setting up automatic dev sell strategies can help secure profits and reduce risk. Consider using
                multiple strategies for optimal results.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={saveToLocalStorage}>
                Save Dev Trading Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
