// Simple encryption/decryption utility for sensitive data

// This is a placeholder for a more secure encryption implementation
// In a production environment, you should use a proper encryption library

export function encrypt(text: string): string {
  // Simple base64 encoding for demo purposes
  // In production, use a proper encryption algorithm
  return Buffer.from(text).toString("base64")
}

export function decrypt(encryptedText: string): string {
  // Simple base64 decoding for demo purposes
  // In production, use a proper decryption algorithm
  return Buffer.from(encryptedText, "base64").toString("utf-8")
}
