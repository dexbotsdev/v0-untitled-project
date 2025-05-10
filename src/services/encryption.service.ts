import CryptoJS from "crypto-js"
import config from "../config"
import logger from "../utils/logger"
import { BadRequestError } from "../utils/errors"

export class EncryptionService {
  private encryptionKey: string

  constructor(encryptionKey?: string) {
    this.encryptionKey = encryptionKey || config.security.encryptionKey
  }

  /**
   * Encrypt data using AES256
   */
  encrypt(data: any): string {
    try {
      const jsonString = JSON.stringify(data)
      return CryptoJS.AES.encrypt(jsonString, this.encryptionKey).toString()
    } catch (error) {
      logger.error("Encryption error:", error)
      throw new Error("Failed to encrypt data")
    }
  }

  /**
   * Decrypt data using AES256
   */
  decrypt<T = any>(encryptedData: string): T {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey).toString(CryptoJS.enc.Utf8)
      return JSON.parse(decrypted) as T
    } catch (error) {
      logger.error("Decryption error:", error)
      throw new BadRequestError("Failed to decrypt data")
    }
  }

  /**
   * Check if a string is encrypted
   */
  isEncrypted(data: string): boolean {
    try {
      // Try to decrypt - if it fails, it's not encrypted or uses a different key
      CryptoJS.AES.decrypt(data, this.encryptionKey).toString(CryptoJS.enc.Utf8)
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Process incoming request data - decrypt if encrypted
   */
  processRequestData<T = any>(data: any): T {
    if (typeof data === "object" && data !== null && "encryptedData" in data) {
      return this.decrypt<T>(data.encryptedData as string)
    }

    if (typeof data === "string" && this.isEncrypted(data)) {
      return this.decrypt<T>(data)
    }

    return data as T
  }

  /**
   * Process outgoing response data - encrypt if needed
   */
  processResponseData(data: any, shouldEncrypt = true): any {
    if (shouldEncrypt) {
      return { encryptedData: this.encrypt(data) }
    }
    return data
  }
}

// Create a singleton instance
export const encryptionService = new EncryptionService()

export default encryptionService
