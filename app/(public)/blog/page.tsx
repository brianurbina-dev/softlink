import { prisma } from "@/lib/prisma";
import { BlogListView } from "@/components/public/BlogListView";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Blog",
  description: "Artículos sobre transformación digital, software SaaS y tecnología para PYMEs chilenas.",
};

export default async function BlogPage() {
  const articulos = await prisma.articulo.findMany({
    where: { publicado: true },
    orderBy: { publicadoEn: "desc" },
    select: {
      id: true,
      slug: true,
      titulo: true,
      tituloEn: true,
      resumen: true,
      resumenEn: true,
      imagen: true,
      tags: true,
      publicadoEn: true,
      creadoEn: true,
    },
  });

  return <BlogListView articulos={articulos} />;
}
