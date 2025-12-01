import Link from "next/link"
import Image from "next/image"
import { Facebook, Mail, Phone, MapPin, ExternalLink, Heart } from "lucide-react"

export function LandingFooter() {
  return (
    <footer
      id="contact"
      className="bg-card/50 dark:bg-card/80 backdrop-blur-sm border-t border-border/50 dark:border-border relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-primary/3 dark:from-primary/8 to-transparent -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14 xl:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-3.5 mb-3 sm:mb-4 lg:mb-5">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 dark:bg-primary/30 rounded-full blur-lg scale-125" />
                <Image
                  src="/images/nemsu-logo.png"
                  alt="NEMSU Logo"
                  width={52}
                  height={52}
                  className="relative rounded-full ring-2 ring-primary/20 dark:ring-primary/40 shadow-lg w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-[52px] xl:h-[52px] object-cover bg-white"
                />
              </div>
              <div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-card-foreground">NEMSUTalks</h3>
                <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground">
                  North Eastern Mindanao State University
                </p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-md leading-relaxed text-xs sm:text-sm lg:text-base mb-4 sm:mb-5 lg:mb-6">
              Empowering students through better communication. A platform dedicated to giving every NEMSU student a
              voice and fostering a stronger university community.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <Link
                href="#"
                className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-lg sm:rounded-xl bg-secondary/60 dark:bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/25 hover:scale-110 transition-all duration-300 border border-transparent dark:border-border/50 dark:hover:border-primary/40"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5" />
              </Link>
              <Link
                href="mailto:info@nemsu.edu.ph"
                className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-lg sm:rounded-xl bg-secondary/60 dark:bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/25 hover:scale-110 transition-all duration-300 border border-transparent dark:border-border/50 dark:hover:border-primary/40"
                aria-label="Email"
              >
                <Mail className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-card-foreground mb-3 sm:mb-4 lg:mb-5 text-xs sm:text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 lg:space-y-3">
              {[
                { href: "#features", label: "Features" },
                { href: "/login", label: "Login" },
                { href: "#about", label: "About Us" },
                { href: "#contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-all duration-300 inline-flex items-center gap-1.5 text-xs sm:text-sm group"
                  >
                    {link.label}
                    <ExternalLink className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-70 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-card-foreground mb-3 sm:mb-4 lg:mb-5 text-xs sm:text-sm uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-2.5 sm:space-y-3 lg:space-y-4">
              <li className="flex items-start gap-2 sm:gap-2.5 lg:gap-3 text-muted-foreground group">
                <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-md sm:rounded-lg bg-primary/10 dark:bg-primary/25 flex items-center justify-center shrink-0 group-hover:bg-primary/15 dark:group-hover:bg-primary/35 transition-colors border border-transparent dark:border-primary/30">
                  <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-primary" />
                </div>
                <span className="text-[10px] sm:text-xs lg:text-sm leading-relaxed pt-1 sm:pt-1.5">
                  Surigao del Sur, Philippines
                </span>
              </li>
              <li className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 text-muted-foreground group">
                <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-md sm:rounded-lg bg-primary/10 dark:bg-primary/25 flex items-center justify-center shrink-0 group-hover:bg-primary/15 dark:group-hover:bg-primary/35 transition-colors border border-transparent dark:border-primary/30">
                  <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-primary" />
                </div>
                <span className="text-[10px] sm:text-xs lg:text-sm">+63 123 456 7890</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 text-muted-foreground group">
                <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-md sm:rounded-lg bg-primary/10 dark:bg-primary/25 flex items-center justify-center shrink-0 group-hover:bg-primary/15 dark:group-hover:bg-primary/35 transition-colors border border-transparent dark:border-primary/30">
                  <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-primary" />
                </div>
                <span className="text-[10px] sm:text-xs lg:text-sm">info@nemsu.edu.ph</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 dark:border-border mt-8 sm:mt-10 lg:mt-14 xl:mt-16 pt-5 sm:pt-6 lg:pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 lg:gap-4 text-center sm:text-left">
            <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground">
              © 2025 NEMSUTalks. North Eastern Mindanao State University.
            </p>
            <p className="text-[9px] sm:text-[10px] lg:text-xs text-muted-foreground/60 flex items-center gap-1 sm:gap-1.5">
              Made with{" "}
              <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-destructive fill-destructive animate-pulse-soft" /> for
              NEMSU Students
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
