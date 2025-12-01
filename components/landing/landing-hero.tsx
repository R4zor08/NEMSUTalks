import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, MessageSquare, Clock, TrendingUp } from "lucide-react"

export function LandingHero() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16 md:py-24 lg:py-32">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary/8 dark:bg-primary/15 rounded-full blur-3xl animate-pulse-soft" />
        <div
          className="absolute bottom-0 right-1/4 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-accent/8 dark:bg-accent/15 rounded-full blur-3xl animate-pulse-soft"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)] opacity-30 dark:opacity-20" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8 lg:mb-10 relative animate-float">
            <div className="absolute inset-0 bg-primary/25 dark:bg-primary/40 rounded-full blur-2xl scale-150 animate-glow" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 dark:from-primary/30 dark:to-accent/30 rounded-full blur-xl scale-125" />
            <Image
              src="/images/nemsu-logo.png"
              alt="NEMSU Logo"
              width={160}
              height={160}
              className="relative rounded-full shadow-2xl ring-4 ring-background dark:ring-primary/20 w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40"
              priority
            />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-4 sm:mb-5 lg:mb-6 text-balance animate-fade-in-up">
            <span className="text-gradient-animated">NEMSUTalks</span>
          </h1>

          <p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary font-semibold mb-3 sm:mb-4 lg:mb-5 animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            Empowering Students Through Better Communication
          </p>

          <p
            className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mb-6 sm:mb-8 lg:mb-10 text-pretty leading-relaxed animate-fade-in-up px-2 sm:px-4"
            style={{ animationDelay: "200ms" }}
          >
            Post sentiments, view school updates, and interact with an AI-powered assistant. Your voice matters at North
            Eastern Mindanao State University.
          </p>

          <div className="flex justify-center w-full animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <Button
              size="lg"
              asChild
              className="text-sm sm:text-base px-8 sm:px-10 lg:px-12 h-12 sm:h-14 lg:h-16 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-400 group rounded-xl dark:shadow-lg dark:shadow-primary/40 dark:hover:shadow-xl dark:hover:shadow-primary/50"
            >
              <Link href="/login">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 xl:gap-8 mt-10 sm:mt-14 lg:mt-18 pt-8 sm:pt-10 lg:pt-12 border-t border-border/50 dark:border-border w-full max-w-3xl">
            {[
              { icon: Users, value: "1000+", label: "Active Students" },
              { icon: MessageSquare, value: "500+", label: "Sentiments Posted" },
              { icon: Clock, value: "24/7", label: "AI Assistant" },
              { icon: TrendingUp, value: "98%", label: "Response Rate" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="group text-center p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-card/50 dark:bg-card/80 hover:bg-secondary/40 dark:hover:bg-secondary/60 transition-all duration-400 cursor-default border border-border/30 dark:border-border hover:border-primary/30 dark:hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/20 animate-fade-in-up"
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <div className="flex justify-center mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/10 dark:bg-primary/25 flex items-center justify-center group-hover:bg-primary/15 dark:group-hover:bg-primary/35 group-hover:scale-110 transition-all duration-300 border border-transparent dark:border-primary/30">
                    <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gradient group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground mt-1 sm:mt-1.5 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
