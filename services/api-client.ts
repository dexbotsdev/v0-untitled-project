/**
 * Base API client for making HTTP requests with encryption
 */
import CryptoJS from "crypto-js"

export class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>
  private encKey: string

  constructor(ip = "127.0.0.1", port = "3000", encKey = "", licenseKey = "", machineId = "", basePathPrefix = "/api") {
    // Construct base URL from IP and port
    this.baseUrl = `http://${ip}:${port}${basePathPrefix}`

    // Add license key and machine ID to headers
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-License-Key": licenseKey,
      "X-Machine-ID": machineId,
    }

    // Store encryption key
    this.encKey = encKey
  }

  /**
   * Encrypt data using AES256
   */
  private encrypt(data: any): string {
    if (!this.encKey) return JSON.stringify(data)

    const jsonString = JSON.stringify(data)
    return CryptoJS.AES.encrypt(jsonString, this.encKey).toString()
  }

  /**
   * Decrypt data using AES256
   */
  private decrypt(encryptedData: string): any {
    if (!this.encKey) return JSON.parse(encryptedData)

    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.encKey).toString(CryptoJS.enc.Utf8)
      return JSON.parse(decrypted)
    } catch (error) {
      console.error("Failed to decrypt response:", error)
      throw new Error("Failed to decrypt response")
    }
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint, params ? this.encrypt(params) : undefined)

    const response = await fetch(url, {
      method: "GET",
      headers: this.defaultHeaders,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const responseText = await response.text()
    return this.decrypt(responseText) as T
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const url = this.buildUrl(endpoint)
    const encryptedData = data ? this.encrypt(data) : undefined

    const response = await fetch(url, {
      method: "POST",
      headers: this.defaultHeaders,
      body: encryptedData,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const responseText = await response.text()
    return this.decrypt(responseText) as T
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const url = this.buildUrl(endpoint)
    const encryptedData = data ? this.encrypt(data) : undefined

    const response = await fetch(url, {
      method: "PUT",
      headers: this.defaultHeaders,
      body: encryptedData,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const responseText = await response.text()
    return this.decrypt(responseText) as T
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    const url = this.buildUrl(endpoint)

    const response = await fetch(url, {
      method: "DELETE",
      headers: this.defaultHeaders,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const responseText = await response.text()
    return this.decrypt(responseText) as T
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(endpoint: string, encryptedParams?: string): string {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin)

    if (encryptedParams) {
      url.searchParams.append("data", encryptedParams)
    }

    return url.toString()
  }
}

// Create a singleton instance with default values
// In a real app, you would inject these values from configuration
export const apiClient = new ApiClient()
