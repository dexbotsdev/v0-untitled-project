import { invoke } from "@tauri-apps/api/tauri"

export interface MigrationInfo {
  version: number
  name: string
  applied: boolean
}

export interface MigrationResponse {
  success: boolean
  message: string
  applied_migrations: MigrationInfo[]
}

/**
 * Get the current migration status
 */
export async function getMigrationStatus(): Promise<MigrationResponse> {
  try {
    return await invoke<MigrationResponse>("get_migration_status", {
      dbPath: "bossbundler.db",
    })
  } catch (error) {
    console.error("Failed to get migration status:", error)
    return {
      success: false,
      message: `Error: ${error}`,
      applied_migrations: [],
    }
  }
}

/**
 * Apply all pending migrations
 */
export async function applyMigrations(): Promise<MigrationResponse> {
  try {
    return await invoke<MigrationResponse>("apply_migrations", {
      dbPath: "bossbundler.db",
    })
  } catch (error) {
    console.error("Failed to apply migrations:", error)
    return {
      success: false,
      message: `Error: ${error}`,
      applied_migrations: [],
    }
  }
}

/**
 * Rollback the last applied migration
 */
export async function rollbackLastMigration(): Promise<MigrationResponse> {
  try {
    return await invoke<MigrationResponse>("rollback_last_migration", {
      dbPath: "bossbundler.db",
    })
  } catch (error) {
    console.error("Failed to rollback migration:", error)
    return {
      success: false,
      message: `Error: ${error}`,
      applied_migrations: [],
    }
  }
}

/**
 * Create a new migration
 */
export async function createMigration(name: string): Promise<MigrationResponse> {
  try {
    return await invoke<MigrationResponse>("create_migration", {
      name,
    })
  } catch (error) {
    console.error("Failed to create migration:", error)
    return {
      success: false,
      message: `Error: ${error}`,
      applied_migrations: [],
    }
  }
}
