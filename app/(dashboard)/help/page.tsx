"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { HelpCircle, Search, Mail, ExternalLink, BookOpen, MessageSquare, BarChart2 } from "lucide-react"

export default function HelpPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactMessage, setContactMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Search initiated",
      description: `Searching for: ${searchQuery}`,
    })
    // In a real app, this would search the help content
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!contactEmail || !contactMessage) {
      toast({
        title: "Missing information",
        description: "Please provide both email and message",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setContactEmail("")
    setContactMessage("")

    toast({
      title: "Message sent",
      description: "We've received your message and will respond shortly",
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-8 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <HelpCircle className="h-8 w-8 text-amber-500" />
          Help Center
        </h1>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="text"
            placeholder="Search for help topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7" size="sm">
            Search
          </Button>
        </form>
      </div>

      <Tabs defaultValue="faq" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 bg-[#111] mb-4">
          <TabsTrigger
            value="faq"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-black data-[state=active]:font-medium"
          >
            FAQ
          </TabsTrigger>
          <TabsTrigger
            value="guides"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-black data-[state=active]:font-medium"
          >
            Guides
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-black data-[state=active]:font-medium"
          >
            Contact Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-4">
          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-amber-500" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Find answers to common questions about the Volume Booster Bot</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-gray-800">
                  <AccordionTrigger className="text-left">What is the Volume Booster Bot?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">
                      The Volume Booster Bot is a sophisticated trading tool designed to increase trading volume for
                      tokens on supported blockchains. It simulates natural market activity through automated trades
                      based on your selected strategy, parameters, and funding.
                    </p>
                    <p className="mt-2 text-gray-400">
                      Higher trading volume often attracts more traders and can increase a token's visibility on
                      exchanges and tracking platforms.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-gray-800">
                  <AccordionTrigger className="text-left">
                    What are the different Volume Bot strategies?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">The Volume Booster Bot offers four unique trading strategies:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <span className="font-medium text-amber-500">Bump</span> - Executes 1 buy and 1 sell transaction
                        every cycle. This creates a natural trading pattern and is ideal for maintaining steady volume
                        without significantly affecting price.
                      </li>
                      <li>
                        <span className="font-medium text-amber-500">Turbo</span> - High volume reverse trader that
                        executes multiple trades in rapid succession, alternating between buys and sells. Best for
                        creating significant volume spikes and attracting attention.
                      </li>
                      <li>
                        <span className="font-medium text-amber-500">MicroBuys</span> - Executes many small buy
                        transactions (as low as 0.0001 SOL each). This strategy creates a high number of transactions
                        with minimal market impact, giving the appearance of strong buying interest.
                      </li>
                      <li>
                        <span className="font-medium text-amber-500">Pattern</span> - Executes 2 buys followed by 1 sell
                        in each cycle. This creates a bullish bias in the trading pattern while still maintaining
                        natural-looking volume.
                      </li>
                    </ul>
                    <p className="mt-2 text-gray-400">
                      Each strategy has different trades per minute: Bump (2/min), Turbo (5/min), MicroBuys (8/min), and
                      Pattern (3/min).
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-gray-800">
                  <AccordionTrigger className="text-left">How do I set up a Volume Bot?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">Setting up a Volume Bot is simple:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Navigate to the Volume Bot page using the sidebar</li>
                      <li>Click the "Create Bot" button</li>
                      <li>Select a wallet to fund the bot operations</li>
                      <li>Choose your preferred strategy (Bump, Turbo, MicroBuys, or Pattern)</li>
                      <li>Set the min and max trade sizes in SOL</li>
                      <li>Set the duration for how long the bot should run</li>
                      <li>Calculate the estimate to see the projected impact and costs</li>
                      <li>Click "Create Bot" to start the process</li>
                    </ol>
                    <p className="mt-2 text-gray-400">
                      Make sure your wallet has sufficient SOL to cover both the trading volume and transaction fees.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-gray-800">
                  <AccordionTrigger className="text-left">How much does it cost to run a Volume Bot?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">The cost of running a Volume Bot depends on several factors:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <span className="font-medium">Transaction fees</span> - Each trade incurs blockchain transaction
                        fees, which vary based on network congestion.
                      </li>
                      <li>
                        <span className="font-medium">Strategy selected</span> - Strategies with more trades per minute
                        (like Turbo or MicroBuys) will incur more transaction fees.
                      </li>
                      <li>
                        <span className="font-medium">Duration</span> - Longer durations mean more total transactions
                        and higher cumulative fees.
                      </li>
                      <li>
                        <span className="font-medium">Trading volume</span> - The actual SOL used in trading is
                        effectively recycled between buys and sells, so the net cost impact is minimal.
                      </li>
                    </ul>
                    <p className="mt-2 text-gray-400">
                      The estimate calculator in the bot creation dialog will show you the projected fees based on your
                      settings. For most setups, expect to allocate 0.05-0.2 SOL for fees per hour of operation.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border-gray-800">
                  <AccordionTrigger className="text-left">Which strategy is best for my needs?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">The best strategy depends on your specific goals:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <span className="font-medium text-amber-500">Bump</span> - Best for steady, natural-looking
                        volume that won't significantly impact price. Good for established tokens wanting to maintain
                        trading activity.
                      </li>
                      <li>
                        <span className="font-medium text-amber-500">Turbo</span> - Ideal for creating high volume
                        spikes to attract attention. Good for promotional events or when trying to get noticed on
                        tracking sites and exchanges.
                      </li>
                      <li>
                        <span className="font-medium text-amber-500">MicroBuys</span> - Perfect for creating a high
                        transaction count with minimal price impact. Good for tokens looking to boost their ranking on
                        sites that track transaction counts rather than volume.
                      </li>
                      <li>
                        <span className="font-medium text-amber-500">Pattern</span> - Best for creating a mild bullish
                        bias while maintaining natural-looking volume. Good for tokens looking to gently encourage
                        positive price action.
                      </li>
                    </ul>
                    <p className="mt-2 text-gray-400">
                      For new tokens or promotional events, consider using Turbo for short bursts. For day-to-day
                      operations, Bump or Pattern often provide the best balance of impact and sustainability.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="space-y-4">
          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-500" />
                Guides & Tutorials
              </CardTitle>
              <CardDescription>Step-by-step instructions for using the Volume Booster Bot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-[#111] border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Getting Started with Volume Bot</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-sm text-gray-400 mb-3">
                      A complete introduction to the Volume Booster Bot and how to set it up for the first time.
                    </p>
                    <Button variant="outline" className="w-full" size="sm">
                      Read Guide
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-[#111] border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Advanced Volume Strategies</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-sm text-gray-400 mb-3">
                      Learn how to optimize your volume strategy for maximum effectiveness and efficiency.
                    </p>
                    <Button variant="outline" className="w-full" size="sm">
                      Read Guide
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-[#111] border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Wallet Security Best Practices</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-sm text-gray-400 mb-3">
                      Essential security tips for protecting your wallets when using automated trading tools.
                    </p>
                    <Button variant="outline" className="w-full" size="sm">
                      Read Guide
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-[#111] border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Analyzing Volume Bot Results</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-sm text-gray-400 mb-3">
                      How to interpret results and metrics to optimize your future volume strategies.
                    </p>
                    <Button variant="outline" className="w-full" size="sm">
                      Read Guide
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 p-4 bg-amber-900/20 border border-amber-800/30 rounded-md">
                <h3 className="text-amber-500 font-medium flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  Volume Bot Strategy Guide
                </h3>
                <p className="mt-2 text-sm">
                  For a comprehensive breakdown of each volume strategy and optimal settings for different market
                  conditions, download our strategy guide.
                </p>
                <Button className="mt-3" size="sm">
                  Download Strategy Guide
                  <ExternalLink className="ml-2 h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-amber-500" />
                Contact Support
              </CardTitle>
              <CardDescription>Get help from our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Your Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="Describe your issue or question in detail..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full min-h-[150px] rounded-md border border-gray-800 bg-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="animate-pulse">Sending...</span>
                      </>
                    ) : (
                      <>
                        Send Message
                        <Mail className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-6 p-4 bg-[#111] rounded-md">
                <h3 className="font-medium">Other Ways to Reach Us</h3>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-800 p-2 rounded-full">
                      <MessageSquare className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Live Chat</p>
                      <p className="text-xs text-gray-400">Available 24/7 for Premium users</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-gray-800 p-2 rounded-full">
                      <Mail className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email Support</p>
                      <p className="text-xs text-gray-400">support@volumebot.io</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
