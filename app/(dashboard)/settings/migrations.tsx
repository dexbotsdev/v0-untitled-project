"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import {
  getMigrationStatus,
  applyMigrations,
  rollbackLastMigration,
  createMigration,
  type MigrationInfo,
} from "@/src/services/migration-service"

export function MigrationManager() {
  const [migrations, setMigrations] = useState<MigrationInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [newMigrationName, setNewMigrationName] = useState("")

  // Load migration status on component mount
  useEffect(() => {
    loadMigrationStatus()
  }, [])

  // Load migration status
  const loadMigrationStatus = async () => {
    setLoading(true)
    try {
      const response = await getMigrationStatus()
      if (response.success) {
        setMigrations(response.applied_migrations)
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load migration status",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Apply pending migrations
  const handleApplyMigrations = async () => {
    setLoading(true)
    try {
      const response = await applyMigrations()
      if (response.success) {
        setMigrations(response.applied_migrations)
        toast({
          title: "Success",
          description: response.message,
        })
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply migrations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Rollback last migration
  const handleRollbackMigration = async () => {
    setLoading(true)
    try {
      const response = await rollbackLastMigration()
      if (response.success) {
        setMigrations(response.applied_migrations)
        toast({
          title: "Success",
          description: response.message,
        })
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to rollback migration",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Create new migration
  const handleCreateMigration = async () => {
    if (!newMigrationName.trim()) {
      toast({
        title: "Error",
        description: "Migration name is required",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await createMigration(newMigrationName)
      if (response.success) {
        setMigrations([...migrations, ...response.applied_migrations])
        setNewMigrationName("")
        toast({
          title: "Success",
          description: response.message,
        })
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create migration",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Database Migrations</CardTitle>
        <CardDescription>Manage database schema changes with versioned migrations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="New migration name"
              value={newMigrationName}
              onChange={(e) => setNewMigrationName(e.target.value)}
              disabled={loading}
            />
            <Button onClick={handleCreateMigration} disabled={loading || !newMigrationName.trim()}>
              Create
            </Button>
          </div>

          <div className="border rounded-md">
            <div className="p-4">
              <h3 className="text-sm font-medium mb-2">Migration History</h3>
              {migrations.length === 0 ? (
                <p className="text-sm text-muted-foreground">No migrations found</p>
              ) : (
                <ul className="space-y-2">
                  {migrations.map((migration) => (
                    <li key={migration.version} className="flex items-center justify-between text-sm">
                      <span>
                        V{migration.version}_{migration.name}
                      </span>
                      <Badge variant={migration.applied ? "success" : "outline"}>
                        {migration.applied ? "Applied" : "Pending"}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleRollbackMigration}
          disabled={loading || !migrations.some((m) => m.applied)}
        >
          Rollback Last Migration
        </Button>
        <Button onClick={handleApplyMigrations} disabled={loading || !migrations.some((m) => !m.applied)}>
          Apply Migrations
        </Button>
      </CardFooter>
    </Card>
  )
}
