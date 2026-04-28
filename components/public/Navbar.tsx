"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { SoftlinkLogo3D } from "./SoftlinkLogo3D";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { lang, setLang, t } = useLang();

  const NAV_LINKS = [
    { label: t.nav.products, href: "/#productos" },
    { label: t.nav.team, href: "/#equipo" },
    { label: t.nav.pricing, href: "/#precios" },
    { label: t.nav.blog, href: "/#blog" },
    { label: t.nav.contact, href: "/#contacto" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <SoftlinkLogo3D />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language toggle */}
            <div className="flex items-center text-xs font-medium text-muted-foreground">
              <button
                onClick={() => setLang("es")}
                className={cn(
                  "hover:text-foreground transition-colors",
                  lang === "es" && "text-foreground font-semibold"
                )}
              >
                ES
              </button>
              <span className="mx-1 opacity-40">|</span>
              <button
                onClick={() => setLang("en")}
                className={cn(
                  "hover:text-foreground transition-colors",
                  lang === "en" && "text-foreground font-semibold"
                )}
              >
                EN
              </button>
            </div>

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {resolvedTheme === "dark" ? (
                    <motion.span
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Sun size={16} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Moon size={16} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )}

            {/* CTA */}
            <Link
              href="/#contacto"
              className={cn(
                buttonVariants({ size: "sm" }),
                "bg-[#6c63ff] hover:bg-[#5b53e6] text-white font-medium"
              )}
            >
              {t.nav.requestDemo}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 45, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={20} />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -45, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-background/95 backdrop-blur-md border-b border-border"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <div className="flex items-center text-xs font-medium text-muted-foreground gap-2">
                  <button
                    onClick={() => setLang("es")}
                    className={cn(
                      "hover:text-foreground transition-colors",
                      lang === "es" && "text-foreground font-semibold"
                    )}
                  >
                    ES
                  </button>
                  <span className="opacity-40">|</span>
                  <button
                    onClick={() => setLang("en")}
                    className={cn(
                      "hover:text-foreground transition-colors",
                      lang === "en" && "text-foreground font-semibold"
                    )}
                  >
                    EN
                  </button>
                  {mounted && (
                    <button
                      onClick={toggleTheme}
                      className="ml-2 p-1.5 rounded-lg hover:bg-accent transition-colors"
                    >
                      {resolvedTheme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                    </button>
                  )}
                </div>
                <Link
                  href="/#contacto"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "bg-[#6c63ff] hover:bg-[#5b53e6] text-white"
                  )}
                >
                  {t.nav.requestDemo}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
