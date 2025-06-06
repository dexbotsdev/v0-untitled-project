import { type Sequelize, DataTypes, Model } from "sequelize"

export interface WalletAttributes {
  id: number
  address: string
  privateKey: string
  tokenAddress: string
  tradeAmount: number
  buyPrice: number
  tokenAmount: number
  solAmount: number
  tokenSupply: number
}

export interface BundlerConfigAttributes {
  id: number
  tokenAddress: string
  mode: string
  walletsCount: number
  devWalletBuyAmount: number
  delaySeconds: number | null
  minDelay: number | null
  maxDelay: number | null
  wallets: string // Stored as JSON string
}

export class BundlerConfig extends Model<BundlerConfigAttributes> implements BundlerConfigAttributes {
  public id!: number
  public tokenAddress!: string
  public mode!: string
  public walletsCount!: number
  public devWalletBuyAmount!: number
  public delaySeconds!: number | null
  public minDelay!: number | null
  public maxDelay!: number | null
  public wallets!: string
}

export const BundlerConfigModel = (sequelize: Sequelize) => {
  BundlerConfig.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      tokenAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Tokens",
          key: "address",
        },
      },
      mode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      walletsCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      devWalletBuyAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      delaySeconds: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      minDelay: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      maxDelay: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      wallets: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
          return JSON.parse(this.getDataValue("wallets"))
        },
        set(value: WalletAttributes[]) {
          this.setDataValue("wallets", JSON.stringify(value))
        },
      },
    },
    {
      sequelize,
      modelName: "BundlerConfig",
    },
  )

  return BundlerConfig
}
