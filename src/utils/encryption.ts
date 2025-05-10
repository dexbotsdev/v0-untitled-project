import CryptoJS from "crypto-js"

// Default encryption key - should be replaced in production
const DEFAULT_ENCRYPTION_KEY = "SOAR_DEFAULT_ENCRYPTION_KEY_CHANGE_ME"

export class EncryptionService {
  private encryptionKey: string

  constructor(encryptionKey?: string) {
    this.encryptionKey = encryptionKey || DEFAULT_ENCRYPTION_KEY
  }

  /**
   * Encrypt data using AES256
   */
  encrypt(data: any): string {
    const jsonString = JSON.stringify(data)
    return CryptoJS.AES.encrypt(jsonString, this.encryptionKey).toString()
  }

  /**
   * Decrypt data using AES256
   */
  decrypt<T = any>(encryptedData: string): T {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey).toString(CryptoJS.enc.Utf8)
      return JSON.parse(decrypted) as T
    } catch (error) {
      console.error("Failed to decrypt data:", error)
      throw new Error("Failed to decrypt data")
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
  processRequestData<T = any>(data: string | object): T {
    if (typeof data === "string" && this.isEncrypted(data)) {
      return this.decrypt<T>(data)
    }
    return data as T
  }

  /**
   * Process outgoing response data - encrypt if needed
   */
  processResponseData(data: any, shouldEncrypt = true): string | object {
    if (shouldEncrypt) {
      return this.encrypt(data)
    }
    return data
  }
}

export default EncryptionService
