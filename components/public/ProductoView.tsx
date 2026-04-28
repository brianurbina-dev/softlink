"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Star } from "lucide-react";
import { DemoModalButton } from "./DemoModalButton";
import { useLang } from "@/components/providers/lang-provider";
import type { EstadoProducto } from "@/types";

interface Producto {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  descripcionEn: string | null;
  descripcionLarga: string | null;
  descripcionLargaEn: string | null;
  imagen: string | null;
  screenshots: string[];
  estado: EstadoProducto;
  demoUrl: string | null;
  precio: number | null;
  tipoPrecio: string | null;
  tecnologias: string[];
  destacado: boolean;
}

export function ProductoView({ producto }: { producto: Producto }) {
  const { t, lang } = useLang();
  const descripcion = lang === "en" && producto.descripcionEn ? producto.descripcionEn : producto.descripcion;
  const descripcionLarga = lang === "en" && producto.descripcionLargaEn ? producto.descripcionLargaEn : producto.descripcionLarga;

  const ESTADO_CONFIG: Record<EstadoProducto, { label: string; className: string }> = {
    disponible: { label: t.catalog.available, className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    en_desarrollo: { label: t.catalog.inDevelopment, className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
    proximamente: { label: t.catalog.comingSoon, className: "bg-slate-500/10 text-slate-400 border-border" },
  };

  const estadoConfig = ESTADO_CONFIG[producto.estado];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link href="/#productos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft size={14} /> {t.productPage.backLink}
      </Link>

      {/* Hero del producto */}
      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${estadoConfig.className}`}>
              {estadoConfig.label}
            </span>
            {producto.destacado && (
              <span className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                <Star size={12} className="fill-amber-500" /> {t.productPage.featured}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{producto.nombre}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">{descripcion}</p>

          {/* Precio */}
          {producto.precio && (
            <div className="mb-6">
              <span className="text-3xl font-bold text-[#6c63ff]">
                ${producto.precio.toLocaleString("es-CL")}
              </span>
              {producto.tipoPrecio && (
                <span className="text-muted-foreground text-sm ml-2">/ {producto.tipoPrecio}</span>
              )}
            </div>
          )}

          {/* Tecnologías */}
          {producto.tecnologias.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {producto.tecnologias.map(tech => (
                <span key={tech} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground border border-border">{tech}</span>
              ))}
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            {producto.estado === "disponible" ? (
              <>
                <DemoModalButton
                  productoId={producto.id}
                  productoNombre={producto.nombre}
                  label={t.demo.defaultLabel}
                />
                {producto.demoUrl && (
                  <a href={producto.demoUrl} target="_blank" rel="noreferrer"
                    className="border border-border hover:border-[#6c63ff]/50 text-sm font-medium px-6 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2">
                    Ver demo <ExternalLink size={13} />
                  </a>
                )}
              </>
            ) : (
              <DemoModalButton
                productoId={producto.id}
                productoNombre={producto.nombre}
                label={t.demo.notifyLabel}
                variant="outline"
              />
            )}
          </div>
        </div>

        {/* Imagen */}
        <div className="flex items-start">
          {producto.imagen ? (
            <div className="w-full rounded-2xl overflow-hidden border border-border shadow-xl">
              <Image src={producto.imagen} alt={producto.nombre} width={600} height={400} className="object-cover w-full" />
            </div>
          ) : (
            <div className="w-full h-72 rounded-2xl bg-gradient-to-br from-[#6c63ff]/20 to-[#a78bfa]/10 flex items-center justify-center border border-border">
              <span className="text-8xl font-bold text-[#6c63ff]/30">{producto.nombre[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Descripción larga */}
      {descripcionLarga && (
        <div className="mb-16 border-t border-border pt-12">
          <h2 className="text-2xl font-semibold mb-6">
            {t.productPage.aboutTitle.replace("{name}", producto.nombre)}
          </h2>
          <div className="prose text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {descripcionLarga}
          </div>
        </div>
      )}

      {/* Screenshots */}
      {producto.screenshots.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">{t.productPage.screenshotsTitle}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {producto.screenshots.map((src, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-border">
                <Image src={src} alt={`Screenshot ${i + 1}`} width={600} height={350} className="object-cover w-full" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA final */}
      <div className="rounded-2xl border border-[#6c63ff]/20 bg-[#6c63ff]/5 p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">
          {producto.estado === "disponible"
            ? t.productPage.ctaAvailableTitle.replace("{name}", producto.nombre)
            : t.productPage.ctaUnavailableTitle.replace("{name}", producto.nombre)}
        </h3>
        <p className="text-muted-foreground mb-5">
          {producto.estado === "disponible"
            ? t.productPage.ctaAvailableText
            : t.productPage.ctaUnavailableText}
        </p>
        <DemoModalButton
          productoId={producto.id}
          productoNombre={producto.nombre}
          label={producto.estado === "disponible" ? t.demo.freeLabel : t.demo.notifyLabel}
          className="inline-flex items-center gap-2 bg-[#6c63ff] hover:bg-[#5b52e0] text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
        />
      </div>
    </div>
  );
}
