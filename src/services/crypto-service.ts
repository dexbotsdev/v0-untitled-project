/**
 * Crypto service for encrypting and decrypting sensitive data
 *
 * NOTE: This is a simplified implementation for demonstration purposes.
 * In a production environment, you should use a more secure encryption method
 * and proper key management.
 */

// In a real app, this would be securely stored or derived from user input
const ENCRYPTION_KEY = "bossbundler-encryption-key-2023"

/**
 * Encrypt a string
 * @param text Text to encrypt
 * @returns Encrypted text
 */
export function encrypt(text: string): string {
  // This is a very basic encryption for demonstration
  // In a real app, use a proper encryption library

  // Simple XOR encryption with the key
  let result = ""
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
    result += String.fromCharCode(charCode)
  }

  // Convert to base64 for storage
  return Buffer.from(result).toString("base64")
}

/**
 * Decrypt an encrypted string
 * @param encryptedText Encrypted text to decrypt
 * @returns Decrypted text
 */
export function decrypt(encryptedText: string): string {
  try {
    // Convert from base64
    const base64Decoded = Buffer.from(encryptedText, "base64").toString()

    // Simple XOR decryption with the key
    let result = ""
    for (let i = 0; i < base64Decoded.length; i++) {
      const charCode = base64Decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
      result += String.fromCharCode(charCode)
    }

    return result
  } catch (error) {
    console.error("Failed to decrypt text:", error)
    throw new Error("Decryption failed")
  }
}
