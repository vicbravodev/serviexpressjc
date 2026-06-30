"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Image from "next/image"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeLink, setActiveLink] = useState("")

  useEffect(() => {
    // Drive the "scrolled" state from an off-screen sentinel rather than a
    // scroll listener — no per-frame React re-renders, no jank.
    const sentinel = document.createElement("div")
    sentinel.style.cssText = "position:absolute;top:20px;left:0;width:1px;height:1px;pointer-events:none;"
    document.body.prepend(sentinel)

    const observer = new IntersectionObserver(([entry]) => setIsScrolled(!entry.isIntersecting), {
      threshold: 0,
    })
    observer.observe(sentinel)

    return () => {
      observer.disconnect()
      sentinel.remove()
    }
  }, [])

  const navItems = [
    { label: "Inicio", href: "#inicio" },
    { label: "Quiénes Somos", href: "#quienes-somos" },
    { label: "Servicios", href: "#servicios" },
    { label: "Cobertura", href: "#cobertura" },
    { label: "Clientes", href: "#clientes" },
  ]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setActiveLink(href)

    const targetId = href.replace("#", "")
    const element = document.getElementById(targetId)

    if (element) {
      const offset = 100 // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }

    // Reset active state after animation
    setTimeout(() => setActiveLink(""), 400)
  }

  // Solid chrome when scrolled or when the mobile menu is open; otherwise the
  // header floats transparently over the dark hero video and needs light text.
  const solid = isScrolled || isMobileMenuOpen

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow] duration-300 ease-out ${
        solid ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-white-bg.png"
              alt="ServiExpress JC"
              width={200}
              height={70}
              className="h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`relative text-base font-medium transition-colors duration-300 group ${
                  solid ? "text-foreground/80 hover:text-foreground" : "text-white/85 hover:text-white"
                } ${activeLink === item.href ? "animate-pulse-glow" : ""}`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-yellow-accent transition-all duration-300 ${
                    activeLink === item.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="outline"
              size="lg"
              asChild
              className={`bg-transparent hover:border-yellow-accent hover:text-yellow-accent ${
                solid ? "" : "text-white border-white/40 hover:bg-white/10"
              }`}
            >
              <Link href="#postulate">Postúlate</Link>
            </Button>
            <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90 relative overflow-hidden group">
              <Link href="#cotizacion">
                <span className="relative z-10">Cotización</span>
                <span className="absolute inset-0 bg-yellow-accent/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 transition-colors duration-300 ${solid ? "text-foreground" : "text-white"}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 border-t border-border animate-slide-in">
            <nav className="flex flex-col gap-5">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-base font-medium text-foreground/80 hover:text-foreground transition-colors py-3 group ${
                    activeLink === item.href ? "text-yellow-accent" : ""
                  }`}
                  onClick={(e) => {
                    handleNavClick(e, item.href)
                    setIsMobileMenuOpen(false)
                  }}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.label}
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-yellow-accent rounded-r transition-opacity ${
                      activeLink === item.href ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="hover:border-yellow-accent hover:text-yellow-accent bg-transparent"
                >
                  <Link href="#postulate">Postúlate</Link>
                </Button>
                <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90">
                  <Link href="#cotizacion">Cotización</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
