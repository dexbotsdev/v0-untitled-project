"use client"

import { useEffect } from "react"

export function AutoLicenseValidator() {
  useEffect(() => {
    // Always set license as validated
    localStorage.setItem("licenseValidated", "true")
  }, [])

  return null
}
