import { LoginForm } from "@/components/auth/login-form"
import Image from "next/image"
import Link from "next/link"
import { Home } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-primary/8 dark:bg-primary/15 rounded-full blur-3xl animate-pulse-soft" />
        <div
          className="absolute bottom-20 right-10 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-accent/8 dark:bg-accent/15 rounded-full blur-3xl animate-pulse-soft"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] md:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_100%)] opacity-25 dark:opacity-15" />
      </div>

      {/* Header */}
      <header className="p-3 sm:p-4 lg:p-6">
        <Link
          href="/"
          className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl bg-card/80 dark:bg-card backdrop-blur-sm border border-border/50 dark:border-border text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/30 dark:hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md group"
          aria-label="Go to home page"
        >
          <Home className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-4 lg:p-6">
        <div className="w-full max-w-[360px] sm:max-w-md animate-fade-in-up">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-3xl blur-2xl scale-105 -z-10" />

            <div className="bg-card/90 dark:bg-card backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl dark:shadow-black/30 border border-border/50 dark:border-border p-4 sm:p-5 md:p-6 lg:p-8 relative overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 dark:from-primary/10 dark:to-accent/10 pointer-events-none" />

              <div className="flex flex-col items-center mb-5 sm:mb-6 lg:mb-8 relative">
                <div className="relative mb-3 sm:mb-4 md:mb-5">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150 animate-glow" />
                  <Image
                    src="/images/nemsu-logo.jpg"
                    alt="NEMSU Logo"
                    width={100}
                    height={100}
                    className="relative rounded-full ring-3 sm:ring-4 ring-background shadow-xl w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-[100px] lg:h-[100px] object-cover bg-white"
                    priority
                  />
                </div>
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-card-foreground text-center">
                  Welcome to NEMSU
                </h1>
                <p className="text-muted-foreground text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-1.5 md:mt-2 text-center max-w-[280px] sm:max-w-none">
                  Sign in to your account or create a new one
                </p>
              </div>

              <LoginForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
