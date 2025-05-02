import { Sequelize } from "sequelize"
import { TokenModel } from "./token"
import { BundlerConfigModel } from "./bundlerConfig"

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
})

const Token = TokenModel(sequelize)
const BundlerConfig = BundlerConfigModel(sequelize)

// Define associations
Token.hasOne(BundlerConfig, { foreignKey: "tokenAddress", sourceKey: "address" })
BundlerConfig.belongsTo(Token, { foreignKey: "tokenAddress", targetKey: "address" })

export { sequelize, Token, BundlerConfig }
