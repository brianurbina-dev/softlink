"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";

interface Articulo {
  id: string;
  slug: string;
  titulo: string;
  tituloEn: string | null;
  resumen: string;
  resumenEn: string | null;
  contenido: string;
  contenidoEn: string | null;
  imagen: string | null;
  tags: string[];
  publicadoEn: Date | null;
  creadoEn: Date;
}

interface OtroArticulo {
  id: string;
  slug: string;
  titulo: string;
  tituloEn: string | null;
  tags: string[];
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    if (line.startsWith("# ")) {
      elements.push(<h1 key={key++} className="text-3xl font-bold mt-8 mb-4 first:mt-0">{line.slice(2)}</h1>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={key++} className="text-2xl font-semibold mt-8 mb-3">{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={key++} className="text-lg font-semibold mt-6 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith("- ")) {
      elements.push(<li key={key++} className="text-muted-foreground leading-relaxed ml-4 list-disc">{renderInline(line.slice(2))}</li>);
    } else if (line.match(/^\d+\. /)) {
      elements.push(<li key={key++} className="text-muted-foreground leading-relaxed ml-4 list-decimal">{renderInline(line.replace(/^\d+\. /, ""))}</li>);
    } else if (line.trim() === "") {
      elements.push(<div key={key++} className="h-2" />);
    } else {
      elements.push(<p key={key++} className="text-muted-foreground leading-relaxed">{renderInline(line)}</p>);
    }
  }
  return elements;
}

export function BlogArticleView({ articulo, otros }: { articulo: Articulo; otros: OtroArticulo[] }) {
  const { t, lang } = useLang();

  const titulo = lang === "en" && articulo.tituloEn ? articulo.tituloEn : articulo.titulo;
  const resumen = lang === "en" && articulo.resumenEn ? articulo.resumenEn : articulo.resumen;
  const contenido = lang === "en" && articulo.contenidoEn ? articulo.contenidoEn : articulo.contenido;

  const fecha = articulo.publicadoEn ?? articulo.creadoEn;
  const locale = lang === "es" ? "es-CL" : "en-US";
  const fechaStr = new Date(fecha).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft size={14} /> {t.blog.backToBlog}
      </Link>

      {/* Header */}
      <header className="mb-10">
        {articulo.tags.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {articulo.tags.map(tag => (
              <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#6c63ff]/10 text-[#a78bfa]">{tag}</span>
            ))}
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">{titulo}</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-5">{resumen}</p>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar size={13} />
          {fechaStr}
        </div>
      </header>

      {/* Imagen destacada */}
      {articulo.imagen && (
        <div className="rounded-2xl overflow-hidden mb-10 border border-border">
          <Image src={articulo.imagen} alt={titulo} width={800} height={400} className="object-cover w-full" />
        </div>
      )}

      {/* Contenido */}
      <div className="prose-custom space-y-2 border-t border-border pt-8">
        {renderMarkdown(contenido)}
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-2xl border border-[#6c63ff]/20 bg-[#6c63ff]/5 p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">{t.blog.ctaTitle}</h3>
        <p className="text-muted-foreground mb-5">{t.blog.ctaText}</p>
        <Link href="/#contacto" className="inline-flex items-center gap-2 bg-[#6c63ff] hover:bg-[#5b52e0] text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm">
          {t.blog.ctaButton}
        </Link>
      </div>

      {/* Otros artículos */}
      {otros.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-semibold mb-6">{t.blog.relatedTitle}</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {otros.map(a => {
              const otroTitulo = lang === "en" && a.tituloEn ? a.tituloEn : a.titulo;
              return (
                <Link key={a.id} href={`/blog/${a.slug}`}
                  className="group rounded-xl border border-border bg-card p-4 hover:border-[#6c63ff]/40 transition-colors">
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {a.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#6c63ff]/10 text-[#a78bfa]">{tag}</span>
                    ))}
                  </div>
                  <p className="text-sm font-medium line-clamp-2 group-hover:text-[#6c63ff] transition-colors">{otroTitulo}</p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
