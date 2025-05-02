import { type Sequelize, DataTypes, Model } from "sequelize"

export interface TokenAttributes {
  id: number
  name: string
  symbol: string
  description: string
  twitter: string
  telegram: string
  discord: string
  website: string
  image: string
  address: string
}

export class Token extends Model<TokenAttributes> implements TokenAttributes {
  public id!: number
  public name!: string
  public symbol!: string
  public description!: string
  public twitter!: string
  public telegram!: string
  public discord!: string
  public website!: string
  public image!: string
  public address!: string
}

export const TokenModel = (sequelize: Sequelize) => {
  Token.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      symbol: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      twitter: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      telegram: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      discord: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Token",
    },
  )

  return Token
}
