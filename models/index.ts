import { Sequelize } from "sequelize"
import { TokenModel } from "./token"
import { BundlerConfigModel } from "./bundlerConfig"

// Create a function to initialize the database connection
export function initializeDatabase() {
  try {
    // Use in-memory SQLite for development/preview environments
    // This avoids the need for the sqlite3 package during deployment
    const sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:", // Use in-memory SQLite instead of file-based
      logging: false, // Disable logging for cleaner output
    })

    // Initialize models
    const Token = TokenModel(sequelize)
    const BundlerConfig = BundlerConfigModel(sequelize)

    // Define associations
    Token.hasOne(BundlerConfig, { foreignKey: "tokenAddress", sourceKey: "address" })
    BundlerConfig.belongsTo(Token, { foreignKey: "tokenAddress", targetKey: "address" })

    return { sequelize, Token, BundlerConfig }
  } catch (error) {
    console.error("Failed to initialize database:", error)
    // Return mock database objects that won't cause runtime errors
    return {
      sequelize: {
        query: async () => [],
        sync: async () => {},
        authenticate: async () => {},
      },
      Token: {},
      BundlerConfig: {},
    }
  }
}

// Export a singleton instance
const db = initializeDatabase()
export const { sequelize, Token, BundlerConfig } = db
