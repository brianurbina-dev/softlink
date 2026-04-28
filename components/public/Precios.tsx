"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useLang } from "@/components/providers/lang-provider";

function formatCLP(n: number) {
  return n.toLocaleString("es-CL");
}

export function Precios() {
  const [anual, setAnual] = useState(false);
  const { t } = useLang();

  const PLANES = [
    {
      key: "basic" as const,
      nombre: t.pricing.basic.name,
      precio: 19990,
      precioAnual: 15990,
      descripcion: t.pricing.basic.description,
      destacado: false,
      cta: t.pricing.basic.cta,
      features: [
        { texto: t.pricing.basic.f1, incluido: true },
        { texto: t.pricing.basic.f2, incluido: true },
        { texto: t.pricing.basic.f3, incluido: true },
        { texto: t.pricing.basic.f4, incluido: true },
        { texto: t.pricing.basic.f5, incluido: false },
        { texto: t.pricing.basic.f6, incluido: false },
        { texto: t.pricing.basic.f7, incluido: false },
      ],
    },
    {
      key: "pro" as const,
      nombre: t.pricing.pro.name,
      precio: 49990,
      precioAnual: 39990,
      descripcion: t.pricing.pro.description,
      destacado: true,
      cta: t.pricing.pro.cta,
      features: [
        { texto: t.pricing.pro.f1, incluido: true },
        { texto: t.pricing.pro.f2, incluido: true },
        { texto: t.pricing.pro.f3, incluido: true },
        { texto: t.pricing.pro.f4, incluido: true },
        { texto: t.pricing.pro.f5, incluido: true },
        { texto: t.pricing.pro.f6, incluido: false },
        { texto: t.pricing.pro.f7, incluido: false },
      ],
    },
    {
      key: "enterprise" as const,
      nombre: t.pricing.enterprise.name,
      precio: 99990,
      precioAnual: 79990,
      descripcion: t.pricing.enterprise.description,
      destacado: false,
      cta: t.pricing.enterprise.cta,
      features: [
        { texto: t.pricing.enterprise.f1, incluido: true },
        { texto: t.pricing.enterprise.f2, incluido: true },
        { texto: t.pricing.enterprise.f3, incluido: true },
        { texto: t.pricing.enterprise.f4, incluido: true },
        { texto: t.pricing.enterprise.f5, incluido: true },
        { texto: t.pricing.enterprise.f6, incluido: true },
        { texto: t.pricing.enterprise.f7, incluido: true },
      ],
    },
  ];

  return (
    <section id="precios" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-[#6c63ff]">
            {t.pricing.label}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            {t.pricing.title}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            {t.pricing.subtitle}
          </p>

          {/* Toggle mensual/anual */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-border bg-card px-1.5 py-1.5">
            <button
              onClick={() => setAnual(false)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                !anual
                  ? "bg-[#6c63ff] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.pricing.monthly}
            </button>
            <button
              onClick={() => setAnual(true)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all flex items-center gap-2",
                anual
                  ? "bg-[#6c63ff] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.pricing.annual}
              <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded-full font-semibold">
                -20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-3 gap-5 items-stretch">
          {PLANES.map((plan, i) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                "relative flex flex-col rounded-2xl border p-6 transition-all",
                plan.destacado
                  ? "border-[#6c63ff] bg-[#6c63ff]/5 shadow-xl shadow-[#6c63ff]/10 scale-[1.02]"
                  : "border-border bg-card"
              )}
            >
              {plan.destacado && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#6c63ff] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {t.pricing.popular}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold">{plan.nombre}</h3>
                <p className="text-xs text-muted-foreground mt-1">{plan.descripcion}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold tabular-nums">
                    ${formatCLP(anual ? plan.precioAnual : plan.precio)}
                  </span>
                  <span className="text-sm text-muted-foreground mb-0.5">{t.pricing.perMonth}</span>
                </div>
                {anual && (
                  <p className="text-xs text-emerald-500 mt-1">
                    {t.pricing.savePerYear.replace("${amount}", formatCLP((plan.precio - plan.precioAnual) * 12))}
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f.texto} className="flex items-start gap-2 text-sm">
                    {f.incluido ? (
                      <Check size={14} className="text-[#6c63ff] mt-0.5 shrink-0" />
                    ) : (
                      <X size={14} className="text-muted-foreground/40 mt-0.5 shrink-0" />
                    )}
                    <span className={f.incluido ? "text-foreground" : "text-muted-foreground/50"}>
                      {f.texto}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/#contacto"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "w-full justify-center text-sm font-medium",
                  plan.destacado
                    ? "bg-[#6c63ff] hover:bg-[#5b53e6] text-white"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                )}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          {t.pricing.footer}
        </p>
      </div>
    </section>
  );
}
