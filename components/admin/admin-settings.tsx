"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Settings,
  Bell,
  Shield,
  Database,
  Palette,
  Save,
  RefreshCw,
  AlertTriangle,
  Download,
  Upload,
  Trash2,
  Sun,
  Moon,
  Monitor,
  HardDrive,
  Clock,
  FileJson,
  RotateCcw,
  Archive,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { useSettingsStore, type BackupData } from "@/lib/settings-store"
import { cn } from "@/lib/utils"

type OperationStatus = "idle" | "loading" | "success" | "error"

interface OperationState {
  status: OperationStatus
  progress: number
  message: string
}

export function AdminSettings() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Dialog states
  const [showBackupDialog, setShowBackupDialog] = useState(false)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)

  // Operation states
  const [operation, setOperation] = useState<OperationState>({
    status: "idle",
    progress: 0,
    message: "",
  })
  const [backupName, setBackupName] = useState("")
  const [selectedBackup, setSelectedBackup] = useState<BackupData | null>(null)
  const [importData, setImportData] = useState("")

  // Store
  const {
    general,
    moderation,
    notification,
    appearance,
    backups,
    lastBackup,
    isDirty,
    updateGeneral,
    updateModeration,
    updateNotification,
    updateAppearance,
    saveAllSettings,
    resetToDefaults,
    createBackup,
    restoreBackup,
    deleteBackup,
    exportData,
    importData: importSettingsData,
    clearAllData,
  } = useSettingsStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync theme with appearance settings
  useEffect(() => {
    if (mounted && appearance.defaultTheme) {
      setTheme(appearance.defaultTheme)
    }
  }, [appearance.defaultTheme, mounted, setTheme])

  const simulateOperation = async (operationName: string, duration = 2000): Promise<boolean> => {
    setOperation({ status: "loading", progress: 0, message: `${operationName}...` })

    const steps = 10
    const stepDuration = duration / steps

    for (let i = 1; i <= steps; i++) {
      await new Promise((resolve) => setTimeout(resolve, stepDuration))
      setOperation({
        status: "loading",
        progress: (i / steps) * 100,
        message: `${operationName}... ${Math.round((i / steps) * 100)}%`,
      })
    }

    setOperation({ status: "success", progress: 100, message: "Complete!" })
    await new Promise((resolve) => setTimeout(resolve, 500))
    setOperation({ status: "idle", progress: 0, message: "" })
    return true
  }

  const handleSaveAll = async () => {
    await simulateOperation("Saving settings", 1500)
    saveAllSettings()
    toast.success("Settings Saved", {
      description: "All your settings have been saved successfully.",
    })
  }

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    updateAppearance({ defaultTheme: newTheme })
    setTheme(newTheme)
    toast.success("Theme Changed", {
      description: `Theme set to ${newTheme === "system" ? "system preference" : newTheme + " mode"}.`,
    })
  }

  const handleCreateBackup = async () => {
    await simulateOperation("Creating backup", 2000)
    const backup = createBackup(backupName || undefined)
    setShowBackupDialog(false)
    setBackupName("")
    toast.success("Backup Created", {
      description: `"${backup.name}" has been created successfully.`,
    })
  }

  const handleRestoreBackup = async () => {
    if (!selectedBackup) return
    await simulateOperation("Restoring backup", 2500)
    const success = restoreBackup(selectedBackup.id)
    setShowRestoreDialog(false)
    setSelectedBackup(null)
    if (success) {
      toast.success("Backup Restored", {
        description: `Settings restored from "${selectedBackup.name}".`,
      })
    } else {
      toast.error("Restore Failed", {
        description: "Could not restore the backup. Please try again.",
      })
    }
  }

  const handleDeleteBackup = (backup: BackupData) => {
    deleteBackup(backup.id)
    toast.success("Backup Deleted", {
      description: `"${backup.name}" has been deleted.`,
    })
  }

  const handleExport = async () => {
    await simulateOperation("Exporting data", 1500)
    const data = exportData()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `nemsutalks-settings-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Export Complete", {
      description: "Settings exported successfully.",
    })
  }

  const handleImport = async () => {
    await simulateOperation("Importing data", 2000)
    const success = importSettingsData(importData)
    setShowImportDialog(false)
    setImportData("")
    if (success) {
      toast.success("Import Complete", {
        description: "Settings imported successfully.",
      })
    } else {
      toast.error("Import Failed", {
        description: "Invalid data format. Please check the file and try again.",
      })
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setImportData(content)
      }
      reader.readAsText(file)
    }
  }

  const handleClearAll = async () => {
    await simulateOperation("Clearing all data", 3000)
    clearAllData()
    setShowClearDialog(false)
    toast.success("Data Cleared", {
      description: "All settings and data have been reset.",
    })
  }

  const handleResetToDefaults = async () => {
    await simulateOperation("Resetting to defaults", 1500)
    resetToDefaults()
    setTheme("light")
    setShowResetDialog(false)
    toast.success("Settings Reset", {
      description: "All settings have been reset to defaults.",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Configure platform settings and preferences</p>
        </div>
        {isDirty && (
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm animate-fade-in">
            <AlertTriangle className="h-4 w-4" />
            <span>You have unsaved changes</span>
          </div>
        )}
      </div>

      {/* Operation Progress */}
      {operation.status === "loading" && (
        <Card className="border-primary/20 bg-primary/5 animate-fade-in">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{operation.message}</p>
                <Progress value={operation.progress} className="h-2 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Appearance Settings - Priority placement */}
      <Card className="card-hover overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg">Appearance</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Customize the platform theme</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Theme Mode</Label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                onClick={() => handleThemeChange("light")}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all duration-300",
                  "hover:border-primary/50 hover:bg-primary/5",
                  theme === "light" ? "border-primary bg-primary/10 shadow-md" : "border-border bg-card",
                )}
              >
                <div
                  className={cn(
                    "p-2 sm:p-3 rounded-full transition-colors",
                    theme === "light" ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="text-xs sm:text-sm font-medium">Light</span>
                {theme === "light" && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                )}
              </button>

              <button
                onClick={() => handleThemeChange("dark")}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all duration-300",
                  "hover:border-primary/50 hover:bg-primary/5",
                  theme === "dark" ? "border-primary bg-primary/10 shadow-md" : "border-border bg-card",
                )}
              >
                <div
                  className={cn(
                    "p-2 sm:p-3 rounded-full transition-colors",
                    theme === "dark" ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="text-xs sm:text-sm font-medium">Dark</span>
                {theme === "dark" && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                )}
              </button>

              <button
                onClick={() => handleThemeChange("system")}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all duration-300",
                  "hover:border-primary/50 hover:bg-primary/5",
                  theme === "system" ? "border-primary bg-primary/10 shadow-md" : "border-border bg-card",
                )}
              >
                <div
                  className={cn(
                    "p-2 sm:p-3 rounded-full transition-colors",
                    theme === "system" ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  <Monitor className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="text-xs sm:text-sm font-medium">System</span>
                {theme === "system" && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                )}
              </button>
            </div>
          </div>

          <Separator />

          {/* Additional Appearance Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Allow Dark Mode for Users</Label>
                <p className="text-xs text-muted-foreground">Let users switch themes</p>
              </div>
              <Switch
                checked={appearance.allowDarkMode}
                onCheckedChange={(checked) => {
                  updateAppearance({ allowDarkMode: checked })
                  toast.success(checked ? "Dark mode enabled" : "Dark mode disabled")
                }}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="primaryColor" className="text-sm">
                  Primary Color
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={appearance.primaryColor}
                    onChange={(e) => updateAppearance({ primaryColor: e.target.value })}
                    className="w-12 h-10 p-1 cursor-pointer rounded-lg"
                  />
                  <Input
                    value={appearance.primaryColor}
                    onChange={(e) => updateAppearance({ primaryColor: e.target.value })}
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card className="card-hover">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg">General Settings</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Basic configuration for the platform</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="siteName" className="text-sm">
                Site Name
              </Label>
              <Input
                id="siteName"
                value={general.siteName}
                onChange={(e) => updateGeneral({ siteName: e.target.value })}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail" className="text-sm">
                Admin Email
              </Label>
              <Input
                id="adminEmail"
                type="email"
                value={general.adminEmail}
                onChange={(e) => updateGeneral({ adminEmail: e.target.value })}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteDescription" className="text-sm">
              Site Description
            </Label>
            <Textarea
              id="siteDescription"
              value={general.siteDescription}
              onChange={(e) => updateGeneral({ siteDescription: e.target.value })}
              rows={3}
              className="resize-none transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Allow New Registrations</Label>
                <p className="text-xs text-muted-foreground">Enable or disable new user sign-ups</p>
              </div>
              <Switch
                checked={general.allowRegistration}
                onCheckedChange={(checked) => {
                  updateGeneral({ allowRegistration: checked })
                  toast.success(checked ? "Registrations enabled" : "Registrations disabled")
                }}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-colors border border-amber-500/20">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">Maintenance Mode</Label>
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                </div>
                <p className="text-xs text-muted-foreground">Temporarily disable the platform for users</p>
              </div>
              <Switch
                checked={general.maintenanceMode}
                onCheckedChange={(checked) => {
                  updateGeneral({ maintenanceMode: checked })
                  toast[checked ? "warning" : "success"](
                    checked ? "Maintenance mode enabled" : "Maintenance mode disabled",
                  )
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Moderation Settings */}
      <Card className="card-hover">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg">Content Moderation</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Configure automated content moderation</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              key: "autoModeration",
              label: "Auto-Moderation",
              description: "Automatically review posts using AI",
            },
            {
              key: "requireApproval",
              label: "Require Post Approval",
              description: "Manually approve posts before publishing",
            },
            {
              key: "profanityFilter",
              label: "Profanity Filter",
              description: "Block posts containing inappropriate language",
            },
            {
              key: "spamDetection",
              label: "Spam Detection",
              description: "Detect and block spam content",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">{item.label}</Label>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <Switch
                checked={moderation[item.key as keyof typeof moderation] as boolean}
                onCheckedChange={(checked) => {
                  updateModeration({ [item.key]: checked })
                  toast.success(`${item.label} ${checked ? "enabled" : "disabled"}`)
                }}
              />
            </div>
          ))}
          <Separator className="my-4" />
          <div className="space-y-2">
            <Label htmlFor="maxPosts" className="text-sm">
              Maximum Posts Per Day (per user)
            </Label>
            <Select
              value={moderation.maxPostsPerDay}
              onValueChange={(value) => {
                updateModeration({ maxPostsPerDay: value })
                toast.success(`Max posts set to ${value === "unlimited" ? "unlimited" : value + " per day"}`)
              }}
            >
              <SelectTrigger id="maxPosts" className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 posts</SelectItem>
                <SelectItem value="10">10 posts</SelectItem>
                <SelectItem value="20">20 posts</SelectItem>
                <SelectItem value="50">50 posts</SelectItem>
                <SelectItem value="unlimited">Unlimited</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="card-hover">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg">Notifications</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Configure admin notification preferences</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              key: "emailNotifications",
              label: "Email Notifications",
              description: "Receive notifications via email",
            },
            {
              key: "newUserAlert",
              label: "New User Alerts",
              description: "Get notified when new users register",
            },
            {
              key: "flaggedContentAlert",
              label: "Flagged Content Alerts",
              description: "Get notified about flagged posts",
            },
            {
              key: "dailyDigest",
              label: "Daily Digest",
              description: "Receive a daily summary email",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">{item.label}</Label>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <Switch
                checked={notification[item.key as keyof typeof notification] as boolean}
                onCheckedChange={(checked) => {
                  updateNotification({ [item.key]: checked })
                  toast.success(`${item.label} ${checked ? "enabled" : "disabled"}`)
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="card-hover">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg">Data Management</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Manage platform data and backups</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <Button
              variant="outline"
              className="flex-col h-auto py-4 gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all bg-transparent"
              onClick={() => setShowBackupDialog(true)}
            >
              <Archive className="h-5 w-5 text-primary" />
              <span className="text-xs">Create Backup</span>
            </Button>
            <Button
              variant="outline"
              className="flex-col h-auto py-4 gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all bg-transparent"
              onClick={handleExport}
            >
              <Download className="h-5 w-5 text-primary" />
              <span className="text-xs">Export</span>
            </Button>
            <Button
              variant="outline"
              className="flex-col h-auto py-4 gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all bg-transparent"
              onClick={() => setShowImportDialog(true)}
            >
              <Upload className="h-5 w-5 text-primary" />
              <span className="text-xs">Import</span>
            </Button>
            <Button
              variant="outline"
              className="flex-col h-auto py-4 gap-2 hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive transition-all bg-transparent"
              onClick={() => setShowClearDialog(true)}
            >
              <Trash2 className="h-5 w-5" />
              <span className="text-xs">Clear All</span>
            </Button>
          </div>

          {/* Backups List */}
          {backups.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Recent Backups</Label>
                <span className="text-xs text-muted-foreground">{backups.length} backup(s)</span>
              </div>
              <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                {backups.map((backup) => (
                  <div
                    key={backup.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                        <HardDrive className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{backup.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(backup.createdAt)}</span>
                          <span className="hidden sm:inline">• {backup.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                        onClick={() => {
                          setSelectedBackup(backup)
                          setShowRestoreDialog(true)
                        }}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDeleteBackup(backup)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {lastBackup && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Last backup: {formatDate(lastBackup)}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-2">
        <Button
          variant="outline"
          className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 bg-transparent"
          onClick={() => setShowResetDialog(true)}
        >
          <RefreshCw className="h-4 w-4" />
          Reset to Defaults
        </Button>
        <Button
          className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
          onClick={handleSaveAll}
          disabled={!isDirty}
        >
          <Save className="h-4 w-4" />
          Save All Settings
        </Button>
      </div>

      {/* Create Backup Dialog */}
      <Dialog open={showBackupDialog} onOpenChange={setShowBackupDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-primary" />
              Create Backup
            </DialogTitle>
            <DialogDescription>
              Create a backup of all your current settings. You can restore from this backup later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="backupName">Backup Name (optional)</Label>
              <Input
                id="backupName"
                placeholder={`Backup ${new Date().toLocaleDateString()}`}
                value={backupName}
                onChange={(e) => setBackupName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowBackupDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBackup} className="gap-2">
              <Archive className="h-4 w-4" />
              Create Backup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Backup Dialog */}
      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-primary" />
              Restore Backup
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will replace all current settings with the backup data from <strong>{selectedBackup?.name}</strong>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestoreBackup} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Import Settings
            </DialogTitle>
            <DialogDescription>Import settings from a previously exported JSON file.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Upload File</Label>
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileJson className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">JSON files only</p>
                <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
              </div>
            </div>
            {importData && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <Textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  rows={6}
                  className="font-mono text-xs"
                />
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!importData} className="gap-2">
              <Upload className="h-4 w-4" />
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear All Data Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Clear All Data
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all settings and backups. This action cannot be undone. Are you absolutely
              sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAll} className="bg-destructive hover:bg-destructive/90 gap-2">
              <Trash2 className="h-4 w-4" />
              Clear All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset to Defaults Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Reset to Defaults
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all settings to their default values. Your backups will not be affected. Do you want to
              continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetToDefaults} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reset Settings
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
