"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  ArrowUpDown,
  Repeat,
  TrendingUp,
  Info,
  ChevronRight,
  ArrowRight,
  Wallet,
  RefreshCw,
  DollarSign,
  Clock,
  Users,
  BarChart2,
} from "lucide-react"

export default function StrategyGuidePage() {
  const [activeTab, setActiveTab] = useState("turbo")

  return (
    <div className="container mx-auto p-6 space-y-8 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BarChart2 className="h-8 w-8 text-amber-500" />
          Volume Bot Strategy Guide
        </h1>
      </div>

      <p className="text-gray-400 max-w-3xl">
        Our Volume Bot offers multiple trading strategies designed to achieve different goals. Each strategy has a
        unique approach to creating volume and market activity. This guide explains how each strategy works in simple
        terms.
      </p>

      <Tabs defaultValue="turbo" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 max-w-2xl bg-[#111] mb-4">
          <TabsTrigger
            value="turbo"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-black data-[state=active]:font-medium"
          >
            Turbo Boost
          </TabsTrigger>
          <TabsTrigger
            value="bump"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-black data-[state=active]:font-medium"
          >
            Bump
          </TabsTrigger>
          <TabsTrigger
            value="pattern"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-black data-[state=active]:font-medium"
          >
            Pattern
          </TabsTrigger>
          <TabsTrigger
            value="microbuy"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-black data-[state=active]:font-medium"
          >
            MicroBuy
          </TabsTrigger>
        </TabsList>

        {/* Turbo Boost Strategy */}
        <TabsContent value="turbo" className="space-y-6">
          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-purple-400" />
                Turbo Boost Mode
                <Badge className="bg-purple-600/20 text-purple-400 hover:bg-purple-600/20 ml-2">High Volume</Badge>
              </CardTitle>
              <CardDescription>Creates significant volume spikes with large token transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Strategy Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-white">How It Works</h3>
                  <p className="text-gray-400">
                    Turbo Boost mode creates high-impact volume by moving large amounts of tokens in rapid succession.
                    It uses multiple wallets to create the appearance of significant market activity.
                  </p>

                  <div className="space-y-3 mt-6">
                    <h4 className="font-medium text-purple-400">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#111] p-3 rounded-lg border border-gray-800">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4 text-purple-400" />
                          <span className="font-medium">Interval</span>
                        </div>
                        <p className="text-sm text-gray-400">15 seconds between trade groups</p>
                      </div>
                      <div className="bg-[#111] p-3 rounded-lg border border-gray-800">
                        <div className="flex items-center gap-2 mb-1">
                          <RefreshCw className="h-4 w-4 text-purple-400" />
                          <span className="font-medium">Trades</span>
                        </div>
                        <p className="text-sm text-gray-400">4 trades per interval</p>
                      </div>
                      <div className="bg-[#111] p-3 rounded-lg border border-gray-800">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="h-4 w-4 text-purple-400" />
                          <span className="font-medium">Wallets</span>
                        </div>
                        <p className="text-sm text-gray-400">4 random wallets per interval</p>
                      </div>
                      <div className="bg-[#111] p-3 rounded-lg border border-gray-800">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="h-4 w-4 text-purple-400" />
                          <span className="font-medium">Funding</span>
                        </div>
                        <p className="text-sm text-gray-400">0.006 SOL per wallet</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-900/10 border border-purple-900/30 rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-purple-400 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Best For
                    </h4>
                    <ul className="mt-2 space-y-1 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span>New token launches that need immediate visibility</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span>Marketing events and announcements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span>Creating volume spikes to attract attention</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Visual Representation */}
                <div className="bg-[#111] rounded-lg border border-gray-800 p-6">
                  <h3 className="text-lg font-medium mb-4 text-center text-white">Turbo Boost Process</h3>
                  <div className="relative h-[400px]">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-purple-900/20 border border-purple-900/30 rounded-lg p-3 w-48 text-center">
                      <Wallet className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                      <p className="text-sm font-medium">Trading Wallet</p>
                      <p className="text-xs text-gray-400 mt-1">Holds main funds & tokens</p>
                    </div>

                    <ArrowDown className="absolute top-[80px] left-1/2 transform -translate-x-1/2 h-8 w-8 text-purple-400" />

                    <div className="absolute top-[120px] left-1/2 transform -translate-x-1/2 bg-purple-900/20 border border-purple-900/30 rounded-lg p-3 w-64 text-center">
                      <div className="flex justify-center mb-1">
                        <RefreshCw className="h-5 w-5 text-purple-400" />
                      </div>
                      <p className="text-sm font-medium">Select 4 Random Wallets</p>
                      <p className="text-xs text-gray-400 mt-1">Fund each with 0.006 SOL</p>
                    </div>

                    <ArrowDown className="absolute top-[200px] left-1/2 transform -translate-x-1/2 h-8 w-8 text-purple-400" />

                    <div className="absolute top-[240px] left-1/2 transform -translate-x-1/2 bg-purple-900/20 border border-purple-900/30 rounded-lg p-3 w-72 text-center">
                      <div className="flex justify-center mb-1">
                        <ArrowUpDown className="h-5 w-5 text-purple-400" />
                      </div>
                      <p className="text-sm font-medium">Execute Trades with Fake Signers</p>
                      <p className="text-xs text-gray-400 mt-1">Buy & sell 10M tokens in random sizes</p>
                      <p className="text-xs text-gray-400 mt-1">Leave 1 token in each wallet</p>
                    </div>

                    <ArrowDown className="absolute top-[320px] left-1/2 transform -translate-x-1/2 h-8 w-8 text-purple-400" />

                    <div className="absolute top-[360px] left-1/2 transform -translate-x-1/2 bg-purple-900/20 border border-purple-900/30 rounded-lg p-3 w-48 text-center">
                      <div className="flex justify-center mb-1">
                        <Repeat className="h-5 w-5 text-purple-400" />
                      </div>
                      <p className="text-sm font-medium">Repeat Process</p>
                      <p className="text-xs text-gray-400 mt-1">Until all wallets are used</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step by Step Process */}
              <div className="mt-8">
                <h3 className="text-xl font-medium mb-4 text-white">Step-by-Step Process</h3>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="bg-purple-900/30 text-purple-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <div className="bg-[#111] rounded-lg border border-gray-800 p-4 flex-1">
                      <h4 className="font-medium mb-2">Check Trading Wallet Funds</h4>
                      <p className="text-sm text-gray-400">
                        The system verifies that the main trading wallet has sufficient funds to execute the strategy.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="bg-purple-900/30 text-purple-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <div className="bg-[#111] rounded-lg border border-gray-800 p-4 flex-1">
                      <h4 className="font-medium mb-2">Prepare Token Amount</h4>
                      <p className="text-sm text-gray-400">
                        If funds are available, the system prepares to move 10 million tokens through the trading
                        process.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="bg-purple-900/30 text-purple-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <div className="bg-[#111] rounded-lg border border-gray-800 p-4 flex-1">
                      <h4 className="font-medium mb-2">Select and Fund Random Wallets</h4>
                      <p className="text-sm text-gray-400">
                        For each 15-second interval, the system selects 4 random wallets and funds each with 0.006 SOL.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="bg-purple-900/30 text-purple-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      4
                    </div>
                    <div className="bg-[#111] rounded-lg border border-gray-800 p-4 flex-1">
                      <h4 className="font-medium mb-2">Divide Tokens into Random Sizes</h4>
                      <p className="text-sm text-gray-400">
                        The 10 million tokens are divided into 4 random-sized portions for trading.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="bg-purple-900/30 text-purple-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      5
                    </div>
                    <div className="bg-[#111] rounded-lg border border-gray-800 p-4 flex-1">
                      <h4 className="font-medium mb-2">Execute Trades with Fake Signers</h4>
                      <p className="text-sm text-gray-400">
                        The system executes buy and sell transactions using the trading wallet, with each random wallet
                        acting as a "fake signer" to create the appearance of market activity.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="bg-purple-900/30 text-purple-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      6
                    </div>
                    <div className="bg-[#111] rounded-lg border border-gray-800 p-4 flex-1">
                      <h4 className="font-medium mb-2">Leave Token Residue</h4>
                      <p className="text-sm text-gray-400">
                        After trading, just 1 token is left in each random wallet as a residue.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="bg-purple-900/30 text-purple-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      7
                    </div>
                    <div className="bg-[#111] rounded-lg border border-gray-800 p-4 flex-1">
                      <h4 className="font-medium mb-2">Repeat Until Complete</h4>
                      <p className="text-sm text-gray-400">
                        This entire process repeats with new random wallets until all available wallets have been used
                        or the duration is complete.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-purple-900/10 border border-purple-900/30 rounded-lg p-6 mt-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-purple-400">Ready to boost your token's volume?</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Create a Turbo Boost bot to generate significant trading activity and attract attention to your
                      token.
                    </p>
                  </div>
                  <Link href="/volume-bot">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Create Turbo Bot
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bump Strategy */}
        <TabsContent value="bump" className="space-y-6">
          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-6 w-6 text-blue-400" />
                Bump Mode
                <Badge className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/20 ml-2">Balanced</Badge>
              </CardTitle>
              <CardDescription>Creates natural trading patterns with balanced buy and sell activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Strategy Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-white">How It Works</h3>
                  <p className="text-gray-400">
                    Bump mode creates a balanced trading pattern by executing equal buy and sell transactions. This
                    creates natural-looking volume without significantly affecting the token price.
                  </p>

                  <div className="space-y-3 mt-6">
                    <h4 className="font-medium text-blue-400">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#111] p-3 rounded-lg border border-gray-800">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4 text-blue-400" />
                          <span className="font-medium">Interval</span>
                        </div>
                        <p className="text-sm text-gray-400">15 seconds between trade groups</p>
                      </div>
                      <div className="bg-[#111] p-3 rounded-lg border border-gray-800">
                        <div className="flex items-center gap-2 mb-1">
                          <RefreshCw className="h-4 w-4 text-blue-400" />
                          <span className="font-medium">Trades</span>
                        </div>
                        <p className="text-sm text-gray-400">4 trades per interval</p>
                      </div>
                      <div className="bg-[#111] p-3 rounded-lg border border-gray-800">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="h-4 w-4 text-blue-400" />
                          <span className="font-medium">Wallets</span>
                        </div>
                        <p className="text-sm text-gray-400">4 random wallets per interval</p>
                      </div>
                      <div className="bg-[#111] p-3 rounded-lg border border-gray-800">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="h-4 w-4 text-blue-400" />
                          <span className="font-medium">Funding</span>
                        </div>
                        <p className="text-sm text-gray-400">0.006 SOL per wallet</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-900/10 border border-blue-900/30 rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-blue-400 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Best For
                    </h4>
                    <ul className="mt-2 space-y-1 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>Established tokens that need consistent activity</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>Long-term volume maintenance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>Creating natural-looking trading patterns</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Visual Representation */}
                <div className="bg-[#111] rounded-lg border border-gray-800 p-6">
                  <h3 className="text-lg font-medium mb-4 text-center text-white">Bump Process</h3>
                  <div className="relative h-[400px]">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-blue-900/20 border border-blue-900/30 rounded-lg p-3 w-48 text-center">
                      <Wallet className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                      <p className="text-sm font-medium">Trading Wallet</p>
                      <p className="text-xs text-gray-400 mt-1">Holds main funds</p>
                    </div>

                    <ArrowDown className="absolute top-[80px] left-1/2 transform -translate-x-1/2 h-8 w-8 text-blue-400" />

                    <div className="absolute top-[120px] left-1/2 transform -translate-x-1/2 bg-blue-900/20 border border-blue-900/30 rounded-lg p-3 w-64 text-center">
                      <div className="flex justify-center mb-1">
                        <RefreshCw className="h-5 w-5 text-blue-400" />
                      </div>
                      <p className="text-sm font-medium">Select 4 Random Wallets</p>
                      <p className="text-xs text-gray-400 mt-1">Fund each with 0.006 SOL</p>
                    </div>

                    <ArrowDown className="absolute top-[200px] left-1/2 transform -translate-x-1/2 h-8 w-8 text-blue-400" />

                    <div className="absolute top-[240px] left-1/2 transform -translate-x-1/2 bg-blue-900/20 border border-blue-900/30 rounded-lg p-3 w-72 text-center">
                      <div className="flex justify-center mb-1">
                        <ArrowUpDown className="h-5 w-5 text-blue-400" />
                      </div>
                      <p className="text-sm font-medium">Execute Balanced Trades</p>
                      <p className="text-xs text-gray-400 mt-1">Buy & sell using random SOL amounts</p>
                      <p className="text-xs text-gray-400 mt-1">Using fake signers from random wallets</p>
                    </div>

                    <ArrowDown className="absolute top-[320px] left-1/2 transform -translate-x-1/2 h-8 w-8 text-blue-400" />

                    <div className="absolute top-[360px] left-1/2 transform -translate-x-1/2 bg-blue-900/20 border border-blue-900/30 rounded-lg p-3 w-48 text-center">
                      <div className="flex justify-center mb-1">
                        <Repeat className="h-5 w-5 text-blue-400" />
                      </div>
                      <p className="text-sm font-medium">Repeat Process</p>
                      <p className="text-xs text-gray-400 mt-1">Until all wallets are used</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step by Step Process */}
              <div className="mt-8">
                <h3 className="text-xl font-medium mb-4 text-white">Step-by-Step Process</h3>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="bg-blue-900/30 text-blue-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <div className="bg-[#111] rounded-lg border border-gray-800 p-4 flex-1">
                      <h4 className="font-medium mb-2">Check Trading Wallet Funds</h4>
                      <p className="text-sm text-gray-400">
                        The system verifies that the main trading wallet has sufficient funds to execute the strategy.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="bg-blue-900/30 text-blue-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <div className="bg-[#111] rounded-lg border border-gray-800 p-4 flex-1">
                      <h4 className="font-medium mb-2">Set Up Trading Interval</h4>
                      <p className="text-sm text-gray-400">The system prepares to execute 4 trades every 15 seconds.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="bg-blue-900/30 text-blue-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <div className="bg-[#111] rounded-lg border border-gray-800 p-4 flex-1">
                      <h4 className="font-medium mb-2">Select and Fund Random Wallets</h4>
                      <p className="text-sm text-gray-400">
                        For each 15-second interval, the system selects 4 random wallets and funds each with 0.006 SOL.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="bg-blue-900/30 text-blue-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      4
                    </div>
                    <div className="bg-[#111] rounded-lg border border-gray-800 p-4 flex-1">
                      <h4 className="font-medium mb-2">Generate Random Trade Amounts</h4>
                      <p className="text-sm text-gray-400">
                        The system generates random SOL amounts for each trade to create natural-looking patterns.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="bg-blue-900/30 text-blue-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      5
                    </div>
                    <div className="bg-[#111] rounded-lg border border-gray-800 p-4 flex-1">
                      <h4 className="font-medium mb-2">Execute Balanced Trades</h4>
                      <p className="text-sm text-gray-400">
                        The system executes buy and sell transactions using the trading wallet, with each random wallet
                        acting as a "fake signer" to create the appearance of balanced market activity.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="bg-blue-900/30 text-blue-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      6
                    </div>
                    <div className="bg-[#111] rounded-lg border border-gray-800 p-4 flex-1">
                      <h4 className="font-medium mb-2">Repeat Until Complete</h4>
                      <p className="text-sm text-gray-400">
                        This entire process repeats with new random wallets until all available wallets have been used
                        or the duration is complete.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-blue-900/10 border border-blue-900/30 rounded-lg p-6 mt-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-blue-400">Want sustainable trading volume?</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Create a Bump bot to generate consistent, natural-looking trading activity for your token.
                    </p>
                  </div>
                  <Link href="/volume-bot">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Create Bump Bot
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pattern Strategy */}
        <TabsContent value="pattern" className="space-y-6">
          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-amber-400" />
                Pattern Mode
                <Badge className="bg-amber-600/20 text-amber-400 hover:bg-amber-600/20 ml-2">Bullish Bias</Badge>
              </CardTitle>
              <CardDescription>Creates a bullish trading pattern with more buys than sells</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Strategy Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-white">How It Works</h3>
                  <p className="text-gray-400">
                    Pattern mode creates a bullish trading pattern by executing two buy transactions followed by one
                    sell transaction. This creates a gentle upward price pressure while maintaining natural-looking
                    volume.
                  </p>

                  <div className="space-y-3 mt-6">
                    <h4 className="font-medium text-amber-400">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#111] p-3 rounded-lg border border-gray-800">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4 text-amber-400" />
                          <span className="font-medium">Interval</span>
                        </div>
                        <p className="text-sm text-gray-400">15 seconds between trade groups</p>
                      </div>
                      <div className="bg-[#111] p-3 rounded-lg border border-gray-800">
                        <div className="flex items-center gap-2 mb-1">
                          <RefreshCw className="h-4 w-4 text-amber-400" />
                          <span className="font-medium">Trades</span>
                        </div>
                        <p className="text-sm text-gray-400">3 trades per interval (2 buys, 1 sell)</p>
                      </div>
                      <div className="bg-[#111] p-3 rounded-lg border border-gray-800">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="h-4 w-4 text-amber-400" />
                          <span className="font-medium">Wallets</span>
                        </div>
                        <p className="text-sm text-gray-400">3 random wallets per interval</p>
                      </div>
                      <div className="bg-[#111] p-3 rounded-lg border border-gray-800">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="h-4 w-4 text-amber-400" />
                          <span className="font-medium">Funding</span>
                        </div>
                        <p className="text-sm text-gray-400">0.006 SOL per wallet</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-900/10 border border-amber-900/30 rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-amber-400 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Best For
                    </h4>
                    <ul className="mt-2 space-y-1 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>Tokens in growth phase needing positive momentum</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>Creating a positive market sentiment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>Encouraging gradual, sustainable price growth</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Visual Representation */}
                <div className="bg-[#111] rounded-lg border border-gray-800 p-6">
                  <h3 className="text-lg font-medium mb-4 text-center text-white">Pattern Process</h3>
                  <div className="relative h-[400px]">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-amber-900/20 border border-amber-900/30 rounded-lg p-3 w-48 text-center">
                      <Wallet className="h-5 w-5 text-amber-400 mx-auto mb-1" />
                      <p className="text-sm font-medium">Trading Wallet</p>
                      <p className="text-xs text-gray-400 mt-1">Holds main funds</p>
                    </div>

                    <ArrowDown className="absolute top-[80px] left-1/2 transform -translate-x-1/2 h-8 w-8 text-amber-400" />

                    <div className="absolute top-[120px] left-1/2 transform -translate-x-1/2 bg-amber-900/20 border border-amber-900/30 rounded-lg p-3 w-64 text-center">
                      <div className="flex justify-center mb-1">
                        <RefreshCw className="h-5 w-5 text-amber-400" />
                      </div>
                      <p className="text-sm font-medium">Select 3 Random Wallets</p>
                      <p className="text-xs text-gray-400 mt-1">Fund each with 0.006 SOL</p>
                    </div>

                    <ArrowDown className="absolute top-[200px] left-1/2 transform -translate-x-1/2 h-8 w-8 text-amber-400" />

                    <div className="absolute top-[240px] left-1/2 transform -translate-x-1/2 bg-amber-900/20 border border-amber-900/30 rounded-lg p-3 w-72 text-center">
                      <div className="flex justify-center mb-1">
                        <TrendingUp className="h-5 w-5 text-amber-400" />
                      </div>
                      <p className="text-sm font-medium">Execute Pattern Trades</p>
                      <p className="text-xs text-gray-400 mt-1">2 buys followed by 1 sell</p>
                      <p className="text-xs text-gray-400 mt-1">Using fake signers from random wallets</p>
                    </div>

                    <ArrowDown className="absolute top-[320px] left-1/2 transform -translate-x-1/2 h-8 w-8 text-amber-400" />

                    <div className="absolute top-[360px] left-1/2 transform -translate-x-1/2 bg-amber-900/20 border border-amber-900/30 rounded-lg p-3 w-48 text-center">
                      <div className="flex justify-center mb-1">
                        <Repeat className="h-5 w-5 text-amber-400" />
                      </div>
                      <p className="text-sm font-medium">Repeat Process</p>
                      <p className="text-xs text-gray-400 mt-1">Until all wallets are used</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step by Step Process */}
              <div className="mt-8">
                <h3 className="text-xl font-medium mb-4 text-white">Step-by-Step Process</h3>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="bg-amber-900/30 text-amber-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <div className="bg-[#111] rounded-lg border border-gray-800 p-4 flex-1">
                      <h4 className="font-medium mb-2">Check Trading Wallet Funds</h4>
                      <p className="text-sm text-gray-400">
                        The system verifies that the main trading wallet has sufficient funds to execute the strategy.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="bg-amber-900/30 text-amber-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <div className="bg-[#111] rounded-lg border border-gray-800 p-4 flex-1">
                      <h4 className="font-medium mb-2">Set Up Trading Interval</h4>
                      <p className="text-sm text-gray-400">
                        The system prepares to execute 3 trades (2 buys, 1 sell) every 15 seconds.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="bg-amber-900/30 text-amber-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <div className="bg-[#111] rounded-lg border border-gray-800 p-4 flex-1">
                      <h4 className="font-medium mb-2">Select and Fund Random Wallets</h4>
                      <p className="text-sm text-gray-400">
                        For each 15-second interval, the system selects 3 random wallets and funds each with 0.006 SOL.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="bg-amber-900/30 text-amber-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      4
                    </div>
                    <div className="bg-[#111] rounded-lg border border-gray-800 p-4 flex-1">
                      <h4 className="font-medium mb-2">Generate Random Trade Amounts</h4>
                      <p className="text-sm text-gray-400">
                        The system generates random SOL amounts for each trade to create natural-looking patterns.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="bg-amber-900/30 text-amber-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      5
                    </div>
                    <div className="bg-[#111] rounded-lg border border-gray-800 p-4 flex-1">
                      <h4 className="font-medium mb-2">Execute Pattern Trades</h4>
                      <p className="text-sm text-gray-400">
                        The system executes two buy transactions followed by one sell transaction using the trading
                        wallet, with each random wallet acting as a "fake signer" to create a bullish trading pattern.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="bg-amber-900/30 text-amber-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      6
                    </div>
                    <div className="bg-[#111] rounded-lg border border-gray-800 p-4 flex-1">
                      <h4 className="font-medium mb-2">Repeat Until Complete</h4>
                      <p className="text-sm text-gray-400">
                        This entire process repeats with new random wallets until all available wallets have been used
                        or the duration is complete.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-amber-900/10 border border-amber-900/30 rounded-lg p-6 mt-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-amber-400">Need positive price momentum?</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Create a Pattern bot to generate bullish trading activity for your token.
                    </p>
                  </div>
                  <Link href="/volume-bot">
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      Create Pattern Bot
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MicroBuy Strategy */}
        <TabsContent value="microbuy" className="space-y-6">
          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-green-400" />
                MicroBuy Mode
                <Badge className="bg-green-600/20 text-green-400 hover:bg-green-600/20 ml-2">High Transactions</Badge>
              </CardTitle>
              <CardDescription>Creates many small buy transactions to boost transaction count</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Strategy Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-white">How It Works</h3>
                  <p className="text-gray-400">
                    MicroBuy mode creates a high number of very small buy transactions. This boosts transaction count
                    metrics and creates the appearance of widespread buying interest with minimal price impact.
                  </p>

                  <div className="space-y-3 mt-6">
                    <h4 className="font-medium text-green-400">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#111] p-3 rounded-lg border border-gray-800">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4 text-green-400" />
                          <span className="font-medium">Interval</span>
                        </div>
                        <p className="text-sm text-gray-400">15 seconds between trade groups</p>
                      </div>
                      <div className="bg-[#111] p-3 rounded-lg border border-gray-800">
                        <div className="flex items-center gap-2 mb-1">
                          <RefreshCw className="h-4 w-4 text-green-400" />
                          <span className="font-medium">Trades</span>
                        </div>
                        <p className="text-sm text-gray-400">4 trades per interval</p>
                      </div>
                      <div className="bg-[#111] p-3 rounded-lg border border-gray-800">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="h-4 w-4 text-green-400" />
                          <span className="font-medium">Wallets</span>
                        </div>
                        <p className="text-sm text-gray-400">4 random wallets per interval</p>
                      </div>
                      <div className="bg-[#111] p-3 rounded-lg border border-gray-800">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="h-4 w-4 text-green-400" />
                          <span className="font-medium">Trade Size</span>
                        </div>
                        <p className="text-sm text-gray-400">0.00001 SOL per trade</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-900/10 border border-green-900/30 rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-green-400 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Best For
                    </h4>
                    <ul className="mt-2 space-y-1 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Boosting transaction count metrics</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Creating appearance of widespread interest</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Generating activity with minimal price impact</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Visual Representation */}
                <div className="bg-[#111] rounded-lg border border-gray-800 p-6">
                  <h3 className="text-lg font-medium mb-4 text-center text-white">MicroBuy Process</h3>
                  <div className="relative h-[400px]">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-green-900/20 border border-green-900/30 rounded-lg p-3 w-48 text-center">
                      <Wallet className="h-5 w-5 text-green-400 mx-auto mb-1" />
                      <p className="text-sm font-medium">Trading Wallet</p>
                      <p className="text-xs text-gray-400 mt-1">Holds main funds</p>
                    </div>

                    <ArrowDown className="absolute top-[80px] left-1/2 transform -translate-x-1/2 h-8 w-8 text-green-400" />

                    <div className="absolute top-[120px] left-1/2 transform -translate-x-1/2 bg-green-900/20 border border-green-900/30 rounded-lg p-3 w-64 text-center">
                      <div className="flex justify-center mb-1">
                        <RefreshCw className="h-5 w-5 text-green-400" />
                      </div>
                      <p className="text-sm font-medium">Select 4 Random Wallets</p>
                      <p className="text-xs text-gray-400 mt-1">Fund each with 0.006 SOL</p>
                    </div>

                    <ArrowDown className="absolute top-[200px] left-1/2 transform -translate-x-1/2 h-8 w-8 text-green-400" />

                    <div className="absolute top-[240px] left-1/2 transform -translate-x-1/2 bg-green-900/20 border border-green-900/30 rounded-lg p-3 w-72 text-center">
                      <div className="flex justify-center mb-1">
                        <DollarSign className="h-5 w-5 text-green-400" />
                      </div>
                      <p className="text-sm font-medium">Execute Micro Buy Trades</p>
                      <p className="text-xs text-gray-400 mt-1">Buy using 0.00001 SOL per trade</p>
                      <p className="text-xs text-gray-400 mt-1">Direct purchases from random wallets</p>
                    </div>

                    <ArrowDown className="absolute top-[320px] left-1/2 transform -translate-x-1/2 h-8 w-8 text-green-400" />

                    <div className="absolute top-[360px] left-1/2 transform -translate-x-1/2 bg-green-900/20 border border-green-900/30 rounded-lg p-3 w-48 text-center">
                      <div className="flex justify-center mb-1">
                        <Repeat className="h-5 w-5 text-green-400" />
                      </div>
                      <p className="text-sm font-medium">Repeat Process</p>
                      <p className="text-xs text-gray-400 mt-1">Until all wallets are used</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step by Step Process */}
              <div className="mt-8">
                <h3 className="text-xl font-medium mb-4 text-white">Step-by-Step Process</h3>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="bg-green-900/30 text-green-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <div className="bg-[#111] rounded-lg border border-gray-800 p-4 flex-1">
                      <h4 className="font-medium mb-2">Check Trading Wallet Funds</h4>
                      <p className="text-sm text-gray-400">
                        The system verifies that the main trading wallet has sufficient funds to execute the strategy.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="bg-green-900/30 text-green-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <div className="bg-[#111] rounded-lg border border-gray-800 p-4 flex-1">
                      <h4 className="font-medium mb-2">Set Up Trading Interval</h4>
                      <p className="text-sm text-gray-400">
                        The system prepares to execute 4 micro buy trades every 15 seconds.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="bg-green-900/30 text-green-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <div className="bg-[#111] rounded-lg border border-gray-800 p-4 flex-1">
                      <h4 className="font-medium mb-2">Select and Fund Random Wallets</h4>
                      <p className="text-sm text-gray-400">
                        For each 15-second interval, the system selects 4 random wallets and funds each with 0.006 SOL.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="bg-green-900/30 text-green-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      4
                    </div>
                    <div className="bg-[#111] rounded-lg border border-gray-800 p-4 flex-1">
                      <h4 className="font-medium mb-2">Execute Micro Buy Trades</h4>
                      <p className="text-sm text-gray-400">
                        Each random wallet executes a buy transaction using a very small amount (0.00001 SOL) to
                        purchase tokens.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="bg-green-900/30 text-green-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      5
                    </div>
                    <div className="bg-[#111] rounded-lg border border-gray-800 p-4 flex-1">
                      <h4 className="font-medium mb-2">Repeat Until Complete</h4>
                      <p className="text-sm text-gray-400">
                        This entire process repeats with new random wallets until all available wallets have been used
                        or the duration is complete.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-green-900/10 border border-green-900/30 rounded-lg p-6 mt-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-green-400">Want to boost transaction count?</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Create a MicroBuy bot to generate many small buy transactions for your token.
                    </p>
                  </div>
                  <Link href="/volume-bot">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Create MicroBuy Bot
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper component for the arrow down icon
function ArrowDown(props: React.ComponentProps<typeof ArrowRight>) {
  return <ArrowRight className={`rotate-90 ${props.className}`} />
}
