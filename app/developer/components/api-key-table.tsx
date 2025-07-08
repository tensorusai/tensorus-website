"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MoreHorizontal, Copy, Edit2, Trash2, Eye, EyeOff, AlertTriangle, Key, Calendar, Clock, Activity } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getStoredAPIKeys, updateAPIKey, revokeAPIKey, deleteAPIKey, copyToClipboard, isKeyExpired, formatDate, getRelativeTime, getAPIKeyStats } from "../utils/api-keys"
import type { StoredAPIKey, APIKeyStats } from "../types/api-keys"

interface APIKeyTableProps {
  refreshTrigger?: number
}

export function APIKeyTable({ refreshTrigger }: APIKeyTableProps) {
  const { toast } = useToast()
  const [keys, setKeys] = useState<StoredAPIKey[]>([])
  const [stats, setStats] = useState<APIKeyStats | null>(null)
  const [editingKey, setEditingKey] = useState<StoredAPIKey | null>(null)
  const [editName, setEditName] = useState('')
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadKeys = () => {
    setLoading(true)
    try {
      const storedKeys = getStoredAPIKeys()
      const keyStats = getAPIKeyStats()
      setKeys(storedKeys)
      setStats(keyStats)
    } catch (error) {
      console.error('Error loading API keys:', error)
      toast({
        title: "Error Loading Keys",
        description: "Failed to load API keys. Please refresh the page.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadKeys()
  }, [refreshTrigger])

  const handleCopyKey = async (key: StoredAPIKey) => {
    const success = await copyToClipboard(key.maskedKey)
    if (success) {
      toast({
        title: "Copied to Clipboard",
        description: "Masked API key has been copied to your clipboard.",
      })
    } else {
      toast({
        title: "Copy Failed",
        description: "Failed to copy API key. Please copy it manually.",
        variant: "destructive",
      })
    }
  }

  const handleRevokeKey = async (key: StoredAPIKey) => {
    try {
      revokeAPIKey(key.id)
      loadKeys()
      toast({
        title: "Key Revoked",
        description: `API key "${key.name}" has been revoked successfully.`,
      })
    } catch (error) {
      console.error('Error revoking key:', error)
      toast({
        title: "Revoke Failed",
        description: "Failed to revoke API key. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteKey = async (key: StoredAPIKey) => {
    try {
      deleteAPIKey(key.id)
      loadKeys()
      toast({
        title: "Key Deleted",
        description: `API key "${key.name}" has been deleted successfully.`,
      })
    } catch (error) {
      console.error('Error deleting key:', error)
      toast({
        title: "Delete Failed",
        description: "Failed to delete API key. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditKey = (key: StoredAPIKey) => {
    setEditingKey(key)
    setEditName(key.name)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingKey || !editName.trim()) return

    try {
      updateAPIKey(editingKey.id, { name: editName.trim() })
      loadKeys()
      setIsEditDialogOpen(false)
      setEditingKey(null)
      setEditName('')
      toast({
        title: "Key Updated",
        description: "API key name has been updated successfully.",
      })
    } catch (error) {
      console.error('Error updating key:', error)
      toast({
        title: "Update Failed",
        description: "Failed to update API key. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (key: StoredAPIKey) => {
    if (key.status === 'revoked') {
      return <Badge variant="destructive">Revoked</Badge>
    }
    if (isKeyExpired(key)) {
      return <Badge variant="outline" className="text-orange-600 border-orange-600">Expired</Badge>
    }
    return <Badge variant="default" className="bg-green-600">Active</Badge>
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Total Keys</p>
                  <p className="text-2xl font-bold">{stats.totalKeys}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Active Keys</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeKeys}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <div>
                  <p className="text-sm font-medium">Revoked Keys</p>
                  <p className="text-2xl font-bold text-destructive">{stats.revokedKeys}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Last Used</p>
                  <p className="text-sm font-medium">
                    {stats.lastUsed ? getRelativeTime(stats.lastUsed) : 'Never'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* API Keys Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>
            Manage your API keys and monitor their usage. Keys are masked for security.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {keys.length === 0 ? (
            <div className="text-center py-8">
              <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No API Keys Yet</h3>
              <p className="text-muted-foreground mb-4">
                Generate your first API key to start using the Tensorus API.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{key.name}</div>
                          {key.description && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {key.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {key.maskedKey}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyKey(key)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(key)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{formatDate(key.created)}</div>
                          <div className="text-muted-foreground">
                            {getRelativeTime(key.created)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {key.lastUsed ? (
                            <>
                              <div>{formatDate(key.lastUsed)}</div>
                              <div className="text-muted-foreground">
                                {getRelativeTime(key.lastUsed)}
                              </div>
                            </>
                          ) : (
                            <span className="text-muted-foreground">Never</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{key.usageCount} calls</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditKey(key)}>
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit Name
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopyKey(key)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Key
                            </DropdownMenuItem>
                            {key.status === 'active' && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    className="text-orange-600 focus:text-orange-600"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    Revoke Key
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to revoke "{key.name}"? This will immediately disable the key and any applications using it will lose access.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleRevokeKey(key)}
                                      className="bg-orange-600 hover:bg-orange-700"
                                    >
                                      Revoke Key
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Key
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to permanently delete "{key.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteKey(key)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Delete Key
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit API Key Name</DialogTitle>
            <DialogDescription>
              Update the name of your API key. This won't affect the key's functionality.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">API Key Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter new name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={!editName.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
