import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Bot, Bell, BarChart3, Shield, Users, ArrowUpRight } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "Anonymous Sentiment Posting",
    description:
      "Share your thoughts and feedback anonymously. Your voice matters and will be heard by the administration.",
  },
  {
    icon: Bot,
    title: "AI Chatbot Assistance",
    description:
      "Get instant help from our AI-powered assistant. Improve your message wording and classify sentiment tones.",
  },
  {
    icon: Bell,
    title: "Real-time Announcements",
    description: "Stay updated with the latest school announcements, news, and important notifications from NEMSU.",
  },
  {
    icon: BarChart3,
    title: "Admin Insights & Analytics",
    description: "Comprehensive dashboard for administrators to track sentiment trends and student feedback patterns.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is protected with enterprise-grade security. We prioritize your privacy above all.",
  },
  {
    icon: Users,
    title: "Community Building",
    description: "Foster better communication between students and administration for a stronger NEMSU community.",
  },
]

export function LandingFeatures() {
  return (
    <section id="features" className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-secondary/50 to-secondary/30 dark:from-secondary/40 dark:via-secondary/50 dark:to-secondary/40 -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 dark:opacity-15 -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 lg:mb-18">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary mb-4 tracking-wide uppercase bg-primary/10 dark:bg-primary/25 px-4 py-1.5 rounded-full border border-transparent dark:border-primary/40">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse-soft" />
            Features
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-5 text-balance">
            Everything you need for <span className="text-gradient">better communication</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground text-pretty leading-relaxed px-2">
            A complete platform designed for the NEMSU community to connect, share, and grow together.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group bg-card/80 dark:bg-card backdrop-blur-sm border-border/60 dark:border-border card-hover cursor-default relative overflow-hidden rounded-xl sm:rounded-2xl animate-fade-in-up hover:border-primary/30 dark:hover:border-primary/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/15 dark:to-accent/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardHeader className="pb-2 sm:pb-3 relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-primary/10 dark:bg-primary/25 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/15 dark:group-hover:bg-primary/35 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/10 dark:group-hover:shadow-primary/25 transition-all duration-400 border border-transparent dark:border-primary/30">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-primary" />
                </div>
                <CardTitle className="text-base sm:text-lg lg:text-xl text-card-foreground group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
                  {feature.title}
                  <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0 transition-all duration-300" />
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-muted-foreground text-xs sm:text-sm lg:text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
