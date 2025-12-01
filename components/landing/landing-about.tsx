import Image from "next/image"
import { GraduationCap, Target, Heart, Lightbulb } from "lucide-react"

const values = [
  {
    icon: GraduationCap,
    title: "Education First",
    description: "We believe in empowering students to achieve academic excellence through better communication.",
  },
  {
    icon: Target,
    title: "Student-Focused",
    description: "Every feature is designed with students in mind, ensuring their voices are heard and valued.",
  },
  {
    icon: Heart,
    title: "Community Driven",
    description: "Building a stronger NEMSU community through open dialogue and mutual understanding.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Leveraging AI technology to provide smart, helpful assistance for every student.",
  },
]

export function LandingAbout() {
  return (
    <section id="about" className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-accent/5 dark:bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-center">
          {/* Left Content */}
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary mb-4 tracking-wide uppercase bg-primary/10 dark:bg-primary/25 px-4 py-1.5 rounded-full border border-transparent dark:border-primary/40">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse-soft" />
              About Us
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 text-balance">
              Empowering the <span className="text-gradient">NEMSU Community</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed mb-4 sm:mb-6">
              NEMSUTalks is a dedicated platform for students of North Eastern Mindanao State University. We provide a
              safe space for students to express their sentiments, stay updated with school announcements, and get
              assistance through our AI-powered chatbot.
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
              Our mission is to bridge the communication gap between students and administration, fostering a
              transparent and supportive educational environment where every voice matters.
            </p>
          </div>

          {/* Right Content - Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="group p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-card/60 dark:bg-card backdrop-blur-sm border border-border/50 dark:border-border hover:border-primary/30 dark:hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/20 transition-all duration-400 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-primary/10 dark:bg-primary/25 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/15 dark:group-hover:bg-primary/35 group-hover:scale-110 transition-all duration-300 border border-transparent dark:border-primary/30">
                  <value.icon className="h-5 w-5 sm:h-5.5 sm:w-5.5 lg:h-6 lg:w-6 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5 sm:mb-2 group-hover:text-primary transition-colors">
                  {value.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* University Info */}
        <div className="mt-12 sm:mt-16 lg:mt-20 pt-10 sm:pt-12 lg:pt-16 border-t border-border/50 dark:border-border">
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 text-center md:text-left">
            <div className="relative shrink-0 animate-fade-in-up">
              <div className="absolute inset-0 bg-primary/20 dark:bg-primary/30 rounded-full blur-2xl scale-125" />
              <Image
                src="/images/nemsu-logo.png"
                alt="NEMSU Logo"
                width={120}
                height={120}
                className="relative rounded-full shadow-xl ring-4 ring-background dark:ring-primary/20 object-cover bg-white w-20 h-20 sm:w-24 sm:h-24 lg:w-[120px] lg:h-[120px]"
              />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2 sm:mb-3">
                North Eastern Mindanao State University
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                Established in 1982, NEMSU is committed to providing quality education and fostering academic excellence
                in Surigao del Sur, Philippines. NEMSUTalks is proud to serve the university community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
