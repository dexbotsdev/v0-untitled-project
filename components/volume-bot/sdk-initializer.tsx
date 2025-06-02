"use client"

import { useEffect } from "react"
import { getVolumeBotSDK } from "@/utils/volume-bot-sdk/volume-bot-sdk"

export function VolumeBotSDKInitializer() {
  useEffect(() => {
    // Initialize the SDK
    const sdk = getVolumeBotSDK({
      debug: process.env.NODE_ENV === "development",
    })

    // Clean up when component unmounts
    return () => {
      sdk.destroy()
    }
  }, [])

  // This component doesn't render anything
  return null
}
