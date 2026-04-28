"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import type { EstadoProducto } from "@/types";
import { useLang } from "@/components/providers/lang-provider";

interface Producto {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  descripcionEn?: string | null;
  tecnologias: string[];
  estado: EstadoProducto;
}

export function Productos({ productos }: { productos: Producto[] }) {
  const { t, lang } = useLang();

  const ESTADO_CONFIG: Record<EstadoProducto, { label: string; className: string }> = {
    disponible: { label: t.catalog.available, className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    en_desarrollo: { label: t.catalog.inDevelopment, className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
    proximamente: { label: t.catalog.comingSoon, className: "bg-white/5 text-muted-foreground border-border" },
  };

  return (
    <section id="productos" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-[#6c63ff]">
            {t.catalog.label}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            {t.catalog.title}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            {t.catalog.subtitle}
          </p>
        </motion.div>

        <div className={`grid sm:grid-cols-2 ${productos.length > 2 ? "lg:grid-cols-4" : "lg:grid-cols-2 max-w-3xl mx-auto"} gap-5`}>
          {productos.map((producto, i) => {
            const estado = ESTADO_CONFIG[producto.estado];
            const inicial = producto.nombre[0].toUpperCase();
            const descripcion = lang === "en" && producto.descripcionEn ? producto.descripcionEn : producto.descripcion;
            return (
              <motion.div
                key={producto.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative flex flex-col rounded-xl border border-border bg-card p-5 hover:border-[#6c63ff]/50 hover:shadow-lg hover:shadow-[#6c63ff]/5 transition-all duration-300"
              >
                <div className="mb-4 size-10 rounded-lg bg-[#6c63ff]/10 text-[#6c63ff] flex items-center justify-center font-bold text-base group-hover:bg-[#6c63ff]/20 transition-colors">
                  {inicial}
                </div>

                <Badge
                  className={cn(
                    "self-start mb-3 text-[10px] font-medium border px-2 py-0.5 rounded-full",
                    estado.className
                  )}
                >
                  {estado.label}
                </Badge>

                <h3 className="font-semibold text-base mb-2">{producto.nombre}</h3>

                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {descripcion}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {producto.tecnologias.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-border">
                  {producto.estado === "disponible" ? (
                    <Link
                      href={`/productos/${producto.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm text-[#6c63ff] font-medium hover:gap-2.5 transition-all"
                    >
                      {t.catalog.viewProduct}
                      <ArrowRight size={13} />
                    </Link>
                  ) : (
                    <Link
                      href="/#contacto"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t.catalog.notifyMe}
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
