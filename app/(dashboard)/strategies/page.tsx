"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BarChart2, DollarSign, Cpu, BarChart, Activity } from "lucide-react"

export default function StrategiesPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container mx-auto p-6 space-y-8 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BarChart2 className="h-8 w-8 text-amber-500" />
          Volume Bot Strategies
        </h1>
      </div>

      <p className="text-gray-400 max-w-3xl">
        Our Volume Bot offers multiple trading strategies designed to achieve different goals. Each strategy has unique
        characteristics that make it suitable for specific market conditions and objectives. Understanding these
        strategies will help you maximize the effectiveness of your volume bot.
      </p>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 max-w-3xl bg-[#111] mb-4">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-black data-[state=active]:font-medium"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="bump"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-black data-[state=active]:font-medium"
          >
            Bump
          </TabsTrigger>
          <TabsTrigger
            value="turbo"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-black data-[state=active]:font-medium"
          >
            Turbo
          </TabsTrigger>
          <TabsTrigger
            value="microbuys"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-black data-[state=active]:font-medium"
          >
            MicroBuys
          </TabsTrigger>
          <TabsTrigger
            value="pattern"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-black data-[state=active]:font-medium"
          >
            Pattern
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-amber-500" />
                Strategy Comparison
              </CardTitle>
              <CardDescription>Compare the key features of each volume bot strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Strategy</TableHead>
                      <TableHead>Trades Per Minute</TableHead>
                      <TableHead>Trade Pattern</TableHead>
                      <TableHead>Cost Efficiency</TableHead>
                      <TableHead>Volume Impact</TableHead>
                      <TableHead>Price Impact</TableHead>
                      <TableHead>Best For</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/20">Bump</Badge>
                        </div>
                      </TableCell>
                      <TableCell>16</TableCell>
                      <TableCell>1 Buy + 1 Sell</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600/20 text-green-400 hover:bg-green-600/20">High</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/20">Medium</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-600/20 text-green-400 hover:bg-green-600/20">Minimal</Badge>
                      </TableCell>
                      <TableCell>Steady volume, price neutrality</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-600/20 text-purple-400 hover:bg-purple-600/20">Turbo</Badge>
                        </div>
                      </TableCell>
                      <TableCell>4</TableCell>
                      <TableCell>Multiple rapid trades</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/20">Medium</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-red-600/20 text-red-400 hover:bg-red-600/20">High</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/20">Medium</Badge>
                      </TableCell>
                      <TableCell>Volume spikes, attention</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-600/20 text-green-400 hover:bg-green-600/20">MicroBuys</Badge>
                        </div>
                      </TableCell>
                      <TableCell>30</TableCell>
                      <TableCell>Many small buys</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/20">Medium</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/20">Medium</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/20">Bullish</Badge>
                      </TableCell>
                      <TableCell>Transaction count, buy pressure</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-amber-600/20 text-amber-400 hover:bg-amber-600/20">Pattern</Badge>
                        </div>
                      </TableCell>
                      <TableCell>4</TableCell>
                      <TableCell>2 Buys + 1 Sell</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600/20 text-green-400 hover:bg-green-600/20">High</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/20">Medium</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/20">Bullish</Badge>
                      </TableCell>
                      <TableCell>Controlled price growth</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[#111] border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-400" />
                      Cost Considerations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-sm text-gray-400">
                      The cost of running a volume bot depends on several factors:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-400 list-disc pl-5">
                      <li>Transaction fees (varies by network congestion)</li>
                      <li>Number of trades per minute</li>
                      <li>Duration of operation</li>
                      <li>Priority fees and tips</li>
                      <li>Number of wallets used</li>
                    </ul>
                    <p className="mt-2 text-sm text-gray-400">
                      <span className="text-amber-400">Bump</span> and <span className="text-amber-400">Pattern</span>{" "}
                      strategies are generally the most cost-efficient for sustained operations.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111] border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-400" />
                      Effectiveness Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-sm text-gray-400">
                      The effectiveness of a volume bot strategy depends on your specific goals:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-400 list-disc pl-5">
                      <li>Increasing trading volume metrics</li>
                      <li>Boosting transaction count</li>
                      <li>Creating buy pressure</li>
                      <li>Maintaining price stability</li>
                      <li>Attracting attention from traders</li>
                    </ul>
                    <p className="mt-2 text-sm text-gray-400">
                      Choose your strategy based on which metrics are most important for your token's growth.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-amber-500" />
                Strategy Selection Guide
              </CardTitle>
              <CardDescription>How to choose the right strategy for your needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-[#111] rounded-lg border border-gray-800">
                  <h3 className="text-lg font-medium mb-2">For New Token Launches</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    New tokens need to quickly establish trading activity and visibility.
                  </p>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <Badge className="bg-purple-600/20 text-purple-400 hover:bg-purple-600/20 mr-2">
                        Recommended
                      </Badge>
                      <span className="text-sm">Turbo strategy for the first 24-48 hours</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/20 mr-2">Then</Badge>
                      <span className="text-sm">Switch to Pattern strategy for sustained growth</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#111] rounded-lg border border-gray-800">
                  <h3 className="text-lg font-medium mb-2">For Established Tokens</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Established tokens need consistent activity to maintain visibility and liquidity.
                  </p>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <Badge className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/20 mr-2">Recommended</Badge>
                      <span className="text-sm">Bump strategy for daily operations</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-green-600/20 text-green-400 hover:bg-green-600/20 mr-2">Supplement</Badge>
                      <span className="text-sm">MicroBuys during low activity periods</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#111] rounded-lg border border-gray-800">
                  <h3 className="text-lg font-medium mb-2">For Marketing Events</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    During marketing campaigns or announcements, you need heightened visibility.
                  </p>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <Badge className="bg-purple-600/20 text-purple-400 hover:bg-purple-600/20 mr-2">
                        Recommended
                      </Badge>
                      <span className="text-sm">Turbo strategy during the event</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-amber-600/20 text-amber-400 hover:bg-amber-600/20 mr-2">Follow with</Badge>
                      <span className="text-sm">Pattern strategy to maintain momentum</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#111] rounded-lg border border-gray-800">
                  <h3 className="text-lg font-medium mb-2">For Limited Budget</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    If you have budget constraints but still need to maintain activity.
                  </p>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <Badge className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/20 mr-2">Recommended</Badge>
                      <span className="text-sm">Bump strategy with lower trade frequency</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-green-600/20 text-green-400 hover:bg-green-600/20 mr-2">Alternative</Badge>
                      <span className="text-sm">MicroBuys with minimum trade amounts</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bump Strategy Tab */}
        <TabsContent value="bump" className="space-y-6">
          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/20">Bump Strategy</Badge>
              </CardTitle>
              <CardDescription>The balanced approach for sustainable volume</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-3">How It Works</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    The Bump strategy executes 1 buy transaction followed by 1 sell transaction in each cycle. This
                    creates a natural trading pattern that mimics organic market activity.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>16 trades per minute (8 buys, 8 sells)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Balanced buy and sell pressure</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Minimal price impact due to equal buy/sell ratio</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Creates consistent, sustainable trading volume</span>
                    </li>
                  </ul>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-3">Key Benefits</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <Badge className="bg-green-600/20 text-green-400 hover:bg-green-600/20 mr-2 mt-0.5">
                        Efficient
                      </Badge>
                      <span>High cost efficiency with minimal price impact, ideal for long-term operation</span>
                    </li>
                    <li className="flex items-start">
                      <Badge className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/20 mr-2 mt-0.5">Natural</Badge>
                      <span>Creates trading patterns that appear organic to observers and analytics</span>
                    </li>
                    <li className="flex items-start">
                      <Badge className="bg-purple-600/20 text-purple-400 hover:bg-purple-600/20 mr-2 mt-0.5">
                        Consistent
                      </Badge>
                      <span>Provides steady volume metrics without dramatic fluctuations</span>
                    </li>
                    <li className="flex items-start">
                      <Badge className="bg-amber-600/20 text-amber-400 hover:bg-amber-600/20 mr-2 mt-0.5">
                        Sustainable
                      </Badge>
                      <span>Can run indefinitely without depleting resources or affecting token price</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-blue-900/10 border border-blue-900/20 rounded-lg">
                <h3 className="text-lg font-medium text-blue-400 mb-2">Optimal Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Trade Size</h4>
                    <p className="text-sm text-gray-400">Min: 0.01 SOL / Max: 0.05 SOL</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Smaller trade sizes are more cost-efficient and appear more natural
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Number of Wallets</h4>
                    <p className="text-sm text-gray-400">Recommended: 10-15 wallets</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Multiple wallets distribute activity and appear more organic
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Duration</h4>
                    <p className="text-sm text-gray-400">Recommended: 12-24 hours per session</p>
                    <p className="text-xs text-gray-500 mt-1">Can be run continuously for sustained volume</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Advanced Settings</h4>
                    <p className="text-sm text-gray-400">AntiMEV: Recommended</p>
                    <p className="text-xs text-gray-500 mt-1">Helps prevent frontrunning and ensures trade execution</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Best Use Cases</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-[#111] rounded-lg border border-gray-800">
                    <h4 className="font-medium mb-2 text-blue-400">Established Tokens</h4>
                    <p className="text-sm text-gray-400">
                      Ideal for maintaining consistent trading activity for tokens that already have market presence.
                    </p>
                  </div>
                  <div className="p-3 bg-[#111] rounded-lg border border-gray-800">
                    <h4 className="font-medium mb-2 text-blue-400">Long-Term Operations</h4>
                    <p className="text-sm text-gray-400">
                      Perfect for projects looking to maintain volume metrics over extended periods with minimal cost.
                    </p>
                  </div>
                  <div className="p-3 bg-[#111] rounded-lg border border-gray-800">
                    <h4 className="font-medium mb-2 text-blue-400">Price Stability</h4>
                    <p className="text-sm text-gray-400">
                      When you want to increase volume without significantly affecting the token price.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Turbo Strategy Tab */}
        <TabsContent value="turbo" className="space-y-6">
          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-purple-600/20 text-purple-400 hover:bg-purple-600/20">Turbo Strategy</Badge>
              </CardTitle>
              <CardDescription>High-impact volume for maximum attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-3">How It Works</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    The Turbo strategy executes multiple trades in rapid succession, alternating between buys and sells.
                    This creates significant volume spikes and attracts attention to your token.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>4 trades per minute (high value trades)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Rapid-fire trading creates volume spikes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Creates noticeable market activity</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Designed to attract attention and create FOMO</span>
                    </li>
                  </ul>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-3">Key Benefits</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <Badge className="bg-red-600/20 text-red-400 hover:bg-red-600/20 mr-2 mt-0.5">High Impact</Badge>
                      <span>Creates significant volume spikes that attract attention</span>
                    </li>
                    <li className="flex items-start">
                      <Badge className="bg-purple-600/20 text-purple-400 hover:bg-purple-600/20 mr-2 mt-0.5">
                        Visibility
                      </Badge>
                      <span>Improves token ranking on volume-based listings</span>
                    </li>
                    <li className="flex items-start">
                      <Badge className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/20 mr-2 mt-0.5">Attention</Badge>
                      <span>Draws traders' attention to sudden activity increases</span>
                    </li>
                    <li className="flex items-start">
                      <Badge className="bg-amber-600/20 text-amber-400 hover:bg-amber-600/20 mr-2 mt-0.5">
                        Momentum
                      </Badge>
                      <span>Can trigger real trading activity through FOMO</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-purple-900/10 border border-purple-900/20 rounded-lg">
                <h3 className="text-lg font-medium text-purple-400 mb-2">Optimal Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Trade Size</h4>
                    <p className="text-sm text-gray-400">Min: 0.05 SOL / Max: 0.2 SOL</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Larger trade sizes create more noticeable volume impact
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Number of Wallets</h4>
                    <p className="text-sm text-gray-400">Recommended: 5-10 wallets</p>
                    <p className="text-xs text-gray-500 mt-1">Fewer wallets with larger trades create more impact</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Duration</h4>
                    <p className="text-sm text-gray-400">Recommended: 2-6 hours per session</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Short bursts are more effective than continuous operation
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Advanced Settings</h4>
                    <p className="text-sm text-gray-400">Priority Fees: Higher than default</p>
                    <p className="text-xs text-gray-500 mt-1">Ensures trades execute quickly during high activity</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Best Use Cases</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-[#111] rounded-lg border border-gray-800">
                    <h4 className="font-medium mb-2 text-purple-400">Token Launches</h4>
                    <p className="text-sm text-gray-400">
                      Perfect for creating initial momentum and visibility during the first days after launch.
                    </p>
                  </div>
                  <div className="p-3 bg-[#111] rounded-lg border border-gray-800">
                    <h4 className="font-medium mb-2 text-purple-400">Marketing Events</h4>
                    <p className="text-sm text-gray-400">
                      Ideal to run alongside announcements, listings, or other marketing activities to amplify impact.
                    </p>
                  </div>
                  <div className="p-3 bg-[#111] rounded-lg border border-gray-800">
                    <h4 className="font-medium mb-2 text-purple-400">Breaking Resistance</h4>
                    <p className="text-sm text-gray-400">
                      When you need to break through trading resistance levels with a surge of activity.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-900/10 border border-red-900/20 rounded-lg">
                <h3 className="text-lg font-medium text-red-400 mb-2">Important Considerations</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Higher cost per hour than other strategies due to larger trade sizes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Can cause price volatility if run for extended periods</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Best used in short bursts rather than continuous operation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Requires more SOL funding due to higher transaction volume</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MicroBuys Strategy Tab */}
        <TabsContent value="microbuys" className="space-y-6">
          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-green-600/20 text-green-400 hover:bg-green-600/20">MicroBuys Strategy</Badge>
              </CardTitle>
              <CardDescription>High transaction count with minimal price impact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-3">How It Works</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    The MicroBuys strategy executes many small buy transactions (as low as 0.0001 SOL each). This
                    creates a high number of transactions with minimal market impact, giving the appearance of strong
                    buying interest.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>30 trades per minute (mostly small buys)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Creates high transaction count metrics</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Generates mild buy pressure</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Appears as widespread buying interest</span>
                    </li>
                  </ul>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-3">Key Benefits</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <Badge className="bg-green-600/20 text-green-400 hover:bg-green-600/20 mr-2 mt-0.5">
                        Transaction Count
                      </Badge>
                      <span>Boosts transaction count metrics on tracking sites</span>
                    </li>
                    <li className="flex items-start">
                      <Badge className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/20 mr-2 mt-0.5">
                        Buy Pressure
                      </Badge>
                      <span>Creates mild but consistent buy pressure</span>
                    </li>
                    <li className="flex items-start">
                      <Badge className="bg-purple-600/20 text-purple-400 hover:bg-purple-600/20 mr-2 mt-0.5">
                        Perception
                      </Badge>
                      <span>Creates perception of widespread interest in the token</span>
                    </li>
                    <li className="flex items-start">
                      <Badge className="bg-amber-600/20 text-amber-400 hover:bg-amber-600/20 mr-2 mt-0.5">
                        Efficiency
                      </Badge>
                      <span>Achieves high transaction count with relatively low SOL expenditure</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-green-900/10 border border-green-900/20 rounded-lg">
                <h3 className="text-lg font-medium text-green-400 mb-2">Optimal Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Trade Size</h4>
                    <p className="text-sm text-gray-400">Min: 0.0001 SOL / Max: 0.001 SOL</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Very small trade sizes maximize transaction count per SOL
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Number of Wallets</h4>
                    <p className="text-sm text-gray-400">Recommended: 15-25 wallets</p>
                    <p className="text-xs text-gray-500 mt-1">More wallets create appearance of widespread interest</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Duration</h4>
                    <p className="text-sm text-gray-400">Recommended: 4-12 hours per session</p>
                    <p className="text-xs text-gray-500 mt-1">Can be run in multiple sessions throughout the day</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Advanced Settings</h4>
                    <p className="text-sm text-gray-400">Slippage: Lower than default (1-2%)</p>
                    <p className="text-xs text-gray-500 mt-1">Small trades need less slippage tolerance</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Best Use Cases</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-[#111] rounded-lg border border-gray-800">
                    <h4 className="font-medium mb-2 text-green-400">Transaction Rankings</h4>
                    <p className="text-sm text-gray-400">
                      Ideal for tokens looking to boost their ranking on sites that track transaction counts rather than
                      volume.
                    </p>
                  </div>
                  <div className="p-3 bg-[#111] rounded-lg border border-gray-800">
                    <h4 className="font-medium mb-2 text-green-400">Community Perception</h4>
                    <p className="text-sm text-gray-400">
                      Creates the appearance of widespread community interest with many small buys.
                    </p>
                  </div>
                  <div className="p-3 bg-[#111] rounded-lg border border-gray-800">
                    <h4 className="font-medium mb-2 text-green-400">Limited Budget</h4>
                    <p className="text-sm text-gray-400">
                      Effective for projects with limited funds that still need to show significant activity.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-900/10 border border-yellow-900/20 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-400 mb-2">Important Considerations</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Higher transaction fees relative to trade size</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>May require more wallets to appear natural</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Creates buy pressure without corresponding sell pressure</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>May gradually increase token price over time</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pattern Strategy Tab */}
        <TabsContent value="pattern" className="space-y-6">
          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-amber-600/20 text-amber-400 hover:bg-amber-600/20">Pattern Strategy</Badge>
              </CardTitle>
              <CardDescription>Controlled bullish bias for sustainable growth</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-3">How It Works</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    The Pattern strategy executes 2 buy transactions followed by 1 sell transaction in each cycle. This
                    creates a bullish bias in the trading pattern while still maintaining natural-looking volume.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-amber-400 mr-2">•</span>
                      <span>4 trades per minute (2:1 buy-to-sell ratio)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-400 mr-2">•</span>
                      <span>Creates mild but consistent buy pressure</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-400 mr-2">•</span>
                      <span>Maintains natural-looking trading patterns</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-400 mr-2">•</span>
                      <span>Encourages gradual, sustainable price growth</span>
                    </li>
                  </ul>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-3">Key Benefits</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <Badge className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/20 mr-2 mt-0.5">
                        Bullish Bias
                      </Badge>
                      <span>Creates gentle upward price pressure over time</span>
                    </li>
                    <li className="flex items-start">
                      <Badge className="bg-green-600/20 text-green-400 hover:bg-green-600/20 mr-2 mt-0.5">
                        Efficiency
                      </Badge>
                      <span>Good balance of cost efficiency and market impact</span>
                    </li>
                    <li className="flex items-start">
                      <Badge className="bg-purple-600/20 text-purple-400 hover:bg-purple-600/20 mr-2 mt-0.5">
                        Natural
                      </Badge>
                      <span>Trading pattern appears organic despite the buy bias</span>
                    </li>
                    <li className="flex items-start">
                      <Badge className="bg-amber-600/20 text-amber-400 hover:bg-amber-600/20 mr-2 mt-0.5">
                        Sustainable
                      </Badge>
                      <span>Can run for extended periods with controlled price impact</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-amber-900/10 border border-amber-900/20 rounded-lg">
                <h3 className="text-lg font-medium text-amber-400 mb-2">Optimal Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Trade Size</h4>
                    <p className="text-sm text-gray-400">Min: 0.01 SOL / Max: 0.08 SOL</p>
                    <p className="text-xs text-gray-500 mt-1">Moderate trade sizes balance impact and sustainability</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Number of Wallets</h4>
                    <p className="text-sm text-gray-400">Recommended: 10-20 wallets</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Multiple wallets distribute activity for natural appearance
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Duration</h4>
                    <p className="text-sm text-gray-400">Recommended: 8-24 hours per session</p>
                    <p className="text-xs text-gray-500 mt-1">Works well for continuous operation over multiple days</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Advanced Settings</h4>
                    <p className="text-sm text-gray-400">AntiMEV: Recommended</p>
                    <p className="text-xs text-gray-500 mt-1">Ensures consistent execution of the buy-sell pattern</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Best Use Cases</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-[#111] rounded-lg border border-gray-800">
                    <h4 className="font-medium mb-2 text-amber-400">Growth Phase</h4>
                    <p className="text-sm text-gray-400">
                      Ideal for tokens in their growth phase that need steady price appreciation alongside volume.
                    </p>
                  </div>
                  <div className="p-3 bg-[#111] rounded-lg border border-gray-800">
                    <h4 className="font-medium mb-2 text-amber-400">Post-Launch Stability</h4>
                    <p className="text-sm text-gray-400">
                      Perfect for the period after initial launch when you want controlled growth rather than
                      volatility.
                    </p>
                  </div>
                  <div className="p-3 bg-[#111] rounded-lg border border-gray-800">
                    <h4 className="font-medium mb-2 text-amber-400">Accumulation Phases</h4>
                    <p className="text-sm text-gray-400">
                      Effective during accumulation phases to maintain activity while encouraging gradual price growth.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-900/10 border border-blue-900/20 rounded-lg">
                <h3 className="text-lg font-medium text-blue-400 mb-2">Important Considerations</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>Will gradually increase token price over time due to buy bias</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>May require periodic adjustment of trade sizes as price changes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>More effective when combined with real marketing efforts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>Consider alternating with Bump strategy for extended operations</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
