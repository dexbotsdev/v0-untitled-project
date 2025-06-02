"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WalletDistributionChartProps {
  wallets: any[]
  totalWallets: number
  maxWallets: number
}

export function WalletDistributionChart({ wallets, totalWallets, maxWallets }: WalletDistributionChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Draw the distribution chart
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Chart dimensions
    const padding = 20
    const chartWidth = rect.width - padding * 2
    const chartHeight = rect.height - padding * 2
    const barWidth = Math.max(2, chartWidth / maxWallets)

    // Draw background grid
    ctx.strokeStyle = "rgba(75, 85, 99, 0.2)"
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()
    }

    // Draw wallet distribution
    const walletGroups = [
      {
        label: "Generated",
        count: wallets.filter((w) => w.status === "generated").length,
        color: "rgba(245, 158, 11, 0.7)",
      },
      { label: "Funded", count: wallets.filter((w) => w.status === "funded").length, color: "rgba(16, 185, 129, 0.7)" },
      { label: "Used", count: wallets.filter((w) => w.status === "used").length, color: "rgba(59, 130, 246, 0.7)" },
      {
        label: "Inactive",
        count: wallets.filter((w) => w.status === "inactive").length,
        color: "rgba(156, 163, 175, 0.7)",
      },
    ]

    // Draw bars
    let xOffset = padding
    walletGroups.forEach((group) => {
      const barHeight = (group.count / totalWallets) * chartHeight

      ctx.fillStyle = group.color
      ctx.fillRect(xOffset, padding + chartHeight - barHeight, chartWidth / walletGroups.length - 10, barHeight)

      // Add label
      ctx.fillStyle = "#E5E7EB"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(group.label, xOffset + (chartWidth / walletGroups.length - 10) / 2, padding + chartHeight + 15)

      // Add count
      ctx.fillText(
        group.count.toString(),
        xOffset + (chartWidth / walletGroups.length - 10) / 2,
        padding + chartHeight - barHeight - 5,
      )

      xOffset += chartWidth / walletGroups.length
    })
  }, [wallets, totalWallets, maxWallets])

  return (
    <Card className="border-gray-800 bg-gray-900/30">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">Wallet Distribution</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <canvas ref={canvasRef} className="w-full h-[200px]" style={{ width: "100%", height: "200px" }} />
      </CardContent>
    </Card>
  )
}
