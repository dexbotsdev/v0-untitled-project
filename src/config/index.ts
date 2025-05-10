import dotenv from "dotenv"
import path from "path"

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), ".env") })

interface ServerConfig {
  port: number
  host: string
  nodeEnv: string
  isProd: boolean
  isDev: boolean
  isTest: boolean
}

interface SecurityConfig {
  encryptionKey: string
  corsOrigin: string | boolean
}

interface StorageConfig {
  persistPath: string | null
}

interface Config {
  server: ServerConfig
  security: SecurityConfig
  storage: StorageConfig
}

// Server configuration
const serverConfig: ServerConfig = {
  port: Number.parseInt(process.env.PORT || "3000", 10),
  host: process.env.HOST || "0.0.0.0",
  nodeEnv: process.env.NODE_ENV || "development",
  isProd: process.env.NODE_ENV === "production",
  isDev: process.env.NODE_ENV === "development" || !process.env.NODE_ENV,
  isTest: process.env.NODE_ENV === "test",
}

// Security configuration
const securityConfig: SecurityConfig = {
  encryptionKey: process.env.ENCRYPTION_KEY || "default-encryption-key-change-me-in-production",
  corsOrigin: process.env.CORS_ORIGIN || true,
}

// Storage configuration
const storageConfig: StorageConfig = {
  persistPath: process.env.PERSIST_PATH || null,
}

const config: Config = {
  server: serverConfig,
  security: securityConfig,
  storage: storageConfig,
}

export default config
