"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, UserPlus, LogIn, Mail } from "lucide-react"
import { toast } from "sonner"
import { useUserAuthStore } from "@/lib/user-auth-store"
import { cn } from "@/lib/utils"

const isValidNemsuEmail = (email: string): boolean => {
  const nemsuEmailPattern = /^[a-zA-Z0-9._%+-]+@nemsu\.edu\.ph$/i
  return nemsuEmailPattern.test(email)
}

export function LoginForm() {
  const router = useRouter()
  const { registerUser, loginUser } = useUserAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    fullName: "",
    email: "",
    studentId: "",
    confirmPassword: "",
  })
  const [activeTab, setActiveTab] = useState("signin")
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  useEffect(() => {
    const remembered = localStorage.getItem("nemsu_remember_me")
    if (remembered === "true") {
      setRememberMe(true)
    }
  }, [])

  useEffect(() => {
    if (rememberMe) {
      localStorage.setItem("nemsu_remember_me", "true")
    } else {
      localStorage.removeItem("nemsu_remember_me")
    }
  }, [rememberMe])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!rememberMe) {
      setError("Please check 'Remember Me' to continue.")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    await new Promise((resolve) => setTimeout(resolve, 800))

    const result = loginUser(formData.identifier.trim(), formData.password)

    if (result.success) {
      if (rememberMe) {
        localStorage.setItem(
          "nemsu_session",
          JSON.stringify({
            identifier: formData.identifier.trim(),
            timestamp: Date.now(),
          }),
        )
      }

      toast.success("Welcome back!", {
        description: result.isAdmin ? "Redirecting to admin dashboard..." : "Redirecting to dashboard...",
      })
      setIsLoading(false)

      if (result.isAdmin) {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } else {
      setError(result.message)
      toast.error("Login failed", { description: result.message })
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validation
    if (!formData.fullName.trim()) {
      setError("Please enter your full name")
      return
    }
    if (!formData.email.trim()) {
      setError("Please enter your email address")
      return
    }
    if (!isValidNemsuEmail(formData.email.trim())) {
      setError("Please use a valid NEMSU email address (@nemsu.edu.ph)")
      toast.error("Invalid Email", {
        description: "Only NEMSU email addresses (@nemsu.edu.ph) are allowed for registration.",
      })
      return
    }
    if (!formData.studentId.trim()) {
      setError("Please enter your student ID")
      return
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy")
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const result = registerUser({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      studentId: formData.studentId.trim(),
      password: formData.password,
    })

    setIsLoading(false)

    if (result.success) {
      setSuccess(result.message)
      toast.success("Account created!", {
        description: "Please sign in with your new credentials.",
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      })

      // Clear sign up form and switch to sign in
      setFormData({
        ...formData,
        identifier: formData.email, // Pre-fill email for convenience
        fullName: "",
        email: "",
        studentId: "",
        password: "",
        confirmPassword: "",
      })
      setAgreedToTerms(false)

      // Switch to sign in tab after short delay
      setTimeout(() => {
        setActiveTab("signin")
        setSuccess("")
      }, 1500)
    } else {
      setError(result.message)
      toast.error("Registration failed", { description: result.message })
    }
  }

  const PasswordToggle = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-200 p-1.5 rounded-lg hover:bg-secondary/50 active:scale-95"
      aria-label={show ? "Hide password" : "Show password"}
    >
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  )

  return (
    <Tabs
      value={activeTab}
      onValueChange={(val) => {
        setActiveTab(val)
        setError("")
        setSuccess("")
      }}
      className="w-full relative"
    >
      <TabsList className="grid w-full grid-cols-2 mb-7 h-12 sm:h-14 p-1 sm:p-1.5 bg-secondary/40 rounded-xl">
        <TabsTrigger
          value="signin"
          className="data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground transition-all duration-300 rounded-lg h-9 sm:h-11 text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2"
        >
          <LogIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Sign In
        </TabsTrigger>
        <TabsTrigger
          value="signup"
          className="data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground transition-all duration-300 rounded-lg h-9 sm:h-11 text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2"
        >
          <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Sign Up
        </TabsTrigger>
      </TabsList>

      {/* Sign In Tab */}
      <TabsContent value="signin" className="animate-fade-in mt-0">
        <form onSubmit={handleSignIn} className="space-y-4 sm:space-y-5">
          {error && (
            <div className="p-3 sm:p-3.5 text-xs sm:text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-2 sm:gap-2.5 animate-scale-in">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 sm:p-3.5 text-xs sm:text-sm text-green-600 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2 sm:gap-2.5 animate-scale-in">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              {success}
            </div>
          )}

          {/* Email/Student ID Field */}
          <div className="space-y-2 sm:space-y-2.5">
            <Label htmlFor="identifier" className="text-card-foreground text-xs sm:text-sm font-medium">
              Email or Student ID
            </Label>
            <Input
              id="identifier"
              type="text"
              placeholder="Enter your email or student ID"
              value={formData.identifier}
              onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
              required
              className="h-11 sm:h-12 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-secondary/30 border-border/60 hover:border-primary/40 text-sm sm:text-base"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2 sm:space-y-2.5">
            <Label htmlFor="password" className="text-card-foreground text-xs sm:text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="h-11 sm:h-12 pr-12 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-secondary/30 border-border/60 hover:border-primary/40 text-sm sm:text-base"
              />
              <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => {
                    setRememberMe(checked as boolean)
                    if (checked) {
                      setError("") // Clear error when checked
                    }
                  }}
                  className={cn(
                    "rounded-md h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300",
                    "focus:ring-2 focus:ring-primary/30 focus:ring-offset-1",
                    !rememberMe && "border-amber-500/50",
                  )}
                />
                <Label
                  htmlFor="rememberMe"
                  className={cn(
                    "text-[11px] sm:text-xs cursor-pointer font-medium transition-colors duration-300",
                    rememberMe ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  Remember me
                </Label>
              </div>
              <button
                type="button"
                className="text-[10px] sm:text-xs text-primary hover:text-primary/80 transition-colors font-medium hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {!rememberMe && (
              <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 animate-fade-in pl-0.5">
                <span className="inline-block w-1 h-1 rounded-full bg-amber-500 animate-pulse"></span>
                Please check 'Remember Me' to continue.
              </p>
            )}
          </div>

          <Button
            type="submit"
            className={cn(
              "w-full h-11 sm:h-12 text-sm sm:text-base font-semibold rounded-xl",
              "transition-all duration-300 ease-in-out",
              rememberMe
                ? "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] opacity-100 transform scale-100"
                : "opacity-60 cursor-not-allowed shadow-none scale-[0.98]",
            )}
            disabled={isLoading || !rememberMe}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Sign In
              </>
            )}
          </Button>
        </form>
      </TabsContent>

      {/* Sign Up Tab */}
      <TabsContent value="signup" className="animate-fade-in mt-0">
        <form onSubmit={handleSignUp} className="space-y-3 sm:space-y-4">
          {error && (
            <div className="p-3 sm:p-3.5 text-xs sm:text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-2 sm:gap-2.5 animate-scale-in">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 sm:p-3.5 text-xs sm:text-sm text-green-600 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2 sm:gap-2.5 animate-scale-in">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              {success}
            </div>
          )}

          {/* Full Name Field */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="fullName" className="text-card-foreground text-xs sm:text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              className="h-10 sm:h-12 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-secondary/30 border-border/60 hover:border-primary/40 text-sm sm:text-base"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label
              htmlFor="signupEmail"
              className="text-card-foreground text-xs sm:text-sm font-medium flex items-center gap-1.5"
            >
              <Mail className="h-3.5 w-3.5 text-primary" />
              NEMSU Email Address
            </Label>
            <Input
              id="signupEmail"
              type="email"
              placeholder="yourname@nemsu.edu.ph"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="h-10 sm:h-12 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-secondary/30 border-border/60 hover:border-primary/40 text-sm sm:text-base"
            />
            <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/60"></span>
              Only @nemsu.edu.ph email addresses are accepted
            </p>
          </div>

          {/* Student ID Field */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="studentId" className="text-card-foreground text-xs sm:text-sm font-medium">
              Student ID
            </Label>
            <Input
              id="studentId"
              type="text"
              placeholder="Enter your student ID"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              required
              className="h-10 sm:h-12 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-secondary/30 border-border/60 hover:border-primary/40 text-sm sm:text-base"
            />
          </div>

          {/* Password Fields - Two columns on larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="signupPassword" className="text-card-foreground text-xs sm:text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="signupPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="h-10 sm:h-12 pr-10 sm:pr-12 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-secondary/30 border-border/60 hover:border-primary/40 text-sm sm:text-base"
                />
                <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="confirmPassword" className="text-card-foreground text-xs sm:text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="h-10 sm:h-12 pr-10 sm:pr-12 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-secondary/30 border-border/60 hover:border-primary/40 text-sm sm:text-base"
                />
                <PasswordToggle
                  show={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </div>
            </div>
          </div>

          {/* Password strength indicator */}
          {formData.password && (
            <div className="space-y-1.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      formData.password.length >= level * 3
                        ? formData.password.length >= 12
                          ? "bg-green-500"
                          : formData.password.length >= 8
                            ? "bg-yellow-500"
                            : "bg-orange-500"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {formData.password.length < 6
                  ? "Password too short (min 6 characters)"
                  : formData.password.length < 8
                    ? "Weak password"
                    : formData.password.length < 12
                      ? "Good password"
                      : "Strong password"}
              </p>
            </div>
          )}

          {/* Terms Checkbox */}
          <div className="flex items-start space-x-2.5 sm:space-x-3 pt-1 sm:pt-2">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              className="mt-0.5 rounded-md h-4 w-4 sm:h-5 sm:w-5"
            />
            <Label
              htmlFor="terms"
              className="text-[10px] sm:text-sm text-muted-foreground cursor-pointer leading-relaxed"
            >
              I agree to the{" "}
              <button type="button" className="text-primary hover:underline font-medium">
                Terms of Service
              </button>{" "}
              and{" "}
              <button type="button" className="text-primary hover:underline font-medium">
                Privacy Policy
              </button>
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 rounded-xl mt-2 sm:mt-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Create Account
              </>
            )}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  )
}
