import type { FastifyInstance } from "fastify"
import walletController from "../controllers/wallet.controller"

export default async function walletRoutes(fastify: FastifyInstance): Promise<void> {
  // Generate wallets for a bot
  fastify.post("/wallets/generate", walletController.generateWallets.bind(walletController))

  // Fund wallets with SOL
  fastify.post("/wallets/fund", walletController.fundWallets.bind(walletController))

  // Import existing wallets
  fastify.post("/wallets/import", walletController.importWallets.bind(walletController))

  // Tag wallets
  fastify.post("/wallets/tag", walletController.tagWallets.bind(walletController))

  // Recover funds from wallets
  fastify.post("/wallets/recover", walletController.recoverFunds.bind(walletController))

  // Delete wallets
  fastify.post("/wallets/delete", walletController.deleteWallets.bind(walletController))

  // Convert WSOL to SOL
  fastify.post("/wallets/convert-wsol", walletController.convertWsol.bind(walletController))
}
