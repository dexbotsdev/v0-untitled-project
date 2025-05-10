import type { FastifyRequest, FastifyReply, FastifyError } from "fastify"
import { AppError } from "../utils/errors"
import logger from "../utils/logger"
import encryptionService from "../services/encryption.service"

export async function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  // Check if it's a known application error
  if (error instanceof AppError) {
    logger.warn(`Application error: ${error.message}`)

    return reply.code(error.statusCode).send(
      encryptionService.processResponseData({
        success: false,
        message: error.message,
      }),
    )
  }

  // Handle validation errors from Fastify
  if (error.validation) {
    logger.warn(`Validation error: ${error.message}`)

    return reply.code(400).send(
      encryptionService.processResponseData({
        success: false,
        message: "Validation error: " + error.message,
      }),
    )
  }

  // Handle other errors
  logger.error(`Unhandled error: ${error.message}`, error)

  return reply.code(500).send(
    encryptionService.processResponseData({
      success: false,
      message: "Internal server error",
    }),
  )
}
