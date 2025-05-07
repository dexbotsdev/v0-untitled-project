import { setupDatabase, TokenService, WalletService, LicenseService } from "./lib/database"

// Initialize the database when the app starts
async function initApp() {
  try {
    // Setup database
    await setupDatabase()

    // Example: Validate a license key
    const isValid = await LicenseService.validateLicense("FONEI-YZTWR-JWKAA-MUSPT")
    console.log("License validation result:", isValid)

    // Example: Get all tokens
    const tokens = await TokenService.getAll()
    console.log("Available tokens:", tokens)

    // Example: Get wallets for a token
    if (tokens.length > 0) {
      const wallets = await WalletService.getByTokenId(tokens[0].id)
      console.log(`Wallets for ${tokens[0].symbol}:`, wallets)
    }

    console.log("App initialization completed successfully")
  } catch (error) {
    console.error("App initialization failed:", error)
  }
}

// Call the initialization function
initApp()
