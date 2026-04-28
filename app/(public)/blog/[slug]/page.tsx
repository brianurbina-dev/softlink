import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { BlogArticleView } from "@/components/public/BlogArticleView";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const articulo = await prisma.articulo.findUnique({ where: { slug } });
  if (!articulo) return { title: "Artículo no encontrado | Softlink" };
  return {
    title: `${articulo.titulo} | Blog Softlink`,
    description: articulo.resumen,
    openGraph: {
      title: articulo.titulo,
      description: articulo.resumen,
      images: articulo.imagen ? [articulo.imagen] : [],
    },
  };
}

export default async function ArticuloPage({ params }: Props) {
  const { slug } = await params;
  const articulo = await prisma.articulo.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      titulo: true,
      tituloEn: true,
      resumen: true,
      resumenEn: true,
      contenido: true,
      contenidoEn: true,
      imagen: true,
      tags: true,
      publicado: true,
      publicadoEn: true,
      creadoEn: true,
    },
  });

  if (!articulo || !articulo.publicado) notFound();

  const otros = await prisma.articulo.findMany({
    where: { publicado: true, id: { not: articulo.id } },
    orderBy: { publicadoEn: "desc" },
    take: 3,
    select: {
      id: true,
      slug: true,
      titulo: true,
      tituloEn: true,
      tags: true,
    },
  });

  return <BlogArticleView articulo={articulo} otros={otros} />;
}
