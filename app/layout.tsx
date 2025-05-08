import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Fab Crypto Solutions",
  description: "Fab Vx Volume Bot",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Set license as validated on client side
  if (typeof window !== "undefined") {
    localStorage.setItem("licenseValidated", "true")
  }

  return (
    <html lang="en" className="dark">
      <body className={`${poppins.className} text-stone-200 antialiased`}>
        <div className="flex min-h-screen flex-col">{children}</div>
        <Toaster />
      </body>
    </html>
  )
}
