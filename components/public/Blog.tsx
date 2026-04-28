"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLang } from "@/components/providers/lang-provider";

interface Articulo {
  id: string;
  slug: string;
  titulo: string;
  tituloEn?: string | null;
  resumen: string;
  resumenEn?: string | null;
  imagen?: string | null;
  tags: string[];
  publicadoEn?: string | null;
  creadoEn: string;
}

const CARD_GRADIENTS = [
  "from-[#6c63ff]/20 to-[#a78bfa]/10",
  "from-emerald-500/20 to-teal-500/10",
  "from-amber-500/20 to-orange-500/10",
];
const EMOJIS = ["🚀", "💡", "⚡", "📊", "🎯", "🌐"];

export function Blog({ articulos }: { articulos: Articulo[] }) {
  const { t, lang } = useLang();
  if (articulos.length === 0) return null;

  return (
    <section id="blog" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#6c63ff]">{t.blog.label}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">{t.blog.title}</h2>
          </div>
          <Link
            href="/blog"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "group gap-2 shrink-0 border-border hover:border-[#6c63ff]/50 hover:text-[#6c63ff]"
            )}
          >
            {t.blog.viewAll}
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articulos.map((articulo, i) => {
            const fecha = articulo.publicadoEn ?? articulo.creadoEn;
            const locale = lang === "es" ? "es-CL" : "en-US";
            const fechaStr = new Date(fecha).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
            const titulo = lang === "en" && articulo.tituloEn ? articulo.tituloEn : articulo.titulo;
            const resumen = lang === "en" && articulo.resumenEn ? articulo.resumenEn : articulo.resumen;
            return (
              <motion.article
                key={articulo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-[#6c63ff]/40 hover:shadow-lg hover:shadow-[#6c63ff]/5 transition-all duration-300"
              >
                {articulo.imagen ? (
                  <div className="h-40 overflow-hidden">
                    <Image src={articulo.imagen} alt={articulo.titulo} width={600} height={160} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className={`h-40 bg-gradient-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]} flex items-center justify-center text-5xl`}>
                    {EMOJIS[i % EMOJIS.length]}
                  </div>
                )}

                <div className="p-5">
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {articulo.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#6c63ff]/10 text-[#a78bfa]">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[#6c63ff] transition-colors">
                    <Link href={`/blog/${articulo.slug}`}>{titulo}</Link>
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{resumen}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Calendar size={11} />
                      {fechaStr}
                    </div>
                    <Link href={`/blog/${articulo.slug}`} className="text-[11px] text-[#6c63ff] font-medium flex items-center gap-1 hover:gap-2 transition-all">
                      {t.blog.readMore} <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
