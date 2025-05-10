import Fastify, { type FastifyInstance } from "fastify"
import cors from "@fastify/cors"
import helmet from "@fastify/helmet"
import rateLimit from "@fastify/rate-limit"
import config from "./config"
import logger from "./utils/logger"
import { errorHandler } from "./middleware/error-handler"
import walletRoutes from "./routes/wallet.routes"
import botRoutes from "./routes/bot.routes"

export function buildApp(): FastifyInstance {
  // Create Fastify instance
  const app = Fastify({
    logger,
    trustProxy: true,
  })

  // Register plugins
  app.register(cors, {
    origin: config.security.corsOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-License-Key", "X-Machine-ID"],
    credentials: true,
  })

  app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
      },
    },
  })

  if (config.server.isProd) {
    app.register(rateLimit, {
      max: 100,
      timeWindow: "1 minute",
    })
  }

  // Register routes
  app.register(walletRoutes)
  app.register(botRoutes)

  // Health check route
  app.get("/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() }
  })

  // Error handler
  app.setErrorHandler(errorHandler)

  return app
}
