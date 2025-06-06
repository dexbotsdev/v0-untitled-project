// This is a placeholder file to maintain compatibility with existing imports
// We're moving away from Sequelize to use our bundlerSDK instead

export const sequelize = {
  query: async () => {
    console.warn("Sequelize is deprecated. Please use bundlerSDK instead.")
    return [[], 0]
  },
}
