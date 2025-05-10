import { buildApp } from "./app"
import config from "./config"
import logger from "./utils/logger"

const app = buildApp()

// Start server
const start = async () => {
  try {
    await app.listen({
      port: config.server.port,
      host: config.server.host,
    })

    logger.info(`Server is running on http://${config.server.host}:${config.server.port}`)
    logger.info(`Environment: ${config.server.nodeEnv}`)
  } catch (err) {
    logger.error("Error starting server:", err)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  logger.info("SIGINT received, shutting down gracefully")
  await app.close()
  process.exit(0)
})

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully")
  await app.close()
  process.exit(0)
})

// Catch unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason)
})

// Catch uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error)
  process.exit(1)
})

// Start the server
start()
