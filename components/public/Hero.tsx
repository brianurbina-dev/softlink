"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeroParticles } from "./HeroParticles";
import { HeroMockup } from "./HeroMockup";
import { useLang } from "@/components/providers/lang-provider";

const stagger = {
  container: {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  },
};

export function Hero() {
  const { t } = useLang();
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden bg-background"
    >
      {/* Animated grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(rgba(108, 99, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(108, 99, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* Radial glow top-left */}
      <div
        className="absolute -top-40 -left-40 size-[600px] rounded-full bg-[#6c63ff]/10 blur-3xl pointer-events-none"
        aria-hidden
      />
      {/* Radial glow bottom-right */}
      <div
        className="absolute -bottom-40 -right-40 size-[400px] rounded-full bg-[#a78bfa]/10 blur-3xl pointer-events-none"
        aria-hidden
      />

      {/* Canvas particles */}
      <HeroParticles />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-screen lg:min-h-[unset] lg:py-32">
          {/* Left column — text */}
          <motion.div
            variants={stagger.container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6 text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div variants={stagger.item} className="flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#6c63ff]/30 bg-[#6c63ff]/5 px-4 py-1.5 text-sm text-[#a78bfa]">
                <Sparkles size={13} className="text-[#6c63ff]" />
                {t.hero.badge}
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              variants={stagger.item}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
            >
              {t.hero.h1a}{" "}
              <span className="relative">
                <span className="text-[#6c63ff]">{t.hero.h1Highlight}</span>{" "}
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-[#6c63ff] to-[#a78bfa] rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                  style={{ transformOrigin: "left" }}
                />
              </span>
              {t.hero.h1b}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={stagger.item}
              className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              {t.hero.subtitle}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={stagger.item}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Link
                href="#productos"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-[#6c63ff] hover:bg-[#5b53e6] text-white font-medium px-6 h-11 text-sm"
                )}
              >
                {t.hero.cta1}
              </Link>
              <Link
                href="#contacto"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "group gap-2 px-6 h-11 text-sm border-border hover:border-[#6c63ff]/50 hover:text-[#6c63ff]"
                )}
              >
                {t.hero.cta2}
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={stagger.item}
              className="flex items-center gap-4 justify-center lg:justify-start"
            >
              <div className="flex -space-x-2">
                {["B", "R", "M"].map((l) => (
                  <div
                    key={l}
                    className="size-8 rounded-full bg-gradient-to-br from-[#6c63ff] to-[#a78bfa] border-2 border-background flex items-center justify-center text-[10px] font-bold text-white"
                  >
                    {l}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {t.hero.socialProof}
              </p>
            </motion.div>
          </motion.div>

          {/* Right column — mockup */}
          <div className="flex justify-center lg:justify-end">
            <HeroMockup />
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
