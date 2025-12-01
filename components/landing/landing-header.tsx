"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace("#", "")
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setMobileMenuOpen(false)
  }

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#features", label: "Features" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "glass-effect border-b border-border/50 dark:border-border shadow-lg shadow-primary/5 dark:shadow-primary/10"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="container mx-auto flex h-14 sm:h-16 md:h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 dark:bg-primary/30 rounded-full blur-lg scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Image
              src="/images/nemsu-logo.png"
              alt="NEMSU Logo"
              width={44}
              height={44}
              className="relative rounded-full ring-2 ring-primary/30 dark:ring-primary/50 group-hover:ring-primary/60 transition-all duration-300 shadow-md w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 object-cover bg-white"
              priority
            />
          </div>
          <span className="text-base sm:text-lg lg:text-xl font-bold text-foreground tracking-tight">NEMSUTalks</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className="relative px-3 lg:px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 rounded-xl hover:bg-secondary/60 dark:hover:bg-secondary/80 group cursor-pointer"
            >
              {link.label}
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full group-hover:w-6 transition-all duration-300" />
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center">
          <Button
            asChild
            className="shadow-lg shadow-primary/20 dark:shadow-primary/30 hover:shadow-xl hover:shadow-primary/30 dark:hover:shadow-primary/40 transition-all duration-300 rounded-xl h-9 lg:h-10 px-5 lg:px-6 text-sm"
          >
            <Link href="/login">Login</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 sm:p-2.5 rounded-xl hover:bg-secondary/60 dark:hover:bg-secondary/80 transition-all duration-300 active:scale-95"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="relative w-5 h-5">
            <Menu
              className={cn(
                "absolute inset-0 h-5 w-5 text-foreground transition-all duration-300",
                mobileMenuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0",
              )}
            />
            <X
              className={cn(
                "absolute inset-0 h-5 w-5 text-foreground transition-all duration-300",
                mobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90",
              )}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-400 ease-out",
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="glass-effect border-t border-border/50 dark:border-border p-3 sm:p-4 space-y-1">
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className={cn(
                "flex items-center px-4 py-3 text-sm sm:text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 dark:hover:bg-secondary/80 rounded-xl transition-all duration-300 active:scale-[0.98] cursor-pointer",
                mobileMenuOpen && "animate-fade-in-up",
              )}
              style={{ animationDelay: `${index * 75}ms` }}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 mt-2 border-t border-border/50 dark:border-border">
            <Button
              asChild
              className="w-full h-11 sm:h-12 rounded-xl shadow-lg shadow-primary/20 dark:shadow-primary/30 text-sm sm:text-base"
            >
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
