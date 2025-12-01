import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface GeneralSettings {
  siteName: string
  siteDescription: string
  maintenanceMode: boolean
  allowRegistration: boolean
  adminEmail: string
}

export interface ModerationSettings {
  autoModeration: boolean
  requireApproval: boolean
  profanityFilter: boolean
  spamDetection: boolean
  maxPostsPerDay: string
}

export interface NotificationSettings {
  emailNotifications: boolean
  newUserAlert: boolean
  flaggedContentAlert: boolean
  dailyDigest: boolean
}

export interface AppearanceSettings {
  primaryColor: string
  allowDarkMode: boolean
  defaultTheme: "light" | "dark" | "system"
}

export interface BackupData {
  id: string
  name: string
  createdAt: string
  size: string
  data: {
    general: GeneralSettings
    moderation: ModerationSettings
    notification: NotificationSettings
    appearance: AppearanceSettings
  }
}

interface SettingsState {
  general: GeneralSettings
  moderation: ModerationSettings
  notification: NotificationSettings
  appearance: AppearanceSettings
  backups: BackupData[]
  lastBackup: string | null
  isDirty: boolean

  // Actions
  updateGeneral: (settings: Partial<GeneralSettings>) => void
  updateModeration: (settings: Partial<ModerationSettings>) => void
  updateNotification: (settings: Partial<NotificationSettings>) => void
  updateAppearance: (settings: Partial<AppearanceSettings>) => void
  saveAllSettings: () => void
  resetToDefaults: () => void
  createBackup: (name?: string) => BackupData
  restoreBackup: (id: string) => boolean
  deleteBackup: (id: string) => void
  exportData: () => string
  importData: (jsonData: string) => boolean
  clearAllData: () => void
}

const defaultGeneralSettings: GeneralSettings = {
  siteName: "NEMSUTalks",
  siteDescription: "A platform for NEMSU students to share their sentiments and connect with peers.",
  maintenanceMode: false,
  allowRegistration: true,
  adminEmail: "admin@nemsu.edu.ph",
}

const defaultModerationSettings: ModerationSettings = {
  autoModeration: true,
  requireApproval: false,
  profanityFilter: true,
  spamDetection: true,
  maxPostsPerDay: "10",
}

const defaultNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  newUserAlert: true,
  flaggedContentAlert: true,
  dailyDigest: false,
}

const defaultAppearanceSettings: AppearanceSettings = {
  primaryColor: "#1e40af",
  allowDarkMode: true,
  defaultTheme: "light",
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      general: defaultGeneralSettings,
      moderation: defaultModerationSettings,
      notification: defaultNotificationSettings,
      appearance: defaultAppearanceSettings,
      backups: [],
      lastBackup: null,
      isDirty: false,

      updateGeneral: (settings) =>
        set((state) => ({
          general: { ...state.general, ...settings },
          isDirty: true,
        })),

      updateModeration: (settings) =>
        set((state) => ({
          moderation: { ...state.moderation, ...settings },
          isDirty: true,
        })),

      updateNotification: (settings) =>
        set((state) => ({
          notification: { ...state.notification, ...settings },
          isDirty: true,
        })),

      updateAppearance: (settings) =>
        set((state) => ({
          appearance: { ...state.appearance, ...settings },
          isDirty: true,
        })),

      saveAllSettings: () => set({ isDirty: false }),

      resetToDefaults: () =>
        set({
          general: defaultGeneralSettings,
          moderation: defaultModerationSettings,
          notification: defaultNotificationSettings,
          appearance: defaultAppearanceSettings,
          isDirty: false,
        }),

      createBackup: (name) => {
        const state = get()
        const backup: BackupData = {
          id: `backup-${Date.now()}`,
          name: name || `Backup ${new Date().toLocaleDateString()}`,
          createdAt: new Date().toISOString(),
          size: "~2 KB",
          data: {
            general: state.general,
            moderation: state.moderation,
            notification: state.notification,
            appearance: state.appearance,
          },
        }
        set((state) => ({
          backups: [backup, ...state.backups].slice(0, 10),
          lastBackup: backup.createdAt,
        }))
        return backup
      },

      restoreBackup: (id) => {
        const state = get()
        const backup = state.backups.find((b) => b.id === id)
        if (!backup) return false
        set({
          general: backup.data.general,
          moderation: backup.data.moderation,
          notification: backup.data.notification,
          appearance: backup.data.appearance,
          isDirty: false,
        })
        return true
      },

      deleteBackup: (id) =>
        set((state) => ({
          backups: state.backups.filter((b) => b.id !== id),
        })),

      exportData: () => {
        const state = get()
        return JSON.stringify(
          {
            general: state.general,
            moderation: state.moderation,
            notification: state.notification,
            appearance: state.appearance,
            exportedAt: new Date().toISOString(),
            version: "1.0",
          },
          null,
          2,
        )
      },

      importData: (jsonData) => {
        try {
          const data = JSON.parse(jsonData)
          if (data.general && data.moderation && data.notification && data.appearance) {
            set({
              general: { ...defaultGeneralSettings, ...data.general },
              moderation: { ...defaultModerationSettings, ...data.moderation },
              notification: { ...defaultNotificationSettings, ...data.notification },
              appearance: { ...defaultAppearanceSettings, ...data.appearance },
              isDirty: false,
            })
            return true
          }
          return false
        } catch {
          return false
        }
      },

      clearAllData: () =>
        set({
          general: defaultGeneralSettings,
          moderation: defaultModerationSettings,
          notification: defaultNotificationSettings,
          appearance: defaultAppearanceSettings,
          backups: [],
          lastBackup: null,
          isDirty: false,
        }),
    }),
    {
      name: "nemsu-settings",
    },
  ),
)
