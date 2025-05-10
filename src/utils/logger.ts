import pino from "pino"
import config from "../config"

const transport = pino.transport({
  target: "pino-pretty",
  options: {
    translateTime: "HH:MM:ss Z",
    ignore: "pid,hostname",
  },
})

const logger = pino(
  {
    level: config.server.isProd ? "info" : "debug",
    base: {
      env: config.server.nodeEnv,
    },
  },
  config.server.isDev ? transport : undefined,
)

export default logger
