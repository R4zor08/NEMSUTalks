"use client"

import type React from "react"

import { useState, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Mail, Phone, MapPin, GraduationCap, Calendar, Edit2, Loader2, Upload, X, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profile, setProfile] = useState({
    fullName: "Juan Dela Cruz",
    email: "juan.delacruz@nemsu.edu.ph",
    studentId: "2021-00123",
    phone: "+63 912 345 6789",
    address: "Tandag City, Surigao del Sur",
    course: "Bachelor of Science in Information Technology",
    yearLevel: "3rd Year",
    bio: "A passionate IT student interested in web development and artificial intelligence. Always eager to learn new technologies.",
    joinDate: "August 2021",
  })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", { description: "Please select an image under 5MB" })
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
        toast.success("Photo uploaded", { description: "Your new profile photo will be saved when you save changes" })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
    toast.success("Profile updated successfully!")
  }

  const handleCancel = () => {
    setIsEditing(false)
    setAvatarPreview(null)
  }

  const stats = [
    { label: "Sentiments Posted", value: 24 },
    { label: "Likes Received", value: 156 },
    { label: "Days Active", value: 45 },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-1 sm:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">My Profile</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage your personal information</p>
          </div>
          <div className="flex gap-2">
            {isEditing && (
              <Button
                variant="outline"
                onClick={handleCancel}
                className="h-10 sm:h-11 rounded-xl transition-all duration-200 hover:bg-destructive/10 hover:text-destructive hover:border-destructive bg-transparent"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
            <Button
              variant={isEditing ? "default" : "default"}
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              disabled={isSaving}
              className={cn(
                "h-10 sm:h-11 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95",
                isEditing && "shadow-md",
              )}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Profile Header */}
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-card border-4 border-background shadow-xl overflow-hidden">
                    <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl sm:text-3xl lg:text-4xl">
                      JD
                    </div>
                  </div>
                  {isEditing && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        <div className="flex flex-col items-center text-white">
                          <Camera className="h-6 w-6 mb-1" />
                          <span className="text-xs">Change</span>
                        </div>
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300 shadow-lg hover:scale-110 active:scale-95"
                      >
                        <Upload className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">{profile.fullName}</h2>
                  <p className="text-muted-foreground text-sm sm:text-base">{profile.studentId}</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                    <Badge variant="secondary" className="text-xs sm:text-sm px-3 py-1">
                      {profile.course}
                    </Badge>
                    <Badge variant="outline" className="text-xs sm:text-sm px-3 py-1">
                      {profile.yearLevel}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center group cursor-default">
                    <p className="text-2xl sm:text-3xl font-bold text-primary transition-all duration-300 group-hover:scale-110">
                      {stat.value}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg">Personal Information</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm">
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="fullName"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="h-10 sm:h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  ) : (
                    <p className="text-foreground py-2 px-3 bg-secondary/30 rounded-lg text-sm sm:text-base">
                      {profile.fullName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentId" className="text-sm">
                    Student ID
                  </Label>
                  <p className="text-foreground py-2 px-3 bg-secondary/30 rounded-lg text-sm sm:text-base">
                    {profile.studentId}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email
                  </Label>
                  <p className="text-foreground py-2 px-3 bg-secondary/30 rounded-lg text-sm sm:text-base break-all">
                    {profile.email}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    Phone
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="h-10 sm:h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  ) : (
                    <p className="text-foreground py-2 px-3 bg-secondary/30 rounded-lg text-sm sm:text-base">
                      {profile.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Address
                </Label>
                {isEditing ? (
                  <Input
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="h-10 sm:h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <p className="text-foreground py-2 px-3 bg-secondary/30 rounded-lg text-sm sm:text-base">
                    {profile.address}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <GraduationCap className="h-5 w-5 text-primary" />
                Academic Information
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Your course and academic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Course/Program</Label>
                  {isEditing ? (
                    <Select value={profile.course} onValueChange={(value) => setProfile({ ...profile, course: value })}>
                      <SelectTrigger className="h-10 sm:h-11 transition-all duration-200 hover:border-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bachelor of Science in Information Technology">
                          BS Information Technology
                        </SelectItem>
                        <SelectItem value="Bachelor of Science in Computer Science">BS Computer Science</SelectItem>
                        <SelectItem value="Bachelor of Science in Agriculture">BS Agriculture</SelectItem>
                        <SelectItem value="Bachelor of Science in Business Administration">
                          BS Business Administration
                        </SelectItem>
                        <SelectItem value="Bachelor of Science in Education">BS Education</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-foreground py-2 px-3 bg-secondary/30 rounded-lg text-sm sm:text-base">
                      {profile.course}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Year Level</Label>
                  {isEditing ? (
                    <Select
                      value={profile.yearLevel}
                      onValueChange={(value) => setProfile({ ...profile, yearLevel: value })}
                    >
                      <SelectTrigger className="h-10 sm:h-11 transition-all duration-200 hover:border-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st Year">1st Year</SelectItem>
                        <SelectItem value="2nd Year">2nd Year</SelectItem>
                        <SelectItem value="3rd Year">3rd Year</SelectItem>
                        <SelectItem value="4th Year">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-foreground py-2 px-3 bg-secondary/30 rounded-lg text-sm sm:text-base">
                      {profile.yearLevel}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Member Since
                </Label>
                <p className="text-foreground py-2 px-3 bg-secondary/30 rounded-lg text-sm sm:text-base">
                  {profile.joinDate}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-md mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg">About Me</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Tell others about yourself</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={4}
                  placeholder="Write a short bio about yourself..."
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
                />
              ) : (
                <p className="text-foreground leading-relaxed py-2 px-3 bg-secondary/30 rounded-lg text-sm sm:text-base">
                  {profile.bio}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
