"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Edit2,
  Save,
  X,
  Bell,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  User,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@nemsu.edu.ph",
    phone: "+63 912 345 6789",
    department: "Student Affairs Office",
    location: "Main Campus, Tandag City",
    bio: "System administrator for NEMSUTalks platform. Responsible for managing student sentiments and university announcements.",
    joinedDate: "January 2024",
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newSentiments: true,
    statusUpdates: true,
    systemAlerts: true,
    weeklyReports: false,
  })

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
    setIsEditing(false)
  }

  const recentActivity = [
    { action: "Reviewed sentiment #1234", time: "2 hours ago", type: "review" },
    { action: "Posted announcement", time: "5 hours ago", type: "announcement" },
    { action: "Updated status for #1230", time: "1 day ago", type: "status" },
    { action: "Logged in", time: "1 day ago", type: "login" },
  ]

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
            <User className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-primary" />
            Admin Profile
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Manage your account settings and preferences</p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="gap-2 h-9 sm:h-10 text-xs sm:text-sm w-full sm:w-auto"
            variant="outline"
          >
            <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="gap-2 h-9 sm:h-10 text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2 h-9 sm:h-10 text-xs sm:text-sm flex-1 sm:flex-none"
            >
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Profile Header Card */}
      <Card className="overflow-hidden">
        <div className="h-24 sm:h-32 lg:h-40 bg-gradient-to-r from-primary via-primary/80 to-primary/60 relative">
          <div className="absolute inset-0 bg-[url('/images/nemsu-logo.png')] bg-no-repeat bg-right bg-contain opacity-10" />
        </div>
        <CardContent className="relative pt-0 pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-16">
            <div className="relative mx-auto sm:mx-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-2xl bg-card border-4 border-background shadow-xl overflow-hidden">
                <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl sm:text-3xl lg:text-4xl">
                  AD
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-green-500 rounded-full border-3 border-background flex items-center justify-center">
                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{profile.name}</h2>
                <Badge className="w-fit mx-auto sm:mx-0 gap-1.5 bg-primary/10 text-primary hover:bg-primary/20">
                  <Shield className="h-3 w-3" />
                  Administrator
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{profile.department}</p>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center justify-center sm:justify-start gap-1">
                <Calendar className="h-3 w-3" />
                Joined {profile.joinedDate}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-10 sm:h-11">
          <TabsTrigger value="profile" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            {/* Personal Information */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs sm:text-sm">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      disabled={!isEditing}
                      className="h-9 sm:h-10 text-xs sm:text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs sm:text-sm">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        disabled={!isEditing}
                        className="pl-9 sm:pl-10 h-9 sm:h-10 text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs sm:text-sm">
                      Phone
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        disabled={!isEditing}
                        className="pl-9 sm:pl-10 h-9 sm:h-10 text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-xs sm:text-sm">
                      Department
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input
                        id="department"
                        value={profile.department}
                        onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                        disabled={!isEditing}
                        className="pl-9 sm:pl-10 h-9 sm:h-10 text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-xs sm:text-sm">
                    Location
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      disabled={!isEditing}
                      className="pl-9 sm:pl-10 h-9 sm:h-10 text-xs sm:text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-xs sm:text-sm">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                    className="resize-none text-xs sm:text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 text-xs sm:text-sm">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full mt-1.5 shrink-0",
                          activity.type === "review" && "bg-blue-500",
                          activity.type === "announcement" && "bg-primary",
                          activity.type === "status" && "bg-green-500",
                          activity.type === "login" && "bg-muted-foreground",
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground truncate">{activity.action}</p>
                        <p className="text-muted-foreground text-[10px] sm:text-xs">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {[
                {
                  key: "emailNotifications",
                  label: "Email Notifications",
                  description: "Receive notifications via email",
                },
                {
                  key: "pushNotifications",
                  label: "Push Notifications",
                  description: "Receive push notifications in browser",
                },
                {
                  key: "newSentiments",
                  label: "New Sentiments",
                  description: "Get notified when new sentiments are posted",
                },
                {
                  key: "statusUpdates",
                  label: "Status Updates",
                  description: "Get notified about sentiment status changes",
                },
                {
                  key: "systemAlerts",
                  label: "System Alerts",
                  description: "Important system notifications and alerts",
                },
                { key: "weeklyReports", label: "Weekly Reports", description: "Receive weekly summary reports" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 py-2 sm:py-3 border-b border-border last:border-0"
                >
                  <div className="space-y-0.5">
                    <Label className="text-xs sm:text-sm font-medium">{item.label}</Label>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Change Password
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-xs sm:text-sm">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    className="pr-10 h-9 sm:h-10 text-xs sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-xs sm:text-sm">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="pr-10 h-9 sm:h-10 text-xs sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs sm:text-sm">
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                />
              </div>
              <div className="pt-2">
                <Button className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm">Update Password</Button>
              </div>
              <div className="mt-6 p-3 sm:p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex gap-3">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-medium text-amber-600 dark:text-amber-400">
                      Password Requirements
                    </p>
                    <ul className="text-[10px] sm:text-xs text-muted-foreground space-y-0.5">
                      <li>• At least 8 characters long</li>
                      <li>• Include uppercase and lowercase letters</li>
                      <li>• Include at least one number</li>
                      <li>• Include at least one special character</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
