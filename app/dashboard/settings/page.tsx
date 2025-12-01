"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Lock, Palette, Shield, Save, Loader2, Sun, Moon, Monitor, Check, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const translations = {
  en: {
    settings: "Settings",
    settingsDesc: "Manage your account preferences and privacy settings",
    notifications: "Notifications",
    notificationsDesc: "Choose how you want to be notified",
    emailNotifications: "Email Notifications",
    emailNotificationsDesc: "Receive notifications via email",
    pushNotifications: "Push Notifications",
    pushNotificationsDesc: "Receive push notifications on your device",
    sentimentAlerts: "Sentiment Alerts",
    sentimentAlertsDesc: "Get notified about new sentiments",
    announcementAlerts: "Announcement Alerts",
    announcementAlertsDesc: "Get notified about school announcements",
    appearance: "Appearance",
    appearanceDesc: "Customize how NEMSUTalks looks",
    themeMode: "Theme Mode",
    light: "Light",
    dark: "Dark",
    system: "System",
    language: "Language",
    languageDesc: "Select your preferred language",
    privacy: "Privacy",
    privacyDesc: "Control your privacy and data",
    anonymousPosting: "Anonymous Posting",
    anonymousPostingDesc: "Post sentiments anonymously by default",
    publicProfile: "Public Profile",
    publicProfileDesc: "Allow others to view your profile",
    security: "Security",
    securityDesc: "Manage your account security",
    changePassword: "Change Password",
    currentPassword: "Current password",
    newPassword: "New password",
    confirmPassword: "Confirm new password",
    saveChanges: "Save Changes",
    saving: "Saving...",
  },
  fil: {
    settings: "Mga Setting",
    settingsDesc: "Pamahalaan ang iyong mga kagustuhan sa account at privacy",
    notifications: "Mga Abiso",
    notificationsDesc: "Piliin kung paano ka gustong abisuhan",
    emailNotifications: "Mga Abiso sa Email",
    emailNotificationsDesc: "Tumanggap ng mga abiso sa email",
    pushNotifications: "Mga Push Notification",
    pushNotificationsDesc: "Tumanggap ng push notifications sa iyong device",
    sentimentAlerts: "Mga Sentiment Alert",
    sentimentAlertsDesc: "Maabisuhan tungkol sa mga bagong sentimento",
    announcementAlerts: "Mga Announcement Alert",
    announcementAlertsDesc: "Maabisuhan tungkol sa mga anunsyo ng paaralan",
    appearance: "Anyo",
    appearanceDesc: "I-customize kung paano tingnan ang NEMSUTalks",
    themeMode: "Theme Mode",
    light: "Maliwanag",
    dark: "Madilim",
    system: "Sistema",
    language: "Wika",
    languageDesc: "Piliin ang iyong gustong wika",
    privacy: "Privacy",
    privacyDesc: "Kontrolin ang iyong privacy at data",
    anonymousPosting: "Anonymous na Pag-post",
    anonymousPostingDesc: "Mag-post ng mga sentimento nang anonymous bilang default",
    publicProfile: "Pampublikong Profile",
    publicProfileDesc: "Payagan ang iba na makita ang iyong profile",
    security: "Seguridad",
    securityDesc: "Pamahalaan ang seguridad ng iyong account",
    changePassword: "Palitan ang Password",
    currentPassword: "Kasalukuyang password",
    newPassword: "Bagong password",
    confirmPassword: "Kumpirmahin ang bagong password",
    saveChanges: "I-save ang mga Pagbabago",
    saving: "Nagse-save...",
  },
  ceb: {
    settings: "Mga Setting",
    settingsDesc: "Pagdumala sa imong mga gusto sa account ug privacy",
    notifications: "Mga Pahibalo",
    notificationsDesc: "Pilia kung unsaon nimo gusto nga mapahibalo",
    emailNotifications: "Mga Pahibalo sa Email",
    emailNotificationsDesc: "Makadawat og mga pahibalo pinaagi sa email",
    pushNotifications: "Mga Push Notification",
    pushNotificationsDesc: "Makadawat og push notifications sa imong device",
    sentimentAlerts: "Mga Sentiment Alert",
    sentimentAlertsDesc: "Mapahibalo bahin sa bag-ong sentimento",
    announcementAlerts: "Mga Announcement Alert",
    announcementAlertsDesc: "Mapahibalo bahin sa mga anunsyo sa eskwelahan",
    appearance: "Dagway",
    appearanceDesc: "I-customize kung unsaon pagtan-aw ang NEMSUTalks",
    themeMode: "Theme Mode",
    light: "Hayag",
    dark: "Ngitngit",
    system: "Sistema",
    language: "Pinulongan",
    languageDesc: "Pilia ang imong gustong pinulongan",
    privacy: "Privacy",
    privacyDesc: "Kontrola sa imong privacy ug data",
    anonymousPosting: "Anonymous nga Pag-post",
    anonymousPostingDesc: "Mag-post og mga sentimento nga anonymous isip default",
    publicProfile: "Publikong Profile",
    publicProfileDesc: "Tugoti ang uban nga makita ang imong profile",
    security: "Seguridad",
    securityDesc: "Pagdumala sa seguridad sa imong account",
    changePassword: "Usba ang Password",
    currentPassword: "Kasamtangang password",
    newPassword: "Bag-ong password",
    confirmPassword: "Kumpirmaha ang bag-ong password",
    saveChanges: "I-save ang mga Pagbag-o",
    saving: "Nag-save...",
  },
}

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    sentimentAlerts: true,
    announcementAlerts: true,
    language: "en",
    anonymousPosting: true,
    showProfilePublic: false,
  })

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem("nemsutalks-language")
    if (savedLanguage) {
      setSettings((prev) => ({ ...prev, language: savedLanguage }))
    }
  }, [])

  const t = translations[settings.language as keyof typeof translations] || translations.en

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast.success("Settings saved successfully!")
  }

  const updateSetting = (key: keyof typeof settings, value: boolean | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    if (key === "language") {
      localStorage.setItem("nemsutalks-language", value as string)
      toast.success("Language changed", {
        description: `Language set to ${value === "en" ? "English" : value === "fil" ? "Filipino" : "Cebuano"}`,
      })
    }
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    toast.success("Theme changed", {
      description: `Theme set to ${newTheme === "system" ? "system preference" : newTheme + " mode"}`,
    })
  }

  const themeOptions = [
    { value: "light", label: t.light, icon: Sun },
    { value: "dark", label: t.dark, icon: Moon },
    { value: "system", label: t.system, icon: Monitor },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-1 sm:px-0">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t.settings}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{t.settingsDesc}</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Palette className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg">{t.appearance}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">{t.appearanceDesc}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Mode Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">{t.themeMode}</Label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {themeOptions.map((option) => {
                    const isActive = mounted && (theme === option.value || (!theme && option.value === "system"))
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleThemeChange(option.value)}
                        className={cn(
                          "relative flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all duration-300",
                          "hover:scale-[1.02] active:scale-[0.98]",
                          isActive
                            ? "border-primary bg-primary/10 shadow-md"
                            : "border-border bg-card hover:border-primary/50 hover:bg-secondary/50",
                        )}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                            isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
                          )}
                        >
                          <option.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <span
                          className={cn(
                            "text-xs sm:text-sm font-medium transition-colors",
                            isActive ? "text-primary" : "text-muted-foreground",
                          )}
                        >
                          {option.label}
                        </span>
                        {isActive && (
                          <div className="absolute top-2 right-2">
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <Label htmlFor="language" className="font-medium text-sm sm:text-base">
                      {t.language}
                    </Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">{t.languageDesc}</p>
                  </div>
                </div>
                <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                  <SelectTrigger className="w-32 sm:w-40 transition-all duration-200 hover:border-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fil">Filipino</SelectItem>
                    <SelectItem value="ceb">Cebuano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg">{t.notifications}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">{t.notificationsDesc}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 group">
                <div>
                  <Label htmlFor="email-notif" className="font-medium text-sm sm:text-base cursor-pointer">
                    {t.emailNotifications}
                  </Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t.emailNotificationsDesc}</p>
                </div>
                <Switch
                  id="email-notif"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                  className="transition-all duration-200"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label htmlFor="push-notif" className="font-medium text-sm sm:text-base cursor-pointer">
                    {t.pushNotifications}
                  </Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t.pushNotificationsDesc}</p>
                </div>
                <Switch
                  id="push-notif"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label htmlFor="sentiment-alerts" className="font-medium text-sm sm:text-base cursor-pointer">
                    {t.sentimentAlerts}
                  </Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t.sentimentAlertsDesc}</p>
                </div>
                <Switch
                  id="sentiment-alerts"
                  checked={settings.sentimentAlerts}
                  onCheckedChange={(checked) => updateSetting("sentimentAlerts", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label htmlFor="announcement-alerts" className="font-medium text-sm sm:text-base cursor-pointer">
                    {t.announcementAlerts}
                  </Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t.announcementAlertsDesc}</p>
                </div>
                <Switch
                  id="announcement-alerts"
                  checked={settings.announcementAlerts}
                  onCheckedChange={(checked) => updateSetting("announcementAlerts", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg">{t.privacy}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">{t.privacyDesc}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label htmlFor="anon-posting" className="font-medium text-sm sm:text-base cursor-pointer">
                    {t.anonymousPosting}
                  </Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t.anonymousPostingDesc}</p>
                </div>
                <Switch
                  id="anon-posting"
                  checked={settings.anonymousPosting}
                  onCheckedChange={(checked) => updateSetting("anonymousPosting", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label htmlFor="public-profile" className="font-medium text-sm sm:text-base cursor-pointer">
                    {t.publicProfile}
                  </Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t.publicProfileDesc}</p>
                </div>
                <Switch
                  id="public-profile"
                  checked={settings.showProfilePublic}
                  onCheckedChange={(checked) => updateSetting("showProfilePublic", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg">{t.security}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">{t.securityDesc}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password" className="font-medium text-sm sm:text-base">
                  {t.changePassword}
                </Label>
                <div className="grid gap-3 mt-3">
                  <Input
                    id="current-password"
                    type="password"
                    placeholder={t.currentPassword}
                    className="h-10 sm:h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                  <Input
                    type="password"
                    placeholder={t.newPassword}
                    className="h-10 sm:h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                  <Input
                    type="password"
                    placeholder={t.confirmPassword}
                    className="h-10 sm:h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end pb-6">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="h-10 sm:h-11 px-6 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.saving}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t.saveChanges}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
