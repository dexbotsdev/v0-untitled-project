/**
 * Helper functions for services
 */

/**
 * Format a wallet address for display
 * @param address The full wallet address
 * @param prefixLength Number of characters to show at the beginning
 * @param suffixLength Number of characters to show at the end
 * @returns Formatted address string
 */
export function formatAddress(address: string, prefixLength = 6, suffixLength = 4): string {
  if (!address || address.length < prefixLength + suffixLength) {
    return address
  }

  return `${address.substring(0, prefixLength)}...${address.substring(address.length - suffixLength)}`
}

/**
 * Format a number as currency
 * @param value The number to format
 * @param currency The currency symbol
 * @param decimals Number of decimal places
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency = "$", decimals = 2): string {
  return `${currency}${value.toFixed(decimals)}`
}

/**
 * Format a percentage value
 * @param value The percentage value
 * @param includeSign Whether to include a + sign for positive values
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, includeSign = true): string {
  const sign = includeSign && value > 0 ? "+" : ""
  return `${sign}${value.toFixed(2)}%`
}

/**
 * Get a CSS class based on a value's sign
 * @param value The numeric value
 * @param positiveClass CSS class for positive values
 * @param negativeClass CSS class for negative values
 * @param neutralClass CSS class for zero values
 * @returns The appropriate CSS class
 */
export function getValueColorClass(
  value: number,
  positiveClass = "text-green-500",
  negativeClass = "text-red-500",
  neutralClass = "text-gray-500",
): string {
  if (value > 0) return positiveClass
  if (value < 0) return negativeClass
  return neutralClass
}

/**
 * Truncate a string to a maximum length
 * @param str The string to truncate
 * @param maxLength Maximum length before truncation
 * @param suffix Suffix to add when truncated
 * @returns Truncated string
 */
export function truncateString(str: string, maxLength = 30, suffix = "..."): string {
  if (!str || str.length <= maxLength) {
    return str
  }

  return `${str.substring(0, maxLength)}${suffix}`
}
