"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { HelpCircle, Search, Mail, ExternalLink, BookOpen, FileText, MessageSquare } from "lucide-react"

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
    <div className="container mx-auto py-6 space-y-8">
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
              <CardDescription>Find answers to common questions about BOSS</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-gray-800">
                  <AccordionTrigger className="text-left">How do I set up my first token?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">To set up your first token:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Navigate to the Tokens page using the sidebar</li>
                      <li>Click the "Add Token" button in the top right</li>
                      <li>Fill in the token details in the dialog</li>
                      <li>Click "Save" to add your token</li>
                    </ol>
                    <p className="mt-2 text-gray-400">
                      Your token will appear in the token list and you can manage it from there.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-gray-800">
                  <AccordionTrigger className="text-left">What is the Bundler Wizard?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">The Bundler Wizard is a powerful tool that helps you:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Configure token launch parameters</li>
                      <li>Set up automated trading strategies</li>
                      <li>
                        Choose between different launch modes including Just Launch, Bundle Block 0, Delayed Launch,
                        Staggered Launch, and Launch+Snipe
                      </li>
                      <li>Optimize your token launch for maximum success</li>
                    </ul>
                    <p className="mt-2 text-gray-400">
                      Access the Bundler Wizard from the token management screen by clicking "Bundle".
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-gray-800">
                  <AccordionTrigger className="text-left">How does Anti-Bubblemap Protection work?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Anti-Bubblemap Protection helps secure your transactions against bubblemap attacks and
                      frontrunning. When enabled, it:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Obfuscates transaction data</li>
                      <li>Uses private mempool channels when available</li>
                      <li>Implements timing strategies to avoid detection</li>
                      <li>Monitors for potential attack vectors in real-time</li>
                    </ul>
                    <p className="mt-2 text-gray-400">
                      For optimal security, we recommend keeping this feature enabled for all sensitive operations.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-gray-800">
                  <AccordionTrigger className="text-left">What happens if my license expires?</AccordionTrigger>
                  <AccordionContent>
                    <p>If your license expires:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>You'll be redirected to the license validation screen</li>
                      <li>Active operations will be gracefully paused</li>
                      <li>Your data and configurations will be preserved</li>
                      <li>You'll need to enter a valid license key to regain access</li>
                    </ul>
                    <p className="mt-2 text-gray-400">
                      To avoid interruptions, we recommend renewing your license at least 7 days before expiration.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border-gray-800">
                  <AccordionTrigger className="text-left">How do I interpret the candlestick chart?</AccordionTrigger>
                  <AccordionContent>
                    <p>The candlestick chart provides real-time price data when a Bundler or Volume Bot is running:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>
                        <span className="text-green-500">Green candles</span> indicate price increases during that time
                        period
                      </li>
                      <li>
                        <span className="text-red-500">Red candles</span> indicate price decreases
                      </li>
                      <li>The "wicks" show the high and low prices during the period</li>
                      <li>The "body" shows the opening and closing prices</li>
                    </ul>
                    <p className="mt-2 text-gray-400">
                      The chart updates automatically every few seconds to give you the most current market data.
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
              <CardDescription>Step-by-step instructions for using BOSS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-[#111] border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Getting Started with BOSS</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-sm text-gray-400 mb-3">
                      A complete introduction to the BOSS platform and its features.
                    </p>
                    <Button variant="outline" className="w-full" size="sm">
                      Read Guide
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-[#111] border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Advanced Bundling Strategies</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-sm text-gray-400 mb-3">
                      Learn how to optimize your bundling for maximum effectiveness.
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
                      Essential security tips for protecting your development and funding wallets.
                    </p>
                    <Button variant="outline" className="w-full" size="sm">
                      Read Guide
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-[#111] border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Understanding Activity Logs</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-sm text-gray-400 mb-3">
                      How to interpret and use the activity logs for troubleshooting and optimization.
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
                  <FileText className="h-4 w-4" />
                  Documentation
                </h3>
                <p className="mt-2 text-sm">
                  For comprehensive documentation on all BOSS features and APIs, visit our documentation portal.
                </p>
                <Button className="mt-3" size="sm">
                  View Documentation
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
                      <p className="text-xs text-gray-400">support@bossplatform.io</p>
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
