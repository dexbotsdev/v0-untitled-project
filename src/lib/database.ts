import { initDatabase, seedDatabase, backupDatabase } from "../services/db-service"

/**
 * Initialize the database and seed it with initial data if needed
 */
export async function setupDatabase(): Promise<void> {
  try {
    // Initialize database
    await initDatabase()

    // Seed database with initial data if needed
    await seedDatabase()

    console.log("Database setup completed successfully")
  } catch (error) {
    console.error("Database setup failed:", error)
    throw error
  }
}

/**
 * Create a backup of the database
 */
export async function createDatabaseBackup(): Promise<string> {
  try {
    const backupPath = await backupDatabase()
    console.log(`Database backup created at: ${backupPath}`)
    return backupPath
  } catch (error) {
    console.error("Database backup failed:", error)
    throw error
  }
}

// Export all database services
export * from "../services/db-service"
