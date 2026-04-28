"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";

interface Articulo {
  id: string;
  slug: string;
  titulo: string;
  tituloEn: string | null;
  resumen: string;
  resumenEn: string | null;
  imagen: string | null;
  tags: string[];
  publicadoEn: Date | null;
  creadoEn: Date;
}

export function BlogListView({ articulos }: { articulos: Articulo[] }) {
  const { t, lang } = useLang();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#6c63ff]">{t.blog.label}</span>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">{t.blog.title}</h1>
        <p className="mt-3 text-muted-foreground max-w-xl">
          {t.blog.pageSubtitle}
        </p>
      </div>

      {articulos.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <p className="text-lg">
            {lang === "es"
              ? "Próximamente publicaremos nuestros primeros artículos."
              : "Our first articles are coming soon."}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articulos.map((articulo) => {
            const fecha = articulo.publicadoEn ?? articulo.creadoEn;
            const locale = lang === "es" ? "es-CL" : "en-US";
            const fechaStr = new Date(fecha).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
            const titulo = lang === "en" && articulo.tituloEn ? articulo.tituloEn : articulo.titulo;
            const resumen = lang === "en" && articulo.resumenEn ? articulo.resumenEn : articulo.resumen;
            return (
              <article key={articulo.id} className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-[#6c63ff]/40 hover:shadow-lg hover:shadow-[#6c63ff]/5 transition-all duration-300">
                {articulo.imagen ? (
                  <div className="h-48 overflow-hidden">
                    <Image src={articulo.imagen} alt={titulo} width={600} height={192} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-[#6c63ff]/20 to-[#a78bfa]/10 flex items-center justify-center">
                    <span className="text-6xl">📄</span>
                  </div>
                )}

                <div className="p-6">
                  {articulo.tags.length > 0 && (
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {articulo.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#6c63ff]/10 text-[#a78bfa]">{tag}</span>
                      ))}
                    </div>
                  )}

                  <h2 className="font-semibold text-base leading-snug mb-2 line-clamp-2 group-hover:text-[#6c63ff] transition-colors">
                    <Link href={`/blog/${articulo.slug}`}>{titulo}</Link>
                  </h2>

                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{resumen}</p>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      {fechaStr}
                    </div>
                    <Link href={`/blog/${articulo.slug}`} className="text-xs text-[#6c63ff] font-medium hover:underline">
                      {t.blog.readMore} →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
