import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { Hero } from "@/components/public/Hero";
import { Stats } from "@/components/public/Stats";
import { Productos } from "@/components/public/Productos";
import { Equipo } from "@/components/public/Equipo";
import { Precios } from "@/components/public/Precios";
import { Testimonios } from "@/components/public/Testimonios";
import { Blog } from "@/components/public/Blog";
import { Contacto } from "@/components/public/Contacto";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const productosRaw: Producto[] = await prisma.producto.findMany({ where: { activo: true }, orderBy: { creadoEn: "asc" } });
  const integrantesRaw: Integrante[] = await prisma.integrante.findMany({ where: { activo: true }, orderBy: { orden: "asc" } });
  const testimoniosRaw: Testimonio[] = await prisma.testimonio.findMany({ where: { activo: true }, orderBy: { orden: "asc" } });
  const articulosRaw: Articulo[] = await prisma.articulo.findMany({ where: { publicado: true }, orderBy: { publicadoEn: "desc" }, take: 3 });

  const productos = productosRaw.map(p => ({ ...p, creadoEn: p.creadoEn.toISOString() }));
  const integrantes = integrantesRaw.map(i => ({ ...i, creadoEn: i.creadoEn.toISOString() }));
  const testimonios = testimoniosRaw.map(t => ({ ...t, creadoEn: t.creadoEn.toISOString() }));
  const articulos = articulosRaw.map(a => ({
    ...a,
    creadoEn: a.creadoEn.toISOString(),
    publicadoEn: a.publicadoEn?.toISOString() ?? null,
    updatedAt: a.updatedAt.toISOString(),
  }));

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Productos productos={productos} />
        <Equipo integrantes={integrantes} />
        <Precios />
        <Testimonios testimonios={testimonios} />
        <Blog articulos={articulos} />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}
